import { IInstrumentRecorder, SoundHubTest, ISoundHub, IInstrumentBroadcaster } from "./soundhub";
import { Tempo } from "../recorder/tempo";
import { NotesRecord, listInstruments } from "../../mp_server/i_multiplayer";


// const apiUrl = "http://127.0.0.1:5611"
const apiUrl = "https://jamminland-mp-server.levalleuxludo.now.sh"

class Broadcaster implements IInstrumentBroadcaster {
    notesRecord: NotesRecord = new NotesRecord();
    constructor() {
    }
    soundHub: ISoundHub;
    setSoundHub(soundHub: ISoundHub) {
        this.soundHub = soundHub;
        this.soundHub.registerBroadcaster(this);
    }
    onPlayedNote(instrument: string, note: string) {
        // store all notes until the manager asks for
        this.notesRecord.mergeNotes(instrument, [note]);
    }
    getNoteRecord(instrument: string): string[] {
        let notes = this.notesRecord.getRecord(instrument);
        this.notesRecord.resetRecord(instrument);
        return notes;
    }
}

class InstrumentRecorder implements IInstrumentRecorder {
    instrument: string;
    noteRecord: string[] = [];
    constructor(instrument: string) {
        this.instrument = instrument;
    }
    soundHub: ISoundHub;
    setSoundHub(soundHub: ISoundHub) {
        this.soundHub = soundHub;
        this.soundHub.registerRecorder(this);
    }
    onPlayedNote(note: string) {
        // store all notes until the manager asks for
        mergeNotes(note, this.noteRecord);
    }
    getInstrument(): string {
        return this.instrument;
    }

    public getNoteRecord(): string[] {
        let noteRecord = this.noteRecord;
        this.noteRecord = [];
        return noteRecord;
    }
}

function mergeNotes(note: string, notes: string[]) {
    if (notes.indexOf(note) === -1) {
        notes.push(note);
    }
}
// how often to refresh scene, in seconds
const refreshInterval: number = 0.025
let refreshTimer: number = refreshInterval

export class MultiPlayerManager implements ISystem {
    // create a recorder for each instrument and connect them to soundhub
    // register to tempo and connect it -> each beat, get the notes in recorder and send request to the server
    // recorders: {[key: string]: InstrumentRecorder} = {
    //     piano: new InstrumentRecorder('piano'),
    //     drums: new InstrumentRecorder('drums'),
    //     bass: new InstrumentRecorder('bass'),
    //     guitar_elec: new InstrumentRecorder('guitar_elec')
    // }
    broadcaster: Broadcaster = new Broadcaster();
    log: (string )=> void;
    soundHub: ISoundHub;
    client: Client;
    constructor(log: (string )=> void, soundHub: ISoundHub, tempo: Tempo) {
        this.log = log;
        this.soundHub = soundHub;
        this.client = new Client();
        // for (let instrument in this.recorders) {
        //     this.recorders[instrument].setSoundHub(this.soundHub);
        // }
        this.broadcaster.setSoundHub(soundHub);
    }

    update(dt:number) {
        refreshTimer -= dt
        if (refreshTimer <0){
          refreshTimer = refreshInterval
          this.sendNotes();
          this.getNotes();
        }
    }

    sendNotes() {
        // for (let instrument in this.recorders) {
        //     let recorder = this.recorders[instrument];
        //     let notes = recorder.getNoteRecord();
        //     if (notes.length > 0) {
        //         this.client.callAPI(recorder.getInstrument(), notes);
        //     }
        // }
        for (let instrument of listInstruments) {
            let notes = this.broadcaster.getNoteRecord(instrument);
            if (notes.length > 0) {
                // this.client.callAPI(recorder.getInstrument(), notes);
                this.client.callAPI(instrument, notes);
            }
        }
    }

    getNotes() {
        this.client.getFromServer( (notesPerInstrument: {[key: string]: string[]}) => {
            // for (let instrument in this.recorders) {
            for (let instrument of listInstruments) {
                let notes = notesPerInstrument[instrument];
                if (notes.length > 0) {
                    notes.forEach(note => {
                        this.soundHub.onPlayNote(instrument, note, false);
                    });
                }
            }
        });
    }

}


///// Connect to the REST API
class Client {
    clientId: string;
    isRegistering = false;
    constructor() {
        this.register();
    }
    callAPI(instrument: string, notes: string[]){
        let url = `${apiUrl}/play`;
        let method = "POST";
      //   let mode = "no-cors";
        let headers = { 
            "Content-Type": "application/json",
            'Origin': 'http://10.0.75.1:8000'
           };
        let body =  JSON.stringify({"instrument": instrument, "notes": JSON.stringify(notes)});
        let params: RequestInit =  {headers: headers, method: method, body: body }
        executeTask(async () => {
          try {
            let response = await fetch(url,params);
          } catch(e) {
            log("failed to reach URL" + e)
          }
        })
    }
    getFromServer(callback: (notesPerInstrument: {[key: string]: string[]}) => void){
 
      if (this.isRegistering) return;
        let url = `${apiUrl}/notes?client=${encodeURI(this.clientId)}`;
        
        executeTask(async () => {
          try {
            let response = await fetch(url);
            if ((response.status == 401) || (response.status == 403)) {
                // we need to register again (auto-disconnected by the server  after a timeout)
                this.isRegistering = true;
                this.register();
                this.getFromServer(callback);
                this.isRegistering = false;
                return;
            }
            let json = await response.json()
            callback(json);
          } catch(e) {
            log("getFromServer(): failed to reach URL " + e)
          }
      
         })
    }
    register() {
        let url = `${apiUrl}/register`;
        let method = "GET";
        executeTask(async () => {
          try {
            let response = await fetch(url);
            let json = await response.json();
            this.clientId = json.id;
          } catch(e) {
            log("register(): failed to reach URL" + e)
          }
        })
    }
}


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
