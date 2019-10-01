import { Interval } from '../../../node_modules/decentraland-ecs-utils/timer/component/interval';

export class Tempo {
    nbBarPerPhrase;
    nbBeatsPerBar;
    tempoBPM;
    timerEntity: Entity;
    upBeatRatio = 4; // convenient for ternary and 4-beat rythme (if tempo 180 bpm, timer period is set to 28 msec)
    timer;
    shallStopAtEndOfBar = false;
    currentTime : number;
    isStarted = false;
    isFrozen = false;
    log: (string) => void;
    private _callbacksUpBeat: ((currentTime: number)=>void)[] = [];
    private _callbacksBeat: ((currentPhrase: number, currentBar: number, currentBeat: number, currentBeatInPhrase: number)=>void)[] = [];
    private _callbacksBar: ((currentPhrase: number, currentBar: number)=>void)[] = [];

    constructor(log: (string) => void, tempoBPM: number, nbBeatsPerBar: number, nbBarPerPhrase: number) {
        this.log = log;
        this.tempoBPM = tempoBPM;
        this.nbBeatsPerBar = nbBeatsPerBar;
        this.nbBarPerPhrase = nbBarPerPhrase;
        this.timerEntity = new Entity();
        engine.addEntity(this.timerEntity);
    }

    public getNominalPeriodMS() {
        return 60*1000/this.tempoBPM;
    }

    reinit() {
        this.shallStopAtEndOfBar = false;
        this.currentTime = 0;
        this.isFrozen = false;
        this.isStarted = false;
    }

    public start() {
        // same as resume with reinit before
        this.reinit();
        this.resume();
    }

    public freeze() {
        // same as stop
        this.stop();
        this.isFrozen = true;
    }

    public resume() {
        this.isFrozen = false;
        // same as start, without reinit
        this.timer = new Interval(this.getNominalPeriodMS()/this.upBeatRatio, () => {
            this.currentTime += 1;
            this.onUpBeat();
        });
        this.onUpBeat();
        this.timerEntity.addComponent(this.timer);
        this.isStarted = true;
    }

    public stop() {
        this.timerEntity.removeComponent(this.timer);
        this.timer = null;
        this.isFrozen = false;
        this.isStarted = false;
    }

    public stopAtEndOfBar() {
        this.shallStopAtEndOfBar = true;
    }

    public getTempoBPM() {
        return this.tempoBPM;
    }

    public getCurrentTime() {
        return this.currentTime;
    }

    public getCurrentUpBeat() {
        return this.currentTime % this.upBeatRatio;
    }

    public getCurrentBeat() {
        return Math.floor(this.currentTime / this.upBeatRatio) % this.nbBeatsPerBar;
    }

    public getCurrentBeatInPhrase() {
        return Math.floor(this.currentTime / this.upBeatRatio) % (this.nbBeatsPerBar * this.nbBarPerPhrase);
    }

    public getCurrentBar() {
        return Math.floor(this.currentTime / (this.upBeatRatio * this.nbBeatsPerBar)) % this.nbBarPerPhrase;
    }

    public getCurrentPhrase() {
        return Math.floor(this.currentTime / (this.upBeatRatio * this.nbBeatsPerBar * this.nbBarPerPhrase));
    }

    ;
    public registerOnUpBeat(callback: (currentTime: number)=>void) {
        this._callbacksUpBeat.push(callback);
    }

    ;
    public registerOnBeat(callback: (currentPhrase: number, currentBar: number, currentBeat: number, currentBeatInPhrase: number)=>void) {
        this._callbacksBeat.push(callback);
    }

    ;
    public registerOnBar(callback: (currentPhrase: number, currentBar: number)=>void) {
        this._callbacksBar.push(callback);
    }

    private onUpBeat() {
        this._callbacksUpBeat.forEach(callback => {
            callback(this.currentTime);
        });
        if (this.getCurrentUpBeat() == 0) {
            this._callbacksBeat.forEach(callback => {
                callback(this.getCurrentPhrase(), this.getCurrentBar(), this.getCurrentBeat(), this.getCurrentBeatInPhrase());
            });
            if (this.getCurrentBeat() == 0) {
                this._callbacksBar.forEach(callback => {
                    callback(this.getCurrentPhrase(), this.getCurrentBar());
                });    
            }
        }
    }
}

export class TempoTest {
    log: (string) => void;
    tempo;
    nbUpBeatinBeat = 0;
    constructor(log: (string) => void) {
        this.log = log;
        this.tempo = new Tempo(log, 90, 4, 4);
        this.tempo.registerOnBar((currentPhrase: number, currentBar: number)=>{
            this.log(`onBar->${currentPhrase},${currentBar}`);
            if (currentPhrase >= 5) this.tempo.freeze();
        });
        this.tempo.registerOnBeat((currentPhrase: number, currentBar: number, currentBeat: number, currentBeatInPhrase: number)=>{
            this.log(`onBeat->${currentPhrase},${currentBar},${currentBeat}, nbUpBeat = ${this.nbUpBeatinBeat}`);
            this.nbUpBeatinBeat = 0;
        });
        this.tempo.registerOnUpBeat((currentTime: number)=>{
            this.nbUpBeatinBeat+=1;
        });
    }
    public start() {
        this.tempo.start();
    }
}