import Rectangle from './Rectangle.js';

export default class Camera {
    static AXIS = {
      NONE: 1,
      HORIZONTAL: 2,
      VERTICAL: 3,
      BOTH: 4
    };
  
    constructor(
      xView = 0,
      yView = 0,
      viewportWidth,
      viewportHeight,
      worldWidth,
      worldHeight
    ) {
      this.zoomLevel =2; // Initial zoom level
      this.xView = xView;
      this.yView = yView;
      this.xDeadZone = 0;
      this.yDeadZone = 0;
      this.wView = viewportWidth;
      this.hView = viewportHeight;
      this.axis = Camera.AXIS.BOTH;
      this.followed = null;
      this.viewportRect = new Rectangle(this.xView, this.yView, this.wView, this.hView);
      this.worldRect = new Rectangle(0, 0, worldWidth, worldHeight);
    }
  
    follow(gameObject, xDeadZone, yDeadZone) {
      this.followed = gameObject;
      this.xDeadZone = xDeadZone;
      this.yDeadZone = yDeadZone;
    }


    changeViewport(x,y){
      this.wView = x
      this.hView = y
      // this.viewportRect = new Rectangle(this.xView, this.yView, this.wView, this.hView);
    }
  
  
  
    update() {
      if (this.followed) {
          // Calculate the new viewport position based on the followed object
          let newXView = this.followed.x - this.wView  / 2;
          let newYView = this.followed.y - this.hView / 2;
  
          // Adjust newXView and newYView if they exceed map boundaries
          newXView = Math.max(0, Math.min(newXView, this.worldRect.width - this.wView));
          newYView = Math.max(0, Math.min(newYView, this.worldRect.height - this.hView));
  
          // Set the new viewport position
          this.xView = newXView;
          this.yView = newYView;
      }
  
      // Update the viewport rectangle
      this.viewportRect.set(this.xView, this.yView,this.wView, this.hView);
  }
    
  }