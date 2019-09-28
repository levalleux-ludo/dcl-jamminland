
const img_closeIcon = new Texture('images/close-icon3.png');

export abstract class UIWrapper {
    protected container: UIContainerRect;
    log: (string )=> void;
    protected closeIcon: UIImage;
    constructor(log: (string )=> void, parent: UIShape) {
        this.log = log;
        this.container = new UIContainerRect(parent);
        this.container.width = '100%';
        this.container.height = '33%';
        this.container.hAlign = 'center';
        this.container.vAlign = 'top';
        this.container.isPointerBlocker = true;
        this.container.visible = false;
    }
    protected cleanControl(ctrl: UIShape) {
        // if (ctrl) {
        //     ctrl.visible = false;
        //     ctrl.isPointerBlocker = false;
        //     ctrl.dirty = true;
        // }
    }

    protected addCloseButton(parent: UIShape) {
        this.cleanControl(this.closeIcon);
        this.closeIcon = new UIImage(parent, img_closeIcon)
        this.closeIcon.name = 'clickable-image'
        this.closeIcon.width = '50px'
        this.closeIcon.height = '50px'
        this.closeIcon.hAlign = 'right'
        this.closeIcon.vAlign = 'top'
        this.closeIcon.sourceWidth = 128
        this.closeIcon.sourceHeight = 128
        this.closeIcon.isPointerBlocker = true
        this.closeIcon.onClick = new OnClick(() => {
            this.hide();
        });
    }
    public show() {
        this.container.visible = true;
        this.container.isPointerBlocker = true;
        if (this.closeIcon) {
            this.closeIcon.visible = true;
            this.closeIcon.isPointerBlocker = true;
        }
    }
    public hide() {
        this.container.visible = false;
        this.container.isPointerBlocker = false;
        if (this.closeIcon) {
            this.closeIcon.visible = false;
            this.closeIcon.isPointerBlocker = false;
        }
    }
    public isVisible() {
        return this.container.visible;
    }
    public getContainer() : UIShape {
        return this.container;
    }
}