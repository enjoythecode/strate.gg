import { makeObservable, observable, computed, action, flow } from "mobx";

class AbstractGameState {
  constructor() {
    makeObservable(this, {
      makeMove: action,
    });
  }

  makeMove() {
    console.error("Not implemented!");
  }
}

export default AbstractGameState;
