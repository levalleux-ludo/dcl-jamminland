import { INoteController, ISoundHub } from "../soundhub/soundhub";
import { INoteProps } from "../instruments/Instrument";
import { UIWrapper } from "../ui_wrapper";

export abstract class UIInstrument extends UIWrapper implements INoteController {
    public abstract getInstrument(): string;
    public abstract createNotes(noteProps: INoteProps[]);

    soundHub: ISoundHub;
    constructor(log: (string )=> void, parent: UIShape) {
        super(log, parent);
    }
    protected buildControls() {
    }
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
    // ****************************************

    notifyPlaying(note) {
        // Notify listeners to allow recording
        this.log(`InstrumentUI : play note ${note}`);
        this._onPlayedNoteCallbacks.forEach(onPlayNote => {
            onPlayNote.call(this, this.getInstrument(), note);
        })
    }
    protected onClickCallback(note) {
        if (!this.soundHub) {
            this.log("[WARN] UIInstrument::onClickCallback -> soundHub is not defined");
            return;
        }
        // relay towards the 3D entity containing the sound Component
        this.soundHub.onPlayNote(this.getInstrument(), note);
        this.notifyPlaying(note);
    }

}