import 'reflect-metadata';
import '../polyfills';
import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { HttpClientModule, HttpClient } from '@angular/common/http';

import { AppRoutingModule } from './app-routing.module';

import {BrowserAnimationsModule} from '@angular/platform-browser/animations';

import {MatToolbarModule, MatIconModule, MatButtonModule, MatSidenavModule, MatListModule, MatDialogModule, MatFormFieldModule, MatInputModule, MatMenuModule, MatCheckboxModule, MatButtonToggleModule, MatTabsModule} from '@angular/material';

import {DragDropModule} from '@angular/cdk/drag-drop';

import { FlexLayoutModule } from '@angular/flex-layout';

import { AngularSplitModule } from 'angular-split';

// NG Translate
import { TranslateModule, TranslateLoader } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';

import { ElectronService } from './providers/electron.service';

import { WebviewDirective } from './directives/webview.directive';

import { AppComponent } from './app.component';
import { HomeComponent } from './components/home/home.component';
import { ComicManager } from './business/comic-manager';
import { SvgContentSettingsComponent } from './components/svg-content-settings/svg-content-settings.component';
import { SettingsManager } from './business/settings-manager';
import { PageAnalyer } from './business/page-analyzer';

// AoT requires an exported function for factories
export function HttpLoaderFactory(http: HttpClient) {
  return new TranslateHttpLoader(http, './assets/i18n/', '.json');
}

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    WebviewDirective,
    SvgContentSettingsComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpClientModule,
    AppRoutingModule,
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: (HttpLoaderFactory),
        deps: [HttpClient]
      }
    }),
    BrowserAnimationsModule,
    FlexLayoutModule,
    AngularSplitModule.forRoot(),
    MatToolbarModule,
    MatIconModule,
    MatButtonModule,
    MatSidenavModule,
    MatListModule,
    MatDialogModule,
    MatInputModule,
    MatFormFieldModule,
    MatMenuModule,
    MatCheckboxModule,
    MatTabsModule,
    DragDropModule
  ],
  providers: [ElectronService, ComicManager, SettingsManager, PageAnalyer],
  bootstrap: [AppComponent],
  entryComponents: [
    SvgContentSettingsComponent
  ]
})
export class AppModule { }
