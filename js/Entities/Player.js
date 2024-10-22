import GameObject from 'http://127.0.0.1:5501/js/Objects/GameObject.js';
import Weapon from 'http://127.0.0.1:5501/js/Objects/Weapon.js';
import Item from 'http://127.0.0.1:5501/js/Objects/Item.js';
import NPC from 'http://127.0.0.1:5501/js/Entities/NPC.js';
import DestructibleObject from 'http://127.0.0.1:5501/js/Objects/DestructibleObject.js';
import EXP from 'http://127.0.0.1:5501/js/Objects/EXP.js';
import Game from 'http://127.0.0.1:5501/js/Game/Game.js';
import { room } from 'http://127.0.0.1:5501/js/main.js';
import Coin from 'http://127.0.0.1:5501/js/Objects/Coin.js';
import Projectile from 'http://127.0.0.1:5501/js/Objects/Projectile.js';

export default class Player {
    constructor(x, y, map) {
        this.map = map;
        this.x = x;
        this.y = y;
        this.cursorX = x;
        this.width = 50;
        this.height = 50;
        this.health = 100;
        this.maxHealth = 100;
        this.speed = 200;
        this.followingCursor = false;
        this.svgImage = new Image();
        this.svgImage.src = "http://127.0.0.1:5501/textures/player.svg";
        this.weapon = new Weapon(this.x,this.y, 50,50 ,"Fist", 10, "melee", 100, "http://127.0.0.1:5501/textures/fist.svg", 500);
        this.inventory = []
        this.inventory.push(this.weapon)
        this.facingDirection = "right";
        this.exp = 0;
        this.level = 0;
        this.coins = 0;
        this.upgrades = {
            maxHealth: 1,
            speed: 1,
            attackSpeed: 1,
            damage: 1
        };
        this.upgradePrices = {
            maxHealth: [100, 200, 300, 400, 500],
            speed: [100, 200, 300, 400, 500],
            attackSpeed: [100, 200, 300, 400, 500],
            damage: [100, 200, 300, 400, 500]
        };
        this.exp = 0;
        this.nextLevelExp = 100; 
        this.weaponLevels = {
            'Knife': 0,
            'Shuriken': 0
        };



        this.knifeCooldown = 1000; // Initial cooldown in milliseconds
        this.knifeCooldownReductionPerLevel = 50; // Reduction in cooldown per level

        this.knifeCooldownTimer = 0; // Timer to track cooldown
        this.throwKnifeOnCooldown = false;


        this.shuriken = []
        this.shurikenCount = 0;
        this.shurikenRotationSpeed = Math.PI / 2; // Initial rotation speed in radians per second
        this.shurikenRadius = 100; // Radius from the player for shuriken rotation
        this.shurikenAngles = []; // Array to store initial angles for each shuriken
    }

    

    receiveDamage(damage) {
        this.health -= damage;
        if (this.health <= 0) {
            this.health = 0;
            this.onDeath();
        }
    }

    onDeath() {
        this.coins += Game.coinsCollected
        Game.audioManager.playSound('deadSound');
        Game.endGame()
    }


    upgrade(upgradeType){
        if (this.coins >= this.upgradePrices[upgradeType][this.upgrades[upgradeType] - 1] && this.upgrades[upgradeType] < 5) {
            this.coins = this.coins - this.upgradePrices[upgradeType][this.upgrades[upgradeType] - 1];
            this.upgrades[upgradeType]++
            this.updateValues(upgradeType)
        }
    }

    // Function to update player values based on upgrades
    updateValues(upgradeType) {
        switch (upgradeType) {
            case 'maxHealth':
                this.maxHealth += this.upgrades.maxHealth * 100;
                break;
            case 'speed':
                this.speed += this.upgrades.speed * 10;
                break;
            case 'attackSpeed':
                this.attackSpeed -= this.upgrades.attackSpeed * 100;
                break;
            case 'damage':
                this.damage += this.upgrades.damage * 5;
                break;
            default:
                console.error(`Unknown upgrade type: ${upgradeType}`);
                return;
        }
    
        // console.log("Player values updated:", this);
        Game.saveGameState();
    }
    


    attack(mouseX, mouseY) {
        if (!this.weapon || !this.weapon.canAttack()) return;

        const dx = mouseX - this.x;
        const dy = mouseY - this.y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        this.facingDirection = dx >= 0 ? "right" : "left";
        this.weapon.startAttack();

        if (this.weapon.type === 'melee') {
            this.performMeleeAttack(dx, dy, distance);
        } else if (this.weapon.type === 'ranged') {
            this.performRangedAttack(dx, dy);
        }
    }

    performMeleeAttack(dx, dy, distance) {
        const attackRange = this.weapon.range;
        room.map.objects.forEach(object => {
            if ((object instanceof NPC || object instanceof DestructibleObject) &&
                // this.isInAttackRange(object, attackRange)) {
                    this.weapon.collide(object)) {
                object.receiveDamage(this.weapon.damage);
                // console.log(`Dealt ${this.weapon.damage} damage to ${object.constructor.name}`);
            }
        });
    }

    performRangedAttack(dx, dy) {
        const directionX = dx / Math.sqrt(dx * dx + dy * dy);
        const directionY = dy / Math.sqrt(dx * dx + dy * dy);
        const projectile = new Projectile(
            this.x, this.y, 50, 50, 
            this.weapon.projectileSpeed, directionX, directionY, 
            this.weapon.range, this.weapon.damage, 
            this.weapon.projectileImageUrl
        );
        Game.audioManager.playSound('shootSound')
        room.map.addObject(projectile);
}

updateKnifeCooldown(step) {
    if (this.knifeCooldownTimer > 0) {
        this.knifeCooldownTimer -= step * 1000; // Convert step to milliseconds
        if (this.knifeCooldownTimer <= 0) {
            this.throwKnifeOnCooldown = true;
        }
    }
}

throwKnife() {
    // Find the nearest NPC
    let nearestNPC = null;
    let nearestDistance = 1000;

    room.map.objects.forEach(object => {
        if (object instanceof NPC) {
            const distance = Math.sqrt((object.x - this.x) ** 2 + (object.y - this.y) ** 2);
            if (distance < nearestDistance) {
                nearestNPC = object;
                nearestDistance = distance;
            }
        }
    });

    
    // Throw a knife towards the nearest NPC
    if (nearestNPC) {
        const dx = nearestNPC.x - this.x;
        const dy = nearestNPC.y - this.y;
        const distance = Math.sqrt(dx * dx + dy * dy);

        const directionX = dx / distance;
        const directionY = dy / distance;

        const weapon = this.findWeapon("Knife")

        const knife = new Projectile(
            this.x, this.y, 20, 20,
            500, directionX, directionY,
            200, weapon.damage,
            weapon.projectileImageUrl
        );

        room.map.addObject(knife);

        // Reset cooldown timer
        this.knifeCooldownTimer = this.knifeCooldown - this.level * this.knifeCooldownReductionPerLevel;
        this.throwKnifeOnCooldown = false;
    }
}

rotateShurikens(step) {
    const shurikenAngleIncrement = this.shurikenRotationSpeed * step;

    for (let i = 0; i < this.shuriken.length; i++) {
        this.shurikenAngles[i] += shurikenAngleIncrement;

        // Ensure that each shuriken has its unique angle by adding the initial angle offset
        const angle = this.shurikenAngles[i];
        const shurikenX = this.x + this.shurikenRadius * Math.cos(angle);
        const shurikenY = this.y + this.shurikenRadius * Math.sin(angle);

        // Update shuriken position in the game world
        if (this.shuriken[i]) {
            this.shuriken[i].x = shurikenX;
            this.shuriken[i].y = shurikenY;
        }
    }
}




equipWeapon(weaponType) {
    let equippedWeapon = null; // Variable to store the equipped weapon object
    
    if (weaponType === "Shuriken" || weaponType === "Knife") {
        equippedWeapon = new Weapon(
            this.x, this.y, 80, 80, weaponType, 30, "melee", 100, 
            `http://127.0.0.1:5501/textures/${weaponType}.svg`, 400
        );
        equippedWeapon.projectileImageUrl = 'http://127.0.0.1:5501/textures/knife.svg';
        
        if (weaponType === "Knife") {
            this.handleKnifeEquipping(equippedWeapon);
        } else if (weaponType === "Shuriken") {
            this.handleShurikenEquipping(equippedWeapon);
        }

        this.updateShurikenAngles();
        return;
    }

    switch (weaponType) {
        case "sword":
            equippedWeapon = this.handleWeaponEquipping(weaponType, 80, 80, 30, "melee", 100, "sword.svg", 400);
            break;
        case "bow":
            equippedWeapon = this.handleWeaponEquipping(weaponType, 50, 50, 100, "ranged", 1000, "bow.svg", 500);
            break;
        default:
            this.weapon = new Weapon(this.x, this.y, 50, 50, "Fist", 10, "melee", 100, "http://127.0.0.1:5501/textures/fist.svg", 500);
            break;
    }

    if (equippedWeapon) {
        this.weapon = equippedWeapon;
        $("#equippedWeaponImage").attr("src", this.weapon.svgImage.src);
    }
}

handleKnifeEquipping(knifeWeapon) {
    if (!this.hasWeapon("Knife")) {
        this.inventory.push(knifeWeapon);
        this.throwKnife();
        this.weaponLevels["Knife"]++
    } else if (this.weaponLevels["Knife"] < 6) {
        this.weaponLevels["Knife"]++;
    }
}

handleShurikenEquipping(shurikenWeapon) {
    if (!this.hasWeapon("Shuriken")) {
        this.shurikenCount = this.weaponLevels["Shuriken"] + 1;
        this.weaponLevels["Shuriken"]++;
        this.shuriken.push(shurikenWeapon);
        this.inventory.push(shurikenWeapon);
    } else if (this.weaponLevels["Shuriken"] < 6) {
        this.shurikenCount = this.weaponLevels["Shuriken"] + 1;
        this.weaponLevels["Shuriken"]++;
        this.shuriken.push(shurikenWeapon);
    }
}

updateShurikenAngles() {
    this.shurikenAngles = [];
    for (let i = 0; i < this.shuriken.length; i++) {
        this.shurikenAngles.push(i * (2 * Math.PI / this.shurikenCount));
    }
}

handleWeaponEquipping(weaponType, width, height, damage, attackType, range, texture, cooldown) {
    if (this.hasWeapon(weaponType)) {
        return this.findWeapon(weaponType);
    } else {
        const newWeapon = new Weapon(this.x, this.y, width, height, weaponType, damage, attackType, range, `http://127.0.0.1:5501/textures/${texture}`, cooldown);
        this.inventory.push(newWeapon);
        return newWeapon;
    }
}


resetWeapons() {
    // Reset the Shuriken
    this.level = 0;
    this.exp = 0;
    this.shuriken = [];
    this.shurikenAngles = [];
    this.shurikenCount = 0;
    this.weaponLevels['Shuriken'] = 0;
    this.nextLevelExp = 100; 

    // Reset the Knife
    this.weaponLevels['Knife'] = 0;

    // Remove Shuriken and Knife from inventory
    this.inventory = this.inventory.filter(weapon => weapon.name !== 'Shuriken' && weapon.name !== 'Knife');

}

resetPosition(){
    this.x = 2000
    this.y = 2000
}

    

    hasWeapon(weaponType) {
        return this.inventory.some(weapon => weapon.name === weaponType);
    }
    

    findWeapon(weaponType) {
        return this.inventory.find(weapon => weapon.name === weaponType);
    }
    

    isInAttackRange(target, attackRange) {
        const dx = target.x - this.x;
        const dy = target.y - this.y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        return distance <= attackRange;
    }

    followCursor(x, y) {
        this.cursorX = x;
        this.cursorY = y;
        this.followingCursor = true;
    }

    stopFollowingCursor() {
        this.followingCursor = false;
    }

    update(step, worldWidth, worldHeight, map) {
        this.move(step,map)
        this.updateFacingDirection();
        this.weapon.update();
        this.constrainToWorldBounds(worldWidth, worldHeight);
        // Check if knife can be thrown
        if (this.throwKnifeOnCooldown && this.hasWeapon('Knife')) {
            this.throwKnife();
        }
        this.updateKnifeCooldown(step)
        if (!(this.shuriken.length == 0)) {
            this.rotateShurikens(step);
        }
        for (let i = 0; i < this.shuriken.length; i++) {
            room.map.objects.forEach(object => {
                if ((object instanceof NPC || object instanceof DestructibleObject) &&
                        this.shuriken[i].collide(object)) {
                    object.receiveDamage(this.shuriken[i].damage);
                    console.log(`Dealt ${this.shuriken[i].damage} damage to ${object.constructor.name}`);
                }
            });
        }
    

    }


    gainExperience(amount) {
        this.exp += amount;
        if (this.exp >= this.nextLevelExp) {
            this.levelUp();
        }
    }

    levelUp() {
        this.level++;
        this.exp = this.exp - this.nextLevelExp;
        this.nextLevelExp *= 1.5;
        this.health = this.maxHealth
        Game.upgrade();
    }

    move(step, map) {
        let dx = 0;
        let dy = 0;
    
        if (Game.controls.left) {
            dx -= this.speed * step;
        }
        if (Game.controls.right) {
            dx += this.speed * step;
        }
        if (Game.controls.up) {
            dy -= this.speed * step;
        }
        if (Game.controls.down) {
            dy += this.speed * step;
        }
    
        // Normalize direction vector
        const distance = Math.sqrt(dx * dx + dy * dy);
        if (distance !== 0) {
            dx /= distance;
            dy /= distance;
        }
    
        let newX = this.x + dx * this.speed * step;
        let newY = this.y + dy * this.speed * step;
    
        const collidedObjects = this.getCollidedObjects(newX, newY, map);
    
        let collisionX = false;
        let collisionY = false;
    
        collidedObjects.forEach(object => {
            if (object instanceof NPC || object instanceof Projectile) {
                return;
            }
            if (object instanceof Coin) {
                Game.coinsCollected +=  object.coinValue
                console.log("COin value "+object.coinValue)
                map.removeObject(object);
            }
            if (object instanceof EXP) {
                // Collect EXP and level up
                this.exp += object.expValue;
                map.removeObject(object);
                // console.log(`Collected ${object.expValue} EXP`);
                this.gainExperience(object.expValue)
            }
            if (this.checkCollision(this.x, newY, map)) {
                collisionY = true;
            }
            if (this.checkCollision(newX, this.y, map)) {
                collisionX = true;
            }
        });
    
        if (collisionX && collisionY) {
            newX = this.x;
            newY = this.y;
        } else if (collisionX) {
            newX = this.x;
        } else if (collisionY) {
            newY = this.y;
        }
    
        this.x = newX;
        this.y = newY;
        this.weapon.changeXY(newX, newY,this)
    }

    updateFacingDirection() {
        const dx = this.cursorX - this.x;
        this.facingDirection = dx >= 0 ? "right" : "left";
    }

    

    constrainToWorldBounds(worldWidth, worldHeight) {
        this.x = Math.max(this.width / 2, Math.min(this.x, worldWidth - this.width / 2));
        this.y = Math.max(this.height / 2, Math.min(this.y, worldHeight - this.height / 2));
    }

    checkCollision(x, y, map) {
        const collidedObjects = this.getCollidedObjects(x, y, map);
        return collidedObjects.length > 0;
    }

    getCollidedObjects(x, y, map) {
        const playerObject = new GameObject(x, y, this.width, this.height);
        return map.objects.filter(object => playerObject.collide(object));
    }

    getWeapon() {
        return this.weapon;
    }

    draw(context, xView, yView) {
        context.save();
    
        // Flip horizontally if facing left
        // if (this.facingDirection === "left") {
        //     context.scale(-1, 1); // Flip the context horizontally
        // }
    
        // Draw the player image
        if (this.facingDirection === "right") {
            context.drawImage(this.svgImage, this.x - this.width / 2 - xView, this.y  - this.height / 2 - yView, this.width, this.height);
            // context.drawImage(this.svgImage, weaponX + weaponOffsetX - playerWidth / 2 - xView, weaponY + weaponOffsetY - playerHeight / 2 - yView, playerWidth, playerHeight);
        } else {
            // Flip the image for left direction
            context.scale(-1, 1);
            context.drawImage(this.svgImage, -(this.x + this.width / 2 - xView), this.y  - this.height / 2 - yView, this.width, this.height);
            // context.drawImage(this.svgImage, -(weaponX - weaponOffsetX + playerWidth / 2 - xView), weaponY + weaponOffsetY - playerHeight / 2 - yView, playerWidth, playerHeight);
            context.scale(-1, 1);
        }


        // context.drawImage(this.svgImage, (this.facingDirection === "left" ? -1 : 1) * (this.x - this.width / 2 - xView), this.y - this.height / 2 - yView, this.width, this.height);
    
        
    
        if (this.weapon.isAttacking) {
            // Draw the weapon
            this.weapon.draw(context, xView, yView, this.x, this.y, this.width, this.height, this.facingDirection);
        }

    // Draw Shuriken
    if(this.shuriken){
        for (let i = 0; i < this.shuriken.length; i++) 
        this.shuriken[i].draw(context, xView, yView, this.x, this.y, this.width, this.height, this.facingDirection);
    }
    
    // Draw health bar
    const healthPercentage = this.health / this.maxHealth;
    const healthBarWidth = this.width * healthPercentage;

    // Calculate health bar color
    const red = Math.floor((1 - healthPercentage) * 255);
    const green = Math.floor(healthPercentage * 255);
    const healthBarColor = `rgb(${red},${green},0)`;

    context.fillStyle = healthBarColor;
    context.fillRect(this.x - this.width / 2 - xView, this.y - this.height / 2 - yView - 10, healthBarWidth, 5);
    context.restore();    
}
    
    
}
