"use strict";

import { dataViewObjectsParser } from "powerbi-visuals-utils-dataviewutils";
import DataViewObjectsParser = dataViewObjectsParser.DataViewObjectsParser;

export class TableSettings {
  public widthFirstColumn: number = 300;
  public widthCompaniesColumn: number = 150;
  public backgroundBar: string = "#F0F0F0";
  public textColorBar: string = "#323232";
  public completedBar: string = "#cfcfcf";
  public onTrackBar: string = "#8dc989";
  public delayedBar: string = "#d4d722";
  public cancelledBar: string = "#FA9494";
  public overdueBar: string = "#db5151";
  public onHoldBar: string = "#64b2d1";
  public naBar: string = "#B8B6B6";
  public noStatusBar: string = "#e9e9e9";
}

export class VisualSettings extends DataViewObjectsParser {
  public table: TableSettings = new TableSettings();
}
