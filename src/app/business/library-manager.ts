import { Injectable } from "@angular/core";
import { Library, LibraryData } from "./models/library-models";
import * as fs from "fs";
import * as fsPath from "path";
import { remote } from 'electron';

@Injectable()
export class LibraryManager {
  private searchPaths: string[] = [];
  private libraries: Library[] = [];
  private libraryPathMap: Map<string, Library> = new Map();

  get loadedLibraries(): Library[] {
    return this.libraries;
  }

  constructor() {
    this.searchPaths.push(fsPath.join(remote.app.getAppPath(), 'static/libraries'));

    this.loadFrom('$/base');
  }

  private registerLibrary(path: string, library: Library): void {
    if (!this.libraries.includes(library)) {
      this.libraries.push(library);
    }

    this.libraryPathMap.set(path, library);
  }

  loadFrom(path: string, reload: boolean = false): Library {
    if (!reload) {
      if (this.libraryPathMap.has(path)) {
        console.warn(`Library ${path} is already loaded, skip loading.`);
        return this.libraryPathMap.get(path);
      }
    }

    if (path.startsWith('$/')) {
      for (const p of this.searchPaths) {
        const lib = this.loadFrom(fsPath.join(p, path.substring(2)), reload);

        if (lib) {
          this.registerLibrary(path, lib);
          return lib;
        }
      }

      console.warn(`Cannot find ${path} in any search paths, skip loading.`);
      return null;
    }

    const manifestPath = fsPath.join(path, 'library.json');

    if (!fs.existsSync(manifestPath)) {
      console.warn(`No library.json in path ${path}, skip loading.`);
      return null;
    }

    const libData = JSON.parse(fs.readFileSync(manifestPath, 'utf-8')) as LibraryData;
    const lib = new Library(libData, path);
    this.registerLibrary(path, lib);

    return lib;
  }
}
