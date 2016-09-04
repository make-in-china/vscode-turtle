let nls=JSON.parse(process.env.VSCODE_NLS_CONFIG).locale;
let msg:{
    [index: string]: IMessage;
}={
    'zh-cn':{
        welcome:'Turtle 开始加载!',
        install:'正在修改VSCode源码，请稍等.',
        admin: '用管理员权限运行VSCode以启用插件.',
        isEnabled:'Turtle 已经激活.操作无非执行.',
        enabled: 'Turtle 已经激活. 请完全关闭所有打开的VSCodee之后重启更新.',
        disabled: 'Turtle 已经取消激活. 请完全关闭所有打开的VSCode之后重启更新.',
        already_disabled: 'Turtle 已经取消激活.',
        smthingwrong: '发生了一些错误: ',
        toggleSidebarTooltip:'切换左侧面板',
        resourcesAreLoaded:'资源加载完成',
        uninstallWorkBench:'卸载“vs/workbench/workbench.main.js”完成',
        uninstallMain:'卸载“vs/node/electron-main/main.js”完成'
    },
    '':{
        welcome:'vscode-turtle is active!',
        install:'Is injected into the source code to VSCode, please wait a moment.',
        admin: 'Run VS Code with admin privileges so the changes can be applied.',
        isEnabled:'Turtle already enabled.Unable to complete action.',
        enabled: 'Turtle enabled. Fully closed all VSCode to take effect.',
        disabled: 'Turtle disabled. Fully closed all VSCode to take effect.',
        already_disabled: 'Turtle already disabled.',
        smthingwrong: 'Something went wrong: ',
        toggleSidebarTooltip:'toggleSidebar',
        resourcesAreLoaded:'Resources are loaded',
        uninstallWorkBench:'uninstall "vs/workbench/workbench.main.js" is done',
        uninstallMain:'uninstall "vs/node/electron-main/main.js" is done'
    }
}
interface IMessage{
    welcome:string
    admin: string
    enabled: string
    disabled: string
    already_disabled: string
    smthingwrong: string
    toggleSidebarTooltip:string
    resourcesAreLoaded:string
    uninstallWorkBench:string
    uninstallMain:string
    isEnabled:string
    install:string
    
}
export default msg[nls];
