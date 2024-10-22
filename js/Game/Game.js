import Player from 'http://127.0.0.1:5501/js/Entities/Player.js';
import { player, room, camera, context, canvas } from 'http://127.0.0.1:5501/js/main.js';
import Map from 'http://127.0.0.1:5501/js/Game/Map.js';
import NPC from 'http://127.0.0.1:5501/js/Entities/NPC.js';
import Coin from 'http://127.0.0.1:5501/js/Objects/Coin.js';
import Projectile from 'http://127.0.0.1:5501/js/Objects/Projectile.js';
import Weapon from 'http://127.0.0.1:5501/js/Objects/Weapon.js';
import AudioManager from 'http://127.0.0.1:5501/js/Audio/AudioManager.js';

export default class Game {
    static controls = {
        left: false,
        up: false,
        right: false,
        down: false
    };

    static FPS = 30;
    static INTERVAL = 1000 / Game.FPS;
    static STEP = Game.INTERVAL / 1000;

    static runningId = -1;
    static firstTimeStart = true;

    static coinsCollected = 0;
    static selectedWeapon = null; 
    static selection = false;
    static weaponPositions = [];
    static win = false;
    static isPausable = false;

    static audioManager = new AudioManager();




    static togglePause() {
        if (Game.runningId === -1) {
            Game.play();
        } else {
            clearInterval(Game.runningId);
            Game.runningId = -1;
            // console.log("Paused");
            this.saveGameState()
            if(!this.selection){
                $(".game-endmenu-dead-msg").hide()
                $("#gameCanvas").hide();
                $(".game-endmenu").show();
                $(".game-endmenu-paused-msg").show()
            }
        }
    }

    static play() {
        if (Game.runningId === -1) {
            $(".game-endmenu").hide();
              $("#gameCanvas").show();
            Game.runningId = setInterval(() => {
                Game.gameLoop();
            }, Game.INTERVAL);
            Game.firstTimeStart = false;
        }
    }

    static gameLoop() {
        Game.update();
        Game.draw();

        // Check if all NPCs in current stage are defeated
        if (room.map.areNPCsDefeated()) {
            room.map.progressToNextStage(); // Progress to the next stage
        }
    }

    static update() {
        player.update(Game.STEP, room.width, room.height, room.map);
        player.shuriken.forEach(shuriken =>shuriken.update)
        room.map.objects.filter(object => {
            if (object instanceof NPC){ object.update(Game.STEP, player, 50)}
            if (object instanceof Projectile){ object.update(Game.STEP, room.map)}});
        camera.update();
    }

    static draw() {
        context.clearRect(0, 0, canvas.width, canvas.height);
        room.map.draw(context, camera.xView, camera.yView);
        player.draw(context, camera.xView, camera.yView);
        this.drawHUD(context)
        if(this.selection){
            this.drawWeaponSelection(context)
        }
    }

    static upgrade(){
        if(player.weaponLevels['Knife'] == 5 && player.weaponLevels['Shuriken'] == 5){
            return
        }
        this.selection = true;
        this.togglePause();
    }


    static drawHUD(context) {
        context.save();
        
        // Use the pixel art font defined in CSS
        context.font = "20px 'PixelFont'";
        context.fillStyle = "white";
        context.textAlign = "right";

        // Draw coins in the top-right corner with icon
        const coinIcon = new Image();
        coinIcon.src = 'http://127.0.0.1:5501/textures/coin.svg';
        const coinIconSize = 30;

            context.drawImage(coinIcon, canvas.width - 150, 10, coinIconSize, coinIconSize);
            context.fillText(`${player.coins+Game.coinsCollected}`, canvas.width - 20, 30);

        // Draw current level and experience bar at the top center
        context.textAlign = "center";
        context.fillText(`Level: ${player.level}`, canvas.width / 2, 30);

        // Draw experience bar background
        const expBarWidth = 200;
        const expBarHeight = 20;
        const expBarX = (canvas.width - expBarWidth) / 2;
        const expBarY = 40;
        context.strokeStyle = "white";
        context.fillStyle = "#444";
        context.fillRect(expBarX, expBarY, expBarWidth, expBarHeight);
        context.strokeRect(expBarX, expBarY, expBarWidth, expBarHeight);

        // Draw filled part of experience bar
        const expPercentage = player.exp / player.nextLevelExp;
        context.fillStyle = "#0f0";
        context.fillRect(expBarX, expBarY, expBarWidth * expPercentage, expBarHeight);

        // Add pixel art style border to the experience bar
        context.strokeStyle = "black";
        context.lineWidth = 2;
        context.strokeRect(expBarX - 1, expBarY - 1, expBarWidth + 2, expBarHeight + 2);

        context.restore();
    }


    static drawWeaponSelection(context) {
        context.save();
    
        // Draw background overlay
        context.fillStyle = "rgba(0, 0, 0, 0.7)";
        context.fillRect(0, 0, canvas.width, canvas.height);
    
        // Define weapon squares dimensions and positions
        const squareSize = 100;
        const spacing = 100;
        const startX = (canvas.width - (3 * squareSize + 2 * spacing)) / 2;
        const startY = (canvas.height - squareSize) / 2;
    
        const weapons = [
            { name: 'Knife', icon: 'http://127.0.0.1:5501/textures/knife.svg', level: player.weaponLevels['Knife'] || 0 },
            { name: 'Shuriken', icon: 'http://127.0.0.1:5501/textures/shuriken.svg', level: player.weaponLevels['Shuriken'] || 0 }
        ];
    
        // Array to store promises for each image load
        const loadImagePromises = weapons.map(weapon => {
            return new Promise((resolve, reject) => {
                const weaponIcon = new Image();
                weaponIcon.onload = () => {
                    resolve({ ...weapon, weaponIcon });
                };
                weaponIcon.onerror = (error) => {
                    reject(error);
                };
                weaponIcon.src = weapon.icon; // Start loading the image
            });
        });
        
        let theWeapons = []
        // Wait for all images to load
        Promise.all(loadImagePromises)
            .then(loadedWeapons => {
                loadedWeapons.forEach((weapon, index) => {
                    const x = startX + (squareSize + spacing) * index;
                    const y = startY;
    
                    // Draw square
                    context.fillStyle = "#555";
                    context.fillRect(x, y, squareSize, squareSize);
    
                    // Draw weapon icon (now that it's loaded)
                    context.drawImage(weapon.weaponIcon, x + 10, y + 10, squareSize - 20, squareSize - 20);
    
                    // Draw weapon name and level
                    context.font = "20px 'PixelFont'";
                    context.fillStyle = "white";
                    context.textAlign = "center";
                    context.fillText(weapon.name, x + squareSize / 2, y + squareSize + 20);
                    context.fillText(`Level: ${weapon.level}`, x + squareSize / 2, y + squareSize + 40);
                
                    theWeapons.push({ name: weapon.name, x: x, y: y, squareSize : squareSize})
                });
    
                // Store weapon positions after all drawing is done
                Game.weaponPositions = theWeapons.map(({ name, x, y, squareSize }) => ({ weapon: name, x, y, squareSize }));
    
                // Ensure Game.weaponPositions is populated before restoring context
                // console.log(Game.weaponPositions); // Check if populated correctly
    
                context.restore();
            })
            .catch(error => {
                console.error('Error loading weapon icons:', error);
                context.restore();
            });
    }
    

    static upgradeWeapon(weaponName) {
        if (!player.weaponLevels[weaponName]) {
            player.weaponLevels[weaponName] = 0;
        }

        if (player.weaponLevels[weaponName] < 5) {
            player.equipWeapon(weaponName)
        } else {
            console.log(`${weaponName} is already at max level.`);
            return;
        }

        // console.log(`${weaponName} upgraded to level ${player.weaponLevels[weaponName]}`);
        Game.selectedWeapon = weaponName;
        this.selection = false;
        this.togglePause();
    }


    static saveGameState() {
        const gameState = {
            player: {
                coins: player.coins,
                upgrades: player.upgrades,
                maxHealth: player.maxHealth,
                speed: player.speed,
                attackSpeed: player.attackSpeed,
                damage: player.damage
                // Add other properties as needed
            }
            // Add other game state data if necessary
        };

        localStorage.setItem('gameState', JSON.stringify(gameState));
        // console.log('Game state saved:', gameState);
    }

    static loadGameState() {
        const savedGameState = localStorage.getItem('gameState');
        if (savedGameState) {
            const gameState = JSON.parse(savedGameState);

            // Update player object with saved data
            player.x = 2000;
            player.x = 2000;
            player.coins = gameState.player.coins;
            player.upgrades = gameState.player.upgrades;
            player.maxHealth = gameState.player.maxHealth;
            player.health = player.maxHealth;
            player.speed = gameState.player.speed;
            player.attackSpeed = gameState.player.attackSpeed;
            player.damage = gameState.player.damage;
            // Update other game state data as needed

            // console.log('Game state loaded:', gameState);
            Game.firstTimeStart = false; // Set firstTimeStart to false
            return true; // Indicate successful loading
        } else {
            console.log('No saved game state found.');
            return false; // Indicate no saved state found
        }
    }

    static startNewGame() {
        this.isPausable = true;
        this.audioManager.initSounds()
            .then(() => {
                // console.log('All sounds loaded successfully');
                // Example: play background music when all sounds are loaded
                // audioManager.playSound('backgroundMusic');
            })
            .catch(err => {
                console.error('Failed to load sounds:', err);
                // Handle error loading sounds
            });
        this.audioManager.playBackgroundMusic('http://127.0.0.1:5501/js/Audio/background_music.mp3');
        if(Game.loadGameState()){
          if (Game.firstTimeStart){
            this.coinsCollected = 0
            console.log("Starting a new game for the first time.");
            Game.play
          }else{
            this.coinsCollected = 0
            room.map = new Map(4000, 4000)
            room.map.generate()
            player.resetWeapons()
            player.resetPosition()
            // Continue with loaded game state
            Game.play();
          }
        }else{
          console.log("Failed to load saved game state. Starting a new game.");
          this.coinsCollected = 0
          player.resetWeapons()
          player.resetPosition()
          // Handle scenario where saved game state failed to load
          Game.play(); // Start a new game if loading failed
        }
    }

    static endGame() {
        this.isPausable = false
        // Save game state when the game ends
        Game.saveGameState();
        this.audioManager.stopBackgroundMusic()
        clearInterval(Game.runningId);
        Game.runningId = -1;
        // console.log("Game ended. Game state saved.");

        if (Game.win){
            $(".game-endmenu-win-msg").show()
            $(".game-endmenu-dead-msg").hide();
        }else{
            $(".game-endmenu-win-msg").hide()
            $(".game-endmenu-dead-msg").show();
        }
        // Display end game UI, e.g., buttons to restart or go to menu
        $(".game-endmenu-paused-msg").hide()
        $("#gameCanvas").hide();
        $(".game-endmenu").show();
        $("#resumeButton").hide();
    }
}
