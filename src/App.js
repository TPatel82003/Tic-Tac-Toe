import "./App.css";
import { useEffect, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrash } from "@fortawesome/free-solid-svg-icons";
import { faUndo } from "@fortawesome/free-solid-svg-icons";
import BoardHistory from "./history";
import Board from "./board";
function App() {
  const [player, setPlayer] = useState("Player 1");
  const [winner, setWinner] = useState("live");
  const [games, setGames] = useState(0);
  const [last, setLast] = useState();
  const [history, setHistory] = useState(
    Array.from(JSON.parse(localStorage.getItem("games") ?? "{}")) ?? []
  );
  const scoreBoard = {
    player1: {
      win: 0,
      lost: 0,
    },
    player2: {
      win: 0,
      lost: 0,
    },
  };
  const [score, setScore] = useState(scoreBoard);
  const signs = ["X", "O"];
  function updateLocalGames(rows, obj) {
    const lastGames =
      Array.from(JSON.parse(localStorage.getItem("games") ?? "{}")) ?? [];
    const bool = [
      [false, false, false],
      [false, false, false],
      [false, false, false],
    ];
    console.log(obj);
    if (
      obj["row"][0] === obj["row"][1] ||
      obj["column"][0] === obj["column"][1]
    ) {
      obj["row"].forEach((i) => {
        obj["column"].forEach((j) => {
          bool[i][j] = true;
        });
      });
    } else {
      for (let i = 0; i < 3; i++) {
        bool[obj["row"][i]][obj["column"][i]] = true;
      }
    }
    localStorage.setItem(
      "games",
      JSON.stringify([
        ...lastGames,
        { cell: rows, winners: bool, time: new Date().toLocaleString() },
      ])
    );
    setHistory(
      Array.from(JSON.parse(localStorage.getItem("games") ?? "{}")) ?? []
    );
  }
  useEffect(() => {
    if (games === 9 && winner === "live") {
      setWinner("over");
    }
  }, [games, winner]);
  return (
    <div className="mainDiv">
      {winner !== "live" && winner !== "over" ? (
        <div class="p">{winner} Won</div>
      ) : winner === "over" ? (
        <div class="p">Game Over</div>
      ) : (
        <>
          <div class="p">{player}'s Turn</div>
          {games > 0 && (
            <div
              onClick={() => {
                document.getElementById(last).textContent = "";
                document.getElementById(last).style.pointerEvents = "all";
                setGames(games - 1);
                setPlayer(player === "Player 1" ? "Player 2" : "Player 1");
              }}
            >
            <button className="undo"><FontAwesomeIcon icon = {faUndo}></FontAwesomeIcon>Undo Last Move</button>
            </div>
          )}
        </>
      )}
      <hr></hr>
      <div class="board">
        <Board
          player={player}
          setPlayer={setPlayer}
          setWinner={setWinner}
          winner={winner}
          score={score}
          setScore={setScore}
          games={games}
          setGames={setGames}
          updateLocalGames={updateLocalGames}
          setLast={setLast}
        ></Board>
      </div>
      {(winner !== "live" || winner === "over") && (
        <button
          onClick={() => {
            setGames(0);
            setWinner("live");
            setPlayer("Player 1");
            [0, 1, 2].forEach((i) => {
              [0, 1, 2].forEach((j) => {
                document.getElementById(`${i}${j}`).textContent = "";
                document.getElementById(`${i}${j}`).style.height = "75px";
                document.getElementById(`${i}${j}`).style.width = "75px";
                document.getElementById(`${i}${j}`).style.color =
                  "rgb(15, 15, 106)";
                document.getElementById(`${i}${j}`).style.backgroundColor =
                  "rgb(210, 210, 210)";
              });
            });
          }}
        >
          Rematch
        </button>
      )}
      <hr></hr>
      <div class="info">
        {signs.map((element, index) => (
          <div class="info-column">
            <div id="legend">{index === 0 ? "Player 1" : "Player 2"}</div>
            <div id="legend-2">{element}</div>

            <div class="scoreboard">
              <div class="win">
                <div id="legend">Won</div>
                <div id="legend-win">
                  {index === 0 ? score.player1.win : score.player2.win}
                </div>
              </div>
              <div class="lost">
                <div id="legend">Lost</div>
                <div id="legend-lost">
                  {index === 0 ? score.player1.lost : score.player2.lost}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
      <div className="title">
        <hr></hr> <div className="nameTitle">Past Games</div> <hr></hr>
      </div>
      <div className="pastGames">
        {history.map((element, index) => (
          <div className="game">
            <div className="time">{element.time}</div>
            <div className="board2">
              <BoardHistory
                cells={element.cell}
                winner={element.winners}
              ></BoardHistory>
            </div>
            <div className="action">
              <button
                className="delete"
                onClick={() => {
                  setHistory((previousHistory) => {
                    const newHIstory = [
                      ...previousHistory.filter((value, i) => index !== i),
                    ];
                    localStorage.setItem("games", JSON.stringify(newHIstory));
                    return newHIstory;
                  });
                }}
              >
                <FontAwesomeIcon icon={faTrash}></FontAwesomeIcon>&nbsp; Delete
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default App;
