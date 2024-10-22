import GameObject from 'http://127.0.0.1:5501/js/Objects/GameObject.js';
import { room } from 'http://127.0.0.1:5501/js/main.js';
import NPC from 'http://127.0.0.1:5501/js/Entities/NPC.js';
import DestructibleObject from 'http://127.0.0.1:5501/js/Objects/DestructibleObject.js';


export default class Weapon extends GameObject {
    constructor(x, y , width, height, name, damage, type, range, src, baseAttackDuration, projectileSpeed, projectileImageUrl) {
        super(x, y, width, height);
        this.name = name;
        this.damage = damage;
        this.type = type;
        this.range = range;
        this.svgImage = new Image();
        this.svgImage.src = src;
        this.baseAttackDuration = baseAttackDuration; // Base duration of the attack animation in milliseconds
        this.attackDuration = baseAttackDuration; // Actual attack duration considering player's attack speed
        this.isAttacking = false;
        this.attackTimer = 0;
        this.projectileSpeed = projectileSpeed || 300; // Default projectile speed
        this.projectileImageUrl = projectileImageUrl || "http://127.0.0.1:5501/textures/arrow.svg";
    }

    startAttack() {
        this.isAttacking = true;
        this.attackTimer = Date.now();
    }

    update() {
        if (this.isAttacking && Date.now() - this.attackTimer > this.attackDuration) {
            this.isAttacking = false;
        }
    }

    canAttack() {
        return !this.isAttacking;
    }

    updateAttackDuration(attackSpeedMultiplier) {
        this.attackDuration = this.baseAttackDuration * attackSpeedMultiplier;
    }

    changeXY(x,y, player){
        if (player.facingDirection == "right"){
            this.x = x + player.width*0.7
            this.y = y - player.height*0.2
        }else{
            this.x = x - player.width*0.7
            this.y = y - player.height*0.2
        }
    }

    draw(context, xView, yView, playerX, playerY, playerWidth, playerHeight, facingDirection) {
        if (!this.isAttacking && !this.name == "Shuriken") return;
        context.save();

        let weaponX = this.x;
        let weaponY = this.y;
        const weaponOffsetX = 0; // Offset for the weapon position (adjust as needed)
        const weaponOffsetY = 0; // Offset for the weapon position (adjust as needed)

        if (facingDirection === "right") {
            context.drawImage(this.svgImage, weaponX + weaponOffsetX - playerWidth / 2 - xView, weaponY + weaponOffsetY - playerHeight / 2 - yView, playerWidth, playerHeight);
        } else {
            // Flip the image for left direction
            context.scale(-1, 1);
            context.drawImage(this.svgImage, -(weaponX - weaponOffsetX + playerWidth / 2 - xView), weaponY + weaponOffsetY - playerHeight / 2 - yView, playerWidth, playerHeight);
            context.scale(-1, 1);
        }

        context.restore();
    }
}
