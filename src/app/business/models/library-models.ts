import * as fs from 'fs';
import * as fsPath from 'path';

export interface LibraryData {
  name: string;
  version: number;
  components: LibraryComponentData[];
}

export interface LibraryComponentData {
  name: string;
  path: string;
}

export class Library {
  private _components: LibraryComponent[];

  get components(): LibraryComponent[] {
    return this._components;
  }

  constructor(private data: LibraryData, private _path: string) {
    if (!data.components) {
      data.components = [];
    }

    this._components = data.components.map(d => new LibraryComponent(d, _path));

    console.info(`Loaded ${data.components.length} components of library ${data.name} (${data.version}) from ${_path}`);
  }
}

export class LibraryComponent {
  private _content: string;

  get content(): string {
     return this._content;
  }

  constructor(private data: LibraryComponentData, private libPath: string) {
    this.reload();
  }

  reload(): void {
    const contentFile = fsPath.join(this.libPath, this.data.path);

    if (!fs.existsSync(contentFile)) {
      console.warn(`Library component file ${contentFile} not exists, skip loading.`);
      return;
    }

    this._content = fs.readFileSync(contentFile, 'utf-8');

    console.info(`Loaded component ${contentFile} from library ${this.data.name}`);
  }
}
