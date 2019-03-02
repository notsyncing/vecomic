import { Injectable } from "@angular/core";
import { Settings, GlobalSettings, ComicSettings, SessionSettings, SessionPageSettings } from "./models/settings-models";
import * as fs from 'fs';
import * as fsPath from 'path';
import { Page } from "./models/comic-models";

@Injectable()
export class SettingsManager {
  private defaultGlobalSettings: GlobalSettings = {

  }

  private defaultComicSettings: ComicSettings = {
    grid: {
      bigUnitSize: 80,
      smallUnitSize: 8,

      bigUnitLineWidth: 1,
      smallUnitLineWidth: 0.5,

      bigUnitLineColor: 'gray',
      smallUnitLineColor: 'gray'
    },
    ruler: {
      bigUnitLineWidth: 2,
      smallUnitLineWidth: 0.5,

      bigUnitLineColor: 'black',
      smallUnitLineColor: 'black'
    }
  };

  private defaultSessionSettings: SessionSettings = {
    zoomPercentage: 100,

    perPage: {}
  };

  private defaultSessionPageSettings: SessionPageSettings = {
    hiddenLayers: {}
  };

  private settings: Settings = {
    global: this.defaultGlobalSettings,
    comic: this.defaultComicSettings,
    session: this.defaultSessionSettings
  };

  private currentComicBasePath: string = null;

  constructor() {
    Object.freeze(this.defaultGlobalSettings);
    Object.freeze(this.defaultComicSettings);

    // TODO: Read global settings
  }

  get globalSettings(): GlobalSettings {
    return this.settings.global;
  }

  get comicSettings(): ComicSettings {
    return this.settings.comic;
  }

  set comicSettings(value: ComicSettings) {
    this.settings.comic = value;
  }

  get sessionSettings(): SessionSettings {
    return this.settings.session;
  }

  readComicSettingsFrom(comicBasePath: string): void {
    const configPath = fsPath.join(comicBasePath, 'settings.json');

    if (!fs.existsSync(configPath)) {
      const defaultComicSettingsData = JSON.stringify(this.defaultComicSettings, null, 4);
      fs.writeFileSync(configPath, defaultComicSettingsData, 'utf-8');
    }

    this.settings.comic = JSON.parse(fs.readFileSync(configPath, 'utf-8'));

    for (const key of Object.keys(this.defaultComicSettings)) {
      if (!this.settings.comic[key]) {
        this.settings.comic[key] = this.defaultComicSettings[key];
      }
    }

    this.currentComicBasePath = comicBasePath;
  }

  saveCurrentComicSettings(): void {
    if (!this.currentComicBasePath) {
      throw new Error('No comic base path set!');
    }

    const configPath = fsPath.join(this.currentComicBasePath, 'settings.json');
    fs.writeFileSync(configPath, JSON.stringify(this.settings.comic, null, 4), 'utf-8');

    console.info(`Comic settings saved to ${configPath}`);
  }

  resetComicSettings(): void {
    this.settings.comic = this.defaultComicSettings;
    this.settings.session = this.defaultSessionSettings;
    this.currentComicBasePath = null;
  }

  makeSureSessionPageSettings(pageId: string): void {
    if (Reflect.has(this.sessionSettings.perPage, pageId)) {
      return;
    }

    this.sessionSettings.perPage[pageId] = JSON.parse(JSON.stringify(this.defaultSessionPageSettings));
  }
}
