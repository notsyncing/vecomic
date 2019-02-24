import { Injectable } from "@angular/core";
import * as fs from 'fs';
import * as fsPath from 'path';
import { Comic, ComicData } from "./models/comic-models";

@Injectable()
export class ComicManager {
  create(path: string): Comic {
    if (!fs.existsSync(path)) {
      fs.mkdirSync(path);
    }

    const manifestPath = fsPath.join(path, 'manifest.json');

    if (fs.existsSync(manifestPath)) {
      fs.unlinkSync(manifestPath);
    }

    const defaultManifest: ComicData = {
      title: 'Untitled',
      pages: []
    };

    fs.writeFileSync(manifestPath, JSON.stringify(defaultManifest));

    const comic = this.open(path);

    comic.addPage();

    comic.save();

    return comic;
  }

  open(path: string): Comic {
    const manifestPath = fsPath.join(path, 'manifest.json');
    const comicData = JSON.parse(fs.readFileSync(manifestPath, 'utf-8')) as ComicData;
    const comic = new Comic(comicData, path);

    return comic;
  }
}
