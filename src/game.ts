import { Saloon } from "./modules/saloon";
import { Land } from "./modules/land";
import { TestInstrument } from "./modules/instruments/testInstrument";
import { SoundHub } from "./modules/soundhub/soundhub";
import { Piano } from "./modules/instruments/piano";

/// --- Set up a system ---

class RotatorSystem {
  // this group will contain every entity that has a Transform component
  group = engine.getComponentGroup(Transform)

  update(dt: number) {
    // iterate over the entities of the group
    for (let entity of this.group.entities) {
      // get the Transform component of the entity
      const transform = entity.getComponent(Transform)

      // mutate the rotation
      transform.rotate(Vector3.Up(), dt * 10)
    }
  }
}

// Add a new instance of the system to the engine
// engine.addSystem(new RotatorSystem())

/// --- Spawner function ---

function spawnCube(x: number, y: number, z: number) {
  // create the entity
  const cube = new Entity()

  // add a transform to the entity
  cube.addComponent(new Transform({ position: new Vector3(x, y, z) }))

  // add a shape to the entity
  cube.addComponent(new BoxShape())

  // add the entity to the engine
  engine.addEntity(cube)

  return cube
}

/// --- Spawn a cube ---

// const cube = spawnCube(8, 1, 8)

// cube.addComponent(
//   new OnClick(() => {
//     cube.getComponent(Transform).scale.z *= 1.1
//     cube.getComponent(Transform).scale.x *= 0.9

//     spawnCube(Math.random() * 8 + 1, Math.random() * 8, Math.random() * 8 + 1)
//   })
// )

// const saloon = new Saloon();
const land = new Land(new Transform({
  position: new Vector3(8.0, 0.0, 15.8),
  rotation: Quaternion.Euler(0, 0 ,0),
  scale: new Vector3(0.97, 0.97, 0.97)
}));

const soundHub = new SoundHub(trace);

// const instrument = new TestInstrument(trace, soundHub, new Transform({
//   position: new Vector3(8.0, 0.0, 8.0)
// }));

const piano = new Piano(trace, soundHub, new Transform({
  position: new Vector3(2, -0.1, 13.0),
  rotation: Quaternion.Euler(0, -30 ,0),
  scale: new Vector3(0.12, 0.2, 0.2)
}))

function trace (message) {
  console.log(message);
}