var checked;
var mines;

function StartGame() {
  let MineDiv = document.getElementsByName("MineNumber");
  let numOfMines = 0;
  for (let i = 0, length = MineDiv.length; i < length; i++) {
    if (MineDiv[i].checked) numOfMines = MineDiv[i].value;
  }

  if (numOfMines == 0) {
    alert("Ki kell választani egy típust!");
  } else {
    let gameSpace = document.getElementById("GameTable");
    gameSpace.innerHTML = "";

    let block;
    let chance;
    switch (numOfMines) {
      case "10":
        block = 10;
        mines = 10;
        break;
      case "20":
        block = 18;
        mines = 20;
        break;
      case "99":
        block = 24;
        mines = 99;
        break;
    }

    let MinePos = [];

    while (MinePos.length < numOfMines) {
      let random = Math.round(Math.random() * (block * block));

      let existing = false;
      for (let i = 0; i < MinePos.length; i++) {
        if (MinePos[i] == random) {
          existing = true;
          break;
        }
      }

      if (existing == false) {
        MinePos.push(random);
      }
    }

    let NumOfButtons = block * block;
    MinePos = MinePos.sort(function (a, b) {
      return a - b;
    });

    let posIndex = 0;
    for (let i = 1; i <= NumOfButtons; i++) {
      let generatedDiv = document.createElement("button");
      generatedDiv.classList.add("GameTableButton");
      generatedDiv.id = i;
      generatedDiv.setAttribute(
        "onclick",
        "getMinesAround(" +
          generatedDiv.id +
          "," +
          block +
          "," +
          NumOfButtons +
          "," +
          mines +
          ")"
      );
      if (MinePos[posIndex] == i) {
        generatedDiv.classList.add("Mine");

        posIndex++;
      }

      gameSpace.appendChild(generatedDiv);
    }
    let size = 30 * block;
    gameSpace.style.height = size + "px";
    gameSpace.style.width = size + "px";
    checked = 0;
  }
}

function getMinesAround(id, block, lastBlock, MineNumber) {
  id = parseInt(id);

  let idBlock = document.getElementById(id);
  if (idBlock.classList.contains("Mine")) {
    alert("Bombára kattintottál!");
    let table = document.getElementById("GameTable");
    table.innerHTML = "";
  } else {
    if (!idBlock.classList.contains("Correct")) {
      idBlock.classList.add("Correct");
      let CheckPos = [];
      let mines = 0;
      switch (block) {
        case 10:
          CheckPos = [-11, -10, -9, -1, 1, 9, 10, 11];
          break;
        case 18:
          CheckPos = [-19, -18, -17, -1, 1, 17, 18, 19];
          break;
        case 24:
          CheckPos = [-25, -24, -23, -1, 1, 23, 24, 25];
          break;
      }

      if (id == 1) {
        CheckPos.splice(0, 4);
        CheckPos.splice(1, 1);
      } else if (id == block) {
        CheckPos.splice(0, 3);
        CheckPos.splice(1, 1);
        CheckPos.splice(3, 1);
      } else if (id < block) {
        CheckPos.splice(0, 3);
      } else if (id % block == 0) {
        CheckPos.splice(2, 1);
        CheckPos.splice(3, 1);
        CheckPos.splice(5, 1);
      } else if (id % block == 1) {
        CheckPos.splice(0, 1);
        CheckPos.splice(2, 1);
        CheckPos.splice(3, 1);
      }

      if (id == lastBlock) {
        CheckPos.splice(3, 2);
      } else if (id == lastBlock - block + 1) {
        CheckPos.splice(3, 2);
        console.log("Sarok");
      } else if (id > lastBlock - block) {
        CheckPos.splice(5, 3);
      }

      console.log(CheckPos);

      for (let i = 0; i < CheckPos.length; i++) {
        let chosenBlock = document.getElementById(id + parseInt(CheckPos[i]));

        if (chosenBlock.classList.contains("Mine")) {
          mines++;
        }
      }

      idBlock.innerHTML = mines;
      checked++;

      if (checked == lastBlock - MineNumber) {
        alert("Nyertél");
      }
    }
  }
}
