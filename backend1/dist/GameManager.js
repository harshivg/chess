"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GameManager = void 0;
const Game_1 = require("./Game");
const messages_1 = require("./messages");
class GameManager {
    constructor() {
        this.games = [];
        this.pendingUsers = [];
        this.users = [];
    }
    addUser(socket) {
        this.users.push(socket);
        this.addHandler(socket);
    }
    removeUser(socket) {
        this.users = this.users.filter((user) => user !== socket);
        if (this.pendingUsers) {
            this.pendingUsers = this.pendingUsers.filter((user) => user !== socket);
        }
    }
    addHandler(socket) {
        socket.on("message", (data) => {
            var _a, _b, _c, _d;
            const message = JSON.parse(data.toString());
            console.log(message);
            if (message.type === messages_1.INIT_GAME) {
                console.log((_a = this.pendingUsers) === null || _a === void 0 ? void 0 : _a.length);
                if (((_b = this.pendingUsers) === null || _b === void 0 ? void 0 : _b.length) === 3) {
                    //start game
                    console.log("game initialized");
                    (_c = this.pendingUsers) === null || _c === void 0 ? void 0 : _c.push(socket);
                    const game = new Game_1.Game(this.pendingUsers[0], this.pendingUsers[1], this.pendingUsers[2], this.pendingUsers[3]);
                    this.games.push(game);
                    this.pendingUsers = [];
                }
                else {
                    (_d = this.pendingUsers) === null || _d === void 0 ? void 0 : _d.push(socket);
                }
            }
            if (message.type === messages_1.MOVE) {
                console.log("you moved", message.payload.move);
                const game = this.games.find((game) => game.player1 === socket || game.player2 === socket);
                if (game) {
                    game.makeMove(socket, message.payload.move);
                }
            }
            if (message.type === messages_1.SUGGESTION) {
                const game = this.games.find((game) => game.brain1 === socket || game.brain2 === socket);
                if (game) {
                    game.makeSuggestion(socket, message.payload.suggestion);
                }
            }
        });
    }
}
exports.GameManager = GameManager;
