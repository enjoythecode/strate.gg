**State:** Currently under development (expect major changes)

# Game of Amazons
This is a hobby project of mine, which consists of a website for playing the game and a collection of AI agents written in Python that play the game.
This is also my sandbox for testing out different reinforcement learning techniques.

## Running

### Start Virtual Environment
`python -m venv venv`

### Install requirements
`pip install -r requirements.txt`

### Run Development Server
Mac/Linux:
`dev_server.sh`

Windows PowerShell
`win_dev_server.ps1`

## TODOs
In rough order of priority;
1. FE-Amazons: Investigate board display bug with clean-up of reset_move.
    - Likely refactor how in-progress moves are tracked and visualized.
1. FE: Display connection status, number of active users in top-right
1. BE: Handle disconnects (notify and terminate games, etc.)
1. Phase out jQuery (it is mostly just $(cssSelector), tbh)
1. BE: Improve code folder structure to be more sensible and extensible
1. BE: Create abstract classes that model how additional games might be added
1. Add time control
    - BE: Planning-- how do we architecture things? How do we account for network latency?
    - FE: Display time, add configuration of time controls when creating a game
1. BE-Amazons: Improve amazons_state.is_valid_move() performance