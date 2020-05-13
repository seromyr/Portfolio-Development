// createjs typescript definition for TypeScript
/// <reference path="./../node_modules/@types/createjs/index.d.ts" />

// import createjs framework
import "createjs";

// import game constants
import { STAGE_WIDTH, STAGE_HEIGHT, BACKGROUND_COLOR, FRAME_RATE, ASSET_MANIFEST, SCREEN_TITLE } from "./Constants/Constants_General";

// import custom classes
import AssetManager from "./Miscs/AssetManager";
import ShapeFactory from "./Miscs/ShapeFactory";
import MainMenuScreen from "./Screens/MainMenuScreen";
import GameplayScreen from "./Screens/GameplayScreen";
import ShopScreen from "./Screens/ShopScreen";
import Endcreen from "./Screens/EndScreen";
import { TILE_MANIFEST } from "./Constants/Constants_Tiles";
import { ENV_MANIFEST } from "./Constants/Constants_Environment";

// game variables
let stage:createjs.StageGL;
let canvas:HTMLCanvasElement;
let assetManager:AssetManager;

// game screens
let mainMenu:MainMenuScreen;
let gameplayScreen:GameplayScreen;
let shopScreen:ShopScreen;
let endScreen:Endcreen;

// BOOT UP GAME
function onReady(e:createjs.Event):void {
    console.log(">> adding sprites to game");

    // show Main Menu upon game start
    mainMenu = new MainMenuScreen(assetManager, stage);
    mainMenu.ShowMe();

    // instantiate gameplay screen visual
    gameplayScreen = new GameplayScreen(assetManager, stage);

    // instantiate shop screen visual
    shopScreen = new ShopScreen(assetManager, stage);

    // instantiate end screen
    endScreen = new Endcreen(assetManager, stage);

    // listen to any dispatched event
    stage.on(SCREEN_TITLE[0], ShowMainMenu);
    stage.on(SCREEN_TITLE[1], ShowGameplay);
    stage.on(SCREEN_TITLE[2], ShowShop);
    stage.on(SCREEN_TITLE[3], ShowGameOver);
    
    // startup the ticker
    createjs.Ticker.framerate = FRAME_RATE;
    createjs.Ticker.on("tick", onTick);        
    console.log(">> game ready");
}

// CUSTOM EVENTS
function ShowMainMenu():void {
    endScreen.HideMe();
    shopScreen.HideMe();
    mainMenu.ShowMe();
}

function ShowGameplay():void {
    mainMenu.HideMe();
    endScreen.HideMe();
    shopScreen.HideMe();
    gameplayScreen.ShowMe();
}

function ShowShop():void {
    mainMenu.HideMe();
    gameplayScreen.HideMe()
    endScreen.HideMe();
    shopScreen.ShowMe();
}

function ShowGameOver(e:Event):void {        
    console.log("player has died");
    gameplayScreen.HideMe();
    mainMenu.HideMe();
    shopScreen.HideMe();
    endScreen.ShowMe();
}

// GAME UPDATER
function onTick(e:createjs.Event):void {
    // TESTING FPS
    document.getElementById("fps").innerHTML = String(createjs.Ticker.getMeasuredFPS());

    if (gameplayScreen.GameplayIsRunning) {gameplayScreen.UpdateMe();}

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
    assetManager.loadAssets(TILE_MANIFEST);
    assetManager.loadAssets(ENV_MANIFEST);
}

main();