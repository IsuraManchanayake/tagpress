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
            dbconnect.con.end();
            if (err) {
                throw err;
            }
            callback(rows);
        });
}

export const getEmptyCategories = (callback, db) => {
    var dbconnect = db || new DBConnect();
    dbconnect.con.query('select cname, color from (select count(tid) as cnt, category.cname as cname,' +
        ' category.color as color  from category left outer join tag  on tag.cid=category.cid group by category.cid)' +
        ' as p where cnt=0',
        function(err, rows) {
            dbconnect.con.end();
            if (err) {
                throw err;
            }
            callback(rows);
        });
}

export const insertNewTag = (categoryName, tagName, callback, db) => {
    var dbconnect = db || new DBConnect();
    // console.log('select cid from category where cname="' + categoryName + '"');
    dbconnect.con.query('select cid from category where cname="' + categoryName + '"', function(err, rows) {
        dbconnect.con.end();
        if (err) {
            callback(err);
        }
        var cid = rows[0].cid;
        var idbconnect = db || new DBConnect();
        idbconnect.con.query('insert into tag(cid, tname) values (' + cid + ', "' + tagName + '")', function(ierr) {
            idbconnect.con.end();
            if (ierr) {
                callback(ierr);
            } else {
                callback(null);
            }
        });
    });
}

export const insertCategory = (categoryName, categoryColor, callback, db) => {
    var dbconnect = db || new DBConnect();
    dbconnect.con.query('insert into category(cname, color) values ("' + categoryName + '", "' + categoryColor + '")', function(err) {
        dbconnect.con.end();
        if (err) {
            callback(err);
        } else {
            callback(null);
        }
    });
}

export const removeTag = (categoryName, tagName, callback, db) => {
    var dbconnect = db || new DBConnect();
    dbconnect.con.query('delete from tag where tid in (select * from (select tag.tid from' +
        ' tag left outer join category on tag.cid=category.cid where' +
        ' tag.tname="' + tagName +
        '" and category.cname="' + categoryName + '") as p)',
        function(err) {
            dbconnect.con.end();
            if (err) {
                callback(err);
            } else {
                callback(null);
            }
        });
}

export const checkTagAvailabilityBeforeRemoveTag = (categoryName, tagName, callback, db) => {
    var dbconnect = db || new DBConnect();
    dbconnect.con.query('select filetag.filid from filetag where tid=(select tag.tid from' +
        ' tag left outer join category on tag.cid=category.cid where' +
        ' tag.tname="' + tagName +
        '" and category.cname="' + categoryName + '")',
        function(err, rows) {
            dbconnect.con.end();
            if (err) {
                callback(err);
            } else if (rows.length > 0) {
                callback(null, true);
            } else {
                callback(null, false);
            }
        })
}

export const tagFile = (filid, cname, tname, successCallback, errCallback, db) => {
    var dbconnect = db || new DBConnect();
    dbconnect.con.query('select tid from tag, category where tag.cid=category.cid and tag.tname="' +
        tname + '" and category.cname="' + cname + '"',
        function(err, rows) {
            if (err) {
                errCallback();
            } else {
                var tid = rows[0].tid;
                dbconnect.con.query('insert into filetag(filid, tid) values (' + filid + ', ' + tid + ')', function(err) {
                    dbconnect.con.end();
                    if (err) {
                        errCallback();
                    } else {
                        successCallback(filid);
                    }
                });
            }
        });
}

export const removeTagFromFile = (filid, tname, cname, callback, db) => {
    var dbconnect = db || new DBConnect();
    dbconnect.con.query('delete from filetag where filid=' + filid + ' and tid in (select * from (select tag.tid from' +
        ' tag left outer join category on tag.cid=category.cid where' +
        ' tag.tname="' + tname +
        '" and category.cname="' + cname + '") as p)',
        function(err) {
            dbconnect.con.end();
            if (err) {

            } else {
                callback();
            }
        });
}