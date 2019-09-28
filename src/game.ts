import { Land } from "./modules/land";
import { TestInstrument } from "./modules/instruments/testInstrument";
import { SoundHub } from "./modules/soundhub/soundhub";
import { Piano } from "./modules/instruments/piano";
import { PlayIt } from "./modules/play_it";
import { BassUI } from "./modules/ui_instruments/bass_ui";
import { PianoUI } from "./modules/ui_instruments/piano_ui";
import { RecorderUI } from "./modules/ui_instruments/recorder_ui";
import { Tempo } from "./modules/recorder/tempo";
import { Recorder3D } from "./modules/recorder/recorder3D";
import { DrumSet } from "./modules/instruments/drumset";
import { DrumSetUI } from "./modules/ui_instruments/drumset_ui";
import { GuitarElec, getGuitarElecNotes } from "./modules/instruments/guitar_elec";
import { GuitarElecUI } from "./modules/ui_instruments/guitar_elec_ui";
import { Bass } from "./modules/instruments/bass";
import { SelectInstrumentUI } from "./modules/ui_instruments/select_instrument_ui";

function trace (message) {
  console.log(message);
}

const soundHub = new SoundHub(trace);

const gameCanvas = new UICanvas();

// const uiEntity = new Entity()
// uiEntity.addComponentOrReplace(gameCanvas)
// engine.addEntity(uiEntity)

const complete = false;
let features = {
  'land': true,
  'instrument_test': false,
  'piano': true,
  'bass': true,
  'guitar_elec': true,
  'drumset': true,
  'recorder': true
}
if (!complete) {
  features = {
    'land': false,
    'instrument_test': false,
    'piano': true,
    'bass': true,
    'guitar_elec': true,
    'drumset': true,
    'recorder': true
  }
}
const selectInstrumentUI = new SelectInstrumentUI (trace, gameCanvas);

if (features.land) {
  const land = new Land(trace, new Transform({
    position: new Vector3(8.0, 0.0, 15.8),
    rotation: Quaternion.Euler(0, 0 ,0),
    scale: new Vector3(0.97, 0.97, 0.97)
  }));
  engine.addEntity(land.getEntity());
}
// const instrument = new TestInstrument(trace, soundHub, new Transform({
//   position: new Vector3(8.0, 0.0, 8.0)
// }));

if (features.recorder) {
  const tempo = new Tempo(trace, 100, 4, 4);
  const recorder3d = new Recorder3D(trace, new Transform({
    position: new Vector3(13.5, 1.0, 13.0),
    rotation: Quaternion.Euler(0, 65 ,0),
    scale: new Vector3(0.2,0.2,0.2)
  }));
  const recorderUI = new RecorderUI(trace, gameCanvas, soundHub, tempo);
  selectInstrumentUI.onSelectInstrument(instrument => {
    recorderUI.setActiveInstrument(instrument);
  });
  const play_recorder = new PlayIt(trace, new Transform({
    position: new Vector3(0.8,1.2,0.0),
    rotation: Quaternion.Euler(0,180,0),
    scale: new Vector3(0.4,0.4,2.0)
  }), recorder3d.getEntity(),  () => {
    recorderUI.show();
  });
  engine.addEntity(recorder3d.getEntity());
}

if (features.piano) {
  const piano = new Piano(trace, soundHub, new Transform({
    position: new Vector3(2, 0.3, 13.0),
    rotation: Quaternion.Euler(0, -30 ,0),
    scale: new Vector3(0.12, 0.15, 0.12)
  }));
  const pianoUI = new PianoUI(trace, selectInstrumentUI.getContainer());
  pianoUI.setSoundHub(soundHub);
  selectInstrumentUI.addInstrumentUI(pianoUI);
  pianoUI.hide();
  const play_piano = new PlayIt(trace, new Transform({
    position: new Vector3(0.3,8.0,-1.9),
    rotation: Quaternion.Euler(0,-90,19),
    scale: new Vector3(0.3,1.0,4.5)
  }), piano.getEntity(), () => {
    trace("Click on Play PIANO");
    selectInstrumentUI.selectInstrument(pianoUI);
    selectInstrumentUI.show();
  });
  engine.addEntity(piano.getEntity());
}

if (features.guitar_elec) {
  const guitarElec = new GuitarElec(trace, soundHub, new Transform({
    position: new Vector3(11.5, 1.6, 12.0),
    rotation: Quaternion.Euler(20, 60 ,70),
    scale: new Vector3(0.1,0.1,0.1)
  }));
  const guitarElecUI = new GuitarElecUI(trace, selectInstrumentUI.getContainer());
  guitarElecUI.setSoundHub(soundHub);
  selectInstrumentUI.addInstrumentUI(guitarElecUI);
  guitarElecUI.hide();
  const play_guitar_elec = new PlayIt(trace, new Transform({
    position: new Vector3(4.0,0.0,2.0),
    rotation: Quaternion.Euler(0,190,90),
    scale: new Vector3(1.0,1.0,5.0)
  }), guitarElec.getEntity(),  () => {
    selectInstrumentUI.selectInstrument(guitarElecUI);
    selectInstrumentUI.show();
  });
  engine.addEntity(guitarElec.getEntity());
}

if (features.bass) {
  const bass = new Bass(trace, soundHub, new Transform({
    position: new Vector3(5.5, 1.5, 12.5),
    rotation: Quaternion.Euler(20, 80 ,70),
    scale: new Vector3(0.1,0.1,0.1)
  }));
  const bassUI = new BassUI(trace, selectInstrumentUI.getContainer());
  bassUI.setSoundHub(soundHub);
  selectInstrumentUI.addInstrumentUI(bassUI);
  bassUI.hide();
  const play_bass = new PlayIt(trace, new Transform({
    position: new Vector3(4.0,0.0,0.0),
    rotation: Quaternion.Euler(0,180,90),
    scale: new Vector3(1.0,1.0,5.0)
  }), bass.getEntity(),  () => {
    selectInstrumentUI.selectInstrument(bassUI);
    selectInstrumentUI.show();
  });
  engine.addEntity(bass.getEntity());
}

if (features.drumset) {
  const drumSet = new DrumSet(trace, soundHub, new Transform({
    position: new Vector3(9.0, 0.3, 13.0),
    rotation: Quaternion.Euler(0,180,0),
    scale: new Vector3(0.2, 0.2, 0.2)
  }));
  const drumSetUI = new DrumSetUI(trace, selectInstrumentUI.getContainer());
  drumSetUI.setSoundHub(soundHub);
  selectInstrumentUI.addInstrumentUI(drumSetUI);
  drumSetUI.hide();
  const play_drums = new PlayIt(trace, new Transform({
    position: new Vector3(0.0,9.0,-1.0),
    rotation: Quaternion.Euler(0,90,0),
    scale: new Vector3(1.0,1.0,5.0)
  }), drumSet.getEntity(),  () => {
    selectInstrumentUI.selectInstrument(drumSetUI);
    selectInstrumentUI.show();
  });
  engine.addEntity(drumSet.getEntity());
}


