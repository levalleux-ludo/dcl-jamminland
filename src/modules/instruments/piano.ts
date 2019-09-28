import { INoteProps, Instrument } from "./Instrument";
import { Note } from "./note";
import { ISoundHub } from "../soundhub/soundhub";

const pianoModelFile = "models/piano.gltf";
const soundFileExtension = ".mp3";
const keysModelFile = {
    "WHITE": "models/piano_key_white.gltf",
    "BLACK": "models/piano_key_black.gltf"
}
// optim
const keysShape = {
    "WHITE": new GLTFShape(keysModelFile.WHITE),
    "BLACK": new GLTFShape(keysModelFile.BLACK)
}

const soundsPath = "sounds/piano/";
var pianoNotes: INoteProps[];
export function getPianoNotes(): INoteProps[] {
    if (!pianoNotes) {
        pianoNotes = [];
        let index = 0;
        let white_index = 0;
        for (let octave of [1,2,3,4,5,6]) {
            for (let letter of ["C", "D", "E", "F", "G", "A", "B"]) {
                let note = letter + octave;
                let type = "WHITE";
                pianoNotes.push({
                    note: note, index: index, song : soundsPath + note + soundFileExtension, extras: {"type": type, "white_index": white_index}
                });
                index++;
                white_index++;
                if ((octave === 6) && (letter === "C")) break; // end with C6
                if (["A","C","D","F","G"].indexOf(letter) !== -1) {
                    let note = letter + octave + "_sharp";
                    let type = "BLACK";
                    pianoNotes.push({
                        note: note, index: index, song : soundsPath + note + soundFileExtension, extras: {"type": type, "white_index": white_index}
                    });
                    index++;
                }
            }
        }
    }
    return pianoNotes;
};

export class PianoKey extends Note {
    getShape() {
        return null;
    }
    getMaterial() {
        return null;
    }
    getNoteShape(noteProp: INoteProps) {
        let type = noteProp.extras["type"];
        return keysShape[type];
    }
    getInstrument() {
        return "piano";
    }
    animate() {
        new PianoKeyAnimation(this.log, this.entity);
    }
}

export class Piano extends Instrument<PianoKey> {
    constructor(log: (string )=> void, soundHub: ISoundHub, transform: Transform) {
        super(log, soundHub, transform);
        this.createNotes(soundHub, PianoKey, getPianoNotes());
    }
    getMaterial() {
        return null;
    }
    getShape() {
        return new GLTFShape(pianoModelFile);
    }
    getTransformForNote(noteProp: INoteProps): Transform {
        this.log("Piano::getTransformForNote(" + noteProp.note + ", index=" + noteProp.index + ", type=" + noteProp.extras['type'] + ", white_index=" + noteProp.extras['white_index']);
        let white_index = noteProp.extras['white_index'] as number; 
        let scaleX = 0.178;
        let posX = 7.4 - 0.398 * white_index;
        let posY = 6.1;
        let posZ = 0.18;
        if (noteProp.extras['type'] === "BLACK") {
            scaleX = 0.16;
            posY += 0.16;
            posZ -= 0.25;
        } 
        return new Transform({
            position: new Vector3(posX, posY, posZ),
            rotation: Quaternion.Euler(0,0,0),
            scale: new Vector3(scaleX, 0.08, -0.18)
        })
    }
}

class PianoKeyAnimation implements ISystem {
    pressed: boolean = true
    fraction: number = 0
    entity: Entity;
    log: (string )=> void;
    constructor(log: (string )=> void, entity: Entity) {
      this.log = log;
      this.entity = entity;
      engine.addSystem(this);
      this.log("Build a new PianoKeyAnimation");
    };
    update() {
        this.log("PianoKeyAnimation::update()");
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
        transform.rotation = Quaternion.Euler(4 - 4 * this.fraction,transform.rotation.y,transform.rotation.z);
    }
    public start() {
        this.pressed = true;
    }
    public finish() {
        engine.removeSystem(this)
        this.pressed = false;
    }
  }