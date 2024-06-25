import { useEffect, useState } from "react";
import Button from "../components/Button"
import ChessBoard from "../components/ChessBoard"
import { useSocket } from "../hooks/useSocket";
import { Chess } from "chess.js";

export const MOVE = "move";
export const GAME_OVER = "game_over";
export const INIT_GAME = "init_game";

const Game = () => {
  const socket = useSocket();
  const [chess, setChess] = useState(new Chess());
  const [board, setBoard] = useState(chess.board());
  const [started, setStarted] = useState(false);


  useEffect(() => {
    if (!socket) {
      return;
    }

    socket.onmessage = (event) => {
      const message = JSON.parse(event.data);
      console.log(message);

      switch (message.type) {
        case INIT_GAME:
          // setChess(new Chess());
          setBoard(chess.board());
          setStarted(true);
          console.log("Game started")
          break;
        case MOVE:
          const move = message.payload;
          chess.move(move);
          setBoard(chess.board());
          console.log("Move made")
          break;
        case GAME_OVER:
          console.log("Game over");
          break;
      }
    }
  }, [socket])

  if (!socket) {
    return <div>Connecting...</div>
  }

  return (
    <div className="justify-center flex">
      <div className="pt-8 max-w-screen-lg">
        <div className="grid grid-cols-6 gap-4">
          <div className="col-span-4 w-full">
            <ChessBoard chess={chess} setBoard={setBoard} socket={socket} board={board} />
          </div>
          <div className="col-span-2 checker w-full flex items-center justify-center">
            {!started &&
              <Button onClick={() => {
                socket.send(JSON.stringify({
                  type: INIT_GAME,
                }))
              }}>
                Play
              </Button> 
            }
          </div>
        </div>
      </div>
    </div>
  )
}
export default Game