export class ImageContainer {
    _images: {[key: string]: UIImage} = {};
    _container: UIContainerRect;
    constructor(parent: UIShape) {
        this._container = new UIContainerRect(parent);
    }
    public container()  {
        return this._container;
    }
    public registerImage(key: string, source: Texture, sourceWidth: number, sourceHeight: number) {
        let image = new UIImage(this._container, source);
        image.width = '100%';
        image.height = '100%';
        image.sourceWidth = sourceWidth;
        image.sourceHeight = sourceHeight;
        image.visible = false;
        this._images[key] = image;
    }
    public makeOneVisible(key:string) {
        this.makeAllInvisible();
        this._images[key].visible = true;
    }
    public makeAllInvisible() {
        for(let key in this._images) {
            this._images[key].visible = false;
        }
    }
    public registerOnClickImage(key: string, callback: OnClick) {
        this._images[key].onClick = callback;
    }

}