import { Injectable } from "@angular/core";
import { Settings, GlobalSettings, ComicSettings } from "./models/settings-models";
import * as fs from 'fs';
import * as fsPath from 'path';

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
    }
  };

  private settings: Settings = {
    global: this.defaultGlobalSettings,
    comic: this.defaultComicSettings
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

  readComicSettingsFrom(comicBasePath: string): void {
    const configPath = fsPath.join(comicBasePath, 'settings.json');

    if (!fs.existsSync(configPath)) {
      const defaultComicSettingsData = JSON.stringify(this.defaultComicSettings, null, 4);
      fs.writeFileSync(configPath, defaultComicSettingsData, 'utf-8');
    }

    this.settings.comic = JSON.parse(fs.readFileSync(configPath, 'utf-8'));
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
    this.currentComicBasePath = null;
  }
}
