import AssetManager from "../Miscs/AssetManager";
import ScreenManager from "./_ScreenManager";
import { SCREEN_TITLE } from "../Constants";

export default class GameplayScreen extends ScreenManager {

    constructor(assetManager:AssetManager, stage:createjs.StageGL) {

        super(assetManager, stage, "Gameplay", SCREEN_TITLE[1]);
        super.HideShopButton();
        super.HidePlayButton();
        super.ShowReturnButton();
    }

    public ShowMe():void {
        super.ShowMe();
    }
}