import 'phaser';

let game;
let gameOptions = {
    slices: 8,
    slicePrizes: ["A KEY!!!", "50 STARS", "500 STARS", "BAD LUCK!!!", "200 STARS", "100 STARS", "150 STARS", "BAD LUCK!!!"],
    rotationTime: 3000
};
window.onload = function() {

    let gameConfig = {
        type: Phaser.CANVAS,
        width: 550,
        height: 550,
        backgroundColor: 0x880044,
        scene: [playGame]
    };
    game = new Phaser.Game(gameConfig);
    window.focus();
    resize();
    window.addEventListener("resize", resize, false);
};

class playGame extends Phaser.Scene{
    constructor(){
        super("PlayGame");
    }
    preload(){
        this.load.image("wheel", "../assets/wheel.png");
        this.load.image("pin", "../assets/pin.png");
    }
    create(){
        this.wheel = this.add.sprite(game.config.width / 2, game.config.height / 2, "wheel");
        this.pin = this.add.sprite(game.config.width / 2, game.config.height / 2, "pin");
        this.prizeText = this.add.text(game.config.width / 2, game.config.height - 20, "Spin the wheel", {
            font: "bold 32px Arial",
            align: "center",
            color: "white"
        });
        this.prizeText.setOrigin(0.5);
        this.canSpin = true;
        this.input.on("pointerdown", this.spinWheel, this);
    }
    spinWheel(){
        if(this.canSpin){
            this.prizeText.setText("");
            let rounds = Phaser.Math.Between(2, 4);
            let degrees = Phaser.Math.Between(0, 360);
            let prize = gameOptions.slices - 1 - Math.floor(degrees / (360 / gameOptions.slices));
            this.canSpin = false;
            this.tweens.add({
                  targets: [this.wheel],
                angle: 360 * rounds + degrees,
                duration: gameOptions.rotationTime,
                ease: "Cubic.easeOut",
                callbackScope: this,
                onComplete: function(tween){
                    this.prizeText.setText(gameOptions.slicePrizes[prize]);
                    this.canSpin = true;
                }
            });
        }
    }
}

// pure javascript to scale the game
function resize() {
    let canvas = document.querySelector("canvas");
    let windowWidth = window.innerWidth;
    let windowHeight = window.innerHeight;
    let windowRatio = windowWidth / windowHeight;
    let gameRatio = game.config.width / game.config.height;
    if(windowRatio < gameRatio){
        canvas.style.width = windowWidth + "px";
        canvas.style.height = (windowWidth / gameRatio) + "px";
    }
    else{
        canvas.style.width = (windowHeight * gameRatio) + "px";
        canvas.style.height = windowHeight + "px";
    }
}