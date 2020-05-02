export default class ShapeFactory {

    // private property variables
    private _color:string;

    // private variables
    private stage:createjs.StageGL;

    public constructor(stage:createjs.StageGL) {
        // initialization
        this._color = "#000000";
        // saving constructor argument as a private variable
        this.stage = stage;
    }

    // ------------------------------------------------------------ get/set methods
    public set color(color:string) {
        this._color = color;
    }  

    public rectangle(x:number,y:number,width:number, height:number):createjs.Shape {
        let shape:createjs.Shape = new createjs.Shape();
        shape.graphics.beginFill(this._color);
        shape.graphics.drawRect(0, 0, width, height);
        shape.cache(0,0,width, height);
        shape.x = x;
        shape.y = y;
        this.stage.addChild(shape);
        this.stage.update();
        return shape;
    }

    public circle(x:number,y:number,radius:number) {
        let shape:createjs.Shape = new createjs.Shape();
        shape.graphics.beginFill(this._color);
        shape.graphics.drawCircle(0, 0, radius);
        shape.cache(-radius, -radius, radius * 2, radius * 2);
        shape.x = x;
        shape.y = y;
        this.stage.addChild(shape);
        this.stage.update();
        return shape;
    }

}