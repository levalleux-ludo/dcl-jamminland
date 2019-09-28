import { PushButton } from "./pushbutton";
import { UIWrapper } from "./ui_wrapper";

let materialBox: Material = null;
const image = new Texture('images/playme.jpg');
export class PlayIt extends PushButton {
    // ui: UIWrapper;
    constructor(log: (string )=> void, transform: Transform, parent: Entity, onPushed: ()=>void) {
        super(log, transform, image, onPushed, parent);
        // this.ui = ui;
        // this.entity.addComponent(new OnClick(e => {
        //     this.log("Click on PlayIt !");
        //     if (this.ui) {
        //         this.ui.show();
        //     }
        // }))
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