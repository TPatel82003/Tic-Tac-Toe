import { useEffect } from "react";

/* eslint-disable eqeqeq */
const rows = {
  0: [Array(3).fill('')],
  1: [Array(3).fill('')],
  2: [Array(3).fill('')],
};
function changeUi(i, j) {
  document.getElementById(`${i}${j}`).style.color = "rgb(210, 210, 210)";
  document.getElementById(`${i}${j}`).style.backgroundColor =
    "rgb(15, 15, 106)";
}
function updateScore(score , player1 , player2 , setScore){
  const newScore = {
    player1: {
      ...score.player1,
      win: score.player1.win + player1,
      lost: score.player1.lost + player2,
    },
    player2: {
      ...score.player2,
      win: score.player2.win + player2,
      lost: score.player2.lost + player1,
    },
  };
  setScore(newScore);
}
const Board = ({ player, setPlayer, setWinner, score, setScore, winner , games , setGames , updateLocalGames , setLast}) => {
  function handleClick(event) {
    const cellId = event.target.id;
    document.getElementById(cellId).textContent =
      player === "Player 1" ? "X" : "O";
      document.getElementById(cellId).style.pointerEvents = 'none';
    if(games >= 0)
      setLast(cellId);
    setPlayer(player === "Player 1" ? "Player 2" : "Player 1");
    checkWinner();
  }
  
  function checkWinner() {
    setGames(games + 1); 
    const condition = Array.from(document.getElementsByClassName("cell"));
    condition.forEach((element, index, condition) => {
      const cellRId = element.id[0];
      const cellCId = element.id[1];
      rows[cellRId][cellCId] = element.textContent;
    });
    const diagnoal1 = [0, 1, 2].map((i) => rows[i][i]);
    const diagnoal2 = [0, 1, 2].map((i) => rows[i][2 - i]);
    let player1 = diagnoal1.every((i) => i === "X");
    let player2 = diagnoal1.every((i) => i === "O");
    if (player1 | player2) {
      [0, 1, 2].forEach((i) => changeUi(i, i));
      setWinner(player1 ? "Player 1" : player2 ? "Player 2" : "live");
      updateScore(score , player1 , player2 , setScore);
      updateLocalGames(rows , {
        row:[0,1,2],
        column : [0,1,2]
      });
      return;
    }
    player1 |= diagnoal2.every((i) => i === "X");
    player2 |= diagnoal2.every((i) => i === "O");
    if (player1 || player2) {
      [0, 1, 2].forEach((i) => changeUi(i, 2 - i));
      setWinner(player1 ? "Player 1" : player2 ? "Player 2" : "live");
      updateScore(score , player1 , player2 , setScore);
      updateLocalGames(rows , {
        row:[0,1,2],
        column : [2,1,0]
      });
      return;
    }
    [0, 1, 2].forEach((i) => {
      player1 |= rows[i].every((j) => j === "X");
      player2 |= rows[i].every((j) => j === "O");
    });
    const columns = Object.keys(rows).map((colIndex) =>
      Object.values(rows).map((row) => row[colIndex])
    );
    function helper(array, col = false) {
      [0, 1, 2].forEach((i) => {
        if (
          array[i].every((j) => j === "X") ||
          array[i].every((j) => j === "O")
        ) {
          updateLocalGames(rows , {row : col ? [0,1,2] : [i,i,i] , column : col ? [i,i,i] : [0,1,2]});
          [0, 1, 2].forEach((j) => changeUi(col ? j : i, col ? i : j));
        }
        player1 |= array[i].every((j) => j === "X");
        player2 |= array[i].every((j) => j === "O");
      });
    }
    helper(rows);
    helper(columns, true);
    updateScore(score , player1 , player2 , setScore);
    setWinner(player1 ? "Player 1" : player2 ? "Player 2" : "live");
    
  }
  const board = [
    [0, 1, 2].map((i) =>
      [0, 1, 2].map((j) => (
        <div
          class="cell"
          id={`${i}${j}`}
          onClick={handleClick}
          style={{
            pointerEvents: winner !== "live" ? "none" : "all",
            height: winner !== "live" ? "85px" : "100px",
            width: winner !== "live" ? "85px" : "100px",
          }}
        ></div>
      ))
    ),
  ];
  return board;
};

export default Board;
