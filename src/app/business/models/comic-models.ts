import * as uuid from 'uuid/v4';
import * as fsPath from 'path';
import * as fs from 'fs';

export interface ComicData {
  title: string;
  pages: PageData[];
}

export interface PageData {
  id: string;
  title: string;
  file: string;
}

export class Comic {
  private _pages: Page[] = [];
  private _dirty = false;

  constructor(private data: ComicData, private basePath: string) {
    if (!data.pages) {
      data.pages = [];
    }

    for (const pageData of data.pages) {
      this._pages.push(new Page(this, pageData, this.basePath));
    }
  }

  get path(): string {
    return this.basePath;
  }

  get title(): string {
     return this.data.title;
  }

  set title(value: string) {
    this.data.title = value;
    this.markAsDirty();
  }

  get dirty(): boolean {
    return this._dirty;
  }

  markAsDirty(predicate?: boolean): void {
    if (predicate == null) {
      predicate = true;
    }

    this._dirty = this._dirty || predicate;
  }

  markAsClean(): void {
    this._dirty = false;
  }

  get pages(): Page[] {
    return this._pages;
  }

  addPage(title?: string): Page {
    if (!title) {
      title = 'Untitled';
    }

    const pageId = uuid();
    const pageFileName = pageId + '.svg';
    const pageFile = fsPath.join(this.basePath, pageFileName);

    fs.writeFileSync(pageFile, '', 'utf-8');

    const pageData: PageData = {
      id: pageId,
      title: title,
      file: pageFileName
    };

    this.markAsDirty();

    const page = new Page(this, pageData, this.basePath);

    this._pages.push(page);

    return page;
  }

  removePage(id: string): Page {
    const pageIndex = this._pages.findIndex(p => p.id === id);

    if (pageIndex > 0) {
      this.markAsDirty();

      return this._pages.splice(pageIndex, 1)[0];
    } else {
      throw `Page with ID ${id} is not found!`;
    }
  }

  movePage(oldIndex: number, newIndex: number) {
    const oldItem = this.pages[oldIndex];
    const newItem = this.pages[newIndex];
    this._pages[oldIndex] = newItem;
    this._pages[newIndex] = oldItem;

    this._dirty = true;
  }

  getPage(id: string): Page {
    for (const page of this._pages) {
      if (page.id === id) {
        return page;
      }
    }

    return null;
  }

  private toJSON(): string {
    this.data.pages = this._pages.map(p => p._data);

    return JSON.stringify(this.data, null, 4);
  }

  save(): void {
    const manifestData = this.toJSON();
    const manifestPath = fsPath.join(this.basePath, 'manifest.json');

    fs.writeFileSync(manifestPath, manifestData, 'utf-8');

    for (const page of this._pages) {
      page.save();
    }

    this.markAsClean();
  }
}

export class Page {
  private _content = '';
  private _savedContent = '';

  constructor(private comic: Comic, private data: PageData, private basePath: string) {
    const contentPath = fsPath.join(basePath, data.file);

    if (!fs.existsSync(contentPath)) {
      fs.writeFileSync(contentPath, this._content, 'utf-8');
    } else {
      this._content = fs.readFileSync(contentPath, 'utf-8');
      this._savedContent = this._content;
    }
  }

  get id(): string {
    return this.data.id;
  }

  get title(): string {
    return this.data.title;
  }

  set title(value: string) {
    this.data.title = value;
    this.comic.markAsDirty();
  }

  get _data(): PageData {
    return this.data;
  }

  get content(): string {
    return this._content;
  }

  set content(value: string) {
    this.comic.markAsDirty(value !== this._savedContent);
    this._content = value;
  }

  save(): void {
    const contentPath = fsPath.join(this.basePath, this.data.file);

    fs.writeFileSync(contentPath, this._content, 'utf-8');

    this._savedContent = this._content;
  }
}
