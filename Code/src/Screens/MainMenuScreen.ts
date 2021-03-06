import { SCREEN_TITLE, STAGE_HEIGHT, STAGE_WIDTH } from "../Constants/Constants_General";
import AssetManager from "../Miscs/AssetManager";
import ScreenManager from "./_ScreenManager";
import Bitmap_Text from "./Bitmap_Text";

export default class MainMenuScreen extends ScreenManager {   
    
    private _version:Bitmap_Text;

    constructor(assetManager:AssetManager, stage:createjs.StageGL) {

        super(assetManager, stage, "MainMenu", SCREEN_TITLE[0]);
        super.ShowPlayButton();
        //super.ShowShopButton();
        super.ShowCreditsButton();

        this._version = new Bitmap_Text(assetManager, stage);
    }

    public ShowMe():void {
        super.ShowMe();
        this._version.WriteMessageCenter(STAGE_WIDTH / 2, STAGE_HEIGHT - 8, "v1.0");
        this._version.DisplaySize(0.25,0.25);
        this.stage.addChild(this._version.DisplayData);
    }
}