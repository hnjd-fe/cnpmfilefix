
import fs from "fs-extra";
import path from "path";

import chalk from 'chalk';
import clear from 'clear';

import shell from 'shelljs';

const error = chalk.bold.red;
const warning = chalk.keyword('orange');
const success = chalk.greenBright;
const info = chalk.bold.blue;

import * as CONST from './data/constant.js';
import * as DATA from './data/data.js';

import Project from './Project.js';

export default class App {
    constructor( appRoot, projectRoot, packJSON, config, program, projectInfo ) {

        this.appRoot = appRoot;
        this.projectRoot = projectRoot;
        this.packJSON = packJSON;   
        this.config = config;
        this.program = program;
        this.projectInfo = projectInfo;

        this.projectInfo.config.resolveRegistry = this.projectInfo.config.resolveRegistry.replace( /\/$/, '' );

        this.logDir = path.join( this.projectRoot, this.projectInfo.config.logsPath  );
        this.cmd = `find ${this.logDir} -type f -mtime ${this.projectInfo.config.lastDay} -exec ag "no such file or directory" {} \\;`

        /*
        console.log( info( packJSON.name ) );
        console.log( [ 
            'appRoot: ' + this.appRoot
            , 'projectRoot: ' + this.projectRoot 
            , 'logDir: ' + this.logDir
            , 'cmd: ' + this.cmd
            ].join("\n") );
        */

        this.init();
    }

    init() {
        if( !shell.which( 'wget' ) ){
            console.error( error( 'cnpmfilefix - wget command not found!' ) );
            return;
        }

        if( !shell.which( 'find' ) ){
            console.error( error( 'cnpmfilefix - find command not found!' ) );
            return;
        }

        if( !shell.which( 'ag' ) ){
            console.error( error( 'cnpmfilefix - ag command not found!' ) );
            return;
        }

        if( (!fs.existsSync( this.logDir  ) ) ){
            console.error( error( 'cnpmfilefix - logs dir not exists!' ) );
            return;
        }


        if( (!fs.existsSync( `${this.projectRoot}/package.json` ) ) ){
            console.error( error( 'cnpmfilefix - dir is npm project root!' ) );
            return;
        }

        this.project = new Project( this );
    }

    fileExists( file ) {
        return fs.existsSync( file );
    }

}

export function init( APP_ROOT, PROJECT_ROOT, packJSON, config, program, projectInfo ){
    let AppIns = new App( APP_ROOT, PROJECT_ROOT, packJSON, config, program, projectInfo ); 
}

