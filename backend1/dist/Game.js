"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Game = void 0;
const chess_js_1 = require("chess.js");
const messages_1 = require("./messages");
class Game {
    constructor(player1, player2, brain1, brain2) {
        this.moveCnt = 0;
        this.lastSuggestion1 = null;
        this.lastSuggestion2 = null;
        this.lastSuggestion = null;
        this.player1 = player1;
        this.brain1 = brain1;
        this.player2 = player2;
        this.brain2 = brain2;
        this.board = new chess_js_1.Chess();
        this.startTime = new Date();
        this.currentState = "brain1_suggest";
        this.initGame();
        this.requestSuggestion(this.brain1);
    }
    initGame() {
        console.log("game init");
        this.player1.send(JSON.stringify({
            type: messages_1.INIT_GAME,
            payload: {
                color: "white",
                role: "player1"
            },
        }));
        this.brain1.send(JSON.stringify({
            type: messages_1.INIT_GAME,
            payload: {
                color: "white",
                role: "brain1"
            },
        }));
        this.player2.send(JSON.stringify({
            type: messages_1.INIT_GAME,
            payload: {
                color: "black",
                role: "player2"
            },
        }));
        this.brain2.send(JSON.stringify({
            type: messages_1.INIT_GAME,
            payload: {
                color: "black",
                role: "brain2"
            },
        }));
    }
    requestSuggestion(brain) {
        brain.send(JSON.stringify({
            type: messages_1.SUGGESTION,
        }));
    }
    makeSuggestion(socket, suggestion) {
        console.log("suggestion is ", suggestion);
        console.log(this.brain1 === this.brain2, "dbwjwjfbewjhf ");
        if (socket === this.brain1 && this.currentState === "brain1_suggest") {
            this.currentState = "player1_move";
            this.lastSuggestion1 = suggestion;
            this.lastSuggestion = suggestion;
        }
        else if (socket === this.brain2 &&
            this.currentState === "brain2_suggest") {
            this.currentState = "player2_move";
            this.lastSuggestion2 = suggestion;
            this.lastSuggestion = suggestion;
        }
        this.notifySuggestion();
    }
    makeMove(socket, move) {
        console.log("move is ", move);
        console.log(this.brain1 === this.brain2);
        if (this.currentState === "player1_move" && socket !== this.player1) {
            return;
        }
        if (this.currentState === "player2_move" && socket !== this.player2) {
            return;
        }
        if (this.currentState === "player1_move" &&
            !this.isValidMove(move, this.lastSuggestion1)) {
            this.player1.send(JSON.stringify({
                type: messages_1.INVALID_MOVE,
            }));
            console.log("Invalid move by player1");
            return;
        }
        if (this.currentState === "player2_move" &&
            !this.isValidMove(move, this.lastSuggestion2)) {
            this.player2.send(JSON.stringify({
                type: messages_1.INVALID_MOVE,
            }));
            console.log("Invalid move by player2");
            return;
        }
        try {
            const result = this.board.move(move);
            if (result === null) {
                throw new Error("Invalid move");
            }
        }
        catch (e) {
            console.log(e);
            return;
        }
        if (this.board.isGameOver()) {
            this.player1.emit(JSON.stringify({
                type: messages_1.GAME_OVER,
                payload: {
                    winner: this.board.turn() === "w" ? "black" : "white",
                },
            }));
            return;
        }
        this.moveCnt++;
        if (this.currentState === "player1_move") {
            this.currentState = "brain2_suggest";
            this.requestSuggestion(this.brain2);
        }
        else if (this.currentState === "player2_move") {
            this.currentState = "brain1_suggest";
            this.requestSuggestion(this.brain1);
        }
        this.notifyMove(move);
    }
    isValidMove(move, suggestion) {
        if (suggestion === null) {
            return false;
        }
        console.log("move is " + move);
        if (suggestion === this.board.get(move.from).type && this.board.get(move.from).color === this.board.turn()) {
            return true;
        }
        return false;
    }
    notifyMove(move) {
        this.player1.send(JSON.stringify({
            type: messages_1.MOVE,
            payload: move,
        }));
        this.player2.send(JSON.stringify({
            type: messages_1.MOVE,
            payload: move,
        }));
        this.brain1.send(JSON.stringify({
            type: messages_1.MOVE,
            payload: move,
        }));
        this.brain2.send(JSON.stringify({
            type: messages_1.MOVE,
            payload: move,
        }));
    }
    notifySuggestion() {
        this.player1.send(JSON.stringify({
            type: messages_1.SUGGESTION,
            payload: this.lastSuggestion
        }));
        this.player2.send(JSON.stringify({
            type: messages_1.SUGGESTION,
            payload: this.lastSuggestion
        }));
        this.brain1.send(JSON.stringify({
            type: messages_1.SUGGESTION,
            payload: this.lastSuggestion
        }));
        this.brain2.send(JSON.stringify({
            type: messages_1.SUGGESTION,
            payload: this.lastSuggestion
        }));
    }
}
exports.Game = Game;
