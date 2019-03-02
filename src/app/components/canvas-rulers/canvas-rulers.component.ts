import { Component, Input } from "@angular/core";
import { GridSettings, RulerSettings } from "../../business/models/settings-models";

@Component({
  selector: 'vc-canvas-rulers',
  template: `
<div class="canvas-rulers" [hidden]="!show">
  <vc-canvas-ruler class="canvas-rulers-vertical" [svgId]="svgId + 'v'" orientation="vertical"
                   [gridSettings]="gridSettings" [rulerSettings]="rulerSettings"
                   [scrollLength]="height">
  </vc-canvas-ruler>

  <vc-canvas-ruler class="canvas-rulers-horizontal" [svgId]="svgId + 'h'" orientation="horizontal"
                   [gridSettings]="gridSettings" [rulerSettings]="rulerSettings"
                   [scrollLength]="width">
  </vc-canvas-ruler>
</div>
  `,
  styles: [`
.canvas-rulers {
  display: flex;
}

.canvas-rulers vc-canvas-ruler {
  position: sticky;
}

.canvas-rulers-vertical {
  left: 0;
}

.canvas-rulers-horizontal {
  top: 0;
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
