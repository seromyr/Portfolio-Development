import AssetManager from "../Miscs/AssetManager";
import ScreenManager from "./_ScreenManager";
import { SCREEN_TITLE } from "../Constants/Constants_General";
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
    }

    public ShowMe():void {
        super.ShowMe();
        this._gameWorld.ShowMe();
        this._gameplayState.StartNewGame();
        this._gameplayIsRunning = true;
        this._score.WriteMessage(14, 50, this._gameplayState.Score.toString() + " m");
        this.stage.addChild(this._topribbon);
    }

    public HideMe():void {
        super.HideMe();
        this.stage.removeChild(this._topribbon);
        this.stage.removeChild(this._score.DisplayData);
        this._gameplayIsRunning = false;
        this._gameplayState.Terminate();
    }

    public UpdateMe():void {
        this._gameplayState.Update();
        // update score
        if (this.GameplayIsRunning) {
            this.stage.removeChild(this._score.DisplayData);
            this._score.WriteMessage(14, 50, this._gameplayState.Score.toString() + " m");
            this.stage.addChild(this._score.DisplayData);
        }

        // update camera
        if (this._gameplayState.CameraUpdateSignal) {
            this._gameWorld.UpdateMe(this._gameplayState.CameraSpeed);
        }
    }
}