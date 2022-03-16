import React from "react";
import { observer } from "mobx-react";
import { useRootStore } from "../Store/RootStore";
import { EnableSoundToggle } from "../Store/Components/EnableSoundToggle";

// Modified very slightly from https://stackoverflow.com/a/12646864
const shuffleArray = function (array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
};

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
      <h1>strate.gg</h1>
      <ConnectionWidget />
    </header>
  );
};

const Footer = () => {
  // marquee is an easter egg, not shown in the UI
  const marqueeArr = [
    "Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
    "Warning: Do not use <marquee> elements as they can create visual accessibility issues and are deprecated.",
    "Comics I enjoy: xkcd",
    <a href="https://xkcd.com/1112/">Here's why Chess is not on strate.gg</a>,
  ];
  let marqueeArrShuffled = shuffleArray(marqueeArr);
  let marqueeTags = [];
  for (let i = 0; i < marqueeArr.length; i++) {
    marqueeTags.push(<span key={i}>{marqueeArrShuffled[i]}</span>);
  }

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

        {/*
            <marquee truespeed="True" scrolldelay="10" scrollamount="1">
                {marqueeTags}
            </marquee>
          */}
      </p>
    </footer>
  );
};

export { Header, Footer };
