import { Instrument, INoteProps } from "./Instrument";
import { Note } from "./note";
import { ISoundHub } from "../soundhub/soundhub";

const guitarElecModelFile = "models/guitar_elec.gltf";
const soundsPath = "sounds/guitar_elec/";
const extension = ".wav";
var guitarElecNotes: INoteProps[];
export function getGuitarElecNotes(): INoteProps[] {
    if (!guitarElecNotes) {
        guitarElecNotes = [];
        let index = 0;
        let cord = 1;
        let position = 0;
        for (let octave of [2, 3, 4]) {
            for (let letter of ["C", "D", "E", "F", "G", "A", "B"]) {
                if ((octave === 2) && (["C", "D"].indexOf(letter) !== -1)) continue; // start with E2
                let note = letter + octave;
                if (((octave === 2) && (letter === "A"))  ||
                    ((octave === 3) && (letter === "D"))  ||
                    ((octave === 3) && (letter === "G"))  ||
                    ((octave === 3) && (letter === "B"))  ||
                    ((octave === 4) && (letter === "E"))
                ) { // change cord
                    guitarElecNotes.push({
                        note: note + "_", index: index, song : soundsPath + note + extension, extras: {"cord": cord, "position": position}
                    });
                    cord++;
                    position = 0;
                }
                guitarElecNotes.push({
                    note: note, index: index, song : soundsPath + note + extension, extras: {"cord": cord, "position": position}
                });
                index++;
                position++;
                if ((octave === 4) && (letter === "A")) break; // end with A4
                if (["A","C","D","F","G"].indexOf(letter) !== -1) {
                    let note = letter + octave + "_sharp";
                    guitarElecNotes.push({
                        note: note, index: index, song : soundsPath + note + extension, extras: {"cord": cord, "position": position}
                    });
                    index++;
                    position++;
                }
            }
        }
    }
    return guitarElecNotes;
}

let material : Material = null;
const img_fingerprint = new Texture("images/fingerprint2.png",{hasAlpha: true});
export class GuitarElecNote extends Note {
    getShape() {
        return new PlaneShape();
    }
    getMaterial() {
        if (!material) {
            material = new Material()
            material.albedoTexture = img_fingerprint;
            material.hasAlpha = true;
        }
        return material;
    }
    getNoteShape(noteProp: INoteProps) {
        return null;
    }
    getInstrument() {
        return "guitar_elec";
    }
    animate() {
    }
}

export class GuitarElec extends Instrument<GuitarElecNote> {
    constructor(log: (string )=> void, soundHub: ISoundHub, transform: Transform) {
        super(log, soundHub, transform);
        this.createNotes(soundHub, GuitarElecNote, getGuitarElecNotes());
    }
    getMaterial() {
        return null;
    }
    getShape() {
        return new GLTFShape(guitarElecModelFile);
    }
    getTransformForNote(noteProp: INoteProps): Transform {
        let posX = -1.06;
        let posY = 1.1;
        let posZ = -5.7;
        let noteCord = noteProp.extras['cord'] as number;
        let notePosition = noteProp.extras['position'] as number;
        return new Transform({
            position: new Vector3(posX - 0.11*noteCord + 0.07*notePosition, posY, posZ + 0.54*notePosition - 0.04*noteCord),
            rotation: Quaternion.Euler(90,0,-10),
            scale: new Vector3(0.12, 0.5, 0.1),
        })
    }
}