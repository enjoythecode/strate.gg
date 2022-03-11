import { observer } from "mobx-react";
import { useState } from "react";
import "../grid.css";

const boardCss = (x) => {
  return {
    aspectRatio: "1 / 1",
    display: "grid",
    gridTemplateColumns: "repeat(" + x + ", 1fr)",
    gridTemplateRows: "repeat(" + x + ", 1fr)",
    position: "relative",
    width: "70vmin",
    height: "70vmin",
  };
};

const pieceCss = {
  position: "absolute",
  width: "10%",
  height: "10%",
};

const AmazonsView = observer(({ game_state }) => {
  // the cells that are clicked as part of the current move
  const [selection, setSelection] = useState({
    from: null,
    to: null,
    shoot: null,
  });

  let currentSelectionStep = () => {
    if (selection["from"] === null) return "from";
    if (selection["to"] === null) return "to";
    if (selection["shoot"] === null) return "shoot";

    // TODO is it good style to throw an error here?
    return null; // should be unreachable
  };

  let clickCell = (c) => {
    // check if it is the players turn before allowing a click
    // checks for observers because client_turn == -1 if the client is not a player
    if (
      game_state.turn === game_state.challenge.client_turn &&
      game_state.challenge.status === "IN_PROGRESS"
    ) {
      switch (currentSelectionStep()) {
        case "from":
          if (
            game_state.board[Number(c[0])][Number(c[1])] ===
            game_state.turn + 1
          ) {
            // when the new value of selection depends on the old value, we use what is called a
            // *functional update*. Read more at https://reactjs.org/docs/hooks-reference.html#functional-updates
            setSelection((selection) => {
              return { ...selection, from: c };
            });
          }
          break;

        case "to":
          if (game_state.cell_can_reach(selection["from"], c)) {
            setSelection((selection) => {
              return { ...selection, to: c };
            });
          } else {
            setSelection({ from: null, to: null, shoot: null });
          }
          break;

        case "shoot":
          if (
            game_state.cell_can_reach(selection["to"], c, selection["from"])
          ) {
            // we do not set the state within this if-block because we want the selection to be reset right away
            game_state.challenge.send_move({ ...selection, shoot: c });
          }
          setSelection({ from: null, to: null, shoot: null });
          break;

        default:
          break;
      }
    }
  };

  let styleClassesForCellAtCoord = (cell) => {
    let classes = [];
    let x = Number(cell[0]);
    let y = Number(cell[1]);

    // last move indicator
    /*
    if (game_state.lastMove !== null && game_state.lastMove.includes(cell))
      classes.push("indicatorLastMove");*/
    if (
      currentSelectionStep() === "to" &&
      game_state.cell_can_reach(selection["from"], cell)
    )
      classes.push("indicatorPrimary");
    if (
      currentSelectionStep() === "shoot" &&
      game_state.cell_can_reach(selection["to"], cell, selection["from"])
    )
      classes.push("indicatorSecondary");
    if (currentSelectionStep() === "shoot" && selection["to"] === cell)
      classes.push("indicatorSecondary");

    if (classes.length > 0) {
      // this checks if this cell got an indicator class
      classes.push(
        currentSelectionStep() === "shoot" &&
          [selection["from"], selection["to"]].includes(cell)
          ? "indicatorOuter"
          : "indicatorInner"
      );
    }

    // TODO: separate this logic because it never changes
    classes.push(
      ((y % game_state.config.size) + x) % 2 ? "cellLight" : "cellDark"
    );

    return classes.join(" ");
  };

  let pieces = [];

  for (let x = 0; x < game_state.config.size; x++) {
    for (let y = 0; y < game_state.config.size; y++) {
      if (game_state.board[x][y] !== 0) {
        let img_src = [
          "/images/wqueen.png",
          "/images/bqueen.png",
          "/images/fire.png",
        ][game_state.board[x][y] - 1];
        let img_alt = ["White Queen", "Black Queen", "Burnt Off Square"][
          game_state.board[x][y] - 1
        ];

        let positionCss = {
          left: y * 10 + "%", // TODO: FIX: Make this adaptive to board size!
          top: x * 10 + "%",
        };

        pieces.push(
          <img
            src={img_src}
            alt={img_alt}
            style={{ ...positionCss, ...pieceCss }}
            key={pieces.length}
            onClick={() => {
              clickCell(x.toString() + y.toString());
            }}
          ></img>
        );
      }
    }
  }

  if (game_state) {
    let boardCells = [];
    let size = game_state.board.length;

    for (let x = 0; x < size; x++) {
      for (let y = 0; y < size; y++) {
        boardCells.push(
          <div
            className={styleClassesForCellAtCoord(x.toString() + y.toString())}
            key={x * size + y}
            onClick={() => {
              clickCell(x.toString() + y.toString());
            }}
          ></div>
        );
      }
    }

    return (
      <div style={boardCss(game_state.board.length)}>
        {boardCells}
        {pieces}
      </div>
    );
  } else {
    <p>Game is loading...</p>;
  }
});

export { AmazonsView };
