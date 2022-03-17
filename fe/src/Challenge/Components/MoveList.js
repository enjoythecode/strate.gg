import Typography from "@mui/material/Typography";

export const MoveList = ({ moves }) => {
  let rendered_moves = [];

  for (let index = 0; index < moves.length; index++) {
    rendered_moves.push(
      <li key={index}>
        <Typography
          sx={{
            fontFamily: "Inconsolata",
          }}
        >
          {index + 1}
          {". "}
          {index < moves.length ? moves[index] : "..."}
        </Typography>
      </li>
    );
  }

  // https://stackoverflow.com/questions/18614301/keep-overflow-div-scrolled-to-bottom-unless-user-scrolls-up
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
      <ul style={{ listStyle: "none" }}>{rendered_moves}</ul>
    </div>
  );
};
