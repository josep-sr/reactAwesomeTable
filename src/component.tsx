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
  private matrix: DataViewMatrix = null;

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
      <div
        className="pivotTable"
        aria-label="Grid"
        pbi-focus-tracker-idx="99"
        style={style}
      >
        <table>
          <thead>
            <tr>
              <th>
                <p>Project Name</p>
              </th>
              <th>
                <p>Project Status</p>
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
              debugger;
              const projectName = property.value as string;
              return (
                <tr key={index}>
                  <td>{projectName}</td>
                  {this.renderTableData(property.values)}
                  {/* <td></td>
                  <td>{this.renderBar(100)}</td> */}
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    );
  }

  renderTableData(values: any) {
    console.log(values);
    const dataGood = Object.keys(values).map((key) => values[key].value);
    console.log(dataGood);
    return values?.map((elem, index) => {
      const cellValues = elem.value?.split("|");
      return (
        <React.Fragment>
          <td>{cellValues[0]}</td>
        </React.Fragment>
      );
    });
  }

  renderBar(progress: number) {
    const style = {
      width: `${progress}%`,
      backgroundColor: `#64b2d1`,
      height: `100%`,
    };
    return (
      <div className="bar-progress">
        <div style={style}></div>
      </div>
    );
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
