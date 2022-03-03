- Introduce testing
  - BE
    - Set up pytest and coverage
    - Write first initial test
    * Test: socketio connection
      - I get my UID back
      - I get the same UID back with the same cookie
      - If another connection disconnects, the user count is decremented
      - disconnecting terminates the games
        - The win goes to my opponent
