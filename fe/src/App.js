import { observer } from "mobx-react";
import React from "react";

const App = observer(({ state }) => (
  <div>
    <div style={{ display: "flex", justifyContent: "center" }}>
      <div id="challenge-create-box-container">
        <div id="challenge-create-box-amazons" className="challenge-create-box">
          <h2>Amazons</h2>
          <button
            onClick={() => {
              state.socket.create_new_game({
                game_name: "amazons",
                config: { size: 10, variation: 0 },
              });
            }}
          >
            Create Challenge
          </button>
          <br></br>
        </div>

        <div id="challenge-create-box-mancala" className="challenge-create-box">
          <h2>Mancala</h2>
          <button
            onClick={() => {
              state.socket.create_new_game({
                game_name: "mancala",
                config: {},
              });
            }}
          >
            Create Challenge
          </button>
        </div>

        <div
          id="challenge-create-box-moreToCome"
          className="challenge-create-box"
        >
          <h2>More games soon...</h2>
        </div>
      </div>
    </div>
  </div>
));

export default App;
