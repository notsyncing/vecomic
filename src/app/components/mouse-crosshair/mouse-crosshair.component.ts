import { Component, Input, ElementRef, ViewChild } from "@angular/core";

@Component({
  selector: 'vc-mouse-crosshair',
  template: `
<div class="canvas-mouse-crosshair"
     [ngStyle]="{'height': height + 'px', 'width': width + 'px'}"
     (mouseenter)="onMouseCrosshairEnter()"
     (mousemove)="onMouseCrosshairMove($event)"
     (mouseleave)="onMouseCrosshairLeave()" [hidden]="!show">
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
  height: number;

  @Input()
  width: number;

  showMouseCrosshair = false;

  @ViewChild('horizontalMouseCrosshair')
  horizontalMouseCrosshair: ElementRef<HTMLDivElement>;

  @ViewChild('verticalMouseCrosshair')
  verticalMouseCrosshair: ElementRef<HTMLDivElement>;

  onMouseCrosshairEnter(): void {
    if (!this.show) {
      return;
    }

    this.showMouseCrosshair = true;
  }

  onMouseCrosshairMove(event: MouseEvent): void {
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
