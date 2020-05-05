import AssetManager from "../Miscs/AssetManager";
import ScreenManager from "./_ScreenManager";
import { SCREEN_TITLE } from "../Constants";

export default class MainMenuScreen extends ScreenManager {    

    constructor(assetManager:AssetManager, stage:createjs.StageGL) {

        super(assetManager, stage, "MainMenu", SCREEN_TITLE[0]);
        super.ShowPlayButton();
        super.ShowShopButton();
    }

    public ShowMe():void {
        super.ShowMe();
    }
}