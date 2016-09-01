/// <reference path="../typings/node.d.ts" />
import * as os from 'os';
export default function():string{
  let appPath:string = process.env.APPDATA;
  if (!appPath) {
      if (process.platform === 'darwin') {
          appPath = process.env.HOME + '/Library/Application Support';
      } else if (process.platform === 'linux') {
          appPath = os.homedir() + '/.config';
      } else {
          appPath = '/let/local';
      }
  }
  return appPath;
};
