"use strict";

import { dataViewObjectsParser } from "powerbi-visuals-utils-dataviewutils";
import DataViewObjectsParser = dataViewObjectsParser.DataViewObjectsParser;

export class CircleSettings {
  public widthFirstColumn: number = 300;
  public widthCompaniesColumn: number = 150;
  public backgroundBar: string = "#c4e4f1";
  public textColorBar: string = "#323232";
  public completedBar: string = "#cfcfcf";
  public onTrackBar: string = "#8dc989";
  public delayedBar: string = "#d4d722";
  public cancelledBar: string = "#463a3a";
  public overdueBar: string = "#db5151";
}

export class VisualSettings extends DataViewObjectsParser {
  public circle: CircleSettings = new CircleSettings();
}
