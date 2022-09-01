import * as React from "react";

export interface State {
  textLabel: string;
  textValue: string;
  size: number;
  background?: string;
  borderWidth?: number;
}

export const initialState: State = {
  textLabel: "",
  textValue: "",
  size: 200,
};

export class ReactAwesomeTable extends React.Component<{}, State> {
  constructor(props: any) {
    super(props);
    this.state = initialState;
  }

  render() {
    const { textLabel, textValue, size, background, borderWidth } = this.state;
    const style: React.CSSProperties = {
      width: size,
      height: size,
      background,
      borderWidth,
    };

    return (
      <div className="circleCard" style={style}>
        <p>
          {textLabel}
          <br />
          <em>{textValue}</em>
        </p>
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
