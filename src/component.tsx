import * as React from "react";
import powerbi from "powerbi-visuals-api";
import DataViewMatrixNode = powerbi.DataViewMatrix;
import { TableSettings } from "./settings";
import { orderBy } from "lodash";

type ThumbReact = {
  left: number;
  width: number;
} | null;

export interface State {
  columnsValues: any;
  rowsValues: {}[];
  size: number;
  showModal?: boolean;
  errorMessage?: string;
  // widthFirstColumn?: number;
  // widthCompaniesColumn?: number;
  // onTrackBar?: string;
  // backgroundBar?: string;
  // completedBar?: string;
  // textColorBar?: string;
  objectStyle?: TableSettings;
}

export const initialState: State = {
  columnsValues: [],
  rowsValues: [],
  size: 200,
  showModal: false,
  errorMessage: "",
  // widthFirstColumn: 400,
  // widthCompaniesColumn: 200,
};

export class ReactAwesomeTable extends React.Component<{}, State> {
  private objectStyle: TableSettings;
  private showModal: boolean;
  private errorMessage: string;
  private rowsValues: {}[];
  private columnsValues: [];
  private stateSort1: boolean = false;
  private stateSort2: boolean = false;
  private stateSort3: boolean = false;
  private arrowUpWard: string =
    "data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIGhlaWdodD0iNDgiIHdpZHRoPSI0OCI+PHBhdGggZD0iTTI0IDQwcS0uNjUgMC0xLjA3NS0uNDI1LS40MjUtLjQyNS0uNDI1LTEuMDc1VjEzLjdMMTEuMTUgMjUuMDVxLS40NS40NS0xLjA1LjQ1LS42IDAtMS4wNS0uNDVROC42IDI0LjYgOC42IDI0cTAtLjYuNDUtMS4wNWwxMy45LTEzLjlxLjI1LS4yNS41MjUtLjM1LjI3NS0uMS41MjUtLjEuMyAwIC41NS4xLjI1LjEuNS4zNWwxMy45IDEzLjlxLjQ1LjQ1LjQ1IDEuMDUgMCAuNi0uNDUgMS4wNS0uNDUuNDUtMS4wNS40NS0uNiAwLTEuMDUtLjQ1TDI1LjUgMTMuN3YyNC44cTAgLjY1LS40MjUgMS4wNzVRMjQuNjUgNDAgMjQgNDBaIi8+PC9zdmc+";
  private arrowDownWard: string =
    "data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIGhlaWdodD0iNDgiIHdpZHRoPSI0OCI+PHBhdGggZD0iTTI0IDM5LjRxLS4yNSAwLS41MjUtLjF0LS41MjUtLjM1bC0xMy45LTEzLjlROC42IDI0LjYgOC42IDI0cTAtLjYuNDUtMS4wNS40NS0uNDUgMS4wNS0uNDUuNiAwIDEuMDUuNDVMMjIuNSAzNC4zVjkuNXEwLS42NS40MjUtMS4wNzVRMjMuMzUgOCAyNCA4cS42NSAwIDEuMDc1LjQyNS40MjUuNDI1LjQyNSAxLjA3NXYyNC44bDExLjM1LTExLjM1cS40NS0uNDUgMS4wNS0uNDUuNiAwIDEuMDUuNDUuNDUuNDUuNDUgMS4wNSAwIC42LS40NSAxLjA1bC0xMy45IDEzLjlxLS4yNS4yNS0uNS4zNS0uMjUuMS0uNTUuMVoiLz48L3N2Zz4=";

  constructor(props: any) {
    super(props);
    this.state = initialState;
  }

  render() {
    // const [, updateState] = React.useState();
    // const forceUpdate = React.useCallback(() => updateState({}), []);
    const {
      columnsValues,
      rowsValues,
      size,
      showModal,
      errorMessage,
      objectStyle,
    } = this.state;
    this.columnsValues = columnsValues;
    this.rowsValues = rowsValues;
    this.showModal = showModal;
    this.errorMessage = errorMessage;
    const style: React.CSSProperties = {
      width: size,
      height: size,
    };

    if (objectStyle === undefined) {
      return;
    }

    this.objectStyle = objectStyle;

    return (
      <div className="mainDiv">
        <table>
          <thead>
            <tr>
              <th
                className="sticky-col first-col"
                onClick={() =>
                  this.sorting({
                    column: "PN",
                    rowsValues: rowsValues,
                  })
                }
                style={{ minWidth: objectStyle.widthFirstColumn + "px" }}
              >
                <p>Project Name</p>
                <img
                  className="arrow"
                  src={this.stateSort1 ? this.arrowUpWard : this.arrowDownWard}
                />
              </th>
              <th
                className="sticky-col second-col"
                onClick={() =>
                  this.sorting({
                    column: "CD",
                    rowsValues: rowsValues,
                  })
                }
                style={{ left: objectStyle.widthFirstColumn + "px" }}
              >
                <p>Completion Date</p>
                <img
                  className="arrow"
                  src={this.stateSort2 ? this.arrowUpWard : this.arrowDownWard}
                />
              </th>
              <th
                className="sticky-col third-col"
                onClick={() =>
                  this.sorting({
                    column: "PR",
                    rowsValues: rowsValues,
                  })
                }
                style={{ left: objectStyle.widthFirstColumn + 145 + "px" }}
              >
                <p>Progress</p>
                <img
                  className="arrow"
                  src={this.stateSort3 ? this.arrowUpWard : this.arrowDownWard}
                />
              </th>
              {columnsValues?.map((property) => {
                return (
                  <React.Fragment>
                    <th>
                      <p>{property.value.toString()}</p>
                    </th>
                  </React.Fragment>
                );
              })}
            </tr>
          </thead>
          <tbody>
            {rowsValues?.map((property, index) => {
              const projectName = property["PN"] as string;
              const rowData = property["CellValues"];

              let isError: boolean = false;
              if (
                property["CD"] === null ||
                property["CD"] === undefined ||
                property["CD"] === "" ||
                Number.isNaN(property["PR"]) ||
                this.parseDate(property).getFullYear() === 9999
              ) {
                isError = true;
              }

              return (
                <tr key={index}>
                  <td
                    className="sticky-col first-col"
                    style={{ minWidth: objectStyle.widthFirstColumn + "px" }}
                  >
                    <p className="projectName">{projectName}</p>
                  </td>
                  <td
                    className="sticky-col second-col"
                    style={{ left: objectStyle.widthFirstColumn + "px" }}
                  >
                    <p className="completionDate">
                      {isError ? "Error" : property["CD"]}
                    </p>
                  </td>
                  <td
                    className="sticky-col third-col-value"
                    style={{ left: objectStyle.widthFirstColumn + 145 + "px" }}
                  >
                    <div className="svg-container">
                      <svg width="17" height="17">
                        <circle
                          cx="8"
                          cy="8"
                          r="8"
                          fill={this.getColorFomStatus(
                            property["STATUS"],
                            true
                          )}
                        />
                      </svg>
                    </div>
                    <p className="progressStauts">
                      {isError ? "Error" : Number(property["PR"]) + "%"}
                    </p>
                  </td>
                  {this.renderTableData(rowData)}
                </tr>
              );
            })}
          </tbody>
        </table>
        {this.renderModal()}
      </div>
    );
  }

  renderModal() {
    return (
      <div className={this.showModal ? "show-modal" : "modal"}>
        <div className="modal-content">
          <a className="close-button" onClick={() => this.setShowModal(false)}>
            X
          </a>
          <h1>Error Details</h1>
          <p>{this.errorMessage}</p>
        </div>
      </div>
    );
  }

  setShowModal(arg0: boolean, errorMessage?: string) {
    this.showModal = arg0;
    ReactAwesomeTable.update({
      columnsValues: this.columnsValues,
      rowsValues: this.rowsValues,
      size: 200,
      showModal: arg0,
      errorMessage: errorMessage,
    });
  }

  renderTableData(rowData: string[]) {
    return rowData.map((elem) => {
      const cellValue = elem == null ? "\u00A0" : elem.split("|");

      let { isError, progress, status, errorMessage } = this.getStatusBar(
        elem,
        cellValue
      );

      return (
        <td
          onClick={() =>
            isError
              ? this.setShowModal(true, errorMessage)
              : this.setShowModal(false)
          }
          // onClick={() => this.setShowModal(true, elem)}
        >
          {
            <div
              className="valueContent"
              style={{ width: this.objectStyle.widthCompaniesColumn + "px" }}
            >
              <section className="bar-graph bar-graph-horizontal bar-graph-one">
                {this.renderBar(progress, status, elem)}
              </section>
              <p className="infoCell">
                {elem == null
                  ? elem
                  : cellValue[4] === " Completed"
                  ? cellValue[0]
                  : cellValue[3]}
              </p>
            </div>
          }
        </td>
      );
    });
  }

  renderBar(progress: string, status: string = "", elem: string) {
    const barColor: string = this.getColorFomStatus(status);

    const style = {
      width: progress,
      backgroundColor: barColor,
      height: `100%`,
    };

    return (
      <React.Fragment>
        <div className="bar-value">
          <div
            className="bar-value-element"
            style={{ color: this.objectStyle?.textColorBar }}
          >
            {progress}
          </div>
        </div>
        <div
          className="bar-progress bar-one"
          style={{
            background:
              status == "NA"
                ? this.objectStyle.naBar
                : this.objectStyle.backgroundBar,
          }}
        >
          <div className="bar" data-percentage={progress} style={style}></div>
        </div>
      </React.Fragment>
    );
  }

  private getStatusBar(elem, cellValue) {
    let isError: boolean = false;
    let errorMessage: string;

    if (cellValue.length < 3 && cellValue.length > 1) {
      isError = true;
      errorMessage = cellValue[1];
    } else if (cellValue.length === 6 && cellValue[5] !== "") {
      isError = true;
      errorMessage = cellValue[5];
    } else if (cellValue.length === 1 && Number.isNaN(Number(elem))) {
      isError = true;
      errorMessage = cellValue[0];
    }

    let progress: string;
    if (isError) {
      progress = "Error";
    } else if (elem == null) {
      progress = "NA";
    } else if (Number(cellValue[4]) === 100) {
      progress = "Completed";
    } else {
      progress = Number(cellValue[4]) + "%";
    }

    let status: string = "";
    if (isError) {
      status = "Error";
    } else if (elem == null) {
      status = "NA";
    } else if (Number(cellValue[4]) === 100) {
      status = "Completed";
    } else {
      status = cellValue[5];
    }
    return { isError, progress, status, errorMessage };
  }

  private getColorFomStatus(
    status: string,
    isStatusGeneral: boolean = false
  ): string {
    debugger;
    let barColor: string;
    if (status === "Error") {
      barColor = this.objectStyle?.noStatusBar;
    } else if (status === "NA") {
      barColor = this.objectStyle?.naBar;
    } else if (status === "Completed") {
      barColor = this.objectStyle?.completedBar;
    } else if (status === "On Track") {
      barColor = this.objectStyle?.onTrackBar;
    } else if (status === "Delayed") {
      barColor = this.objectStyle?.delayedBar;
    } else if (status === "Cancelled") {
      barColor = this.objectStyle?.cancelledBar;
    } else if (status === "Overdue") {
      barColor = this.objectStyle?.overdueBar;
    } else if (status === "On Hold") {
      barColor = this.objectStyle?.onHoldBar;
    } else {
      if (isStatusGeneral && status === undefined) {
        barColor = "#ffffff00";
      } else {
        barColor = this.objectStyle?.noStatusBar;
      }
    }
    return barColor;
  }

  private sorting(props) {
    const { column, rowsValues } = props;
    if (column === "PN") {
      this.stateSort1 = !this.stateSort1;
      this.rowsValues = orderBy(
        rowsValues,
        [(o) => o[column].toLowerCase()],
        this.stateSort1 ? ["desc"] : ["asc"]
      );
    } else if (column === "CD") {
      this.stateSort2 = !this.stateSort2;
      this.rowsValues = rowsValues.sort((a, b) => {
        const dateA = this.parseDate(a);
        const dateB = this.parseDate(b);
        return this.stateSort2
          ? dateA.getTime() - dateB.getTime()
          : dateB.getTime() - dateA.getTime();
      });
    } else if (column === "PR") {
      this.stateSort3 = !this.stateSort3;
      this.rowsValues = orderBy(
        rowsValues,
        [(o) => Number(o[column])],
        this.stateSort3 ? ["desc"] : ["asc"]
      );
    }

    ReactAwesomeTable.update({
      columnsValues: this.columnsValues,
      rowsValues: this.rowsValues,
      size: 200,
      showModal: false,
      errorMessage: "",
    });
  }

  private parseDate(s) {
    const months = {
      jan: 0,
      feb: 1,
      mar: 2,
      apr: 3,
      may: 4,
      jun: 5,
      jul: 6,
      aug: 7,
      sep: 8,
      oct: 9,
      nov: 10,
      dec: 11,
    };
    const p = s.CD?.split("-");
    const date: Date = new Date(
      Number("20" + p[1]),
      months[p[0].toLowerCase()],
      1
    );
    return this.dateIsValid(date) ? date : new Date(9999, 1, 1);
  }

  private dateIsValid(date: Date) {
    return date instanceof Date && !isNaN(date.valueOf());
  }

  private static updateCallback: (data: object) => void = null;

  public static update(newState: State) {
    if (typeof ReactAwesomeTable.updateCallback === "function") {
      ReactAwesomeTable.updateCallback(newState);
    }
  }

  public state: State = initialState;

  public componentWillMount() {
    ReactAwesomeTable.updateCallback = (newState: State): void => {
      this.setState(newState);
    };
  }

  public componentWillUnmount() {
    ReactAwesomeTable.updateCallback = null;
  }

  public MyVerticallyCenteredModal(props) {
    this.showModal = true;
  }
}
