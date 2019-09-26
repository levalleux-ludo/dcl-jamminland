import { EntityWrapper } from "./entity_wrapper";

export class PushButton extends EntityWrapper {
    pressedScaleRatio = 0.3;
    constructor(log: (string )=> void, transform: Transform, image: string, onPushed: ()=>void, parent?: Entity) {
        super(log, transform, parent);
        let label = new Entity();
        this.entity.addComponentOrReplace(this.getMaterial());
        label.setParent(this.entity);
        label.addComponent(new BoxShape());
        label.addComponent(new Transform({
            position: new Vector3(0.5,0,0),
            rotation: Quaternion.Euler(90,0,0),
            scale: new Vector3(0.01,1.0,1.0)
        }));
        const materialLabel = new Material();
        materialLabel.albedoTexture = new Texture(image);
        label.addComponent(materialLabel);
        label.addComponent(new OnClick(e => {
            let anim = new PushButtonAnimation(this.log, this.entity, (fraction) => {
                let transform = this.entity.getComponent(Transform);
                let scaleX = transform.scale.x * (1 - fraction * this.pressedScaleRatio);
                transform.scale = new Vector3(scaleX,transform.scale.y,transform.scale.z)
            });
            if (onPushed) onPushed();
        }));
    }

    getShape() {
        return new BoxShape();
    }
    getMaterial() {
        return null;
    }
}

class PushButtonAnimation implements ISystem {
    up: boolean = false;
    down: boolean = false;
    fraction: number = 0;
    increment_up: number = 0.25;
    increment_down: number = 0.25;
    entity: Entity;
    log: (string )=> void;
    transformFn: (number)=> void;
    constructor(log: (string) => void, entity: Entity, transformFn: (number) => void) {
      this.log = log;
      this.entity = entity;
      this.transformFn = transformFn;
    };
    update() {
        let transform = this.entity.getComponent(Transform)
        if (this.up && (this.fraction < 1)){
            this.fraction += this.increment_up;
        }
        if (this.down && (this.fraction > 0)) {
            this.fraction -= this.increment_down;
        }
        this.log("PushButtonAnimation() fraction=" + this.fraction);
        if (this.fraction <= 0) { // end now
            this.finish();
            return;
        }
        if (this.fraction >= 1) { // reverse
            this.up = false;
            this.down = true;
        }
        this.transformFn(this.fraction);
    }
    public start() {
        engine.addSystem(this);
        this.up = true;
    }
    public finish() {
        engine.removeSystem(this)
        this.fraction = 0;
        this.up = false;
        this.down = false;
        this.transformFn(this.fraction);
    }
  }