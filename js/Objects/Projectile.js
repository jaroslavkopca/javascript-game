// Projectile.js
import GameObject from 'http://127.0.0.1:5501/js/Objects/GameObject.js';
import NPC from 'http://127.0.0.1:5501/js/Entities/NPC.js';
import DestructibleObject from 'http://127.0.0.1:5501/js/Objects/DestructibleObject.js';
import Building from 'http://127.0.0.1:5501/js/Objects/Building.js';
import Tree from 'http://127.0.0.1:5501/js/Objects/Tree.js';
import Wall from 'http://127.0.0.1:5501/js/Objects/Wall.js';

export default class Projectile extends GameObject {
    constructor(x, y, width, height, speed, directionX, directionY, range, damage, imageUrl) {
        super(x, y, width, height);
        this.speed = speed;
        this.directionX = directionX;
        this.directionY = directionY;
        this.range = range;
        this.damage = damage;
        this.travelledDistance = 0;
        this.image = new Image();
        this.image.src = imageUrl;
    }

    update(step, map) {
        const dx = this.directionX * this.speed * step;
        const dy = this.directionY * this.speed * step;
        this.x += dx;
        this.y += dy;
        this.travelledDistance += Math.sqrt(dx * dx + dy * dy);

        // Check for collisions
        map.objects.forEach(object => {
            if ((object instanceof NPC || object instanceof DestructibleObject) && this.collide(object)) {
                object.receiveDamage(this.damage);
                this.destroy(map);
            } else if((object instanceof Wall || object instanceof Building ||object instanceof Tree) && this.collide(object)){
                this.destroy(map);
            }
        });

        // Remove projectile if it has travelled its range
        if (this.travelledDistance >= this.range) {
            this.destroy(map);
        }
    }

    destroy(map) {
        map.removeObject(this);
    }

    draw(context, xView, yView) {
        context.save();

        // Translate context to the projectile's position
        context.translate(this.x - xView, this.y - yView);

        // Calculate the rotation angle
        const angle = Math.atan2(this.directionY, this.directionX) + 45;
        
        // Rotate the context
        context.rotate(angle);

        // Draw the image, centered at the translated position
        context.drawImage(this.image, -this.width / 2, -this.height / 2, this.width, this.height);

        // Restore the context to its original state
        context.restore();
    }
}
