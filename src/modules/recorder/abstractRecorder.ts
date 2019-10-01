import { Tempo } from "./tempo";
import { IInstrumentRecorder, ISoundHub } from "../soundhub/soundhub";
import { Instrument } from "../instruments/Instrument";

export abstract class AbstractRecorder implements IInstrumentRecorder {
    protected log: (string )=> void;
    protected instrument: string;
    protected soundHub: ISoundHub;
    protected isRecording = false;
    protected isPlaying = false;
    protected hasRecord_ = false;
    protected endOfPlaying: () => void;
    constructor(log: (string )=> void, soundHub: ISoundHub) {
        this.log = log;
        this.setSoundHub(soundHub);
    }
    public setActiveInstrument(instrument: string) {
        if (this.hasRecord()) {
            this.log("[WARN] AbstractRecorder() : unable to change active instrument because currently has record. Use reset() before");
        }
        let old_instru = this.instrument;
        if (old_instru) {
            this.soundHub.unregisterRecorder(this);
        }
        this.instrument = instrument;
        // this.log("soundHub.registerRecorder, soundHub=" + JSON.stringify(this.soundHub));
        this.soundHub.registerRecorder(this);
    }
    protected abstract recordNote(note: string);
    protected abstract onRecordStart();
    protected abstract onRecordStop();
    protected abstract onPlayStart();
    protected abstract onPlayStop();
    protected abstract onReset();
    public setSoundHub(soundHub: ISoundHub) {
        this.soundHub = soundHub;
    }
    public onPlayedNote = (note: string) => {
        if (this.isRecording) {
            this.recordNote(note);
        }
    }
    public getInstrument() {
        return this.instrument;
    }
    public startRecording() {
        if (!this.instrument) {
            this.log("[WARN] AbstractRecorder() : unable to start recording because there is no active instrument defined");
            return;
        }
        if (!this.isRecording && !this.isPlaying) {
            this.log("START RECORDING !!!");
            this.isRecording = true;
            this.hasRecord_ = true;
            this.onRecordStart();
        }
    }
    public stop() {
        if (this.isRecording) {
            this.log("STOP RECORDING !!!");
            this.isRecording = false;
            this.onRecordStop();
        }
        if (this.isPlaying) {
            this.log("STOP PLAYING !!!");
            this.isPlaying = false;
            this.onPlayStop();
        }
    }
    public startPlaying(endOfPlaying: () => void) {
        if (!this.hasRecord()) {
            this.log("[WARN] AbstractRecorder() : unable to start playing because there is no record yet");
            return;
        }
        if (!this.isPlaying && !this.isRecording) {
            this.endOfPlaying = endOfPlaying;
            this.log("START PLAYING !!!");
            this.isPlaying = true;
            this.onPlayStart();
        }
    }
    public reset() {
        if (!this.isPlaying && !this.isRecording) {
            this.hasRecord_ = false;
            this.onReset();
        } else {
            this.log("[WARN] AbstractRecorder() : unable to reset record because currently playing/recording");
        }
    }

    public hasRecord(): boolean {
        return this.hasRecord_;
    }
}