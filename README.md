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
- Back-end
    - Amazons
        - Simplify amazons_state.get_valid_moves() and amazons_state.count_valid_moves()
        - Improve amazons_state.is_valid_move() performance.
- Front-end
    - Simple page-wide CSS updates
    - Phase out jQuery (it is mostly just $(cssSelector), tbh)
    - Amazons
        - Fix board display bug with clean-up of reset_move
        - Add animation to new moves
        - Add move list