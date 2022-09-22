"use strict";

import { dataViewObjectsParser } from "powerbi-visuals-utils-dataviewutils";
import DataViewObjectsParser = dataViewObjectsParser.DataViewObjectsParser;

export class CircleSettings {
  public widthFirstColumn: number = 300;
  public widthCompaniesColumn: number = 150;
  public backgroundBar: string = "#c4e4f1";
  public textColorBar: string = "#323232";
  public completedBar: string = "#8dc989";
  public progressBar: string = "#83c4ff";
}

export class VisualSettings extends DataViewObjectsParser {
  public circle: CircleSettings = new CircleSettings();
}
