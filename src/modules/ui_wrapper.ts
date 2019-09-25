
export abstract class UIWrapper {
    public display() {
        this.container.visible = true;
    }

    protected container: UIContainerRect;
    log: (string )=> void;
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
    protected addCloseButton() {
        const closeIcon = new UIImage(this.container, new Texture('images/close-icon3.png'))
        closeIcon.name = 'clickable-image'
        closeIcon.width = '50px'
        closeIcon.height = '50px'
        closeIcon.hAlign = 'right'
        closeIcon.vAlign = 'top'
        closeIcon.sourceWidth = 128
        closeIcon.sourceHeight = 128
        closeIcon.isPointerBlocker = true
        closeIcon.onClick = new OnClick(() => {
            this.hide();
        });
    }
    public show() {
        this.container.visible = true;
        this.container.isPointerBlocker = true;
    }
    public hide() {
        this.container.visible = false;
        this.container.isPointerBlocker = false;
    }
    public isVisible() {
        return this.container.visible;
    }
}