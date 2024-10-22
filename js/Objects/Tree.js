import GameObject from 'http://127.0.0.1:5501/js/Objects/GameObject.js';

export default class Tree extends GameObject {
    constructor(x, y, width, height) {
        super(x, y, width, height);
        this.svgImage = new Image();
        this.svgImage.src = "http://127.0.0.1:5501/textures/tree.svg";
    }
  
    draw(context, xView, yView) {
        const x = this.x - this.width / 2 - xView;
        const y = this.y - this.height / 2 - yView;
        context.drawImage(this.svgImage,x, y, this.width, this.height);
    }
  }