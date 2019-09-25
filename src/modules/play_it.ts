import { UIInstrument } from "./ui_instruments/UIInstrument";
import { PushButton } from "./pushbutton";

export class PlayIt extends PushButton {
    ui: UIInstrument;
    constructor(log: (string )=> void, transform: Transform, parent: Entity, ui: UIInstrument) {
        super(log, transform, 'images/playme.jpg', Color3.Black(), () => {
            // When the button is pushed, display the UI
            if (this.ui) {
                this.ui.show();
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
        return null;
    }
    getShape() {
        return new BoxShape();
    }

}