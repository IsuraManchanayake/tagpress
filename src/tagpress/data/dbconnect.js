import { global } from '../global/global'
import mysql from 'mysql'

export class DBConnect {

    constructor() {
        this.con = mysql.createConnection({
            host: global.dbhost,
            user: global.dbuser,
            passord: global.dbpassword,
            database: global.dbname
        });

        this.con.connect(function(err) {
            if (err) {
                console.log('Error connecting to DB');
                return;
            }
            console.log('Connection Established');
        });
    }

}