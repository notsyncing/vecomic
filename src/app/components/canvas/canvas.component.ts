import { Component, ElementRef, ViewChild, Input, Output } from "@angular/core";

@Component({
  selector: 'vc-canvas',
  template: `
<div #canvas class="canvas" [innerHTML]="content | safeHtml"
     [ngStyle]="{'transform': 'scale(' + scale + ')'}">
</div>
  `,
  styles: [`
.canvas {
  transform-origin: 0% 0% 0px;
}

.canvas > svg {
  min-height: 100%;
  min-width: 100%;
}
  `]
})
export class CanvasComponent {
  @ViewChild('canvas')
  canvas: ElementRef<HTMLDivElement>;

  private _content: string;

  private _svg: SVGSVGElement;

  get content(): string {
    return this._content;
  }

  @Input()
  set content(value: string) {
    this._content = value;

    setTimeout(() => {
      this._svg = this.canvas.nativeElement.querySelector('svg');

      this.updateContentDimensions();
    }, 0);
  }

  @Input()
  scale: number = 1;

  private _contentHeight = 0;
  private _contentWidth = 0;

  @Output()
  get contentHeight(): number {
    return this._contentHeight;
  }

  @Output()
  get contentWidth(): number {
    return this._contentWidth;
  }

  get nativeElement(): HTMLDivElement {
    return this.canvas.nativeElement;
  }

  constructor() {
  }

  private updateContentDimensions() {
    if (!this._svg) {
      this._contentWidth = 0;
      this._contentHeight = 0;
      return;
    }

    this._contentWidth = parseInt(this._svg.getAttribute('width'));
    this._contentHeight = parseInt(this._svg.getAttribute('height'));
  }
}
