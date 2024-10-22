import Game from './Game/Game.js';
import Map from './Game/Map.js';
import Player from './Entities/Player.js';
import Camera from './Camera/Camera.js';

const scaleFactor = 1
// Game settings
Game.FPS = 30;
Game.INTERVAL = 1000 / Game.FPS;
Game.STEP = Game.INTERVAL / 1000;

// Prepare game canvas
export const canvas = document.getElementById("gameCanvas");
export const context = canvas.getContext("2d");

// Setup the room
export const room = {
  width: 4000,
  height: 4000,
  map: new Map(4000, 4000)
};
room.map.generate();

export const player = new Player(2000, 2000, room.map);

// // // Set the right viewport size for the camera
export const vWidth = Math.min(room.width, canvas.width);
export const vHeight = Math.min(room.height, canvas.height);

// // // Setup the camera
export const camera = new Camera(0, 0, vWidth, vHeight, room.width, room.height);
camera.follow(player, vWidth / 4, vHeight / 4);





// Configure game controls
window.addEventListener("keydown", function(e) {
  switch (e.keyCode) {
    case 65: // A key
      Game.controls.left = true;
      break;
    case 87: // W key
      Game.controls.up = true;
      break;
    case 68: // D key
      Game.controls.right = true;
      break;
    case 83: // S key
      Game.controls.down = true;
      break;
    case 80: // P key
      if(Game.isPausable && !Game.selection){
      Game.togglePause();
    }
      break;
    case 27: // ESC key
    if(Game.isPausable && !Game.selection){
      Game.togglePause();
    }
      break;
  }
});

window.addEventListener("keyup", function(e) {
  switch (e.keyCode) {
    case 65: // A key
      Game.controls.left = false;
      break;
    case 87: // W key
      Game.controls.up = false;
      break;
    case 68: // D key
      Game.controls.right = false;
      break;
    case 83: // S key
      Game.controls.down = false;
      break;
  }
});



canvas.addEventListener("mousemove", function(e) {
  const rect = canvas.getBoundingClientRect();
  const mouseX = e.clientX - rect.left + camera.xView;
  const mouseY = e.clientY - rect.top + camera.yView;
  player.followCursor(mouseX, mouseY);
});

canvas.addEventListener("mousedown", function(e) {
  const rect = canvas.getBoundingClientRect();
  const mouseX = e.clientX - rect.left + camera.xView;
  const mouseY = e.clientY - rect.top + camera.yView;
  player.attack(mouseX, mouseY);
});

// Add a single event listener to the canvas for weapon selection
canvas.addEventListener('click', function(event) {
  if(Game.selection){
  const rect = canvas.getBoundingClientRect();
  const scaleX = canvas.width / rect.width;
  const scaleY = canvas.height / rect.height;

  const clickX = (event.clientX - rect.left) * scaleX;
  const clickY = (event.clientY - rect.top) * scaleY;

  Game.weaponPositions.forEach(({ weapon, x, y, squareSize }) => {
      if (clickX >= x && clickX <= x + squareSize && clickY >= y && clickY <= y + squareSize) {
          Game.upgradeWeapon(weapon);
      }
  });
  }
});

export default function start(){
    Game.startNewGame()
}

