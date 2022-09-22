import * as React from "react";
import powerbi from "powerbi-visuals-api";
import DataViewMatrix = powerbi.DataViewMatrix;

export interface State {
  matrix: DataViewMatrix;
  size: number;
  widthFirstColumn?: number;
  widthCompaniesColumn?: number;
  progressBar?: string;
  backgroundBar?: string;
  completedBar?: string;
  textColorBar?: string;
}

export const initialState: State = {
  matrix: null,
  size: 200,
  widthFirstColumn: 400,
  widthCompaniesColumn: 200,
};

export interface objColors {}

export const colorsStatus = [
  "Completed",
  { color: "#cfcfcf" },
  "On Track",
  { color: "#8dc989" },
  "Delayed",
  { color: "#d4d722" },
  "Cancelled",
  { color: "#463a3a" },
  "Overdue",
  { color: "#db5151" },
];

export class ReactAwesomeTable extends React.Component<{}, State> {
  private progressBar: string;
  private backgroundBar: string;
  private completedBar: string;
  private textColorBar: string;

  constructor(props: any) {
    super(props);
    this.state = initialState;
  }

  render() {
    const {
      matrix,
      size,
      widthFirstColumn,
      progressBar,
      backgroundBar,
      completedBar,
      textColorBar,
    } = this.state;
    const style: React.CSSProperties = {
      width: size,
      height: size,
    };

    this.progressBar = progressBar;
    this.backgroundBar = backgroundBar;
    this.completedBar = completedBar;
    this.textColorBar = textColorBar;

    const columnsValues = matrix?.columns?.root?.children;
    const rowsValues = matrix?.rows?.root?.children;

    return (
      <div className="mainDiv">
        <table>
          <thead>
            <tr>
              <th
                className="sticky-col first-col"
                onClick={() => this.testClick({ patata: "test" })}
                style={{ minWidth: widthFirstColumn + "px" }}
              >
                <p>Project Name</p>
              </th>
              <th
                className="sticky-col second-col"
                style={{ left: widthFirstColumn + "px" }}
              >
                <p>Completion Date</p>
              </th>
              <th
                className="sticky-col third-col"
                style={{ left: widthFirstColumn + 145 + "px" }}
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
                    style={{ minWidth: widthFirstColumn + "px" }}
                  >
                    <p className="projectName">{projectName}</p>
                  </td>
                  <td
                    className="sticky-col second-col"
                    style={{ left: widthFirstColumn + "px" }}
                  >
                    <p className="completionDate">{completionDate}</p>
                  </td>
                  <td
                    className="sticky-col second-col"
                    style={{ left: widthFirstColumn + 145 + "px" }}
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
      </div>
    );
  }

  renderTableData(rowData: string[]) {
    return rowData.map((elem) => {
      const cellValue = elem == null ? "\u00A0" : elem.split("|");
      return (
        <td>
          {elem == null ? (
            <div
              className="valueContent"
              style={{ width: this.state.widthCompaniesColumn + "px" }}
            >
              <section className="bar-graph bar-graph-horizontal bar-graph-one">
                {this.renderBar(0, true)}
              </section>
              <p className="infoCell" style={{ height: "21px" }}>
                {elem}
              </p>
            </div>
          ) : (
            <div className="valueContent">
              <section className="bar-graph bar-graph-horizontal bar-graph-one">
                {this.renderBar(Number(cellValue[3]))}
              </section>
              <p className="infoCell">{cellValue[2]}</p>
            </div>
          )}
        </td>
      );
    });
  }

  renderBar(progress: number, isNull: boolean = false) {
    const greyColor = "#cfcfcf";
    const style = {
      width: `${progress}%`,
      backgroundColor: isNull
        ? greyColor
        : progress !== 100
        ? this.progressBar
        : this.completedBar,
      height: `100%`,
    };

    return (
      <React.Fragment>
        <div className="bar-value">
          <div
            className="bar-value-element"
            style={{ color: this.textColorBar }}
          >
            {isNull ? `NA` : progress !== 100 ? `${progress}%` : `Completed`}
          </div>
        </div>
        <div
          className="bar-progress bar-one"
          style={{ background: isNull ? greyColor : this.backgroundBar }}
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
}
