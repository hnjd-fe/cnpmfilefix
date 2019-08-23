"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _fs = require("fs");

var _fs2 = _interopRequireDefault(_fs);

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

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var glob = require('glob');

var error = _chalk2.default.bold.red;
var warning = _chalk2.default.keyword('orange');
var success = _chalk2.default.greenBright;
var info = _chalk2.default.bold.blue;

var Project = function () {
    function Project(app) {
        _classCallCheck(this, Project);

        this.app = app;
        this.info = this.app.projectInfo;

        this.init();
    }

    _createClass(Project, [{
        key: "init",
        value: function init() {
            var _this = this;

            console.log(this.app.cmd);

            _shelljs2.default.exec(this.app.cmd, { silent: true }, function (code, stdout, stderr) {
                //console.log( stdout, Date.now() );
                var tmp = stdout.split(/[\r\n]+/g);
                var tmpObj = {};
                _this.items = [];
                tmp.map(function (item) {
                    //console.log( '-------', item, '-----------' );
                    item.replace(/no such file or directory.*?'(.*)?'/g, function ($0, $1) {
                        //console.log( $1, Date.now() );

                        if (!($1 in tmpObj)) {
                            tmpObj[$1] = $1;
                            _this.items.push($1);
                        }
                    });
                });

                //console.log( this.items );
                _this.items.map(function (item) {
                    _this.fixItem(item);
                });
            });
        }
    }, {
        key: "fixItem",
        value: function fixItem(item) {
            if (_fs2.default.existsSync(item)) {
                console.log(warning("file exists " + item + "!"));
                return;
            }

            var dir = item.replace(/\/\-\/.*/, '/-/');
            var filepath = item.replace(/.*?\/nfs\//g, '/').replace(/\/\-\//, '/download/');
            var resolveUrl = "" + this.info.config.resolveRegistry + filepath;

            var dircmd = "sudo mkdir -p " + dir;
            var wgetcmd = "sudo wget --no-check-certificat " + resolveUrl + " -O " + item;

            console.log("\n");
            console.log('item', item);
            console.log('dir', dir);
            console.log('filepath', filepath);
            console.log('resolveUrl', resolveUrl);
            console.log('dircmd', dircmd);
            console.log('wgetcmd', wgetcmd);

            _shelljs2.default.exec(dircmd);
            _shelljs2.default.exec(wgetcmd);
        }
    }, {
        key: "initMethod",
        value: function initMethod() {
            //console.log( 'initMethod', Date.now() );
        }
    }, {
        key: "fileExists",
        value: function fileExists(file) {
            return _fs2.default.existsSync(file);
        }
    }]);

    return Project;
}();

exports.default = Project;