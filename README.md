**State:** Currently under development (expect major changes)

# Game of Amazons
This is a hobby project of mine, which consists of a website for playing the game and a collection of AI agents written in Python that play the game.
This is also my sandbox for testing out different reinforcement learning techniques.

## Running
Instructions to run the dev server (to play around, test, develop):

The fundamental required library is [Flask](https://flask.palletsprojects.com)
```
$ pip3 install flask
```

For Mac/Linux:

Run the shell script `dev_server.sh`

OR

```
$ export FLASK_APP=flask-server
$ export FLASK_ENV=development
$ flask run
```
  
The app is not tested for Windows, you can try to run the server using the [instructions on the Flask website](https://flask.palletsprojects.com/en/1.1.x/tutorial/factory/?highlight=windows#run-the-application)
