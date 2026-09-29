import { Vector2D } from "./interfaces";

export function VectorDistance(V1: Vector2D, V2: Vector2D) {
    return Math.sqrt((V2.x - V1.x)**2 + (V2.y - V1.y)**2)
}