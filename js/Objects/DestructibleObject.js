import GameObject from 'http://127.0.0.1:5501/js/Objects/GameObject.js';

export default class DestructibleObject extends GameObject {
    constructor(x, y, width, height, health) {
        super(x, y, width, height);
        this.health = health;
    }
  
    receiveDamage(damage) {
        this.health -= damage;
        if (this.health <= 0) {
            this.health = 0; // Ensure health doesn't go negative
            this.onDestruction(); // Call method for when object is destroyed
        }
    }
  
    onDestruction() {
        // Example: Play destruction animation, remove from map, etc.
        console.log("Object destroyed!");
    }
  
    draw(context, xView, yView) {
        // Draw object (for simplicity, fill with a basic color)
        const x = this.x - this.width / 2 - xView;
        const y = this.y - this.height / 2 - yView;
        context.fillStyle = "gray";
        context.fillRect(x, y, this.width, this.height);
  
        // Draw health bar
        const healthBarWidth = this.width * (this.health / 100); // Assuming max health is 100
        context.fillStyle = "green";
        context.fillRect(x, y - 10, healthBarWidth, 5);
    }
  }