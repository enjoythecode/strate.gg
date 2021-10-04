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
1. BE: Create abstract classes that model how additional games might be added
1. Add time control
    - BE: Planning-- how do we architecture things? How do we account for network latency?
    - FE: Display time, add configuration of time controls when creating a game
1. BE-Amazons: Improve amazons_state.is_valid_move() performance