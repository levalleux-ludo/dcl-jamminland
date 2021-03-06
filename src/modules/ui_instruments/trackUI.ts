import { ImageContainer } from "../image_container";
import { TrackRecorder } from "../recorder/trackRecorder";
import { TextureBuilder } from "../_helpers/texture_builder";
import { AbstractRecorder } from "../recorder/abstractRecorder";
import { Instrument } from "../instruments/Instrument";

export enum eTrackStatus {
    DISABLED,
    EMPTY,
    RECORDING,
    READY,
    PLAYING,
    WAITING
}

const lcdTexts = { 
    'DISABLED': {text: " [+] New track", color: Color4.White(), align: 'left'},
    'EMPTY': {text: " [+] New track", color: Color4.White(), align: 'left'},
    'RECORDING': {text: "*RECORDING*", color: Color4.Red(), align: 'center'},
    'READY': {text: "TRACK_#", color: Color4.Teal(), align: 'left'},
    'PLAYING': {text: "*REPLAY*", color: Color4.Green(), align: 'left'},
    'WAITING': {text: "*WAITING*", color: Color4.Yellow(), align: 'center'}
 };

const textureBuilder = new TextureBuilder({
    'play': 'images/play.png',
    'stop': 'images/stop.png',
    'record': 'images/record.png',
    'record_off': 'images/record_off.png',
    'cross_active': 'images/cross_active.png',
    'cross': 'images/cross.png',
    'lcd': 'images/LCD_background.png',
    'lcd_playing': 'images/LCD_background_playing.png',
});
export class TrackUI {
    instrument: string;
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
    txt_lcd_text: UIText;
    txt_instrument: UIText;
    status: eTrackStatus = eTrackStatus.DISABLED;
    recorder: AbstractRecorder = null;
    log: (string )=> void;
    auto_loop = true;
    constructor(log: (string )=> void, parent: UIShape, recorder: AbstractRecorder) {
        this.log = log;
        this.recorder = recorder;
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
        this.play_stop_rec.registerImage('play', textureBuilder.get('play'), 70, 70);
        this.play_stop_rec.registerOnClickImage('play', new OnClick(event => {
            this.log('onclick Play');
            if (this.status == eTrackStatus.DISABLED) return;
            if (this.status == eTrackStatus.READY) {
                this.changeStatus(eTrackStatus.PLAYING);
            }
        }));
        this.play_stop_rec.registerImage('stop', textureBuilder.get('stop'), 70, 70);
        this.play_stop_rec.registerOnClickImage('stop', new OnClick(event => {
            this.log('onclick Stop');
            if (this.status == eTrackStatus.DISABLED) return;
            if ((this.status == eTrackStatus.PLAYING) || (this.status == eTrackStatus.RECORDING)) {
                this.changeStatus(eTrackStatus.READY);
            }
        }));
        this.play_stop_rec.registerImage('record', textureBuilder.get('record'), 70, 71);
        this.play_stop_rec.registerOnClickImage('record', new OnClick(event => {
            this.log('onclick Rec');
            if (this.status == eTrackStatus.DISABLED) return;
            if (this.status == eTrackStatus.EMPTY) {
                this.changeStatus(eTrackStatus.RECORDING);
            }
        }));
        this.play_stop_rec.registerImage('disabled', textureBuilder.get('record_off'), 70, 70);
        
        this.lcd = new ImageContainer(this.container);
        this.lcd.registerImage('inactive', textureBuilder.get('lcd'), 417, 178);
        this.lcd.registerImage('active', textureBuilder.get('lcd_playing'), 417, 178);
        this.lcd.container().positionX = '-15%';
        this.lcd.container().positionY = '0%';
        this.lcd.container().width = 115;
        this.lcd.container().height = '100%';
        this.lcd.container().visible = true;

        this.delete = new ImageContainer(this.container);
        this.delete.container().positionX = 45;
        this.delete.container().positionY = '0%';
        this.delete.container().width = 24;
        this.delete.container().height = 24;
        this.delete.registerImage('active', textureBuilder.get('cross_active'), 81,84);
        this.delete.container().isPointerBlocker = true;
        this.delete.registerOnClickImage('active', new OnClick(event => {
            this.log('onclick Delete');
            if (this.status == eTrackStatus.READY) {
                this.changeStatus(eTrackStatus.EMPTY);
            }
        }));
        this.delete.registerImage('inactive', textureBuilder.get('cross'), 81,84);

        this.txt_lcd_text = new UIText(this.container);
        this.txt_lcd_text.width = 100;
        this.txt_lcd_text.positionX = '-14%';
        this.txt_lcd_text.positionY = '45%';
        this.setTextGeometry(this.txt_lcd_text);

        this.txt_instrument = new UIText(this.container);
        this.txt_instrument.width = 8;
        this.txt_instrument.height = 8;
        this.txt_instrument.vAlign = 'bottom';
        this.txt_instrument.hTextAlign = 'left';
        this.txt_instrument.paddingBottom = 2;
        this.txt_instrument.hAlign = 'left';
        this.txt_instrument.fontAutoSize = true;
        this.txt_instrument.visible = false;

        this.swapButtonsAndTexts();

    }

    public setActiveInstrument(instrument: string) {
        const instrument_chars = {
            'piano': 'P',
            'bass': 'B',
            'guitar_elec': 'E',
            'drums': 'D',
            'unknown': '?'
        };
        this.instrument = instrument;
        let instrument_char = instrument_chars[instrument];
        if (!instrument_char)
            instrument_char = instrument_chars['unknown'];

        this.recorder.setActiveInstrument(instrument);
        this.txt_instrument.visible = true;
        this.txt_instrument.value = instrument_char;
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

    refresh_lcd_text() {
        let status = eTrackStatus[this.status];
        this.txt_lcd_text.value = lcdTexts[status].text;
        this.txt_lcd_text.color = lcdTexts[status].color;
        this.txt_lcd_text.hTextAlign = lcdTexts[status].align;
     }
    
    setTextGeometry(text: UIText) {
        let fontFamily = 'LCD';
        let fontAutoSize = true;
        let fontWeight = 'bold';
        text.fontSize = 15;
        // text.fontFamily = 'LCD';
        // text.fontAutoSize = fontAutoSize;
        text.fontWeight = fontWeight;
    }

    swapButtonsAndTexts() {
        this.refresh_lcd_text();
        switch (this.status) {
            case eTrackStatus.DISABLED: {
                this.play_stop_rec.makeOneVisible('disabled');
                this.delete.makeAllInvisible();
                this.lcd.makeOneVisible('inactive');
                break;
            }
            case eTrackStatus.EMPTY: {
                this.play_stop_rec.makeOneVisible('record');
                this.delete.makeAllInvisible();
                this.lcd.makeOneVisible('inactive');
                break;
            }
            case eTrackStatus.RECORDING: {
                this.play_stop_rec.makeOneVisible('stop');
                this.delete.makeOneVisible('inactive');
                this.lcd.makeOneVisible('active');
                break;
            }
            case eTrackStatus.READY: {
                this.play_stop_rec.makeOneVisible('play');
                this.delete.makeOneVisible('active');
                this.lcd.makeOneVisible('inactive');
                break;
            }
            case eTrackStatus.PLAYING: {
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

    // AUTO LOOP
    onReplayFinish() {
        this.log("LoopRecorder::onReplayFinish()");
        if (this.auto_loop) {
            // restart playing until stop is asked
            this.recorder.startPlaying(() => {this.onReplayFinish()});
        } else {
            this.changeStatus(eTrackStatus.READY);
        }
    }
    onRecordFinish() {
        this.log("LoopRecorder::onRecordFinish()");
        if (this.auto_loop) {
            // switch to replay immediately
            this.changeStatus(eTrackStatus.PLAYING);
        } else {
            this.changeStatus(eTrackStatus.READY);
        }
    }
    changeStatus(newStatus: eTrackStatus, notify: boolean = true) {
        let oldStatus = this.status;
        if (oldStatus == newStatus) return;
        this.status = newStatus;
        this.swapButtonsAndTexts();
        if (this.status == eTrackStatus.RECORDING) {
            this.recorder.startRecording(() => {this.onRecordFinish()});
        }
        if (oldStatus == eTrackStatus.RECORDING) {
            this.recorder.stop();
        }
        if (this.status == eTrackStatus.PLAYING) {
            this.recorder.startPlaying(() => {this.onReplayFinish()});
        }
        if (oldStatus == eTrackStatus.PLAYING) {
            this.recorder.stop();
        }
        if (notify && this.onChangeCallback) this.onChangeCallback(this, newStatus);
    }

    public getStatus(): eTrackStatus {
        return this.status;
    }

}