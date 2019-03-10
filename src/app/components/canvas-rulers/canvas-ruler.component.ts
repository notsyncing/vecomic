import { Component, Input, ElementRef, ViewChild } from "@angular/core";
import { GridSettings, RulerSettings } from "../../business/models/settings-models";

@Component({
  selector: 'vc-canvas-ruler',
  template: `
<div #ruler class="canvas-ruler"
     [ngClass]="{'canvas-ruler-vertical': orientation === 'vertical', 'canvas-ruler-horizontal': orientation === 'horizontal'}"
     [ngStyle]="{'left': left + 'px', 'top': top + 'px'}">
  <svg xmlns="http://www.w3.org/2000/svg"
       [attr.width]="orientation === 'vertical' ? 20 : scrollLength"
       [attr.height]="orientation === 'horizontal' ? 20 : scrollLength">
    <defs>
      <pattern [attr.id]="'smallRulerMark' + svgId" [attr.width]="gridSettings.smallUnitSize"
               [attr.height]="gridSettings.smallUnitSize"
               patternUnits="userSpaceOnUse">
        <path [attr.d]="orientation === 'vertical' ?
                'M ' + gridSettings.smallUnitSize + ' 0 L 0 0' :
                'M 0 ' + gridSettings.smallUnitSize + ' L 0 0'"
              fill="none"
              [attr.stroke]="rulerSettings.smallUnitLineColor"
              [attr.stroke-width]="rulerSettings.smallUnitLineWidth" />
      </pattern>

      <pattern [attr.id]="'bigRulerMark' + svgId" [attr.width]="gridSettings.bigUnitSize"
               [attr.height]="gridSettings.bigUnitSize" patternUnits="userSpaceOnUse">
        <rect [attr.width]="gridSettings.bigUnitSize"
              [attr.height]="gridSettings.bigUnitSize" [attr.fill]="'url(#smallRulerMark' + svgId + ')'" />
        <path [attr.d]="orientation === 'vertical' ?
                'M ' + gridSettings.bigUnitSize + ' 0 L 0 0' :
                'M 0 ' + gridSettings.bigUnitSize + ' L 0 0'"
              fill="none" [attr.stroke]="rulerSettings.bigUnitLineColor"
              [attr.stroke-width]="rulerSettings.bigUnitLineWidth" />
      </pattern>
    </defs>

    <g *ngIf="orientation === 'horizontal'">
      <rect width="100%" height="20" x="0" [attr.fill]="'url(#bigRulerMark' + svgId + ')'" />

      <text *ngFor="let x of rulerMarks" [attr.x]="x + 1" y="12"
            [attr.color]="rulerSettings.bigUnitLineColor">
        {{x}}
      </text>
    </g>

    <g *ngIf="orientation === 'vertical'">
      <rect width="20" height="100%" y="0" [attr.fill]="'url(#bigRulerMark' + svgId + ')'" />

      <text *ngFor="let y of rulerMarks" x="1" [attr.y]="y + 1"
            [attr.transform]="'rotate(90, 1, ' + (y + 1) + ')'"
            [attr.color]="rulerSettings.bigUnitLineColor">
        {{y}}
      </text>
    </g>
  </svg>
</div>
  `,
  styles: [`
.canvas-ruler {
  position: absolute;
}

.canvas-ruler-horizontal {
  top: 0;
  height: min-content;
}

.canvas-ruler-vertical {
  left: 0;
  width: min-content;
}
  `]
})
export class CanvasRulerComponent {
  private _scrollLength = 0;

  @Input()
  svgId: string;

  @Input()
  orientation: 'horizontal' | 'vertical';

  get scrollLength(): number {
    return this._scrollLength;
  }

  @Input()
  set scrollLength(value: number) {
    const oldValue = this._scrollLength;

    this._scrollLength = value;

    if (oldValue !== value) {
      setTimeout(() => {
        this.refresh();
      }, 0);
    }
  }

  @Input()
  gridSettings: GridSettings;

  @Input()
  rulerSettings: RulerSettings;

  @Input()
  left: number = 0;

  @Input()
  top: number = 0;

  @ViewChild('ruler')
  ruler: ElementRef<HTMLDivElement>;

  rulerMarks: number[] = [];

  refresh(): void {
    this.rulerMarks = new Array(Math.floor(this.scrollLength / this.gridSettings.bigUnitSize + 1))
      .fill(0)
      .map((_, i) => i * this.gridSettings.bigUnitSize)
      .filter(v => v > 0);
  }
}
