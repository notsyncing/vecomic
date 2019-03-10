import { Component, Input, ElementRef, ViewChild, AfterContentChecked } from "@angular/core";

@Component({
  selector: 'vc-canvas-hud',
  template: `
<div class="hud" [hidden]="!show">
  <div #cursorPos class="cursor-pos">
    {{computedMouseX + ', ' + computedMouseY}}
  </div>
</div>
  `,
  styles: [`
.hud {
  height: 100%;
  width: 100%;
}

.cursor-pos {
  position: absolute;
  left: 50%;
  bottom: calc(64px + 2rem);
  transform: translateX(-50%);
  background: rgba(0, 0, 0, 0.2);
  padding: 0.5rem 1rem;
  border-radius: 50px;
  width: 5rem;
  text-align: center;
}

.cursor-pos.hover {
  opacity: 0.2;
}
  `]
})
export class CanvasHudComponent implements AfterContentChecked {
  @Input()
  show: boolean;

  @Input()
  mouseX: number = 0;

  @Input()
  mouseY: number = 0;

  @Input()
  mouseAbsX: number = 0;

  @Input()
  mouseAbsY: number = 0;

  @Input()
  scaleRatio: number = 0;

  @ViewChild('cursorPos')
  cursorPos: ElementRef<HTMLDivElement>;

  get computedMouseX(): number {
    return Math.floor(this.mouseX / this.scaleRatio);
  }

  get computedMouseY(): number {
    return Math.floor(this.mouseY / this.scaleRatio);
  }

  constructor() {
  }

  ngAfterContentChecked(): void {
    if (!this.cursorPos) {
      return;
    }

    if (!isFinite(this.mouseAbsX) || !isFinite(this.mouseAbsY)) {
      return;
    }

    const elements = document.elementsFromPoint(this.mouseAbsX, this.mouseAbsY);
    const cursorPosElem = elements.find(e => e === this.cursorPos.nativeElement);

    if (cursorPosElem) {
      this.cursorPos.nativeElement.classList.add('hover');
    } else {
      this.cursorPos.nativeElement.classList.remove('hover');
    }
  }
}
