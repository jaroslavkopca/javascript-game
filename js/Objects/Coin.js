import GameObject from 'http://127.0.0.1:5501/js/Objects/GameObject.js';

export default class Coin extends GameObject {
    constructor(x, y, width, height, coinValue) {
        super(x, y, width, height);
        this.coinValue = coinValue;
        this.svgImage = new Image();
        this.svgImage.src = "http://127.0.0.1:5501/textures/coin.svg";
    }

    draw(context, xView, yView) {
        context.save();
        context.drawImage(this.svgImage, this.x - this.width / 2 - xView, this.y - this.height / 2 - yView, this.width, this.height);
        context.restore();
    }
}
