"use strict";
/// <reference path="../typings/node.d.ts" />
var vscode_1 = require('vscode');
var fs = require('fs');
var path = require('path');
var vscodePath_1 = require('./vscodePath');
var extVersion_1 = require('./extVersion');
var settings = null;
exports.status = {
    enabled: 'enabled',
    disabled: 'disabled',
    notInstalled: 'notInstalled'
};
function getSettings() {
    if (settings)
        return settings;
    var isInsiders = /insiders/i.test(vscode_1.env.appName);
    var isWin = /^win/.test(process.platform);
    var homeDir = isWin ? '%USERPROFILE%' : 'HOME';
    var extensionFolder = path.join(homeDir, isInsiders
        ? '.vscode-insiders'
        : '.vscode', 'extensions');
    var codePath = isInsiders ? '/Code - Insiders' : '/Code';
    var appPath = vscodePath_1.default();
    var appDir = path.dirname(require.main.filename);
    var base = appDir + (isWin ? '\\vs\\workbench' : '/vs/workbench');
    var jsfile = base + (isWin ? '\\workbench.main.js' : '/workbench.main.js');
    var jsfilebak = base + (isWin ? '\\workbench.main.js.turtle.bak' : '/workbench.main.js.turtle.bak');
    settings = {
        appPath: appPath,
        isWin: isWin,
        isInsiders: isInsiders,
        extensionFolder: extensionFolder,
        settingsPath: path.join(appPath, codePath, 'User', 'vsturtle.settings.json'),
        pluginPath: path.join(appPath, codePath, 'User', 'turtle.plugin'),
        jsfile: jsfile,
        jsfilebak: jsfilebak,
        extVersion: extVersion_1.default
    };
    return settings;
}
exports.getSettings = getSettings;
function getState() {
    var lets = getSettings();
    try {
        var state = fs.readFileSync(lets.settingsPath);
        return JSON.parse(state.toString());
    }
    catch (error) {
        return {
            version: '0',
            status: exports.status.notInstalled,
            scriptPaths: []
        };
    }
}
exports.getState = getState;
function setState(state) {
    var lets = getSettings();
    fs.writeFileSync(lets.settingsPath, JSON.stringify(state));
}
exports.setState = setState;
function setStatus(sts) {
    setState({
        version: extVersion_1.default,
        status: sts,
        scriptPaths: null
    });
}
exports.setStatus = setStatus;
function deleteState() {
    var lets = getSettings();
    fs.unlinkSync(lets.settingsPath);
}
exports.deleteState = deleteState;

//# sourceMappingURL=../maps/settings.js.map
