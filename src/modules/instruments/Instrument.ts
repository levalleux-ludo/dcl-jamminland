import { ISoundHub } from "../soundhub/soundhub";
import { EntityWrapper } from "../entity_wrapper";
import { Note } from "./note";
import utils from "../../../node_modules/decentraland-ecs-utils/index"

export interface INoteProps {
    note: string,
    index: number,
    song: string,
    extras: {[key: string]: string | number}
}

export abstract class Instrument<T extends Note> extends EntityWrapper{
    soundHub: ISoundHub;
    notesCreated = false;
    constructor (log: (string )=> void, soundHub: ISoundHub, transform: Transform, parent: Entity) {
        super (log, transform, parent);
        this.soundHub = soundHub;
        this.entity.addComponent(new utils.Delay(5000,()=>{
            this.createYourNotes(soundHub);
        }));
    }

    protected abstract createYourNotes(soundHub: ISoundHub);
    protected abstract getTransformForNote(noteProp: INoteProps): Transform;

    protected createNotes<T extends Note>(soundHub: ISoundHub, note: new (log: (string)=> void, Transform, Entity, INoteProps) => T, noteProps: INoteProps[]) {
        if (!this.notesCreated) {
        noteProps.forEach(noteProp => {
            this.log("create note " + noteProp.note);
            let transform = this.getTransformForNote(noteProp);
            let n = new note(log, transform, this.entity, noteProp);
            n.setSoundHub(this.soundHub);
        });
        }
        this.notesCreated = true;
    }

}