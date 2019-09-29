import { ISoundHub } from "../soundhub/soundhub";
import { EntityWrapper } from "../entity_wrapper";
import { Note } from "./note";

export interface INoteProps {
    note: string,
    index: number,
    song: string,
    extras: {[key: string]: string | number}
}

export abstract class Instrument<T extends Note> extends EntityWrapper{
    soundHub: ISoundHub;
    constructor (log: (string )=> void, soundHub: ISoundHub, transform: Transform, parent: Entity) {
        super (log, transform, parent);
        this.soundHub = soundHub;
    }

    protected abstract getTransformForNote(noteProp: INoteProps): Transform;

    protected createNotes<T extends Note>(soundHub: ISoundHub, note: new (log: (string)=> void, Transform, Entity, INoteProps) => T, noteProps: INoteProps[]) {
        noteProps.forEach(noteProp => {
            this.log("create note " + noteProp.note);
            let transform = this.getTransformForNote(noteProp);
            let n = new note(log, transform, this.entity, noteProp);
            n.setSoundHub(this.soundHub);
        });
        // for (let noteProp of noteProps) {
        //     this.log("create note " + noteProp.note);
        //     let transform = this.getTransformForNote(noteProp);
        //     let n = new note(log, transform, this.entity, noteProp);
        // }
    }

}