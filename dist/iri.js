'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var IOTA = require('iota.lib.js');
var fs = require('fs');
var path = require('path');
var tmp = require('tmp');

var _require = require('child_process'),
    spawn = _require.spawn;

var DEFAULT_OPTIONS = {
    port: 14265,
    iriPath: '',
    dbPath: '',
    onError: function onError() {},
    onStarted: function onStarted() {},
    onStopped: function onStopped() {}
};

var IRI = function () {
    function IRI(options) {
        _classCallCheck(this, IRI);

        this.opts = Object.assign({}, DEFAULT_OPTIONS, options);
        this.api = new IOTA({ host: 'http://localhost', port: this.opts.port }).api;
        this.process = null;
        this.running = false;
    }

    _createClass(IRI, [{
        key: 'start',
        value: function start() {
            var _this = this;

            var _opts = this.opts,
                onError = _opts.onError,
                onStarted = _opts.onStarted;


            this.process = spawn('java', ['-jar', this.opts.iriPath, '-c', this._getConfig()]);
            this.process.stderr.on('data', function (data) {
                // TODO: pass error message?
            });
            this.process.on('close', function (code) {
                if (_this.process) {
                    _this.running = false;
                    onError && onError(new Error('IRI exited with status ' + code));
                }
            });

            this.running = true;
            onStarted && onStarted();
        }
    }, {
        key: 'stop',
        value: function stop() {
            var signal = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 'SIGTERM';
            var onStopped = this.opts.onStopped;


            if (!this.process) {
                return;
            }
            this.process.kill(signal);
            this.running = false;
            this.process = null;
            onStopped && onStopped();
        }
    }, {
        key: 'isRunning',
        value: function isRunning() {
            return this.running;
        }
    }, {
        key: 'getNodeInfo',
        value: function getNodeInfo() {
            var _this2 = this;

            return new Promise(function (resolve, reject) {
                if (!_this2.isRunning()) {
                    reject(new Error('iri service is not running!'));
                }
                _this2.api.getNodeInfo(function (err, info) {
                    if (err) {
                        reject(err);
                    } else {
                        resolve(info);
                    }
                });
            });
        }
    }, {
        key: '_getConfig',
        value: function _getConfig() {
            var filename = tmp.fileSync().name;
            fs.writeFileSync(filename, '[IRI]\nDB_PATH = ' + this.opts.dbPath + '\nDB_LOG_PATH = ' + this.opts.dbPath + '\nPORT = ' + this.opts.port + '\nIXI_DIR = ' + path.join(this.opts.dbPath, 'ixi') + '\nHEADLESS = true\nDEBUG = false\nTESTNET = false\nRESCAN_DB = false\nREMOTE_LIMIT_API="removeNeighbors, addNeighbors, interruptAttachingToTangle, attachToTangle, getNeighbors"\n        ');
            return filename;
        }
    }]);

    return IRI;
}();

module.exports = {
    IRI: IRI,
    DEFAULT_OPTIONS: DEFAULT_OPTIONS
};