import { Component } from "@angular/core";
import { LibraryManager } from "../../business/library-manager";
import { Library } from "../../business/models/library-models";

@Component({
  selector: 'vc-svg-library-container',
  template: `
<div class="svg-library" *ngFor="let lib of libraries">
  <div class="svg-library-component" *ngFor="let component of lib.components"
       [innerHTML]="component.content | safeHtml">
  </div>
</div>
  `,
  styles: [`
.svg-library {
  display: none;
}
  `]
})
export class SvgLibraryContainerComponent {
  get libraries(): Library[] {
    return this.libraryManager.loadedLibraries;
  }

  constructor(private libraryManager: LibraryManager) {

  }
}
