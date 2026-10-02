
function Cell() {
   let value = 0;

  // Accept a player's token to change the value of the cell
  const addToken = (player) => {
    value = player;
  };

  // How we will retrieve the current value of this cell through closure
  const getValue = () => value;

  return {
    addToken,
    getValue,
  };
}



const Gameboard =(function () {
  
  //Board initialization
 const rows = 3;
  const columns = 3;
  const board = [];

 for (let i = 0; i < rows; i++) {
    board[i] = [];
    for (let j = 0; j < columns; j++) {
      board[i].push(Cell());
    }
  }

// Accessing private property
const getBoard = () => board;


//For occupying board cells 
const dropToken = (row,column, player) => {
  
 if (board[row][column].getValue() === 0){
board[row][column].addToken(player);
return true;
 }

else{
return false
}
};

const clearBoard = () => {
    for (let i = 0; i < rows; i++) {
      for (let j = 0; j < columns; j++) {
        board[i][j].addToken(0); 
      }
    }
  };


  
  return { getBoard, dropToken,clearBoard};
  })();


const GameController=(function () {
 
const players = [{ name: "Player One", token: 1,},  {name: "Player Two",token: 2,},];


  const setPlayers = (name1, name2) => {
    players[0].name = name1;
    players[1].name = name2;
  };

    const board=Gameboard;

  let isGameOver = false;
   let activePlayer = players[0];

  const switchPlayerTurn = () => {
    activePlayer = activePlayer === players[0] ? players[1] : players[0];
  };

  
  const getActivePlayer = () => activePlayer;

 

  const checkForWin= () => {
    const boardContainer=board.getBoard();

for (let i = 0; i <= 2; i++) {


  //For horizontal matching

  if (boardContainer[i][0].getValue() !== 0 && boardContainer[i][0].getValue() === boardContainer[i][1].getValue() && boardContainer[i][1].getValue() === boardContainer[i][2].getValue()) 
  {
  
    return boardContainer[i][0].getValue();
              
          }
      }



   //For vertical matching   

   for (let i = 0; i <= 2; i++) {
  if (boardContainer[0][i].getValue() !== 0 && boardContainer[0][i].getValue() === boardContainer[1][i].getValue() && boardContainer[1][i].getValue() === boardContainer[2][i].getValue()) 
  {

               return boardContainer[0][i].getValue();
          }
       }    
      


   // For diagonal matching       

   if((boardContainer[0][0].getValue() !== 0 && boardContainer[0][0].getValue() === boardContainer[1][1].getValue() && boardContainer[1][1].getValue() === boardContainer[2][2].getValue())
    ||(boardContainer[0][2].getValue() !== 0 && boardContainer[0][2].getValue() === boardContainer[1][1].getValue() && boardContainer[1][1].getValue() === boardContainer[2][0].getValue()))
  {

      return boardContainer[1][1].getValue();
 
 
    }

  };

const checkForDraw = () => {
    const boardContainer = board.getBoard();
    let arr = [];
    for (let i = 0; i <= 2; i++) {

      for (let j = 0; j <= 2; j++) {
        if (boardContainer[i][j].getValue() === 0) {
          arr.push(0);
        }
      }
    }

if (arr.length!==0)
  return true;

  }

const resetGame = () => {
    board.clearBoard();
    activePlayer = players[0]; 
    isGameOver=false;
  };

const playRound = (row, column) => {
  if(isGameOver===true){
    return;
  }

    if (row < 0 || row > 2 || column < 0 || column > 2) {
      return;
    }

   
    
    // 1. Attempt to drop the token and capture the result
    const isValidMove = board.dropToken(row, column, getActivePlayer().token);
    
    if (!isValidMove) {
      return; // Exit early without switching turns so the player can try again
    }

    // 2. Check for a win after a successful move
    const winningPlayerToken = checkForWin();
    if (winningPlayerToken === getActivePlayer().token) {
      isGameOver=true;
      return "win";
    }

    // 3. Check for a draw (if drawCheck is not true, the board is full)
    const drawCheck = checkForDraw();
    if (drawCheck !== true) {
      isGameOver=true;
      return "draw";
    }

    // neither win nor draw
    switchPlayerTurn();
    return"continue";
  };

 
 
 

  
  return {
   playRound,
    getActivePlayer, 
    setPlayers,
    resetGame
  };
})();



const ScreenController=(function(){
const cellList=document.querySelectorAll(".cell");
const startButton=document.querySelector(".start-button");
const restartButton = document.querySelector(".restart-button");
const player1= document.querySelector("#player1");
const player2= document.querySelector("#player2");
const messageDisplay = document.querySelector(".message-display");


  const render = function () {
    const currentBoard = Gameboard.getBoard();
    
    for (const cell of cellList) {
      // 3. Simplified render logic: grab the row/col from the HTML...
      const row = cell.dataset.row;
      const col = cell.dataset.column;
      
      // ...and check that exact spot in the JS array!
      const cellValue = currentBoard[row][col].getValue();

      if (cellValue === 1) {
        cell.textContent = "X";
        cell.classList.add("mark-x");
        cell.classList.remove("mark-o");
      } else if (cellValue === 2) {
        cell.textContent = "O";
        cell.classList.add("mark-o");
        cell.classList.remove("mark-x");
      } else {
        cell.textContent = ""; 
        cell.classList.remove("mark-x", "mark-o");
        
      }
    }
  };



for (const cell of cellList) {
    cell.addEventListener("click", (e)=>{
const status=GameController.playRound(parseInt(e.target.dataset.row), parseInt(e.target.dataset.column));
render();

      if (status === "win") {
        messageDisplay.textContent = `${GameController.getActivePlayer().name} Wins!`;
      } else if (status === "draw") {
        messageDisplay.textContent = "It's a tie!";
      } else if (status === "continue") {
        messageDisplay.textContent = `${GameController.getActivePlayer().name}'s turn`;
      }
    });
  };



  
  startButton.addEventListener("click",(e)=>{
    e.preventDefault();
    GameController.setPlayers(player1.value,player2.value);

 messageDisplay.textContent = `${GameController.getActivePlayer().name}'s turn`;
 GameController.resetGame();
    render();
  });


  restartButton.addEventListener("click", () => {
    GameController.resetGame();
    messageDisplay.textContent = `${GameController.getActivePlayer().name}'s turn`;
    render();
  });

})();

