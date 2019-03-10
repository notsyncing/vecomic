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
import { MatDialog, MatCheckboxChange } from '@angular/material';
import { SvgContentSettingsComponent } from '../svg-content-settings/svg-content-settings.component';
import { SettingsManager } from '../../business/settings-manager';
import { ComicSettings, GlobalSettings, SessionSettings, SessionPageSettings } from '../../business/models/settings-models';
import { PageAnalyer, PageDetails } from '../../business/page-analyzer';
import { CanvasRulerComponent } from '../canvas-rulers/canvas-ruler.component';
import { SvgLibraryContainerComponent } from '../svg-library-container/svg-library-container.component';
import { StateManager } from '../../business/state-manager';
import * as fs from 'fs';
import { CanvasComponent } from '../canvas/canvas.component';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {

  @ViewChild('codeEditor')
  codeEditorElement: ElementRef<HTMLDivElement>;

  @ViewChild('canvasContainer')
  canvasContainer: ElementRef<HTMLDivElement>;

  @ViewChild('canvas')
  canvas: CanvasComponent;

  @ViewChild('libraries')
  libraries: SvgLibraryContainerComponent;

  private codeEditor: ace.Ace.Editor;
  private editorChangeSubject = new Subject<ace.Ace.Delta>();

  private currentComic: Comic = null;
  private currentPageId = null;

  leftSideNavOpened = false;

  private editorInitialized = false;

  showGrid = true;
  showRuler = true;
  showHud = true;
  pageDetails: PageDetails = null;

  constructor(private comicManager: ComicManager, private dialog: MatDialog,
    private settingsManager: SettingsManager, private pageAnalyzer: PageAnalyer,
    private stateManager: StateManager) { }

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

  get globalSettings(): GlobalSettings {
    return this.settingsManager.globalSettings;
  }

  get comicSettings(): ComicSettings {
    return this.settingsManager.comicSettings;
  }

  get sessionSettings(): SessionSettings {
    return this.settingsManager.sessionSettings;
  }

  get sessionPageSettings(): SessionPageSettings {
    if (!this.currentPageId) {
      return {} as SessionPageSettings;
    }

    return this.sessionSettings.perPage[this.currentPageId] || {} as SessionPageSettings;
  }

  ngOnInit() {
    this.editorChangeSubject
      .pipe(debounceTime(500))
      .subscribe(_ => {
        const code = this.codeEditor.getValue();

        try {
          this.canvas.content = code;
        } catch (err) {
          console.warn(err);
        }

        this.currentPage.content = code;

        this.updateSessionPageSettings();
      });

    if (this.stateManager.hasKey('opened-directory')) {
      this.openFolder(this.stateManager.get('opened-directory'));
    }
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

  private afterOpenDirectory(): void {
    this.settingsManager.readComicSettingsFrom(this.currentComic.path);

    this.prepareToEdit();

    this.stateManager.put('opened-directory', this.currentComic.path);
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
    this.afterOpenDirectory();
  }

  private openFolder(path: string): void {
    if (!fs.existsSync(path)) {
      console.error(`Comic path ${path} does not exist!`);
      return;
    }

    this.currentComic = this.comicManager.open(path);
    this.afterOpenDirectory();
  }

  onOpenFolderClicked(): void {
    const paths = electron.remote.dialog.showOpenDialog({
      properties: [ 'openDirectory' ]
    });

    if (!paths) {
      return;
    }

    const path = paths[0];
    this.openFolder(path);
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

    this.settingsManager.resetComicSettings();

    this.stateManager.remove('opened-directory');
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
      callback: (newTitle: string) => {
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

    this.settingsManager.makeSureSessionPageSettings(pageId);

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

  toggleGrid(show: boolean): void {
    this.showGrid = show;
  }

  onSvgContentSettingsClicked(): void {
    const dlg = this.dialog.open(SvgContentSettingsComponent, {
      disableClose: true
    });

    dlg.afterClosed().subscribe(r => {
      if (r) {
        this.settingsManager.saveCurrentComicSettings();
      }
    });
  }

  onSvgContentZoomInClicked(): void {
    if (this.sessionSettings.zoomPercentage >= 1000) {
      return;
    }

    this.sessionSettings.zoomPercentage += 10;
  }

  onSvgContentZoomOutClicked(): void {
    if (this.sessionSettings.zoomPercentage <= 0) {
      return;
    }

    this.sessionSettings.zoomPercentage -= 10;
  }

  private updateSessionPageSettings(): void {
    const svgElem = this.canvas.nativeElement.querySelector('svg');
    this.pageDetails = this.pageAnalyzer.analyze(this.currentPage, svgElem);

    const pageSettings = this.sessionSettings.perPage[this.currentPageId];

    for (const layer of Object.keys(pageSettings.hiddenLayers)) {
      if (this.pageDetails.layers.indexOf(layer) < 0) {
        delete pageSettings.hiddenLayers[layer];
      }
    }

    this.updateSvgContentLayersVisiblity();
  }

  onSvgContentLayerVisibilityChanged(layer: string, event: MatCheckboxChange): void {
    const visible = event.checked;
    const pageSettings = this.sessionSettings.perPage[this.currentPageId];

    pageSettings.hiddenLayers[layer] = !visible;

    this.updateSvgContentLayersVisiblity();
  }

  private updateSvgContentLayersVisiblity(): void {
    const svgElem = this.canvas.nativeElement.querySelector('svg');
    const layerElems = this.pageAnalyzer.getAllLayers(svgElem);
    const pageSettings = this.sessionSettings.perPage[this.currentPageId];

    layerElems.forEach((layerElem, layerName) => {
      const visible = !pageSettings.hiddenLayers[layerName];

      if (visible) {
        layerElem.removeAttribute('visibility');
      } else {
        layerElem.setAttribute('visibility', 'hidden');
      }
    });
  }

  toggleRuler(show: boolean): void {
    this.showRuler = show;
  }

  toggleDevTools(): void {
    const webContents = electron.remote.getCurrentWebContents();

    if (webContents.isDevToolsOpened()) {
      webContents.closeDevTools();
    } else {
      webContents.openDevTools();
    }
  }
}

