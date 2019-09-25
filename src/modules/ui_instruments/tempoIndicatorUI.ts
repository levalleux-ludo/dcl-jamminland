export class TempoIndicatorUI  {
    container: UIContainerRect;
    constructor(parent: UIShape) {
        // super(parent);
        this.container = new UIContainerRect(parent);
        this.container.height = "50%";
        this.container.width = "50%";
        this.container.hAlign = 'center';
        this.container.vAlign = 'center';

        this.container.visible = false;
        this.container.isPointerBlocker = false;

        // let imageTexture = new Texture('images/image002.jpg');
        // const image = new UIImage(this.container, imageTexture);
        // image.hAlign = 'center'
        // image.vAlign = 'center'
        // image.sourceLeft = 0
        // image.sourceTop = 0
        // image.sourceWidth = 1000
        // image.sourceHeight = 1000
        // image.width = `200px`
        // image.height = `200px`
        // image.positionX = 20
        // image.positionY = -30

        const closeIcon = new UIImage(this.container, new Texture('images/close-icon3.png'));
        closeIcon.name = 'clickable-image';
        closeIcon.width = '50px';
        closeIcon.height = '50px';
        closeIcon.hAlign = 'right';
        closeIcon.vAlign = 'top';
        closeIcon.sourceWidth = 128;
        closeIcon.sourceHeight = 128;
        closeIcon.isPointerBlocker = true;
        closeIcon.onClick = new OnClick(() => {
            this.container.visible = false;
            this.container.isPointerBlocker = false;
        });
    }

    public display() {
        this.container.visible = true;
        this.container.isPointerBlocker = true;
    }
    public mask() {
        this.container.visible = false;
        this.container.isPointerBlocker = false;
    }
}