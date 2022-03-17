import Box from "@mui/material/Box";
import Divider from "@mui/material/Divider";

export const StatusIndicator = (props) => {
  const statusCodeToText = {
    WAITING_FOR_PLAYERS: "Waiting for players to join...",
    OVER_NORMAL: "Game over.",
    OVER_DISCONNECT: "Game over due to disconnect.",
    OVER_TIME: "Game over due to time out.",
  };
  let challengeStatusElement = statusCodeToText[props.status];

  const playerWonCodeToText = {
    0: "White wins. 1 - 0",
    1: "Black wins. 0 - 1",
    "-2": "Draw. ½ - ½",
  };
  let playerWonElement = playerWonCodeToText[props.end.toString()];

  return (
    <Box sx={{ textAlign: "center" }}>
      <em>{challengeStatusElement}</em>
      <br />
      <em>{playerWonElement}</em>
    </Box>
  );
};
