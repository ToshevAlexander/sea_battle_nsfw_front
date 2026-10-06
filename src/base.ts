import { Container, Graphics, Assets, Sprite } from "pixi.js";
import { saveData } from "./backend_service";
import { AK630, BaseWeapon, Howitzer } from "./base_weapon";
import { BaseProjectile } from "./base_projectile";

interface IWeaponSlot {
    position: {x: number; y: number;}
}

export class BaseShip {
    protected id: string;
    protected team_id: number;
    protected position: { x: number; y: number; } = { x: 0, y: 0 };
    protected moveVector: {x: number; y: number; };
    protected speed: number;
    protected hitpoints: number;
    protected color: string;

    protected weaponSlots: IWeaponSlot[] = [];
    protected weaponsList: BaseWeapon[] = [];

    protected sizeParams: {width: number; height: number} = {width: 0, height: 0};

    protected direction: number = 0;
    public container: Container = new Container();

    constructor(id: string, team_id: number, weaponConfig: string[]) {
        this.id = id;
        this.team_id = team_id;

        this.initWeapons(weaponConfig);
    }

    protected initWeapons(weaponConfig: string[]) {
        weaponConfig.forEach((wc) => {
            let newWeapon;
            if (wc === Howitzer.typeName) {
                newWeapon = new Howitzer();
            }

            if (wc === AK630.typeName) {
                newWeapon = new AK630();
            }

            if (newWeapon) {
                this.weaponsList.push(newWeapon);
            }
        })
    }

    private findTargets(CA: CombatArea) {
        const otherShips = CA.activeObjecs.filter((ship) => (ship.id !== this.id) && (ship.team_id !== this.team_id));
        return otherShips;
    }

    public logStatus(session_id: string) {
        const data = {
            id: this.id,
            hitpoints: this.hitpoints,
            position: {
                x: Math.floor(this.position.x),
                y: Math.floor(this.position.y),
            }
        };

        saveData(session_id, data);
        // saveData(data);
    }

    public move = (timeDelta: number) => {
        const newX = this.position.x + this.moveVector.x*timeDelta;
        const newY = this.position.y + this.moveVector.y*timeDelta;

        this.setPosition(newX, newY);
    };

    public async init() {
        this.moveVector = {x: 0, y: -this.speed};

        const {width, height} = this.sizeParams;
        
        const shape = new Graphics().rect(-width/2, -height/2, width, height).fill(this.color);

        const shapeCenter = new Graphics().rect(-3, -3, 6, 6).fill("white");
        // const shipBow = new Graphics().rect(-2, -16, 4, 4).fill("white");
        this.container.addChild(shape);
        this.container.addChild(shapeCenter);
        // this.container.addChild(shipBow);

        this.weaponsList.forEach((weapon: BaseWeapon, index: number) => {
            weapon.init();
            const weaponSlot = this.weaponSlots[index];

            if (weaponSlot) {
                weapon.container.position.set(weaponSlot.position.x * width/2, weaponSlot.position.y * height/2);
                
                this.container.addChild(weapon.container);
            }

        });
    }

    public setPosition(x, y) {
        this.position.x = x;
        this.position.y = y;

        this.container.position.set(x, y);
    }

    public setDirection(newDir: number) {
        const alpha = (newDir - this.direction)*Math.PI/180;

        this.direction = newDir % 360;
        this.container.rotation = (newDir * Math.PI)/180;

        this.updateMoveVector(alpha);
    }

    updateMoveVector(alpha: number) {
        const newX = this.moveVector.x * Math.cos(alpha) - this.moveVector.y*Math.sin(alpha);
        const newY = this.moveVector.x * Math.sin(alpha) + this.moveVector.y*Math.cos(alpha);

        this.moveVector.x = newX;
        this.moveVector.y = newY;
    }

    public update(timeDelta: number, CA: CombatArea) {
        this.move(timeDelta);
        const targets = this.findTargets(CA);

        this.weaponsList.forEach((wep) => {
            wep.update(timeDelta, CA, targets)
        })

        // this.logStatus();

        if ((this.position.y <= 0 && this.moveVector.y < 0) || (this.position.y >= CA.size.height && this.moveVector.y > 0)) {
            this.moveVector.y = -this.moveVector.y;
        }

        if ((this.position.x <= 0 && this.moveVector.x < 0) || (this.position.x >= CA.size.width && this.moveVector.x > 0)) {
            this.moveVector.x = -this.moveVector.x;
        }

        // this.fixContainerDirection();
    }

    private fixContainerDirection() {
        // const newDir = Math.atan2(this.moveVector.y, this.moveVector.x);
        // this.container.rotation = newDir + 90;
        const {x, y} = this.moveVector;
        const newDir = Math.acos(y/(Math.sqrt(x*x + y*y)));
        this.container.rotation = -newDir;
        // console.log(newDir);
    }
}

export class CorvetShip extends BaseShip {
    static typeName: string = 'corvet';
    protected speed: number = 40;
    protected hitpoints: number = 100;
    protected color: string = "black";

    protected weaponSlots = [
        {
            position: {x: 0, y: 0.7} // [-1; 1]
        }
    ];

    protected sizeParams: {width: number; height: number} = {width: 10, height: 30};
}

export class FregateShip extends BaseShip {
    static typeName: string = 'fregate';
    protected speed: number = 50;
    protected hitpoints: number = 200;
    protected color: string = "red";

    protected weaponSlots = [
        {
            position: {x: 0, y: 0.75}
        },
        {
            position: {x: 0, y: -0.75}
        }
    ];

    protected sizeParams: {width: number; height: number} = {width: 14, height: 50};
}

export type AreaSizeType = { height: number; width: number };

export class CombatArea {
    private stage: any;
    public container: Container = new Container();
    public size: AreaSizeType;
    public activeObjecs: BaseShip[] = [];
    public activeProjectiles: BaseProjectile[] = [];

    private logsUpdated: boolean = false;

    constructor(size: AreaSizeType, combatConfig: any[], stage: any) {
        this.size = size;
        this.stage = stage;
        this.container.position.set(10, 10);

        const areaShape = new Graphics().rect(0, 0, this.size.width, this.size.height)
            .stroke({ width: 5, color: "red" });

        this.container.addChild(areaShape);
        this.stage.addChild(this.container);

        combatConfig.forEach((item) => {
            let newSeaBot;
            if (item.type === CorvetShip.typeName) {
                newSeaBot = new CorvetShip(item.id, item.team, item.weaponConfig);
            }

            if (item.type === FregateShip.typeName) {
                newSeaBot = new FregateShip(item.id, item.team, item.weaponConfig);
            }

            newSeaBot.init();
            this.activeObjecs.push(newSeaBot);
            newSeaBot.setPosition(item.position.x, item.position.y);
            newSeaBot.setDirection(item.direction);
            this.container.addChild(newSeaBot.container);
        });
    }

    update(t: number, totalTime: number, session_id: string) {
        this.activeObjecs.forEach((item) => {
            item.update(t, this);
        });

        this.activeProjectiles.forEach((item) => {
            if (item.active) {
                item.update(t);
            }
        });

        this.activeProjectiles = this.activeProjectiles.filter((item) => {
            if (!item.active) {
                this.container.removeChild(item.container);
            }

            return item.active;
        });

        const iterationS = Math.floor((totalTime/1000)%5);

        if (!this.logsUpdated && iterationS === 0) {
            this.activeObjecs.forEach((item) => {
                item.logStatus(session_id);
            });

            this.logsUpdated = true;
        }

        if (iterationS !== 0) {
             this.logsUpdated = false;
        }
            
    }

    showCurrentState() {
        console.log("COMBAT AREAT STATE: ", this.size, this.activeObjecs);
    }
}
