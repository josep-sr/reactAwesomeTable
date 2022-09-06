"use strict";

import { dataViewObjectsParser } from "powerbi-visuals-utils-dataviewutils";
import DataViewObjectsParser = dataViewObjectsParser.DataViewObjectsParser;

export class CircleSettings {
  public widthFirstColumn: number = 400;
  public progressBar: string = "#83c4ff";
  public backgroundBar: string = "#c4e4f1";
  public completedBar: string = "#8dc989";
  public textColorBar: string = "#fff";
}

export class VisualSettings extends DataViewObjectsParser {
  public circle: CircleSettings = new CircleSettings();
}
