**State:** Currently under development (expect major changes)

# Game of Amazons
This is a hobby project of mine, which consists of a website for playing the game and a collection of AI agents written in Python that play the game.
This is also my sandbox for testing out different reinforcement learning techniques.

## Code Structure
```
src
├── ai            => AI opponents
│   ├── bots      
│   └── matches   => Record of games between bots, for archival and research purposes
├── py_logic      => Python representation of games and boards for the back-end server
├── static        => Front-end assets
│   ├── images    
│   ├── view      => HTML templates
│   ├── script    
│   └── style     
└── app.py        => Flask server lives here
```

## Running the Development Server
### Front-end
Install requirements
```bash
cd fe
npm install
```

```bash
cd fe # if not already in
npm run start
```

### Back-end
Start venv and install requirements

```bash
python -m venv venv
source ./venv/bin/activate
pip install -r requirements.txt
```

Start the server
```bash
cd be
python app.py
```

# Do-List
## Additions!
1. Add Mancala
    - FE: Implementation
        - Write proper UI for the game
    - Add site-wide availability of rulesets: Option to play w/ or w/o stealing
1. Add time controls
    - BE: Planning-- how do we architecture things? How do we account for network latency?
    - FE: Display time, add configuration of time controls when creating a game
1. Add option to resign
1. FE: Add option to request/suggest undo of the last move
1. Find a good name for the project
    - Update GitHub project name
    - Explain project goals and mission in README
    - Include libre license, attribute inspiration to Lichess
    - Get a domain
1. Rudimentary DevOps
    - Script to spawn an AWS EC2 instance
    - Static IP for the website, put that in DNS
1. Add a game-lobby chat

## Improvements!
1. Observe games by default.
    - Add a button to join game, rather than on-load.
1. FE: Display game status, player IDs better
    - Current turn indicator (with some sort of combination of background color + bold?)
    1. Display user-friendly error for trying to go to a play page for a challenge that does not exist.
1. FE: Retry connecting upon disconnect
1. BE-Amazons: Improve amazons_state.is_valid_move() performance
1. FE-TV: Add delay to disposing of games when the game is over, as well as some sort of indicator

## Bugs!
1. Fix: FE assumes back-end is sending `pjm` rather than turn.
1. Fix: TV is not game-agnostic.
1. Investigate: Why is front-end sending two join requests when `PlayPage` is loaded?

## Tech Debt!
1. Completely separate Amazons game logic and UI representation in `Amazons.js`
    1. Current clicks should be tracked in the view component, not the game logic class
1. `AmazonView` should not make any calls to the Challenge store; it should receive the necessary "is-clickable + client player no #" information as a prop and otherwise be de-coupled.
1. CSS properties should not live in JavaScript/React, they should be in a separate CSS sheet that UI accesses by assigning relevant classes.
1. camelCase (or some other specific code style) should be determined to be the style to use, and this should be enforced!
1. Define an interface for game logic classes (?) and view components (definitely)
1. Game logic classes should not need to access Challenge!
1. BE `challenge.py` should not know about what responses are being sent back! It should only return a boolean for success/error, and a potential data bundle!
1. BE `app.py` should have a function for turning successful challenge.method() calls and those with errors to network payloads. `Socket.js` should mirror this on the receiving end.