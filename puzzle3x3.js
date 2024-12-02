const moves3x3 = [
    ["1", "3"],       ["0", "2", "4"],      ["1", "5"],        /* 0 1 2 */
    ["0", "4", "6"],  ["1", "3", "5", "7"], ["2", "4", "8"],    /* 3 4 5 */
    ["3", "7"],       ["4", "6", "8"],      ["5", "7"],         /* 6 7 8 */
];

let pieces3x3 = [
    "cat0", "cat1", "cat2",
    "cat4", "cat5", "cat6",
    "cat8", "cat9", "free"
];

function $(id) {
    return document.getElementById(id);
}

function $$(query) {
    return document.querySelectorAll(query);
}

window.onload = function () {
    loadPuzzle3x3();
}

function loadPuzzle3x3() { 
    let puzzleBoard = $("puzzleBoard"); puzzleBoard.innerHTML = ""; // Clear previous puzzle 
    for (let i = 0; i < 9; i++) { 
        puzzleBoard.innerHTML += `<div id="${i}" class="${pieces3x3[i]}">${pieces3x3[i] !== "free" ? (parseInt(pieces3x3[i].substring(3)) + 1) : ""}</div>`; 
    } 
    var ele = document.getElementById("puzzleBoard"); 
    for (const child of ele.children) { 
        child.onmousedown = slide3x3; 
    }
}

function shuffleBoard() {
    shuffle(pieces3x3);
    loadPuzzle3x3();
}

function shuffle(array) {
    let currentIndex = array.length;
    while (currentIndex != 0) {
        let randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex--;
        [array[currentIndex], array[randomIndex]] = [
            array[randomIndex], array[currentIndex]
        ];
    }
}

function slide3x3() {
    // Parse the ID of the clicked tile
    const tileId = parseInt(this.id);

    // Iterate over possible moves for the current tile
    for (let i = 0; i < moves3x3[tileId].length; i++) {
        // Get the ID of the adjacent tile
        const adjacentId = parseInt(moves3x3[tileId][i]);

        // Check if the adjacent tile is the "free" tile
        if ($(adjacentId).className === "free") {
            // Swap the clicked tile with the "free" tile
            $(adjacentId).className = this.className;
            $(adjacentId).innerHTML = this.innerHTML;

            this.className = "free";
            this.innerHTML = "";

            // Exit loop after successful move
            break;
        }
    }
}

