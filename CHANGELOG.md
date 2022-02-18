# Changelog
This file lists all changes to this project, grouped by versions that follow [Semantic Versioning](https://semver.org/spec/v2.0.0.html). This file is based on the format set forward by [Keep a Changelog](https://keepachangelog.com/en/1.0.0/).

# 2022-02-17
- Separated State Management for the Amazons (game state) and AmazonsView (volatile UI state)
- Removed a redundant CSS class `indicator` from AmazonsView and `grid.css` for cleaner code
# 2022-01-31
- Fixed bug where clicking opponent's pit in Mancala would play the corresponding move.
- Re-order priorities in README.md
# 2021-11-16
- Game status is now nicely rendered in the challenge dashboard
- Back-end can now differentiate between games that ended due to gameplay objective (like checkmate) and other, meta-events (like disconnect, time control).
- Added a color badge next to the player name in challenge dashboard
- Mancala is now compatible with the challenge dashboard upgrades
- Footer now sticks to the bottom properly and is at the bottom on pages that require scroll (say, mobile devices with narrow screens pushing challenge dashboard down)
# 2021-11-15
- Move list now shows nicely formatted moves for Amazons
- Move list now shows color badges nicely for Amazons
# 2021-11-14
- Challenge dashboard now has a background and border to separate it from others.
- The player with the turn in the dashboard is now higlighted.
- Changed "Anon" to "Guest" (wording matters!)
# 2021-11-12
- Challenge board and dashboard centered and sizes are well-defined and aligned.
# 2021-11-11
- Amazons grid pieces are now positioned in relation to the parent board grid
- Moved indicator style classes from JS to CSS
- Re-organized the Do-list for progress
- Added a header.
- `<marquee> Added a footer. </marquee>`
- Removed Amazons 6x6 configuration.
- Added last-move indicators to Amazons
# 2021-11-10
- Found a name and domain for the project that I'm really happy with: strate.gg!
- Wrote scripts for installing dependencies, preparing configurations and running servers
- Updated README with project overview
- Set up DNS records for new domain
- Set up Cloudflare for new domain
- Fix secrets issue in `./src/format_common.sh`
- Removed problematic `secrets` dependency with `random.SystemRandom`
- Fixed nginx configuration, gunicorn worker type, and eventlet version to allow websocket connections in production.
- Updated website title and description
- Production server is now started in a tmux session, therefore it persists beyond the SSH connection to the server.
# 2021-10-13
- Simple Mancala board using CSS (pending graphic design later)
- Clean up Mancala and Amazons views further.
- Started cleaning up index.js, mapped out tasks for making the website look presentable.
- Play page now adjusts to the viewport size (in a rudimentary way)
- Simplified Amazons CSS computation
# 2021-10-12
- BE responses are now better suited for a game-agnostic network interface.
- FE components are now more game-agnostic, allowing for easy scaling up in the number of games!
- You can now create a Mancala game! (with no way to play it)
- Created rudimentary UI for Mancala for testing.
- Code style improvement: BE now keeps track of `turn`, rather than `playerJustMoved`
- Basic Mancala play established (lacking just a UI)
- Fixed bug where BE Amazons was incorrectly removing pieces from the board.
- Fixed bug with TV where BE would reject observers joining if the game had started.
- Refactored Mancala board representation and logic to be simpler, squashing many bugs with the previous implementation in the process!
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

## [0.1.3] - 2021-10-04
### Added
- Back-end classes `Challenge` and `User`
- Abstract class for game states, `game_state`
### Changed
- `amazons_state` to conform to `game_state`
- BE `app.py` to use `Challenge` exclusively to manage game (decoupling game-specific info from the I/O layer)
- FE to work with the reduced, non-redundant amount of data that BE is now sending
- Amazons move notation to a reasonably standard notation (a1-a2/a3)

## [0.1.2] - 2021-10-03
### Added
- Display of connection information, number of active users.
- Handling of disconnects in the back-end
- README description
### Changed
- Back-end folder structure
### Removed
- jQuery dependency, reducing page size from ~250kb to ~180kb (-30%!)
### Fixed
- Various bugs in Amazons JavaScript (front-end)

## [0.1.1] - 2021-10-02
### Added
- Basic status text in the client.
- Simple room-joining logic.
- Emitting relevant updates when joining rooms.
- Synchorinizing moves, resulting in basic play!
- Back-end move validation
- Rudimentary move list. 
### Changed
- Amazons move indicator to have better JS code signatures
- Amazons move indicator adapts for the queen symbol, and also didifferent colors for move and shoot
- Site-wide CSS updates
- amazons_state.py with overall improvement
- Moves to be communicated incrementally

## [0.1.0] - 2021-10-01
This version marks when I started working on the website with the ambition of being a multiplayer abstract strategy boardgame website with correspondence and real-time play. It is a renewal of a previous project which was simply an offline Amazons game page.
### Added
- Proper Python venv
- Websocket connectivity between client and server
### Changed
- Instructions for running the codebase
- Location of Amazons game logic
### Fixed
- Socketio versioning inconsistency across