import { EntityWrapper } from "../entity_wrapper";
import { INoteProps } from "./Instrument";
import { INoteController, INotePlayer, ISoundHub } from "../soundhub/soundhub";
import utils from "../../../node_modules/decentraland-ecs-utils/index"

export abstract class Note extends EntityWrapper implements INoteController, INotePlayer {
    protected note;
    soundHub: ISoundHub;
    // **** INoteController implementation ****
    _onPlayedNoteCallbacks: ((instrument: string, note: string)=>void)[] = [];
    public setSoundHub(soundHub: ISoundHub) {
        this.soundHub = soundHub;
        soundHub.registerNotePlayer(this);
        soundHub.registerNoteController(this);
    }
    public registerOnPlayedNote(onPlayNote: (instrument: string, note: string)=> void) {
        // allow registering to allow recording from UI
        this._onPlayedNoteCallbacks.push(onPlayNote);
    }
    // ****************************************
    // **** INotePlayer implementation ****
    public abstract getInstrument(): string;
    public getNote() {
        return this.note;
    }
    public play() {
        this.entity.getComponent(AudioSource).playOnce();
    }
    // ****************************************
    notifyPlaying() {
        // Notify listeners
        this._onPlayedNoteCallbacks.forEach(onPlayNote => {
            onPlayNote.call(this, this.getInstrument(), this.note);
        })
    }
    constructor (log: (string )=> void, transform: Transform, parent: Entity, noteProp: INoteProps) {
        super(log, transform, parent);
        this.note = noteProp.note;
        let noteShape = this.getNoteShape(noteProp);
        if (noteShape) this.entity.addComponentOrReplace(noteShape);
        this.entity.addComponent (new OnClick(e => {this.onPressed();}));
        // Load the song in asynchronous way
        this.entity.addComponent(new utils.Delay(100,()=>{
            this.setSound(new AudioClip(noteProp.song));
        }));
    }
    protected abstract getNoteShape(noteProp: INoteProps);
    protected abstract animate()
    public setSound(sound: AudioClip) {
        let audioSource = new AudioSource(sound)
        audioSource.playing = false
        this.entity.addComponentOrReplace(audioSource);
    }
    onPressed() {
        this.play();
        this.notifyPlaying();
        this.animate();
    }
}