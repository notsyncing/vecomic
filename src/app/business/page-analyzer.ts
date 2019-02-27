import { Injectable } from "@angular/core";
import { Page } from "./models/comic-models";

@Injectable()
export class PageAnalyer {
  analyze(page: Page, contentSvg: SVGSVGElement): PageDetails {
    const layers = this.scanLayers(contentSvg);

    return {
      layers: layers
    };
  }

  private scanLayers(contentSvg: SVGSVGElement): string[] {
    if (!contentSvg) {
      return [];
    }

    const layerElems = this.getAllLayers(contentSvg);
    return Array.from(layerElems.keys());
  }

  getAllLayers(contentSvg: SVGSVGElement): Map<string, Element> {
    if (!contentSvg) {
      return new Map();
    }

    const layerElems = Array.from(contentSvg.querySelectorAll('[vecomic\\:layer]'));

    return new Map(layerElems.map(e => [e.getAttribute('vecomic:layer'), e] as [string, Element]));
  }
}

export interface PageDetails {
  layers: string[];
}
