import AssetManager from "../Miscs/AssetManager";
import Player from "../GameLogic/Player";
import Tile from "../GameLogic/Tile";
import PlayerController from "./PlayerController";
import { PLAYER_JUMPHEIGHT, PLAYER_JUMPSPEED } from "../Constants";

export default class GameplayState {
    // activate player controller
    private playerController:PlayerController;

    // game characters & objects
    private player:Player;
    private player2:Player;
    private tile:Tile;

    // direction variables
    private _isFacingRight:boolean;
    get IsFacingRight():boolean        {return this._isFacingRight;}
    set IsFacingRight(value:boolean)   {this._isFacingRight = value;}

    // game state variable
    private _gameStart:boolean;
    get GameStart():boolean        {return this._gameStart;}
    set GameStart(value:boolean)   {this._gameStart = value;}


    constructor(assetManager:AssetManager, stage:createjs.StageGL, document:Document) {

        this.player = new Player(assetManager, stage);
        this.player2 = new Player(assetManager, stage);
        this.tile = new Tile(assetManager, stage);

        this.player2.JumpHeight = PLAYER_JUMPHEIGHT;

        this.playerController = new PlayerController();
        
        //wire up eventListener for keyboard keys only on gameplay screen
        document.onkeydown = (e:KeyboardEvent) => {
            if (e.keyCode == 37 || e.keyCode == 65) {
                this.player2.X -= 5;
            }

            else if (e.keyCode == 39 || e.keyCode == 68) {
                this.player2.X +=5;
            }
        }

        document.onkeyup = (e:KeyboardEvent) => {
            if (e.keyCode == 37 || e.keyCode == 65) {}

            else if (e.keyCode == 39 || e.keyCode == 68) {}
        }
    }

    public StartNewGame():void {
        this._gameStart = true;

        this.player.Alive = true;

        this.player.X = 160;
        this.player.Y = 150;
        this.player.Jump = true;
        this.player.ShowMeIdling();
        
        this.player2.Alive = true;
        
        this.player2.X = 130;
        this.player2.Y = 150;
        this.player2.Jump = true;
        this.player2.CurrentY = this.player2.Y;
        this.player2.JumpSpeed = PLAYER_JUMPSPEED;
        this.player2.ShowMeJumping();

        this.tile.X = 125;
        this.tile.Y = 150;
        this.tile.ShowMe();
    }

    public Update():void {       
        console.log("ye");
        
        this.player2.Update();
    }
}