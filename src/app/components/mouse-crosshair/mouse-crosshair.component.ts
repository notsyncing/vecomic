import { Component, Input, ElementRef, ViewChild, Output } from "@angular/core";

@Component({
  selector: 'vc-mouse-crosshair',
  template: `
<div class="canvas-mouse-crosshair"
     [ngStyle]="{'height': computedHeight + 'px', 'width': computedWidth + 'px'}"
     [ngClass]="{'normal-mouse': !showMouseCrosshair}"
     (mouseenter)="onMouseCrosshairEnter()"
     (mousemove)="onMouseCrosshairMove($event)"
     (mouseleave)="onMouseCrosshairLeave()">
  <div #verticalMouseCrosshair class="crosshair-vertical" [hidden]="!showMouseCrosshair"></div>
  <div #horizontalMouseCrosshair class="crosshair-horizontal" [hidden]="!showMouseCrosshair"></div>
</div>
  `,
  styleUrls: ['./mouse-crosshair.component.scss']
})
export class MouseCrosshairComponent {
  @Input()
  show: boolean;

  @Input()
  scaleRatio: number;

  @Input()
  height: number;

  @Input()
  width: number;

  @Output()
  mouseX: number = 0;

  @Output()
  mouseY: number = 0;

  @Output()
  mouseAbsX: number = 0;

  @Output()
  mouseAbsY: number = 0;

  showMouseCrosshair = false;

  @ViewChild('horizontalMouseCrosshair')
  horizontalMouseCrosshair: ElementRef<HTMLDivElement>;

  @ViewChild('verticalMouseCrosshair')
  verticalMouseCrosshair: ElementRef<HTMLDivElement>;

  get computedHeight(): number {
    return Math.floor(this.height * this.scaleRatio);
  }

  get computedWidth(): number {
    return Math.floor(this.width * this.scaleRatio);
  }

  onMouseCrosshairEnter(): void {
    if (!this.show) {
      return;
    }

    this.showMouseCrosshair = true;
  }

  onMouseCrosshairMove(event: MouseEvent): void {
    this.mouseX = event.offsetX;
    this.mouseY = event.offsetY;

    this.mouseAbsX = event.clientX;
    this.mouseAbsY = event.clientY;

    if (!this.show) {
      return;
    }

    this.verticalMouseCrosshair.nativeElement.style.transform = `translateX(${event.offsetX}px)`;
    this.horizontalMouseCrosshair.nativeElement.style.transform = `translateY(${event.offsetY}px)`;
  }

  onMouseCrosshairLeave(): void {
    if (!this.show) {
      return;
    }

    this.showMouseCrosshair = false;
  }
}
