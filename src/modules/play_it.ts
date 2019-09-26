import { PushButton } from "./pushbutton";
import { UIWrapper } from "./ui_wrapper";

export class PlayIt extends PushButton {
    ui: UIWrapper;
    constructor(log: (string )=> void, transform: Transform, parent: Entity, ui: UIWrapper) {
        super(log, transform, 'images/playme.jpg', () => {
            // When the button is pushed, display the UI
            if (!this.ui.isVisible()) {
                this.ui.show();
            } else {
                this.ui.hide();
            }
        }, parent);
        this.ui = ui;
        // this.entity.addComponent(new OnClick(e => {
        //     this.log("Click on PlayIt !");
        //     if (this.ui) {
        //         this.ui.show();
        //     }
        // }))
    }
    getMaterial() {
        const materialBox = new Material();
        materialBox.albedoColor = Color3.Black();
        materialBox.hasAlpha = true;
        materialBox.alpha = 0.5;
        materialBox.emissiveColor = Color3.Yellow();
        return materialBox;
    }
}