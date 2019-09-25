import { ISoundHub } from "../soundhub/soundhub";
import { TempoUI } from "./tempoUI";
import { Tempo } from "../recorder/tempo";
import { TrackUI, eTrackStatus } from "./trackUI";
import { TrackRecorder } from "../recorder/trackRecorder";

export class RecorderUI {
    container: UIContainerRect;
    log: (string )=> void;
    soundHub: ISoundHub;
    image: UIImage;
    indicator: TempoUI;
    tempo: Tempo;
    tracks: TrackUI[] = [];
    instrument: string;
    constructor(log: (string )=> void, parent: UIShape, soundHub: ISoundHub, tempo: Tempo) {
        this.log = log;
        this.soundHub = soundHub;
        this.tempo = tempo;
        this.container = new UIContainerRect(parent);
        this.container.width = 360;
        this.container.height = 230;
        this.container.hAlign = 'right';
        this.container.vAlign = 'center';
        // this.container.positionY = '0%';
        // this.container.adaptHeight = true;
        this.container.isPointerBlocker = true;
        this.container.visible = false;

        let imageTexture = new Texture('images/audio_device_background_2.png');
        this.image = new UIImage(this.container, imageTexture);
        this.image.hAlign = 'center';
        // this.image.positionY = '0%';
        this.image.vAlign = 'top';
        // this.image.paddingTop = '50%';
        this.image.sourceWidth = 650;
        this.image.sourceHeight = 416;
        this.image.width = `100%`;
        this.image.height = `100%`;
        this.image.opacity = 0.7;
        // this.image.isPointerBlocker = true;

        let posXs = [-50, 120];
        // let posYs = ['-25%', '-10%', '+5%', '+20%'];
        let posYs = ['20%', '5%', '-10%', '-25%'];
        for (let i = 0; i < 2; i++) {
            for (let j = 0; j < 4; j++) {
                let track = new TrackUI(this.log, this.image);
                track.setPosition(posXs[i], posYs[j]);
                track.registerOnStatusChanged((theTrack, status) => {
                    this.refreshTrackActivation();
                });
                this.tracks.push(track);
            }
        }
        this.refreshTrackActivation();

        this.indicator = new TempoUI(this.log, this.image);
        this.indicator.setPosition(-80, '+38%');
        this.indicator.registerOnTempoChanged((isStarted:boolean, isFrozen:boolean)=>{
            if (isStarted) {
                if (this.tempo.isFrozen) {
                    this.indicator.setBeat(1+this.tempo.getCurrentBeatInPhrase());
                    this.tempo.resume();
                } else {
                    this.indicator.setBeat(1+this.tempo.getCurrentBeatInPhrase());
                    this.tempo.start();
                }
            } else if (isFrozen) {
                this.tempo.freeze();
                this.indicator.setBeat(1+this.tempo.getCurrentBeatInPhrase());
            } else {
                this.indicator.setBeat(0);
                this.tempo.stop();
            }
        });
        this.tempo.registerOnBeat((currentPhrase:number, currentBar:number, currentBeat: number, currentBeatInPhrase: number) => {
            this.indicator.setBeat(1+currentBeatInPhrase);
        });

        const closeIcon = new UIImage(this.container, new Texture('images/close-icon3.png'))
        closeIcon.name = 'clickable-image'
        closeIcon.width = '50px'
        closeIcon.height = '50px'
        closeIcon.hAlign = 'right'
        closeIcon.vAlign = 'top'
        closeIcon.sourceWidth = 128
        closeIcon.sourceHeight = 128
        closeIcon.isPointerBlocker = true
        closeIcon.onClick = new OnClick(() => {
            this.container.visible = false
            this.container.isPointerBlocker = false
            // log('clicked on the close image ', this.visible)
        })


    }

    refreshTrackActivation() {
        // We want only one track in RECORDING or EMPTY mode, otherwise :
        // - if none of them, then activate the first DISABLED one
        // - or if several of them, disable all except the first one
        let recording = false;
        let firstEmpty: TrackUI = null;
        let firstDisabled: TrackUI = null;
        for (let track of this.tracks) {
            if (track.getStatus() == eTrackStatus.EMPTY) {
                if (!firstEmpty) {
                    firstEmpty = track;
                } else {
                    track.enable(false);
                }
            }
            if (track.getStatus() == eTrackStatus.RECORDING) {
                recording = true;
            }
            if (!firstDisabled && (track.getStatus() == eTrackStatus.DISABLED)) {
                firstDisabled = track;
            }
        }
        if (recording && firstEmpty) firstEmpty.enable(false);
        if (!recording && !firstEmpty && firstDisabled) {
            let trackRecorder = new TrackRecorder(this.log, this.instrument, this.soundHub, this.tempo);
            firstDisabled.setTrackRecorder(trackRecorder);
            firstDisabled.enable(true);
        }
    }

    public setActiveInstrument(instrument: string) {
        this.instrument = instrument;
        this.tracks.forEach(track => {
            track.setTrackRecorder(new TrackRecorder(this.log, this.instrument, this.soundHub, this.tempo));
        })
    }

    public display() {
        this.container.visible = true;
    }
}