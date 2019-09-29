import { PushButton } from "./pushbutton";

let materialBox: Material = null;
const image = new Texture('images/playme.jpg');
export class PlayIt extends PushButton {
    constructor(log: (string )=> void, transform: Transform, parent: Entity, onPushed: ()=>void) {
        super(log, transform, image, onPushed, parent);
    }
    getMaterial() {
        if (!materialBox) {
            materialBox = new Material();
            materialBox.albedoColor = Color3.Black();
            materialBox.hasAlpha = true;
            materialBox.alpha = 0.5;
            materialBox.emissiveColor = Color3.Yellow();
        }
        return materialBox;
    }
}