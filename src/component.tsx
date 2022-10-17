import * as React from "react";
import powerbi from "powerbi-visuals-api";
import DataViewMatrix = powerbi.DataViewMatrix;
import { TableSettings } from "./settings";

type ThumbReact = {
  left: number;
  width: number;
} | null;

export interface State {
  matrix: DataViewMatrix;
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
  matrix: null,
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
  private matrix: any;
  constructor(props: any) {
    super(props);
    this.state = initialState;
  }

  render() {
    const { matrix, size, showModal, errorMessage, objectStyle } = this.state;
    this.matrix = matrix;
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

    const columnsValues = matrix?.columns?.root?.children;
    const rowsValues = matrix?.rows?.root?.children;

    return (
      <div className="mainDiv">
        <table>
          <thead>
            <tr>
              <th
                className="sticky-col first-col"
                // onClick={() => this.testClick({ patata: "test" })}
                style={{ minWidth: objectStyle.widthFirstColumn + "px" }}
              >
                <p>Project Name</p>
              </th>
              <th
                className="sticky-col second-col"
                style={{ left: objectStyle.widthFirstColumn + "px" }}
              >
                <p>Completion Date</p>
              </th>
              <th
                className="sticky-col third-col"
                style={{ left: objectStyle.widthFirstColumn + 145 + "px" }}
              >
                <p>Progress</p>
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
              const projectName = property.value as string;
              const rowData = Object.keys(property.values).map(
                (key) => property.values[key].value
              );
              const completionDate = rowData
                .find((row) => row !== null)
                .split("|")[0];

              const progressStautsValue = rowData
                .find((row) => row !== null)
                .split("|")[1];

              let isError: boolean = false;
              if (
                completionDate === null ||
                completionDate === undefined ||
                completionDate === "" ||
                Number.isNaN(progressStautsValue)
              ) {
                isError = true;
              }

              debugger;
              console.log(rowData);

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
                      {isError ? "Error" : completionDate}
                    </p>
                  </td>
                  <td
                    className="sticky-col third-col-value"
                    style={{ left: objectStyle.widthFirstColumn + 145 + "px" }}
                  >
                    <div className="svg-container">
                      <svg width="17" height="17">
                        <circle cx="8" cy="8" r="8" fill="red" />
                      </svg>
                    </div>
                    <p className="progressStauts">
                      {isError ? "Error" : Number(progressStautsValue) + "%"}
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
      matrix: this.matrix,
      size: 200,
      showModal: arg0,
      errorMessage: errorMessage,
    });
  }

  renderTableData(rowData: string[]) {
    return rowData.map((elem) => {
      const cellValue = elem == null ? "\u00A0" : elem.split("|");
      let isError: boolean = false;
      let errorMessage: string;

      if (cellValue.length < 3 && cellValue.length > 1) {
        isError = true;
        errorMessage = cellValue[1];
      } else if (cellValue.length === 6 && cellValue[5] !== "") {
        isError = true;
        errorMessage = cellValue[5];
      }

      let progress: string;
      if (isError) {
        progress = "Error";
      } else if (elem == null) {
        progress = "NA";
      } else if (Number(cellValue[3]) === 100) {
        progress = "Completed";
      } else {
        progress = Number(cellValue[3]) + "%";
      }

      let status: string = "";
      if (isError) {
        status = "Error";
      } else if (elem == null) {
        status = "NA";
      } else if (Number(cellValue[3]) === 100) {
        status = "Completed";
      } else {
        status = cellValue[4];
      }

      return (
        <td
          // onClick={() =>
          //   isError
          //     ? this.setShowModal(true, errorMessage)
          //     : this.setShowModal(false)
          // }
          onClick={() => this.setShowModal(true, elem)}
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
                  : cellValue[2]}
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

  private getColorFomStatus(status: string): string {
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
      barColor = this.objectStyle?.noStatusBar;
    }
    return barColor;
  }

  private testClick(test) {}

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
