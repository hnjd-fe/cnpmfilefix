

import fs from "fs";
import path from "path";

import chalk from 'chalk';
import clear from 'clear';

import shell from 'shelljs';

const glob = require( 'glob' );

const error = chalk.bold.red;
const warning = chalk.keyword('orange');
const success = chalk.greenBright;
const info = chalk.bold.blue;

import * as CONST from './data/constant.js';
import * as DATA from './data/data.js';

export default class Project {
    constructor( app ){
        this.app = app;
        this.info = this.app.projectInfo;

        this.init();
    }

    init() {
        console.log( this.app.cmd );

        if( this.app.program.target ){
			this.fixItem( this.resolveTarget( this.app.program.target ) );
            return;
        }

        if( this.app.program.check ){
            this.resolveAll( true );
            return;
        }

        this.resolveAll();
    }

    resolveAll( isCheck ){
        shell.exec( this.app.cmd, { silent: true }, ( code, stdout, stderr ) => {
            //console.log( stdout, Date.now() );
            let tmp = stdout.split( /[\r\n]+/g );
            let tmpObj = {};
            this.items = [];
            tmp.map( ( item ) => {
                //console.log( '-------', item, '-----------' );
                item.replace( /no such file or directory.*?'(.*)?'/g, ( $0, $1 )=>{
                    //console.log( $1, Date.now() );

                    if( !( $1 in tmpObj ) ){
                        tmpObj[$1] = $1;
                        this.items.push( $1 );
                    }
                });
            });

            //console.log( this.items );
            this.items.map( ( item )=>{
                if( isCheck ){
                    this.checkItem( item );
                } else {
                    this.fixItem( item );
                }
            });
        });

    }

    checkItem( item ){
        if( fs.existsSync( item  ) ){
            console.log( success( `file found ${item}!` ) );
        }else{
            console.log( error( `file not find ${item}!` ) );
        }
    }

	resolveTarget( target ){
		let r = target;
		r = r.replace( /\/download\//gi, '/-/' );
        r = path.join( this.app.projectRoot, this.app.projectInfo.config.dataDir || './dataDir/nfs/', r );
		return r;
	}

    fixItem( item ) {
		//console.log( 'item', info( item ) );
        if( fs.existsSync( item  ) ){
            console.log( warning( `file exists ${item}!` ) );
            return;
        }

        let sudo = '';

        if( shell.which( 'sudo' ) ){
            sudo = 'sudo'
        }

        let dir = item.replace( /\/\-\/.*/, '/-/' );
        let filepath = item.replace( /.*?\/nfs\//g, '/' ).replace( /\/\-\//, '/download/');
        let resolveUrl = `${this.info.config.resolveRegistry}${filepath}`;

        let dircmd = `${sudo} mkdir -p ${dir}`;
        let wgetcmd = `${sudo} wget --no-check-certificat ${resolveUrl} -O ${item}`;
        let delcmd = `${sudo} rm -rf ${item}`;

        /*
        console.info( "\n" );
        console.info( 'item', item);
        console.info( 'dir', dir );
        console.info( 'filepath', filepath );
        console.info( 'resolveUrl',  resolveUrl );
        console.info( 'dircmd', dircmd );
        */
        console.info( 'wgetcmd', wgetcmd);

        shell.exec( dircmd  );
        shell.exec( 
            wgetcmd
            , ( code, stdout, stderr )=>{ 
                if( /404 Not Found/i.test( stderr ) ){
                    if( /\/nfs\/[^\/]+\/\-\/[^\/]+\.tgz$/.test( item ) ){
                        console.log( info( 'not found: ' + item ) )
                        shell.exec( delcmd );
                    }
                }
            }
        );
    }

    initMethod() {
        //console.log( 'initMethod', Date.now() );
    }

    fileExists( file ) {
        return fs.existsSync( file );
    }

}
