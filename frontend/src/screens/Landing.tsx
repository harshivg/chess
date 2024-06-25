import { useNavigate } from 'react-router-dom';
import chessboard from '/chessboard.webp'
import Button from '../components/Button';

const Landing = () => {
  const navigate = useNavigate();
  return (
    <div className="flex justify-center">
      <div className="pt-8 max-w-screen-md">
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <div className="flex justify-center">
            <img src={chessboard} className="max-w-96 rounded-md shadow-md" />
          </div>
          <div className="pt-16">
            <div className="flex-col">
              <h1 className="text-4xl font-bold text-white flex justify-center">Chess Game</h1>
              <p className="mt-4 text-white flex justify-center">Play chess with your friends online</p>
            </div>
            <div className="mt-4 flex justify-center">
              <Button onClick={() => navigate("game")}>
                Play
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
export default Landing