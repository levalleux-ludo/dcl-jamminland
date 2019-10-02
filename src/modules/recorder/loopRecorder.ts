import { Tempo } from "./tempo";
import { IInstrumentRecorder, ISoundHub } from "../soundhub/soundhub";
import { AbstractRecorder } from "./abstractRecorder";

export class LoopRecorder extends AbstractRecorder {
    tempo: Tempo;
    _record: { [s:number]: string;}  = <any>{};
    startTime = 0;
    recLength = 0;
    isWaiting = false;
    recTime = 0;
    constructor(log: (string )=> void, soundHub: ISoundHub, tempo: Tempo) {
        super(log, soundHub);
        this.tempo = tempo;
        this.tempo.registerOnUpBeat((currentTime: number, currentUpBeatInPhrase: number) => {this.onUpBeat(currentTime, currentUpBeatInPhrase)});
    }
    protected onUpBeat(currentTime: number, currentUpBeatInPhrase: number) {

        this.recTime = currentUpBeatInPhrase - this.startTime; 

        if (currentUpBeatInPhrase === 0) {
            if (this.isRecording) {
                if (this.isWaiting) {

                    // START REAL RECORDING

                    this.isWaiting = false;
                    this.startTime = currentUpBeatInPhrase; // (=0)
                    this.recLength = 0;
                } else {

                    // STOP REAL RECORDING

                    this.log(`LoopRecorder : Record finishes automatically`);
                    this.stop();
                    if (this.endOfRecording) {
                        this.endOfRecording();
                        // If the play is immediately set by the callback, dont wait a phrase more
                        this.isWaiting = false;
                        this.startTime = currentUpBeatInPhrase; // (=0)
                        this.recTime = 0;
                    }
                }
            } else if (this.isPlaying) {
                if (this.isWaiting) {

                    // START REAL REPLAY

                    this.isWaiting = false;
                    this.startTime = currentUpBeatInPhrase; // (=0)
                    this.recTime = 0;
                }
            }
        }
        if (this.isPlaying && !this.isWaiting) {

            // REPLAY //

            if (this.recTime in this._record) {
                let note = this._record[this.recTime];
                this.log(`LoopRecorder : Play ${this.instrument} note ${note} at time ${this.recTime}`);
                this.soundHub.onPlayNote(this.instrument, note);
            }
            if (this.recTime >= this.recLength) {

                // STOP REAL REPLAY

                this.log(`LoopRecorder : Record is finished after time ${this.recTime}`);
                this.stop();
                if (this.endOfPlaying) {
                    this.endOfPlaying();
                    // If the play is immediately set by the callback, dont wait a phrase more
                    this.isWaiting = false;
                    this.startTime = 0;
                    this.recTime = 0;
                }
            }
        }
    }
    protected recordNote(note: string) {
        if (!this.isWaiting) {

            // RECORD //

            this.log(`LoopRecorder : Record ${this.instrument} note ${note} at time ${this.recTime}`);
            this._record[this.recTime] = note;
            this.recLength = this.recTime;
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