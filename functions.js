var checked = 0;
function playSound(input) {
  var audio = new Audio("Sound/" + input + ".mp3");
  audio.play();
}

/* 
  A játékos aknára kattintott,
  így vége a játéknak.
  Megjelenítem az aknákat
*/
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

function getPositions(block, id, NumOfButtons) {
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

//A block, valamint az aknák meghatározása
//a kiválasztott aknák száma alapján
function getNumberOfBlocks(numOfMines) {
  console.log("Lefutott");
  let block;
  switch (numOfMines) {
    case "10":
      block = 10;
      break;
    case "20":
      block = 18;
      break;
    case "99":
      block = 24;
      break;
  }
  console.log(block);
  return block;
}

//A kiválaszott mező körül 0 akna van,
//ezért végignézem a körülötte lévő
//pozíciókat, hogy azok körül mennyi akna van
function chosenButtonIsZero(id, CheckPos, block, NumOfButtons, mines) {
  for (let i = 0; i < CheckPos.length; i++) {
    let paramId = id + CheckPos[i];
    getMinesAround(paramId, block, NumOfButtons, mines);
  }
}

/* 
  Lehetséges akna, a mező jelőlése aknának
  és annak visszafordítása
*/
function PosMine(id) {
  let startButton = document.getElementById("startButton");
  if (!startButton.classList.contains("gameOver")) {
    let chosenButton = document.getElementById(id);
    if (!chosenButton.classList.contains("Correct")) {
      if (chosenButton.disabled == true) {
        chosenButton.disabled = false;
        chosenButton.innerHTML = "";
      } else {
        chosenButton.innerHTML = "B";
        chosenButton.disabled = true;
      }
      playSound("mine");
    }
  }
}
/*
  Megkapom, hogy a kiválaszott mező körül 
  mennyi akna található, amennyiben a 
  nem akna, abban az esetben vége a játéknak
*/
function getMinesAround(id, block, numOfButtons, MineNumber, MinePos) {
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
      let CheckPos = getPositions(block, id, numOfButtons);

      //Megkapom az aknák számát, majd megjelenítem azokat
      let mines = 0;

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
        chosenButtonIsZero(id, CheckPos, block, numOfButtons, mines);
        idBlock.innerHTML = "";
        idBlock.disabled = true;
      } else {
        idBlock.innerHTML = mines;
      }

      //Növelem a helyes tippek számát
      checked++;
      console.log("checked: " + checked);

      //Ha a "checked" elérte a  nem-akna típusú mezők számát,
      //akkor a felhasználó nyert

      if (checked == numOfButtons - MineNumber) {
        let startButton = document.getElementById("startButton");
        startButton.classList.remove("gameOver");
        playSound("win");
      }
    }
  }
}

export {
  playSound,
  gameOVer,
  getMinesAround,
  getNumberOfBlocks,
  getPositions,
  PosMine,
};
