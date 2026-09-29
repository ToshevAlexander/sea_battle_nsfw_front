import { Container, Graphics } from "pixi.js";
import { BaseShip, CombatArea } from "./base";
import { BaseProjectile } from "./base_projectile";
import { Vector2D } from "./interfaces";
import { VectorDistance } from "./vactor_helpers";

export class BaseWeapon {
    //visual props
    public size: number;
    public color: string;
    //

    static typeName: string;
    protected range: number;
    protected fireCD: number;
    protected currentFCD: number = 0;

    protected projectileType: string;

    public container: Container = new Container();

    public update(timeDelta: number, CA: CombatArea, targets: BaseShip[]) {
        this.currentFCD += timeDelta;

        const activeTargets = this.getTargetsInRange(CA, targets);

        if (this.currentFCD < this.fireCD) { return; }

        const target = activeTargets[0];

        if (target && target.distance <= this.range) {
            const globalP = this.container.getGlobalPosition();
            const startingPoint = {x: globalP.x, y: globalP.y};
            const targetPoint = target.target;

            const state = this.fireProjectile(startingPoint, targetPoint);

            if (state.success) {
                state.projectile.init();
                CA.activeProjectiles.push(state.projectile);
                CA.container.addChild(state.projectile.container);
            }
        }
    }

    init() {

    }

    getTargetsInRange(CA: CombatArea, targets: BaseShip[]) {
        const wPos = this.container.getGlobalPosition();
        const dt = targets.map((ship) => {
            const dist = VectorDistance(wPos, ship.container.position);
            
            return {
                distance: dist,
                target: ship.container.position
            }
        });

        return dt;
    }

    fireProjectile(start: Vector2D, target: Vector2D) {
        this.currentFCD = 0;
        
        const newProjectileObj = BaseProjectile.createProjectile(this.projectileType, start, target);

        return {
            success: newProjectileObj ? true : false,
            projectile: newProjectileObj
        }
    }

}

export class Howitzer extends BaseWeapon {

    public size: number = 8;
    public color: string = "#ffff00";

    static typeName = 'howitzer';
    protected range = 1200;
    protected fireCD = 2;
    protected projectileType = "bp150";

    public async init() {
        const shape = new Graphics().rect(-this.size/2, -this.size/2, this.size, this.size).fill(this.color);
        this.container.addChild(shape);
    }
}

export class AK630 extends BaseWeapon {

    public size: number = 6;
    public color: string = "#0000ff";

    static typeName = 'ak630';
    protected range = 400;
    protected fireCD = 0.2;
    protected projectileType = "dp150";

    public async init() {
        const shape = new Graphics().rect(-this.size/2, -this.size/2, this.size, this.size).fill(this.color);
        this.container.addChild(shape);
    }
}