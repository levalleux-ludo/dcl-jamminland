import { INoteProps, Instrument } from "./Instrument";
import { Note } from "./note";
import { ISoundHub } from "../soundhub/soundhub";

const bassModelFile = "models/bass_perso_1.gltf";
const soundsPath = "sounds/bass/";
const extension = ".mp3";
var bassNotes: INoteProps[];
export function getBassNotes(): INoteProps[] {
    if (!bassNotes) {
        bassNotes = [];
        let index = 0;
        let cord = 1;
        let position = 0;
        for (let octave of [1,2,3]) {
            for (let letter of ["C", "D", "E", "F", "G", "A", "B"]) {
                if ((octave === 1) && (["C", "D"].indexOf(letter) !== -1)) continue; // start with E1
                let note = letter + octave;
                if (((octave === 1) && (letter === "A"))  ||
                    ((octave === 2) && (letter === "D"))  ||
                    ((octave === 2) && (letter === "G"))
                ) { // change cord
                    bassNotes.push({
                        note: note + "_", index: index, song : soundsPath + note + "_" + extension, extras: {"cord": cord, "position": position}
                    });
                    cord++;
                    position = 0;
                }
                bassNotes.push({
                    note: note, index: index, song : soundsPath + note + extension, extras: {"cord": cord, "position": position}
                });
                index++;
                position++;
                if ((octave === 3) && (letter === "C")) break; // end with C3
                if (["A","C","D","F","G"].indexOf(letter) !== -1) {
                    let note = letter + octave + "_sharp";
                    bassNotes.push({
                        note: note, index: index, song : soundsPath + note + extension, extras: {"cord": cord, "position": position}
                    });
                    index++;
                    position++;
                }
            }
        }
    }
    return bassNotes;
};
let material : Material = null;
const img_fingerprint = new Texture("images/fingerprint.png",{hasAlpha: true});
export class BassNote extends Note {
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
        return "bass";
    }
    animate() {
    }
}

export class Bass extends Instrument<BassNote> {
    constructor(log: (string )=> void, soundHub: ISoundHub, transform: Transform) {
        super(log, soundHub, transform);
        this.createNotes(soundHub, BassNote, getBassNotes());
    }
    getMaterial() {
        return null;
    }
    getShape() {
        return new GLTFShape(bassModelFile);
    }
    getTransformForNote(noteProp: INoteProps): Transform {
        let posX = 0.4;
        let posY = 0.8;
        let posZ = -13.0;
        let noteCord = noteProp.extras['cord'] as number;
        let notePosition = noteProp.extras['position'] as number;
        return new Transform({
            position: new Vector3(posX-(0.2 * noteCord), posY, posZ + 1.2*notePosition -0.1*noteCord),
            rotation: Quaternion.Euler(90,0,0),
            scale: new Vector3(0.4, 1.0, 0.8),
        })
    }
}

