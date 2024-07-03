import { useEffect, useState } from "react";
import { SUGGESTION } from "../screens/Game";
import Button from "./Button";

const Suggestion = ({
  socket,
  selectedPiece,
  setSelectedPiece,
  turn,
  setTurn,
}: {
  socket: WebSocket;
  selectedPiece: string | null;
  setSelectedPiece: (piece: string | null) => void;
  turn: string;
  setTurn: any;
}) => {

  const handleButtonClick = (piece: any) => {
    socket.send(
      JSON.stringify({
        type: SUGGESTION,
        payload: {
          suggestion: piece,
        },
      })
    );
    console.log(turn);
    setSelectedPiece(piece);
    setTurn(turn === "brain1" ? "player1" : "player2")
    console.log(selectedPiece);


    console.log(turn);
  };

  const handleOptionClick = (piece: string) => {
    setSelectedPiece(piece);
  };

  return (
    <div className="bg-slate-200 w-full grid">
      <div className="grid col-span-2">
        <div className=" grid grid-cols-2 gap-2 m-6">
          {["p", "r", "n", "b", "q", "k"].map((piece) => (
            <Button
              key={piece}
              onClick={() => handleOptionClick(piece)}
              className={`bg-gray-300 hover:bg-gray-400 ${selectedPiece === piece ? 'bg-green-500' : ''}`}
            >
              <img src={`/w${piece}.png`} className="w-10 h-10" alt={piece} />
            </Button>
          ))}
          {!selectedPiece && (
            <div className="grid justify-center col-span-2">Suggesting a move</div>
          )}
        </div>
      </div>
      <div className="grid col-span-2 m-6">
        <Button
          className="bg-green-500 hover:bg-green-600"
          onClick={() => handleButtonClick(selectedPiece)}
          disabled={!turn}
        >
          Play
        </Button>
      </div>
    </div>
  );
};

export default Suggestion;
