import AssetManager from "../Miscs/AssetManager";

// GAME CHARACTER / OBJECT SUPER CLASS
export default class Entity {

    protected stage:createjs.StageGL;
    protected screen:createjs.Container;

    // Character Visual variable
    protected _sprite:createjs.Sprite;

    // Character logic variables
    private _x:number;
    private _y:number;
    private _currentY:number;
    private _jump:boolean;
    private _alive:boolean;
    private _name:string;
    
    //encapsulation of important variables
    get X():number             {return this._x;}
    set X(value:number)        {this._sprite.x = this._x = value;}
    
    get Y():number             {return this._y;}
    set Y(value:number)        {this._sprite.y = this._y = value;}

    get CurrentY():number      {return this._currentY;}
    set CurrentY(value:number) {this._currentY = value;}

    get Jump():boolean         {return this._jump;}
    set Jump(value:boolean)    {this._jump = value;}
    
    get Alive():boolean        {return this._alive;}
    set Alive(value:boolean)   {this._alive = value;}

    get Name():string          {return this._name;}
    set Name(value:string)     {this._name = value;}
    // end of capsulation

    constructor(assetManager:AssetManager, stage:createjs.StageGL, spriteID:string) {
        this.stage = stage;

        //construct a Container to hold all sprites of this stage
        this.screen = new createjs.Container();

        //construct Sprite object for screen background
        this._sprite = assetManager.getSprite(spriteID);        
    }
    
    public ShowMe(animID:string, loop:boolean = true):void {
        if (loop) this._sprite.gotoAndPlay(animID);
        else this._sprite.gotoAndStop(animID);

        this.screen.addChild(this._sprite);
        this.stage.addChild(this.screen);
    }
    
    public HideMe():void {
        this.screen.removeChild(this._sprite);
        this.stage.removeChild(this.screen);
    }
}
