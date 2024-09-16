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
