import { global } from '../global/global'
import { DBConnect } from './dbconnect'
import mysql from 'mysql'
import asyncLoop from 'node-async-loop'

export const searchFolder = (folderid, keywords, callback) => {
    var dbconnect = new DBConnect();
    var sqlkeywordline = keywords.join('" or tag.tname="');
    var sqlkeywordline2 = keywords.join('% or indexedfiles.filename like %');
    dbconnect.con.query('select * from indexedfiles where folid=' + folderid, function(err, rows) {
        if (err) {
            throw err;
        }
        var ar = [];
        if (!!rows.length) {
            asyncLoop(rows, function(row, next) {
                var sql = 'select p.fpath, p.filename, p.filid, tag.tid, tag.tname, category.cname, category.color from (select indexedfolders.fpath,' +
                    ' indexedfiles.filename, filetag.filid, filetag.tid, tag.tname, category.cname, category.color from filetag, tag, category, indexedfiles, ' +
                    ' indexedfolders where indexedfolders.folid=indexedfiles.folid and filetag.filid=indexedfiles.filid and filetag.filid=' + row.filid + ' and filetag.tid=tag.tid' +
                    ' and category.cid=tag.cid and (indexedfiles.filename like "%' + sqlkeywordline2 + '%" or tag.tname="' + sqlkeywordline + '") limit 1) as p, filetag, tag, category where filetag.filid=p.filid and tag.tid=filetag.tid and' +
                    ' category.cid=tag.cid';
                // console.log(sql);
                dbconnect.con.query(sql,
                    function(tagerr, tagrows) {
                        // console.log(sqlkeywordline);
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

export const searchAllFolders = (keywords, callback) => {
    var dbconnect = new DBConnect();
    var sqlkeywordline = keywords.join('" or tag.tname="');
    var sqlkeywordline2 = keywords.join('% or indexedfiles.filename like %');
    dbconnect.con.query('select * from indexedfiles', function(err, rows) {
        if (err) {
            throw err;
        }
        var ar = [];
        if (!!rows.length) {
            asyncLoop(rows, function(row, next) {
                var sql = 'select p.fpath, p.filename, p.filid, tag.tid, tag.tname, category.cname, category.color from (select indexedfolders.fpath,' +
                    ' indexedfiles.filename, filetag.filid, filetag.tid, tag.tname, category.cname, category.color from filetag, tag, category, indexedfiles, ' +
                    ' indexedfolders where indexedfolders.folid=indexedfiles.folid and filetag.filid=indexedfiles.filid and filetag.filid=' + row.filid + ' and filetag.tid=tag.tid' +
                    ' and category.cid=tag.cid and (indexedfiles.filename like "%' + sqlkeywordline2 + '%" or tag.tname="' + sqlkeywordline + '") limit 1) as p, filetag, tag, category where filetag.filid=p.filid and tag.tid=filetag.tid and' +
                    ' category.cid=tag.cid';
                // console.log(sql);
                dbconnect.con.query(sql,
                    function(tagerr, tagrows) {
                        // console.log(sqlkeywordline);
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