import { Component, AfterViewInit } from '@angular/core';
import { ElectronService } from './providers/electron.service';
import { TranslateService } from '@ngx-translate/core';
import { AppConfig } from '../environments/environment';
import * as vex from 'vex-js';
import * as vexDialog from 'vex-dialog';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements AfterViewInit {
  constructor(public electronService: ElectronService, private translate: TranslateService) {
    translate.setDefaultLang('en');
    console.log('AppConfig', AppConfig);

    if (electronService.isElectron()) {
      console.log('Mode electron');
      console.log('Electron ipcRenderer', electronService.ipcRenderer);
      console.log('NodeJS childProcess', electronService.childProcess);
    } else {
      console.log('Mode web');
    }

    vex.registerPlugin(vexDialog);
    vex.defaultOptions.className = 'vex-theme-os';
  }

  ngAfterViewInit(): void {
    setTimeout(() => {
      const loading = document.querySelector('.loading-container') as HTMLDivElement;
      loading.style.display = 'none';

      console.info('Vecomic initialized.');
    }, 0);
  }
}
