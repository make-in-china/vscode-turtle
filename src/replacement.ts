
import {ISetting} from './settings';
export function getTop(vars:ISetting):string{
    return `/*!--------------------------------------------------------
 * vscode-turtle
 *--------------------------------------------------------*/
vsturtle = {
    settingPath:'${vars.settingsPath.replace(/\\/g,'/')}',
    version:'${vars.extVersion}',
    readSetting:function(){
        try{
            var datas = fs.readFileSync(this.settingPath);
            this.setting=JSON.parse(datas);
            if(this.setting){

                if(this.setting.hideActivityBar===undefined){
                    this.setting.hideActivityBar=false;
                }else{
                    this.setting.hideActivityBar=!!this.setting.hideActivityBar;
                }
            }else{
                this.setting={
                    version: _this.status,
                    status: 'enabled',
                    scriptPaths:null,
                    hideActivityBar:false
                }
            }
        }catch(e){
            this.setting={
                version: _this.status,
                status: 'enabled',
                scriptPaths:null,
                hideActivityBar:false
            }
        }
    },
    saveSetting:function(){
        try{
            if(this.setting){
                var datas = JSON.stringify(this.setting);
                fs.writeFileSync(this.settingPath,datas);
            }
        }catch(e){
            console.log(e);
        }
    },`;
}
export function getMain(top:string){
    return `${top}
    createVSCodeMenu:function(main,what,VSCodeMenu,windowsService){
        var electron=require('electron');
		var ipc=electron.ipcMain;
		var platform=require('vs/base/common/platform');
        var Menu=electron.Menu;
        var MenuItem=electron.MenuItem;

        function __separator__() {
            return new MenuItem({ type: 'separator' });
        }

		function mnemonicLabel(label){
            if (platform.isMacintosh) {
                return label.replace(/(&&w)|&&/g, ''); // no mnemonic support on mac/linux
            }
            return label.replace(/&&/g, '&');
        }

        function setturtleMenu(winLinuxTurtleMenu) {
            var toggleActivityPanel = this.createMenuItem(mnemonicLabel('切换导航边栏(&&T)'), function(){

                this.readSetting();
                if(this.setting.enabled!=='enabled'){
                    
                    return;
                }
				windowsService.sendToFocused('turtle:toggleActivityPanel');
			});
            var reloadWindow = this.createMenuItem(mnemonicLabel('重启VSC(&&R)'), function(){
				windowsService.getFocusedWindow().win.reload();
			});
            var uninstallTurtle = this.createMenuItem(mnemonicLabel('完全卸载玄武'), function(){
				
			});
			var plugins=new Menu();
			var pluginMenuItem = new MenuItem({
				 label: mnemonicLabel('Turtle插件(&&P)'),
				 submenu: plugins
			});
            [
                toggleActivityPanel,
                reloadWindow,
                __separator__(),
                pluginMenuItem,
                __separator__(),
                uninstallTurtle
            ].forEach(function (item) { return winLinuxTurtleMenu.append(item); });
        };


        var install=VSCodeMenu.prototype.install;
        VSCodeMenu.prototype.install = function () {
			_this=this;
			VSCodeMenu.prototype.install=install;
            var setApplicationMenu=Menu.setApplicationMenu;
            Menu.setApplicationMenu=function(menubar){

				var turtleMenu = new Menu();
                var turtleMenuItem = new MenuItem({
                     label: mnemonicLabel('玄武(&&Turtle)'),
                     submenu: turtleMenu
                });
                setturtleMenu.call(_this,turtleMenu);
                menubar.insert(menubar.items.length-1,turtleMenuItem);
                setApplicationMenu(menubar);
            }
			this.install();
        }
        return what.createInstance(VSCodeMenu);
    }
};
$1`
};
export function getWorkbench(top:string){
    return `${top}
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
    message:null,
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
    iconBarAction:{
        Extensions:null,
        Git:null,
        Search:null,
        Explorer:null
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
    loadPlugins:function(){
        this.readSetting();
        if(this.setting){
            var paths=this.setting.scriptPaths;
            if(paths&&paths.length){
                for(var i=0;i<paths.length;i++){
                    try{
                        require(paths[i]).turtleActivate();
                    }catch(e){
                        console.log(e);
                    }
                }
            }
        }
    },
    init:function(workbenchShell,nls, platform, builder_1, dom, aria, lifecycle_1, errors, product_1, package_1, contextViewService_1, timer, workbench_1, storage_1, telemetry_1, telemetryIpc_1, telemetryService_1, idleMonitor_1, errorTelemetry_1, workbenchCommonProperties_1, integration_1, update_1, workspaceStats_1, windowService_1, messageService_1, request_1, requestService_1, configuration_1, fileService_1, searchService_1, lifecycleService_1, threadService_1, markerService_1, modelService_1, modelServiceImpl_1, compatWorkerService_1, compatWorkerServiceMain_1, codeEditorServiceImpl_1, codeEditorService_1, editorWorkerServiceImpl_1, editorWorkerService_1, mainThreadExtensionService_1, storage_2, serviceCollection_1, instantiationService_1, contextView_1, event_1, files_1, lifecycle_2, markers_1, environment_1, message, search_1, threadService_2, commands_1, commandService_1, workspace_1, extensions_1, modeServiceImpl_1, modeService_1, untitledEditorService_1, crashReporter_1, themeService_1, themeService_2, ipc_1, ipc_net_1, ipc_electron, electron_1, extensionManagementIpc_1, extensionManagement_1){
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
        this.message=message;
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

        this.loadPlugins();
        //修改CompositePart 和 4个panel;

        var IPartService=require('vs/workbench/services/part/common/partService').IPartService;
        var IPanelService=require('vs/workbench/services/panel/common/panelService').IPanelService;
        var ITerminalService=require('vs/workbench/parts/terminal/electron-browser/terminal').ITerminalService;
        var IViewletService=require('vs/workbench/services/viewlet/common/viewletService').IViewletService;
        var IWorkbenchEditorService=require('vs/workbench/services/editor/common/editorService').IWorkbenchEditorService;

        var Workbench=require('vs/workbench/electron-browser/workbench').Workbench;
        var CompositePart=require('vs/workbench/browser/parts/compositePart').CompositePart;
        var ActivitybarPart=require('vs/workbench/browser/parts/activitybar/activitybarPart').ActivitybarPart;
        var ActivityActionItem=require('vs/workbench/browser/parts/activitybar/activityAction').ActivityActionItem;
        var Action=require('vs/base/common/actions').Action;

        var viewlet=require('vs/workbench/browser/viewlet');
        var activityService=require('vs/workbench/services/activity/common/activityService');

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


        function makeAction(className,viewletID,nlsIndex){
            return (function (_super) {
                __extends(Action, _super);
                function Action( viewletService, editorService) {
                    _super.call(this, viewletID+'.action', '', viewletID, viewletService, editorService);
                    this.tooltip = vsturtle.nls[nlsIndex];
                    this.class=className+' minicon';
                    this.enabled=true;
                }
                Action = __decorate([
                    __param(0, IViewletService),
                    __param(1, IWorkbenchEditorService)
                ], Action);
                return Action;
            }(viewlet.ToggleViewletAction))
        }

        this.iconBarAction.Explorer=makeAction('explorer2','workbench.view.explorer',7);
        this.iconBarAction.Search=makeAction('search2','workbench.view.search',6);
        this.iconBarAction.Git=makeAction('git2','workbench.view.git',5);
        this.iconBarAction.Debug=makeAction('debug2','workbench.view.debug',8);
        this.iconBarAction.Extensions=makeAction('extentions2','workbench.view.extensions',4);

        function setTableBarActions(composite){
            switch(composite.id){
                case 'workbench.editors.stringEditor':
                    require('vs/workbench/parts/output/browser/outputPanel').OutputPanel
                    .prototype.getTableActions=function(){
                        return _this.getTableActions(this,'OutputPanel');
                    }
                    break;
                case 'workbench.panel.markers':
                    require('vs/workbench/parts/markers/browser/markersPanel').MarkersPanel
                    .prototype.getTableActions=function(){
                        return _this.getTableActions(this,'MarkersPanel');
                    }
                    break;
                case 'workbench.panel.terminal':
                    require('vs/workbench/parts/terminal/electron-browser/terminalPanel').TerminalPanel
                    .prototype.getTableActions=function(){
                        return _this.getTableActions(this,'TerminalPanel');
                    }
                    break;
                case 'workbench.panel.repl':
                    require('vs/workbench/parts/debug/electron-browser/repl').Repl
                    .prototype.getTableActions=function(){
                        return _this.getTableActions(this,'Repl');
                    }
                    break;
                case 'workbench.view.extensions':
                    require('vs/workbench/parts/extensions/electron-browser/extensionsViewlet').ExtensionsViewlet
                    .prototype.getTableActions=function(){
                        return _this.getIconActions(this,'Extensions');
                    }
                    break;
                case 'workbench.view.debug':
                    require('vs/workbench/parts/debug/browser/debugViewlet').DebugViewlet
                    .prototype.getTableActions=function(){
                        return _this.getIconActions(this,'Debug');
                    }
                    break;
                case 'workbench.view.git':
                    require('vs/workbench/parts/git/browser/gitViewlet').GitViewlet
                    .prototype.getTableActions=function(){
                        return _this.getIconActions(this,'Git');
                    }
                    break;
                case 'workbench.view.search':
                    require('vs/workbench/parts/search/browser/searchViewlet').SearchViewlet
                    .prototype.getTableActions=function(){
                        return _this.getIconActions(this,'Search');
                    }
                    break;
                case 'workbench.view.explorer':
                     require('vs/workbench/parts/files/browser/explorerViewlet').ExplorerViewlet
                    .prototype.getTableActions=function(){
                        return _this.getIconActions(this,'Explorer');
                    }
                    break;
            }
        }
        function initTableBarActions(composite){
            if(composite.hasTableActions){
                return;
            }
            switch(composite.id){
                case 'workbench.editors.stringEditor':
                case 'workbench.panel.markers':
                case 'workbench.panel.terminal':
                case 'workbench.panel.repl':
                    composite.hasTableActions=true;
                    break;
                case 'workbench.view.extensions':
                case 'workbench.view.debug':
                case 'workbench.view.git':
                case 'workbench.view.search':
                case 'workbench.view.explorer':
                    composite.hasTableActions=true;
                    composite.toolbarleft=true;
                    break;
                default:
                    console.log(composite.id);
            }
        }

        var hideActiveComposite=CompositePart.prototype.hideActiveComposite;
        CompositePart.prototype.hideActiveComposite = function () {
            var _this=this;
            var ret=hideActiveComposite.call(this);
            ret.then(function(){
                try{
                    _this.tableBar.clearChildren();
                }catch(e){
                    console.log(e);
                }
            });
            return ret;
        };
        var tableBars=[];
        var hideActivityBar=this.setting.hideActivityBar;
        var activityActionItems={
            updateBadge:function(that,badge){
                var name=that._action._id;
                var $badgeContent=this.$badgeContents[name];
                if(!$badgeContent){
                    return;
                }
                var $badge=this.$badges[name];
                if (badge) {
                    // Number
                    if (badge instanceof activityService.NumberBadge) {
                        var n = badge.number;
                        if (n) {
                            $badgeContent.text(n > 99 ? '99+' : n.toString());
                            $badge.show();
                        }
                    }
                    else if (badge instanceof activityService.TextBadge) {
                        $badgeContent.text(badge.text);
                        $badge.show();
                    }
                    else if (badge instanceof activityService.IconBadge) {
                        $badge.show();
                    }
                    else if (badge instanceof activityService.ProgressBadge) {
                        $badge.show();
                    }
                }
            },
            $badgeContents:{},
            $badges:{}
        }
        var updateBadge=ActivityActionItem.prototype.updateBadge;
        ActivityActionItem.prototype.updateBadge=function(badge){
            activityActionItems.updateBadge(this,badge);
            updateBadge.call(this,badge);
        }

        var collectCompositeActions=CompositePart.prototype.collectCompositeActions;
        CompositePart.prototype.collectCompositeActions = function (composite) {
            var _this=this;
            var ret=collectCompositeActions.call(this,composite);
            initTableBarActions(composite);
            if(composite.hasTableActions){
                if(!_this.tableBar){

                    var element=document.createElement('div');
                    var barBox=this.titleLabel.parent();
                    if(composite.toolbarleft){
                        barBox=barBox.parent();
                    }else{
                        this.titleLabel.addClass('hidden');
                    }
                    barBox.parent().getHTMLElement().insertBefore(element,barBox.getHTMLElement());
                    var toolbar=new builder_1.Builder(element);
                    toolbar.addClass('monaco-toolbar');
                    toolbar.div({class:'monaco-action-bar animated'},(div)=>{
                        div.style('text-align','left');
                        if(composite.toolbarleft){
                            if(!hideActivityBar){
                                div.addClass('hidden');
                            }
                            tableBars.push(toolbar);
                        }
                        _this.tableBar=div;
                        div.div({},(div)=>{
                            _this.tableBarBox=div;
                        });
                    });
                }
                return function(){
                    ret();
                    if(!composite.getTableActions){
                        setTableBarActions(composite);
                    }
                    var tableActions=composite.getTableActions();
                    try{
                        _this.tableBar.clearChildren();
                    }catch(e){
                        console.log(e);
                    }
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
                            if(composite.toolbarleft){
                                var name=element.viewletId+'.activity-bar-action';
                                div.div({
                                    class:'full',
                                    title:element.tooltip
                                },$badge=>{
                                    activityActionItems.$badges[name]=$badge;
                                    $badge.div({
                                        class:'turtle-badge-content'
                                    },$badgeContent=>{
                                        activityActionItems.$badgeContents[name]=$badgeContent;
                                    });
                                });
                            }
                        });
                    });
                }
            }else{
                return ret;
            }
        }

        var startup=Workbench.prototype.startup;
        Workbench.prototype.startup=function(callbacks){
            startup.call(this,callbacks);
            vsturtle.workbench=this;
        }


        var createContentArea=ActivitybarPart.prototype.createContentArea;
        ActivitybarPart.prototype.createContentArea=function(div){
            var ret=createContentArea.call(this,div);
            vsturtle.activitybar=vsturtle.builder_1.$(ret.getHTMLElement().parentNode);
            return ret;
        }
        /**
         * 初始化界面
         */
        workbenchShell.contentsContainer = workbenchShell.createContents(builder_1.$(workbenchShell.content));

        var prototypeLayout=vsturtle.workbench.workbenchLayout.__proto__;
        var layout=prototypeLayout.layout;
        var workbenchLayout=null;

        var Dimension=builder_1.Dimension;
        var activityBarDimension=function(width,height){
            this.width=width;
            this.height=height-35;
        }
        activityBarDimension.prototype=Dimension.prototype;

        var siderBarDimension=function(width,height){
            this.width=0;
            this.height=height;
        }
        siderBarDimension.prototype=Dimension.prototype;

        var editBarDimension=function(width,height){
            this.width=width;
            this.height=height+35;
        }
        editBarDimension.prototype=Dimension.prototype;

        function layout2(){
            var count=0;
            workbenchLayout=this;
            builder_1.Dimension=function(width,height){
                count++;
                if(count===1){
                    return new activityBarDimension(width,height);
                }else if(count===2){
                    workbenchLayout.computedStyles.activitybar.minWidth=0;
                    return new siderBarDimension(width,height);
                }else if(count===4){
                    builder_1.Dimension=Dimension;
                    return new editBarDimension(width,height);
                }else{
                    return new Dimension(width,height);
                }
            }
            layout.call(this);
        }
        function fHideActivityBar(){
            vsturtle.activitybar.addClass('hidden');
            prototypeLayout.layout=layout2;
            tableBars.forEach((element)=>{
                return element.removeClass("hidden");
            });
            vsturtle.workbench.layout();
            vsturtle.workbench.layout();
        }
        function fShowActivityBar(){

            vsturtle.activitybar.removeClass('hidden');
            prototypeLayout.layout=layout;
            workbenchLayout.computedStyles.activitybar.minWidth=50;
            tableBars.forEach((element)=>{
                return element.addClass("hidden");
            });
            vsturtle.workbench.layout();
            vsturtle.workbench.layout();
        }
        function updateActivityBarState(state){
            hideActivityBar=state;
            _this.readSetting();
            _this.setting.hideActivityBar=state;
            _this.saveSetting();
        }
        function fToggleActivityPanel() {
            if(hideActivityBar){
                updateActivityBarState(false);
                fShowActivityBar();
            }else{
                updateActivityBarState(true);
                fHideActivityBar();
            }
        }
        ipc.on('turtle:toggleActivityPanel',fToggleActivityPanel );
        vsturtle.message.CommandsRegistry.registerCommand('turtle.toggleSideBar',fToggleActivityPanel);
        if(hideActivityBar){
            fHideActivityBar();
        }
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
    },
    getIconActions:function(panel,panelName){
        if (!panel.IconActions){
            var extensions=panel.instantiationService.createInstance(this.iconBarAction.Extensions);
            var git=panel.instantiationService.createInstance(this.iconBarAction.Git);
            var search=panel.instantiationService.createInstance(this.iconBarAction.Search);
            var explorer=panel.instantiationService.createInstance(this.iconBarAction.Explorer);
            var debug=panel.instantiationService.createInstance(this.iconBarAction.Debug);
            switch(panelName){
                case 'Extensions':
                    extensions.enabled=false;
                    break;
                case 'Git':
                    git.enabled=false;
                    break;
                case 'Search':
                    search.enabled=false;
                    break;
                case 'Explorer':
                    explorer.enabled=false;
                    break;
                case 'Debug':
                    debug.enabled=false;
                    break;
            }
            panel.IconActions = [
                explorer,search,git,debug,extensions
            ];
        }
        return panel.IconActions;
    }
};
$1`
};
