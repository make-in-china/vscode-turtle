"use strict";
/// <reference path="../typings/node.d.ts" />
var os = require('os');
function default_1() {
    var appPath = process.env.APPDATA;
    if (!appPath) {
        if (process.platform === 'darwin') {
            appPath = process.env.HOME + '/Library/Application Support';
        }
        else if (process.platform === 'linux') {
            appPath = os.homedir() + '/.config';
        }
        else {
            appPath = '/let/local';
        }
    }
    return appPath;
}
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = default_1;
;

//# sourceMappingURL=../maps/vscodePath.js.map
