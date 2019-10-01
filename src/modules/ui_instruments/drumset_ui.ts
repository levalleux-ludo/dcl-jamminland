import { UIInstrument } from "./UIInstrument";
import { ISoundHub } from "../soundhub/soundhub";
import { INoteProps } from "../instruments/Instrument";
import { ImageContainer } from "../image_container";
import { getDrumsNotes } from "../instruments/drumset";
import { TextureBuilder } from "../_helpers/texture_builder";

const instrument = "drums";
const textureBuilder = new TextureBuilder({
    'background': 'images/drumset_ui.png'
});
let imageSourceWidth = 973;
let imageSourceHeight = 401;
let uiWidth = 600;
let uiHeight = 350;

export class DrumSetUI extends UIInstrument {
    image: UIImage;
    constructor(log: (string )=> void, parent: UIShape, soundHub: ISoundHub) {
        super(log, parent, soundHub);
    }
    protected buildControls() {
        this.image = new UIImage(this.container, textureBuilder.get('background'));
        this.image.hAlign = 'center'
        this.image.vAlign = 'top'
        // this.image.positionY = -100;
        // this.image.paddingTop = 100; // under the close button
        // this.image.paddingLeft = 100;
        this.image.sourceWidth = imageSourceWidth;
        this.image.sourceHeight = imageSourceHeight;
        this.image.width = uiWidth
        this.image.height = uiHeight
        this.image.isPointerBlocker = true;
        this.image.opacity = 1.0;
        this.image.onClick = new OnClick(() => {
            this.log("On click DrumSet_ui");
        });
        
        this.createNotes(getDrumsNotes());
    }
    createNotes(noteProps: INoteProps[]) {
        let offsetY = -80;
        for (let noteProp of noteProps) {
            let imageSource = noteProp.extras["ui_image"] as string;
            let posX = noteProp.extras["ui_posX"] as number;
            let posY = noteProp.extras["ui_posY"] as number + offsetY;
            let sourceWidth = noteProp.extras["ui_sourceWidth"] as number;
            let sourceHeight = noteProp.extras["ui_sourceHeight"] as number;
            this.log("DrumSetUI : Add image " + imageSource + " at position " + posX + ", " + posY)
            let imageContainer = new ImageContainer(this.container);
            let width = Math.round(sourceWidth*uiWidth/imageSourceWidth);
            let height = Math.round(sourceHeight*uiHeight/imageSourceHeight);
            imageContainer.container().width =  width;
            imageContainer.container().height =  height;
            imageContainer.container().positionX = posX;
            imageContainer.container().positionY = posY;
            imageContainer.registerImage('normal', new Texture(imageSource), sourceWidth, sourceHeight);
            // End specific
            imageContainer.registerOnClickImage('normal', new OnClick(event => {
                this.log(`DrumSetUI : Press on key ${noteProp.note}`);
                this.onClickCallback(noteProp.note);
            }));
            imageContainer.makeOneVisible('normal');
        }
    }
    getInstrument() {
        return instrument;
    }
}