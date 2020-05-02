import AssetManager from "../Miscs/AssetManager";

export default class ScreenManager { 
    
    protected stage:createjs.StageGL;
    protected screen:createjs.Container;

    //event
    protected eventGameplay:createjs.Event;

    //screen objects
    protected background:createjs.Sprite;

    //------------------------------------ GAME OVER SCREEN
    protected eventRestart:createjs.Event;

    constructor(assetManager:AssetManager, stage:createjs.StageGL, bkgImage:string) {
        this.stage = stage;

        //construct a Container to hold all sprites of this stage
        this.screen = new createjs.Container();

        //construct Sprite object for screen background
        let background:createjs.Sprite = assetManager.getSprite("bkgImages", bkgImage, 0,0);
        this.screen.addChild(background);

        this.eventGameplay = new createjs.Event("gameplay", true, false);
    }

    private onGameplay(e:createjs.Event):void {
        console.log("replay clicked");
        this.stage.dispatchEvent(this.eventGameplay);
    }
    
    //-------------------------------------- public methods
    public showMe():void {
        this.stage.addChild(this.screen);
    }

    public hideMe():void {
        this.stage.removeChild(this.screen);
    }
}