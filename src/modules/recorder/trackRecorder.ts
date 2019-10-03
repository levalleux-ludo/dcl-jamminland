import { Tempo } from "./tempo";
import { IInstrumentRecorder, ISoundHub } from "../soundhub/soundhub";
import { AbstractRecorder } from "./abstractRecorder";

export class TrackRecorder extends AbstractRecorder {
    tempo: Tempo;
    _record: { [s:number]: string;}  = <any>{};
    startTime = 0;
    recLength = 0;
    constructor(log: (string )=> void, soundHub: ISoundHub, tempo: Tempo) {
        super(log, soundHub);
        this.tempo = tempo;
    }
    protected recordNote(note: string) {
        let recTime = this.tempo.getCurrentTime() - this.startTime; 
        this.log(`TrackRecorder : Record ${this.instrument} note ${note} at time ${recTime}`);
        this._record[recTime] = note;
        this.recLength = recTime;
    }
    protected onRecordStart() {
        this._record = <any>{};
        this.startTime = this.tempo.getCurrentTime();
        this.recLength = 0;      
    }
    protected onRecordStop() {
        this.log(`TrackRecorder : Stop recording ${this.instrument}. Record length : ${this.recLength}`);
    }
    protected onReset() {
        this._record = <any>{};
        this.startTime = 0;
        this.recLength = 0;
    }
    protected onPlayStart() {
        this.startTime = this.tempo.getCurrentTime();
        this.tempo.registerOnUpBeat((currentTime, currentUpBeatInPhrase) => {
            if (this.isPlaying) {
                let recTime = currentTime - this.startTime; 
                if (recTime in this._record) {
                    let note = this._record[recTime];
                    this.log(`TrackRecorder : Play ${this.instrument} note ${note} at time ${recTime}`);
                    this.soundHub.onPlayNote(this.instrument, note);
                }
                if (recTime >= this.recLength) {
                    this.log(`TrackRecorder : Record is finished after time ${recTime}`);
                    this.stop();
                    if (this.endOfPlaying) this.endOfPlaying();
                }
            }
        });
    }
    protected onPlayStop() {
    }
}