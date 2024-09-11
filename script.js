//A megfelelően kiválasztott mezők száma
var checked;
//Az aknák száma
var mines;
//A mezők száma egy sorban
//Ezzel lesz kialakítva a játéktér
var block;
//A gombok száma a játéktéren
var NumOfButtons;
//Az aknák pozíciói
var MinePos = [];

function StartGame() {
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
    getNumberOfMines(numOfMines);

    //A mezők száma a játéktéren
    NumOfButtons = block * block;
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
      //Ha a pozíció akna, akkor az akna class-t is megkapja
      if (MinePos[posIndex] == i) {
        generatedDiv.classList.add("Mine");
        posIndex++;
      }
      //Ha jobb egérgombbal vagy görgővel kattintunk a mezőre,
      //akkor aknának jelöli
      generatedDiv.addEventListener("auxclick", function () {
        PosMine(generatedDiv.id);
      });
      gameSpace.appendChild(generatedDiv);
    }

    //A mezők méretének beállítása
    let size = 30 * block;
    gameSpace.style.height = size + "px";
    gameSpace.style.width = size + "px";
    checked = 0;
  }
}

/*
  Megkapom, hogy a kiválaszott mező körül 
  mennyi akna található, amennyiben a 
  nem akna, abban az esetben vége a játéknak
*/
function getMinesAround(id, block, numOfButtons, MineNumber) {
  id = parseInt(id);
  //A kiválaszott mező
  let idBlock = document.getElementById(id);
  //Ha a mező akna, akkor vége a játéknak,
  //egyébként vizsgálom
  if (idBlock.classList.contains("Mine")) {
    // Game Over
    gameOVer(MinePos, numOfButtons);
  } else {
    if (!idBlock.classList.contains("Correct")) {
      idBlock.classList.add("Correct");
      playSound("click");
      //A vizsgálandó pozíciók, az adott pozícióhoz viszonyítva
      let CheckPos = getPositions(block, id);

      //Megkapom az aknák számát, majd megjelenítem azokat
      mines = 0;

      //Ellenőrzöm, hogy a kapott pozíciók aknák-e,
      //ha igen, akkor növelem a "mines" értékét
      for (let i = 0; i < CheckPos.length; i++) {
        let chosenBlock = document.getElementById(id + parseInt(CheckPos[i]));

        if (chosenBlock.classList.contains("Mine")) {
          mines++;
        }
      }

      //Ha 0, akkor addig ellenőrzöm, az adott mező
      //körül lévő mezőket, amíg 0-tól
      //különböző aknaszámú mezőt nem találok
      if (mines == 0) {
        chosenButtonIsZero(id, CheckPos);
        idBlock.innerHTML = "";
        idBlock.disabled = true;
      } else {
        idBlock.innerHTML = mines;
      }

      //Növelem a helyes tippek számát
      checked++;

      //Ha a "checked" elérte a  nem-akna típusú mezők számát,
      //akkor a felhasználó nyert

      if (checked == numOfButtons - MineNumber) {
        alert("Nyertél");
      }
    }
  }
}

/* 
  Lehetséges akna, a mező jelőlése aknának
  és annak visszafordítása
*/
function PosMine(id) {
  let chosenButton = document.getElementById(id);
  if (!chosenButton.classList.contains("Correct")) {
    if (chosenButton.disabled == true) {
      chosenButton.disabled = false;
      chosenButton.innerHTML = "";
    } else {
      chosenButton.innerHTML = "B";
      chosenButton.disabled = true;
    }
  }
}

//A kiválaszott mező körül 0 akna van,
//ezért végignézem a körülötte lévő
//pozíciókat, hogy azok körül mennyi akna van
function chosenButtonIsZero(id, CheckPos) {
  for (let i = 0; i < CheckPos.length; i++) {
    paramId = id + CheckPos[i];
    getMinesAround(paramId, block, NumOfButtons, mines);
  }
}

//A block, valamint az aknák meghatározása
//a kiválasztott aknák száma alapján
function getNumberOfMines(numOfMines) {
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
    console.log("Sarok");

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
}

function playSound(input) {
  var audio = new Audio("Sound/" + input + ".mp3");
  audio.play();
}
