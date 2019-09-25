import { Tempo } from "./tempo";
import { IInstrumentRecorder, ISoundHub } from "../soundhub/soundhub";

export class TrackRecorder implements IInstrumentRecorder {
    log: (string )=> void;
    instrument: string;
    soundHub: ISoundHub;
    tempo: Tempo;
    isRecording = false;
    isPlaying = false;
    _record: { [s:number]: string;}  = <any>{};
    startTime = 0;
    recLength = 0;
    constructor(log: (string )=> void, instrument:string, soundHub: ISoundHub, tempo: Tempo) {
        this.log = log;
        this.instrument = instrument;
        this.soundHub = soundHub;
        this.tempo = tempo;
        this.setSoundHub(soundHub);
    }
    public setSoundHub(soundHub: ISoundHub) {
        soundHub.registerRecorder(this);
    }
    public onPlayedNote = (note: string) => {
        this.log(`recorder for instrument ${this.instrument} is recording note ${note}`);
        if (this.isRecording) {
            let recTime = this.tempo.getCurrentTime() - this.startTime; 
            this._record[recTime] = note;
            this.recLength = recTime;
            this.log(`Recording instrument ${this.instrument} note ${note} at time ${recTime}`);
        }
    }
    public getInstrument() {
        this.log("getInstrument() -> " + this.instrument);
        return this.instrument;
    }
    public startRecording() {
        if (!this.isRecording && !this.isPlaying) {
            this._record = <any>{};
            this.log("START RECORDING !!!");
            this.startTime = this.tempo.getCurrentTime();
            this.recLength = 0;
            this.isRecording = true;
        }
    }
    public stop() {
        if (this.isRecording) {
            this.log("STOP RECORDING !!!");
            this.isRecording = false;
        }
        if (this.isPlaying) {
            this.log("STOP PLAYING !!!");
            this.isPlaying = false;
        }
    }
    endOfPlaying: () => void;
    public startPlaying(endOfPlaying: () => void) {
        if (!this.isPlaying && !this.isRecording) {
            this.log("START PLAYING !!!");
            this.startTime = this.tempo.getCurrentTime();
            this.isPlaying = true;
            this.tempo.registerOnUpBeat(currentTime => {
                if (this.isPlaying) {
                    let recTime = currentTime - this.startTime; 
                    if (recTime in this._record) {
                        let note = this._record[recTime];
                        this.log(`Play ${this.instrument} note ${note} at time ${recTime}`);
                        this.soundHub.onPlayNote(this.instrument, note);
                    }
                    if (recTime >= this.recLength) {
                        this.stop();
                        endOfPlaying();
                    }
                }
            });
        }
    }
}