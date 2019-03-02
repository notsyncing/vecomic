import { Component, Input } from "@angular/core";
import { GridSettings, RulerSettings } from "../../business/models/settings-models";

@Component({
  selector: 'vc-canvas-rulers',
  template: `
<div class="canvas-rulers" [hidden]="!show">
  <vc-canvas-ruler [svgId]="svgId + 'v'" orientation="vertical" [gridSettings]="gridSettings"
                   [rulerSettings]="rulerSettings" [scrollLength]="height">
  </vc-canvas-ruler>

  <vc-canvas-ruler [svgId]="svgId + 'h'" orientation="horizontal" [gridSettings]="gridSettings"
                   [rulerSettings]="rulerSettings" [scrollLength]="width">
  </vc-canvas-ruler>
</div>
  `,
  styles: [`
.canvas-rulers {
  display: flex;
}
  `]
})
export class CanvasRulersComponent {
  @Input()
  svgId: string;

  @Input()
  show: boolean;

  @Input()
  width: number;

  @Input()
  height: number;

  @Input()
  gridSettings: GridSettings;

  @Input()
  rulerSettings: RulerSettings;
}
