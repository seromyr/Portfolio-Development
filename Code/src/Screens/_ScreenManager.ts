import AssetManager from "../Miscs/AssetManager";
import { SCREEN_TITLE, STAGE_WIDTH, STAGE_HEIGHT } from "../Constants/Constants_General";

export default class ScreenManager { 
    
    protected stage:createjs.StageGL;
    protected screen:createjs.Container;

    // events
    protected eventGameplay:createjs.Event;
    protected eventShopping:createjs.Event;
    protected eventMainMenu:createjs.Event;
    protected eventRestart:createjs.Event;

    // screen objects
    protected background:createjs.Sprite;
    protected btnPlay:createjs.Sprite;
    protected btnShop:createjs.Sprite;
    protected btnMainMenu:createjs.Sprite;

    constructor(assetManager:AssetManager, stage:createjs.StageGL, bkgImage:string, screenType:string) {
        this.stage = stage;

        // construct a Container to hold all sprites of this stage
        this.screen = new createjs.Container();

        // construct Sprite object for screen background
        let background:createjs.Sprite = assetManager.getSprite("gameUI", bkgImage, 0,0);
        this.screen.addChild(background);

        // set up Main Menu buttons
        this.btnPlay = assetManager.getSprite("gameUI", "play", STAGE_WIDTH/2, STAGE_HEIGHT/2);
        let btnPlayEffect:createjs.ButtonHelper = new createjs.ButtonHelper(this.btnPlay, "play", "play highlight", "play confirm", false);
        
        this.btnShop = assetManager.getSprite("gameUI", "shop", STAGE_WIDTH/2, STAGE_HEIGHT/2 + 128);
        let btnShopEffect:createjs.ButtonHelper = new createjs.ButtonHelper(this.btnShop, "shop", "shop highlight", "shop confirm", false);
        
        // set up Return to Main Menu button
        this.btnMainMenu = assetManager.getSprite("gameUI", "return", STAGE_WIDTH/2, STAGE_HEIGHT/2 + 128);
        let btnMainMenuEffect:createjs.ButtonHelper = new createjs.ButtonHelper(this.btnMainMenu, "return", "return highlight", "return confirm", false);

        // set up event listener for each button
        this.btnPlay.on("click", this.GotoPlay, this);
        this.btnShop.on("click", this.GotoShop, this);
        this.btnMainMenu.on("click", this.GotoMainMenu, this);

        // set up event for each button
        this.eventMainMenu = new createjs.Event( SCREEN_TITLE[0], true, false);
        this.eventGameplay = new createjs.Event( SCREEN_TITLE[1], true, false);
        this.eventShopping = new createjs.Event( SCREEN_TITLE[2], true, false);

    }
    
    // show screen
    public ShowMe():void {
        this.stage.addChild(this.screen);
    }

    // remove screen
    public HideMe():void {
        this.stage.removeChild(this.screen);
    }

    // dispatch custom events when button clicked
    private GotoPlay(e:createjs.Event):void {
        console.log("Play button clicked");
        this.screen.dispatchEvent(this.eventGameplay);
    }
    
    private GotoShop(e:createjs.Event):void {
        console.log("Shop button clicked");
        this.screen.dispatchEvent(this.eventShopping);
    }
    
    private GotoMainMenu(e:createjs.Event): void {
        console.log("Return to Main Menu clicked");
        this.screen.dispatchEvent(this.eventMainMenu);
    }

    // display Play button on the screen
    protected ShowPlayButton():void  {
        this.screen.addChild(this.btnPlay);
    }

    // hide Play button from the screen
    protected HidePlayButton():void  {
        this.screen.removeChild(this.btnPlay);
    }

    // display Shop button on the screen
    protected ShowShopButton():void  {
        this.screen.addChild(this.btnShop);
    }

    // hide Shop button from the screen
    protected HideShopButton():void  {
        this.screen.removeChild(this.btnShop);
    }
    
    // display Return button on the screen
    protected ShowReturnButton():void  {
        this.screen.addChild(this.btnMainMenu);
    }

    // hide Return button from the screen
    protected HideReturnButton():void  {
        this.screen.removeChild(this.btnMainMenu);
    }
}