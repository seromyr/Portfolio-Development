import AssetManager from "../Miscs/AssetManager";
import ScreenManager from "./_ScreenManager";
import { SCREEN_TITLE, STAGE_WIDTH } from "../Constants/Constants_General";
import Bitmap_Text from "./Bitmap_Text";

export default class Endcreen extends ScreenManager {

    private _score:Bitmap_Text;
    private _highscore:string;

    constructor(assetManager:AssetManager, stage:createjs.StageGL) {

        super(assetManager, stage, "GameOver", SCREEN_TITLE[3]);
        super.ShowRetryButton();
        super.ShowMainMenuButton();


        this._score = new Bitmap_Text(assetManager, stage);
    }
    
    public ShowMe():void {
        super.ShowMe();
        

        this._score.WriteMessageCenter(STAGE_WIDTH / 2,350, this._highscore + "m");
        this.stage.addChild(this._score.DisplayData);
    }

    public GetHighScore(number:number):string {
        this._highscore = number.toString();
        return this._highscore;
    }
}