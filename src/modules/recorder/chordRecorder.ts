import { ISoundHub, IInstrumentRecorder } from "../soundhub/soundhub";
import { AbstractRecorder } from "./abstractRecorder";
import { Tempo } from "./tempo";

export class ChordRecorder extends AbstractRecorder {
    notes: string[] = [];
    constructor(log: (string )=> void, soundHub: ISoundHub, tempo: Tempo) {
        super(log, soundHub);
    }
    protected recordNote(note: string) {
        this.log(`ChordRecorder : Record ${this.instrument} note ${note}`);
        this.notes.push(note);
    }
    protected onRecordStart() {
        this.notes = [];
    }
    protected onRecordStop() {
    }
    protected onPlayStart() {
        this.notes.forEach( note => {
            this.log(`ChordRecorder : Play ${this.instrument} note ${note}`);
            this.soundHub.onPlayNote(this.instrument, note);
        });
        this.stop();
        if (this.endOfPlaying) this.endOfPlaying();
    }
    protected onPlayStop() {
    }
    protected onReset() {
        this.notes = [];
    }
}