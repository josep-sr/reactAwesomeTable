"use strict";

import { dataViewObjectsParser } from "powerbi-visuals-utils-dataviewutils";
import DataViewObjectsParser = dataViewObjectsParser.DataViewObjectsParser;

export class TableSettings {
  public widthFirstColumn: number = 300;
  public widthCompaniesColumn: number = 110;
  public backgroundBar: string = "#eeeeee";
  public textColorBar: string = "#323232";
  public completedBar: string = "#b3b3b3";
  public onTrackBar: string = "#0eb194";
  public delayedBar: string = "#f9c05d";
  public cancelledBar: string = "#FA9494";
  public overdueBar: string = "#de6a73";
  public onHoldBar: string = "#155c9d";
  public naBar: string = "#f0f6fc";
  public noStatusBar: string = "#e9e9e9";
}

export class VisualSettings extends DataViewObjectsParser {
  public table: TableSettings = new TableSettings();
}
