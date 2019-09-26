import { Instrument, INoteProps } from "./Instrument";
import { Note } from "./note";

const modelFile = 'models/drumset_low_poly.gltf';

const instrument = "drums";

export class DrumSet extends Instrument<DrumItem> {
    getMaterial() {
        return null;
    }
    getShape() {
        return new GLTFShape(modelFile);
    }
    getTransformForNote(noteProp: INoteProps) {
        return new Transform({
            position: new Vector3(0.0, 0.0, 0.0)
        })
    }
}

export class DrumItem extends Note {
    getInstrument() {
        return instrument;
    }
    getMaterial() {
        return null;
    }
    getShape() {
        return null;
    }
    getNoteShape(noteProp: INoteProps) {
        return null;
    }
    animate() {

    }
}