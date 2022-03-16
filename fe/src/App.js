import { observer } from "mobx-react";
import React from "react";
import { useRootStore } from "./Store/RootStore";
import Grid from "@mui/material/Grid";
import Button from "@mui/material/Button";
import Paper from "@mui/material/Paper";
import Typography from "@mui/material/Typography";

const App = observer(() => {
  const RootStore = useRootStore();
  return (
    <Grid container>
      <Grid item xs={12} sm={12} md={6} lg={4} xl={4}>
        <Paper elevation={2} sx={{ padding: 2 }}>
          <Typography variant="h2">Amazons</Typography>
          <br></br>
          <Button
            variant="outlined"
            fullWidth={false}
            onClick={() => {
              RootStore.socket.create_new_challenge({
                game_name: "amazons",
                game_config: { size: 10, variation: 0 },
              });
            }}
          >
            Create Challenge
          </Button>
        </Paper>
      </Grid>
    </Grid>
  );
});

export default App;
