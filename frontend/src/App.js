import axios from "axios";
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

  const [spellDown, setSpellDown] = useState(null);

  const whiteLog = [["e4", "+0.1"], ["Nf3", "+0.2"], ["Bc4", "+0.1"]];
  const blackLog = [["c5", "+0.2"], ["e6", "+0.7"], ["Nf6", "-0.7"]];
  
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

  // need to fix freeze where you can put it on any chess piece or square
  // need to show area where your cock is blocked when freeze is activated which shows a 3x3 blue area
  // need to show piece that can be jumped yee haw

  const handlePieceClick = (piece) => {
    if (spellDown == null) {
      if (selectedState === 'blackjump') {
        setSpellDown(selectedState);
        setBlackJumpCooldown(3);
        setBlackJumpLeft(blackJumpLeft - 1);
        setSelectedState(null);
      } else if (selectedState === 'whitejump') {
        setSpellDown(selectedState);
        setWhiteJumpCooldown(3);
        setWhiteJumpLeft(whiteJumpLeft - 1);
        setSelectedState(null);
      } else if (selectedState === 'blackfreeze') {
        setSpellDown(selectedState);
        setBlackFreezeCooldown(3);
        setBlackFreezeLeft(blackFreezeLeft - 1);
        setSelectedState(null);
      } else if (selectedState === 'whitefreeze') {
        setSpellDown(selectedState);
        setWhiteFreezeCooldown(3);
        setWhiteFreezeLeft(whiteFreezeLeft - 1);
        setSelectedState(null);
      }
    }
  };

  const handleSquareClick = (square) => {
    if (selectedState == null) {
      if (moveSquares.length > 0) {
        setMoveSquares({});
        return;
      }
      const moves = game.moves({ square, verbose: true });
      if (moves.length === 0) {
        setMoveSquares({});
        return;
      }
      const newMoveSquares = {};
      for (const move of moves) {
        newMoveSquares[move.to] = {
          background:
            move.isCapture
              ? "radial-gradient(circle, red 35%, transparent 36%)"
              : "radial-gradient(circle, rgba(0,255,0,0.5) 25%, transparent 26%)"
        };
      }
      setMoveSquares(newMoveSquares);
    }
    if (spellDown == null) {
      if (selectedState === 'whitefreeze') {
        setWhiteFreezeCooldown(3);
        setWhiteFreezeLeft(whiteFreezeLeft - 1);
        setSpellDown(selectedState);
        setSelectedState(null);
      } else if (selectedState === 'blackfreeze') {
        setBlackFreezeCooldown(3);
        setBlackFreezeLeft(blackFreezeLeft - 1);
        setSpellDown(selectedState);
        setSelectedState(null);
      }
    }
  }

  const handleCancelMove = () => {
    if (spellDown === 'blackfreeze') {
      setBlackFreezeCooldown(0);
      setBlackFreezeLeft(blackFreezeLeft + 1);
    } else if (spellDown === 'whitefreeze') {
      setWhiteFreezeCooldown(0);
      setWhiteFreezeLeft(whiteFreezeLeft + 1);
    } else if (spellDown === 'blackjump') {
      setBlackJumpCooldown(0);
      setBlackJumpLeft(blackJumpLeft + 1);
    } else if (spellDown === 'whitejump') {
      setWhiteJumpCooldown(0);
      setWhiteJumpLeft(whiteJumpLeft + 1);
    }
    setSpellDown(null);
    setSelectedState(null);
  }

  const onDrop = (sourceSquare, targetSquare) => {
    const move = game.move({
      from: sourceSquare,
      to: targetSquare,
      promotion: "q",
    });

    if (move === null)  {
      return false;
    }
    setGame(new Chess(game.fen()));
    setMoveSquares({});
    return true;
  }

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
                <SpellBook side="black" freezeLeft={blackFreezeLeft} freezeCooldown={blackFreezeCooldown} jumpLeft={blackJumpLeft} jumpCooldown={blackJumpCooldown} setState={setSelectedState} state={selectedState} spellDown={spellDown}/>
              </div>
              <Chessboard
                boardWidth={400}
                position={game.fen()}
                customDarkSquareStyle={{ backgroundImage: 'url("/images/darkGreenGrass.PNG")' }}
                customLightSquareStyle={{ backgroundImage: 'url("/images/lightGreenGrass.PNG")' }}
                customSquareStyles={moveSquares}
                onSquareClick={handleSquareClick}
                onPieceClick={handlePieceClick}
                onDrop={onDrop}
              />
              <div className="spellbook">
                <SpellBook side="white" freezeLeft={whiteFreezeLeft} freezeCooldown={whiteFreezeCooldown} jumpLeft={whiteJumpLeft} jumpCooldown={whiteJumpCooldown} setState={setSelectedState} state={selectedState} spellDown={spellDown}/>
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
                    {whiteLog.map((move, index) => (
                      <div key={index}>
                        {move[0]}: {move[1]}
                      </div>
                    ))}
                  </div>
                  <div className="log">
                    {blackLog.map((move, index) => (
                      <div key={index}>
                        {move[0]}: {move[1]}
                      </div>
                    ))}
                  </div>
              </div>
            </div>
          </div>
        </div>
        {spellDown != null && (
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
