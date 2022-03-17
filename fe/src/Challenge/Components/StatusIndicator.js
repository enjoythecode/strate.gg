import Box from "@mui/material/Box";
import Divider from "@mui/material/Divider";

export const StatusIndicator = (props) => {
  const statusCodeToText = {
    WAITING_FOR_PLAYERS: "Waiting for players to join...",
    OVER_NORMAL: "Game over.",
    OVER_DISCONNECT: "Game over due to disconnect.",
    OVER_TIME: "Game over due to time out.",
  };
  let challengeStatusElement = <em>{statusCodeToText[props.status]}</em>;

  const playerWonCodeToText = {
    0: "White wins. 1 - 0",
    1: "Black wins. 0 - 1",
    "-2": "Draw. ½ - ½",
  };
  let playerWonElement = <em>{playerWonCodeToText[props.end.toString()]}</em>;
  let renderDivider = !(
    undefined in [challengeStatusElement, playerWonElement]
  );
  return (
    <Box sx={{ textAlign: "center" }}>
      {renderDivider ? <Divider>Status</Divider> : ""}
      {challengeStatusElement}
      <br />
      {playerWonElement}
    </Box>
  );
};
