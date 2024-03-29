import { observer } from "mobx-react";
import { useEffect, useState, useRef } from "react";
import isDeepEqual from "fast-deep-equal/react";
import { useRootStore } from "Store/RootStore";

import "Games/Amazons/amazons.css";

const amazonsBoardDynamicGridRules = (x) => {
  return {
    gridTemplateColumns: "repeat(" + x + ", 1fr)",
    gridTemplateRows: "repeat(" + x + ", 1fr)",
  };
};

const preload_images = () => {
  let preloadedImages = [];
  const imagesInAmazons = [
    "/images/wqueen.png",
    "/images/bqueen.png",
    "/images/fire.png",
  ];
  imagesInAmazons.forEach((imageSrc) => {
    let image = new Image();
    image.src = imageSrc;
    preloadedImages.push(image);
  });
};

const AmazonsView = observer(({ game_state, handle_move, last_move }) => {
  let allow_move = handle_move !== undefined;

  // on first load, pre-load these images
  useEffect(() => {
    preload_images();
  }, []);

  const last_move_sound_ref = useRef(last_move);
  const RootStore = useRootStore();

  useEffect(() => {
    /* play a sound when 1) last_move is not undefined 2) last_move has changed
      uses isDeepEqual because regular JS object === is value-shallow
      https://www.benmvp.com/blog/object-array-dependencies-react-useEffect-hook/ */
    if (last_move !== undefined) {
      if (!isDeepEqual(last_move_sound_ref.current, last_move)) {
        last_move_sound_ref.current = last_move;
        RootStore.sound_bridge.playMoveSoundEffect();
      }
    }
  }, [last_move]);

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
    if (allow_move) {
      let current_selection_step = currentSelectionStep();

      if (current_selection_step === "from") {
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
      } else if (current_selection_step === "to") {
        if (game_state.cell_can_reach(selection["from"], c)) {
          setSelection((selection) => {
            return { ...selection, to: c };
          });
        } else {
          setSelection({ from: null, to: null, shoot: null });
        }
      } else if (current_selection_step === "shoot") {
        if (game_state.cell_can_reach(selection["to"], c, selection["from"])) {
          // we do not set the state within this if-block because we want the selection to be reset right away
          handle_move({ ...selection, shoot: c });
        }
        setSelection({ from: null, to: null, shoot: null });
      }
    }
  };

  let last_move_cells =
    last_move === undefined
      ? undefined
      : [last_move["from"], last_move["to"], last_move["shoot"]];

  let styleClassesForCellAtCoord = (cell) => {
    let classes = [];
    let x = Number(cell[0]);
    let y = Number(cell[1]);

    // last move indicator
    if (last_move_cells !== undefined && last_move_cells.includes(cell))
      classes.push("indicatorLastMove");
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

    // if we have any indicators, we will check if this indicator should be inner or outer
    if (classes.length > 0) {
      classes.push(
        currentSelectionStep() === "shoot" &&
          [selection["from"], selection["to"]].includes(cell)
          ? "indicatorOuter"
          : "indicatorInner",
      );
    }

    // TODO: separate this logic because it never changes
    classes.push(
      ((y % game_state.config.size) + x) % 2 ? "cellLight" : "cellDark",
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
            className={"amazonsPiece"}
            style={{ ...positionCss }}
            key={pieces.length}
            onClick={() => {
              clickCell(x.toString() + y.toString());
            }}
          ></img>,
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
          ></div>,
        );
      }
    }

    return (
      <div
        className={"amazonsBoard"}
        style={amazonsBoardDynamicGridRules(game_state.board.length)}
      >
        {boardCells}
        {pieces}
      </div>
    );
  } else {
    <p>Game is loading...</p>;
  }
});

export { AmazonsView };
