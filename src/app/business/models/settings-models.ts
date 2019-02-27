export interface Settings {
  global: GlobalSettings;
  comic: ComicSettings;
  session: SessionSettings;
}

export interface GlobalSettings {

}

export interface ComicSettings {
  grid: GridSettings;
}

export interface GridSettings {
  bigUnitSize: number;
  smallUnitSize: number;

  bigUnitLineWidth: number;
  smallUnitLineWidth: number;

  bigUnitLineColor: string;
  smallUnitLineColor: string;
}

export interface SessionSettings {
  zoomPercentage: number;

  perPage: SessionPageSettingsObject;
}

export interface SessionPageSettingsObject {
  [id: string]: SessionPageSettings;
}

export interface SessionPageSettings {
  hiddenLayers: HiddenLayers;
}

export interface HiddenLayers {
  [layer: string]: boolean
}
