import { Injectable } from '@angular/core';

// If you import a module but never use any of the imported values other than as TypeScript types,
// the resulting javascript file will look as if you never imported the module at all.
import { ipcRenderer, webFrame, remote } from 'electron';
import * as childProcess from 'child_process';
import * as fs from 'fs';
import * as path from 'path';
import {AppConfig} from '../../environments/environment';

export enum PRINT_MODE{
  MAIN = 'main',
  WORKER = 'worker'
}
export enum PRINT_OPT{
  LANDSCAPE = 'landscape'
}

@Injectable()
export class ElectronService {
    public readonly PRINT_MODE = PRINT_MODE;
    public readonly PRINT_OPT = PRINT_OPT;

    ipcRenderer: typeof ipcRenderer;
    webFrame: typeof webFrame;
    remote: typeof remote;
    childProcess: typeof childProcess;
    fs: typeof fs;
    path: typeof path;

    constructor() {
        // Conditional imports
        if (this.isElectron()) {
            this.ipcRenderer = window.require('electron').ipcRenderer;
            this.webFrame = window.require('electron').webFrame;
            this.remote = window.require('electron').remote;

            this.childProcess = window.require('child_process');
            this.fs = window.require('fs');
            this.path = window.require('path');

            //ipcMain 로그 출력용
            ipcRenderer.on('ipcMain-log', (event, result) => {
                console.log("from ipcMain == >", result);
            });
        }
    }

    isElectron = () => {
        return window && window.process && window.process.type;
    };

    public readyPrint(target, printMode = '', opt = ''): void {
        let etc = {
            setPageSize: undefined,
            setPageMargin: undefined,
            isSilent: true,
            backupData: undefined,
        };

        if (opt == PRINT_OPT.LANDSCAPE) {
            etc.setPageSize = 'A4 landscape';
            etc.setPageMargin = '0.1cm';
            etc.isSilent = false;
            alert("인쇄 방향(레이아웃)을 '가로'로 변경 후 인쇄 해주세요.");
        }

        if (printMode == PRINT_MODE.MAIN) {   //메인윈도우에서 인쇄(엘리멘트 복사 없음!)
            this.startPrint(printMode, '', '', etc);
        } else {   //워커윈도우에서 인쇄(엘리멘트 복사)
            let headContent = document.getElementsByTagName('head')[0].innerHTML;
            if (AppConfig.production) {
                headContent = headContent.replace('<link rel="stylesheet" href="', '<link rel="stylesheet" href="../../dist/');
            }
            let cloneEl = document.getElementById(target).innerHTML;

            //target의 input, select 태그 value 저장
            let backupValues = {};
            let selectEls = document.querySelectorAll('#' + target + ' input, #' + target + ' select') as any as Array<HTMLElement>;
            selectEls.forEach(function (el) {
                backupValues[el.id] = (el as HTMLInputElement).value;
            });
            etc.backupData = backupValues;

            this.startPrint(printMode, headContent, cloneEl, etc);
        }
    }

    startPrint(printMode, head, el, etc): void {
        let printData = {
            type: 'print',
            head: head,
            el: el,
            etc: etc
        };
        if (printMode == PRINT_MODE.MAIN) {
            printData.type = 'printByMain';
        } else {
            printData.type = 'printByWorker';
        }

        ipcRenderer.once('mainprocess-response', (event, result) => {
            console.log(result);
        });

        ipcRenderer.send('request-mainprocess-action', printData);
    }

}
