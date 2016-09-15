/// <reference path="../typings/vscode-typings.d.ts" />
'use strict';
import {Disposable,commands,ExtensionContext,window,workspace,StatusBarAlignment, StatusBarItem} from 'vscode';
import * as fs from 'fs';
import * as events from 'events';
import msg from './messages';
import * as settings from './settings';
import * as replacement from './replacement';
let extract = require('extract-zip');
let request = require('request');
let replace = require('replace-in-file');
let moment=require('moment');
let log=(()=>{
    let path=settings.getSettings().logPath;
    return (info:string)=>{
        fs.appendFileSync(path,moment().format("YYYY/MM/DD HH:mm:ss")+'\r\n'+info+'\r\n');
    }
})();
export function deactivate(){}
export function activate(context:ExtensionContext):void{

    console.log(msg.welcome);
    let eventEmitter = new events.EventEmitter();
    let vars = settings.getSettings();
    let installTurtle:Disposable;
    let uninstallTurtle:Disposable;
    let reinstallTurtle:Disposable;
    let updateTurtleResource:Disposable;

    function showAdminPrivilegesError() {
        window.showInformationMessage(msg.admin);
        let state = settings.getState();
        if (state.status === settings.status.enabled) {
            settings.deleteState();
        }
    }

    let btn=window.createStatusBarItem(StatusBarAlignment.Left,2147483647);
    btn.tooltip=msg.toggleSidebarTooltip;
    btn.text="$(togglesidebar)";
    btn.command='turtle.toggleSideBar';
    btn.show();

    let btnToggleToolbar=window.createStatusBarItem(StatusBarAlignment.Left,2147483647);
    btnToggleToolbar.tooltip=msg.toggleToolBarTooltip;
    btnToggleToolbar.text="$(togglesidebar)";
    btnToggleToolbar.command='turtle.toggleToolBar';
    btnToggleToolbar.show();

    process.on('uncaughtException', function (err) {
        if (/ENOENT|EACCES|EPERM/.test(err.code)) {
            showAdminPrivilegesError();
            return;
        }
    });
    function reloadWindow() {
        // reload vscode-window
        commands.executeCommand('workbench.action.reloadWindow');
    }
    function disabledRestart() {
        settings.setStatus(settings.status.disabled);
        window.showInformationMessage(msg.disabled);
        // .then(function () {
        //     reloadWindow();
        // });
    }
    function installItem(bakfile:string, orfile:string, cleanInstallFunc:()=>void) {
        fs.stat(bakfile, function (errBak, statsBak) {
            if (errBak) {
                // clean installation
                cleanInstallFunc();
            } else {
                fs.stat(orfile, function (errOr, statsOr) {
                    let updated = false;
                    if (errOr) {
                        window.showInformationMessage(msg.smthingwrong + errOr);
                    } else {
                        updated = hasBeenUpdated(statsBak, statsOr);
                        if (updated) {
                            // some update has occurred. clean install
                            cleanInstallFunc();
                        }
                    }
                });
            }
        });
    }
    function hasBeenUpdated(stats1, stats2):boolean {
        let dbak = new Date(stats1.ctime);
        let dor = new Date(stats2.ctime);
        let segs = timeDiff(dbak, dor) / 1000;
        return segs > 20;
    }
    function timeDiff(d1, d2):number {
        let diff:number = Math.abs(d2.getTime() - d1.getTime());
        return diff;
    }

    function cleanJsInstall() {
        let rs = fs.createReadStream(vars.jsfile).pipe(fs.createWriteStream(vars.jsfilebak));
        rs.on('finish', function () {
            replaceWorkbenchJs();
        });
    }

    function cleanMainJsInstall() {
        let rs = fs.createReadStream(vars.jsmainfile).pipe(fs.createWriteStream(vars.jsmainfilebak));
        rs.on('finish', function () {
            replaceCodeMainJs();
        });
    }

    function addResource() {
        let zipUrl ='https://github.com/make-in-china/vscode-turtle/blob/master/resource.zip?raw=true';
        let config:any = workspace.getConfiguration('vsturtle');
        let resourcePath = vars.base + (vars.isWin ? '\\resource.zip' : '/resource.zip');
        let rx = /^http.+/i;
        let r = null;
        if (config && config.resourceUrl) {
            zipUrl = config.resourceUrl;
        }

        if (rx.test(zipUrl)) {

            r = request(zipUrl).pipe(fs.createWriteStream(resourcePath));
        } else {
            r = fs.createReadStream(zipUrl).pipe(fs.createWriteStream(resourcePath));
        }

        r.on('finish', function () {
            extractIcons(resourcePath);
        });
    }

    function extractIcons(resourcePath) {
        extract(resourcePath, { dir: vars.base }, function (err) {
            // extraction is complete. make sure to handle the err
            if (err) console.log(err);
            // remove icon.zip
            fs.unlink(resourcePath, function (err1) {
                if (err1) {
                    console.log(err1);
                }
                window.showInformationMessage(msg.resourcesAreLoaded);
                    log(msg.resourcesAreLoaded);
                window.showInformationMessage(msg.enabled);
                // .then(function () {
                //     reloadWindow();
                // });
            });
        });
    }
    var sTop=replacement.getTop(vars);
    function replaceCodeMainJs(){

        replaceJs(vars.jsmainfile,/([a-z])\.createInstance\(([a-z])\.VSCodeMenu\)/,
`vsturtle.createVSCodeMenu(this,$1,$2.VSCodeMenu,b)`);
        replaceJs(vars.jsmainfile,/(\/\*\!----)/,replacement.getMain(sTop));
    }
    function replaceWorkbenchJs() {
        replaceJs(vars.jsfile,/this\.contentsContainer\=this\.createContents\([a-z]\.\$\(this\.content\)\)/,
`/*turtle hook open begin*/
            vsturtle.init(this,i,n,o,r)
/*turtle hook open end*/`);
        replaceJs(vars.jsfile,/(\/\*\!----)/,replacement.getWorkbench(sTop));
    }
    function replaceJs(filePath,jsreplace, jswith) {
        let changed = null;
        try {
            changed = replace({
                files: filePath,
                replace: jsreplace,
                with: jswith
            });
        } catch (error) {
            log(error);
        }
        return changed;
    }
    function emitEndUninstall() {
        eventEmitter.emit('endUninstall');
    }
    function restoredAction(restoredCount:number, willReinstall:boolean) {
        if (restoredCount === 2/**卸载成功文件数*/) {
            if (willReinstall) {
                emitEndUninstall();
            } else {
                disabledRestart();
            }
        }
    }

    function restoreBak(willReinstall:boolean):void {
        let restore = 0;
        let jsfile = null;
        let jsmainfile = null;

        fs.unlink(vars.jsfile, function (err) {
            if (err) {
                showAdminPrivilegesError();
                return;
            }
            jsfile = fs.createReadStream(vars.jsfilebak)
            .pipe(fs.createWriteStream(vars.jsfile));
            jsfile.on('finish', function () {
                window.showInformationMessage(msg.uninstallWorkBench);
                log(msg.uninstallWorkBench);
                fs.unlink(vars.jsfilebak);
                restore++;
                restoredAction(restore, willReinstall);
            });

        });
        fs.unlink(vars.jsmainfile, function (err) {
            if (err) {
                showAdminPrivilegesError();
                return;
            }
            jsmainfile = fs.createReadStream(vars.jsmainfilebak)
            .pipe(fs.createWriteStream(vars.jsmainfile));
            jsmainfile.on('finish', function () {
                window.showInformationMessage(msg.uninstallMain);
                log(msg.uninstallMain);
                fs.unlink(vars.jsmainfilebak);
                restore++;
                restoredAction(restore, willReinstall);
            });

        });
    }
    function fInstall() {
        if(state.status === settings.status.enabled){
            window.showInformationMessage(msg.isEnabled);
            return ;
        }
        window.showInformationMessage(msg.install);
        installItem(vars.jsmainfilebak, vars.jsmainfile, cleanMainJsInstall);
        installItem(vars.jsfilebak, vars.jsfile, cleanJsInstall);
        addResource();
        settings.setStatus(settings.status.enabled);
    }
    function fUninstallMain(willReinstall:boolean){
        fs.stat(vars.jsmainfilebak, function (errBak, statsBak) {
            if (errBak) {
                if (willReinstall) {
                    emitEndUninstall();
                } else {
                    window.showInformationMessage(msg.already_disabled);
                }
                return;
            }
            // checking if normal file has been udpated.
            fs.stat(vars.jsmainfile, function (errOr, statsOr) {
                let updated = false;
                if (errOr) {
                    window.showInformationMessage(msg.smthingwrong + errOr);
                } else {
                    updated = hasBeenUpdated(statsBak, statsOr);
                    if (updated) {
                        // some update has occurred. clean install
                        fs.unlink(vars.jsfilebak);
                        if (willReinstall) {
                            emitEndUninstall();
                        } else {
                            disabledRestart();
                        }
                    } else {
                        // restoring bak files
                        restoreBak(willReinstall);
                    }
                }
            });
        });
    }
    function fUninstall(willReinstall:boolean) {
        fs.stat(vars.jsfilebak, function (errBak, statsBak) {
            if (errBak) {
                if (willReinstall) {
                    emitEndUninstall();
                } else {
                    window.showInformationMessage(msg.already_disabled);
                }
                return;
            }
            // checking if normal file has been udpated.
            fs.stat(vars.jsfile, function (errOr, statsOr) {
                let updated = false;
                if (errOr) {
                    window.showInformationMessage(msg.smthingwrong + errOr);
                } else {
                    fUninstallMain(willReinstall);
                }
            });
        });
    }

    function fReinstall(){
        eventEmitter.once('endUninstall', fInstall);
        fUninstall(true);
    }

    installTurtle = commands.registerCommand('extension.installTurtle', fInstall);
    uninstallTurtle = commands.registerCommand('extension.uninstallTurtle', fUninstall);
    reinstallTurtle = commands.registerCommand('extension.reinstallTurtle', fReinstall);

    context.subscriptions.push(installTurtle);
    context.subscriptions.push(uninstallTurtle);
    context.subscriptions.push(reinstallTurtle);


    let state = settings.getState();
    if (state.status === settings.status.notInstalled) {
        fInstall();
    } else if (state.status === settings.status.enabled &&
        state.version !== vars.extVersion) {
        // auto-update
        fReinstall();
    }

}