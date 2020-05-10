import AssetManager from "../Miscs/AssetManager";
import ScreenManager from "./_ScreenManager";
import { SCREEN_TITLE } from "../Constants/Constants_General";

export default class ShopScreen extends ScreenManager {    

    constructor(assetManager:AssetManager, stage:createjs.StageGL) {

        super(assetManager, stage, "ShopBackground", SCREEN_TITLE[2]);
        super.ShowReturnButton();
    }

    public ShowMe():void {
        super.ShowMe();
    }
}