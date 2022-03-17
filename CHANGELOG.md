# Changelog

This file lists all changes to this project, grouped by versions that follow [Semantic Versioning](https://semver.org/spec/v2.0.0.html). This file is based on the format set forward by [Keep a Changelog](https://keepachangelog.com/en/1.0.0/).

## [0.7.0] - 2022-03-17

### Added

- Security headers with Flask-Talisman, including HSTS
- Custom Content-Security-Policy header that allows unsafe-inline style-src
  and connect-src for relevant ws:// and wss:// headers
- Some basic tests to FE, including snapshot testing for a ChallengeView with Amazons
- Sound effect is played on a move.
- Setting to enable/disable sound.
  - Plays a sound when sound is toggled ON but not OFF.

### Changed

- All React Components to be functional.
- All React Components to get RootStore with useContext() hooks
- Re-wrote UI with React MUI, moving away from my homegrown CSS styles.

### Fixed

- Last move indicator regression
- Bug where creating a new challenge would redirect but not add the previous page to the browser history

### Removed

- Mancala, pending refactoring of FE code to be more stable.

## [0.6.2] - 2022-03-10

### Added

- Added jest to FE.
- Makefile coverage rules for running BE and FE together or individually.
- Makefile testing rules to allow running BE and FE together or individually.
- Tests to BE to reach 98% code coverage.

### Changed

- Add +x permissions to `be/generate_secret.sh`
- Re-structured the file structure of FE.

## [0.6.1] - 2022-03-08

### Added

- strate.gg and HTTPS variations to CORS Allowed Origins in the back-end

### Changed

- Makefile to use hypenated docker-compose in Makefile
- Dockerfiles to correctly assume the root of the directory as the build context

### Fixed

- Bug with production Dockerfile where the built client/ was replaced by a folder
  of the same name if it also existed in the local directory by the same name

## [0.6.0] - 2022-03-06

### Added

- Dockercompose and Dockerfile configuration for production build
- nginx as reverse proxy in both the development and production deployments
- `make test` and `make cover` for running the test suite and coverage, respectively
  on the BE code
- Tests for cookies
  - Cookie signing, preventing forged cookies
  - "SameSite=Lax" and "Secure" to the session cookie
- Tests for websocket connections
- A base error handler for websocket events
- A test suite for all challenge-related websocket actions.
- Makefile rules for test and coverage: `make test`, `make cover`

### Changed

- be/generate_secret.sh now only generates a secret if one
  does not exist. This way, sessions from previous deployments
  are not invalidated.
- Re-factoring the monolith app.py into `blueprints` and `services`.
  - `blueprints` attach to certain HTTP routes and/or websocket events
  - `services` provide the functions that deal with domain state such
    as challenges, game instances, users, etc.
    - currently, providers such as `redis` are also under `services.
      this might change.
- Upgraded eventlet to the latest version, removing the related notice
  in CONTRIBUTING.md

### Fixed

- Makefile issue where `make deps` needed to be ran twice.
- Makefile deploy commands now create a new secret key if one
  does not exist.
- Patched a potential security hole in Flask-Session where the
  default data serializer is Pickle (vulnerable to arbitary code
  execution) by changing it to JSON
- Multiple bugs in back-end challenge code stemming that were discovered
  by the new test suite!

### Removed

- Old .src files for production (replaced by Docker)

## [0.5.0] - 2022-02-25

### Added

- Redis to docker-compose for the dev environment
- Flask-Session to handle server-side sessions with redis as the data backend

### Changed

- fe/package.json to use the latest version of packages with vulnerabilities
  pm
- `Makefile` to use `npm ci` instead of `npm i` to keep package-lock.json consistent across devices
- Renamed `State.js` to `RootStore.js`
- Renamed the variable exported from `RootStore.js` to be `RootStore` rather than `RootState`
- Moved the user identifier of the client to be the server-generated user-id, rather than the socket ID.
  - Moved this to RootStore.js (from Socket.js) since it is state that applies the whole page.
- Iterated on Makefile
- Iterated on README.md, CONTRIBUTING.md
- Data store from in-memory variables to Redis. All challenges and user IDs are held in Redis, and
  therefore Flask workers are stateless (and thus should be horizontally scalable)

### Fixed

- Issue with socketIO not transferring cookies to development server because
  Flask-SocketIO could only read cookies that were already sent in a regular HTTP
  route. Because the Flask backend is only a "websocket API" in the development
  set-up and not in production, this was causing issues. Fixed by setting the
  "withCredentials" option for the SocketIO object in the front-end to True.
- AmazonsView regression where cancelling a move would disable all further move
  indicators.

### Removed

- Removed the box to create Mancala games from the FE because the current
  change of architecture broke it, and I do not want to waste effort on it
  until I solidify the architecture of the code with the factory pattern.

## [0.4.1] - 2022-02-22

### Added

- Makefile as the central automation location for installing dependencies, building, etc.
- Dockerfiles for:
  - Development BE server
  - Development FE server
- Docker compose files for:
  - Development server (BE + FE)

### Removed

- Redundant .sh scripts under `src`

## [0.4.0] - 2022-02-19

This version adds tooling (formatting and linting to the project) that are enforced with the `pre-commit` tool and `pre-commit.ci` CI.

### Added

- Pre-commit to check code style automatically.
- CONTRIBUTING.md explaining pre-commit.
- HACKING.md for recommended settings for developers
  - Prettier (JS auto-formatting) as a dependency
  - ESLint (JS linting)
  - Black (Python auto-formatting)
  - Flake8 (Python linting)
- Pre-commit build badge to README.md

### Changed

- FE code with an initial run of Prettier
- BE code with an initial run of Black

### Fixed

- All ESLint warnings
- All flake8 warnings
- `fe/package.json` which had duplicate eslint listed as dependencies
- Uncatched `switch` value in `fe/src/Challenge.js`

### Removed

- `be/ai/` since it is currently unused on the website
- Javascript files that weren't used

## [0.3.5] - 2022-02-18

### Added

- Git tags for all SemVer versions retroactively

### Changed

- FE State Management for Amazons to separate game state and board UI state
- CHANGELOG to follow [Semantic Versioning v2.0.0](https://semver.org/spec/v2.0.0.html) and [Keep a Changelog](https://keepachangelog.com/en/1.0.0/).
- README to include link to CHANGELOG

### Removed

- Redundant CSS class `indicator` from AmazonsView and `grid.css` for cleaner code

## [0.3.4] - 2022-01-31

### Changed

- Task list ordering in README.md

### Fixed

- Bug where clicking opponent's pit in Mancala would play the corresponding move.

## [0.3.3] - 2021-11-18

### Added

- Game status rendering in the challenge dashboard
- BE distinction between games that ended due to gameplay objective (like checkmate) and other, meta-events (like disconnect, time control).
- A color badge next to the player name in challenge dashboard
- Challenge dashboard compatibility to Mancala

### Changed

- Footer to sticks to the bottom properly and is at the bottom on pages that require scroll (say, mobile devices with narrow screens pushing challenge dashboard down)

## [0.3.2] - 2021-11-15

### Added

- Background and border to Challenge Dashboard to visually separate it from other components
- Visual highlight to the player with the turn in the dashboard

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
