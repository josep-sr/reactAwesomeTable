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
  // widthFirstColumn: 400,
  // widthCompaniesColumn: 200,
};

export class ReactAwesomeTable extends React.Component<{}, State> {
  private objectStyle: TableSettings;
  private showModal: boolean;
  private matrix: any;
  constructor(props: any) {
    super(props);
    this.state = initialState;
  }

  render() {
    const { matrix, size, showModal, objectStyle } = this.state;
    this.matrix = matrix;
    this.showModal = showModal;
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

    console.log(rowsValues);

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
              const progressStautsValue = rowData
                .find((row) => row !== null)
                .split("|")[1];
              const completionDate = rowData
                .find((row) => row !== null)
                .split("|")[0];

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
                    <p className="completionDate">{completionDate}</p>
                  </td>
                  <td
                    className="sticky-col second-col"
                    style={{ left: objectStyle.widthFirstColumn + 145 + "px" }}
                  >
                    <p className="progressStauts">
                      {Number(progressStautsValue) + "%"}
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
          <span className="close-button">&times;</span>
          <h1>Hello, I am a modal!</h1>
        </div>
      </div>
    );
  }

  setShowModal(arg0: boolean) {
    debugger;
    this.showModal = arg0;
    ReactAwesomeTable.update({
      matrix: this.matrix,
      size: 200,
      showModal: true,
    });
  }

  renderTableData(rowData: string[]) {
    return rowData.map((elem) => {
      const cellValue = elem == null ? "\u00A0" : elem.split("|");

      // function setShowModal(arg0: boolean): void {
      //   throw new Error("Function not implemented.");
      // }

      return (
        <td onClick={() => this.setShowModal(true)}>
          {
            <div
              className="valueContent"
              style={{ width: this.objectStyle.widthCompaniesColumn + "px" }}
            >
              <section className="bar-graph bar-graph-horizontal bar-graph-one">
                {elem == null
                  ? this.renderBar(0, "NA", elem)
                  : this.renderBar(Number(cellValue[3]), cellValue[4], elem)}
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

  renderBar(progress: number, status: string = "", isNull: any) {
    let barColor: string = "";

    if (status === "NA") {
      barColor = this.objectStyle?.naBar;
    } else if (status === " Completed") {
      barColor = this.objectStyle?.completedBar;
    } else if (status === " On Track") {
      barColor = this.objectStyle?.onTrackBar;
    } else if (status === " Delayed") {
      barColor = this.objectStyle?.delayedBar;
    } else if (status === " Cancelled") {
      barColor = this.objectStyle?.cancelledBar;
    } else if (status === " Overdue") {
      barColor = this.objectStyle?.overdueBar;
    } else if (status === " On Hold") {
      barColor = this.objectStyle?.onHoldBar;
    } else {
      barColor = this.objectStyle?.noStatusBar;
    }

    const style = {
      width: `${progress}%`,
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
            {isNull == null
              ? `NA`
              : progress !== 100
              ? `${progress}%`
              : `Completed`}
          </div>
        </div>
        <div
          className="bar-progress bar-one"
          style={{
            background:
              isNull == null
                ? this.objectStyle.naBar
                : this.objectStyle.backgroundBar,
          }}
        >
          <div
            className="bar"
            data-percentage={progress !== 100 ? `${progress}%` : `Completed`}
            style={style}
          ></div>
        </div>
      </React.Fragment>
    );
  }

  private testClick(test) {
    console.log(test);
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
    console.log("holis");
    this.showModal = true;
  }
}
