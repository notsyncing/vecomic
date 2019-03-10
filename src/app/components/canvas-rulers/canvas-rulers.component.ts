import { Component, Input, ViewChild, ElementRef } from "@angular/core";
import { GridSettings, RulerSettings } from "../../business/models/settings-models";

@Component({
  selector: 'vc-canvas-rulers',
  template: `
<div #container class="canvas-rulers" [hidden]="!show"
     [ngStyle]="{'transform': 'scale(' + scale + ')'}">
  <vc-canvas-ruler class="canvas-rulers-vertical" [svgId]="svgId + 'v'" orientation="vertical"
                   [gridSettings]="gridSettings" [rulerSettings]="rulerSettings"
                   [scrollLength]="height" [left]="computedScrollLeft">
  </vc-canvas-ruler>

  <vc-canvas-ruler class="canvas-rulers-horizontal" [svgId]="svgId + 'h'" orientation="horizontal"
                   [gridSettings]="gridSettings" [rulerSettings]="rulerSettings"
                   [scrollLength]="width" [top]="computedScrollTop">
  </vc-canvas-ruler>
</div>
  `,
  styles: [`
.canvas-rulers {
  display: flex;
  transform-origin: 0% 0% 0px;
}

.canvas-rulers vc-canvas-ruler {
  position: absolute;
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
  scale = 1;

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

  @Input()
  scrollLeft = 0;

  @Input()
  scrollTop = 0;

  get computedScrollLeft(): number {
    return Math.floor(this.scrollLeft / this.scale);
  }

  get computedScrollTop(): number {
    return Math.floor(this.scrollTop / this.scale);
  }

  @ViewChild('container')
  container: ElementRef<HTMLDivElement>;
}
