import { observer } from "mobx-react";
import React from "react";
import { useRootStore } from "./Store/RootStore";

const App = observer(() => {
  const RootStore = useRootStore();
  return (
    <div>
      <div style={{ display: "flex", justifyContent: "center" }}>
        <div id="challenge-create-box-container">
          <div
            id="challenge-create-box-amazons"
            className="challenge-create-box"
          >
            <h2>Amazons</h2>
            <button
              onClick={() => {
                RootStore.socket.create_new_challenge({
                  game_name: "amazons",
                  game_config: { size: 10, variation: 0 },
                });
              }}
            >
              Create Challenge
            </button>
            <br></br>
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
  );
});

export default App;
