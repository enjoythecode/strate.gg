import React from "react";
import { EnableSoundToggle } from "../Store/Components/EnableSoundToggle";

const Footer = () => {
  return (
    <footer>
      <p>
        <EnableSoundToggle></EnableSoundToggle>
        <br></br>
        <span>
          A project by <a href="https://enjoythecode.com">Sinan</a> dedicated to
          the play and exploration of abstract strategy board games.
          <br />
          <span>
            Take a look at the{" "}
            <a href="https://github.com/enjoythecode/strate.gg">source code.</a>
          </span>
        </span>
      </p>
    </footer>
  );
};

export default Footer;
