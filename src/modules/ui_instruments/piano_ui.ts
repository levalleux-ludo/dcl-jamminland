import { UIInstrument } from "./UIInstrument";
import { ImageContainer } from "../image_container";
import { ISoundHub } from "../soundhub/soundhub";
import { getPianoNotes } from "../instruments/piano";
import { INoteProps } from "../instruments/Instrument";
import { TextureBuilder } from "../_helpers/texture_builder";

const instrument = "piano";

const textureBuilder = new TextureBuilder({
    "white": "images/white_key.png",
    "green": "images/green_key.png",
    "black": "images/black_key.png",
    "black_pressed": "images/black_key_pressed.png"
});

export class PianoUI extends UIInstrument {

    protected buildControls() {
        this.createNotes(getPianoNotes());
    }
    createNotes(noteProps: INoteProps[]) {
        let offsetX = 19.5;
        let posX = -300;
        let posY = -150;
        let blackKeys = [];
        for (let noteProp of noteProps) {
            let noteType = noteProp.extras['type'] as string;
            if (noteType === "WHITE") {
                let imageContainer = new ImageContainer(this.container);
                imageContainer.container().width = offsetX-0.8;
                imageContainer.container().positionX = posX;
                imageContainer.container().positionY = posY;
                // Specific to white key
                imageContainer.registerImage('released', textureBuilder.get('white'), 23, 117);
                imageContainer.registerImage('pressed', textureBuilder.get('green'), 24, 117);
                imageContainer.container().height = 150;
                posX += offsetX;
                // End specific
                imageContainer.registerOnClickImage('released', new OnClick(event => {
                    this.log(`PianoUI : Press on key ${noteProp.note}`);
                    this.onClickCallback(noteProp.note);
                }));
                imageContainer.makeOneVisible('released');
            } else if (noteType === "BLACK") {
                // Differ the black keys to get them on top of white ones
                blackKeys.push({key:noteProp.note, posX:posX - 0.5*offsetX});
            }
        }
        for (let blackKey of blackKeys) {
            let imageContainer = new ImageContainer(this.container);
            imageContainer.container().width = offsetX-1.0;
            imageContainer.container().positionX = blackKey.posX;
            imageContainer.container().positionY = posY+25;
            // Specific to black key
            imageContainer.registerImage('released', textureBuilder.get('black'), 24, 117);
            imageContainer.registerImage('pressed', textureBuilder.get('black_pressed'), 24, 117);
            imageContainer.container().height = 100;
            // End specific
            imageContainer.registerOnClickImage('released', new OnClick(event => {
                this.log(`PianoUI : Press on key ${blackKey.key}`);
                this.onClickCallback(blackKey.key);
            }));
            imageContainer.makeOneVisible('released');
        }
    }
    getInstrument() {
        return instrument;
    }

}