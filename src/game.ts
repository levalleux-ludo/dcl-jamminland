import { Land } from "./modules/land";
import { TestInstrument } from "./modules/instruments/testInstrument";
import { SoundHub } from "./modules/soundhub/soundhub";
import { Piano } from "./modules/instruments/piano";
import { getBassNotes, Bass } from "./modules/instruments/bass";
import { PlayIt } from "./modules/play_it";
import { BassUI } from "./modules/ui_instruments/bass_ui";
import { PianoUI } from "./modules/ui_instruments/piano_ui";
import { RecorderUI } from "./modules/ui_instruments/recorder_ui";
import { Tempo } from "./modules/recorder/tempo";
import { Recorder3D } from "./modules/recorder/recorder3D";

// const land = new Land(trace, new Transform({
//   position: new Vector3(8.0, 0.0, 15.8),
//   rotation: Quaternion.Euler(0, 0 ,0),
//   scale: new Vector3(0.97, 0.97, 0.97)
// }));
// engine.addEntity(land.getEntity());

const soundHub = new SoundHub(trace);

const gameCanvas = new UICanvas();

// const instrument = new TestInstrument(trace, soundHub, new Transform({
//   position: new Vector3(8.0, 0.0, 8.0)
// }));

// const piano = new Piano(trace, soundHub, new Transform({
//   position: new Vector3(2, -0.1, 13.0),
//   rotation: Quaternion.Euler(0, -30 ,0),
//   scale: new Vector3(0.12, 0.2, 0.2)
// }));
// const pianoUI = new PianoUI(trace, gameCanvas);
// pianoUI.setSoundHub(soundHub);
// pianoUI.show();
// const play_piano = new PlayIt(trace, new Transform({
//   position: new Vector3(0.3,8.0,-1.9),
//   rotation: Quaternion.Euler(0,-90,19),
//   scale: new Vector3(0.3,1.0,4.5)
// }), piano.getEntity(), pianoUI);
// engine.addEntity(piano.getEntity());

// const bass = new Bass(trace, soundHub, new Transform({
//   position: new Vector3(6, 1.5, 12.0),
//   rotation: Quaternion.Euler(20, 80 ,70),
//   scale: new Vector3(0.1,0.1,0.1)
// }));
// const bassUI = new BassUI(trace, gameCanvas);
// bassUI.setSoundHub(soundHub);
// const play_bass = new PlayIt(trace, new Transform({
//   position: new Vector3(4.0,0.0,0.0),
//   rotation: Quaternion.Euler(0,180,90),
//   scale: new Vector3(1.0,1.0,5.0)
// }), bass.getEntity(), bassUI);
// engine.addEntity(bass.getEntity());

const tempo = new Tempo(trace, 100, 4, 4);
const recorder3d = new Recorder3D(trace, new Transform({
  position: new Vector3(13.0, 1.0, 13.0),
  rotation: Quaternion.Euler(0, 65 ,0),
  scale: new Vector3(0.2,0.2,0.2)
}));
const recorderUI = new RecorderUI(trace, gameCanvas, soundHub, tempo);
const play_recorder = new PlayIt(trace, new Transform({
  position: new Vector3(0.8,1.2,0.0),
  rotation: Quaternion.Euler(0,180,0),
  scale: new Vector3(0.4,0.4,2.0)
}), recorder3d.getEntity(), recorderUI);
engine.addEntity(recorder3d.getEntity());
// recorderUI.display();
function trace (message) {
  console.log(message);
}