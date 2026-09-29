import { Container, Graphics } from "pixi.js";
import { Vector2D } from "./interfaces";

enum AimingTypes {
    "direct" = 1,
    "ballistic" = 2,
    "missile" = 3
}

export class BaseProjectile {
    static typeName: string;
    protected id: string;

    //visual props
    public size: number;
    public color: string;

    protected position: Vector2D = {x: 0, y: 0};
    protected currentTime: number = 0;
    protected finishTime: number;
    //

    protected speed: number;
    protected aimingType: AimingTypes = 1;

    protected startingPoint: Vector2D;
    protected targetPoint: Vector2D;

    public container: Container = new Container();

    public active: boolean = true;

    constructor(id: string, startingPoint: Vector2D, targetPoint: Vector2D) {
        this.id = id;

        this.startingPoint = startingPoint;
        this.targetPoint = targetPoint;
    }

    public update(timeDelta: number) {
        this.currentTime += timeDelta;
        const timeStep = (this.currentTime/(this.finishTime));

        if (timeStep >= 1) {
            this.active = false;
        }

        const distX = this.targetPoint.x - this.startingPoint.x;
        const distY = this.targetPoint.y - this.startingPoint.y;

        this.position.x = this.startingPoint.x + distX * timeStep;
        this.position.y = this.startingPoint.y + distY * timeStep;

        this.container.position.set(this.position.x, this.position.y);
    }

    static createProjectile(pt: string, startingPoint: Vector2D, targetPoint: Vector2D) {
        let newProject = null;
        if (pt === DP150.typeName) {
            newProject = new DP150("dp150_01", startingPoint, targetPoint);
        }

        if (pt === BP150.typeName) {
            newProject = new BP150("bp150_01", startingPoint, targetPoint);
        }
        return newProject;
    }

    public async init() {
        const shape = new Graphics().circle(0, 0, this.size).fill(this.color);
        this.container.addChild(shape);
    }
}


export class DP150 extends BaseProjectile {
    static typeName: string = "dp150";
    //visual props
    public size: number = 4;
    public color: string = "#FF00FF";
    //

    protected speed: number = 1000;
    protected aimingType: AimingTypes = 1;

    constructor(id: string, startingPoint: Vector2D, targetPoint: Vector2D) {
        super(id, startingPoint, targetPoint);

        this.position = {x: startingPoint.x, y: startingPoint.y};

        const dist = Math.sqrt((targetPoint.x - startingPoint.x)**2 + (targetPoint.y - startingPoint.y)**2);
        this.finishTime = dist/this.speed;
    }
}

export class BP150 extends BaseProjectile {
    static typeName: string = "bp150";
    //visual props
    public size: number = 6;
    public color: string = "#FF0000";
    //

    protected speed: number = 600;
    protected aimingType: AimingTypes = 1;

    constructor(id: string, startingPoint: Vector2D, targetPoint: Vector2D) {
        super(id, startingPoint, targetPoint);

        this.position = {x: startingPoint.x, y: startingPoint.y};

        const dist = Math.sqrt((targetPoint.x - startingPoint.x)**2 + (targetPoint.y - startingPoint.y)**2);
        this.finishTime = dist/this.speed;
    }
}
