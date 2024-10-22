import DestructibleObject from 'http://127.0.0.1:5501/js/Objects/DestructibleObject.js';
import { room } from 'http://127.0.0.1:5501/js/main.js';
import Coin from 'http://127.0.0.1:5501/js/Objects/Coin.js';

export default class Chest extends DestructibleObject {
    constructor(x, y, width, height) {
        super(x, y, width, height);
        this.items = []; // Array to hold items in the chest
        this.svgImage = new Image();
        this.svgImage.src = "http://127.0.0.1:5501/textures/chest.svg";
        this.health = 100;
    }
  
    addItem(item) {
        this.items.push(item);
    }

    receiveDamage(damage) {
        this.health -= damage;
        if (this.health <= 0) {
            this.health = 0;
            this.onDeath();
        }
    }

    onDeath() {
        room.map.removeObject(this);
        console.log("Chest destroyed!");
        // Drop EXP upon death
        const coin = this.items[0]// Example EXP object
        room.map.addObject(coin);
    }
  
    open() {
        // Simulate opening the chest (e.g., play animation, etc.)
        // For now, just log the items contained
        console.log("Opening chest:");
        this.items.forEach(item => {
            console.log(item.name);
        });
    }
  
    draw(context, xView, yView) {
        // Draw the chest
        const x = this.x - this.width / 2 - xView;
        const y = this.y - this.height / 2 - yView;
        context.drawImage(this.svgImage,x, y, this.width, this.height);
    }
  }