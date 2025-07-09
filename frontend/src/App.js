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

  const whiteLog = [["e4", "+0.1"], ["Nf3", "+0.2"], ["Bc4", "+0.1"]];
  const blackLog = [["c5", "+0.2"], ["e6", "+0.7"], ["Nf6", "-0.7"]];
  const [whiteSpellBook, setWhiteSpellBook] = useState([[2, 0], [2, 0]]);
  const [blackSpellBook, setBlackSpellBook] = useState([[1, 1], [2, 0]]);
  /*  function ondropPiece
        change the game
        call the function to get the best move possible, ask for the evaluation
        add to whatever log the info from the previous
        update the spellBook
        change the game
  */
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
                <SpellBook spellBook={blackSpellBook}/>
              </div>
              <Chessboard
                boardWidth={400}
                position={game.fen()}
                customDarkSquareStyle={{ backgroundColor: '#51870b' }}
                customLightSquareStyle={{ backgroundColor: '#9beb34' }}
              />
              <div className="spellbook">
                <SpellBook spellBook={whiteSpellBook}/>
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
