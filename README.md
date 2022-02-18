> This project is currently under development in **v0.\*.\***. Most code in this repository is not final.  See the current version and unreleased changes in the [changelog.](CHANGELOG.md)

# Strate.gg
A website dedicated to the play and exploration of various abstract strategy board games.

My ambition is to build a website for real-time and correspondence matches of these games, as well as AI analysis and practice.

I am also using this project as a real-world website to learn good software development practices such as testing, linting, versioning.


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

# Essential To-do
1. Add Mancala
    - FE: Implementation
        - Show pebbles on `MancalaView`
        - Animate the pebbles on `MancalaView` using react-spring or similar
1. Add account system
    - Add MongoDB database
    - Add tasks of how this would appear across the site
1. Add time controls
    - BE: Planning-- how do we architecture things? How do we account for network latency?
    - FE: Display time, add configuration of time controls when creating a game
    
# Useful To-do
1. Add a game-lobby chat
1. Add site-wide availability of rulesets: Option to play w/ or w/o stealing for mancala
1. AI opponents for Amazons
    1. Create the ability to play against a simple AI
        - FE: add button for AI challenge
        - BE: add code for loading AI opponent, and responding with AI move in games where one opponent is AI
            - In User, ability to distinguish between humans and robots
            - In make_move, hook that checks if it is an AI player turn, and if so plays it
            - Q: how do we trigger a separate process that will calculate the AI move, especially when it might take some number of seconds?
    1. Add multiple AI (say, MCTS, blocker)
    1. Look up established models to see if any of them are open-source.
    1. Think about training my own model so that I can have bots at different difficulties!
1. Put TV games in create-game boxes
    - Add a parameter to the TV polling backend for the game type
    - Make the create-game box a component that is created with a for loop in `App.js`
    - Glue all of these together!
    - TV should play a game from memory when no live games are available
        - Design a rudimentary format for storing games
        - Create example games using AI (or local play)
        - Serve this information from the BE when no games are available
        - Create a component that wraps the game board and view and sends moves from this example game at a delay
            - (this will require that the View component is decoupled from Challenge, see "Tech Debt" section)

## Unordered/Wish-List
1. Front-end presentability improvements
    1. Fix header on mobile
    1. Make the logo clickable to go back to /index.js
    1. Make the challenge boxes be 2 per column!
    1. Challenge box button should be at the bottom and as wide as the box, and potentially capitalized for style points
    1. Make the challenge boxes properly push down when the screen is too narrow (i.e. narrow)
1. Get a static IP for the production instance
1. Look into browser back button working with router.
1. FE: Add option to request/suggest undo of the last move
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
1. camelCase (or some other specific code style) should be determined to be the style to use, and this should be enforced!
1. BE `challenge.py` should not know about what responses are being sent back! It should only return a boolean for success/error, and a potential data bundle!
1. BE `app.py` should have a function for turning successful challenge.method() calls and those with errors to network payloads. `Socket.js` should mirror this on the receiving end.
1. Load games from database if not in memory
1. Decide on primary color for the website!
1. CONTRIBUTING.md
    1. Instructions for building the website
    1. How to contribute
1. TODO.md