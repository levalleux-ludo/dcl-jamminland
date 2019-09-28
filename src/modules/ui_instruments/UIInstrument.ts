import { INoteController, ISoundHub } from "../soundhub/soundhub";
import { INoteProps } from "../instruments/Instrument";
import { UIWrapper } from "../ui_wrapper";

export abstract class UIInstrument extends UIWrapper implements INoteController {
    public abstract getInstrument(): string;
    public abstract createNotes(soundHub: ISoundHub, noteProps: INoteProps[]);

    soundHub: ISoundHub;
    constructor(log: (string )=> void, parent: UIShape) {
        super(log, parent);
        this.addCloseButton();
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
    protected onClickCallback(note) {
        // relay towards the 3D entity containing the sound Component
        this.soundHub.onPlayNote(this.getInstrument(), note);
        this.notifyPlaying(note);
    }

}