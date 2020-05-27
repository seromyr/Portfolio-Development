import AssetManager from "../Miscs/AssetManager";
import { SCREEN_TITLE, STAGE_WIDTH, STAGE_HEIGHT } from "../Constants/Constants_General";
import { SFX_MANIFEST } from "../Constants/Constants_Sounds";

export default class ScreenManager { 
    
    protected stage:createjs.StageGL;
    protected screen:createjs.Container;

    // events
    protected eventGameplay:createjs.Event;
    protected eventShopping:createjs.Event;
    protected eventMainMenu:createjs.Event;
    protected eventRestart:createjs.Event;
    protected eventCredits:createjs.Event;

    // screen objects
    protected background:createjs.Sprite;
    protected btnPlay:createjs.Sprite;
    protected btnRetry:createjs.Sprite;
    protected btnShop:createjs.Sprite;
    protected btnMainMenu:createjs.Sprite;
    protected btnMainMenuL:createjs.Sprite;
    protected btnCredits:createjs.Sprite;

    constructor(assetManager:AssetManager, stage:createjs.StageGL, bkgImage:string, screenType:string) {
        this.stage = stage;

        // construct a Container to hold all sprites of this stage
        this.screen = new createjs.Container();

        // construct Sprite object for screen background
        let background:createjs.Sprite = assetManager.getSprite("gameUI", bkgImage, 0,0);
        this.screen.addChild(background);

        // set up Main Menu buttons
        this.btnPlay = assetManager.getSprite("gameUI", "play", STAGE_WIDTH/2, STAGE_HEIGHT/2 + 64);
        let btnPlayEffect:createjs.ButtonHelper = new createjs.ButtonHelper(this.btnPlay, "play", "play highlight", "play confirm", false);
        
        this.btnRetry = assetManager.getSprite("gameUI", "retry", STAGE_WIDTH/2, STAGE_HEIGHT/2 + 64);
        let btnRetryEffect:createjs.ButtonHelper = new createjs.ButtonHelper(this.btnRetry, "retry", "retry highlight", "retry confirm", false);

        this.btnShop = assetManager.getSprite("gameUI", "shop", STAGE_WIDTH/2, STAGE_HEIGHT/2 + 256);
        let btnShopEffect:createjs.ButtonHelper = new createjs.ButtonHelper(this.btnShop, "shop", "shop highlight", "shop confirm", false);
        
        // set up Return to Main Menu button
        this.btnMainMenu = assetManager.getSprite("gameUI", "return", STAGE_WIDTH - 127, STAGE_HEIGHT - 35);
        let btnMainMenuEffect:createjs.ButtonHelper = new createjs.ButtonHelper(this.btnMainMenu, "return", "return highlight", "return confirm", false);
        
        // set up Return to Main Menu button
        this.btnMainMenuL = assetManager.getSprite("gameUI", "main menu", STAGE_WIDTH/2, STAGE_HEIGHT/2 + 160);
        let btnMainMenuLEffect:createjs.ButtonHelper = new createjs.ButtonHelper(this.btnMainMenuL, "main menu", "main menu highlight", "main menu confirm", false);
        
        // set up Credits button
        this.btnCredits = assetManager.getSprite("gameUI", "credits", STAGE_WIDTH/2, STAGE_HEIGHT/2 + 160);
        let btnCreditsEffect:createjs.ButtonHelper = new createjs.ButtonHelper(this.btnCredits, "credits", "credits highlight", "credits confirm", false);

        // set up event listener for each button
        this.btnPlay.on("click", this.GotoPlay, this);
        this.btnRetry.on("click", this.GotoPlay, this);
        this.btnShop.on("click", this.GotoShop, this);
        this.btnMainMenu.on("click", this.GotoMainMenu, this);
        this.btnMainMenuL.on("click", this.GotoMainMenu, this);
        this.btnCredits.on("click", this.GotoCredits, this);

        // set up event for each button
        this.eventMainMenu = new createjs.Event( SCREEN_TITLE[0], true, false);
        this.eventGameplay = new createjs.Event( SCREEN_TITLE[1], true, false);
        this.eventShopping = new createjs.Event( SCREEN_TITLE[2], true, false);
        this.eventCredits  = new createjs.Event( SCREEN_TITLE[4], true, false);

        // sound effect events
        this.btnPlay.on    ("mouseover", () => {createjs.Sound.play("btnHover");}, false);
        this.btnRetry.on    ("mouseover", () => {createjs.Sound.play("btnHover");}, false);
        this.btnMainMenu.on("mouseover", () => {createjs.Sound.play("btnHover");}, false);
        this.btnMainMenuL.on("mouseover", () => {createjs.Sound.play("btnHover");}, false);
        this.btnCredits.on ("mouseover", () => {createjs.Sound.play("btnHover");}, false);
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
        // console.log("Play button clicked");
        createjs.Sound.play("btnClick");

        window.setTimeout(() => {
            this.screen.dispatchEvent(this.eventGameplay);
        }, 200);
    }
    
    private GotoShop(e:createjs.Event):void {
        // console.log("Shop button clicked");
        createjs.Sound.play("btnClick");
        window.setTimeout(() => {
            this.screen.dispatchEvent(this.eventShopping);
        }, 200);
    }
    
    private GotoMainMenu(e:createjs.Event): void {
        // console.log("Return to Main Menu clicked");
        createjs.Sound.play("btnClick");
        window.setTimeout(() => {
            this.screen.dispatchEvent(this.eventMainMenu);
        }, 200);
    }

    private GotoCredits(e:createjs.Event):void {
        createjs.Sound.play("btnClick");
        window.setTimeout(() => {
            this.screen.dispatchEvent(this.eventCredits);
        }, 200);
    }

    // display Play button on the screen
    protected ShowPlayButton():void  {
        this.screen.addChild(this.btnPlay);
    }

    // hide Play button from the screen
    protected HidePlayButton():void  {
        this.screen.removeChild(this.btnPlay);
    }

    // display Rerty button on the screen
    protected ShowRetryButton():void  {
        this.screen.addChild(this.btnRetry);
    }

    // hide Play button from the screen
    protected HideRetryButton():void  {
        this.screen.removeChild(this.btnRetry);
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

    // display Main Menu button on the screen
    protected ShowMainMenuButton():void  {
        this.screen.addChild(this.btnMainMenuL);
    }

    // hide Return button from the screen
    protected HideMainMenuButton():void  {
        this.screen.removeChild(this.btnMainMenuL);
    }

    // display Show Credits button on the screen
    protected ShowCreditsButton():void {
        this.screen.addChild(this.btnCredits);
    }

    // hide Show Credits button from the screen
    protected HideCreditsButton():void {
        this.screen.removeChild(this.btnCredits);
    }
}