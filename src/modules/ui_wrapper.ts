import utils from "../../node_modules/decentraland-ecs-utils/index"

const img_closeIcon = new Texture('images/close-icon3.png');

export abstract class UIWrapper {
    protected container: UIContainerRect;
    private txt_loading: UIText;
    log: (string )=> void;
    protected closeIcon: UIImage;
    isBuilt = false;
    constructor(log: (string )=> void, parent: UIShape) {
        this.log = log;
        this.container = new UIContainerRect(parent);
        this.container.width = '100%';
        this.container.height = '33%';
        this.container.hAlign = 'center';
        this.container.vAlign = 'top';
        this.container.isPointerBlocker = true;
        this.container.visible = false;
        this.txt_loading = new UIText(this.container);
        this.txt_loading.value = 'Loading UI ...'
        this.txt_loading.hTextAlign = 'center';
        this.txt_loading.vTextAlign = 'center';
        this.txt_loading.width = '100%'
        this.txt_loading.height = '100%'
        this.txt_loading.opacity = 0.8;
        this.txt_loading.fontAutoSize = true;
    }
    protected abstract buildControls();
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
        if (!this.isBuilt) {
            this.txt_loading.visible = true;
            this.container.visible = true;
            let entity = new Entity();
            entity.addComponent(new utils.Delay(100,()=>{
                this.buildControls();
                this.txt_loading.visible = false;
                this.txt_loading.dirty = true; // Any way to unreference it ?
                this.isBuilt = true;
                this.show(); // recall, but now the condition isBuilt has changed
            }));
            engine.addEntity(entity);
        }
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