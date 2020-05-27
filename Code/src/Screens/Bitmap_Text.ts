import AssetManager from "../Miscs/AssetManager";

export default class Bitmap_Text {
    private _message:createjs.BitmapText;

    get DisplayData():createjs.BitmapText {return this._message;}
    set DisplayData(value:createjs.BitmapText) {this._message = value}

    constructor(assetManager:AssetManager, stage:createjs.StageGL) {
        //create bitmap numeric text
        this._message = new createjs.BitmapText("", assetManager.getSpriteSheet("lucon"));
    }
    
    public WriteMessageLeft(x:number, y:number, message:string):void {
        this._message.text = message;
        this._message.letterSpacing = 8;
        this._message.x = x;
        this._message.y = y;        
        this._message.regX = 0;
    }

    public WriteMessageCenter(x:number, y:number, message:string):void {
        this._message.text = message;
        this._message.letterSpacing = 8;
        this._message.x = x;
        this._message.y = y;        
        this._message.regX = 0;
        this._message.regX = this._message.getBounds().width / 2;
    }

    public DisplaySize(x:number, y:number):void {
        this._message.scaleX = x;
        this._message.scaleY = y;
    }
}