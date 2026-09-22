
export class BaseWeapon {
    //visual props
    public size: number;
    public color: string;
    //

    static typeName: string;
    protected range: number;
    protected fireRate: number;
    protected projectileSpeed: number;

    getTargetsInRage(targets: any[]) {

    }

}

export class Howitzer extends BaseWeapon {

    public size: number = 8;
    public color: string = "#ffff00";

    static typeName = 'howitzer';
    protected range = 600;
    protected fireRate = 1;
    protected projectileSpeed = 1000;
}

export class AK630 extends BaseWeapon {

    public size: number = 6;
    public color: string = "#0000ff";

    static typeName = 'ak630';
    protected range = 200;
    protected fireRate = 5;
    protected projectileSpeed = 1000;
}