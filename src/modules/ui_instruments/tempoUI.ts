import { ImageContainer } from "../image_container";
import { TextureBuilder } from "../_helpers/texture_builder";

const indicatorPositionX = ['-47%', '-40.5%', '-34.5%', '-28.2%', '-22.1%', '-15.9%', '-9.7%', '-3.4%', '3.3%', '9.6%', '15.8%', '22.0%', '28.2%', '34.5%', '40.5%', '47%'];

const textureBuilder = new TextureBuilder({
    'background': 'images/beat_indicator_background.png',
    'lamp_on': 'images/beat_indicator_lampon.png',
    'play': 'images/play_silver.png',
    'pause': 'images/pause_silver.png',
    'stop': 'images/stop_silver.png'
});
export class TempoUI {
    container: UIContainerRect;
    image: UIImage;
    img_play: UIImage;
    img_pause: UIImage;
    play_pause: ImageContainer;
    img_stop: UIImage;
    indicator: UIImage;
    log: (string )=> void;
    constructor(log: (string )=> void, parent: UIShape) {
        this.log = log;
        this.container = new UIContainerRect(parent);
        this.container.width = 100;
        this.container.height = 36;
        this.container.hAlign = 'center';
        // this.container.vAlign = 'top';
        this.container.positionY = '38%';
        this.container.visible = true;
        this.container.isPointerBlocker = true;
        this.container.visible = true;

        this.image = new UIImage(this.container, textureBuilder.get('background'));
        this.image.positionX = 32;
        this.image.positionY = '0%';
        this.image.sourceWidth = 3345;
        this.image.sourceHeight = 172;
        this.image.width = 240;
        this.image.height = 24;
        this.image.onClick = new OnClick(event => {this.log("onClick Background Recorder");});
        // this.image.isPointerBlocker = true;

        this.indicator = new UIImage(this.image, textureBuilder.get('lamp_on'));
        // this.indicator.vAlign = 'center';
        // this.indicator.positionX = '-47%';
        this.indicator.positionX = indicatorPositionX[0];
        this.indicator.positionY = '0%';
        this.indicator.sourceWidth = 212;
        this.indicator.sourceHeight = 172;
        this.indicator.width = `6%`;
        this.indicator.height = `100%`;
        // this.indicator.isPointerBlocker = true;
        this.indicator.visible = false;

        this.play_pause = new ImageContainer(this.container);
        this.play_pause.container().positionX = -78;
        this.play_pause.container().positionY = '0%';
        this.play_pause.container().width = 32;
        this.play_pause.container().height = 32;
        this.play_pause.registerImage('play', textureBuilder.get('play'), 404, 403);
        this.play_pause.registerOnClickImage('play', new OnClick(event => {
            this.log('onclick Play');
            this.play_pause.makeOneVisible('pause');
            this.notifyListener(true, false);
        }));
        this.play_pause.registerImage('pause', textureBuilder.get('pause'), 403, 402);
        this.play_pause.registerOnClickImage('pause', new OnClick(event => {
            this.log('onclick Pause');
            this.play_pause.makeOneVisible('play');
            this.notifyListener(false, true);
        }));
        this.play_pause.makeOneVisible('play');

        this.img_stop = new UIImage(this.container, textureBuilder.get('stop'));
        this.img_stop.positionX = -42;
        this.img_stop.positionY = '0%';
        this.img_stop.sourceWidth = 406;
        this.img_stop.sourceHeight = 404;
        this.img_stop.width = 32;
        this.img_stop.height = 32;
        // this.img_stop.isPointerBlocker = true;
        this.img_stop.onClick = new OnClick(event => {
            this.log('onclick Stop');
            this.play_pause.makeOneVisible('play');
            this.notifyListener(false, false);
        });

    }

    public setPosition(posX, posY) {
        this.container.positionX = posX;
        this.container.positionY = posY;
    }

    public setBeat(beat: number) {
        this.indicator.visible = false;
        if (!isNaN(beat) && (beat > 0) &&  (beat <= indicatorPositionX.length)) {
            this.indicator.positionX = indicatorPositionX[beat-1];
            this.indicator.visible = true;
        } else {
            this.log("INVALID REQUEST beat=" + beat);
        }
    }

    _callbackStartTempo;
    public registerOnTempoChanged(callback: (isStarted:boolean, isFrozen:boolean)=>void) {
        this._callbackStartTempo = callback;
    }

    notifyListener(isStarted:boolean, isFrozen:boolean) {
        if (this._callbackStartTempo) this._callbackStartTempo(isStarted, isFrozen);
    }

}