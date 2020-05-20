import AssetManager from "../Miscs/AssetManager";
import ScreenManager from "./_ScreenManager";
import { SCREEN_TITLE } from "../Constants/Constants_General";

export default class Credits extends ScreenManager {    

    constructor(assetManager:AssetManager, stage:createjs.StageGL) {

        super(assetManager, stage, "CreditsScreen", SCREEN_TITLE[4]);
        super.ShowReturnButton();
    }

    public ShowMe():void {
        super.ShowMe();
    }
}