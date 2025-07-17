import axios from "axios";
import React, { useState } from "react";
import { Chess } from "chess.js";
import { Chessboard } from "react-chessboard";
import SpellBook from "./components/SpellBook";
import "./App.css";

function App() {
  const [game, setGame] = useState(new Chess());
  const [bestMove, setBestMove] = useState("e5");
  const [evaluation, setEvaluation] = useState("+0.7");
  const [selectedState, setSelectedState] = useState(null);

  const whiteLog = [["e4", "+0.1"], ["Nf3", "+0.2"], ["Bc4", "+0.1"]];
  const blackLog = [["c5", "+0.2"], ["e6", "+0.7"], ["Nf6", "-0.7"]];

  const [whiteJumpLeft, setWhiteJumpLeft] = useState(2);
  const [whiteJumpCooldown, setWhiteJumpCooldown] = useState(0);
  const [whiteFreezeLeft, setWhiteFreezeLeft] = useState(5);
  const [whiteFreezeCooldown, setWhiteFreezeCooldown] = useState(0);

  const [blackJumpLeft, setBlackJumpLeft] = useState(2);
  const [blackJumpCooldown, setBlackJumpCooldown] = useState(0);
  const [blackFreezeLeft, setBlackFreezeLeft] = useState(5);
  const [blackFreezeCooldown, setBlackFreezeCooldown] = useState(0);

  const handlePieceClick = (piece) => {
    if (selectedState === 'blackjump') {
      console.log("Cast black jump spell on", piece);
      setBlackJumpCooldown(3);
      setBlackJumpLeft(blackJumpLeft - 1);
      setSelectedState(null);
    } else if (selectedState === 'whitejump') {
      console.log("Cast white jump spell on", piece);
      setWhiteJumpCooldown(3);
      setWhiteJumpLeft(whiteJumpLeft - 1);
      setSelectedState(null);
    }
  };

  const handleSquareClick = (square) => {
    if (selectedState === 'whitefreeze') {
      console.log("Cast white freeze on", square);
      setWhiteFreezeCooldown(3);
      setWhiteFreezeLeft(whiteFreezeLeft - 1);
      setSelectedState(null);
    } else if (selectedState === 'blackfreeze') {
      console.log("Cast black freeze on", square);
      setBlackFreezeCooldown(3);
      setBlackFreezeLeft(blackFreezeLeft - 1);
      setSelectedState(null);
    }
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
                <SpellBook side="black" freezeLeft={blackFreezeLeft} freezeCooldown={blackFreezeCooldown} jumpLeft={blackJumpLeft} jumpCooldown={blackJumpCooldown} setState={setSelectedState} state={selectedState}/>
              </div>
              <Chessboard
                boardWidth={400}
                position={game.fen()}
                customDarkSquareStyle={{ backgroundColor: '#51870b' }}
                customLightSquareStyle={{ backgroundColor: '#9beb34' }}
                onSquareClick={handleSquareClick}
                onPieceClick={handlePieceClick}
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
      </div>
    </div>
  );
}

export default App;
