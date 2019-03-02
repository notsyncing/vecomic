import { Component, Input } from "@angular/core";
import { GridSettings } from "../../business/models/settings-models";

@Component({
  selector: 'vc-canvas-grid',
  templateUrl: './canvas-grid.component.html',
  styleUrls: ['./canvas-grid.component.scss']
})
export class CanvasGridComponent {
  @Input()
  show: boolean;

  @Input()
  settings: GridSettings;
}
