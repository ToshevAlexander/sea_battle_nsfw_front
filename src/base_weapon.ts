import { CombatArea } from "./base";
import { BaseProjectile } from "./base_projectile";
import { Vector2D } from "./interfaces";

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

    public update(timeDelta: number, CA: CombatArea) {
        this.currentFCD += timeDelta;


        if (this.currentFCD > this.fireCD) {
            const startingPoint = {x: 400, y: 400};
            const targetPoint = {x: startingPoint.x, y: startingPoint.y + 400};

            console.log(startingPoint, targetPoint);

            const state = this.fireProjectile(startingPoint, targetPoint);

            console.log(state);

            if (state.success) {
                state.projectile.init();
                CA.activeProjectiles.push(state.projectile);
                CA.container.addChild(state.projectile.container);
            }
        }
    }

    getTargetsInRange(targets: any[]) {

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
    protected range = 600;
    protected fireCD = 5;
    protected projectileType = "bp150";
}

export class AK630 extends BaseWeapon {

    public size: number = 6;
    public color: string = "#0000ff";

    static typeName = 'ak630';
    protected range = 200;
    protected fireCD = 1;
    protected projectileType = "dp150";
}