import * as React from "react";
import powerbi from "powerbi-visuals-api";
import DataViewMatrix = powerbi.DataViewMatrix;

export interface State {
  matrix: DataViewMatrix;
  textValue: string;
  size: number;
  background?: string;
  borderWidth?: number;
}

export const initialState: State = {
  matrix: null,
  textValue: "",
  size: 200,
};

export class ReactAwesomeTable extends React.Component<{}, State> {
  constructor(props: any) {
    super(props);
    this.state = initialState;
  }

  render() {
    const { matrix, textValue, size, background, borderWidth } = this.state;
    debugger;
    const style: React.CSSProperties = {
      width: size,
      height: size,
      background,
      borderWidth,
    };
    const columnsValues = matrix?.columns?.root?.children;
    const rowsValues = matrix?.rows?.root?.children;

    return (
      <div className="mainDiv">
        <table>
          <thead>
            <tr>
              <th
                className="sticky-col"
                onClick={() => this.holis({ patata: "sida" })}
              >
                <p>Project Name</p>
              </th>
              <th className="sticky-col">
                <p>Progress</p>
              </th>
              {columnsValues?.map((property, index) => {
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
                .split("|")[0];
              return (
                <tr key={index}>
                  <td className="sticky-col">
                    <p className="projectName">{projectName}</p>
                  </td>
                  <td className="sticky-col">
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
    return rowData.map((elem, index) => {
      const cellValue = elem == null ? "\u00A0" : elem.split("|");
      return (
        <td>
          {elem == null ? (
            cellValue
          ) : (
            <div className="valueContent">
              <section className="bar-graph bar-graph-horizontal bar-graph-one">
                {this.renderBar(Number(cellValue[2]))}
              </section>
              <p className="infoCell">{cellValue[1]}</p>
            </div>
          )}
        </td>
      );
    });
  }

  renderBar(progress: number) {
    const style = {
      width: `${progress}%`,
      backgroundColor: progress !== 100 ? `#64b2d1` : `#8d8d8d`,
      height: `100%`,
    };
    return (
      <div className="bar-progress bar-one">
        <div
          className="bar"
          data-percentage={progress !== 100 ? `${progress}%` : `Completed`}
          style={style}
        ></div>
        <span className="bar-value"></span>
      </div>
    );
  }

  private holis(patata) {
    console.log(patata);
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
