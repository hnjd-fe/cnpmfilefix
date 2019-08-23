"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

exports.init = init;

var _fsExtra = require("fs-extra");

var _fsExtra2 = _interopRequireDefault(_fsExtra);

var _path = require("path");

var _path2 = _interopRequireDefault(_path);

var _chalk = require("chalk");

var _chalk2 = _interopRequireDefault(_chalk);

var _clear = require("clear");

var _clear2 = _interopRequireDefault(_clear);

var _shelljs = require("shelljs");

var _shelljs2 = _interopRequireDefault(_shelljs);

var _constant = require("./data/constant.js");

var CONST = _interopRequireWildcard(_constant);

var _data = require("./data/data.js");

var DATA = _interopRequireWildcard(_data);

var _Project = require("./Project.js");

var _Project2 = _interopRequireDefault(_Project);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var error = _chalk2.default.bold.red;
var warning = _chalk2.default.keyword('orange');
var success = _chalk2.default.greenBright;
var info = _chalk2.default.bold.blue;

var App = function () {
    function App(appRoot, projectRoot, packJSON, config, program, projectInfo) {
        _classCallCheck(this, App);

        this.appRoot = appRoot;
        this.projectRoot = projectRoot;
        this.packJSON = packJSON;
        this.config = config;
        this.program = program;
        this.projectInfo = projectInfo;

        this.projectInfo.config.resolveRegistry = this.projectInfo.config.resolveRegistry.replace(/\/$/, '');

        this.logDir = _path2.default.join(this.projectRoot, this.projectInfo.config.logsPath);
        this.cmd = "find " + this.logDir + " -type f -mtime " + this.projectInfo.config.lastDay + " -exec ag \"no such file or directory\" {} \\;";

        console.log(info(packJSON.name));
        console.log(['appRoot: ' + this.appRoot, 'projectRoot: ' + this.projectRoot, 'logDir: ' + this.logDir, 'cmd: ' + this.cmd].join("\n"));

        this.init();
    }

    _createClass(App, [{
        key: "init",
        value: function init() {
            if (!_shelljs2.default.which('find')) {
                console.error(error('cnpmfilefix - find command not found!'));
                return;
            }

            if (!_shelljs2.default.which('ag')) {
                console.error(error('cnpmfilefix - ag command not found!'));
                return;
            }

            if (!_fsExtra2.default.existsSync(this.logDir)) {
                console.error(error('cnpmfilefix - logs dir not exists!'));
                return;
            }

            if (!_fsExtra2.default.existsSync(this.projectRoot + "/package.json")) {
                console.error(error('cnpmfilefix - dir is npm project root!'));
                return;
            }

            this.project = new _Project2.default(this);
        }
    }, {
        key: "fileExists",
        value: function fileExists(file) {
            return _fsExtra2.default.existsSync(file);
        }
    }]);

    return App;
}();

exports.default = App;
function init(APP_ROOT, PROJECT_ROOT, packJSON, config, program, projectInfo) {
    var AppIns = new App(APP_ROOT, PROJECT_ROOT, packJSON, config, program, projectInfo);
}