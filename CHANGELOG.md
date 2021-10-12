# 2021-10-12
- BE responses are now better suited for a game-agnostic network interface.
# 2021-10-11
- You can no longer click on an Amazons board for a move if it isn't your turn or you are just observing.
- Fix bug where player could move in a game that was not in progress!
- Fix bug where players could join a game that was not in progress! (Commonly occured when using back button on the browser.)
- Completed front-end refactor to MobX + React
- Rough first Mancala implementation
# 2021-10-09
- Major `fex` refactor progress: TV prototype works!
    - Back-end API for polling for active games to watch
    - Front-end `Tv` component that polls for active games and displays them!
- Fixed all `fex` regressions:
    - Connection status is now responsive
    - Game status is correctly synced
    - Players are now correctly displayed
    - Removed debug elements, console.log()s
    - Addressed most compile warnings
    - Amazons: is_valid_move() implemented
    - Amazons: valid move indicators implemented
    - Amazons: pieces (queens) are now proper images, instead of text!
# 2021-10-08
- `fex` refactor progress: basic play with move syncing!
# 2021-10-05
- Made the decision to write the front-end with MobX + React.
- Started working on a front-end refactor for MobX + React under `src/fex`
    - Implemented connection status and active user count using purely MobX + React.
# 2021-10-04
- Created class for a Challenge and a User in the back-end.
- Created abstract class for game states (`game_state`)
- Adapted `amazons_state` to conform to `game_state`
- Updated BE `app.py` to use `Challenge` exclusively to manage game (decoupled game-specific game from the I/O layer)
- Updated FE to work with the reduced, non-redundant amount of data that BE is now sending (the data sent was refactored thanks to the BE rewrite)
- Update Amazons move notation to a reasonably standard notation (a1-a2/a3)
# 2021-10-03
- Updated front-end Amazons JavaScript to be a little smarter and a whole lot more bug-free.
- Display connection information, number of active users.
- Phased out the jQuery dependency, reducing page size from ~250kb to ~180kb (-30%!)
- Disconnects are now handled by the back-end. Any games the user was an active player in are terminated, and all observed games are updated accordingly
- Improved back-end folder structure, included description in README
# 2021-10-02
- Establish basic status text in the client.
- Establish simple room-joining logic.
- Emit relevant updates when joining rooms.
- Sync moves, resulting in basic play!
- Added back-end move validation
- Amazons move indicator updates
    - Better JS code signatures
    - Show different indicator on queen
    - Show different colors for move and shoot
- Site-wide CSS updates
- Improve amazons_state.py
- Moves are now communicated incrementally
- Added rudimentary move list. 
# 2021-10-01
- Restarting this project with a focus on the ability to play correspondence games against other players.
- Cleared up instructions for running the codebase.
- Configured basic socket connection between client and server!
- Improved Amazons State creation.
- Moved amazons game logic inside flask-server
- Introduce proper venv! (fixed socketio versioning problem across dev platforms)