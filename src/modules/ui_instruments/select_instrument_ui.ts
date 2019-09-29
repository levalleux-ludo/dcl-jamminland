import { UIWrapper } from "../ui_wrapper";
import { UIInstrument } from "./UIInstrument";

export class SelectInstrumentUI extends UIWrapper {

    instruments: UIInstrument[] = [];
    currentIndex = 0;
    fnOnSelectInstrument: (string)=> void;
    toolName: UIText;
    nextIcon: UIImage;
    previousIcon: UIImage;
    constructor(log: (string )=> void, parent: UIShape) {
        super(log, parent);
        // this.addToolName();
        this.toolName = new UIText(parent);
        this.toolName.fontSize = 36
        this.toolName.vAlign = 'top'
        // this.toolName.positionY = 100
        this.toolName.width = '200px'
        this.toolName.height = '35px'
        this.toolName.positionX = 60
        // this.toolName.paddingTop = -10
        this.toolName.color = Color4.FromHexString('#0F1217ff')
        this.toolName.value = 'xxxxxxxxxxxxxxx'

        this.nextIcon = new UIImage(parent, new Texture('images/next.png'))
        this.nextIcon.name = 'clickable-image'
        this.nextIcon.width = '12px'
        this.nextIcon.height = '24px'
        this.nextIcon.positionX = 120
        this.nextIcon.vAlign = 'top'
        // this.nextIcon.positionY = 95
        this.nextIcon.paddingTop = -10;
        this.nextIcon.sourceWidth = 64
        this.nextIcon.sourceHeight = 128
        this.nextIcon.isPointerBlocker = true
        this.nextIcon.onClick = new OnClick(() => {
            this.next();
        });

        this.previousIcon = new UIImage(parent, new Texture('images/previous.png'))
        this.previousIcon.name = 'clickable-image'
        this.previousIcon.width = '12px'
        this.previousIcon.height = '24px'
        this.previousIcon.positionX = -60
        this.previousIcon.vAlign = 'top'
        // this.previousIcon.positionY = 95
        this.previousIcon.paddingTop = -10;
        this.previousIcon.sourceWidth = 64
        this.previousIcon.sourceHeight = 128
        this.previousIcon.isPointerBlocker = true
        this.previousIcon.onClick = new OnClick(() => {
            this.previous();
        });
        this.addCloseButton(parent);
        this.hide();
    }
    protected buildControls() {

    }

    protected addToolName() {
        this.cleanControl(this.toolName);
        this.cleanControl(this.nextIcon);
        this.cleanControl(this.previousIcon);

        // this.toolName = new UIText(parent);
        // this.toolName.fontSize = 36
        // // this.toolName.vAlign = 'top'
        // this.toolName.positionY = 100
        // this.toolName.width = '150px'
        // this.toolName.height = '35px'
        // this.toolName.positionX = 60
        // // this.toolName.paddingTop = -10
        // this.toolName.color = Color4.FromHexString('#0F1217ff')
        // this.toolName.value = 'xxxxxxxxxxxxxxx'

        // this.nextIcon = new UIImage(parent, new Texture('images/next.png'))
        // this.nextIcon.name = 'clickable-image'
        // this.nextIcon.width = '12px'
        // this.nextIcon.height = '24px'
        // this.nextIcon.positionX = 120
        // // this.nextIcon.vAlign = 'top'
        // this.nextIcon.positionY = 95
        // this.nextIcon.paddingTop = -10;
        // this.nextIcon.sourceWidth = 64
        // this.nextIcon.sourceHeight = 128
        // this.nextIcon.isPointerBlocker = true
        // this.nextIcon.onClick = new OnClick(() => {
        //     this.next();
        // });

        // this.previousIcon = new UIImage(parent, new Texture('images/previous.png'))
        // this.previousIcon.name = 'clickable-image'
        // this.previousIcon.width = '12px'
        // this.previousIcon.height = '24px'
        // this.previousIcon.positionX = -60
        // // this.previousIcon.vAlign = 'top'
        // this.previousIcon.positionY = 95
        // this.previousIcon.paddingTop = -10;
        // this.previousIcon.sourceWidth = 64
        // this.previousIcon.sourceHeight = 128
        // this.previousIcon.isPointerBlocker = true
        // this.previousIcon.onClick = new OnClick(() => {
        //     this.previous();
        // });
    }
    public onSelectInstrument(onSelectInstrument: (string)=> void) {
        this.fnOnSelectInstrument = onSelectInstrument;
    }
    protected refreshNavBar(visible: boolean) {
        this.toolName.visible = visible;
        this.nextIcon.visible = visible;
        this.previousIcon.visible = visible;
        this.closeIcon.visible = visible;
        this.nextIcon.isPointerBlocker = visible;
        this.previousIcon.isPointerBlocker = visible;
        this.closeIcon.isPointerBlocker = visible;
    }
    protected change(index: number) {
        this.log("on change instrument selected; Current index=" + this.currentIndex + " new_index=" + index);
        if (this.instruments.length > 0) {
            this.refreshNavBar(false);
            this.instruments[this.currentIndex].hide();
            this.currentIndex = index;
            this.instruments[this.currentIndex].show();
            this.toolName.value = this.instruments[this.currentIndex].getInstrument();
            if (this.container.visible) this.refreshNavBar(true);
            if (this.fnOnSelectInstrument)
                this.fnOnSelectInstrument(this.instruments[this.currentIndex].getInstrument());
        }
    }
    protected next() {
        this.change((this.currentIndex + 1) % this.instruments.length);
    }
    protected previous() {
        if (this.currentIndex === 0)
            this.change(this.instruments.length -1 );
        else
            this.change((this.currentIndex - 1) % this.instruments.length);
    }
    public addInstrumentUI(instrument: UIInstrument) {
        this.instruments.push(instrument);
        // this.addToolName();
        // this.addCloseButton();
        this.change(this.instruments.length-1);
    }
    private getIndexForInstrument(instrument: UIInstrument): number {
        return this.instruments.indexOf(instrument)
    }
    public selectInstrument(instrument: UIInstrument) {
        let index = this.getIndexForInstrument(instrument);
        this.log("Get index " + index + " for instrument " + instrument);
        if (index !== -1) this.change(index);
    }
    public hide() {
        super.hide();
        this.refreshNavBar(false);
    }
    public show() {
        super.show();
        this.refreshNavBar(true);
    }

}
