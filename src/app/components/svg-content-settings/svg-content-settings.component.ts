import { Component, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material';
import { SettingsManager } from '../../business/settings-manager';
import { ComicSettings } from '../../business/models/settings-models';

@Component({
  selector: 'app-svg-content-settings',
  templateUrl: './svg-content-settings.component.html',
  styleUrls: ['./svg-content-settings.component.scss']
})
export class SvgContentSettingsComponent implements OnInit {
  private comicSettings: ComicSettings;

  constructor(private dialog: MatDialogRef<SvgContentSettingsComponent>,
    private settingsManager: SettingsManager) {
      this.comicSettings = JSON.parse(JSON.stringify(settingsManager.comicSettings));
  }

  ngOnInit() {
  }

  onOkClicked(): void {
    this.settingsManager.comicSettings = this.comicSettings;
    this.dialog.close(true);
  }

  onCancelClicked(): void {
    this.dialog.close(false);
  }
}
