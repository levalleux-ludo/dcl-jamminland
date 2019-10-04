"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
exports.__esModule = true;
exports.listInstruments = ["piano", "bass", "guitar_elec", "drums"];
var NotesRecord = /** @class */ (function () {
    function NotesRecord() {
        this.notesPerInstrument = {};
        this.reset();
    }
    NotesRecord.prototype.reset = function () {
        var _this = this;
        exports.listInstruments.forEach(function (instrument) {
            _this.notesPerInstrument[instrument] = [];
        });
    };
    NotesRecord.prototype.resetRecord = function (instrument) {
        this.notesPerInstrument[instrument] = [];
    };
    NotesRecord.prototype.mergeNotes = function (instrument, newNotes) {
        var notes = this.notesPerInstrument[instrument];
        newNotes.forEach(function (note) {
            if (notes.indexOf(note) === -1) {
                notes.push(note);
            }
        });
    };
    NotesRecord.prototype.getRecord = function (instrument) {
        return this.notesPerInstrument[instrument];
    };
    return NotesRecord;
}());
exports.NotesRecord = NotesRecord;
var Broadcaster = /** @class */ (function () {
    function Broadcaster() {
        this.notesRecord = new NotesRecord();
    }
    Broadcaster.prototype.setSoundHub = function (soundHub) {
        this.soundHub = soundHub;
        this.soundHub.registerBroadcaster(this);
    };
    Broadcaster.prototype.onPlayedNote = function (instrument, note) {
        // store all notes until the manager asks for
        this.notesRecord.mergeNotes(instrument, [note]);
    };
    Broadcaster.prototype.getNoteRecord = function (instrument) {
        var notes = this.notesRecord.getRecord(instrument);
        this.notesRecord.resetRecord(instrument);
        return notes;
    };
    return Broadcaster;
}());
var InstrumentRecorder = /** @class */ (function () {
    function InstrumentRecorder(instrument) {
        this.noteRecord = [];
        this.instrument = instrument;
    }
    InstrumentRecorder.prototype.setSoundHub = function (soundHub) {
        this.soundHub = soundHub;
        this.soundHub.registerRecorder(this);
    };
    InstrumentRecorder.prototype.onPlayedNote = function (note) {
        // store all notes until the manager asks for
        mergeNotes(note, this.noteRecord);
    };
    InstrumentRecorder.prototype.getInstrument = function () {
        return this.instrument;
    };
    InstrumentRecorder.prototype.getNoteRecord = function () {
        var noteRecord = this.noteRecord;
        this.noteRecord = [];
        return noteRecord;
    };
    return InstrumentRecorder;
}());
function mergeNotes(note, notes) {
    if (notes.indexOf(note) === -1) {
        notes.push(note);
    }
}
// how often to refresh scene, in seconds
var refreshInterval = 0.05;
var refreshTimer = refreshInterval;
var MultiPlayerManager = /** @class */ (function () {
    function MultiPlayerManager(log, soundHub, tempo) {
        // create a recorder for each instrument and connect them to soundhub
        // register to tempo and connect it -> each beat, get the notes in recorder and send request to the server
        // recorders: {[key: string]: InstrumentRecorder} = {
        //     piano: new InstrumentRecorder('piano'),
        //     drums: new InstrumentRecorder('drums'),
        //     bass: new InstrumentRecorder('bass'),
        //     guitar_elec: new InstrumentRecorder('guitar_elec')
        // }
        this.broadcaster = new Broadcaster();
        this.log = log;
        this.soundHub = soundHub;
        this.client = new Client();
        // for (let instrument in this.recorders) {
        //     this.recorders[instrument].setSoundHub(this.soundHub);
        // }
        this.broadcaster.setSoundHub(soundHub);
    }
    MultiPlayerManager.prototype.update = function (dt) {
        refreshTimer -= dt;
        if (refreshTimer < 0) {
            refreshTimer = refreshInterval;
            this.sendNotes();
            this.getNotes();
        }
    };
    MultiPlayerManager.prototype.sendNotes = function () {
        // for (let instrument in this.recorders) {
        //     let recorder = this.recorders[instrument];
        //     let notes = recorder.getNoteRecord();
        //     if (notes.length > 0) {
        //         this.client.callAPI(recorder.getInstrument(), notes);
        //     }
        // }
        for (var _i = 0, listInstruments_1 = exports.listInstruments; _i < listInstruments_1.length; _i++) {
            var instrument = listInstruments_1[_i];
            var notes = this.broadcaster.getNoteRecord(instrument);
            if (notes.length > 0) {
                // this.client.callAPI(recorder.getInstrument(), notes);
                this.client.callAPI(instrument, notes);
            }
        }
    };
    MultiPlayerManager.prototype.getNotes = function () {
        var _this = this;
        this.client.getFromServer(function (notesPerInstrument) {
            var _loop_1 = function (instrument) {
                var notes = notesPerInstrument[instrument];
                if (notes.length > 0) {
                    notes.forEach(function (note) {
                        _this.soundHub.onPlayNote(instrument, note, false);
                    });
                }
            };
            // for (let instrument in this.recorders) {
            for (var _i = 0, listInstruments_2 = exports.listInstruments; _i < listInstruments_2.length; _i++) {
                var instrument = listInstruments_2[_i];
                _loop_1(instrument);
            }
        });
    };
    return MultiPlayerManager;
}());
exports.MultiPlayerManager = MultiPlayerManager;
///// Connect to the REST API
var apiUrl = "http://127.0.0.1:5000";
var Client = /** @class */ (function () {
    function Client() {
        this.register();
    }
    Client.prototype.callAPI = function (instrument, notes) {
        var _this = this;
        var url = apiUrl + "/play";
        var method = "POST";
        //   let mode = "no-cors";
        var headers = {
            "Content-Type": "application/json",
            'Origin': 'http://10.0.75.1:8000'
        };
        var body = JSON.stringify({ "instrument": instrument, "notes": JSON.stringify(notes) });
        var params = { headers: headers, method: method, body: body };
        executeTask(function () { return __awaiter(_this, void 0, void 0, function () {
            var response, e_1;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, fetch(url, params)];
                    case 1:
                        response = _a.sent();
                        return [3 /*break*/, 3];
                    case 2:
                        e_1 = _a.sent();
                        log("failed to reach URL" + e_1);
                        return [3 /*break*/, 3];
                    case 3: return [2 /*return*/];
                }
            });
        }); });
    };
    Client.prototype.getFromServer = function (callback) {
        var _this = this;
        var url = apiUrl + "/notes?client=" + encodeURI(this.clientId);
        executeTask(function () { return __awaiter(_this, void 0, void 0, function () {
            var response, json, e_2;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 3, , 4]);
                        return [4 /*yield*/, fetch(url)];
                    case 1:
                        response = _a.sent();
                        if ((response.status == 401) || (response.status == 403)) {
                            // we need to register again (auto-disconnected by the server  after a timeout)
                            this.register();
                            this.getFromServer(callback);
                            return [2 /*return*/];
                        }
                        return [4 /*yield*/, response.json()];
                    case 2:
                        json = _a.sent();
                        callback(json);
                        return [3 /*break*/, 4];
                    case 3:
                        e_2 = _a.sent();
                        log("getFromServer(): failed to reach URL " + e_2);
                        return [3 /*break*/, 4];
                    case 4: return [2 /*return*/];
                }
            });
        }); });
    };
    Client.prototype.register = function () {
        var _this = this;
        var url = apiUrl + "/register";
        var method = "GET";
        executeTask(function () { return __awaiter(_this, void 0, void 0, function () {
            var response, json, e_3;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 3, , 4]);
                        return [4 /*yield*/, fetch(url)];
                    case 1:
                        response = _a.sent();
                        return [4 /*yield*/, response.json()];
                    case 2:
                        json = _a.sent();
                        this.clientId = json.id;
                        return [3 /*break*/, 4];
                    case 3:
                        e_3 = _a.sent();
                        log("register(): failed to reach URL" + e_3);
                        return [3 /*break*/, 4];
                    case 4: return [2 /*return*/];
                }
            });
        }); });
    };
    return Client;
}());
// function called when activating door
// function callAPI(instrument: string, notes: string[]){
//   let url = `${apiUrl}/play`;
//   let method = "POST";
// //   let mode = "no-cors";
//   let headers = { 
//       "Content-Type": "application/json",
//       'Origin': 'http://10.0.75.1:8000'
//      };
//   let body =  JSON.stringify({"instrument": instrument, "notes": JSON.stringify(notes)});
//   log('call API');
//   let params: RequestInit =  {headers: headers, method: method, body: body }
//   executeTask(async () => {
//     try {
//       let response = await fetch(url,params);
//     } catch {
//       log("failed to reach URL")
//     }
//   })
// }
// // Function called at regular intervals
// function getFromServer(callback: (notesPerInstrument: {[key: string]: string[]}) => void){
//   let url = `${apiUrl}/notes`
//   executeTask(async () => {
//     try {
//       let response = await fetch(url)
//       let json = await response.json()
//     //   log(json)
//         callback(json);
//     } catch(e) {
//       log("failed to reach URL " + e)
//     }
//    })
// }
