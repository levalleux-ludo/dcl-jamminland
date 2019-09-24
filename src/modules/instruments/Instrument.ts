import { ISoundHub } from "../soundhub/soundhub";
import { EntityWrapper } from "../entity_wrapper";
import { Note } from "./note";

export interface INoteProps {
    note: string,
    index: number,
    song: string,
    extras: {[key: string]: string}
}

export abstract class Instrument<T extends Note> extends EntityWrapper{
    constructor (log: (string )=> void, transform: Transform) {
        super (log, transform);
    }

    protected abstract getTransformForNote(noteProp: INoteProps): Transform;

    protected createNotes<T>(soundHub: ISoundHub, note: new (log: (string)=> void, Transform, Entity, INoteProps) => T, noteProps: INoteProps[]) {
        noteProps.forEach(noteProp => {
            this.log("create note " + noteProp.note);
            let transform = this.getTransformForNote(noteProp);
            let n = new note(log, transform, this.entity, noteProp);
        })
        // for (let noteProp of noteProps) {
        //     this.log("create note " + noteProp.note);
        //     let transform = this.getTransformForNote(noteProp);
        //     let n = new note(log, transform, this.entity, noteProp);
        // }
    }

}