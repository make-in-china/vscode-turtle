/// <reference path="../typings/node.d.ts" />
'use strict';
import {Disposable,commands,ExtensionContext,window,workspace} from 'vscode';
import * as fs from 'fs';
let extract = require('extract-zip');
let request = require('request');
let replace = require('replace-in-file');
import * as events from 'events';
import msg from './messages';
import * as settings from './settings';
export function deactivate(){
    
}
export function activate(context:ExtensionContext):void{
    let eventEmitter = new events.EventEmitter();
    let vars = settings.getSettings();
    let installTurtle:Disposable;
    let uninstallTurtle:Disposable;
    let reinstallTurtle:Disposable;
    let updateTurtleResource:Disposable;
    
    console.log('vscode-turtle is active!');
    function showAdminPrivilegesError() {
        window.showInformationMessage(msg.admin);
        let state = settings.getState();
        if (state.status === settings.status.enabled) {
            settings.deleteState();
        }
    }
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
        window.showInformationMessage(msg.disabled, { title: msg.restartIde })
        .then(function () {
            reloadWindow();
        });
    }
    function installItem(bakfile:string, orfile:string, cleanInstallFunc:()=>void) {
        fs.stat(bakfile, function (errBak, statsBak) {
            if (errBak) {
                // clean installation
                cleanInstallFunc();
            } else {
                // check cssfilebak's timestamp and compare it to the cssfile's.
                fs.stat(orfile, function (errOr, statsOr) {
                    console.log(orfile);
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
        let j = fs.createReadStream(vars.jsfile).pipe(fs.createWriteStream(vars.jsfilebak));
        j.on('finish', function () {
            replaceAllJs();
        });
    }
    function addResource() {
        let zipUrl ='https://github.com/make-in-china/vscode-turtle/blob/master/resource.zip?raw=true';
        let config:any = workspace.getConfiguration('vsicons');
        let resourcePath = vars.base + (vars.isWin ? '\\resource.zip' : '/resource.zip');
        let rx = /^http.+/i;
        let r = null;
        debugger;
        if (config && config.icons) {
            zipUrl = config.icons;
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
                window.showInformationMessage(msg.enabled, { title: msg.restartIde })
                .then(function () {
                    reloadWindow();
                });
            });
        });
    }

    function replaceAllJs() {
        replaceJs(/this\.contentsContainer\=this\.createContents\([a-z]\.\$\(this\.content\)\)/,        
`/*turtle hook open begin*/
            vsturtle.init(this,i,n,o,r,s,a,c,u,l,d,h,p,f,g,m,v,y,E,S,b,_,C,w,I,T,A,D,L,k,x,M,R,P,O,N,F,W,K,B,V,H,U,z,G,j,q,Y,$,X,Q,Z,J,ee,te,ie,ne,oe,re,se,ae,ce,ue,le,de)
/*turtle hook open end*/`);
        replaceJs(/^(.)/, 
`/*turtle hook global begin*/
vsturtle = {
    settingPath:'${vars.settingsPath.replace(/\\/g,'/')}',
    setting:null,
    workbenchShell:null,
    nls:null,
    platform:null,
    builder_1:null,
    dom:null,
    aria:null,
    lifecycle_1:null,
    errors:null,
    product_1:null,
    package_1:null,
    contextViewService_1:null,
    timer:null,
    workbench_1:null,
    storage_1:null,
    telemetry_1:null,
    telemetryIpc_1:null,
    telemetryService_1:null,
    idleMonitor_1:null,
    errorTelemetry_1:null,
    workbenchCommonProperties_1:null,
    integration_1:null,
    update_1:null,
    workspaceStats_1:null,
    windowService_1:null,
    messageService_1:null,
    request_1:null,
    requestService_1:null,
    configuration_1:null,
    fileService_1:null,
    searchService_1:null,
    lifecycleService_1:null,
    threadService_1:null,
    markerService_1:null,
    modelService_1:null,
    modelServiceImpl_1:null,
    compatWorkerService_1:null,
    compatWorkerServiceMain_1:null,
    codeEditorServiceImpl_1:null,
    codeEditorService_1:null,
    editorWorkerServiceImpl_1:null,
    editorWorkerService_1:null,
    mainThreadExtensionService_1:null,
    storage_2:null,
    serviceCollection_1:null,
    instantiationService_1:null,
    contextView_1:null,
    event_1:null,
    files_1:null,
    lifecycle_2:null,
    markers_1:null,
    environment_1:null,
    message_1:null,
    search_1:null,
    threadService_2:null,
    commands_1:null,
    commandService_1:null,
    workspace_1:null,
    extensions_1:null,
    modeServiceImpl_1:null,
    modeService_1:null,
    untitledEditorService_1:null,
    crashReporter_1:null,
    themeService_1:null,
    themeService_2:null,
    ipc_1:null,
    ipc_net_1:null,
    ipc_electron_1:null,
    electron_1:null,
    extensionManagementIpc_1:null,
    extensionManagement_1:null,
    urlIpc_1:null,
    url_1:null,
    registerPlugin:function(name,sourcePath){
        
    },
    unRegisterPlugin:function(name){
        
    },
    tableBarAction:{
        DebugConsole:null,
        OutPut:null,
        Probrems:null,
        IntegratedTerminal:null
    },
    __decorate:function (decorators, target, key, desc) {
        var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
        if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
        else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
        return c > 3 && r && Object.defineProperty(target, key, r), r;
    },
    __param:function (paramIndex, decorator) {
        return function (target, key) { decorator(target, key, paramIndex); }
    },
    init:function(workbenchShell,nls, platform, builder_1, dom, aria, lifecycle_1, errors, product_1, package_1, contextViewService_1, timer, workbench_1, storage_1, telemetry_1, telemetryIpc_1, telemetryService_1, idleMonitor_1, errorTelemetry_1, workbenchCommonProperties_1, integration_1, update_1, workspaceStats_1, windowService_1, messageService_1, request_1, requestService_1, configuration_1, fileService_1, searchService_1, lifecycleService_1, threadService_1, markerService_1, modelService_1, modelServiceImpl_1, compatWorkerService_1, compatWorkerServiceMain_1, codeEditorServiceImpl_1, codeEditorService_1, editorWorkerServiceImpl_1, editorWorkerService_1, mainThreadExtensionService_1, storage_2, serviceCollection_1, instantiationService_1, contextView_1, event_1, files_1, lifecycle_2, markers_1, environment_1, message_1, search_1, threadService_2, commands_1, commandService_1, workspace_1, extensions_1, modeServiceImpl_1, modeService_1, untitledEditorService_1, crashReporter_1, themeService_1, themeService_2, ipc_1, ipc_net_1, ipc_electron_1, electron_1, extensionManagementIpc_1, extensionManagement_1, urlIpc_1, url_1){
        var _this=this;
        this.workbenchShell=workbenchShell;
        this.platform=platform;
        this.builder_1=builder_1;
        this.dom=dom;
        this.aria=aria;
        this.lifecycle_1=lifecycle_1;
        this.errors=errors;
        this.product_1=product_1;
        this.package_1=package_1;
        this.contextViewService_1=contextViewService_1;
        this.timer=timer;
        this.workbench_1=workbench_1;
        this.storage_1=storage_1;
        this.telemetry_1=telemetry_1;
        this.telemetryIpc_1=telemetryIpc_1;
        this.telemetryService_1=telemetryService_1;
        this.idleMonitor_1=idleMonitor_1;
        this.errorTelemetry_1=errorTelemetry_1;
        this.workbenchCommonProperties_1=workbenchCommonProperties_1;
        this.integration_1=integration_1;
        this.update_1=update_1;
        this.workspaceStats_1=workspaceStats_1;
        this.windowService_1=windowService_1;
        this.messageService_1=messageService_1;
        this.request_1=request_1;
        this.requestService_1=requestService_1;
        this.configuration_1=configuration_1;
        this.fileService_1=fileService_1;
        this.searchService_1=searchService_1;
        this.lifecycleService_1=lifecycleService_1;
        this.threadService_1=threadService_1;
        this.markerService_1=markerService_1;
        this.modelService_1=modelService_1;
        this.modelServiceImpl_1=modelServiceImpl_1;
        this.compatWorkerService_1=compatWorkerService_1;
        this.compatWorkerServiceMain_1=compatWorkerServiceMain_1;
        this.codeEditorServiceImpl_1=codeEditorServiceImpl_1;
        this.codeEditorService_1=codeEditorService_1;
        this.editorWorkerServiceImpl_1=editorWorkerServiceImpl_1;
        this.editorWorkerService_1=editorWorkerService_1;
        this.mainThreadExtensionService_1=mainThreadExtensionService_1;
        this.storage_2=storage_2;
        this.serviceCollection_1=serviceCollection_1;
        this.instantiationService_1=instantiationService_1;
        this.contextView_1=contextView_1;
        this.event_1=event_1;
        this.files_1=files_1;
        this.lifecycle_2=lifecycle_2;
        this.markers_1=markers_1;
        this.environment_1=environment_1;
        this.message_1=message_1;
        this.search_1=search_1;
        this.threadService_2=threadService_2;
        this.commands_1=commands_1;
        this.commandService_1=commandService_1;
        this.workspace_1=workspace_1;
        this.extensions_1=extensions_1;
        this.modeServiceImpl_1=modeServiceImpl_1;
        this.modeService_1=modeService_1;
        this.untitledEditorService_1=untitledEditorService_1;
        this.crashReporter_1=crashReporter_1;
        this.themeService_1=themeService_1;
        this.themeService_2=themeService_2;
        this.ipc_1=ipc_1;
        this.ipc_net_1=ipc_net_1;
        this.ipc_electron_1=ipc_electron_1;
        this.electron_1=electron_1;
        this.extensionManagementIpc_1=extensionManagementIpc_1;
        this.extensionManagement_1=extensionManagement_1;
        this.urlIpc_1=urlIpc_1;
        this.url_1=url_1;
        try{
            var paths = fs.readFileSync(this.settingPath);
            this.setting=JSON.parse(paths);
        }catch(e){
            console.log(e);
        }
        if(this.setting){
            paths=this.setting.scriptPaths;
            if(paths){
                for(var i=0;i<paths.length;i++){
                    try{
                        require(paths[i]).turtleActivate();
                    }catch(e){
                        console.log(e);
                    }
                }
            }
        }
        //修改CompositePart 和 4个panel;
        var CompositePart=require('vs/workbench/browser/parts/compositePart').CompositePart;
        var IPartService=require('vs/workbench/services/part/common/partService').IPartService;
        var IPanelService=require('vs/workbench/services/panel/common/panelService').IPanelService;
        var ITerminalService=require('vs/workbench/parts/terminal/electron-browser/terminal').ITerminalService;
        var Action=require('vs/base/common/actions').Action;
        define('tablebar',['vs/nls!vs/workbench/workbench.turtle','vs/css!vs/workbench/media/tablebar'],function(nlsturtle){
            vsturtle.nls=nlsturtle.tableBar;
        });
        var __decorate=this.__decorate;
        var __param=this.__param;
        var DebugConsole = (function (_super) {
            __extends(DebugConsole, _super);
            function DebugConsole(partService, panelService) {
                _super.call(this, DebugConsole.ID, vsturtle.nls[0], 'switchDebug', true);
                this.partService = partService;
                this.panelService = panelService;
                this.tooltip = vsturtle.nls[0];
            }
            DebugConsole.prototype.run = function () {
                if (this.isReplVisible()) {
                    this.partService.setPanelHidden(true);
                    return winjs_base_1.TPromise.as(null);
                }
                return this.panelService.openPanel('workbench.panel.repl', true);
            };
            DebugConsole.prototype.isReplVisible = function () {
                var panel = this.panelService.getActivePanel();
                return panel && panel.getId() === 'workbench.panel.repl';
            };
            DebugConsole.ID = 'workbench.action.tablebar.switchDebug';
            DebugConsole = __decorate([
                __param(0, IPartService),
                __param(1, IPanelService)
            ], DebugConsole);
            return DebugConsole;
        }(Action));

        var OutPut = (function (_super) {
            __extends(OutPut, _super);
            function OutPut(partService, panelService) {
                _super.call(this, OutPut.ID, vsturtle.nls[1], 'switchOutput', true);
                this.partService = partService;
                this.panelService = panelService;
                this.tooltip = vsturtle.nls[1];
            }
            OutPut.prototype.run = function () {
                if (this.isReplVisible()) {
                    this.partService.setPanelHidden(true);
                    return winjs_base_1.TPromise.as(null);
                }
                return this.panelService.openPanel('workbench.panel.output', true);
            };
            OutPut.prototype.isReplVisible = function () {
                var panel = this.panelService.getActivePanel();
                return panel && panel.getId() === 'workbench.panel.output';
            };
            OutPut.ID = 'workbench.action.tablebar.switchOutPut';
            OutPut = __decorate([
                __param(0, IPartService),
                __param(1, IPanelService)
            ], OutPut);
            return OutPut;
        }(Action));

        var Probrems = (function (_super) {
            __extends(Probrems, _super);
            function Probrems(partService, panelService) {
                _super.call(this, Probrems.ID, vsturtle.nls[2], 'switchProbrems', true);
                this.partService = partService;
                this.panelService = panelService;
                this.tooltip = vsturtle.nls[2];
            }
            Probrems.prototype.run = function () {
                if (this.isReplVisible()) {
                    this.partService.setPanelHidden(true);
                    return winjs_base_1.TPromise.as(null);
                }
                return this.panelService.openPanel('workbench.panel.markers', true);
            };
            Probrems.prototype.isReplVisible = function () {
                var panel = this.panelService.getActivePanel();
                return panel && panel.getId() === 'workbench.panel.markers';
            };
            Probrems.ID = 'workbench.action.tablebar.Probrems';
            Probrems = __decorate([
                __param(0, IPartService),
                __param(1, IPanelService)
            ], Probrems);
            return Probrems;
        }(Action));

        var IntegratedTerminal = (function (_super) {
            __extends(IntegratedTerminal, _super);
            function IntegratedTerminal(terminalService) {
                _super.call(this, IntegratedTerminal.ID, vsturtle.nls[3], 'switchIntegratedTerminal', true);
                this.terminalService = terminalService;
                this.tooltip = vsturtle.nls[3];
            }
            IntegratedTerminal.prototype.run = function () {
                return this.terminalService.toggle();
            };
            IntegratedTerminal.ID = 'workbench.action.tablebar.switchIntegratedTerminal';
            IntegratedTerminal = __decorate([
                __param(0, ITerminalService)
            ], IntegratedTerminal);
            return IntegratedTerminal;
        }(Action));

        this.tableBarAction.DebugConsole=DebugConsole;
        this.tableBarAction.OutPut=OutPut;
        this.tableBarAction.Probrems=Probrems;
        this.tableBarAction.IntegratedTerminal=IntegratedTerminal;

        function initTableBarActions(composite){
            if(composite.hasTableActions){
                return;
            }
            switch(composite.id){
                case 'workbench.editors.stringEditor':
                    require('vs/workbench/parts/output/browser/outputPanel').OutputPanel
                    .prototype.getTableActions=function(){
                        return _this.getTableActions(this,'OutputPanel');
                    }
                    composite.hasTableActions=true;
                    break;
                case 'workbench.panel.markers':
                    require('vs/workbench/parts/markers/browser/markersPanel').MarkersPanel
                    .prototype.getTableActions=function(){
                        return _this.getTableActions(this,'MarkersPanel');
                    }
                    composite.hasTableActions=true;
                    break;
                case 'workbench.panel.terminal':
                    require('vs/workbench/parts/terminal/electron-browser/terminalPanel').TerminalPanel
                    .prototype.getTableActions=function(){
                        return _this.getTableActions(this,'TerminalPanel');
                    }
                    composite.hasTableActions=true;
                    break;
                case 'workbench.panel.repl':
                    require('vs/workbench/parts/debug/electron-browser/repl').Repl
                    .prototype.getTableActions=function(){
                        return _this.getTableActions(this,'Repl');
                    }
                    composite.hasTableActions=true;
                    break;
            }
        }

        var hideActiveComposite=CompositePart.prototype.hideActiveComposite;
        CompositePart.prototype.hideActiveComposite = function () {
            var _this=this;
            var ret=hideActiveComposite.call(this);
            ret.then(function(){
                _this.tableBar.clearChildren();
            });
            return ret;
        };

        var collectCompositeActions=CompositePart.prototype.collectCompositeActions;
        CompositePart.prototype.collectCompositeActions = function (composite) {
            var _this=this;
            var ret=collectCompositeActions.call(this,composite);
            initTableBarActions(composite);
            if(composite.hasTableActions){
                this.titleLabel.addClass('hidden');
                var element=document.createElement('div');
                var titleLabelBox=this.titleLabel.parent();
                titleLabelBox.parent().getHTMLElement().insertBefore(element,titleLabelBox.getHTMLElement());
                var div=new builder_1.Builder(element);
                div.addClass('monaco-toolbar');
                div.div({class:'monaco-action-bar animated'},(div)=>{
                    _this.tableBar=div;
                    div.div({},(div)=>{
                        _this.tableBarBox=div;
                    });
                });
                return function(){
                    ret();
                    var tableActions=composite.getTableActions();
                    _this.tableBar.clearChildren();
                    tableActions.forEach(function(element){
                        _this.tableBarBox.div({class:'action-icon-item'},function(div){
                            if(element.enabled){
                                div.on('click', function(event){
                                    dom.EventHelper.stop(event, true);
                                    element.run(event);
                                });
                            }else{
                                div.addClass('active');
                            }
                            div.a({
                                class:'action-icon-label icon '+element.class,
                                title:element.tooltip,
                                innerHtml:element.label
                            });
                        });
                    });
                }
            }else{
                return ret;
            }
        }
        workbenchShell.contentsContainer = workbenchShell.createContents(builder_1.$(workbenchShell.content));
    },
    getTableActions:function(panel,panelName){
        if (!panel.tableActions){
            var output=panel.instantiationService.createInstance(this.tableBarAction.OutPut);
            var probrems=panel.instantiationService.createInstance(this.tableBarAction.Probrems);
            var debug=panel.instantiationService.createInstance(this.tableBarAction.DebugConsole);
            var terminal=panel.instantiationService.createInstance(this.tableBarAction.IntegratedTerminal);
            switch(panelName){
                case 'Repl':
                    debug.enabled=false;
                    break;
                case 'MarkersPanel':
                    probrems.enabled=false;
                    break;
                case 'OutputPanel':
                    output.enabled=false;
                    break;
                case 'TerminalPanel':
                    terminal.enabled=false;
                    break;
            }
            panel.tableActions = [
                output,probrems,debug,terminal
            ];
        }
        return panel.tableActions;
    }
};
/*turtle hook global end*/
$1`);
    }
    function replaceJs(jsreplace, jswith) {
        let changed = null;
        try {
            changed = replace({
                files: vars.jsfile,
                replace: jsreplace,
                with: jswith
            });
            console.log('REPLACE SUCCESSFUL:', jsreplace.toString());
        } catch (error) {
            console.log(error);
        }
        return changed;
    }
    function emitEndUninstall() {
        eventEmitter.emit('endUninstall');
    }
    function restoredAction(isRestored:number, willReinstall:boolean) {
        if (isRestored === 2) {
            if (willReinstall) {
                emitEndUninstall();
            } else {
                disabledRestart();
            }
        }
    }

    function restoreBak(willReinstall:boolean):void {
        let restore = 0;
        let j = null;
        let c = null;

        fs.unlink(vars.jsfile, function (err) {
            if (err) {
                showAdminPrivilegesError();
                return;
            }
            j = fs.createReadStream(vars.jsfilebak)
            .pipe(fs.createWriteStream(vars.jsfile));
            j.on('finish', function () {
                fs.unlink(vars.jsfilebak);
                restore++;
                restoredAction(restore, willReinstall);
            });
        });
    }
    function fInstall() {
        installItem(vars.jsfilebak, vars.jsfile, cleanJsInstall);
        addResource();
        settings.setStatus(settings.status.enabled);
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

    function fReinstall() {
        console.log('fReinstall');
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
    } else  if (state.status === settings.status.enabled &&
        state.version !== vars.extVersion) {
        // auto-update
        fReinstall();
    }
}