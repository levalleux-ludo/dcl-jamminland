import { Tempo } from "./tempo";
import { IInstrumentRecorder, ISoundHub } from "../soundhub/soundhub";

export abstract class AbstractRecorder implements IInstrumentRecorder {
    protected log: (string )=> void;
    protected instrument: string;
    protected soundHub: ISoundHub;
    protected isRecording = false;
    protected isPlaying = false;
    protected endOfPlaying: () => void;
    constructor(log: (string )=> void, instrument:string, soundHub: ISoundHub) {
        this.log = log;
        this.instrument = instrument;
        this.setSoundHub(soundHub);
    }
    protected abstract recordNote(note: string);
    protected abstract onRecordStart();
    protected abstract onRecordStop();
    protected abstract onPlayStart();
    protected abstract onPlayStop();
    public setSoundHub(soundHub: ISoundHub) {
        this.soundHub = soundHub;
        this.log("soundHub.registerRecorder, soundHub=" + JSON.stringify(soundHub));
        soundHub.registerRecorder(this);
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
        if (!this.isRecording && !this.isPlaying) {
            this.log("START RECORDING !!!");
            this.isRecording = true;
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
        if (!this.isPlaying && !this.isRecording) {
            this.endOfPlaying = endOfPlaying;
            this.log("START PLAYING !!!");
            this.isPlaying = true;
            this.onPlayStart();
        }
    }
}