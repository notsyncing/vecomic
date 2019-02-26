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
}
