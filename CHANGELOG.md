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

## [0.3.2] - 2021-11-15
### Added
- Background and border to Challenge Dashboard to visually separate it from other components
- Visual highlight to the player with the turn in the dashboard.
### Changed
- Move list to show nicely formatted moves for Amazons
- Move list to show color badges nicely for Amazons
- "Anon" to "Guest" (wording matters!)

## [0.3.1] - 2021-11-12
### Added
- Last-move indicators to Amazons
- `<marquee> Added a footer. </marquee>` as an easter-egg
- Added a header
### Changed
- Location of indicator style from JS to CSS
- Amazons grid pieces to be positioned in relation to the parent board grid
- Task list
- Challenge board and dashboard to be centered and sizes are well-defined and aligned.
### Removed
- Amazons 6x6 configuration.

## [0.3.0] - 2021-11-10
This version marks the new name and domain of the project, strate.gg!
### Added
- Name/domain: strate.gg
- Scripts for installing dependencies, preparing configurations and running servers
- DNS records for new domain
- Cloudflare configuration for new domain
### Changed
- README with project overview
- Website title and description
### Removed
- Problematic `secrets` dependency with `random.SystemRandom`
### Fixed
- NginX configuration, gunicorn worker type, and eventlet version to allow websocket connections in production.
- Production server to be started in a tmux session, therefore it persists beyond the SSH connection to the server.

## [0.2.3] - 2021-10-13
### Added
- Simple Mancala board using CSS
- PlayPage now responds to the viewport size in a rudimentary way
### Changed 
- Mancala and Amazons views to be cleaner
- Parts of home page to be more presentable
- Amazons CSS computation to be simpler

## [0.2.2] - 2021-10-12
### Added
- Rudimentary Mancala UI
- Creating Mancala games
- Basic play of Mancala
### Changed
- BE responses to be better suited for a game-agnostic network interface
- FE components to be more game-agnostic, allowing for easy scaling up in the number of games!
- BE to track `turn` rather than `playerJustMoved`
- Mancala board representation and logic to be simpler, squashing many bugs with the previous implementation in the process!
### Fixed
- Bug where BE Amazons was incorrectly removing pieces from the board.
- Bug with TV where BE would reject observers joining if the game had started.

## [0.2.1] - 2021-10-11
### Added 
- Rough first Mancala implementation
- Final touches for FE rewrite to React + MobX
### Fixed
- Bug where clicking on Amazons board would execute move as an observer or out-of-turn player
- Bug where player could move in a game that was not in progress
- Bug where players could join a game that was not in progress (Commonly occured when using back button on the browser)

## [0.2.0] - 2021-10-09
This version is a rewrite of the FE using React + MobX
### Added
- BE API to poll for active games to watch
- FE `Tv` component that polls for active games and displays them
### Changed
- All FE code to React + MobX

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