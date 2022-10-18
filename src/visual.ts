"use strict";
import powerbi from "powerbi-visuals-api";

import DataView = powerbi.DataView;
import VisualConstructorOptions = powerbi.extensibility.visual.VisualConstructorOptions;
import VisualUpdateOptions = powerbi.extensibility.visual.VisualUpdateOptions;
import IVisual = powerbi.extensibility.visual.IVisual;
import IViewport = powerbi.IViewport;
import VisualObjectInstance = powerbi.VisualObjectInstance;
import EnumerateVisualObjectInstancesOptions = powerbi.EnumerateVisualObjectInstancesOptions;
import VisualObjectInstanceEnumerationObject = powerbi.VisualObjectInstanceEnumerationObject;
import ISelectionManager = powerbi.extensibility.ISelectionManager;
import { TableSettings, VisualSettings } from "./settings";
import * as React from "react";
import * as ReactDOM from "react-dom";
import { ReactAwesomeTable, initialState } from "./component";

import "./../style/visual.less";

export class Visual implements IVisual {
  //https://docs.microsoft.com/en-us/power-bi/developer/visuals/power-bi-custom-visuals-certified
  private target: HTMLElement;
  private reactRoot: React.ComponentElement<any, any>;
  private viewport: IViewport;
  private settings: VisualSettings;
  private selectionManager: ISelectionManager;

  constructor(options: VisualConstructorOptions) {
    this.selectionManager = options.host.createSelectionManager();
    this.reactRoot = React.createElement(ReactAwesomeTable, {});
    this.target = options.element;

    ReactDOM.render(this.reactRoot, this.target);
  }

  public update(options: VisualUpdateOptions) {
    this.clear();
    if (!options) {
      return;
    }
    if (
      !options.dataViews ||
      !options.dataViews[0] ||
      !options.dataViews[0].matrix ||
      !options.dataViews[0].matrix.rows ||
      !options.dataViews[0].matrix.rows.root ||
      !options.dataViews[0].matrix.rows.root.children ||
      !options.dataViews[0].matrix.rows.root.children.length ||
      !options.dataViews[0].matrix.columns ||
      !options.dataViews[0].matrix.columns.root ||
      !options.dataViews[0].matrix.columns.root.children ||
      !options.dataViews[0].matrix.columns.root.children.length
    ) {
      return;
    }

    const dataView: DataView = options.dataViews[0];
    this.viewport = options.viewport;
    const { width, height } = this.viewport;
    const size = Math.min(width, height);
    this.settings = VisualSettings.parse(dataView) as VisualSettings;
    const objectStyle: TableSettings = this.settings.table;

    document.addEventListener("contextmenu", (event) => {
      this.selectionManager.showContextMenu(false, {
        x: event.pageX,
        y: event.pageY,
      });
      event.preventDefault();
    });
    const cleanedData = this.builder(options.dataViews[0].matrix);
    ReactAwesomeTable.update({
      columnsValues: options.dataViews[0].matrix?.columns?.root?.children,
      rowsValues: cleanedData,
      size: size,
      errorMessage: null,
      objectStyle: objectStyle,
    });
  }

  private builder(matrix: powerbi.DataViewMatrix) {
    const listRow: {}[] = [];

    matrix?.rows?.root?.children.map((row) => {
      listRow.push({
        PN: row.value,
        CD: Object.keys(row.values)
          .map((key) => row.values[key].value)
          .find((row) => row !== null)
          .split("|")[0],
        PR: Object.keys(row.values)
          .map((key) => row.values[key].value)
          .find((row) => row !== null)
          .split("|")[1],
        CellValues: [
          ...Object.keys(row.values).map((key) => row.values[key].value),
        ],
      });
    });
    return listRow;
  }

  public enumerateObjectInstances(
    options: EnumerateVisualObjectInstancesOptions
  ): VisualObjectInstance[] | VisualObjectInstanceEnumerationObject {
    return VisualSettings.enumerateObjectInstances(
      this.settings || VisualSettings.getDefault(),
      options
    );
  }

  private clear() {
    ReactAwesomeTable.update(initialState);
  }
}
