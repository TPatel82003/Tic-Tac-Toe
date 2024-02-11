const BoardHistory = ({
    cells, winner
}) => {
  const board = [
    [0, 1, 2].map((i) =>
      [0, 1, 2].map((j) => (
        <div
          class="cell2"
          style={
            {
              backgroundColor : winner[i][j] ?  "rgb(15, 15, 106)" : "rgb(228, 227, 227)",
              color : winner[i][j] ? "rgb(228, 227, 227)" : "rgb(15, 15, 106)",
            }
          }
        >{cells[i][j]}</div>
      ))
    ),
  ];
  return board;
};

export default BoardHistory;
