import { global } from '../global/global'
import mysql from 'mysql'

// let _instance = null;

export class DBConnect {

    constructor() {
        // if (!_instance) {
        this.con = mysql.createConnection({
            host: global.dbhost,
            user: global.dbuser,
            passord: global.dbpassword,
            database: global.dbname
        });

        this.con.connect(function(err) {
            if (err) {
                // console.log('Error connecting to DB');
                return;
            }
            // console.log('Connection Established');
        });

        this.pool = mysql.createPool({
            host: global.dbhost,
            user: global.dbuser,
            passord: global.dbpassword,
            database: global.dbname
        });
        // _instance = this;
        // }
        // return _instance;
    }

}