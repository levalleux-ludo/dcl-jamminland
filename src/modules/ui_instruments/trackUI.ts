import { ImageContainer } from "../image_container";
import { TrackRecorder } from "../recorder/trackRecorder";

export enum eTrackStatus {
    DISABLED,
    EMPTY,
    RECORDING,
    READY,
    PLAYING
}

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
        this.play_stop_rec.registerImage('play', 'images/play.png', 70, 70);
        this.play_stop_rec.registerOnClickImage('play', new OnClick(event => {
            this.log('onclick Play');
            if (this.status == eTrackStatus.DISABLED) return;
            if (this.status == eTrackStatus.READY) {
                this.changeStatus(eTrackStatus.PLAYING);
            }
        }));
        this.play_stop_rec.registerImage('stop', 'images/stop.png', 70, 70);
        this.play_stop_rec.registerOnClickImage('stop', new OnClick(event => {
            this.log('onclick Stop');
            if (this.status == eTrackStatus.DISABLED) return;
            if ((this.status == eTrackStatus.PLAYING) || (this.status == eTrackStatus.RECORDING)) {
                this.changeStatus(eTrackStatus.READY);
            }
        }));
        this.play_stop_rec.registerImage('record', 'images/record.png', 70, 71);
        this.play_stop_rec.registerOnClickImage('record', new OnClick(event => {
            this.log('onclick Rec');
            if (this.status == eTrackStatus.DISABLED) return;
            if (this.status == eTrackStatus.EMPTY) {
                this.changeStatus(eTrackStatus.RECORDING);
            }
        }));
        this.play_stop_rec.registerImage('disabled', 'images/record_off.png', 70, 70);
        
        
        // this.img_play = new UIImage(this.container, new Texture('images/play.png'));
        // this.img_play.sourceWidth = 70;
        // this.img_play.sourceHeight = 70;
        // this.setButtonGeometry(this.img_play);
        // this.img_play.onClick = new OnClick(event => {
        //     this.log('onclick Play');
        //     if (this.status == eTrackStatus.READY) {
        //         this.status = eTrackStatus.PLAYING;
        //         this.swapButtonsAndTexts();
        //     }
        // });

        // this.img_stop = new UIImage(this.container, new Texture('images/stop.png'));
        // this.img_stop.sourceWidth = 70;
        // this.img_stop.sourceHeight = 70;
        // this.setButtonGeometry(this.img_stop);
        // this.img_stop.onClick = new OnClick(event => {
        //     this.log('onclick Stop');
        //     if ((this.status == eTrackStatus.PLAYING) || (this.status == eTrackStatus.RECORDING)) {
        //         this.status = eTrackStatus.READY;
        //         this.swapButtonsAndTexts();
        //     }
        // });

        // this.img_rec = new UIImage(this.container, new Texture('images/record.png'));
        // this.img_rec.sourceWidth = 70;
        // this.img_rec.sourceHeight = 71;
        // this.setButtonGeometry(this.img_rec);
        // this.img_rec.onClick = new OnClick(event => {
        //     this.log('onclick Rec');
        //     if (this.status == eTrackStatus.EMPTY) {
        //         this.status = eTrackStatus.RECORDING;
        //         this.swapButtonsAndTexts();
        //     }
        // });

        this.delete = new ImageContainer(this.container);
        this.delete.container().positionX = 15;
        this.delete.container().positionY = '0%';
        this.delete.container().width = 24;
        this.delete.container().height = 24;
        this.delete.registerImage('active', 'images/cross_active.png', 81,84);
        this.delete.registerOnClickImage('active', new OnClick(event => {
            this.log('onclick Delete');
            if (this.status == eTrackStatus.READY) {
                this.changeStatus(eTrackStatus.EMPTY);
            }
        }));
        this.delete.registerImage('inactive', 'images/cross.png', 81,84);

        // this.img_delete = new UIImage(this.container, new Texture('images/cross_active.png'));
        // this.img_delete.sourceWidth = 81;
        // this.img_delete.sourceHeight = 84;
        // this.img_delete.positionX = 70;
        // this.img_delete.positionY = '0%';
        // this.img_delete.width = 32;
        // this.img_delete.height = 32;
        // this.img_delete.onClick = new OnClick(event => {
        //     this.log('onclick Delete');
        //     if (this.status == eTrackStatus.READY) {
        //         this.status = eTrackStatus.EMPTY;
        //         this.swapButtonsAndTexts();
        //     }
        // });

        this.lcd = new ImageContainer(this.container);
        this.lcd.registerImage('inactive', 'images/LCD_background.png', 417, 178);
        this.lcd.registerImage('active', 'images/LCD_background_playing.png', 417, 178);
        this.lcd.container().positionX = '-15%';
        this.lcd.container().positionY = '0%';
        this.lcd.container().width = 115;
        this.lcd.container().height = '100%';
        this.lcd.container().visible = true;

        // let imageLCD = new UIImage(this.container, new Texture('images/LCD_background.png'));
        // imageLCD.positionX = '-15%';
        // imageLCD.positionY = '0%';
        // imageLCD.sourceWidth = 417;
        // imageLCD.sourceHeight = 178;
        // imageLCD.width = 160;
        // imageLCD.height = '100%';
        // imageLCD.visible = true;

        // this.imageLCD_playing = new UIImage(imageLCD, new Texture('images/LCD_background_playing.png'));
        // this.imageLCD_playing.positionX = '-15%';
        // this.imageLCD_playing.positionY = '0%';
        // this.imageLCD_playing.sourceWidth = 417;
        // this.imageLCD_playing.sourceHeight = 178;
        // this.imageLCD_playing.width = '100%';
        // this.imageLCD_playing.height = '100%';
        // this.imageLCD_playing.visible = false;

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

    // setButtonGeometry(button: UIImage) {
    //     let button_posX = -120;
    //     let button_posY = 0;
    //     let button_width = 32;
    //     let button_height = 32;
    //     button.isPointerBlocker = true;
    //     button.positionX = button_posX;
    //     button.positionY = button_posY;
    //     button.width = button_width;
    //     button.height = button_height;
    // }

    swapButtonsAndTexts() {
        switch (this.status) {
            case eTrackStatus.DISABLED: {
                // this.img_rec.visible = true;
                // this.img_play.visible = false;
                // this.img_delete.visible = false;
                // this.img_stop.visible = false;
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
                // this.img_rec.visible = true;
                // this.img_play.visible = false;
                // this.img_delete.visible = false;
                // this.img_stop.visible = false;
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
                // this.img_rec.visible = false;
                // this.img_play.visible = false;
                // this.img_delete.visible = false;
                // this.img_stop.visible = true;
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
                // this.img_rec.visible = false;
                // this.img_play.visible = true;
                // this.img_delete.visible = true;
                // this.img_stop.visible = false;
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
                // this.img_rec.visible = false;
                // this.img_play.visible = false;
                // this.img_delete.visible = false;
                // this.img_stop.visible = true;
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