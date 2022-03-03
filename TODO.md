- Introduce testing
  - BE
    - Set up pytest and coverage
    - Write first initial test
    * Test: Http route cookies
      - Any http route gives me a cookie
      - I get the same cookie in subsequent requests
      - Sending a forged cookie is rejected
      - Cookie has same_site and http_only set
    * Test: socketio connection
      - I can connect
      - I get my UID back
      - I get the same UID back with the same cookie
      - If another connection disconnects, the user count is decremented
      - disconnecting terminates the games
        - The win goes to my opponent
