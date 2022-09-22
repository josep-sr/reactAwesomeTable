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
      console.log(event);

      this.selectionManager.showContextMenu(false, {
        x: event.pageX,
        y: event.pageY,
      });
      event.preventDefault();
    });

    ReactAwesomeTable.update({
      matrix: options.dataViews[0].matrix,
      size: size,
      // widthFirstColumn:
      //   objectStyle && objectStyle.widthFirstColumn
      //     ? objectStyle.widthFirstColumn
      //     : 100,
      // widthCompaniesColumn:
      //   objectStyle && objectStyle.widthCompaniesColumn
      //     ? objectStyle.widthCompaniesColumn
      //     : 200,
      // onTrackBar:
      //   objectStyle && objectStyle.onTrackBar
      //     ? objectStyle.onTrackBar
      //     : undefined,
      // backgroundBar:
      //   objectStyle && objectStyle.backgroundBar
      //     ? objectStyle.backgroundBar
      //     : undefined,
      // completedBar:
      //   objectStyle && objectStyle.completedBar
      //     ? objectStyle.completedBar
      //     : undefined,
      // textColorBar:
      //   objectStyle && objectStyle.textColorBar
      //     ? objectStyle.textColorBar
      //     : undefined,
      objectStyle: objectStyle,
    });
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
