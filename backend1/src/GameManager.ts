import { WebSocket } from "ws";
import { Game } from "./Game";
import { INIT_GAME, MOVE, SUGGESTION, PIECE_SELECTED } from "./messages";

export class GameManager {
  private games: Game[];
  private pendingUsers: WebSocket[] | null;
  private users: WebSocket[];

  constructor() {
    this.games = [];
    this.pendingUsers = [];
    this.users = [];
  }

  addUser(socket: WebSocket) {
    this.users.push(socket);
    this.addHandler(socket);
  }

  removeUser(socket: WebSocket) {
    this.users = this.users.filter((user) => user !== socket);

    if (this.pendingUsers) {
      this.pendingUsers = this.pendingUsers.filter((user) => user !== socket);
    }
  }

  private addHandler(socket: WebSocket) {
    socket.on("message", (data) => {
      const message = JSON.parse(data.toString());
      console.log(message); 

      if (message.type === INIT_GAME) {
        console.log(this.pendingUsers?.length);
        if (this.pendingUsers?.length === 3) {
          //start game
          console.log("game initialized");
          this.pendingUsers?.push(socket);
          const game = new Game(
            this.pendingUsers[0],
            this.pendingUsers[1],
            this.pendingUsers[2],
            this.pendingUsers[3],
          );
          this.games.push(game);
          this.pendingUsers = [];
        } else {
          this.pendingUsers?.push(socket);
        }
      }

      if (message.type === MOVE) {
        console.log("you moved", message.payload.move);
        const game = this.games.find(
          (game) => game.player1 === socket || game.player2 === socket
        );
        if (game) {
          game.makeMove(socket, message.payload.move);
        }
      }

      if (message.type === SUGGESTION) {
        const game = this.games.find(
          (game) => game.brain1 === socket || game.brain2 === socket
        );
        if (game) {
          game.makeSuggestion(socket, message.payload.suggestion);
        }
      }
    });
  }
}
