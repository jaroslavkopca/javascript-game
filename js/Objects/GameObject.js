export default class GameObject {
    constructor(x, y, width, height) {
      this.x = x;
      this.y = y;
      this.width = width;
      this.height = height;
    }
  
    // Method to check collision with another object
    collide(otherObject) {
        const thisLeft = this.x - this.width / 2;
        const thisRight = this.x + this.width / 2;
        const thisTop = this.y - this.height / 2;
        const thisBottom = this.y + this.height / 2;
    
        const otherLeft = otherObject.x - otherObject.width / 2;
        const otherRight = otherObject.x + otherObject.width / 2;
        const otherTop = otherObject.y - otherObject.height / 2;
        const otherBottom = otherObject.y + otherObject.height / 2;
    
        return (
            thisLeft < otherRight &&
            thisRight > otherLeft &&
            thisTop < otherBottom &&
            thisBottom > otherTop &&
            this != otherObject
        );
    }
    
  }