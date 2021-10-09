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

## Running

### Start Virtual Environment
`python -m venv venv`

### Install requirements
`pip install -r requirements.txt`

### Run Development Server
Mac/Linux:
`dev_server.sh`

Windows PowerShell
`dev_server_win.ps1`

## TODOs
In rough order of priority;
1. Front-end refactor to MobX + React
    - Final milestone: Live game polling in the main page. (Improvement over `master` branch)
        - BE: Add back-end for polling current games to watch.
        - FE: Inject a smaller board into index.html that watches any live games play out, using the same component as the one that plays (!)
    - Regressions:
        - Handle disconnect (display game status)
        - Remove unnecessary elements, console.log() calls
        - Move indicators during click
        - Images instead of text on the Amazons board.
    - Improvements possible thanks to the new architecture
        - Flatten the Amazons board representation using the length of the state to simplify view code.
1. Add Mancala
    - Add site-wide availability of rulesets: Option to play w/ or w/o stealing
1. FE: Display game status, player IDs better
1. Add time control
    - BE: Planning-- how do we architecture things? How do we account for network latency?
    - FE: Display time, add configuration of time controls when creating a game
1. Add option to resign
1. FE: Add option to request/suggest undo of the last move
1. Find a good name for the project
    - Update GitHub project name
    - Explain project goals and mission in README
    - Include libre license, attribute inspiration to Lichess
    - Get a domain
1. Observe games by default.
    - Add a button to join game, rather than on-load.
1. Rudimentary DevOps
    - Script to spawn an AWS EC2 instance
    - Static IP for the website, put that in DNS
1. Add a game-specific chat
1. Retry connecting upon disconnect
1. BE-Amazons: Improve amazons_state.is_valid_move() performance