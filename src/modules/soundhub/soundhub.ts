export interface ISoundHub {
    // only one player per note per instrument
    registerNotePlayer(note: INotePlayer);
    // may have several controllers for the same note of the same instrument
    registerNoteController(note: INoteController);
    /// Method called by a client to be notified when a note is played
    registerRecorder(recorder: IInstrumentRecorder);
    /// Method called by the note while playing
    onPlayNote(instrument: string, note: string);
}

export interface IInstrumentRecorder {
    setSoundHub(soundHub: ISoundHub);
    onPlayedNote(note: string);
    getInstrument(): string;
}

export interface INoteController {
    setSoundHub(soundHub: ISoundHub);
    registerOnPlayedNote(onPlayNote: (instrument: string, note: string)=> void);
}

export interface INotePlayer {
    setSoundHub(soundHub: ISoundHub);
    play();
    getInstrument(): string;
    getNote(): string;
}

export class SoundHub implements ISoundHub {
    log: (string )=> void;
    constructor(log: (string )=> void) {
        this.log = log;
    }

    // emit the event when a note is played (key pressed, etc..)
    // may have several controllers for the same note/instrument
    private _notes: Record <string, Record <string, () => void > > = {};
    // store an array of 'onPlayedNote()' callbacks, per instrument
    private _recorders: Record <string, ((note: string) => void)[] > = {};

    /// Method called by an instrument to register its notes, allowing the hub to be warned when the note is played (for recording)
    /// and make them playing (for replaying)
    public registerNoteController(noteController: INoteController) {
        // register to the onPlayedNote event of the note
        noteController.registerOnPlayedNote((instrument:string, note:string) => {this.onPlayedNote(instrument, note)})
    }

    public registerNotePlayer(notePlayer: INotePlayer) {
        let note = notePlayer.getNote();
        let instrument = notePlayer.getInstrument();
        this.log(`SoundHub: registering note player for ${note} for instrument ${instrument}`);
        // store the callback to the play() method of the note
        if (!this._notes[instrument]) this._notes[instrument] = {};
        this._notes[instrument][note] = (() => {notePlayer.play()});
    }

    /// Method called by a client to be notified when a note is played
    public registerRecorder(recorder: IInstrumentRecorder) {
        let instrument = recorder.getInstrument();
        this.log(`SoundHub: registering recorder for instrument ${instrument}`);
        if (!this._recorders[instrument]) this._recorders[instrument] = [];
        this._recorders[instrument].push(((note) => {recorder.onPlayedNote(note)}));
    }

    /// Method called to ask the instrument to play a note
    public onPlayNote(instrument: string, note: string) {
        this.log(`SoundHub: note ${note} has to be played on instrument ${instrument}`);
        let play = this._notes[instrument][note];
        if (play) play();
    }

    // called back when a note is played on the instrument
    onPlayedNote(instrument: string, note: string) {
        this.log(`SoundHub: onPlayedNote() : ${note} is playing on instrument ${instrument}`);
        // warn all recorders for this instrument
        let instrumentRecorders = this._recorders[instrument];
        if (instrumentRecorders) {
            instrumentRecorders.forEach(callback => {
                callback(note);
            });
        }
    }
}

class RecorderForTest implements IInstrumentRecorder {
    log;
    instrument;
    constructor(log: (string )=> void, instrument, soundHub) {
        this.log = log;
        this.instrument = instrument;
        this.setSoundHub(soundHub);
    }
    public setSoundHub(soundHub: ISoundHub) {
        soundHub.registerRecorder(this);
    }
    public onPlayedNote = (note: string) => {
        this.log(`recorder for instrument ${this.instrument} is recording note ${note}`);
    }
    public getInstrument() {
        return this.instrument;
    }
}

class NoteControllerForTest implements INoteController {
    log;
    instrument;
    note;
    _onPlayedNoteCallbacks: ((instrument: string, note: string)=>void)[] = [];
    constructor(log: (string )=> void, instrument, note, soundHub) {
        this.log = log;
        this.instrument = instrument;
        this.note = note;
        this.setSoundHub(soundHub);
    }
    public setSoundHub(soundHub: ISoundHub) {
        soundHub.registerNoteController(this);
    }
    public registerOnPlayedNote(onPlayNote: (instrument: string, note: string)=> void) {
        this._onPlayedNoteCallbacks.push(onPlayNote);
    }
    public getInstrument() {
        return this.instrument;
    }
    public getNote() {
        return this.note;
    }
    public playAndNotify() {
        this.log (`Note ${this.note} is playing on instrument ${this.instrument}`);
        // Warn listeners
        this._onPlayedNoteCallbacks.forEach(onPlayNote => {
            onPlayNote.call(this, this.instrument, this.note);
        })
    }
}

class NotePlayerForTest implements INotePlayer {
    log;
    instrument;
    note;
    _onPlayedNoteCallbacks: ((instrument: string, note: string)=>void)[] = [];
    constructor(log: (string )=> void, instrument, note, soundHub) {
        this.log = log;
        this.instrument = instrument;
        this.note = note;
        this.setSoundHub(soundHub);
    }
    public setSoundHub(soundHub: ISoundHub) {
        soundHub.registerNotePlayer(this);
    }
    public play() {
        this.log (`Note ${this.note} is to be played on instrument ${this.instrument}`);
    }
    public getInstrument() {
        return this.instrument;
    }
    public getNote() {
        return this.note;
    }
}



export class SoundHubTest {
    soundHub: SoundHub;
    log: (string) => void;
    steps = [this.step1, this.step2, this.step3, this.step4];

    recorder: RecorderForTest;
    noteControllerPianoE2: NoteControllerForTest;
    noteControllerPianoE3: NoteControllerForTest;
    noteControllerPianoE4: NoteControllerForTest;
    noteControllerFluteG5: NoteControllerForTest;

    constructor(log: (string )=> void) {
        this.log = log;
        this.soundHub = new SoundHub(log);
        let recorderPiano = new RecorderForTest(this.log, 'piano', this.soundHub);
        let recorderFlute = new RecorderForTest(this.log, 'flute', this.soundHub);
        this.noteControllerPianoE2 = new NoteControllerForTest(this.log, 'piano', 'E2', this.soundHub);
        this.noteControllerPianoE3 = new NoteControllerForTest(this.log, 'piano', 'E3', this.soundHub);
        this.noteControllerPianoE4 = new NoteControllerForTest(this.log, 'piano', 'E4', this.soundHub);
        this.noteControllerFluteG5 = new NoteControllerForTest(this.log, 'flute', 'G5', this.soundHub);
    }
    public start() {
        this.steps.forEach(step => {step.call(this)});
    }

    step1() {
        this.log("Step 1");
        this.noteControllerPianoE2.playAndNotify();
    }

    step2() {
        this.log("Step 2");
        this.noteControllerPianoE3.playAndNotify();
    }

    step3() {
        this.log("Step 3");
        this.noteControllerPianoE4.playAndNotify();
    }

    step4() {
        this.log("Step 4");
        this.noteControllerFluteG5.playAndNotify();
    }

}