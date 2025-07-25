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

  const [turn, setTurn] = useState(0);
  const [log, setLog] = useState([]);
  
  const [choosingPiece, setChoosingPiece] = useState({});
  const [moveSquares, setMoveSquares] = useState({});

  const [spellState, setSpellState] = useState(null);
  const [frozenSquares, setFrozenSquares] = useState([{}, {}]);
  const [jumpSquares, setJumpSquares] = useState([{}, {}]);

  const [jumpLeft, setJumpLeft] = useState([2, 2]);
  const [jumpCooldown, setJumpCooldown] = useState([0, 0]);
  const [freezeLeft, setFreezeLeft] = useState([5, 5]);
  const [freezeCooldown, setFreezeCooldown] = useState([0, 0]);

  const jumpPieceStyle = {
    backgroundImage: 'url("/images/jumpAnimation.gif")',
    backgroundSize: 'cover',
    backgroundRepeat: 'no-repeat',
    backgroundPosition: 'center',
    opacity: 0.5,
  };

  const frozenStyle = {
    backgroundImage: 'url("/images/snowAnimation.gif")',
    backgroundSize: 'cover',
    backgroundRepeat: 'no-repeat',
    backgroundPosition: 'center',
    opacity: 0.5
  };


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
    if (selectedState === 'jumpchoosing') {
      jumpCooldown[turn] = 3;
      setJumpCooldown(jumpCooldown);
      jumpLeft[turn] -= 1;
      setJumpLeft(jumpLeft);
      setSelectedState(null);
      jumpSquares[turn][square] = jumpPieceStyle;
      setJumpSquares(jumpSquares);
      setSpellState('jumpdown');
    } else if (square in moveSquares) {
      onDrop(Object.keys(choosingPiece)[0], square);
      setSelectedState(null);
      setChoosingPiece({});
    } else if (Object.keys(choosingPiece)[0] === square) {
      setChoosingPiece({});
      setMoveSquares({});
    } else {
      const choosingPiece = {};
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
      choosingPiece[square] = {backgroundColor: "rgba(166, 255, 65, 0.82)"}
      setChoosingPiece(choosingPiece);
      setMoveSquares(newMoveSquares);
      setSelectedState("seeingMoves");
    }
  };

  const handleSquareClick = (square) => {
    const piece = game.get(square);
    if (game.get(square) != null) {
      handlePieceClick(piece, square);
    } else if (square in moveSquares) {
      onDrop(Object.keys(choosingPiece)[0], square);
      setChoosingPiece({});
      setMoveSquares({});
    } else {
      setChoosingPiece({});
      setMoveSquares({});
    }
    if (selectedState === 'freezechoosing') {
      putFreeze(square);
    }
  };

  const putFreeze = (square) => {
    setSpellState('freezedown');
    freezeCooldown[turn] = 3;
    setFreezeCooldown(freezeCooldown);
    freezeLeft[turn] -= 1;
    setFreezeLeft(freezeLeft);
    setSelectedState(null);
    const currTurnSquares = frozenSquares[turn];
    currTurnSquares[square] = frozenStyle;
    const file = square[0];
    const rank = parseInt(square[1]);
    if (file > 'a') {
      currTurnSquares[String.fromCharCode(file.charCodeAt(0) - 1) + rank] = frozenStyle;
      if (rank < 8) {
        currTurnSquares[file + (rank + 1)] = frozenStyle;
        currTurnSquares[String.fromCharCode(file.charCodeAt(0) - 1) + (rank + 1)] = frozenStyle;
      }
      if (rank > 1) {
        currTurnSquares[file + (rank - 1)] = frozenStyle;
        currTurnSquares[String.fromCharCode(file.charCodeAt(0) - 1) + (rank - 1)] = frozenStyle;
      }
    }
    if (file < 'h') {
      currTurnSquares[String.fromCharCode(file.charCodeAt(0) + 1) + rank] = frozenStyle;
      if (rank < 8) {
        currTurnSquares[file + (rank + 1)] = frozenStyle;
        currTurnSquares[String.fromCharCode(file.charCodeAt(0) + 1) + (rank + 1)] =frozenStyle;
      }
      if (rank > 1) {
        currTurnSquares[file + (rank - 1)] = frozenStyle;
        currTurnSquares[String.fromCharCode(file.charCodeAt(0) + 1) + (rank - 1)] = frozenStyle;
      }
    }
    frozenSquares[turn] = currTurnSquares;
    setFrozenSquares(frozenSquares);
  };

  const handleCancelMove = () => {
    if (spellState === 'freezedown') {
      frozenSquares[turn] = {};
      setFrozenSquares(frozenSquares);
      freezeCooldown[turn] = 0;
      setFreezeCooldown(freezeCooldown);
      freezeLeft[turn] += 1;
      setFreezeLeft(freezeLeft);
    } else if (spellState === 'jumpdown') {
      jumpSquares[turn] = {};
      setJumpSquares(jumpSquares);
      jumpCooldown[turn] = 0;
      setJumpCooldown(jumpCooldown);
      jumpLeft[turn] += 1;
      setJumpLeft(jumpLeft);
    }
    setSpellState(null);
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
    setTurn(1 - turn);
    setSpellState(null);
    frozenSquares[1 - turn] = {};
    setFrozenSquares(frozenSquares);
    jumpSquares[1 -turn] = {};
    setJumpSquares(jumpSquares);
    if (jumpCooldown[1 - turn] > 0) {
      jumpCooldown[1 - turn] -= 1;
      setJumpCooldown(jumpCooldown);
    }
    if (freezeCooldown[1 - turn] > 0) {
      freezeCooldown[1 - turn] -= 1;
      setFreezeCooldown(freezeCooldown);
    }
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
                <SpellBook turn={turn} side="black" setMoveSquares={setMoveSquares} spellDown={spellState} setState={setSelectedState} freezeLeft={freezeLeft[1]} freezeCooldown={freezeCooldown[1]} jumpLeft={jumpLeft[1]} jumpCooldown={jumpCooldown[1]} setChoosingPiece={setChoosingPiece} />
              </div>
              <Chessboard
                boardWidth={400}
                position={game.fen()}
                customDarkSquareStyle={{ backgroundImage: 'url("/images/darkGreenGrass.PNG")' }}
                customLightSquareStyle={{ backgroundImage: 'url("/images/lightGreenGrass.PNG")' }}
                customSquareStyles={{ ...moveSquares, ...frozenSquares[0], ...frozenSquares[1], ...jumpSquares[0], ...jumpSquares[1], ...choosingPiece }}
                onSquareClick={handleSquareClick}
                onDrop={onDrop}
              />
              <div className="spellbook">
                <SpellBook turn={turn} side="white" setMoveSquares={setMoveSquares} spellDown={spellState} setState={setSelectedState} freezeLeft={freezeLeft[0]} freezeCooldown={freezeCooldown[0]} jumpLeft={jumpLeft[0]} jumpCooldown={jumpCooldown[0]} setChoosingPiece={setChoosingPiece} />
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
        {spellState && (
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
