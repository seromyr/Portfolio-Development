import { SCREEN_TITLE, STAGE_HEIGHT } from "../Constants/Constants_General";
import AssetManager from "../Miscs/AssetManager";
import ScreenManager from "./_ScreenManager";
import Bitmap_Text from "./Bitmap_Text";

export default class MainMenuScreen extends ScreenManager {   
    
    private version:Bitmap_Text;

    constructor(assetManager:AssetManager, stage:createjs.StageGL) {

        super(assetManager, stage, "MainMenu", SCREEN_TITLE[0]);
        super.ShowPlayButton();
        //super.ShowShopButton();

        this.version = new Bitmap_Text(assetManager, stage);
    }

    public ShowMe():void {
        super.ShowMe();
        this.version.WriteMessage(256, STAGE_HEIGHT - 48, "v0.7a");
        this.stage.addChild(this.version.DisplayData);
    }
}