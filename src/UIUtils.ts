export class Image {
    texture: Texture;
    width: number;
    height: number;
    constructor(data: {texture: Texture, width: number, height: number}) {
        this.texture = data.texture;
        this.width = data.width;
        this.height = data.height;

    }
}
export function scaleImage(uiImage: UIImage, newWidth?: number, newHeight?: number) {
    if (newWidth) {
        uiImage.width = newWidth;
        uiImage.height = newWidth * uiImage.sourceHeight / uiImage.sourceWidth;
        if (newHeight && newHeight < uiImage.height) {
            uiImage.height = newHeight;
            uiImage.width = newHeight * uiImage.sourceWidth / uiImage.sourceHeight;
        }
    } else if (newHeight) {
        uiImage.height = newHeight;
        uiImage.width = newHeight * uiImage.sourceWidth / uiImage.sourceHeight;
    }
}

export function createUIImage(parent: UIShape, image: Image): UIImage {
    let uiImage = new UIImage(parent, image.texture);
    uiImage.sourceWidth = image.width;
    uiImage.sourceHeight = image.height;
    return uiImage;
}
