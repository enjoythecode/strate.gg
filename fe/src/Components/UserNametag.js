import Typography from "@mui/material/Typography";
import { observer } from "mobx-react-lite";
import { useRootStore } from "../Store/RootStore";

export default observer(function UserNametag({ userId }) {
  const RootStore = useRootStore();

  let is_self = RootStore.client_uid === userId;
  return (
    <Typography
      sx={{
        fontFamily: "Inconsolata",
        fontWeight: 700,
        fontSize: 18,
      }}
    >
      {"Guest #" + userId.slice(0, 7) + (is_self ? " (You)" : "")}
    </Typography>
  );
});
