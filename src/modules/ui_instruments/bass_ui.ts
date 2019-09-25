import { UIInstrument } from "./UIInstrument";

const instrument = "bass";

let imageTexture = new Texture('images/bass_guitar.png');


export class BassUI extends UIInstrument {
    image: UIImage;
    constructor(log: (string )=> void, parent: UIShape) {
        super(log, parent);
        this.image = new UIImage(this.container, imageTexture);
        this.image.hAlign = 'center'
        this.image.positionY = '30%'
        this.image.paddingTop = 50; // under the close button
        this.image.sourceWidth = 417
        this.image.sourceHeight = 178
        this.image.width = `100%`
        this.image.height = `180%`
        this.image.isPointerBlocker = true;
        this.image.opacity = 1.0;
    }
    createNotes() {
    }
    getInstrument() {
        return instrument;
    }
}