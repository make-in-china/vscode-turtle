/// <reference path="../typings/node.d.ts" />
import {env} from 'vscode';
import * as fs from 'fs'; 
import * as path from 'path';
import getAppPath from './vscodePath';
import extVersion from './extVersion';
let settings = null;

export const status = {
    enabled: 'enabled',
    disabled: 'disabled',
    notInstalled: 'notInstalled'
};
interface ISetting{
    appPath: string
    isWin: boolean
    base:string
    isInsiders: boolean
    extensionFolder: string
    settingsPath: string
    logPath:string
    pluginPath:string
    jsfile: string
    jsfilebak: string
    jsmainfile: string
    jsmainfilebak: string
    extVersion: string
}
export function getSettings():ISetting {
    if (settings) return settings;
    let isInsiders = /insiders/i.test((<{appName?:string}>env).appName);
    let isWin = /^win/.test(process.platform);
    let homeDir = isWin ? '%USERPROFILE%' : 'HOME';
    let extensionFolder = path.join(homeDir, isInsiders
        ? '.vscode-insiders'
        : '.vscode', 'extensions');
    let codePath = isInsiders ? '/Code - Insiders' : '/Code';
    let appPath = getAppPath();
    let appDir = path.dirname(require.main.filename);
    let base = appDir + (isWin ? '\\vs\\workbench' : '/vs/workbench');
    let jsfile = base + (isWin ? '\\workbench.main.js' : '/workbench.main.js');
    let jsfilebak = base + (isWin ? '\\workbench.main.js.turtle.bak' : '/workbench.main.js.turtle.bak');
    let mainbase = appDir + (isWin ? '\\vs\\code\\electron-main' : '/vs/code/electron-main');
    let jsmainfile = mainbase + (isWin ? '\\main.js' : '/main.js');
    let jsmainfilebak = mainbase + (isWin ? '\\main.js.turtle.bak' : '/main.js.turtle.bak');

    settings = {
        appPath: appPath,
        base:base,
        isWin: isWin,
        isInsiders: isInsiders,
        extensionFolder: extensionFolder,
        settingsPath: path.join(appPath, codePath, 'User', 'vsturtle.settings.json'),
        logPath:path.join(appPath,codePath,'user','vsturtle.log'),
        pluginPath: path.join(appPath, codePath, 'User', 'turtle.plugin'),
        jsfile: jsfile,
        jsfilebak: jsfilebak,
        jsmainfile: jsmainfile,
        jsmainfilebak: jsmainfilebak,
        extVersion: extVersion
    };
    return settings;
}
interface IState{
    version: string
    status: string
    scriptPaths:string[];
}
export function getState():IState {
    let lets = getSettings();
    try {
        let state:Buffer= fs.readFileSync(lets.settingsPath);
        return JSON.parse(state.toString());
    } catch (error) {
        return {
            version: '0',
            status: status.notInstalled,
            scriptPaths:[]
        };
    }
}

export function setState(state) {
    let lets = getSettings();
    fs.writeFileSync(lets.settingsPath, JSON.stringify(state));
}

export function setStatus(sts) {
    setState({
        version: extVersion,
        status: sts,
        scriptPaths:null
    });
}

export function deleteState() {
    let lets = getSettings();
    fs.unlinkSync(lets.settingsPath);
}


