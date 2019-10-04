"use strict";
exports.__esModule = true;
function removeItemFromArray(log, array, item) {
    var index = array.indexOf(item);
    if (index == -1) {
        log('removeItemFromArray : Unable to find item ' + JSON.stringify(item));
        return;
    }
    if (index >= array.length) {
        return;
    }
    array.splice(index, 1);
}
var SoundHub = /** @class */ (function () {
    function SoundHub(log) {
        // emit the event when a note is played (key pressed, etc..)
        // may have several controllers for the same note/instrument
        this._notes = {};
        // store an array of 'onPlayedNote()' callbacks, per instrument
        this._recorders = {};
        this.log = log;
    }
    /// Method called by an instrument to register its notes, allowing the hub to be warned when the note is played (for recording)
    /// and make them playing (for replaying)
    SoundHub.prototype.registerNoteController = function (noteController) {
        var _this = this;
        // register to the onPlayedNote event of the note
        noteController.registerOnPlayedNote(function (instrument, note) { _this.onPlayedNote(instrument, note); });
    };
    SoundHub.prototype.registerNotePlayer = function (notePlayer) {
        var note = notePlayer.getNote();
        var instrument = notePlayer.getInstrument();
        this.log("SoundHub: registering note player for " + note + " for instrument " + instrument);
        // store the callback to the play() method of the note
        if (!this._notes[instrument])
            this._notes[instrument] = {};
        this._notes[instrument][note] = (function () { notePlayer.play(); });
    };
    /// Method called by a client to be notified when a note is played
    SoundHub.prototype.registerRecorder = function (recorder) {
        var instrument = recorder.getInstrument();
        if (!instrument) {
            this.log("[ERROR] SoundHub::registerRecorder() Recorder has no active instrument defined. Cant register");
            return;
        }
        this.log("SoundHub: registering recorder for instrument " + instrument);
        if (!this._recorders[instrument])
            this._recorders[instrument] = [];
        this._recorders[instrument].push(recorder);
    };
    SoundHub.prototype.registerBroadcaster = function (broadcaster) {
        this._broadcaster = broadcaster;
    };
    SoundHub.prototype.unregisterRecorder = function (recorder) {
        var instrument = recorder.getInstrument();
        if (!instrument) {
            this.log("[ERROR] SoundHub::unregisterRecorder() Recorder has no active instrument defined. Cant unregister");
            return;
        }
        this.log("SoundHub: unregistering recorder for instrument " + instrument);
        if (!this._recorders[instrument])
            return; // should never happen, but ...
        removeItemFromArray(this.log, this._recorders[instrument], recorder);
    };
    /// Method called to ask the instrument to play a note
    SoundHub.prototype.onPlayNote = function (instrument, note, broadcast) {
        if (broadcast === void 0) { broadcast = true; }
        this.log("SoundHub: note " + note + " has to be played on instrument " + instrument);
        if (broadcast && this._broadcaster) {
            this._broadcaster.onPlayedNote(instrument, note);
        }
        else {
            var play = this._notes[instrument][note];
            if (play)
                play();
        }
    };
    // called back when a note is played on the instrument
    SoundHub.prototype.onPlayedNote = function (instrument, note) {
        this.log("SoundHub: onPlayedNote() : " + note + " is playing on instrument " + instrument);
        // warn all recorders for this instrument
        var instrumentRecorders = this._recorders[instrument];
        if (instrumentRecorders) {
            instrumentRecorders.forEach(function (recorder) {
                recorder.onPlayedNote(note);
            });
        }
        if (this._broadcaster) {
            this._broadcaster.onPlayedNote(instrument, note);
        }
    };
    return SoundHub;
}());
exports.SoundHub = SoundHub;
var RecorderForTest = /** @class */ (function () {
    function RecorderForTest(log, instrument, soundHub) {
        var _this = this;
        this.onPlayedNote = function (note) {
            _this.log("recorder for instrument " + _this.instrument + " is recording note " + note);
        };
        this.log = log;
        this.instrument = instrument;
        this.setSoundHub(soundHub);
    }
    RecorderForTest.prototype.setSoundHub = function (soundHub) {
        soundHub.registerRecorder(this);
    };
    RecorderForTest.prototype.getInstrument = function () {
        return this.instrument;
    };
    return RecorderForTest;
}());
var NoteControllerForTest = /** @class */ (function () {
    function NoteControllerForTest(log, instrument, note, soundHub) {
        this._onPlayedNoteCallbacks = [];
        this.log = log;
        this.instrument = instrument;
        this.note = note;
        this.setSoundHub(soundHub);
    }
    NoteControllerForTest.prototype.setSoundHub = function (soundHub) {
        soundHub.registerNoteController(this);
    };
    NoteControllerForTest.prototype.registerOnPlayedNote = function (onPlayNote) {
        this._onPlayedNoteCallbacks.push(onPlayNote);
    };
    NoteControllerForTest.prototype.getInstrument = function () {
        return this.instrument;
    };
    NoteControllerForTest.prototype.getNote = function () {
        return this.note;
    };
    NoteControllerForTest.prototype.playAndNotify = function () {
        var _this = this;
        this.log("Note " + this.note + " is playing on instrument " + this.instrument);
        // Warn listeners
        this._onPlayedNoteCallbacks.forEach(function (onPlayNote) {
            onPlayNote.call(_this, _this.instrument, _this.note);
        });
    };
    return NoteControllerForTest;
}());
var NotePlayerForTest = /** @class */ (function () {
    function NotePlayerForTest(log, instrument, note, soundHub) {
        this._onPlayedNoteCallbacks = [];
        this.log = log;
        this.instrument = instrument;
        this.note = note;
        this.setSoundHub(soundHub);
    }
    NotePlayerForTest.prototype.setSoundHub = function (soundHub) {
        soundHub.registerNotePlayer(this);
    };
    NotePlayerForTest.prototype.play = function () {
        this.log("Note " + this.note + " is to be played on instrument " + this.instrument);
    };
    NotePlayerForTest.prototype.getInstrument = function () {
        return this.instrument;
    };
    NotePlayerForTest.prototype.getNote = function () {
        return this.note;
    };
    return NotePlayerForTest;
}());
var SoundHubTest = /** @class */ (function () {
    function SoundHubTest(log) {
        this.steps = [this.step1, this.step2, this.step3, this.step4];
        this.log = log;
        this.soundHub = new SoundHub(log);
        var recorderPiano = new RecorderForTest(this.log, 'piano', this.soundHub);
        var recorderFlute = new RecorderForTest(this.log, 'flute', this.soundHub);
        this.noteControllerPianoE2 = new NoteControllerForTest(this.log, 'piano', 'E2', this.soundHub);
        this.noteControllerPianoE3 = new NoteControllerForTest(this.log, 'piano', 'E3', this.soundHub);
        this.noteControllerPianoE4 = new NoteControllerForTest(this.log, 'piano', 'E4', this.soundHub);
        this.noteControllerFluteG5 = new NoteControllerForTest(this.log, 'flute', 'G5', this.soundHub);
    }
    SoundHubTest.prototype.start = function () {
        var _this = this;
        this.steps.forEach(function (step) { step.call(_this); });
    };
    SoundHubTest.prototype.step1 = function () {
        this.log("Step 1");
        this.noteControllerPianoE2.playAndNotify();
    };
    SoundHubTest.prototype.step2 = function () {
        this.log("Step 2");
        this.noteControllerPianoE3.playAndNotify();
    };
    SoundHubTest.prototype.step3 = function () {
        this.log("Step 3");
        this.noteControllerPianoE4.playAndNotify();
    };
    SoundHubTest.prototype.step4 = function () {
        this.log("Step 4");
        this.noteControllerFluteG5.playAndNotify();
    };
    return SoundHubTest;
}());
exports.SoundHubTest = SoundHubTest;
