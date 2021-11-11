**State:** Currently under development (expect major changes)

# Strate.gg
A hobby project dedicated to the play and exploration of various abstract strategy board games.

My ambition is to build a website for real-time and correspondence matches of these games, as well as AI analysis and practice.

# Building
`src` includes all scripts for installing dependencies and running development or production environments.

## Installing Dependencies
`. ./src/format_dev.sh` for developing on your local device.
`. ./src/format_prod.sh` for deploying to a server for production (I use AWS EC2)

## Running Development Server
`./src/serve_dev.sh`

## Running Production Server
`./src/serve_prod.sh`

## Further Notes
See `BUILDING.md`

# Do-List
1. Add last-move indicators to Amazons
1. Remove 6x6 board configuration from Amazons.
1. FE: Make the website somewhat presentable
    - Create a navigation bar
    - Create a sticky footer with (c), link to GitHub project, my personal website.
    - Display game status and player IDs neatly
        - Anonymous user ID should be shown with less characters
    - Current turn indicator + an indicator for what side the client is playing
1. Get a static IP for the production instance

## Unordered/Wish-List/Future
1. TV should play a game from memory when no live games are available
        - Design a rudimentary format for storing games
        - Create example games using AI (or local play)
        - Serve this information from the BE when no games are available
        - Create a component that wraps the game board and view and sends moves from this example game at a delay
            - (this will require that the View component is decoupled from Challenge, see "Tech Debt" section)
1. Put TV games in create-game boxes
        - Add a parameter to the TV polling backend for the game type
        - Make the create-game box a component that is created with a for loop in `App.js`
        - Glue all of these together!
1. Add Mancala
    - FE: Implementation
        - Show pebbles on `MancalaView`
        - Animate the pebbles on `MancalaView` using react-spring or similar
    - Add site-wide availability of rulesets: Option to play w/ or w/o stealing
1. Add time controls
    - BE: Planning-- how do we architecture things? How do we account for network latency?
    - FE: Display time, add configuration of time controls when creating a game
1. FE: Add option to request/suggest undo of the last move
1. Add a game-lobby chat
1. README: Explain project structure with `tree`
1. Minimize the use of CSS-in-JS, especially in `Amazons`, to the bare minimum, preferably 0
1. Add option to resign
1. Display user-friendly error for trying to go to a play page for a challenge that does not exist.
1. FE: Retry connecting upon disconnect
1. FE: Design and use a nice-looking graphic for the Mancala board and pebbles.
1. BE-Amazons: Improve amazons_state.is_valid_move() performance
1. FE-TV: Add delay to disposing of games when the game is over, as well as some sort of indicator
1. FE TV: load the component of the game only, not the whole challenge view (i.e. exclude the toolbar etc.)
1. Investigate: Why is front-end sending two join requests when `PlayPage` is loaded?
1. FE: Push challenge-create boxes downwards when the screen is not wide enough for them, and load more in as necessary!
1. camelCase (or some other specific code style) should be determined to be the style to use, and this should be enforced!
1. BE `challenge.py` should not know about what responses are being sent back! It should only return a boolean for success/error, and a potential data bundle!
1. BE `app.py` should have a function for turning successful challenge.method() calls and those with errors to network payloads. `Socket.js` should mirror this on the receiving end.
