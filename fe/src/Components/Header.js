import React from "react";
import { observer } from "mobx-react";
import { useRootStore } from "Store/RootStore";

import EnableSoundToggle from "Store/Components/EnableSoundToggle";

import { CONNECTION_STATUS_ENUM } from "Network/Socket";

import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import Chip from "@mui/material/Chip";
import Link from "@mui/material/Link";
import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import Container from "@mui/material/Container";

function Header() {
  return (
    <Box sx={{ marginBottom: 4 }}>
      <AppBar position="static" color="transparent">
        <Toolbar variant="dense">
          <Container fixed>
            <Grid container justifyContent="space-between" alignItems="center">
              <Grid item>
                <ConnectionChip />
              </Grid>
              <Grid item>
                <Link
                  variant="h1"
                  color="inherit"
                  sx={{ fontSize: 30 }}
                  href="/"
                  underline="hover"
                >
                  strate.gg
                </Link>
              </Grid>
              <Grid item>
                <EnableSoundToggle />
              </Grid>
            </Grid>
          </Container>
        </Toolbar>
      </AppBar>
    </Box>
  );
}

const ConnectionChip = observer(() => {
  const RootStore = useRootStore();

  let chip_label;
  let chip_color;

  switch (RootStore.socket.connection_status) {
    case CONNECTION_STATUS_ENUM.ONLINE:
      chip_label = "Connected";
      chip_color = "success";
      break;

    case CONNECTION_STATUS_ENUM.CONNECTING:
      chip_label = "Connecting";
      chip_color = "secondary";
      break;

    case CONNECTION_STATUS_ENUM.OFFLINE:
      chip_label = "Offline";
      chip_color = "error";
      break;
  }

  return (
    <Chip
      label={chip_label}
      color={chip_color}
      variant="outlined"
      size="small"
    />
  );
});

export default Header;
