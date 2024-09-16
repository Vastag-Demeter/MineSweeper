import * as script from "./functions.js";

var MinePos = [];

document.querySelector("#startButton").addEventListener("click", StartGame);

function StartGame() {
  console.log("A start lefutott");
  let startButton = document.getElementById("startButton");
  startButton.classList.remove("gameOver");
  let MineDiv = document.getElementsByName("MineNumber");
  //Az aknák száma
  let numOfMines = 0;
  //Az aknák számának meghatározása, amit kijelölt a játékos
  for (let i = 0, length = MineDiv.length; i < length; i++) {
    if (MineDiv[i].checked) numOfMines = MineDiv[i].value;
  }

  if (numOfMines == 0) {
    alert("Ki kell választani egy típust!");
  } else {
    let gameSpace = document.getElementById("GameTable");
    gameSpace.innerHTML = "";

    //Beállítom az aknák és a block számát
    let block = script.getNumberOfBlocks(numOfMines);

    console.log("Visszatért:" + block);
    //A mezők száma a játéktéren
    let NumOfButtons = block * block;
    //Legenerálom az aknák pozícióit, ismétlések nélkül
    while (MinePos.length < numOfMines) {
      let random = Math.round(Math.random() * NumOfButtons);

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

    //Rendezem a koordinátákat
    MinePos = MinePos.sort(function (a, b) {
      return a - b;
    });

    //Az adott pozíció indexe
    let posIndex = 0;

    /* Legenerálom a mezőket, majd megadom nekik a 
        megfelelő tulajdonságokat: Class, id,
        valamint az "onclick egy függényt hív meg"
    */
    for (let i = 1; i <= NumOfButtons; i++) {
      let generatedDiv = document.createElement("button");
      generatedDiv.classList.add("GameTableButton");
      generatedDiv.id = i;
      // generatedDiv.setAttribute(
      //   "onclick",
      //   "getMinesAround(" +
      //     generatedDiv.id +
      //     "," +
      //     block +
      //     "," +
      //     NumOfButtons +
      //     "," +
      //     mines +
      //     ")"
      // );

      generatedDiv.addEventListener("click", () =>
        script.getMinesAround(
          generatedDiv.id,
          block,
          NumOfButtons,
          numOfMines,
          MinePos
        )
      );

      //Ha a pozíció akna, akkor az akna class-t is megkapja
      if (MinePos[posIndex] == i) {
        generatedDiv.classList.add("Mine");
        posIndex++;
      }
      //Ha jobb egérgombbal vagy görgővel kattintunk a mezőre,
      //akkor aknának jelöli
      generatedDiv.addEventListener("auxclick", function () {
        script.PosMine(generatedDiv.id);
      });
      gameSpace.appendChild(generatedDiv);
      script.playSound("start");
    }

    //A mezők méretének beállítása
    let size = 30 * block;
    gameSpace.style.height = size + "px";
    gameSpace.style.width = size + "px";
    let checked = 0;
  }
}

//Meghatározom, hogy adott mezőhőz képest,
//milyen távolságra lévő mezőket vizsgáljon a játék

function getPositions(block, id) {
  //Kiválasztom a lehető összes lehetőséget
  let CheckPos = [];
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

  //Kiszűrom azokat a mezőket, amelyeket nem kell,
  //vagy nem lehet vizsgálni

  //Ha ez első mező
  if (id == 1) {
    CheckPos.splice(0, 4);
    CheckPos.splice(1, 1);

    //Ha az első sor utólsó mezője
  } else if (id == block) {
    CheckPos.splice(0, 3);
    CheckPos.splice(1, 1);
    CheckPos.splice(3, 1);

    //Ha az első sorban van
  } else if (id < block) {
    CheckPos.splice(0, 3);

    //Ha a jobb szélső oszlopban van
  } else if (id % block == 0) {
    CheckPos.splice(2, 1);
    CheckPos.splice(3, 1);
    CheckPos.splice(5, 1);

    //Ha a bal szélső oszlopban van
  } else if (id % block == 1) {
    CheckPos.splice(0, 1);
    CheckPos.splice(2, 1);
    CheckPos.splice(3, 1);
  }

  //Ha az utolsó mező
  if (id == NumOfButtons) {
    CheckPos.splice(3, 2);

    //Ha az utolsó sor első mezője
  } else if (id == NumOfButtons - block + 1) {
    CheckPos.splice(3, 2);

    //Ha az utolsó sorban van
  } else if (id > NumOfButtons - block) {
    CheckPos.splice(5, 3);
  }

  return CheckPos;
}

function gameOVer(minePositions, numberOfButtons) {
  for (let i = 0; i <= numberOfButtons; i++) {
    let button = document.getElementById(i);

    if (minePositions.includes(i)) {
      button.classList.add("ShowMines");
    }

    if (button != null) {
      button.disabled = true;
    }
  }
  playSound("gameOver");
  let startButton = document.getElementById("startButton");
  startButton.classList.add("gameOver");
}

//Lejátsza a megadott hangot
function playSound(input) {
  var audio = new Audio();
  // Hangerő, de nem mindig mindig működik
  audio.volume = 0.2;

  audio.src = "Sound/" + input + ".mp3";

  audio.play();
}
