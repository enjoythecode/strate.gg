import React from "react";
import { observer } from "mobx-react";
import { useRootStore } from "../Store/RootStore";
import Typography from "@mui/material/Typography";

const ConnectionWidget = observer(() => {
  const RootStore = useRootStore();
  return (
    <div>
      You're {RootStore.socket.connection_status}.
      <b> {RootStore.socket.active_users}</b> online users!
    </div>
  );
});

const Header = () => {
  const RootStore = useRootStore();
  return (
    <header>
      <Typography variant="h1" sx={{ fontSize: 36 }}>
        strate.gg
      </Typography>
      <ConnectionWidget />
    </header>
  );
};

export default Header;
