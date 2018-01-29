'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _get = function get(object, property, receiver) { if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { return get(parent, property, receiver); } } else if ("value" in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } };

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var fs = require('fs-extra');
var path = require('path');

var _require = require('../system'),
    System = _require.System;

var _require2 = require('./base-package-installer'),
    BasePackageInstaller = _require2.BasePackageInstaller;

var DEFAULT_OPTIONS = {
    name: 'iri',
    latestVersion: '1.4.2.1',
    emulateWindows: false,
    repo: {
        owner: 'iotaledger',
        repo: 'iri'
    }
};

var IRIInstaller = function (_BasePackageInstaller) {
    _inherits(IRIInstaller, _BasePackageInstaller);

    function IRIInstaller(options) {
        _classCallCheck(this, IRIInstaller);

        var _this = _possibleConstructorReturn(this, (IRIInstaller.__proto__ || Object.getPrototypeOf(IRIInstaller)).call(this, Object.assign({}, DEFAULT_OPTIONS, options)));

        _this.system = new System();
        return _this;
    }

    _createClass(IRIInstaller, [{
        key: 'isWindows',
        value: function isWindows() {
            return this.system.isWindows() || this.opts.emulateWindows;
        }
    }, {
        key: 'getName',
        value: function getName() {
            // TODO: replace when IRI bug #350 is fixed and published: https://github.com/iotaledger/iri/issues/350
            return this.isWindows() ? 'iri-' + this.opts.latestVersion + '-bolero.jar' : 'iri-' + this.opts.latestVersion + '.jar';
        }

        // TODO: remove when IRI bug #350 is fixed and published: https://github.com/iotaledger/iri/issues/350

    }, {
        key: 'install',
        value: function install(onProgress, onEnd, onError) {
            if (!this.isWindows()) {
                return _get(IRIInstaller.prototype.__proto__ || Object.getPrototypeOf(IRIInstaller.prototype), 'install', this).call(this, onProgress, onEnd, onError);
            }
            if (this.isInstalled()) {
                onEnd && onEnd();
                return;
            }
            fs.copySync(path.join(__dirname, '..', '..', this.getName()), this.getTargetFileName());
            onEnd && onEnd();
            return Promise.resolve();
        }
    }]);

    return IRIInstaller;
}(BasePackageInstaller);

module.exports = {
    IRIInstaller: IRIInstaller,
    DEFAULT_OPTIONS: DEFAULT_OPTIONS
};