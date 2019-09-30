export class ImageContainer {
    _images: {[key: string]: {source: Texture, sourceWidth: number, sourceHeight: number, onClick: OnClick}} = {};
    _container: UIContainerRect;
    _image: UIImage = null;
    constructor(parent: UIShape) {
        this._container = new UIContainerRect(parent);
    }
    public container()  {
        return this._container;
    }
    private createImage(source: Texture) {
        this._image = new UIImage(this._container, source);
        this._image.width = '100%';
        this._image.height = '100%';
        this._image.visible = false;
    }
    public registerImage(key: string, source: Texture, sourceWidth: number, sourceHeight: number) {
        this._images[key] = {source: source, sourceWidth: sourceWidth, sourceHeight: sourceHeight, onClick: null};
    }
    public makeOneVisible(key:string) {
        if (this._images[key]) {
            let {source, sourceWidth, sourceHeight, onClick} = this._images[key];
            if (!this._image) { // image has never been created
                this.createImage(source);
            } else { // only reset the source
                this._image.visible = false;
                this._image.source = source;
            }
            // always reset the source width/height and callback
            this._image.sourceWidth = sourceWidth;
            this._image.sourceHeight = sourceHeight;
            this._image.onClick = onClick;
            this._image.visible = true;
        } else {
            // throw error
        }
    }
    public makeAllInvisible() {
        if (this._image) { // image has never been created
            this._image.visible = false;
        }
    }
    public registerOnClickImage(key: string, callback: OnClick) {
        if (this._images[key]) {
            this._images[key].onClick = callback;
        }
    }

}