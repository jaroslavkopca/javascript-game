import GameObject from 'http://127.0.0.1:5501/js/Objects/GameObject.js';
import NPC from 'http://127.0.0.1:5501/js/Entities/NPC.js';
import DestructibleObject from 'http://127.0.0.1:5501/js/Objects/DestructibleObject.js';
import Chest from 'http://127.0.0.1:5501/js/Objects/Chest.js';
import Building from 'http://127.0.0.1:5501/js/Objects/Building.js';
import Tree from 'http://127.0.0.1:5501/js/Objects/Tree.js';
import Wall from 'http://127.0.0.1:5501/js/Objects/Wall.js';
import Coin from 'http://127.0.0.1:5501/js/Objects/Coin.js';
import Item from 'http://127.0.0.1:5501/js/Objects/Item.js';
import Stage from 'http://127.0.0.1:5501/js/Game/Stage.js';
import Game from 'http://127.0.0.1:5501/js/Game/Game.js';

export default class Map {
    constructor(width, height) {
      this.width = width;
      this.height = height;
      this.image = new Image();
      this.objects = []; // Array to hold objects on the map
      this.spawnedNPCs = []; // Keep track of spawned NPCs
      this.stages = [
        new Stage(1, 15, 50,100, 10 ,30, "http://127.0.0.1:5501/textures/flamingo.svg", 50),   // Stage 1: 5 NPCs, health 50, damage 10
        new Stage(2, 20, 50,100, 10 ,50, "http://127.0.0.1:5501/textures/flamingo.svg", 70),
        new Stage(2, 20, 50,100, 10 ,50, "http://127.0.0.1:5501/textures/flamingo.svg", 70),
        new Stage(3, 15, 100,200, 15,50, "http://127.0.0.1:5501/textures/kuma.svg", 100),   
        new Stage(4, 20, 300,200, 15,80, "http://127.0.0.1:5501/textures/kuma.svg", 120),   
        new Stage(5, 30, 300,200, 15,100, "http://127.0.0.1:5501/textures/kuma.svg", 140),   
        new Stage(4, 12, 600,150, 80,200, "http://127.0.0.1:5501/textures/buggy.svg", 200), 
        new Stage(5, 30, 600,150, 80,200, "http://127.0.0.1:5501/textures/buggy.svg", 200),
        new Stage(6, 1, 2000,200, 30,2000, "http://127.0.0.1:5501/textures/bigmom.svg", 300)
    ];
    this.currentStageIndex = 0;
    this.currentStage = this.stages[this.currentStageIndex];
    }

 
  
  
  
  
    generate() {
      this.image.onload = () => {
        // Once the image is loaded, you can draw it directly onto the canvas
        const canvas = document.createElement("canvas");
        canvas.width = this.width;
        canvas.height = this.height;
        const ctx = canvas.getContext("2d");
  
        // Draw the background image from top-left corner to cover the entire map
        ctx.drawImage(this.image, 0, 0, this.width, this.height);
  
        // Generate other map elements
        this.generateObjects();
  
        // Assign the canvas as the map's image
        this.image = canvas;
      };
  
       // Generate NPCs
      this.generateNPCs();
  
  
      // Set the src after onload to ensure that the onload event is triggered
      this.image.src = "http://127.0.0.1:5501/textures/background7.svg";
    }
      
  
    generateObjects() {
      // Generate buildings
      this.generateBuildings();
  
      // Generate walls
      this.generateWalls();
  
      // Generate trees
      this.generateTrees();
  
      // Generate chests with random coin values
      this.generateChests();
  }
  
  generateBuildings() {
      // Example buildings placed in a structured pattern
      this.objects.push(new Building(500, 500, 150, 150)); // Example building
      this.objects.push(new Building(1000, 1000, 100, 100)); // Example building
      this.objects.push(new Building(1500, 1500, 120, 120)); // Example building
      this.objects.push(new Building(2500, 2500, 180, 180)); // Example building
      this.objects.push(new Building(2000, 3000, 130, 130)); // Example building
      this.objects.push(new Building(3000, 2000, 170, 170)); // Example building
      this.objects.push(new Building(3500, 3500, 190, 190)); // Example building
      this.objects.push(new Building(100, 3500, 140, 140));  // Example building
      // Add more buildings as needed
  }
  
  generateWalls() {
    // Function to add square segments for a given wall
    const addWallSquares = (x, y, width, height) => {
        const segmentSize = 50; // Size of each square segment
        const segmentsX = Math.ceil(width / segmentSize);
        const segmentsY = Math.ceil(height / segmentSize);

        for (let i = 0; i < segmentsX; i++) {
            for (let j = 0; j < segmentsY; j++) {
                this.objects.push(new Wall(
                    x + i * segmentSize, 
                    y + j * segmentSize, 
                    segmentSize, 
                    segmentSize
                ));
            }
        }
    };

    // Example walls placed to create barriers and paths
    addWallSquares(425, 425, 50, 50); // Example single square wall
    addWallSquares(475, 425, 50, 50); // Example single square wall
    addWallSquares(375, 500, 50, 200); // Example wall with openings
    addWallSquares(675, 500, 50, 200); // Example wall with openings
    addWallSquares(350, 600, 300, 50); // Example bottom wall with large opening
    addWallSquares(900, 950, 50, 200); // Example tall wall with an opening
    addWallSquares(1500, 1600, 100, 400); // Example long wall
    addWallSquares(2000, 2300, 100, 100); // Example small wall
    addWallSquares(2800, 100, 300, 50); // Example horizontal wall
    addWallSquares(3200, 800, 50, 300); // Example vertical wall
    // Add more walls as needed
}

  
  generateTrees() {
      // Example trees placed in natural clusters
      this.objects.push(new Tree(800, 800, 50, 50)); // Example tree
      this.objects.push(new Tree(1200, 1200, 50, 50)); // Example tree
      this.objects.push(new Tree(1800, 1800, 70, 70)); // Example tree
      this.objects.push(new Tree(3000, 3000, 60, 60)); // Example tree
      this.objects.push(new Tree(2500, 1000, 200, 200)); // Example tree
      this.objects.push(new Tree(100, 1500, 60, 60)); // Example tree
      this.objects.push(new Tree(400, 1700, 70, 70)); // Example tree
      this.objects.push(new Tree(700, 2500, 90, 90)); // Example tree
      this.objects.push(new Tree(3100, 1300, 50, 50)); // Example tree
      this.objects.push(new Tree(3900, 500, 50, 50)); // Example tree
      // Add more trees as needed
  }
  
  
  
  generateChests() {
      // Randomly generate chests with varying coin values
      const numChests = Math.floor(Math.random() * 5) + 4; // Random number of chests between 4 and 8
      let totalCoinValue = 1000; // Total coin value to distribute
  
      for (let i = 0; i < numChests; i++) {
          const x = Math.floor(Math.random() * (this.width - 200)) + 100; // Random x position within map bounds
          const y = Math.floor(Math.random() * (this.height - 200)) + 100; // Random y position within map bounds
          const chest = new Chest(x, y, 50, 40); // Chest size and position
          const coinValue = Math.floor(Math.random() * (totalCoinValue / 2)) + 1; // Random coin value for each chest
          chest.addItem(new Coin(x, y, 20, 20, coinValue));
          this.objects.push(chest);
          totalCoinValue -= coinValue; // Deduct coin value from total
      }
  }

  generateNPCs() {
    for (let i = 0; i < this.currentStage.npcCount; i++) {
        let npc, isColliding;
        do {
            let xx, yy;
            if (this.player) {
                xx = this.player.x + (Math.random() * 3000 - 1500); // Random position within 1500px around the player
                yy = this.player.y + (Math.random() * 3000 - 1500);
            } else {
                xx = Math.random() * this.width; // Random position within map width
                yy = Math.random() * this.height; // Random position within map height
            }

            npc = new NPC(xx, yy, this.currentStage.npcSize, this.currentStage.npcSize, this.currentStage.npcHealth, this.currentStage.npcSpeed, this.currentStage.npcDamage, 50, this.currentStage.npcTexture, 100);
            isColliding = this.objects.some(obj => npc.collide(obj));

        } while (isColliding);

        this.objects.push(npc);
        this.spawnedNPCs.push(npc);
    }
}


  
  
//   generateNPCs() {
//     for (let i = 0; i < this.currentStage.npcCount; i++) {
//         let xx, yy;

//         if (this.player) {
//             xx = this.player.x + (Math.random() * 3000 - 1500); // Random position within 1500px around the player
//             yy = this.player.y + (Math.random() * 3000 - 1500);
//         } else {
//             xx = Math.random() * this.width; // Random position within map width
//             yy = Math.random() * this.height; // Random position within map height
//         }

//         const npc = new NPC(xx, yy, this.currentStage.npcSize, this.currentStage.npcSize, this.currentStage.npcHealth, this.currentStage.npcSpeed, this.currentStage.npcDamage, 50, this.currentStage.npcTexture, 100);
//         this.objects.push(npc);
//         this.spawnedNPCs.push(npc);
//     }
// }


        


  areNPCsDefeated() {
  return this.spawnedNPCs.length < (this.currentStage.npcCount * 0.2)
  }


  // Method to progress to the next stage
  progressToNextStage() {
    if (this.currentStageIndex < this.stages.length - 1) {
        this.currentStageIndex++;
        this.currentStage = this.stages[this.currentStageIndex];
        this.generateNPCs(); // Regenerate NPCs for the new stage
    } else {
        Game.win = true;
        Game.audioManager.playSound('winSound')
        Game.endGame()
    }
}
  
 


  addObject(object){
    this.objects.push(object)
  }

  removeObject(object) {
    const index = this.objects.indexOf(object);
    if (index > -1) {
        this.objects.splice(index, 1);
        if (object instanceof NPC){
          this.spawnedNPCs.splice(this.spawnedNPCs.indexOf(object),1)
        }
        // console.log(`Object removed: ${object.constructor.name}`);
    } else {
        // console.log("Object not found in map.");
    }
}
  
  draw(context, xView, yView) {
    context.drawImage(this.image, xView, yView, Math.min(this.width, context.canvas.width), Math.min(this.height, context.canvas.height), 0, 0, Math.min(this.width, context.canvas.width), Math.min(this.height, context.canvas.height));
  
    // Draw objects on the map
    this.objects.forEach(object => {
      object.draw(context, xView, yView);
      });
  }
  }