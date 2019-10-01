import { Tempo } from "./tempo";
import { IInstrumentRecorder, ISoundHub } from "../soundhub/soundhub";
import { AbstractRecorder } from "./abstractRecorder";

export class LoopRecorder extends AbstractRecorder {
    tempo: Tempo;
    _record: { [s:number]: string;}  = <any>{};
    startTime = 0;
    recLength = 0;
    isWaiting = false;
    constructor(log: (string )=> void, soundHub: ISoundHub, tempo: Tempo) {
        super(log, soundHub);
        this.tempo = tempo;
        this.tempo.registerOnBar((currentPhrase: number, currentBar: number) => {this.onBarEvent(currentPhrase, currentBar)});
        this.tempo.registerOnUpBeat((currentTime: number) => {this.onUpBeat(currentTime)});
    }
    protected onUpBeat(currentTime: number) {
        if (this.isPlaying && !this.isWaiting) {
            let recTime = currentTime - this.startTime; 
            if (recTime in this._record) {
                let note = this._record[recTime];
                this.log(`LoopRecorder : Play ${this.instrument} note ${note} at time ${recTime}`);
                this.soundHub.onPlayNote(this.instrument, note);
            }
            if (recTime >= this.recLength) {
                this.log(`LoopRecorder : Record is finished after time ${recTime}`);
                this.stop();
                if (this.endOfPlaying) {
                    this.endOfPlaying();
                    // If the play is immediately set there, dont wait a phrase more
                    this.isWaiting = false;
                    this.startTime = this.tempo.getCurrentTime();
                }
            }
        }
    }
    protected onBarEvent(currentPhrase: number, currentBar: number) {
        if (this.tempo.getCurrentBeatInPhrase() === 0) {
            this.log("LoopRecorder: currentPhrase=" + currentPhrase + ", currentBar=" + currentBar + ", currentBeatInPhrase=" + this.tempo.getCurrentBeatInPhrase());
            if (this.isRecording) {
                // RECORDING
                if (this.isWaiting) {
                    // Start real recording now
                    this.isWaiting = false;
                    this.startTime = this.tempo.getCurrentTime();
                    this.recLength = 0;
                } else {
                    this.log(`LoopRecorder : Record finishes automatically`);
                    this.stop();
                    if (this.endOfRecording) {
                        this.endOfRecording();
                        // If the play is immediately set there, dont wait a phrase more
                        this.isWaiting = false;
                        this.startTime = this.tempo.getCurrentTime();
                    }
                }
            } else if (this.isPlaying) {
                // PLAYING
                if (this.isWaiting) {
                    // Start real playing now
                    this.isWaiting = false;
                    this.startTime = this.tempo.getCurrentTime();
                }
            }
           
        }
    }
    protected recordNote(note: string) {
        if (!this.isWaiting) {
            let recTime = this.tempo.getCurrentTime() - this.startTime; 
            this.log(`LoopRecorder : Record ${this.instrument} note ${note} at time ${recTime}`);
            this._record[recTime] = note;
            this.recLength = recTime;
        }
    }
    protected onRecordStart() {
        this._record = <any>{};
        this.isWaiting = true; // wait for the next 1st beat of the phrase
    }
    protected onRecordStop() {
        this.log(`LoopRecorder : Stop recording ${this.instrument}. Record length : ${this.recLength}`);
    }
    protected onReset() {
        this._record = <any>{};
        this.startTime = 0;
        this.recLength = 0;
    }
    protected onPlayStart() {
        this.isWaiting = true;
    }
    protected onPlayStop() {
    }
}