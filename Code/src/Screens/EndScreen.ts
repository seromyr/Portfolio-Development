import AssetManager from "../Miscs/AssetManager";
import ScreenManager from "./_ScreenManager";
import { SCREEN_TITLE } from "../Constants/Constants_General";

export default class Endcreen extends ScreenManager {    

    constructor(assetManager:AssetManager, stage:createjs.StageGL) {

        super(assetManager, stage, "GameOver", SCREEN_TITLE[3]);
        super.ShowReturnButton();
    }

    public ShowMe():void {
        super.ShowMe();
    }
}