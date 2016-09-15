
/// <reference path="../typings/builder.d.ts" />
import {ISetting,ISettingJSON} from './settings'
declare var vsturtle:ITurtle;
declare function __extends(d, b):void;
declare var define:any;
declare var ipc:any;
declare var fs:any;
declare var document:any;
declare var Reflect:any;
export interface IWorkbenchTurtle extends ITurtle{
    __decorate:(decorators, target, key?:string, desc?:string)=>any
    __param:(paramIndex, decorator)=>(target, key)=>any
    activitybar:Builder
    getIconActions:(panel,panelName:string)=>any[]
    getTableActions:(panel,panelName:string)=>any[]
    tableBarAction:{
        DebugConsole:any
        OutPut:any
        Probrems:any
        IntegratedTerminal:any
    }
    iconBarAction:{
        Extensions:any
        Git:any
        Search:any
        Explorer:any
        Debug:any
    }
    nls:any
    workbench:any
    builder:{$:QuickBuilder}
    dom:any
}
export interface ITurtle{
    settingPath:string
    version:string
    setting:ISettingJSON
    readSetting(this:ITurtle):void
    saveSetting(this:ITurtle):void
    loadPlugins(this:ITurtle):void
};

function readSetting():void{
    try{
        var fs=require('fs');
        var datas = fs.readFileSync(this.settingPath);
        this.setting=JSON.parse(<any>datas);
        if(this.setting){

            if(this.setting.hideActivityBar===undefined){
                this.setting.hideActivityBar=false;
            }else{
                this.setting.hideActivityBar=!!this.setting.hideActivityBar;
            }
        }else{
            this.setting={
                version: this.status,
                status: 'enabled',
                scriptPaths:null,
                hideActivityBar:false
            }
        }
    }catch(e){
        this.setting={
            version: this.status,
            status: 'enabled',
            scriptPaths:null,
            hideActivityBar:false
        }
    }
}
function saveSetting():void{
    try{
        var fs=require('fs');
        if(this.setting){
            var datas = JSON.stringify(this.setting);
            fs.writeFileSync(this.settingPath,datas);
        }
    }catch(e){
        console.log(e);
    }
}
function loadPlugins(){
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
}

export function getTop(vars:ISetting):string{
    return `/*!--------------------------------------------------------
 * vscode-turtle
 *--------------------------------------------------------*/
vsturtle = {
    settingPath:'${vars.settingsPath.replace(/\\/g,'/')}',
    version:'${vars.extVersion}',
    setting:null,
    readSetting:${readSetting},
    saveSetting:${saveSetting},
    loadPlugins:${loadPlugins},`;
}

function createVSCodeMenu(main,what,VSCodeMenu,windowsService){
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

            vsturtle.readSetting();
            if(vsturtle.setting.status!=='enabled'){
                throw new Error('未激活!卸载后没有完全关闭所有VSC!');
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
        var _this=this;
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
export function getMain(top:string){
    return `${top}
    createVSCodeMenu:${createVSCodeMenu}
};
$1`
};
function decorate(decorators, target, key, desc):any {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
}
function param(paramIndex, decorator):(target, key)=>any {
    return function (target, key) { decorator(target, key, paramIndex); }
}
function getIconActions(panel,panelName:string):any[]{
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
function getTableActions(panel,panelName:string):any[]{
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



function registerPlugin(name,sourcePath){

}
function unRegisterPlugin(name){

}
export function getWorkbench(top:string){
    return `${top}
    nls:null,
    workbench:null,
    builder:null,
    dom:null,
    registerPlugin:${registerPlugin},
    unRegisterPlugin:${unRegisterPlugin},
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
        Explorer:null,
        Debug:null
    },
    __decorate:${decorate},
    __param:${param},
    init:${init},
    getTableActions:${getTableActions},
    getIconActions:${getIconActions}
};
$1`
};
function init(workbenchShell,nls,platform,builder,dom){
    var _this:IWorkbenchTurtle=this;
    _this.builder=builder;
    _this.dom=dom;

    _this.loadPlugins();
    //修改CompositePart 和 4个panel;
    var CommandsRegistry=require('vs/platform/commands/common/commands').CommandsRegistry;
    var partService=require('vs/workbench/services/part/common/partService')
    var IPartService=partService.IPartService;
    var IPanelService=require('vs/workbench/services/panel/common/panelService').IPanelService;
    var ITerminalService=require('vs/workbench/parts/terminal/electron-browser/terminal').ITerminalService;
    var IViewletService=require('vs/workbench/services/viewlet/common/viewletService').IViewletService;
    var IWorkbenchEditorService=require('vs/workbench/services/editor/common/editorService').IWorkbenchEditorService;
    var TPromise=require('vs/base/common/winjs.base').TPromise;
    var storage=require('vs/platform/storage/common/storage');



    var Workbench=require('vs/workbench/electron-browser/workbench').Workbench;
    var CompositePart=require('vs/workbench/browser/parts/compositePart').CompositePart;
    var ActivitybarPart=require('vs/workbench/browser/parts/activitybar/activitybarPart').ActivitybarPart;
    var ActivityActionItem=require('vs/workbench/browser/parts/activitybar/activityAction').ActivityActionItem;
    var Action=require('vs/base/common/actions').Action;

    var viewlet=require('vs/workbench/browser/viewlet');
    var activityService=require('vs/workbench/services/activity/common/activityService');

    define('tablebar',['vs/nls!vs/workbench/workbench.turtle','vs/css!vs/workbench/media/tablebar'],function(nlsturtle){
        _this.nls=nlsturtle.tableBar;
    });
    var __decorate=_this.__decorate;
    var __param=_this.__param;
    var DebugConsole = (function (_super) {
        __extends(DebugConsole, _super);
        function DebugConsole(partService, panelService) {
            _super.call(this, (<any>DebugConsole).ID, _this.nls[0], 'switchDebug', true);
            this.partService = partService;
            this.panelService = panelService;
            this.tooltip = _this.nls[0];
        }
        DebugConsole.prototype.run = function () {
            if (this.isReplVisible()) {
                this.partService.setPanelHidden(true);
                return TPromise.as(null);
            }
            return this.panelService.openPanel('workbench.panel.repl', true);
        };
        DebugConsole.prototype.isReplVisible = function () {
            var panel = this.panelService.getActivePanel();
            return panel && panel.getId() === 'workbench.panel.repl';
        };
        (<any>DebugConsole).ID = 'workbench.action.tablebar.switchDebug';
        return __decorate([
            __param(0, IPartService),
            __param(1, IPanelService)
        ], DebugConsole);
    }(Action));

    var OutPut = (function (_super) {
        __extends(OutPut, _super);
        function OutPut(partService, panelService) {
            _super.call(this, (<any>OutPut).ID, _this.nls[1], 'switchOutput', true);
            this.partService = partService;
            this.panelService = panelService;
            this.tooltip = _this.nls[1];
        }
        OutPut.prototype.run = function () {
            if (this.isReplVisible()) {
                this.partService.setPanelHidden(true);
                return TPromise.as(null);
            }
            return this.panelService.openPanel('workbench.panel.output', true);
        };
        OutPut.prototype.isReplVisible = function () {
            var panel = this.panelService.getActivePanel();
            return panel && panel.getId() === 'workbench.panel.output';
        };
        (<any>OutPut).ID = 'workbench.action.tablebar.switchOutPut';
        return __decorate([
            __param(0, IPartService),
            __param(1, IPanelService)
        ], OutPut);
    }(Action));

    var Probrems = (function (_super) {
        __extends(Probrems, _super);
        function Probrems(partService, panelService) {
            _super.call(this, (<any>Probrems).ID, _this.nls[2], 'switchProbrems', true);
            this.partService = partService;
            this.panelService = panelService;
            this.tooltip = _this.nls[2];
        }
        Probrems.prototype.run = function () {
            if (this.isReplVisible()) {
                this.partService.setPanelHidden(true);
                return TPromise.as(null);
            }
            return this.panelService.openPanel('workbench.panel.markers', true);
        };
        Probrems.prototype.isReplVisible = function () {
            var panel = this.panelService.getActivePanel();
            return panel && panel.getId() === 'workbench.panel.markers';
        };
        (<any>Probrems).ID = 'workbench.action.tablebar.Probrems';
        return __decorate([
            __param(0, IPartService),
            __param(1, IPanelService)
        ], Probrems);
    }(Action));

    var IntegratedTerminal = (function (_super) {
        __extends(IntegratedTerminal, _super);
        function IntegratedTerminal(terminalService) {
            _super.call(this, (<any>IntegratedTerminal).ID, _this.nls[3], 'switchIntegratedTerminal', true);
            this.terminalService = terminalService;
            this.tooltip = _this.nls[3];
        }
        IntegratedTerminal.prototype.run = function () {
            return this.terminalService.toggle();
        };
        (<any>IntegratedTerminal).ID = 'workbench.action.tablebar.switchIntegratedTerminal';
        return __decorate([
            __param(0, ITerminalService)
        ], IntegratedTerminal);
    }(Action));

    _this.tableBarAction.DebugConsole=DebugConsole;
    _this.tableBarAction.OutPut=OutPut;
    _this.tableBarAction.Probrems=Probrems;
    _this.tableBarAction.IntegratedTerminal=IntegratedTerminal;


    var makeAction=function (className,viewletID,nlsIndex){
        return (function (_super) {
            __extends(Action, _super);
            function Action( viewletService, editorService) {
                _super.call(this, viewletID+'.action', '', viewletID, viewletService, editorService);
                this.tooltip = _this.nls[nlsIndex];
                this.class=className+' minicon';
                this.enabled=true;
            }
            return __decorate([
                __param(0, IViewletService),
                __param(1, IWorkbenchEditorService)
            ], Action);
        }(viewlet.ToggleViewletAction))
    }

    _this.iconBarAction.Explorer=makeAction('explorer2','workbench.view.explorer',7);
    _this.iconBarAction.Search=makeAction('search2','workbench.view.search',6);
    _this.iconBarAction.Git=makeAction('git2','workbench.view.git',5);
    _this.iconBarAction.Debug=makeAction('debug2','workbench.view.debug',8);
    _this.iconBarAction.Extensions=makeAction('extentions2','workbench.view.extensions',4);

    var setTableBarActions=function(composite){
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
    var initTableBarActions=function(composite){
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
    var hideActivityBar=_this.setting.hideActivityBar;
    var isToolbarHide=_this.setting.hideToolBar;
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
                var toolbar=new builder.Builder(element);
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
        _this.workbench=this;
    }


    var createContentArea=ActivitybarPart.prototype.createContentArea;
    ActivitybarPart.prototype.createContentArea=function(div){
        var ret=createContentArea.call(this,div);
        _this.activitybar=_this.builder.$(ret.getHTMLElement().parentNode);
        return ret;
    }
    /**
     * 初始化界面
     */
    workbenchShell.contentsContainer = workbenchShell.createContents(builder.$(workbenchShell.content));

    var prototypeLayout=_this.workbench.workbenchLayout.__proto__;
    var layout = prototypeLayout.layout;
    var workbenchLayout = null;
    var TOOLBAR_HEIGHT = 30;
    var Dimension=builder.Dimension;
    var DEFAULT_MIN_PART_WIDTH = 170;
    var DEFAULT_MIN_PANEL_PART_HEIGHT = 77;
    var DEFAULT_MIN_PANEL2_PART_HEIGHT = 77;
    var DEFAULT_MIN_EDITOR_PART_HEIGHT = 170;
    var HIDE_SIDEBAR_WIDTH_THRESHOLD = 50;
    var HIDE_PANEL_HEIGHT_THRESHOLD = 50;
	var getVerticalSashLeft = function(sash) {
		var isSidebarHidden = this.partService.isSideBarHidden();
		var sidebarPosition = this.partService.getSideBarPosition();
        var activitybarWidth=hideActivityBar?0:this.computedStyles.activitybar.minWidth;
		if (sidebarPosition === partService.Position.LEFT) {
			return !isSidebarHidden ? this.sidebarWidth + activitybarWidth : activitybarWidth;
		}

		return !isSidebarHidden ? this.workbenchSize.width - this.sidebarWidth - activitybarWidth : this.workbenchSize.width - activitybarWidth;
	}
    
    var getHorizontalSashTop = function (sash) {
        var toolbarHeight=isToolbarHide?0:TOOLBAR_HEIGHT;
        return 2 + toolbarHeight + (this.partService.isPanelHidden() ? this.sidebarHeight : this.sidebarHeight - this.panelHeight);
    };
    var menubarLayout = function (forceStyleReCompute) {
        if (forceStyleReCompute) {
            this.computeStyle();
            this.editor.getLayout().computeStyle();
            this.sidebar.getLayout().computeStyle();
            this.panel.getLayout().computeStyle();
        }
        if (!this.computedStyles) {
            this.computeStyle();
        }
        this.workbenchSize = this.getWorkbenchArea();
        var isSidebarHidden = this.partService.isSideBarHidden();
        var isPanelHidden = this.partService.isPanelHidden();
        var sidebarPosition = this.partService.getSideBarPosition();
        var isStatusbarHidden = this.partService.isStatusBarHidden();
        var toolbarHeight=isToolbarHide?0:TOOLBAR_HEIGHT;
        // Sidebar
        var sidebarWidth;
        if (isSidebarHidden) {
            sidebarWidth = 0;
        }
        else if (this.sidebarWidth !== -1) {
            sidebarWidth = Math.max(this.computedStyles.sidebar.minWidth, this.sidebarWidth);
        }
        else {
            sidebarWidth = this.workbenchSize.width / 5;
            this.sidebarWidth = sidebarWidth;
        }
        var statusbarHeight = isStatusbarHidden ? 0 : this.computedStyles.statusbar.height;
        this.sidebarHeight = this.workbenchSize.height - statusbarHeight-toolbarHeight;
		
		if (hideActivityBar) {
			var sidebarSize = new Dimension(sidebarWidth, this.sidebarHeight-35);
			
		}else{
			var sidebarSize = new Dimension(sidebarWidth, this.sidebarHeight);
		}
        // Activity Bar
		
		var activityBarMinWidth = hideActivityBar?0:this.computedStyles.activitybar.minWidth;
		var activityBarSize = new Dimension(activityBarMinWidth, this.sidebarHeight);
        // Panel part
        var panelHeight;
        if (isPanelHidden) {
            panelHeight = 0;
        }
        else if (this.panelHeight > 0) {
            panelHeight = Math.min(this.sidebarHeight - DEFAULT_MIN_EDITOR_PART_HEIGHT, Math.max(this.computedStyles.panel.minHeight, this.panelHeight));
        }
        else {
            panelHeight = this.sidebarHeight * 0.4;
        }
        var panelDimension = new Dimension(this.workbenchSize.width - sidebarSize.width - activityBarSize.width, panelHeight);
        this.panelWidth = panelDimension.width;
        // Editor
        var editorSize = {
            width: 0,
            height: 0,
            remainderLeft: 0,
            remainderRight: 0
        };
        var editorDimension = new Dimension(panelDimension.width, activityBarSize.height - panelDimension.height);
        editorSize.width = editorDimension.width;
        editorSize.height = editorDimension.height;
        // Sidebar hidden
        if (isSidebarHidden) {
            editorSize.width = Math.min(this.workbenchSize.width - activityBarSize.width, this.workbenchSize.width - activityBarMinWidth);
            if (sidebarPosition === partService.Position.LEFT) {
                editorSize.remainderLeft = Math.round((this.workbenchSize.width - editorSize.width + activityBarSize.width) / 2);
                editorSize.remainderRight = this.workbenchSize.width - editorSize.width - editorSize.remainderLeft;
            }
            else {
                editorSize.remainderRight = Math.round((this.workbenchSize.width - editorSize.width + activityBarSize.width) / 2);
                editorSize.remainderLeft = this.workbenchSize.width - editorSize.width - editorSize.remainderRight;
            }
        }
        // Assert Sidebar and Editor Size to not overflow
        var editorMinWidth = this.computedStyles.editor.minWidth;
        var visibleEditorCount = this.editorService.getVisibleEditors().length;
        if (visibleEditorCount > 1) {
            editorMinWidth *= visibleEditorCount;
        }
        if (editorSize.width < editorMinWidth) {
            var diff = editorMinWidth - editorSize.width;
            editorSize.width = editorMinWidth;
            panelDimension.width = editorMinWidth;
            sidebarSize.width -= diff;
            sidebarSize.width = Math.max(DEFAULT_MIN_PART_WIDTH, sidebarSize.width);
        }
        if (!isSidebarHidden) {
            this.sidebarWidth = sidebarSize.width;
            this.storageService.store('workbench.sidebar.width', this.sidebarWidth, storage.StorageScope.GLOBAL);
        }
        if (!isPanelHidden) {
            this.panelHeight = panelDimension.height;
            this.storageService.store('workbench.panel.height', this.panelHeight, storage.StorageScope.GLOBAL);
        }
        // Workbench
        this.workbenchContainer
            .position(this.options.margin.top, this.options.margin.right, this.options.margin.bottom, this.options.margin.left, 'relative')
            .size(this.workbenchSize.width, this.workbenchSize.height);
        // Bug on Chrome: Sometimes Chrome wants to scroll the workbench container on layout changes. The fix is to reset scrollTop in this case.
        if (this.workbenchContainer.getHTMLElement().scrollTop > 0) {
            this.workbenchContainer.getHTMLElement().scrollTop = 0;
        }
        // Editor Part and Panel part
        this.editor.getContainer().size(editorSize.width, editorSize.height);
        this.panel.getContainer().size(panelDimension.width, panelDimension.height);
        var editorBottom = statusbarHeight + panelDimension.height;
        if (isSidebarHidden) {
            this.editor.getContainer().position(toolbarHeight, editorSize.remainderRight, editorBottom, editorSize.remainderLeft);
            this.panel.getContainer().position(this.workbenchSize.height-statusbarHeight-panelDimension.height, editorSize.remainderRight, statusbarHeight, editorSize.remainderLeft);
        }
        else if (sidebarPosition === partService.Position.LEFT) {
            this.editor.getContainer().position(toolbarHeight, 0, editorBottom, sidebarSize.width + activityBarSize.width);
            this.panel.getContainer().position(this.workbenchSize.height-statusbarHeight-panelDimension.height, 0, statusbarHeight, sidebarSize.width + activityBarSize.width);
        }
        else {
            this.editor.getContainer().position(toolbarHeight, sidebarSize.width, editorBottom, 0);
            this.panel.getContainer().position(this.workbenchSize.height-statusbarHeight-panelDimension.height, sidebarSize.width, statusbarHeight, 0);
        }
        // Activity Bar Part
        this.activitybar.getContainer().size(null, activityBarSize.height);
        if (sidebarPosition === partService.Position.LEFT) {
            this.activitybar.getContainer().getHTMLElement().style.right = '';
            this.activitybar.getContainer().position(toolbarHeight, null, 0, 0);
        }
        else {
            this.activitybar.getContainer().getHTMLElement().style.left = '';
            this.activitybar.getContainer().position(toolbarHeight, 0, 0, null);
        }
        // Sidebar Part
        this.sidebar.getContainer().size(sidebarSize.width, this.sidebarHeight);
        if (sidebarPosition === partService.Position.LEFT) {
            this.sidebar.getContainer().position(toolbarHeight, editorSize.width, toolbarHeight, activityBarSize.width);
        }
        else {
            this.sidebar.getContainer().position(toolbarHeight, null, toolbarHeight, editorSize.width);
        }
        // Statusbar Part
        this.statusbar.getContainer().position(this.workbenchSize.height - statusbarHeight);
        // Quick open
        this.quickopen.layout(this.workbenchSize);
        // Sashes
        this.sashX.layout();
        this.sashY.layout();
        // Propagate to Part Layouts
        this.editor.layout(new Dimension(editorSize.width, editorSize.height));
        this.sidebar.layout(sidebarSize);
        this.panel.layout(panelDimension);
        // Propagate to Context View
        this.contextViewService.layout();
    };
    var fHideActivityBar=function(){
        _this.activitybar.addClass('hidden');
        tableBars.forEach((element)=>{
            return element.removeClass("hidden");
        });
        _this.workbench.layout();
        _this.workbench.layout();
    }
    var fShowActivityBar=function(){

        _this.activitybar.removeClass('hidden');
        tableBars.forEach((element)=>{
            return element.addClass("hidden");
        });
        _this.workbench.layout();
        _this.workbench.layout();
    }
    var updateActivityBarState=function(state){
        hideActivityBar=state;
        _this.readSetting();
        _this.setting.hideActivityBar=state;
        _this.saveSetting();
    }
    var fToggleActivityPanel=function () {
        if(hideActivityBar){
            updateActivityBarState(false);
            fShowActivityBar();
        }else{
            updateActivityBarState(true);
            fHideActivityBar();
        }
    }
    var fToggleToolbar=function(){
        isToolbarHide=!isToolbarHide;
        _this.workbench.layout();
    }
    ipc.on('turtle:toggleActivityPanel', fToggleActivityPanel);
    CommandsRegistry.registerCommand('turtle.toggleSideBar', fToggleActivityPanel);
    ipc.on('turtle:toggleToolBar', fToggleToolbar);
    CommandsRegistry.registerCommand('turtle.toggleToolBar', fToggleToolbar);
    prototypeLayout.layout = menubarLayout;
	prototypeLayout.getVerticalSashLeft=getVerticalSashLeft;
	prototypeLayout.getHorizontalSashTop=getHorizontalSashTop;
    
    if (hideActivityBar) {
        fHideActivityBar();
    }else {
        _this.workbench.layout();
    }
}