import { createUIImage, Image, scaleImage } from "./UIUtils";

const img_background = new Image( {
    texture: new Texture("images/commit_background.png"),
    width: 712,
    height: 1245
});
const img_commit_btn = new Image( {
    texture: new Texture("images/commit_button.png"),
    width: 660,
    height: 70
});
const img_close_btn = new Image( {
    texture: new Texture("images/btn_close.png"),
    width: 152,
    height: 151
});
const img_item_for_sale = new Image( {
    texture: new Texture("images/item_for_sale.png"),
    width: 580,
    height: 468
});

export class UICommit {
    protected container: UIContainerRect;

    constructor(private parent: UIShape) {
        this.container = new UIContainerRect(parent);
        this.container.width = '350px';
        this.container.height = '600px';
        this.container.positionX = "200px";
        this.container.positionY = "50px";
        this.container.color = Color4.White();
        // this.container.hAlign = 'center';
        // this.container.vAlign = 'top';
        // this.container.isPointerBlocker = true;
        this.container.visible = false;

        const background = createUIImage(this.container, img_background);
        scaleImage(background, 350, 600);
        // background.positionX = "200px";
        // background.positionY = "50px";

        const closeButton = createUIImage(this.container, img_close_btn);
        scaleImage(closeButton, 36, 36);
        closeButton.positionX = "150px";
        closeButton.positionY = "282px";
        closeButton.isPointerBlocker = true;
        closeButton.onClick = new OnClick((e) => {
            log('click on Close');
            this.hide();
        })


        const commitButton = createUIImage(this.container, img_commit_btn);
        scaleImage(commitButton, 300, 60);
        // commitButton.positionX = "200px";
        commitButton.positionY = "-270px";
        commitButton.isPointerBlocker = true;
        commitButton.onClick = new OnClick((e) => {
            log('click on Commit');
            this.hide();
        })

        const itemForSale = createUIImage(this.container, img_item_for_sale);
        scaleImage(itemForSale, 300, 300);
        // itemForSale.positionX = "200px";
        itemForSale.positionY = "50px";

    }

    public show() {
        this.container.visible = true;
    }
    public hide() {
        this.container.visible = false;
    }
}