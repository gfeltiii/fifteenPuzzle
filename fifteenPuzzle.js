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

//these functions make writing the code easeir one $ for just one element, $$ for all elements
function $(id){
    return document.getElementById(id);
}
function $$(query){
    return document.querySelectorAll(query);
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
function slide(){
    for(let i=0; i<moves[this.id].length; i++){
        if($(moves[parseInt(this.id)][i]).className=="free"){
            clearNeighbors();
            $(moves[this.id][i]).className="";
            $(moves[this.id][i]).innerHTML=this.innerHTML;
            $(moves[this.id][i]).classList.add(this.className);
            this.className="";
            this.innerHTML="";
            this.classList.add("free");
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
function checkWin(){
    for(let i=0; i<15; i++){

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
