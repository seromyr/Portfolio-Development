import AssetManager from "../Miscs/AssetManager";

export default class Bitmap_Text {
    private _message:createjs.BitmapText;

    get DisplayData():createjs.BitmapText {return this._message;}


    constructor(assetManager:AssetManager, stage:createjs.StageGL) {
        //create bitmap numeric text
        this._message = new createjs.BitmapText("", assetManager.getSpriteSheet("pixeled"));
    }
    
    public WriteMessage(x:number, y:number, message:string):void {
        this._message.text = message;
        this._message.letterSpacing = 3;
        this._message.x = x;
        this._message.y = y;
    } 
}