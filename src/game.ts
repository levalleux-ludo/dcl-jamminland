import { Land } from "./modules/land";
import { TestInstrument } from "./modules/instruments/testInstrument";
import { SoundHub } from "./modules/soundhub/soundhub";
import { Piano } from "./modules/instruments/piano";
import { getBassNotes, Bass } from "./modules/instruments/bass";
import { PlayIt } from "./modules/play_it";
import { BassUI } from "./modules/ui_instruments/bass_ui";
import { PianoUI } from "./modules/ui_instruments/piano_ui";

const land = new Land(trace, new Transform({
  position: new Vector3(8.0, 0.0, 15.8),
  rotation: Quaternion.Euler(0, 0 ,0),
  scale: new Vector3(0.97, 0.97, 0.97)
}));
engine.addEntity(land.getEntity());

const soundHub = new SoundHub(trace);

const gameCanvas = new UICanvas();

// const instrument = new TestInstrument(trace, soundHub, new Transform({
//   position: new Vector3(8.0, 0.0, 8.0)
// }));

const piano = new Piano(trace, soundHub, new Transform({
  position: new Vector3(2, -0.1, 13.0),
  rotation: Quaternion.Euler(0, -30 ,0),
  scale: new Vector3(0.12, 0.2, 0.2)
}));
const pianoUI = new PianoUI(trace, gameCanvas);
pianoUI.setSoundHub(soundHub);
pianoUI.show();
const play_piano = new PlayIt(trace, new Transform({
  position: new Vector3(0.3,8.0,-1.9),
  rotation: Quaternion.Euler(0,-90,19),
  scale: new Vector3(0.3,1.0,4.5)
}), piano.getEntity(), pianoUI);
engine.addEntity(piano.getEntity());

const bass = new Bass(trace, soundHub, new Transform({
  position: new Vector3(6, 1.5, 12.0),
  rotation: Quaternion.Euler(20, 80 ,70),
  scale: new Vector3(0.1,0.1,0.1)
}));
const bassUI = new BassUI(trace, gameCanvas);
bassUI.setSoundHub(soundHub);
const play_bass = new PlayIt(trace, new Transform({
  position: new Vector3(4.0,0.0,0.0),
  rotation: Quaternion.Euler(0,180,90),
  scale: new Vector3(1.0,1.0,5.0)
}), bass.getEntity(), bassUI);
engine.addEntity(bass.getEntity());

function trace (message) {
  console.log(message);
}