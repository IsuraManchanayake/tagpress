import { global } from '../global/global'
import { DBConnect } from './dbconnect'
import mysql from 'mysql'
import asyncLoop from 'node-async-loop'

export const listAllIndexedFolders = (callback, db) => {
    var dbconnect = db || new DBConnect();
    dbconnect.con.query('select * from indexedfolders', function(err, rows) {
        callback(err, rows);
        dbconnect.con.end();
    });
}

export const getIndexedFilesInsideFolder = (folderid, callback, db) => {
    var dbconnect = db || new DBConnect();
    dbconnect.con.query('select * from indexedfiles where folid=' + folderid, function(err, rows) {
        callback(err, rows);
        dbconnect.con.end();
    });
}

// export const getAllTags = (fileid, callback, db) => {
//     var dbconnect = db || new DBConnect();
//     dbconnect.con.query('select filetag.tid, tag.tname, category.cname, category.color ' +
//         'from filetag, tag, category where filetag.filid=' + fileid + ' and filetag.tid=tag.tid' +
//         ' and category.cid=tag.cid',
//         function(err, rows) {
//             callback(err, rows);
//             dbconnect.con.end();
//         }
//     );
// }

export const getAllTagsInTheFolder = (folderid, callback, db) => {
    var dbconnect = db || new DBConnect();
    dbconnect.con.query('select * from indexedfiles where folid=' + folderid, function(err, rows) {
        if (err) {
            throw err;
        }
        var ar = [];
        if (!!rows.length) {
            asyncLoop(rows, function(row, next) {
                dbconnect.con.query('select filetag.filid, filetag.tid, tag.tname, category.cname, category.color ' +
                    'from filetag, tag, category where filetag.filid=' + row.filid + ' and filetag.tid=tag.tid' +
                    ' and category.cid=tag.cid',
                    function(tagerr, tagrows) {
                        if (!!tagrows) {
                            tagrows.forEach(function(tagrow) {
                                ar.push(tagrow);
                            });
                        }
                        next();
                    });
            }, function() {
                dbconnect.con.end();
                callback(ar);
            });
        } else {
            dbconnect.con.end();
            callback(ar);
        }
    });
}

export const getAllTags = (callback, db) => {
    var dbconnect = db || new DBConnect();
    dbconnect.con.query('select tid, tname, cname, color from tag left outer join category on tag.cid=' +
        'category.cid',
        function(err, rows) {
            if (err) {
                throw err;
            }
            callback(rows);
        });
}