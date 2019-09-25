import { EntityWrapper } from "../entity_wrapper";

export class Recorder3D extends EntityWrapper {
    getShape() {
        return new GLTFShape('models/recorder.gltf');
    }
    getMaterial() {
        return null;
    }
}