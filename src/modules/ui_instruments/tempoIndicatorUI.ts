import { TextureBuilder } from "../_helpers/texture_builder";

const textureBuilder = new TextureBuilder({
    'close': 'images/close-icon3.png'
});

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

        const closeIcon = new UIImage(this.container, textureBuilder.get('close'));
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