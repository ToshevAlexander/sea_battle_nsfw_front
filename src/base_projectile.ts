import { Container, Graphics } from "pixi.js";
import { Vector2D } from "./interfaces";
import { VectorDistance } from "./vactor_helpers";

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

    protected startingSpeed: number;
    protected speed: number;
    protected aimingType: AimingTypes = 1;

    protected spread: number;

    protected startingPoint: Vector2D;
    protected direction: Vector2D;

    public container: Container = new Container();

    public active: boolean = true;

    constructor(id: string, startingPoint: Vector2D) {
        this.id = id;

        this.startingPoint = startingPoint;
    }

    public getDirection(startingPoint: Vector2D, targetPoint: Vector2D) {
        const dirVectorBase = {
            x: targetPoint.x - startingPoint.x,
            y: targetPoint.y - startingPoint.y
        };

        const length = Math.sqrt(dirVectorBase.x**2 + dirVectorBase.y**2);

        const dirVectorNorm = {
            x: dirVectorBase.x/length,
            y: dirVectorBase.y/length,
        };

        const ang = ((this.spread*2) * Math.random()) - this.spread;

        const dSpread = {
            x: dirVectorNorm.x * Math.cos(ang) - dirVectorNorm.y * Math.sin(ang),
            y: dirVectorNorm.x * Math.sin(ang) + dirVectorNorm.y * Math.cos(ang)
        };

        return dSpread;
    }

    public update(timeDelta: number) {
        this.currentTime += timeDelta;

        this.position.x += this.direction.x * (this.speed*timeDelta);
        this.position.y += this.direction.y * (this.speed*timeDelta);

        this.container.position.set(this.position.x, this.position.y);

        this.speed *= 0.98;
        if (this.currentTime >= 2.5 || this.speed < 100) {this.active = false;}
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
    public size: number = 2;
    public color: string = "#FFFFFF";
    //

    protected startingSpeed: number = 1600;
    protected aimingType: AimingTypes = 1;
    protected spread: number = Math.PI/18;

    constructor(id: string, startingPoint: Vector2D, targetPoint: Vector2D) {
        super(id, startingPoint);

        this.direction = this.getDirection(startingPoint, targetPoint);
        this.position = {x: startingPoint.x, y: startingPoint.y};

        this.speed = this.startingSpeed;
    }
}

export class BP150 extends BaseProjectile {
    static typeName: string = "bp150";
    //visual props
    public size: number = 4;
    public color: string = "#FFFFBB";
    //

    protected startingSpeed: number = 1000;
    protected aimingType: AimingTypes = 1;
    protected spread: number = Math.PI/36;

    constructor(id: string, startingPoint: Vector2D, targetPoint: Vector2D) {
        super(id, startingPoint);

        this.direction = this.getDirection(startingPoint, targetPoint);
        this.position = {x: startingPoint.x, y: startingPoint.y};

        this.speed = this.startingSpeed;
    }
}
