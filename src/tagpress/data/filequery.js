import { global } from '../global/global'
import { DBConnect } from './dbconnect'
import mysql from 'mysql'

export const listAllIndexedFolders = (callback, db) => {
    var dbconnect = db || new DBConnect();
    dbconnect.con.query('select * from indexedfolders', function(err, rows) {
        callback(err, rows);
    });
    dbconnect.con.end();
}

export const getIndexedFilesInsideFolder = (folderid, callback, db) => {
    var dbconnect = db || new DBConnect();
    dbconnect.con.query('select * from indexedfiles where folid=' + folderid, function(err, rows) {
        callback(err, rows);
    });
    dbconnect.con.end();
}

export const getAllTags = (fileid, callback, db) => {
    var dbconnect = db || new DBConnect();
    dbconnect.con.query('select filetag.tid, tag.tname, category.cname, category.color ' +
        'from filetag, tag, category where filetag.filid=' + fileid + ' and filetag.tid=tag.tid' +
        ' and category.cid=tag.cid',
        function(err, rows) {
            callback(err, rows);
        }
    );
    dbconnect.con.end();
}