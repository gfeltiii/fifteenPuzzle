const moves = [
    ["1","4"],      ["0","5","2"],      ["1","3","6"],      ["2","7"],          /*Moves is a constant 2d array that lists adjacent positions */
    ["0","5","8"],  ["1","4","6","9"],  ["2","5","7","10"], ["3","6","11"],     /*for each position in the puzzle with the numbers starting  */
    ["4","9","12"], ["5","8","10","13"],["6","9","11","14"],["7","10","15"],    /*with 0 in the top left corner and going left-right up-down */
    ["8","13"],     ["9","12","14"],    ["10","13","15"],   ["11","14"]];

let pieces =    ["0","1","2","3",                                   /*Pieces is a array that holds the class for each position on */
                "4","5","6","7",                                    /*the board, free space indicates the space without any image */
                "8","9","10","11",
                "12","13","14","free"];
let puzzle = "cat";
let moveCount = 0;
let timer = null;
let timeElapsed = 0;

//these functions make writing the code easeir one $ for just one element, $$ for all elements
function $(id){
    return document.getElementById(id);
}
function $$(query){
    return document.querySelectorAll(query);
}

// Timer function
function startTimer() {
    if (timer) clearInterval(timer);
    timeElapsed = 0;
    updateTimeDisplay();  // Initial call to set the time to 00:00
    timer = setInterval(() => {
        timeElapsed++;
        updateTimeDisplay();
    }, 1000);
}

function updateTimeDisplay() {
    const minutes = Math.floor(timeElapsed / 60);
    const seconds = timeElapsed % 60;
    const formattedTime = `${pad(minutes)}:${pad(seconds)}`;
    document.getElementById("timeElapsed").textContent = formattedTime;
}

function pad(number) {
    return number < 10 ? "0" + number : number;  // Adds leading zero if needed
}

function stopTimer() {
    if (timer) clearInterval(timer);
}

// Function to format time in mm:ss format
function formatTime(seconds) {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${pad(minutes)}:${pad(remainingSeconds)}`;
}

// Parse time from mm:ss to seconds
function parseTime(time) {
    const [minutes, seconds] = time.split(":").map(Number);
    return minutes * 60 + seconds;
}

function checkWin() {
    let isSolved = true;

    // Loop through each piece and check if it is in the correct position
    const puzzleBoard = document.getElementById("puzzleBoard");
    const piecesInDOM = puzzleBoard.children; // Get all puzzle pieces

    for (let i = 0; i < piecesInDOM.length; i++) {
        const piece = piecesInDOM[i];
        
        // We expect the puzzle to be in the order 0, 1, 2, ..., 14, and the last div (id 15) should have the "free" class
        if (piece.id !== "15" && parseInt(piece.innerHTML) !== i + 1) { // We check the numbers, assuming 1-15 are the puzzle pieces
            isSolved = false;
            break;
        } else if (piece.id === "15" && piece.className !== "free") {
            // The "free" space should have the "free" class at position 15
            isSolved = false;
            break;
        }
    }

    // If all pieces are in the correct order, stop the timer and alert the user
    if (isSolved) {
        stopTimer();
        // Display the "You won!" message
        const gameInfo = document.getElementById("gameInfo");
        const winMessage = document.createElement("div");
        winMessage.id = "winMessage";
        winMessage.innerHTML = `<h2>Congratulations!</h2><p>You solved the puzzle in ${formatTime(timeElapsed)} and ${moveCount} moves!</p>`;
        gameInfo.appendChild(winMessage);


        // Add the flashRainbow class to the body to trigger the rainbow effect
        document.body.classList.add("flashRainbow");

        // Stop the rainbow animation after 10 seconds
        setTimeout(() => {
            document.body.classList.remove("flashRainbow");
        }, 10000);  // The rainbow effect will last for 10 seconds
    }
}


// Play sound effect
function playSound() {
    const soundEffect = document.getElementById("soundEffect");
    soundEffect.play();
}

//ON LOAD: the pieces are loaded in the default and given the ability to slide
window.onload = function() {
    let puzzleBoard = $("puzzleBoard");
    for(let i=0; i<15; i++){
        puzzleBoard.innerHTML=puzzleBoard.innerHTML + "<div id='"+(i)+"' class='"+puzzle+i+"'>"+(i+1)+"</div>";   
    }
    puzzleBoard.innerHTML=puzzleBoard.innerHTML + "<div id='15' class='free'></div>";
    var ele= document.getElementById("puzzleBoard");
    for(const child of ele.children){
        child.onmousedown=slide;
    }
    checkNeighbors();
}

//shuffles pieces array and displays the new puzzle
function shuffleBoard(){
    shuffle(pieces);
    let puzzleBoard = $("puzzleBoard");
    puzzleBoard.innerHTML = "";
    for(let i=0; i<16; i++){
        if(pieces[i]!="free")
        puzzleBoard.innerHTML=puzzleBoard.innerHTML + "<div id='"+(i)+"' class='"+puzzle+pieces[i]+"'>"+(parseInt(pieces[i])+1)+"</div>";
        else puzzleBoard.innerHTML=puzzleBoard.innerHTML + "<div id='"+(i)+"' class='"+pieces[i]+"'></div>"
    }
    var ele= document.getElementById("puzzleBoard");
    for(const child of ele.children){
        child.onmousedown=slide;
    }
    checkNeighbors();
    startTimer();
}

//basic array shuffling method
function shuffle(array){
    
    let currentIndex;
    for(let i=0; i<100; i++){
        currentIndex = array.findIndex(x => x=="free");
      let randomIndex = moves[currentIndex][Math.floor(Math.random() * moves[currentIndex].length)];
      [array[currentIndex], array[randomIndex]] = [
        array[randomIndex], array[currentIndex]];
      }
    checkNeighbors();
}

//if the piece clicked on is adjacent to a free space, they switch class information
function slide() {
    for (let i = 0; i < moves[this.id].length; i++) {
        if ($(moves[this.id][i]).className === "free") {
            clearNeighbors();

            // Swap the "free" space and the clicked piece
            const clickedPiece = this.id;
            const freeSpot = moves[this.id][i];

            // Swap in the `pieces` array
            const clickedIndex = pieces.indexOf(clickedPiece);
            const freeIndex = pieces.indexOf("free");

            // Swap the pieces in the array
            [pieces[clickedIndex], pieces[freeIndex]] = [pieces[freeIndex], pieces[clickedIndex]];

            // Update the visual representation (HTML)
            $(freeSpot).className = "";
            $(freeSpot).innerHTML = this.innerHTML;
            $(freeSpot).classList.add(this.className);
            this.className = "";
            this.innerHTML = "";
            this.classList.add("free");

            // Increment the move count and update the display
            moveCount++;
            document.getElementById("moveCount").textContent = moveCount;

            // Play sound
            playSound();

            // Check if the puzzle is solved
            checkWin();
            checkNeighbors();
        }
    }
}

function checkNeighbors(){
    var ele= document.getElementById("puzzleBoard");
    var freeSpot;
    for(const child of ele.children){
        if(child.className=="free"){
            freeSpot=child.id;
        }
    }
    for(let i=0; i<moves[freeSpot].length; i++){
        $(moves[freeSpot][i]).classList.add("neighbor");
    }
}
function clearNeighbors(){
    var ele= document.getElementById("puzzleBoard");
    for(const child of ele.children){
        child.classList.remove("neighbor");
    }
}

function changeBoard(){
    $("boards").className="";
    $("boards").classList.add("boards");
    $("boards").innerHTML=
    "<h2>Choose Your Board</h2>"+
    "<img src='./img/cat.jpg' width='100px' id='cat'>&nbsp;&nbsp;"+
    "<img src='./img/pengs.jpg' width='100px' id='penguin'>&nbsp;&nbsp;"+
    "<img src='./img/fish.jpg' width='100px' id='fish'>&nbsp;&nbsp;"+
    "<img src='./img/frog.jpg' width='100px' id='frog'>";
    $("cat").onmousedown=$('frog').onmousedown=$('penguin').onmousedown=$('fish').onmousedown = function() {
            const temp=puzzle;
            puzzle=this.id;
            $("boards").className="";
            $("boards").classList.add("boardsClear");
            $("boards").innerHTML="";
            var ele= document.getElementById("puzzleBoard");
            clearNeighbors();
            for(const child of ele.children){
                if(child.className!="free")
                    child.className=puzzle+child.className.substring(temp.length);
            }
            checkNeighbors();
    }
}
