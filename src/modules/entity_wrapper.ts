export abstract class EntityWrapper {
    protected log: (string )=> void;
    protected entity: Entity;
    constructor (log: (string )=> void, transform: Transform, parent: Entity) {
        this.log = log;
        this.entity = new Entity();
        this.entity.addComponent(transform);
        let shape = this.getShape();
        if (shape) this.entity.addComponent(shape);
        let material = this.getMaterial();
        if (material) this.entity.addComponent(material);
        this.entity.setParent(parent);
    }
    protected abstract getShape(): Shape;
    protected abstract getMaterial(): Material;
    public getEntity() {
        return this.entity;
    }
}