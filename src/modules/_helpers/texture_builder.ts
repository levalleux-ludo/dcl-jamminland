export class TextureBuilder {
    imgSources: {[key: string]: string};
    textures: {[key: string]: Texture} = {};
    constructor(images: {[key: string]: string}) {
        this.imgSources = images;
    }
    get(key: string) {
        if (!this.textures[key]) {
            this.textures[key] = new Texture(this.imgSources[key]);
        }
        return this.textures[key];
    }
}