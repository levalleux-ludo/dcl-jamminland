import { EntityWrapper } from "./entity_wrapper";

const modelFile = 'models/musichall.gltf';

export class MusicHall extends EntityWrapper {
    entity: Entity;
    constructor(log: (string )=> void, transform: Transform) {
        super(log, transform);
    }
    getMaterial() {
        return null;
    }
    getShape() {
        return new GLTFShape(modelFile);
    }
}