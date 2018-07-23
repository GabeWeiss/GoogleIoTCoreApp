"use strict";
exports.__esModule = true;
//fake data streaming...
var path = require("path");
var rxjs_1 = require("rxjs");
var operators_1 = require("rxjs/operators");
var firebase = require("firebase");
var firebase_admin_1 = require("firebase-admin");
var cert = firebase_admin_1.credential.cert(path.resolve(process.cwd(), './_keys/admin.json'));
firebase_admin_1.initializeApp({ credential: cert, databaseURL: 'https://iot-dry-run-2.firebaseio.com' });
var simDevices = ['nerve_3'];
var devices = rxjs_1.defer(function () { return firebase_admin_1.firestore()
    .collection('devices')
    .limit(10).get(); })
    .pipe(operators_1.mergeMap(function (deviceSnapshot) { return deviceSnapshot.docs; }), 
//filter(device => simDevices.some(d => device.id === d)),
operators_1.delay(250), operators_1.mergeMap(function (device) { return mockHeartbeat(device.id, true).pipe(operators_1.mergeMap(function (beat) { return firebase_admin_1.firestore()
    .collection("devices/" + device.id + "/measurements").add(beat); })); }, 3)).subscribe(function (beat) {
    console.log('saved', beat.id);
});
function getRandomInt(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min)) + min;
}
var mockHeartbeat = function (deviceId, applyFilter) {
    if (applyFilter === void 0) { applyFilter = false; }
    return new rxjs_1.Observable(function (sink) {
        var genBpm = function (prev) { return getRandomInt(65, 200); };
        var bpm = genBpm(65);
        var f = new KalmanFilter(bpm);
        var filteredBpm = f.update(bpm);
        var id;
        function updateValue() {
            bpm = genBpm(bpm);
            filteredBpm = f.update(bpm);
            var _a = firebase.firestore.Timestamp.now(), nanoseconds = _a.nanoseconds, seconds = _a.seconds;
            sink.next({ deviceId: deviceId, bpm: applyFilter ? filteredBpm : bpm, timestamp: { seconds: seconds, nanoseconds: nanoseconds }, temperature: 98.1 });
            id = setTimeout(function () { return updateValue(); }, 1000);
        }
        updateValue();
        return function () { return clearTimeout(id); };
    });
};
var KalmanFilter = /** @class */ (function () {
    function KalmanFilter(x, q, r, p) {
        if (q === void 0) { q = 0.2; }
        if (r === void 0) { r = 1; }
        if (p === void 0) { p = 1; }
        this.x = x;
        this.q = q;
        this.r = r;
        this.p = p;
    }
    KalmanFilter.prototype.update = function (value) {
        this.p = this.p + this.q;
        this.k = this.p / (this.p + this.r);
        this.x = this.x + this.k * (value - this.x);
        this.p = (1 - this.k) * this.p;
        return this.x;
    };
    return KalmanFilter;
}());
exports.KalmanFilter = KalmanFilter;
