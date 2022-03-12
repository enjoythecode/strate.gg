export const MoveList = (props) => {
  let rendered_moves = [];

  for (let index = 0; index < props.moves.length; index++) {
    const move = props.moves[index];

    rendered_moves.push(
      <div
        style={{
          display: "flex",
          alignContent: "center",
          textAlign: "center",
          alignItems: "center",
        }}
        key={index}
      >
        {index + 1}.
        <div
          style={{ maxWidth: "22px", maxHeight: "22px", marginRight: "4px" }}
        >
          {/*move.color.badge*/}
        </div>
        <span>{move}</span>
      </div>
    );
  }

  // https://stackoverflow.com/questions/18614301/keep-overflow-div-scrolled-to-bottom-unless-user-scrolls-up
  if (props.moves.length !== 0) {
    return (
      <div
        style={{
          maxHeight: "11em",
          overflow: "auto",
          display: "flex",
          flexDirection: "column-reverse",
          fontFamily: "monospace",
          padding: "1em",
        }}
      >
        <div>{rendered_moves}</div>
      </div>
    );
  } else {
    return null;
  }
};