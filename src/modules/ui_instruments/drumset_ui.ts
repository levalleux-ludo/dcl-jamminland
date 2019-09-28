import { UIInstrument } from "./UIInstrument";
import { ISoundHub } from "../soundhub/soundhub";
import { INoteProps } from "../instruments/Instrument";
import { ImageContainer } from "../image_container";
import { getDrumsNotes } from "../instruments/drumset";

const instrument = "drums";
let imageTexture = new Texture('images/drumset_ui.png');
let imageSourceWidth = 973;
let imageSourceHeight = 401;
let uiWidth = 600;
let uiHeight = 300;

export class DrumSetUI extends UIInstrument {
    image: UIImage;
    constructor(log: (string )=> void, parent: UIShape) {
        super(log, parent);
        // this.container.width = 640;
        // this.container.hAlign = 'left';

        this.image = new UIImage(this.container, imageTexture);
        this.image.hAlign = 'right'
        this.image.vAlign = 'top'
        // this.image.positionY = -100;
        this.image.paddingTop = 100; // under the close button
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


        // const toolName = new UIText(this.container)
        // toolName.value = "Drums"
        // toolName.fontSize = 20
        // toolName.vAlign = 'top'
        // toolName.width = '150px'
        // toolName.height = '35px'
        // toolName.positionX = 20
        // toolName.paddingTop = -10
        // toolName.color = Color4.FromHexString('#0F1217ff')

        
    }
    public setSoundHub(soundHub: ISoundHub) {
        super.setSoundHub(soundHub);
        this.createNotes(soundHub, getDrumsNotes());
    }
    createNotes(soundHub: ISoundHub, noteProps: INoteProps[]) {
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