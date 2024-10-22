import GameObject from 'http://127.0.0.1:5501/js/Objects/GameObject.js';
import { room } from 'http://127.0.0.1:5501/js/main.js';
import Weapon from 'http://127.0.0.1:5501/js/Objects/Weapon.js';
import Game from 'http://127.0.0.1:5501/js/Game/Game.js';
import Coin from 'http://127.0.0.1:5501/js/Objects/Coin.js';
import EXP from 'http://127.0.0.1:5501/js/Objects/EXP.js';
import DestructibleObject from 'http://127.0.0.1:5501/js/Objects/DestructibleObject.js';

export default class NPC extends GameObject {
    constructor(x, y, width, height, health, speed, attackDamage, attackRange, npcTexture, attackCooldown) {
        super(x, y, width, height);
        this.health = health;
        this.maxHealth = health;
        this.speed = speed;
        this.attackDamage = attackDamage;
        this.attackRange = attackRange;
        this.npcTexture = npcTexture;
        this.svgImage = new Image();
        this.svgImage.src = npcTexture;
        this.weapon = new Weapon(this.x,this.y,50,50,"npc", 10 ,"melee", 50, "http://127.0.0.1:5501/textures/fist.svg", 2000)
        this.facingDirection = "right";
    }

    receiveDamage(damage) {
        this.health -= damage;
        Game.audioManager.playSound('hitSound')
        if (this.health <= 0) {
            this.health = 0;
            this.onDeath();
        }
    }

      

    onDeath() {
        room.map.removeObject(this);
        // console.log("NPC died!");
        // Drop EXP upon death
        const exp = new EXP(this.x, this.y, 20, 20, 25); // Example EXP object
        room.map.addObject(exp);
    }


    moveTowardsPlayer(player, step) {
        let map = room.map
        const dx = player.x - this.x;
        const dy = player.y - this.y;
        const distance = Math.sqrt(dx * dx + dy * dy);
    
        // If player is very close, no need to move
        if (distance < this.attackRange/4) return;
    
        const directionX = dx / distance;
        const directionY = dy / distance;
    
        // Calculate the intended position if moving directly towards the player
        const targetX = this.x + directionX * this.speed * step;
        const targetY = this.y + directionY * this.speed * step;
    
        // Check if there's any collision on the way to the target position
        if (!this.checkCollision(targetX, targetY, map)) {
            // No collision, move directly towards the player
            this.x = targetX;
            this.y = targetY;
        } else {
            // There is a collision, NPC needs to navigate around it
            const possibleMoves = [
                { x: this.x + directionX * this.speed * step, y: this.y }, // Move horizontally towards player
                { x: this.x, y: this.y + directionY * this.speed * step }, // Move vertically towards player
            ];
    
            let newPosition = { x: this.x, y: this.y };
            for (let move of possibleMoves) {
                if (!this.checkCollision(move.x, move.y, map)) {
                    newPosition = move;
                    break;
                }
            }
    
            // Update NPC position to the new valid position
            this.x = newPosition.x;
            this.y = newPosition.y;
        }
    }
    
    
    
    
    
    
    

    checkCollision(x, y, map) {
        const npcObject = new GameObject(x, y, this.width, this.height);
        const collidingObjects = map.objects.filter(object => {
            if (object instanceof Coin ||
                object instanceof DestructibleObject ||
                object instanceof EXP ||
                object instanceof NPC) {
                return false; // Exclude these types of objects from collision consideration
            }
            return npcObject.collide(object);
        });
    
        return collidingObjects.length > 0;
    }
    

    getCollidedObjects(x, y, map) {
        const npcObject = new GameObject(x, y, this.width, this.height);
        return map.objects.filter(object => npcObject.collide(object));
    }
    

    attackPlayer(player, deltaTime) {
        if (!this.weapon || !this.weapon.canAttack()) return;
 

        const dx = player.x - this.x;
        const dy = player.y - this.y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        this.facingDirection = dx >= 0 ? "right" : "left";

        if (this.weapon.type === 'melee') {
            this.performMeleeAttack(dx, dy, distance, player);
        } else if (this.weapon.type === 'ranged') {
            this.performRangedAttack(dx, dy);
        }
    }



    performMeleeAttack(dx, dy, distance, player) {
        const attackRange = this.weapon.range;
        if (this.collide(player)) {
            this.weapon.startAttack();
            player.receiveDamage(this.attackDamage);
            // console.log(`NPC dealt ${this.attackDamage} damage to Player`);
            // console.log(`Player HP ${player.health}r`)
            // console.log(this)
        }
    }

    performRangedAttack(dx, dy) {
        console.log(`Shooting projectile towards (${dx}, ${dy})`);
    }


    update(step, player, deltaTime) {
        this.moveTowardsPlayer(player, step);
        this.attackPlayer(player, deltaTime);
        this.weapon.update();
    }

    draw(context, xView, yView) {
        const x = this.x - this.width / 2 - xView;
        const y = this.y - this.height / 2 - yView;
        context.drawImage(this.svgImage, x, y, this.width, this.height);

         // Draw health bar
    const healthPercentage = this.health / this.maxHealth;
    const healthBarWidth = this.width * healthPercentage;

    // Calculate health bar color
    const red = Math.floor((1 - healthPercentage) * 255);
    const green = Math.floor(healthPercentage * 255);
    const healthBarColor = `rgb(${red},${green},0)`;

    context.fillStyle = healthBarColor;
    context.fillRect(this.x - this.width / 2 - xView, this.y - this.height / 2 - yView - 10, healthBarWidth, 5);
    }
}
