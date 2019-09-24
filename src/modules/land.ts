// const modelFile = 'models/land.glb';
const modelFile = 'models/land1.gltf';

export class Land {
    entity: Entity;
    constructor(transform: Transform) {
        this.entity = new Entity();
        this.entity.addComponent(transform);
        this.entity.addComponent(new GLTFShape(modelFile));
        engine.addEntity(this.entity);
    }
}