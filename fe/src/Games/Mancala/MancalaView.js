import { observer } from "mobx-react";
import React from "react";

const MancalaView = observer(
  class _ extends React.Component {
    render() {
      let downPits = [];
      let upPits = [];
      let downBank; // right bank, belongs to player down
      let upBank; // left bank, belongs to player up

      // build the pit components
      for (let k = 0; k < 6; k++) {
        downPits.push(
          <div
            className={"mancala-pit mancala-pit-d-" + (k + 1).toString()}
            key={k}
            onClick={this.props.game_state.clickPit.bind(null, k, "down")}
          >
            {this.props.game_state.board[k]}
          </div>
        );

        upPits.push(
          <div
            className={"mancala-pit mancala-pit-u-" + (6 - k).toString()}
            key={k}
            onClick={this.props.game_state.clickPit.bind(null, k, "up")}
          >
            {this.props.game_state.board[k + 7]}
          </div>
        );
      }

      // build the banks
      downBank = (
        <div className="mancala-bank mancala-bank-r">
          {this.props.game_state.board[6]}
        </div>
      );

      upBank = (
        <div className="mancala-bank mancala-bank-l">
          {this.props.game_state.board[13]}
        </div>
      );

      return (
        <div className="mancala-board">
          {downPits}
          {downBank}

          {upPits}
          {upBank}

          <div className="mancala-pebble-container">
            <div className="mancala-pebble mancala-pebble-1"></div>
          </div>
        </div>
      );
    }
  }
);

export { MancalaView };
