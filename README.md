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
- Overall
    - Add time control (?)
        - Back-end mechanism for clock control enforcement
        - UI for setting time controls in a game, displaying time

- Back-end
    - Handle disconnects (notify and terminate games, etc.)
    - Amazons
        - Improve amazons_state.is_valid_move() performance

- Front-end
    - Amazons
        - Fix board display bug with clean-up of reset_move
        - Add animation to new moves
        - Add move list
        - Phase out jQuery (it is mostly just $(cssSelector), tbh)
    - Display connection status, number of active users in top-right