import * as PIXI from 'pixi.js'
window.PIXI = PIXI;
import Game from "./Game";


const config = {
    width: window.innerWidth,
    height: window.innerHeight,
    autoStart: true,
    sharedTicker: true,
    sharedLoader: false,
    backgroundAlpha: 0,
    antialias: true,
    resizeTo: window
};

const game = new Game(config);

