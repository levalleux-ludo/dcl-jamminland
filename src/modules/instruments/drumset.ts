import { Instrument, INoteProps } from "./Instrument";
import { Note } from "./note";
import { ISoundHub } from "../soundhub/soundhub";

const modelFile = 'models/drumset_low_poly.gltf';
const soundFileExtension = ".wav";
const drumsModelFile = {
    "cymbal1": "models/cymbal1.gltf",
    "cymbal2": "models/cymbal2.gltf",
    "cymbal3": "models/cymbal3.gltf",
    "snare": "models/snare.gltf",
    "tom1": "models/tom1.gltf",
    "tom2": "models/tom2.gltf",
    "floor": "models/floor.gltf",
    "kick": "models/kick.gltf",
};
const drumsUiImages = {
    "cymbal1": {image: "images/drums_ui_cymbal1.png", sourceWidth: 297, sourceHeight: 110, posX: -209, posY: -5},
    "cymbal2": {image: "images/drums_ui_cymbal2.png", sourceWidth: 282, sourceHeight: 106, posX: -156, posY: 89},
    "cymbal3": {image: "images/drums_ui_cymbal3.png", sourceWidth: 240, sourceHeight: 180, posX: 225, posY: 63},
    "snare": {image: "images/drums_ui_snare.png", sourceWidth: 305, sourceHeight: 146, posX: -200, posY: -105},
    "tom1": {image: "images/drums_ui_tom1.png", sourceWidth: 197, sourceHeight: 105, posX: -53, posY: 38},
    "tom2": {image: "images/drums_ui_tom2.png", sourceWidth: 206, sourceHeight: 114, posX: 95, posY: 38},
    "floor": {image: "images/drums_ui_floor.png", sourceWidth: 297, sourceHeight: 161, posX: 210, posY: -95},
    "kick": {image: "images/drums_ui_kick.png", sourceWidth: 337, sourceHeight: 160, posX: 0, posY: -110},
}

const soundsPath = "sounds/drums/";
var drumsNotes: INoteProps[];
export function getDrumsNotes(): INoteProps[] {
    if (!drumsNotes) {
        drumsNotes = [];
        let index = 0;
        for (let note in drumsModelFile) {
            let soundFile = soundsPath + note + soundFileExtension;
            drumsNotes.push({
                note: note, index: index, song: soundFile, extras: {
                    "model": drumsModelFile[note],
                    "ui_image": drumsUiImages[note].image,
                    "ui_posX": drumsUiImages[note].posX,
                    "ui_posY": drumsUiImages[note].posY,
                    "ui_sourceWidth": drumsUiImages[note].sourceWidth,
                    "ui_sourceHeight": drumsUiImages[note].sourceHeight
                }
            });
            index ++;
        }
    }
    return drumsNotes;
}
const instrument = "drums";

export class DrumSet extends Instrument<DrumItem> {
    constructor(log: (string )=> void, soundHub: ISoundHub, transform: Transform) {
        super(log, soundHub, transform);
        this.createNotes(soundHub, DrumItem, getDrumsNotes());
    }
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
    // constructor (log: (string )=> void, transform: Transform, parent: Entity, noteProp: INoteProps) {
    //     super(log, transform, parent, noteProp);
    // }
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
        return new GLTFShape(noteProp.extras["model"] as string);
    }
    animate() {

    }
}