export class Saloon {
    entity: Entity;
    constructor() {
        this.entity = new Entity();
        // this.entity.addComponent(new BoxShape());
        this.entity.addComponent(
            new Transform({
                position: new Vector3(16, -0.1, 16),
                rotation: Quaternion.Euler(0, 0 ,0),
                scale: new Vector3(0.3, 0.3, 0.3)
            }));
            // new Transform(
            //     {
            //         position: new Vector3(1.0, 1.0, 1.0),
            //         scale: new Vector3(10.2, 10.2, 10.2),
            //         rotation: Quaternion.Euler(0.0, 0.0, 0.0)
            //     }));
        this.entity.addComponent(new GLTFShape('models/saloon.gltf'));
        engine.addEntity(this.entity);
    }
}