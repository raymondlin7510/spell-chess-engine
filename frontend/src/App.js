import React, { useState } from "react";
import { Chess } from "chess.js";
import { Chessboard } from "react-chessboard";
import SpellBook from "./components/SpellBook";
import "./App.css";

function App() {
  const [game, setGame] = useState(new Chess());
  const [bestMove, setBestMove] = useState("");
  const [evaluation, setEvaluation] = useState("");
  const [selectedState, setSelectedState] = useState(null);

  const [log, setLog] = useState([]);
  
  const [frozenSquares, setFrozenSquares] = useState(new Set());
  const [jumpPieces, setJumpPieces] = useState(new Set());
  const [moveSquares, setMoveSquares] = useState({});

  const [whiteJumpLeft, setWhiteJumpLeft] = useState(2);
  const [whiteJumpCooldown, setWhiteJumpCooldown] = useState(0);
  const [whiteFreezeLeft, setWhiteFreezeLeft] = useState(5);
  const [whiteFreezeCooldown, setWhiteFreezeCooldown] = useState(0);

  const [blackJumpLeft, setBlackJumpLeft] = useState(2);
  const [blackJumpCooldown, setBlackJumpCooldown] = useState(0);
  const [blackFreezeLeft, setBlackFreezeLeft] = useState(5);
  const [blackFreezeCooldown, setBlackFreezeCooldown] = useState(0);

  // show something to indicate that this is a jump spell you can use
  // show something to indicate that this is a frozen area

  /*

  const handleGetMove = () => {
  fetch("/get-move")
    .then((res) => res.json())
    .then((data) => {
      setText(data.best_move);  // sets "e4"
      console.log(data);
    })
    .catch((err) => console.error("Fetch error:", err));
};
*/


  const handlePieceClick = (piece, square) => {
    if (selectedState === 'blackjumpchoosing') {
      setBlackJumpCooldown(3);
      setBlackJumpLeft(blackJumpLeft - 1);
      setSelectedState('blackjumpdown');
    } else if (selectedState === 'whitejumpchoosing') {
      setWhiteJumpCooldown(3);
      setWhiteJumpLeft(whiteJumpLeft - 1);
      setSelectedState('whitejumpdown');
    } else if (selectedState === square + "seeingMoves") {
      setMoveSquares({});
      setSelectedState(null);
    } else {
      const moves = game.moves({ square, verbose: true });
      const newMoveSquares = {};
      for (const move of moves) {
        const isCapture = !!move.captured;

        newMoveSquares[move.to] = {
          background: isCapture
            ? "radial-gradient(circle at center, transparent 40%, rgba(0, 0, 0, 0.5) 41%, rgba(0, 0, 0, 0.5) 53%, transparent 49%)"   
            : "radial-gradient(circle at center, rgba(0, 0, 0, 0.4) 22%, transparent 23%)"
        };
      }
      newMoveSquares[square] = {backgroundColor: "rgba(166, 255, 65, 0.82)"}
      setMoveSquares(newMoveSquares);
      setSelectedState(square + "seeingMoves");
    }
  };

  const handleSquareClick = (square) => {
    const piece = game.get(square);
    if (game.get(square) != null) {
      handlePieceClick(piece, square);
    } else {
      let seeingMovesIndex = -1;
      if (selectedState != null) {
        seeingMovesIndex = selectedState.indexOf('seeingMoves');
      }
      if (selectedState === 'whitefreezechoosing') {
        setWhiteFreezeCooldown(3);
        setWhiteFreezeLeft(whiteFreezeLeft - 1);
        setSelectedState('whitefreezedown');
      } else if (selectedState === 'blackfreezechoosing') {
        setBlackFreezeCooldown(3);
        setBlackFreezeLeft(blackFreezeLeft - 1);
        setSelectedState('blackfreezedown');
      } else if (seeingMovesIndex > -1) {
        if (square in moveSquares) {
          onDrop(selectedState.substring(0, seeingMovesIndex), square);
        }
        setSelectedState(null);
      }
      setMoveSquares({});
    }
  };

  const handleCancelMove = () => {
    if (selectedState === 'blackfreezedown') {
      setBlackFreezeCooldown(0);
      setBlackFreezeLeft(blackFreezeLeft + 1);
    } else if (selectedState === 'whitefreezedown') {
      setWhiteFreezeCooldown(0);
      setWhiteFreezeLeft(whiteFreezeLeft + 1);
    } else if (selectedState === 'blackjumpdown') {
      setBlackJumpCooldown(0);
      setBlackJumpLeft(blackJumpLeft + 1);
    } else if (selectedState === 'whitejumpdown') {
      setWhiteJumpCooldown(0);
      setWhiteJumpLeft(whiteJumpLeft + 1);
    }
    setSelectedState(null);
  };

  const onDrop = (sourceSquare, targetSquare) => {
    const move = game.move({
      from: sourceSquare,
      to: targetSquare,
      promotion: "q",
    });
    if (move === null)  {
      return false;
    }
    log.push([move.san, "+0.1"]);
    setLog(log);
    setGame(new Chess(game.fen()));
    setMoveSquares({});
    return true;
  };

  return (
    <div
      style={{
      backgroundImage: 'url("/images/background.png")',
      backgroundSize: 'cover',
      backgroundRepeat: 'no-repeat',
      backgroundPosition: 'center',
      minHeight: '100vh',
      margin: 0,
      width: '100%',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center'
      }}
    >

      <h1>Spell Chess Engine</h1>
      
      <div className="game">
        <div className="chessboardWrapper">
          <div className="chessboardRow">
            <div className="chessboardInner">
              <div className="spellbook">
                <SpellBook side="black" freezeLeft={blackFreezeLeft} freezeCooldown={blackFreezeCooldown} jumpLeft={blackJumpLeft} jumpCooldown={blackJumpCooldown} setState={setSelectedState} state={selectedState}/>
              </div>
              <Chessboard
                boardWidth={400}
                position={game.fen()}
                customDarkSquareStyle={{ backgroundImage: 'url("/images/darkGreenGrass.PNG")' }}
                customLightSquareStyle={{ backgroundImage: 'url("/images/lightGreenGrass.PNG")' }}
                customSquareStyles={moveSquares}
                onSquareClick={handleSquareClick}
                onDrop={onDrop}
              />
              <div className="spellbook">
                <SpellBook side="white" freezeLeft={whiteFreezeLeft} freezeCooldown={whiteFreezeCooldown} jumpLeft={whiteJumpLeft} jumpCooldown={whiteJumpCooldown} setState={setSelectedState} state={selectedState}/>
              </div>
            </div>
            <div className="sidePanel">
              <div className="evaluationText">
                Evaluation: {evaluation}
                <br />
                Best Move: {bestMove}
              </div>
              <div className="moveLogsContainer">
                  <div className="log">
                    {log
                      .filter((_, index) => index % 2 === 0)
                      .map((move, index) => (
                      <div key={index}>
                        {move[0]}: {move[1]}
                      </div>
                    ))}
                  </div>
                  <div className="log">
                    {log
                    .filter((_, index) => index % 2 === 1)
                    .map((move, index) => (
                      <div key={index}>
                        {move[0]}: {move[1]}
                      </div>
                    ))}
                  </div>
              </div>
            </div>
          </div>
        </div>
        {selectedState != null && selectedState.indexOf('down') > -1 && (
          <div className="cancelButton" onClick={handleCancelMove}>
            <img src={"/images/whiteArrow.webp"} alt="leftArrow" className="leftArrow" />
            Cancel Move
          </div>
        )}
      </div>
    </div>
  );
}

export default App;
