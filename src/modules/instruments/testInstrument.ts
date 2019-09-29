import { Note } from "./note";
import { Instrument, INoteProps } from "./Instrument";
import { ISoundHub } from "../soundhub/soundhub";

const keyProps: INoteProps[] = [
    {note: "A1", index: 0, song : 'sounds/piano/C4.mp3', extras: {"type": "white"}},
    {note: "A2", index: 1, song : 'sounds/piano/C4.mp3', extras: {"type": "black"}}
];

const instrument = 'test';

export class TestKey extends Note {
    constructor(log: (string )=> void, transform: Transform, parent: Entity, noteProp: INoteProps) {
        super(log, transform, parent, noteProp);
    }
    getMaterial(): Material {
        let mat = new Material();
        mat.albedoColor = Color3.Blue();
        return mat;
    }
    getShape(): Shape {
        return new BoxShape();
    }
    getNoteShape(noteProp: INoteProps): Shape {
        let keyType = noteProp.extras["type"];
        this.log("TestKey::getNoteShape() : keyType " + keyType);
        return new BoxShape();
    }
    getInstrument(): string {
        return instrument;
    }
    animate() {
        new TestKeyAnimation(this.log, this.entity);
    }
}

export class TestInstrument extends Instrument<TestKey> {
    constructor(log: (string )=> void, soundHub: ISoundHub, transform: Transform, parent: Entity) {
        super(log, soundHub, transform, parent);
    }
    protected createYourNotes(soundHub: ISoundHub) {
        this.createNotes(null, TestKey, keyProps);
    }
    getMaterial() {
        let mat = new Material();
        mat.albedoColor = Color3.Red();
        return mat;
    }
    getShape() {
        return new BoxShape();
    }
    getTransformForNote(noteProp: INoteProps) {
        let index = noteProp.index;
        return new Transform({
            position: new Vector3(1+index, 0.0, 0.0)
        });
    }
}

export class TestKeyAnimation implements ISystem {
  pressed: boolean = true
  fraction: number = 0
  entity: Entity;
  log: (string )=> void;
  constructor(log: (string )=> void, entity: Entity) {
    this.log = log;
    this.entity = entity;
    engine.addSystem(this);
    this.log("Build a new TestKeyAnimation");
  };
  update() {
      this.log("TestKeyAnimation::update()");
    let transform = this.entity.getComponent(Transform)
    if ((this.pressed == true) && (this.fraction < 1)) {
        this.fraction += 1/4;
      } else {
        if ((this.pressed == false) && (this.fraction > 0)) {
            this.fraction -= 1/2;
        }
      }
      if (this.fraction >= 1) {
        this.fraction = 1;
        this.finish();
      }
      if (this.fraction <= 0) {
        this.fraction = 0;
      }
      transform.rotation = Quaternion.Euler(4 * this.fraction,transform.rotation.y,transform.rotation.z);
  }
  public start() {
      this.pressed = true;
  }
  public finish() {
      engine.removeSystem(this)
      this.pressed = false;
  }
}
