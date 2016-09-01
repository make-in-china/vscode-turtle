/// <reference path="../typings/node.d.ts" />
'use strict';
var vscode_1 = require('vscode');
// let extract = require('extract-zip');
var replace = require('replace-in-file');
var events = require('events');
var messages_1 = require('./messages');
var settings = require('./settings');
function deactivate() {
}
exports.deactivate = deactivate;
function activate(context) {
    var eventEmitter = new events.EventEmitter();
    var vars = settings.getSettings();
    var installTurtle;
    var uninstallTurtle;
    var reinstallTurtle;
    console.log('vscode-turtle is active!');
    function showAdminPrivilegesError() {
        vscode_1.window.showInformationMessage(messages_1.default.admin);
        var state = settings.getState();
        if (state.status === settings.status.enabled) {
            settings.deleteState();
        }
    }
    //检查是否加载自己；
    process.on('uncaughtException', function (err) {
        if (/ENOENT|EACCES|EPERM/.test(err.code)) {
            showAdminPrivilegesError();
            return;
        }
    });
    function reloadWindow() {
        // reload vscode-window
        vscode_1.commands.executeCommand('workbench.action.reloadWindow');
    }
    function disabledRestart() {
        settings.setStatus(settings.status.disabled);
        vscode_1.window.showInformationMessage(messages_1.default.disabled, { title: messages_1.default.restartIde })
            .then(function () {
            reloadWindow();
        });
    }
    function installItem(bakfile, orfile, cleanInstallFunc) {
        fs.stat(bakfile, function (errBak, statsBak) {
            if (errBak) {
                // clean installation
                cleanInstallFunc();
            }
            else {
                // check cssfilebak's timestamp and compare it to the cssfile's.
                fs.stat(orfile, function (errOr, statsOr) {
                    console.log(orfile);
                    var updated = false;
                    if (errOr) {
                        vscode_1.window.showInformationMessage(messages_1.default.smthingwrong + errOr);
                    }
                    else {
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
    function hasBeenUpdated(stats1, stats2) {
        var dbak = new Date(stats1.ctime);
        var dor = new Date(stats2.ctime);
        var segs = timeDiff(dbak, dor) / 1000;
        return segs > 20;
    }
    function timeDiff(d1, d2) {
        var diff = Math.abs(d2.getTime() - d1.getTime());
        return diff;
    }
    var fs = require('fs'), stat = fs.stat;
    /*
    * 复制目录中的所有文件包括子目录
    * @param{ String } 需要复制的目录
    * @param{ String } 复制到指定的目录
    */
    var copy = function (src, dst) {
        // 读取目录中的所有文件/目录
        fs.readdir(src, function (err, paths) {
            if (err) {
                throw err;
            }
            paths.forEach(function (path) {
                var _src = src + '/' + path, _dst = dst + '/' + path, readable, writable;
                stat(_src, function (err, st) {
                    if (err) {
                        throw err;
                    }
                    // 判断是否为文件
                    if (st.isFile()) {
                        // 创建读取流
                        readable = fs.createReadStream(_src);
                        // 创建写入流
                        writable = fs.createWriteStream(_dst);
                        // 通过管道来传输流
                        readable.pipe(writable);
                    }
                    else if (st.isDirectory()) {
                        exists(_src, _dst, copy);
                    }
                });
            });
        });
    };
    // 在复制目录前需要判断该目录是否存在，不存在需要先创建目录
    var exists = function (src, dst, callback) {
        fs.exists(dst, function (exists) {
            // 已存在
            if (exists) {
                callback(src, dst);
            }
            else {
                fs.mkdir(dst, function () {
                    callback(src, dst);
                });
            }
        });
    };
    function cleanJsInstall() {
        var j = fs.createReadStream(vars.jsfile).pipe(fs.createWriteStream(vars.jsfilebak));
        j.on('finish', function () {
            replaceAllJs();
            // // 复制目录
            // exists( './src', './build', copy );
        });
    }
    console.log(vars);
    function replaceAllJs() {
        replaceJs(/this\.contentsContainer\=this\.createContents\([a-z]\.\$\(this\.content\)\)/, "/*turtle hook open begin*/\n            vsturtle.init(this,i,n,o,r,s,a,c,u,l,d,h,p,f,g,m,v,y,E,S,b,_,C,w,I,T,A,D,L,k,x,M,R,P,O,N,F,W,K,B,V,H,U,z,G,j,q,Y,$,X,Q,Z,J,ee,te,ie,ne,oe,re,se,ae,ce,ue,le,de)\n/*turtle hook open end*/");
        replaceJs(/^(.)/, "/*turtle hook global begin*/\nvsturtle = {\n    settingPath:'" + vars.settingsPath.replace(/\\/g, '/') + "',\n    setting:null,\n    workbenchShell:null,\n    nls:null,\n    platform:null,\n    builder_1:null,\n    dom:null,\n    aria:null,\n    lifecycle_1:null,\n    errors:null,\n    product_1:null,\n    package_1:null,\n    contextViewService_1:null,\n    timer:null,\n    workbench_1:null,\n    storage_1:null,\n    telemetry_1:null,\n    telemetryIpc_1:null,\n    telemetryService_1:null,\n    idleMonitor_1:null,\n    errorTelemetry_1:null,\n    workbenchCommonProperties_1:null,\n    integration_1:null,\n    update_1:null,\n    workspaceStats_1:null,\n    windowService_1:null,\n    messageService_1:null,\n    request_1:null,\n    requestService_1:null,\n    configuration_1:null,\n    fileService_1:null,\n    searchService_1:null,\n    lifecycleService_1:null,\n    threadService_1:null,\n    markerService_1:null,\n    modelService_1:null,\n    modelServiceImpl_1:null,\n    compatWorkerService_1:null,\n    compatWorkerServiceMain_1:null,\n    codeEditorServiceImpl_1:null,\n    codeEditorService_1:null,\n    editorWorkerServiceImpl_1:null,\n    editorWorkerService_1:null,\n    mainThreadExtensionService_1:null,\n    storage_2:null,\n    serviceCollection_1:null,\n    instantiationService_1:null,\n    contextView_1:null,\n    event_1:null,\n    files_1:null,\n    lifecycle_2:null,\n    markers_1:null,\n    environment_1:null,\n    message_1:null,\n    search_1:null,\n    threadService_2:null,\n    commands_1:null,\n    commandService_1:null,\n    workspace_1:null,\n    extensions_1:null,\n    modeServiceImpl_1:null,\n    modeService_1:null,\n    untitledEditorService_1:null,\n    crashReporter_1:null,\n    themeService_1:null,\n    themeService_2:null,\n    ipc_1:null,\n    ipc_net_1:null,\n    ipc_electron_1:null,\n    electron_1:null,\n    extensionManagementIpc_1:null,\n    extensionManagement_1:null,\n    urlIpc_1:null,\n    url_1:null,\n    registerPlugin:function(name,sourcePath){\n        \n    },\n    unRegisterPlugin:function(name){\n        \n    },\n    tableBarAction:{\n        DebugConsole:null,\n        OutPut:null,\n        Probrems:null,\n        IntegratedTerminal:null\n    },\n    __decorate:function (decorators, target, key, desc) {\n        var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;\n        if (typeof Reflect === \"object\" && typeof Reflect.decorate === \"function\") r = Reflect.decorate(decorators, target, key, desc);\n        else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;\n        return c > 3 && r && Object.defineProperty(target, key, r), r;\n    },\n    __param:function (paramIndex, decorator) {\n        return function (target, key) { decorator(target, key, paramIndex); }\n    },\n    init:function(workbenchShell,nls, platform, builder_1, dom, aria, lifecycle_1, errors, product_1, package_1, contextViewService_1, timer, workbench_1, storage_1, telemetry_1, telemetryIpc_1, telemetryService_1, idleMonitor_1, errorTelemetry_1, workbenchCommonProperties_1, integration_1, update_1, workspaceStats_1, windowService_1, messageService_1, request_1, requestService_1, configuration_1, fileService_1, searchService_1, lifecycleService_1, threadService_1, markerService_1, modelService_1, modelServiceImpl_1, compatWorkerService_1, compatWorkerServiceMain_1, codeEditorServiceImpl_1, codeEditorService_1, editorWorkerServiceImpl_1, editorWorkerService_1, mainThreadExtensionService_1, storage_2, serviceCollection_1, instantiationService_1, contextView_1, event_1, files_1, lifecycle_2, markers_1, environment_1, message_1, search_1, threadService_2, commands_1, commandService_1, workspace_1, extensions_1, modeServiceImpl_1, modeService_1, untitledEditorService_1, crashReporter_1, themeService_1, themeService_2, ipc_1, ipc_net_1, ipc_electron_1, electron_1, extensionManagementIpc_1, extensionManagement_1, urlIpc_1, url_1){\n        var _this=this;\n        this.workbenchShell=workbenchShell;\n        this.platform=platform;\n        this.builder_1=builder_1;\n        this.dom=dom;\n        this.aria=aria;\n        this.lifecycle_1=lifecycle_1;\n        this.errors=errors;\n        this.product_1=product_1;\n        this.package_1=package_1;\n        this.contextViewService_1=contextViewService_1;\n        this.timer=timer;\n        this.workbench_1=workbench_1;\n        this.storage_1=storage_1;\n        this.telemetry_1=telemetry_1;\n        this.telemetryIpc_1=telemetryIpc_1;\n        this.telemetryService_1=telemetryService_1;\n        this.idleMonitor_1=idleMonitor_1;\n        this.errorTelemetry_1=errorTelemetry_1;\n        this.workbenchCommonProperties_1=workbenchCommonProperties_1;\n        this.integration_1=integration_1;\n        this.update_1=update_1;\n        this.workspaceStats_1=workspaceStats_1;\n        this.windowService_1=windowService_1;\n        this.messageService_1=messageService_1;\n        this.request_1=request_1;\n        this.requestService_1=requestService_1;\n        this.configuration_1=configuration_1;\n        this.fileService_1=fileService_1;\n        this.searchService_1=searchService_1;\n        this.lifecycleService_1=lifecycleService_1;\n        this.threadService_1=threadService_1;\n        this.markerService_1=markerService_1;\n        this.modelService_1=modelService_1;\n        this.modelServiceImpl_1=modelServiceImpl_1;\n        this.compatWorkerService_1=compatWorkerService_1;\n        this.compatWorkerServiceMain_1=compatWorkerServiceMain_1;\n        this.codeEditorServiceImpl_1=codeEditorServiceImpl_1;\n        this.codeEditorService_1=codeEditorService_1;\n        this.editorWorkerServiceImpl_1=editorWorkerServiceImpl_1;\n        this.editorWorkerService_1=editorWorkerService_1;\n        this.mainThreadExtensionService_1=mainThreadExtensionService_1;\n        this.storage_2=storage_2;\n        this.serviceCollection_1=serviceCollection_1;\n        this.instantiationService_1=instantiationService_1;\n        this.contextView_1=contextView_1;\n        this.event_1=event_1;\n        this.files_1=files_1;\n        this.lifecycle_2=lifecycle_2;\n        this.markers_1=markers_1;\n        this.environment_1=environment_1;\n        this.message_1=message_1;\n        this.search_1=search_1;\n        this.threadService_2=threadService_2;\n        this.commands_1=commands_1;\n        this.commandService_1=commandService_1;\n        this.workspace_1=workspace_1;\n        this.extensions_1=extensions_1;\n        this.modeServiceImpl_1=modeServiceImpl_1;\n        this.modeService_1=modeService_1;\n        this.untitledEditorService_1=untitledEditorService_1;\n        this.crashReporter_1=crashReporter_1;\n        this.themeService_1=themeService_1;\n        this.themeService_2=themeService_2;\n        this.ipc_1=ipc_1;\n        this.ipc_net_1=ipc_net_1;\n        this.ipc_electron_1=ipc_electron_1;\n        this.electron_1=electron_1;\n        this.extensionManagementIpc_1=extensionManagementIpc_1;\n        this.extensionManagement_1=extensionManagement_1;\n        this.urlIpc_1=urlIpc_1;\n        this.url_1=url_1;\n        try{\n            var paths = fs.readFileSync(this.settingPath);\n            this.setting=JSON.parse(paths);\n        }catch(e){\n            console.log(e);\n        }\n        paths=this.setting.scriptPaths;\n        if(paths){\n            for(var i=0;i<paths.length;i++){\n                try{\n                    require(paths[i]).turtleActivate();\n                }catch(e){\n                    console.log(e);\n                }\n            }\n        }\n        //\u4FEE\u6539CompositePart \u548C 4\u4E2Apanel;\n        var CompositePart=require('vs/workbench/browser/parts/compositePart').CompositePart;\n        var IPartService=require('vs/workbench/services/part/common/partService').IPartService;\n        var IPanelService=require('vs/workbench/services/panel/common/panelService').IPanelService;\n        var ITerminalService=require('vs/workbench/parts/terminal/electron-browser/terminal').ITerminalService;\n        var Action=require('vs/base/common/actions').Action;\n        define('tablebar',['vs/nls!vs/workbench/workbench.turtle','vs/css!vs/workbench/media/tablebar'],function(nlsturtle){\n            vsturtle.nls=nlsturtle.tableBar;\n        });\n        var __decorate=this.__decorate;\n        var __param=this.__param;\n        var DebugConsole = (function (_super) {\n            __extends(DebugConsole, _super);\n            function DebugConsole(partService, panelService) {\n                _super.call(this, DebugConsole.ID, vsturtle.nls[0], 'switchDebug', true);\n                this.partService = partService;\n                this.panelService = panelService;\n                this.tooltip = vsturtle.nls[0];\n            }\n            DebugConsole.prototype.run = function () {\n                if (this.isReplVisible()) {\n                    this.partService.setPanelHidden(true);\n                    return winjs_base_1.TPromise.as(null);\n                }\n                return this.panelService.openPanel('workbench.panel.repl', true);\n            };\n            DebugConsole.prototype.isReplVisible = function () {\n                var panel = this.panelService.getActivePanel();\n                return panel && panel.getId() === 'workbench.panel.repl';\n            };\n            DebugConsole.ID = 'workbench.action.tablebar.switchDebug';\n            DebugConsole = __decorate([\n                __param(0, IPartService),\n                __param(1, IPanelService)\n            ], DebugConsole);\n            return DebugConsole;\n        }(Action));\n\n        var OutPut = (function (_super) {\n            __extends(OutPut, _super);\n            function OutPut(partService, panelService) {\n                _super.call(this, OutPut.ID, vsturtle.nls[1], 'switchOutput', true);\n                this.partService = partService;\n                this.panelService = panelService;\n                this.tooltip = vsturtle.nls[1];\n            }\n            OutPut.prototype.run = function () {\n                if (this.isReplVisible()) {\n                    this.partService.setPanelHidden(true);\n                    return winjs_base_1.TPromise.as(null);\n                }\n                return this.panelService.openPanel('workbench.panel.output', true);\n            };\n            OutPut.prototype.isReplVisible = function () {\n                var panel = this.panelService.getActivePanel();\n                return panel && panel.getId() === 'workbench.panel.output';\n            };\n            OutPut.ID = 'workbench.action.tablebar.switchOutPut';\n            OutPut = __decorate([\n                __param(0, IPartService),\n                __param(1, IPanelService)\n            ], OutPut);\n            return OutPut;\n        }(Action));\n\n        var Probrems = (function (_super) {\n            __extends(Probrems, _super);\n            function Probrems(partService, panelService) {\n                _super.call(this, Probrems.ID, vsturtle.nls[2], 'switchProbrems', true);\n                this.partService = partService;\n                this.panelService = panelService;\n                this.tooltip = vsturtle.nls[2];\n            }\n            Probrems.prototype.run = function () {\n                if (this.isReplVisible()) {\n                    this.partService.setPanelHidden(true);\n                    return winjs_base_1.TPromise.as(null);\n                }\n                return this.panelService.openPanel('workbench.panel.markers', true);\n            };\n            Probrems.prototype.isReplVisible = function () {\n                var panel = this.panelService.getActivePanel();\n                return panel && panel.getId() === 'workbench.panel.markers';\n            };\n            Probrems.ID = 'workbench.action.tablebar.Probrems';\n            Probrems = __decorate([\n                __param(0, IPartService),\n                __param(1, IPanelService)\n            ], Probrems);\n            return Probrems;\n        }(Action));\n\n        var IntegratedTerminal = (function (_super) {\n            __extends(IntegratedTerminal, _super);\n            function IntegratedTerminal(terminalService) {\n                _super.call(this, IntegratedTerminal.ID, vsturtle.nls[3], 'switchIntegratedTerminal', true);\n                this.terminalService = terminalService;\n                this.tooltip = vsturtle.nls[3];\n            }\n            IntegratedTerminal.prototype.run = function () {\n                return this.terminalService.toggle();\n            };\n            IntegratedTerminal.ID = 'workbench.action.tablebar.switchIntegratedTerminal';\n            IntegratedTerminal = __decorate([\n                __param(0, ITerminalService)\n            ], IntegratedTerminal);\n            return IntegratedTerminal;\n        }(Action));\n\n        this.tableBarAction.DebugConsole=DebugConsole;\n        this.tableBarAction.OutPut=OutPut;\n        this.tableBarAction.Probrems=Probrems;\n        this.tableBarAction.IntegratedTerminal=IntegratedTerminal;\n\n        function initTableBarActions(composite){\n            if(composite.hasTableActions){\n                return;\n            }\n            switch(composite.id){\n                case 'workbench.editors.stringEditor':\n                    require('vs/workbench/parts/output/browser/outputPanel').OutputPanel\n                    .prototype.getTableActions=function(){\n                        return _this.getTableActions(this,'OutputPanel');\n                    }\n                    composite.hasTableActions=true;\n                    break;\n                case 'workbench.panel.markers':\n                    require('vs/workbench/parts/markers/browser/markersPanel').MarkersPanel\n                    .prototype.getTableActions=function(){\n                        return _this.getTableActions(this,'MarkersPanel');\n                    }\n                    composite.hasTableActions=true;\n                    break;\n                case 'workbench.panel.terminal':\n                    require('vs/workbench/parts/terminal/electron-browser/terminalPanel').TerminalPanel\n                    .prototype.getTableActions=function(){\n                        return _this.getTableActions(this,'TerminalPanel');\n                    }\n                    composite.hasTableActions=true;\n                    break;\n                case 'workbench.panel.repl':\n                    require('vs/workbench/parts/debug/electron-browser/repl').Repl\n                    .prototype.getTableActions=function(){\n                        return _this.getTableActions(this,'Repl');\n                    }\n                    composite.hasTableActions=true;\n                    break;\n            }\n        }\n\n        var hideActiveComposite=CompositePart.prototype.hideActiveComposite;\n        CompositePart.prototype.hideActiveComposite = function () {\n            var _this=this;\n            var ret=hideActiveComposite.call(this);\n            ret.then(function(){\n                _this.tableBar.clearChildren();\n            });\n            return ret;\n        };\n\n        var collectCompositeActions=CompositePart.prototype.collectCompositeActions;\n        CompositePart.prototype.collectCompositeActions = function (composite) {\n            var _this=this;\n            var ret=collectCompositeActions.call(this,composite);\n            initTableBarActions(composite);\n            if(composite.hasTableActions){\n                this.titleLabel.addClass('hidden');\n                var element=document.createElement('div');\n                var titleLabelBox=this.titleLabel.parent();\n                titleLabelBox.parent().getHTMLElement().insertBefore(element,titleLabelBox.getHTMLElement());\n                var div=new builder_1.Builder(element);\n                div.addClass('monaco-toolbar');\n                div.div({class:'monaco-action-bar animated'},(div)=>{\n                    _this.tableBar=div;\n                    div.div({},(div)=>{\n                        _this.tableBarBox=div;\n                    });\n                });\n                return function(){\n                    ret();\n                    var tableActions=composite.getTableActions();\n                    _this.tableBar.clearChildren();\n                    tableActions.forEach(function(element){\n                        _this.tableBarBox.div({class:'action-icon-item',role:\"presentation\"},function(div){\n                            if(element.enabled){\n                                div.on('click', function(event){\n                                    dom.EventHelper.stop(event, true);\n                                    element.run(event);\n                                });\n                            }else{\n                                div.style('border-bottom-style','solid');\n                            }\n                            div.a({\n                                class:'action-icon-label icon '+element.class,\n                                title:element.tooltip,\n                                innerHtml:element.label\n                            });\n                        });\n                    });\n                }\n            }else{\n                return ret;\n            }\n        }\n        workbenchShell.contentsContainer = workbenchShell.createContents(builder_1.$(workbenchShell.content));\n    },\n    getTableActions:function(panel,panelName){\n        if (!panel.tableActions){\n            var output=panel.instantiationService.createInstance(this.tableBarAction.OutPut);\n            var probrems=panel.instantiationService.createInstance(this.tableBarAction.Probrems);\n            var debug=panel.instantiationService.createInstance(this.tableBarAction.DebugConsole);\n            var terminal=panel.instantiationService.createInstance(this.tableBarAction.IntegratedTerminal);\n            switch(panelName){\n                case 'Repl':\n                    debug.enabled=false;\n                    break;\n                case 'MarkersPanel':\n                    probrems.enabled=false;\n                    break;\n                case 'OutputPanel':\n                    output.enabled=false;\n                    break;\n                case 'TerminalPanel':\n                    terminal.enabled=false;\n                    break;\n            }\n            panel.tableActions = [\n                output,probrems,debug,terminal\n            ];\n        }\n        return panel.tableActions;\n    }\n};\n/*turtle hook global end*/\n$1");
    }
    function replaceJs(jsreplace, jswith) {
        var changed = null;
        try {
            changed = replace({
                files: vars.jsfile,
                replace: jsreplace,
                with: jswith
            });
            console.log('REPLACE SUCCESSFUL:', jsreplace.toString());
        }
        catch (error) {
            console.log(error);
        }
        return changed;
    }
    function emitEndUninstall() {
        eventEmitter.emit('endUninstall');
    }
    function restoredAction(isRestored, willReinstall) {
        // if (isRestored === 2) {
        if (willReinstall) {
            emitEndUninstall();
        }
        else {
            disabledRestart();
        }
        // }
    }
    function restoreBak(willReinstall) {
        var restore = 0;
        var j = null;
        var c = null;
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
        // addTurtle();
        settings.setStatus(settings.status.enabled);
    }
    function fUninstall(willReinstall) {
        fs.stat(vars.jsfilebak, function (errBak, statsBak) {
            if (errBak) {
                if (willReinstall) {
                    emitEndUninstall();
                }
                else {
                    vscode_1.window.showInformationMessage(messages_1.default.already_disabled);
                }
                return;
            }
            // checking if normal file has been udpated.
            fs.stat(vars.jsfile, function (errOr, statsOr) {
                var updated = false;
                if (errOr) {
                    vscode_1.window.showInformationMessage(messages_1.default.smthingwrong + errOr);
                }
                else {
                    updated = hasBeenUpdated(statsBak, statsOr);
                    if (updated) {
                        // some update has occurred. clean install
                        fs.unlink(vars.jsfilebak);
                        if (willReinstall) {
                            emitEndUninstall();
                        }
                        else {
                            disabledRestart();
                        }
                    }
                    else {
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
    installTurtle = vscode_1.commands.registerCommand('extension.installTurtle', fInstall);
    uninstallTurtle = vscode_1.commands.registerCommand('extension.uninstallTurtle', fUninstall);
    reinstallTurtle = vscode_1.commands.registerCommand('extension.reinstallTurtle', fReinstall);
    context.subscriptions.push(installTurtle);
    context.subscriptions.push(uninstallTurtle);
    context.subscriptions.push(reinstallTurtle);
    var state = settings.getState();
    if (state.status === settings.status.notInstalled) {
        fInstall();
    }
    else if (state.status === settings.status.enabled &&
        state.version !== vars.extVersion) {
        // auto-update
        fReinstall();
    }
}
exports.activate = activate;

//# sourceMappingURL=../maps/extension.js.map
