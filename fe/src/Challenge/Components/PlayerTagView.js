import Chip from "@mui/material/Chip";
import Avatar from "@mui/material/Avatar";

export const PlayerTagView = (props) => {
  return (
    <Chip
      avatar={<Avatar alt="White Queen" src="/images/wqueen.png" />}
      label={"Guest #" + props.displayName.slice(0, 7)}
    />
  );
};
