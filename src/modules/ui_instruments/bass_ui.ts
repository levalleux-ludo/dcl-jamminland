import { UIInstrument } from "./UIInstrument";
import { ISoundHub, INoteController } from "../soundhub/soundhub";
import { INoteProps } from "../instruments/Instrument";
import { getBassNotes } from "../instruments/bass";

const instrument = "bass";

let imageTexture = new Texture('images/bass_guitar.png');


export class BassUI extends UIInstrument {
    image: UIImage;
    constructor(log: (string )=> void, parent: UIShape, soundHub: ISoundHub) {
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

        const toolName = new UIText(this.container)
        toolName.value = "Bass Guitar"
        toolName.fontSize = 20
        toolName.vAlign = 'top'
        toolName.width = '150px'
        toolName.height = '35px'
        toolName.positionX = 20
        toolName.paddingTop = -10
        toolName.color = Color4.FromHexString('#0F1217ff')

        const closeIcon = new UIImage(this.container, new Texture('images/close-icon3.png'))
        closeIcon.name = 'clickable-image'
        closeIcon.width = '50px'
        closeIcon.height = '50px'
        closeIcon.hAlign = 'right'
        closeIcon.vAlign = 'top'
        closeIcon.sourceWidth = 128
        closeIcon.sourceHeight = 128
        closeIcon.isPointerBlocker = true
        closeIcon.onClick = new OnClick(() => {
            this.hide();
        });

        this.createNotes(soundHub, getBassNotes());

    }
    createNotes(soundHub: ISoundHub, noteProps: INoteProps[]) {
        let tabPositionX = ['32.5%', '25%', '18.7%', '12.6%', '6.7%', '1.0%'];
        let cordPositionY = ['7%', '3%', '-1%', '-5%'];
        for (let noteProp of noteProps) {
            let noteCord = noteProp.extras['cord'] as number;
            let notePosition = noteProp.extras['position'] as number;
            let item = new BassItemUI(this.log, this.image, noteProp.note, tabPositionX[notePosition], cordPositionY[noteCord-1]);
            item.setSoundHub(soundHub);
        }

    }
    getInstrument() {
        return instrument;
    }
}

const imageItem = new Texture ("images/bassItemUI.png", {hasAlpha: true});

export class BassItemUI implements INoteController {
    note: string;
    instrument = "bass";
    image: UIImage;
    log: (string )=> void;

    constructor(log: (string )=> void, parent: UIShape, note: string, posX, posY) {
        this.log = log;
        this.image = new UIImage(parent, imageItem);
        this.image.positionX = posX;
        this.image.positionY = posY;
        this.image.sourceWidth = 680 ;   
        this.image.sourceHeight = 518;
        this.image.width = 30;
        this.image.height = 14;
        this.note = note;
        this.image.isPointerBlocker = true;
        this.image.onClick = new OnClick(event => {this.onClickCallback();});
    }

    soundHub: ISoundHub;
    // **** INoteController implementation ****
    _onPlayedNoteCallbacks: ((instrument: string, note: string)=>void)[] = [];
    public setSoundHub(soundHub: ISoundHub) {
        this.soundHub = soundHub;
        this.soundHub.registerNoteController(this);
    } 
    public registerOnPlayedNote(onPlayNote: (instrument: string, note: string)=> void) {
        // allow registering to allow recording from UI
        this._onPlayedNoteCallbacks.push(onPlayNote);
    }
    public getInstrument() {
        return this.instrument;
    }
    public getNote() {
        return this.note;
    }
    // ****************************************

    notifyPlaying() {
        // Notify listeners to allow recording
        this.log(`BassItemUI : play note ${this.note}`);
        this._onPlayedNoteCallbacks.forEach(onPlayNote => {
            onPlayNote.call(this, this.instrument, this.note);
        })
    }

    private onClickCallback() {
        // relay towards the 3D entity containing the sound Component
        this.soundHub.onPlayNote(this.instrument, this.note);
        this.notifyPlaying();
    }

}