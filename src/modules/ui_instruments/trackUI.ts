import { ImageContainer } from "../image_container";
import { TrackRecorder } from "../recorder/trackRecorder";

export enum eTrackStatus {
    DISABLED,
    EMPTY,
    RECORDING,
    READY,
    PLAYING
}

const texture_play = new Texture('images/play.png');
const texture_stop = new Texture('images/stop.png');
const texture_record = new Texture('images/record.png');
const texture_record_off = new Texture('images/record_off.png');
const texture_cross_active = new Texture('images/cross_active.png');
const texture_cross = new Texture('images/cross.png');
const texture_lcd = new Texture('images/LCD_background.png');
const texture_lcd_playing = new Texture('images/LCD_background_playing.png');
export class TrackUI {
    container: UIContainerRect;
    image: UIImage;
    lcd: ImageContainer;
    play_stop_rec: ImageContainer;
    delete: ImageContainer;
    imageLCD_playing: UIImage;
    img_play: UIImage;
    img_stop: UIImage;
    img_rec: UIImage;
    img_delete: UIImage;
    img_delete_inactive: UIImage;
    txt_new_track: UIText;
    txt_recording: UIText;
    txt_playing: UIText;
    txt_track: UIText;
    status: eTrackStatus = eTrackStatus.DISABLED;
    trackRecorder: TrackRecorder = null;
    log: (string )=> void;
    constructor(log: (string )=> void, parent: UIShape) {
        this.log = log;
        this.container = new UIContainerRect(parent);
        this.container.width = 160;
        this.container.height = 40;
        this.container.hAlign = 'center';
        // this.indicator.vAlign = 'top';
        this.container.positionY = 56;
        this.container.visible = true;
        this.container.isPointerBlocker = true;
        this.container.visible = true;
        this.container.opacity = 1.0;

        this.play_stop_rec = new ImageContainer(this.container);
        this.play_stop_rec.container().isPointerBlocker = true;
        this.play_stop_rec.container().positionX = -100;
        this.play_stop_rec.container().positionY = 0;
        this.play_stop_rec.container().width = 28;
        this.play_stop_rec.container().height = 28;
        this.play_stop_rec.registerImage('play', texture_play, 70, 70);
        this.play_stop_rec.registerOnClickImage('play', new OnClick(event => {
            this.log('onclick Play');
            if (this.status == eTrackStatus.DISABLED) return;
            if (this.status == eTrackStatus.READY) {
                this.changeStatus(eTrackStatus.PLAYING);
            }
        }));
        this.play_stop_rec.registerImage('stop', texture_stop, 70, 70);
        this.play_stop_rec.registerOnClickImage('stop', new OnClick(event => {
            this.log('onclick Stop');
            if (this.status == eTrackStatus.DISABLED) return;
            if ((this.status == eTrackStatus.PLAYING) || (this.status == eTrackStatus.RECORDING)) {
                this.changeStatus(eTrackStatus.READY);
            }
        }));
        this.play_stop_rec.registerImage('record', texture_record, 70, 71);
        this.play_stop_rec.registerOnClickImage('record', new OnClick(event => {
            this.log('onclick Rec');
            if (this.status == eTrackStatus.DISABLED) return;
            if (this.status == eTrackStatus.EMPTY) {
                this.changeStatus(eTrackStatus.RECORDING);
            }
        }));
        this.play_stop_rec.registerImage('disabled', texture_record_off, 70, 70);
        
        this.lcd = new ImageContainer(this.container);
        this.lcd.registerImage('inactive', texture_lcd, 417, 178);
        this.lcd.registerImage('active', texture_lcd_playing, 417, 178);
        this.lcd.container().positionX = '-15%';
        this.lcd.container().positionY = '0%';
        this.lcd.container().width = 115;
        this.lcd.container().height = '100%';
        this.lcd.container().visible = true;

        this.delete = new ImageContainer(this.container);
        this.delete.container().positionX = 15;
        this.delete.container().positionY = '0%';
        this.delete.container().width = 24;
        this.delete.container().height = 24;
        this.delete.registerImage('active', texture_cross_active, 81,84);
        this.delete.registerOnClickImage('active', new OnClick(event => {
            this.log('onclick Delete');
            if (this.status == eTrackStatus.READY) {
                this.changeStatus(eTrackStatus.EMPTY);
            }
        }));
        this.delete.registerImage('inactive', texture_cross, 81,84);

        this.txt_new_track = new UIText(this.lcd.container());
        this.txt_new_track.value = " [+] New track";
        this.txt_new_track.hTextAlign = 'left';
        this.setTextGeometry(this.txt_new_track);

        this.txt_recording = new UIText(this.lcd.container());
        this.txt_recording.value = "*RECORDING*";
        this.txt_recording.color = Color4.Red();
        this.txt_recording.hTextAlign = 'center';
        this.setTextGeometry(this.txt_recording);
        this.txt_recording.fontSize = 13;

        this.txt_playing = new UIText(this.lcd.container());
        this.txt_playing.value = "*REPLAY*";
        this.txt_playing.color = Color4.Green();
        this.txt_playing.hTextAlign = 'left';
        this.setTextGeometry(this.txt_playing);
        this.txt_playing.fontSize = 13;

        this.txt_track = new UIText(this.lcd.container());
        this.txt_track.value = "TRACK_#";
        this.txt_track.hTextAlign = 'left';
        this.txt_track.textWrapping = true;
        this.txt_track.color = Color4.Teal();
        this.txt_track.shadowBlur = 20;
        this.setTextGeometry(this.txt_track);

        this.swapButtonsAndTexts();

    }

    public setTrackRecorder (trackRecorder: TrackRecorder) {
        this.trackRecorder = trackRecorder;
    }

    public enable(enable: boolean) {
        let newStatus = eTrackStatus.DISABLED;
        if (enable) {
            newStatus = eTrackStatus.EMPTY;
        }
        this.changeStatus(newStatus, false);
    }

    public setPosition(posX, posY) {
        this.container.positionX = posX;
        this.container.positionY = posY;
    }

    setTextGeometry(text: UIText) {
        let posX = 0;
        let posY = '45%';
        let fontFamily = 'LCD';
        let fontAutoSize = true;
        let fontWeight = 'bold';
        text.fontSize = 15;
        text.width = 100;
        text.positionX = posX;
        text.positionY = posY;
        // text.fontFamily = 'LCD';
        // text.fontAutoSize = fontAutoSize;
        text.fontWeight = fontWeight;
    }

    swapButtonsAndTexts() {
        switch (this.status) {
            case eTrackStatus.DISABLED: {
                this.txt_new_track.visible = true;
                this.txt_new_track.color = Color4.Gray();
                this.txt_recording.visible = false;
                this.txt_playing.visible = false;
                this.txt_track.visible = false;
                this.play_stop_rec.makeOneVisible('disabled');
                this.delete.makeAllInvisible();
                this.lcd.makeOneVisible('inactive');
                break;
            }
            case eTrackStatus.EMPTY: {
                this.txt_new_track.visible = true;
                this.txt_new_track.color = Color4.White();
                this.txt_recording.visible = false;
                this.txt_playing.visible = false;
                this.txt_track.visible = false;
                this.play_stop_rec.makeOneVisible('record');
                this.delete.makeAllInvisible();
                this.lcd.makeOneVisible('inactive');
                break;
            }
            case eTrackStatus.RECORDING: {
                this.txt_new_track.visible = false;
                this.txt_recording.visible = true;
                this.txt_playing.visible = false;
                this.txt_track.visible = false;
                this.play_stop_rec.makeOneVisible('stop');
                this.delete.makeOneVisible('inactive');
                this.lcd.makeOneVisible('active');
                break;
            }
            case eTrackStatus.READY: {
                this.txt_new_track.visible = false;
                this.txt_recording.visible = false;
                this.txt_playing.visible = false;
                this.txt_track.visible = true;
                this.play_stop_rec.makeOneVisible('play');
                this.delete.makeOneVisible('active');
                this.lcd.makeOneVisible('inactive');
                break;
            }
            case eTrackStatus.PLAYING: {
                this.txt_new_track.visible = false;
                this.txt_recording.visible = false;
                this.txt_playing.visible = true;
                this.txt_track.visible = false;
                this.play_stop_rec.makeOneVisible('stop');
                this.delete.makeOneVisible('inactive');
                this.lcd.makeOneVisible('active');
                break;
            }
        }
    }
    onChangeCallback: (me:TrackUI, status:eTrackStatus) => void;
    public registerOnStatusChanged(callback: (me:TrackUI, status:eTrackStatus) => void) {
        this.onChangeCallback = callback;
    }

    changeStatus(newStatus: eTrackStatus, notify: boolean = true) {
        let oldStatus = this.status;
        if (oldStatus == newStatus) return;
        this.status = newStatus;
        this.swapButtonsAndTexts();
        if (this.trackRecorder) {
            if (this.status == eTrackStatus.RECORDING) {
                this.trackRecorder.startRecording();
            }
            if (oldStatus == eTrackStatus.RECORDING) {
                this.trackRecorder.stop();
            }
            if (this.status == eTrackStatus.PLAYING) {
                this.trackRecorder.startPlaying(() => {
                    this.changeStatus(eTrackStatus.READY);
                });
            }
            if (oldStatus == eTrackStatus.PLAYING) {
                this.trackRecorder.stop();
            }
        }
        if (notify && this.onChangeCallback) this.onChangeCallback(this, newStatus);
    }

    public getStatus(): eTrackStatus {
        return this.status;
    }

}