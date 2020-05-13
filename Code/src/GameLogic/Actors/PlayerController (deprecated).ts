import Player from "./Player";

export default class PlayerController {
    //keyboard input variables
    private leftkey:boolean;
    get LeftKey():boolean      {return this.leftkey;}
    set LeftKey(value:boolean) {this.leftkey = value;}

    private rightkey:boolean;
    get RightKey():boolean      {return this.rightkey;}
    set RightKey(value:boolean) {this.rightkey = value;}
    
    private _keyDownCount:number;
    get KeyDownCount():number      {return this._keyDownCount;}
    set KeyDownCount(value:number) {this._keyDownCount = value;}

    constructor() {
        this.rightkey = false;
        this.leftkey = false;
        this._keyDownCount = 0;
    }
    
    // Function when left / Right key is pressed
    public onKeyDown(e:KeyboardEvent):void {

        if (e.keyCode == 37 || e.keyCode == 65) {
            this.leftkey = true;
            console.log("Left key is pressed.");
            console.log(this.leftkey);            
        }  
            
        else if (e.keyCode == 39 || e.keyCode == 68) {
            this.rightkey = true;
            console.log("Right key is pressed.");
            console.log(this.rightkey);
        }   
    }

    public onKeyUp(e:KeyboardEvent):void {
        this._keyDownCount = 0;

        if      (e.keyCode == 37) this.leftkey  = false;
        else if (e.keyCode == 39) this.rightkey = false;

    }

    // --------------------------------------------------- keyboard input monitor
    // public monitorKeys():void {
    //     if (this.leftkey || this.rightkey) {            
    //         this._keyDownCount++;
    //         console.log(this._keyDownCount);  
    //     }
    // }
}