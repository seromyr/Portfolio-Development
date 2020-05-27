import { SCREEN_TITLE, STAGE_HEIGHT } from "../Constants/Constants_General";
import AssetManager from "../Miscs/AssetManager";
import ScreenManager from "./_ScreenManager";
import GameplayState from "../GameLogic/GameplayState";
import BitmapText from "./Bitmap_Text";
import GameWorld from "../GameLogic/Enviroment/GameWorld";

export default class GameplayScreen extends ScreenManager {

    // gameplay state
    private _gameplayState:GameplayState;
    private _gameplayIsRunning:boolean;
    get GameplayIsRunning():boolean {return this._gameplayIsRunning;}

    // gameUI
    private _gameWorld:GameWorld;
    private _topribbon:createjs.Sprite;
    private _score:BitmapText;
    private _controls:createjs.Sprite;

    // score placeholer
    private hiscore:number;
    get HiScore():number {return this.hiscore;}

    private soundCounter:number;

    constructor(assetManager:AssetManager, stage:createjs.StageGL) {
        super(assetManager, stage, "Gameplay", SCREEN_TITLE[1]);
        super.HideShopButton();
        super.HidePlayButton();

        // gamplay occurs inside this screen
        this._gameplayState = new GameplayState(assetManager, stage);

        // draw score on screen
        this._score = new BitmapText(assetManager, stage);

        // construct top ribbon gameUI
        this._topribbon = assetManager.getSprite("gameUI", "TopRibbon", 0, 0);

        // construct gameworld visual
        this._gameWorld = new GameWorld(assetManager, stage);

        // construct controls help UI
        this._controls = assetManager.getSprite("gameUI");
    }

    public ShowMe():void {
        super.ShowMe();
        this._gameWorld.ShowMe();
        this._gameplayState.StartNewGame();
        this._gameplayIsRunning = true;
        this._score.WriteMessageLeft(14, 50, this._gameplayState.Score.toString() + " m");
        this.stage.addChild(this._topribbon);
        this.stage.addChild(this._controls);
        this.soundCounter = 0;
        //show controls
        this._controls.gotoAndPlay("Controls/keyboardControls");
    }

    public HideMe():void {
        super.HideMe();
        this.stage.removeChild(this._topribbon);
        this.stage.removeChild(this._score.DisplayData);
        this.stage.removeChild(this._controls);
        this._gameplayIsRunning = false;
        this._gameplayState.Terminate();
    }

    public UpdateMe():void {
        this._gameplayState.Update();
        // update camera
        if (this._gameplayState.GameplaySignal) {
            this._gameWorld.UpdateMe(this._gameplayState.CameraSpeed);
        }

        // update score
        if (this.GameplayIsRunning) {
            if (this._gameplayState.Score < -400) {
                // attach controls help to the main character
                this._controls.x = this._gameplayState.PlayerPosX;
                this._controls.y = this._gameplayState.PlayerPosY - 64;
            } else {
             
                
                this._controls.y+=20;
                if (this._controls.y > STAGE_HEIGHT - this._controls.getBounds().height)
                this.stage.removeChild(this._controls);
            }


            if (this._gameplayState.Score > 100 && this._gameplayState.Score < 400) {
                if (this.soundCounter == 0) {
                    createjs.Sound.play("enterSurface");
                    this.soundCounter = 1;
                }
            }

            if (this._gameplayState.Score > 1000) {
                if (this.soundCounter == 1) {
                    createjs.Sound.play("enterSpace");
                    this.soundCounter = 2;
                }
            }

            this.stage.removeChild(this._score.DisplayData);
            this.hiscore = this._gameplayState.Score;
            this._score.WriteMessageLeft(14, 50, this._gameplayState.Score.toString() + " m");
            this.stage.addChild(this._topribbon);
            this.stage.addChild(this._score.DisplayData);
        }
    }
}