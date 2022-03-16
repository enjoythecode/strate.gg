export const PlayerTagView = (props) => {
  let spanClasses = ["player-tag"];
  if (props.isSelf) {
    spanClasses.push("player-tag-self");
  }

  let divClasses = ["challenge-dashboard-player"];

  if (props.isTurn) {
    divClasses.push("challenge-dashboard-player-hasTurn");
  }

  let display;
  if (props.displayName === null) {
    display = "Waiting for opponent...";
  } else {
    display = "Guest #" + props.displayName.slice(0, 7);
  }

  return (
    <div className={divClasses.join(" ")}>
      <div>{props.colorBadge}</div>
      <span className={spanClasses.join(" ")}>{display}</span>
    </div>
  );
};
