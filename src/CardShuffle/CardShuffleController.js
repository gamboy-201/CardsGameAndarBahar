import { gsap } from "gsap";
class CardShuffleController{

    /**
     * 
     * @param {*} shuffleCont : the container for card shuffles
     * @param {*} resource : the resource object
     */
    constructor(shuffleCont,resource){
        this.shuffleCont = shuffleCont;
        this.resource = resource;
        this.cards = resource.cards.spritesheet;
        this.alreadyAddedCard = [];
        this.shuffleIndex = 0;
        this.andarIndex = 0;
        this.baharIndex = 0;
        this.endGame = false;
        this.shuffleCont.position.set(-30,-150);
        this.cardGroups = ["_of_clubs","_of_diamonds","_of_hearts","_of_spades"];
        this.createBackgroundShape(0,300,500,350);
        this.createAndarBaharContainer();
        this.addTexts();
        this.addShuffleButton();
        this.resize();
    }

    /**
     * adding shuffle button
     */
    addShuffleButton(){
        this.shuffleButton = new PIXI.Sprite(this.resource.Shuffle.texture);
        this.shuffleCont.parent.addChild(this.shuffleButton);
        this.shuffleButton.position.set(500,440);
        this.shuffleButton.scale.set(0.5);
        this.enableButtonShuffle();
    }

    /**
     * enabling shuffle button
     */
    enableButtonShuffle(){
        this.shuffleButton.tint = 0xffffff;
        this.shuffleButton.interactive=true;
        this.shuffleButton.buttonMode=true;
        this.shuffleButton.removeAllListeners();
        this.shuffleButton.on("pointerdown",()=>{
            this.shuffleButton.interactive=false;
            this.shuffleButton.buttonMode=false;
            this.shuffleButton.tint = 0x808080;
            this.resetGame();
        });
    }

    /**
     * reset objects and container after play/shuffle
     */
    resetGame(){
        this.alreadyAddedCard = [];
        this.shuffleIndex = 0;
        this.andarIndex = 0;
        this.baharIndex = 0;
        this.endGame = false;
        //removing all andar cards
        while(this.andarContainer.children.length>0){
            this.andarContainer.children[this.andarContainer.children.length-1].visible = false;
            this.andarContainer.children[this.andarContainer.children.length-1].destroy();
            this.andarContainer.children[this.andarContainer.children.length-1]=null;
            this.andarContainer.children.pop();
        }
        //removing all bahar cards
        while(this.baharContainer.children.length>0){
            this.baharContainer.children[this.baharContainer.children.length-1].visible = false;
            this.baharContainer.children[this.baharContainer.children.length-1].destroy();
            this.baharContainer.children[this.baharContainer.children.length-1]=null;
            this.baharContainer.children.pop();
        }

        //removing joker cards
        this.jokerCardObj && (this.jokerCardObj.destroy());
        this.jokerCardObj && (this.jokerCardObj=null);
        setTimeout(()=>{
            this.shuffleCards();
        },1000);
    }

    /**
     * creating container for andar and bahar container and adding masks to them
     */
    createAndarBaharContainer(){
        this.andarContainerOuter = new PIXI.Container();
        this.shuffleCont.addChild(this.andarContainerOuter);
        this.andarContainer = new PIXI.Container();
        this.andarContainerOuter.addChild(this.andarContainer);
        this.andarContainerOuter.position.set(70,320);
        this.createMask(this.andarContainerOuter,0,0,300,200);


        this.baharContainerOuter = new PIXI.Container();
        this.shuffleCont.addChild(this.baharContainerOuter);
        this.baharContainer = new PIXI.Container();
        this.baharContainerOuter.addChild(this.baharContainer);
        this.baharContainerOuter.position.set(70,500);
        this.createMask(this.baharContainerOuter,0,0,300,200);
        
    }

    /**
     * 
     * @param {*} container the container to add mask to
     * @param {*} x the mask x position
     * @param {*} y the mask y position
     * @param {*} width the mask width
     * @param {*} height the mask height
     */
    createMask(container,x,y,width,height){
        let shape = new PIXI.Graphics();
        shape.beginFill(0x000000);
        shape.drawRect(
            x,
            y,
            width,
            height
        );
        shape.endFill();
        container.addChild(shape);
        container.mask = shape;
    }


    /**
     * add texts of andar, bahar & joker
     */
    addTexts(){
        this.andarText = new PIXI.Text(`ANDAR`, {
            fill: 0XFFFFFF,
            fontSize: 20,
            fontWeight: 'bold',
        });
        this.andarText.position.set(145,440);
        this.shuffleCont.addChild(this.andarText);

        this.baharText = new PIXI.Text(`BAHAR`, {
            fill: 0XFFFFFF,
            fontSize: 20,
            fontWeight: 'bold',
        });
        this.baharText.position.set(145,620);
        this.shuffleCont.addChild(this.baharText);

        this.joker = new PIXI.Text(`JOKER`, {
            fill: 0XFFFFFF,
            fontSize: 20,
            fontWeight: 'bold',
        });
        this.joker.position.set(393,390);
        this.shuffleCont.addChild(this.joker);
    }

    /**
     * Creates background shape for andar bahar container
     * @param {*} x shape x position
     * @param {*} y shape y position
     * @param {*} width shape width
     * @param {*} height shape height
     */
    createBackgroundShape(x,y,width,height){
        this.backShape = new PIXI.Graphics();
        this.backShape.beginFill(0x1a1b3b);
        this.backShape.lineStyle(4, 0x0, .3);
        this.backShape.drawRoundedRect(
            x,
            y,
            width,
            height,
            30
        );
        this.backShape.endFill();
        this.backShape.alpha = 0.7;
        this.shuffleCont.addChild(this.backShape);
    }


    /**
     * periodic conditional card suffling
     */
    shuffleCards(){
        if(this.endGame){
            clearTimeout(this.shuffleCardsTimeOut);
            if(this.shuffleIndex%2 === 0){
                //one final draw
                this.addShuffleCardToBahar(this.baharIndex);
                this.baharIndex++;
            }
        }
        else{
            //card match not found
            if(this.shuffleIndex===0){
                this.addJokerCard();
            }
            else if(this.shuffleIndex%2 === 1){
                this.addShuffleCardToAndar(this.andarIndex);
                this.andarIndex++;
            }
            else{
                this.addShuffleCardToBahar(this.baharIndex);
                this.baharIndex++;
            }
            this.shuffleIndex++;
            this.shuffleCardsTimeOut = setTimeout(()=>{
                this.shuffleCards();
            },1000);
        }
    }


    /**
     * add joker card to view
     */
    addJokerCard(){
        let cardSelected = Math.floor(Math.random() * 51)+1;
        this.alreadyAddedCard.push(cardSelected);
        this.jokerCardNum = cardSelected%13;// to check for match when suffling
        let cardType = Math.floor(cardSelected/13);
        let cardJoker = this.cardGroups[cardType];
        let card = this.getCard(cardJoker,this.jokerCardNum);
        let sprite = new PIXI.Sprite(this.cards.textures[card]);
        this.shuffleCont.addChild(sprite);
        this.jokerCardObj = sprite;
        sprite.scale.set(0.15);
        sprite.position.set(390,420);
    }

    /**
     * adding cards to andar container
     * @param {*} index the index position for the card(positioning purposes)
     */
    async addShuffleCardToAndar(index){
        let xPos = 0;
        if(index>=3){
            await this.moveOtherCardsRight(this.andarContainer);
            xPos = 0;
        }
        else{
            xPos=(2-index)*100;
        }
        let cardSelected = Math.floor(Math.random() * 51)+1;
        while(this.alreadyAddedCard.includes(cardSelected)){
            cardSelected = Math.floor(Math.random() * 51)+1;
        }
        let cardType = Math.floor(cardSelected/13);
        let cardGroupType = this.cardGroups[cardType];
        let cardNum = cardSelected%13;
        let card = this.getCard(cardGroupType,cardNum);
        let sprite = new PIXI.Sprite(this.cards.textures[card]);
        this.andarContainer.addChild(sprite);
        sprite.scale.set(0.15);
        sprite.x = xPos;
        if(cardNum==this.jokerCardNum){
            console.log(cardNum);
            this.endGame = true;
        }
    }

    /**
     * adding cards to bahar container
     * @param {*} index the index position for the card(positioning purposes)
     */
    async addShuffleCardToBahar(index){
        let xPos = 0;
        if(index>=3){
            await this.moveOtherCardsRight(this.baharContainer);
            xPos = 0;
        }
        else{
            xPos=(2-index)*100;
        }
        let cardSelected = Math.floor(Math.random() * 51)+1;
        while(this.alreadyAddedCard.includes(cardSelected)){
            cardSelected = Math.floor(Math.random() * 51)+1;
        }
        let cardType = Math.floor(cardSelected/13);
        let cardGroupType = this.cardGroups[cardType];
        let cardNum = cardSelected%13;
        let card = this.getCard(cardGroupType,cardNum);
        let sprite = new PIXI.Sprite(this.cards.textures[card]);
        this.baharContainer.addChild(sprite);
        sprite.scale.set(0.15);
        sprite.x = xPos;
        if(cardNum==this.jokerCardNum){
            console.log(cardNum);
            this.endGame = true;
        }
        if(this.endGame){
            this.enableButtonShuffle();
        }
    }


    /**
     * move cards right when suffle area filled to create space for upcoming draw
     * @param {*} container the corrending container
     * @returns promise to tell that the tween for movement is complete
     */
    moveOtherCardsRight(container){
        for(let i=0;i<container.children.length;i++){
            let xPos = container.children[i].x;
            gsap.to(container.children[i], {
                duration: 0.3,
                x: xPos+100
            });
        }
        return new Promise((resolve,reject)=>{
            setTimeout(()=>{
                resolve();
            },270);
        });
    }

    /**
     * Get a card name
     * @param {*} cardType the card group(eg: Spades,etc)
     * @param {*} numberIndex the card number(eg: 4)
     * @returns the card string name in Cards.js
     */
    getCard(cardType,numberIndex){
        let cardResource = "";
        if(numberIndex>1 && numberIndex<=10){
            cardResource=numberIndex+cardType+".png";
        }
        else{
            switch(numberIndex){
                case 0:cardResource="king"+cardType+".png";break;
                case 1:cardResource="ace"+cardType+".png";break;
                case 11:cardResource="jack"+cardType+".png";break;
                case 12:cardResource="queen"+cardType+".png";break;
            }
        }
        return cardResource;
    }

    /**
     * resize according to view
     */
    resize(){
        if(this.shuffleCont.parent.x> 640){
            this.shuffleCont.x = -30 - (this.shuffleCont.parent.x-640);
        }
        else{
            this.shuffleCont.x = -30;
        }
    }

}
export default CardShuffleController;