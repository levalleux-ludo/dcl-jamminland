import { EntityWrapper } from "./entity_wrapper";

// const modelFile = 'models/land.glb';
const modelFile = 'models/land1.gltf';

export class Land extends EntityWrapper {
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