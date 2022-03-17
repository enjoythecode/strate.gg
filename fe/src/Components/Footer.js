import React from "react";

import Box from "@mui/material/Box";
import Link from "@mui/material/Link";
import Grid from "@mui/material/Grid";

const Footer = () => {
  return (
    <Box sx={{ marginTop: 8 }}>
      <footer>
        <span>
          A project by dedicated to the play and exploration of abstract
          strategy board games.
          <br />
          <Grid container spacing={2}>
            <Grid item>
              <Link href="https://enjoythecode.com">About the Developer</Link>
            </Grid>
            <Grid item>
              <Link href="https://github.com/enjoythecode/strate.gg">
                Source Code
              </Link>
            </Grid>
            <Grid item>
              <Link href="https://lichess.org/">
                Proudly inspired by lichess.org
              </Link>
            </Grid>
          </Grid>
          {""}
        </span>
      </footer>
    </Box>
  );
};

export default Footer;
