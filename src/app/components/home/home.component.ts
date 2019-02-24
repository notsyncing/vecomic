import { Component, OnInit, ElementRef, ViewChild } from '@angular/core';
import * as ace from 'ace-builds';
import "ace-builds/webpack-resolver";
import { Subject } from 'rxjs';
import { debounceTime } from 'rxjs/operators';
import * as electron from 'electron';
import { ComicManager } from '../../business/comic-manager';
import { Comic, Page } from '../../business/models/comic-models';
import { CdkDragDrop } from '@angular/cdk/drag-drop';
import * as vex from 'vex-js';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {

  @ViewChild('codeEditor')
  codeEditorElement: ElementRef<HTMLDivElement>;

  @ViewChild('canvas')
  canvas: ElementRef<HTMLDivElement>;

  private codeEditor: ace.Ace.Editor;
  private editorChangeSubject = new Subject<ace.Ace.Delta>();

  private currentComic: Comic = null;
  private currentPageId = null;

  leftSideNavOpened = false;

  private editorInitialized = false;

  constructor(private comicManager: ComicManager) { }

  get currentPath(): string {
    if (!this.currentComic) {
      return null;
    }

    return this.currentComic.path;
  }

  get currentPage(): Page {
    if (!this.currentComic) {
      return null;
    }

    return this.currentComic.getPage(this.currentPageId);
  }

  ngOnInit() {
    this.editorChangeSubject
      .pipe(debounceTime(500))
      .subscribe(_ => {
        const code = this.codeEditor.getValue();
        this.canvas.nativeElement.innerHTML = code;

        this.currentPage.content = code;
      });
  }

  private initEditor(): void {
    if (this.editorInitialized) {
      return;
    }

    this.codeEditor = ace.edit(this.codeEditorElement.nativeElement);
    this.codeEditor.setTheme('ace/theme/dawn');
    this.codeEditor.session.setMode('ace/mode/svg');

    this.codeEditor.on('change', (delta) => {
      this.editorChangeSubject.next(delta);
    });

    this.editorInitialized = true;
  }

  onToggleLeftSideNavClicked(): void {
    this.leftSideNavOpened = !this.leftSideNavOpened;
  }

  private prepareToEdit(): void {
    setTimeout(() => {
      this.initEditor();

      this.switchToPage(this.currentComic.pages[0].id);
    }, 0);
  }

  onNewFolderClicked(): void {
    if (this.currentComic) {
      const result = electron.remote.dialog.showMessageBox({
        type: 'question',
        buttons: ['Yes', 'No'],
        message: 'You currently opened a comic. Do you want to close it?',
        cancelId: 1
      });

      if (result === 0) {
        this.onCloseFolderClicked();
      } else {
        return;
      }
    }

    const paths = electron.remote.dialog.showOpenDialog({
      properties: [ 'openDirectory', 'createDirectory' ]
    });

    if (!paths) {
      return;
    }

    const path = paths[0];
    this.currentComic = this.comicManager.create(path);
    this.prepareToEdit();
  }

  onOpenFolderClicked(): void {
    const paths = electron.remote.dialog.showOpenDialog({
      properties: [ 'openDirectory' ]
    });

    if (!paths) {
      return;
    }

    const path = paths[0];
    this.currentComic = this.comicManager.open(path);
    this.prepareToEdit();
  }

  onSaveClicked(): void {
    if (!this.currentComic) {
      return;
    }

    this.currentPage.content = this.codeEditor.getValue();

    this.currentComic.save();
  }

  onCloseFolderClicked(): void {
    const result = electron.remote.dialog.showMessageBox({
      type: 'question',
      buttons: ['Yes', 'No'],
      message: 'Do you want to close current comic?',
      cancelId: 1
    });

    if (result !== 0) {
      return;
    }

    if (this.currentComic.dirty) {
      const result = electron.remote.dialog.showMessageBox({
        type: 'question',
        buttons: ['Yes', 'No'],
        message: 'You have unsaved changes in this comic. Do you want to save them?',
        cancelId: 1
      });

      if (result === 0) {
        this.currentComic.save();
      }
    }

    this.currentComic = null;
    this.editorInitialized = false;
    this.switchToPage(null);
  }

  onPageListReordered(event: CdkDragDrop<string[]>): void {
    this.currentComic.movePage(event.previousIndex, event.currentIndex);
  }

  onAddPageClicked(): void {
    this.currentComic.addPage();
  }

  onChangePageTitleClicked(pageId: string, $event: Event): void {
    $event.stopPropagation();

    const page = this.currentComic.getPage(pageId);

    vex.dialog.prompt({
      message: 'Please enter new title',
      placeholder: page.title,
      callback: newTitle => {
        if (!newTitle) {
          return;
        }

        page.title = newTitle;
      }
    });
  }

  switchToPage(pageId: string): void {
    if (!this.currentComic) {
      this.currentPageId = null;
      return;
    }

    if (this.currentPage) {
      this.currentPage.content = this.codeEditor.getValue();
    }

    this.currentPageId = pageId;

    this.codeEditor.setValue(this.currentPage.content);
    this.codeEditor.clearSelection();
  }

  onRemovePageClicked(page: Page, $event: Event): void {
    $event.stopPropagation();

    if (!confirm(`Are you sure to remove the page ${page.title} ?`)) {
      return;
    }

    this.currentComic.removePage(page.id);

    if (page.id === this.currentPageId) {
      this.switchToPage(this.currentComic.pages[0].id);
    }
  }
}

