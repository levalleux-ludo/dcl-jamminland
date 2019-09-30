import { EntityWrapper } from "./entity_wrapper";

const modelFile = 'models/music_hall_1.gltf';

export class MusicHall extends EntityWrapper {
    entity: Entity;
    constructor(log: (string )=> void, transform: Transform, parent: Entity) {
        super(log, transform, parent);
    }
    getMaterial() {
        return null;
    }
    getShape() {
        return new GLTFShape(modelFile);
    }
}