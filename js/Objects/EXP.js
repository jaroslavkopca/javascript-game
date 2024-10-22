import GameObject from 'http://127.0.0.1:5501/js/Objects/GameObject.js';

export default class EXP extends GameObject {
    constructor(x, y, width, height, expValue) {
        super(x, y, width, height);
        this.expValue = expValue;
        this.svgImage = new Image();
        this.svgImage.src = "http://127.0.0.1:5501/textures/exp.svg";
    }

    draw(context, xView, yView) {
        // Draw EXP (using SVG image)
        context.save();
        context.drawImage(this.svgImage, this.x - this.width / 2 - xView, this.y - this.height / 2 - yView, this.width, this.height);
        context.restore();
    }
}
