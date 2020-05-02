// createjs typescript definition for TypeScript
/// <reference path="./../node_modules/@types/createjs/index.d.ts" />

// importing createjs framework
import "createjs";

// importing game constants
import { STAGE_WIDTH, STAGE_HEIGHT, BACKGROUND_COLOR, FRAME_RATE, ASSET_MANIFEST } from "./Constants";
import AssetManager from "./Miscs/AssetManager";
import ShapeFactory from "./Miscs/ShapeFactory";
import MainMenu from "./Screens/MainMenu";
import GameplayScreen from "./Screens/GameplayScreen";
import GameplayState from "./GameLogic/GameplayState";


// game variables
let stage:createjs.StageGL;
let canvas:HTMLCanvasElement;
let assetManager:AssetManager;

// player controller
//let playerController:PlayerController;

// game screens
let mainMenu:MainMenu;
let gameplayScreen:GameplayScreen;
let gameplayState:GameplayState;


// --------------------------------------------------- event handlers
function onReady(e:createjs.Event):void {
    console.log(">> adding sprites to game");

    // show Main Menu upon game start
    mainMenu = new MainMenu(assetManager, stage);
    mainMenu.showMe();

    // instantiate gameplay screen visual
    gameplayScreen = new GameplayScreen(assetManager, stage);

    // instantiate gameplay screen logic
    gameplayState = new GameplayState(assetManager, stage, document);
    
    // keyboard input monitors
    stage.on("click", onShowGameplay, null, true);
    stage.on("gameplay", onShowGameplay);

    // startup the ticker
    createjs.Ticker.framerate = FRAME_RATE;
    createjs.Ticker.on("tick", onTick);        
    console.log(">> game ready");
}

function onShowGameplay():void {
    mainMenu.hideMe();
    gameplayScreen.showMe();
    gameplayState.StartNewGame();
}

function onTick(e:createjs.Event):void {
    // TESTING FPS
    document.getElementById("fps").innerHTML = String(createjs.Ticker.getMeasuredFPS());

    if (gameplayState.GameStart) {

        gameplayState.Update();
    }

    // update the stage
    stage.update();
}

// MAIN METHOD
function main():void {

    //let browser focus on gameplay canvas after loading
    window.focus();

    console.log(">> initializing");

    // get reference to canvas
    canvas = <HTMLCanvasElement> document.getElementById("game-canvas");
    // set canvas width and height - this will be the stage size
    canvas.width = STAGE_WIDTH;
    canvas.height = STAGE_HEIGHT;

    // create stage object
    stage = new createjs.StageGL(canvas, { antialias: true });
    stage.enableMouseOver(10);

    // color the stage
    let shapeFactory:ShapeFactory = new ShapeFactory(stage);
    shapeFactory.color = BACKGROUND_COLOR;
    shapeFactory.rectangle(0, 0, STAGE_WIDTH, STAGE_HEIGHT);

    // construct AssetManager object to load spritesheet and sound assets
    assetManager = new AssetManager(stage);
    stage.on("allAssetsLoaded", onReady, null, true);
    // load the assets
    assetManager.loadAssets(ASSET_MANIFEST);
}

main();