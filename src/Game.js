import CardController from "./CardShuffle/CardShuffleController";
class CardsGame{
    constructor(props) {
        this.app = new PIXI.Application(props);
        let divElem = document.getElementById("content");
        divElem.appendChild(this.app.view);
        this.loader = new PIXI.Loader();
        this.resources = {};
        this.startGameProcess();
        this.resize();
        window.onresize = this.resize.bind(this);
    }

    /**
     * Start the game process
     * initializing main container and starting our loading of assets
     */
    async startGameProcess(){
        this.mainContainer = new PIXI.Container();
        this.app.stage.addChild(this.mainContainer);
        this.shuffleContainer = new PIXI.Container();
        this.mainContainer.addChild(this.shuffleContainer);
        this.addToLoader();
        await this.loadFiles();

        this.cardControl = new CardController(this.shuffleContainer,this.resources);//initializing cards for shuffle
        let vidElem = document.getElementById("backgroundVideo");
        vidElem.play();
    }


    addToLoader(){
        this.loader.add('cards','./Assets/Cards.json');
        this.loader.add('Shuffle','./Assets/Shuffle.png');
    }

    /**
     * @returns the promise which tells us that our assets are loaded
     */
    async loadFiles(){
        return new Promise((resolve,reject)=>{
            this.loader.load((load,resources)=>{
                this.resources = resources;
                resolve();
            });
        })
        
    }

    
    /**
     * resize according to view
     */
    resize(){
        let scaleMin = Math.min(window.innerWidth / 1280, window.innerHeight / 720);
        this.mainContainer.pivot.set(640, 360);
        this.mainContainer.x = (window.innerWidth) / 2;
        this.mainContainer.y = (window.innerHeight) / 2;
        this.mainContainer.scale.set(scaleMin);
        this.cardControl && (this.cardControl.resize());
    }
}

export default CardsGame;