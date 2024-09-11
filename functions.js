export function playSound(input) {
  var audio = new Audio("Sound/" + input + ".mp3");
  audio.play();
}
