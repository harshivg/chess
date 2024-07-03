import { Color, PieceSymbol, Square } from 'chess.js'
import { useState } from 'react';
import { MOVE } from '../screens/Game';

const ChessBoard = ({ chess, setBoard, board, socket, setSelectedPiece }: {
  chess: any;
  setBoard: any;
  board: ({
    square: Square;
    type: PieceSymbol;
    color: Color;
  } | null)[][];
  socket: WebSocket;
  setSelectedPiece: any;
}) => {
  const [from, setFrom] = useState<null | Square>(null);
  const [to, setTo] = useState<null | Square>(null);

  return (

    <div className="text-white-200 shadow-md">
      {
        board.map((row, i) => {
          return <div key={i} className="flex">
            {
              row.map((square, j) => {
                const squareRepresentation = String.fromCharCode(97 + (j % 8)) + "" + (8 - i) as Square;

                return (
                <div 
                  key={j} 
                  onClick={() => {
                  if (!from) {
                    setFrom(squareRepresentation);
                  } else {
                    // setTo(square?.square || null);
                    socket.send(JSON.stringify({
                      type: MOVE,
                      payload: {
                        move: {
                          from,
                          to: squareRepresentation
                        }
                      }
                    }))

                    setFrom(null);
                    chess.move(
                      {
                        from,
                        to: squareRepresentation
                      }
                    );
                    setBoard(chess.board());
                    setSelectedPiece(null);
                    console.log({
                      from,
                      to: squareRepresentation
                    })
                  }
                }} className={`w-16 h-16 flex justify-center items-center ${i % 2 === j % 2 ? 'bg-gray-300' : 'bg-gray-500'}`}>
                  {square ? 
                  <img className="w-12" src={`/${square.color}${square.type}.png`} />
                    : null}

                </div>
                )
              })
            }
          </div>
        })
      }
    </div>
  )
}
export default ChessBoard