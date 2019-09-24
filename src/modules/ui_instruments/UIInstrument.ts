import { INoteController, ISoundHub } from "../soundhub/soundhub";
import { INoteProps } from "../instruments/Instrument";

export abstract class UIInstrument implements INoteController {
    public abstract getInstrument(): string;
    public abstract createNotes(soundHub: ISoundHub, noteProps: INoteProps[]);
    public display() {
        this.container.visible = true;
    }

    container: UIContainerRect;
    soundHub: ISoundHub;
    log: (string )=> void;
    constructor(log: (string )=> void, parent: UIShape) {
        this.log = log;
        this.container = new UIContainerRect(parent);
        this.container.width = '100%';
        this.container.height = '33%';
        this.container.hAlign = 'center';
        this.container.vAlign = 'top';
        this.container.isPointerBlocker = true;
        this.container.visible = false;
    }
    // **** INoteController implementation ****
    _onPlayedNoteCallbacks: ((instrument: string, note: string)=>void)[] = [];
    public setSoundHub(soundHub: ISoundHub) {
        this.soundHub = soundHub;
        soundHub.registerNoteController(this);
    }
    public registerOnPlayedNote(onPlayNote: (instrument: string, note: string)=> void) {
        // allow registering to allow recording from UI
        this._onPlayedNoteCallbacks.push(onPlayNote);
    }
    // ****************************************

    notifyPlaying(note) {
        // Notify listeners to allow recording
        this.log(`PianoItemUI : play note ${note}`);
        this._onPlayedNoteCallbacks.forEach(onPlayNote => {
            onPlayNote.call(this, this.getInstrument(), note);
        })
    }
    private onClickCallback(note) {
        // relay towards the 3D entity containing the sound Component
        this.soundHub.onPlayNote(this.getInstrument(), note);
        this.notifyPlaying(note);
    }

}