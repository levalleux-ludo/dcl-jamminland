"use strict";
exports.__esModule = true;
var interval_1 = require("../../../node_modules/decentraland-ecs-utils/timer/component/interval");
var Tempo = /** @class */ (function () {
    function Tempo(log, tempoBPM, nbBeatsPerBar, nbBarPerPhrase) {
        this.upBeatRatio = 4; // convenient for ternary and 4-beat rythme (if tempo 180 bpm, timer period is set to 28 msec)
        this.shallStopAtEndOfBar = false;
        this.isStarted = false;
        this.isFrozen = false;
        this._callbacksUpBeat = [];
        this._callbacksBeat = [];
        this._callbacksBar = [];
        this.log = log;
        this.tempoBPM = tempoBPM;
        this.nbBeatsPerBar = nbBeatsPerBar;
        this.nbBarPerPhrase = nbBarPerPhrase;
        this.timerEntity = new Entity();
        engine.addEntity(this.timerEntity);
    }
    Tempo.prototype.getNominalPeriodMS = function () {
        return 60 * 1000 / this.tempoBPM;
    };
    Tempo.prototype.reinit = function () {
        this.shallStopAtEndOfBar = false;
        this.currentTime = 0;
        this.isFrozen = false;
        this.isStarted = false;
    };
    Tempo.prototype.start = function () {
        // same as resume with reinit before
        this.reinit();
        this.resume();
    };
    Tempo.prototype.freeze = function () {
        // same as stop
        this.stop();
        this.isFrozen = true;
    };
    Tempo.prototype.resume = function () {
        var _this = this;
        this.isFrozen = false;
        // same as start, without reinit
        this.timer = new interval_1.Interval(this.getNominalPeriodMS() / this.upBeatRatio, function () {
            _this.currentTime += 1;
            _this.onUpBeat();
        });
        this.onUpBeat();
        this.timerEntity.addComponent(this.timer);
        this.isStarted = true;
    };
    Tempo.prototype.stop = function () {
        this.timerEntity.removeComponent(this.timer);
        this.timer = null;
        this.isFrozen = false;
        this.isStarted = false;
    };
    Tempo.prototype.stopAtEndOfBar = function () {
        this.shallStopAtEndOfBar = true;
    };
    Tempo.prototype.getTempoBPM = function () {
        return this.tempoBPM;
    };
    Tempo.prototype.getCurrentTime = function () {
        return this.currentTime;
    };
    Tempo.prototype.getCurrentUpBeat = function () {
        return this.currentTime % this.upBeatRatio;
    };
    Tempo.prototype.getCurrentBeat = function () {
        return Math.floor(this.currentTime / this.upBeatRatio) % this.nbBeatsPerBar;
    };
    Tempo.prototype.getCurrentBeatInPhrase = function () {
        return Math.floor(this.currentTime / this.upBeatRatio) % (this.nbBeatsPerBar * this.nbBarPerPhrase);
    };
    Tempo.prototype.getCurrentBar = function () {
        return Math.floor(this.currentTime / (this.upBeatRatio * this.nbBeatsPerBar)) % this.nbBarPerPhrase;
    };
    Tempo.prototype.getCurrentPhrase = function () {
        return Math.floor(this.currentTime / (this.upBeatRatio * this.nbBeatsPerBar * this.nbBarPerPhrase));
    };
    ;
    Tempo.prototype.registerOnUpBeat = function (callback) {
        this._callbacksUpBeat.push(callback);
    };
    ;
    Tempo.prototype.registerOnBeat = function (callback) {
        this._callbacksBeat.push(callback);
    };
    ;
    Tempo.prototype.registerOnBar = function (callback) {
        this._callbacksBar.push(callback);
    };
    Tempo.prototype.onUpBeat = function () {
        var _this = this;
        this._callbacksUpBeat.forEach(function (callback) {
            callback(_this.currentTime, _this.currentTime % (_this.upBeatRatio * _this.nbBeatsPerBar * _this.nbBarPerPhrase));
        });
        if (this.getCurrentUpBeat() == 0) {
            this._callbacksBeat.forEach(function (callback) {
                callback(_this.getCurrentPhrase(), _this.getCurrentBar(), _this.getCurrentBeat(), _this.getCurrentBeatInPhrase());
            });
            if (this.getCurrentBeat() == 0) {
                this._callbacksBar.forEach(function (callback) {
                    callback(_this.getCurrentPhrase(), _this.getCurrentBar());
                });
            }
        }
    };
    return Tempo;
}());
exports.Tempo = Tempo;
var TempoTest = /** @class */ (function () {
    function TempoTest(log) {
        var _this = this;
        this.nbUpBeatinBeat = 0;
        this.log = log;
        this.tempo = new Tempo(log, 90, 4, 4);
        this.tempo.registerOnBar(function (currentPhrase, currentBar) {
            _this.log("onBar->" + currentPhrase + "," + currentBar);
            if (currentPhrase >= 5)
                _this.tempo.freeze();
        });
        this.tempo.registerOnBeat(function (currentPhrase, currentBar, currentBeat, currentBeatInPhrase) {
            _this.log("onBeat->" + currentPhrase + "," + currentBar + "," + currentBeat + ", nbUpBeat = " + _this.nbUpBeatinBeat);
            _this.nbUpBeatinBeat = 0;
        });
        this.tempo.registerOnUpBeat(function (currentTime) {
            _this.nbUpBeatinBeat += 1;
        });
    }
    TempoTest.prototype.start = function () {
        this.tempo.start();
    };
    return TempoTest;
}());
exports.TempoTest = TempoTest;
