import { WebSocket } from "ws";
import { Chess, Move, PieceSymbol, Square } from "chess.js";
import { GAME_OVER, INIT_GAME, INVALID_MOVE, MOVE, SUGGESTION } from "./messages";

export class Game {
  public player1: WebSocket;
  public brain1: WebSocket;
  public player2: WebSocket;
  public brain2: WebSocket;
  public board: Chess;
  private startTime: Date;
  private moveCnt = 0;
  private currentState: string;
  private lastSuggestion1: PieceSymbol | null = null;
  private lastSuggestion2: PieceSymbol | null = null;
  private lastSuggestion: PieceSymbol | null = null;

  constructor(
    player1: WebSocket,
    player2: WebSocket,
    brain1: WebSocket,
    brain2: WebSocket,
  ) {
    this.player1 = player1;
    this.brain1 = brain1;
    this.player2 = player2;
    this.brain2 = brain2;
    this.board = new Chess();
    this.startTime = new Date();
    this.currentState = "brain1_suggest";

    this.initGame();
    this.requestSuggestion(this.brain1);
  }

  private initGame() {
    console.log("game init")
    this.player1.send(
      JSON.stringify({
        type: INIT_GAME,
        payload: {
          color: "white",
          role: "player1"
        },
      })
    );
    this.brain1.send(
      JSON.stringify({
        type: INIT_GAME,
        payload: {
          color: "white",
          role: "brain1"
        },
      })
    );
    this.player2.send(
      JSON.stringify({
        type: INIT_GAME,
        payload: {
          color: "black",
          role: "player2"
        },
      })
    );
    this.brain2.send(
      JSON.stringify({
        type: INIT_GAME,
        payload: {
          color: "black",
          role: "brain2"
        },
      })
    );
  }

  private requestSuggestion(brain: WebSocket) {
    brain.send(
      JSON.stringify({
        type: SUGGESTION,
      })
    );
  }

  makeSuggestion(socket: WebSocket, suggestion: PieceSymbol) {
    console.log("suggestion is ", suggestion);
    console.log(this.brain1 === this.brain2, "dbwjwjfbewjhf ");
    if (socket === this.brain1 && this.currentState === "brain1_suggest") {
      
      this.currentState = "player1_move";
      this.lastSuggestion1 = suggestion;
      this.lastSuggestion = suggestion;

    } else if (
      socket === this.brain2 &&
      this.currentState === "brain2_suggest"
    ) {
      this.currentState = "player2_move";
      this.lastSuggestion2 = suggestion;
      this.lastSuggestion = suggestion;
    }

    this.notifySuggestion()
  }

  makeMove(socket: WebSocket, move: Move) {
    console.log("move is ", move);
    console.log(this.brain1 === this.brain2);

    if (this.currentState === "player1_move" && socket !== this.player1) {
      return;
    }
    if (this.currentState === "player2_move" && socket !== this.player2) {
      return;
    }

    if (
      this.currentState === "player1_move" &&
      !this.isValidMove(move, this.lastSuggestion1)
    ) {
      this.player1.send(
        JSON.stringify({
          type: INVALID_MOVE,
        })
      )
      console.log("Invalid move by player1");
      return;
    }

    if (
      this.currentState === "player2_move" &&
      !this.isValidMove(move, this.lastSuggestion2)
    ) {
      this.player2.send(
        JSON.stringify({
          type: INVALID_MOVE,
        })
      )
      console.log("Invalid move by player2");
      return;
    }

    try {
      const result = this.board.move(move);
      if (result === null) {
        throw new Error("Invalid move");
      }
    } catch (e) {
      console.log(e);
      return;
    }

    if (this.board.isGameOver()) {
      this.player1.emit(
        JSON.stringify({
          type: GAME_OVER,
          payload: {
            winner: this.board.turn() === "w" ? "black" : "white",
          },
        })
      );
      return;
    }

    this.moveCnt++;

    if (this.currentState === "player1_move") {
      this.currentState = "brain2_suggest";
      this.requestSuggestion(this.brain2);
    } else if (this.currentState === "player2_move") {
      this.currentState = "brain1_suggest";
      this.requestSuggestion(this.brain1);
    }

    this.notifyMove(move);
  }

  private isValidMove(
    move: Move,
    suggestion: PieceSymbol | null
  ): boolean {
    if (suggestion === null) {
      return false;
    }
    
    console.log("move is " + move);

    if(suggestion ===  this.board.get(move.from).type && this.board.get(move.from).color === this.board.turn()){
      return true;
    }

    return false;
  }

  private notifyMove(move: { from: string; to: string }) {
    this.player1.send(
      JSON.stringify({
        type: MOVE,
        payload: move,
      })
    );
    this.player2.send(
      JSON.stringify({
        type: MOVE,
        payload: move,
      })
    );
    this.brain1.send(
      JSON.stringify({
        type: MOVE,
        payload: move,
      })
    );
    this.brain2.send(
      JSON.stringify({
        type: MOVE,
        payload: move,
      })
    );
  }

  private notifySuggestion() {
    this.player1.send(
      JSON.stringify({
        type: SUGGESTION,
        payload: this.lastSuggestion
      })
    );
    this.player2.send(
      JSON.stringify({
        type: SUGGESTION,
        payload: this.lastSuggestion
      })
    );
    this.brain1.send(
      JSON.stringify({
        type: SUGGESTION,
        payload: this.lastSuggestion
      })
    );
    this.brain2.send(
      JSON.stringify({
        type: SUGGESTION,
        payload: this.lastSuggestion
      })
    );
  }
}
