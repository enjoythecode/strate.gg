export const StatusIndicator = (props) => {
  let text = "";
  let els = [];
  switch (props.status) {
    case "WAITING_FOR_PLAYERS":
      text = "Waiting for players to join...";
      break;
    case "OVER_NORMAL":
      text = "Game over.";
      break;
    case "OVER_DISCONNECT":
      text = "Game over due to disconnect.";
      break;
    case "OVER_TIME":
      text = "Game over due to time out.";
      break;
    case "IN_PROGRESS":
      text = false;
      break;
    default:
      throw new Error("Unknown status code:" + props.status);
  }

  if (text) {
    els.push(<em key={0}>{text}</em>);
  }

  if (props.end !== -1) {
    els.push(<br key={1} />);
    switch (props.end) {
      case 0:
        els.push(<em key={2}>White wins. 1 - 0</em>);
        break;
      case 1:
        els.push(<em key={2}>Black wins. 0 - 1</em>);
        break;
      case -2:
        els.push(<em key={2}>Draw. ½ - ½</em>);
        break;
      default:
        throw new Error("Unknown status code" + props.end);
    }
  }

  return <div>{els}</div>;
};
