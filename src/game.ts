import { Land } from "./modules/land";
import { TestInstrument } from "./modules/instruments/testInstrument";
import { SoundHub } from "./modules/soundhub/soundhub";
import { Piano } from "./modules/instruments/piano";
import { getBassNotes, Bass } from "./modules/instruments/bass";

// const land = new Land(new Transform({
//   position: new Vector3(8.0, 0.0, 15.8),
//   rotation: Quaternion.Euler(0, 0 ,0),
//   scale: new Vector3(0.97, 0.97, 0.97)
// }));

const soundHub = new SoundHub(trace);

// const instrument = new TestInstrument(trace, soundHub, new Transform({
//   position: new Vector3(8.0, 0.0, 8.0)
// }));

// const piano = new Piano(trace, soundHub, new Transform({
//   position: new Vector3(2, -0.1, 13.0),
//   rotation: Quaternion.Euler(0, -30 ,0),
//   scale: new Vector3(0.12, 0.2, 0.2)
// }))

const bass = new Bass(trace, soundHub, new Transform({
  position: new Vector3(6, 1.5, 12.0),
  rotation: Quaternion.Euler(20, 80 ,70),
  scale: new Vector3(0.1,0.1,0.1)
}));

let bassNotes = getBassNotes();
trace(JSON.stringify(bassNotes));

function trace (message) {
  console.log(message);
}