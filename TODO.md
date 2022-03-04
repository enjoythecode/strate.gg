- Introduce testing
  - BE
    - Set up pytest and coverage
    - Write first initial test
    * Test: socketio connection
      - disconnecting terminates the games
        - The win goes to my opponent
    * Test: challenge websocket endpoints
      - challenge move
        - generate a full game for testing purposes
        - test that a full run of the game works
          - test that the correct side is given the point, and that the status is displayed correctly
      - challenge subscribe
      - challenge unsubscribe
    * current nginx setup does not work for setting cookies :(
