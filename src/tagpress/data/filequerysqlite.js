import { global } from '../global/global'
// import { DBConnect } from './dbconnect'
// import mysql from 'mysql'
// import {sqlite} from 
const sqlite3 = require('sqlite3').verbose();
import asyncLoop from 'node-async-loop'

export const listAllIndexedFolders = (callback, db) => {
    // var dbconnect = new sqlite3.Database(global.sqlite3dbpath);
    var dbconnect = new sqlite3.Database(global.sqlite3dbpath);
    dbconnect.serialize(function() {
        dbconnect.all('select * from indexedfolders', function(err, rows) {
            callback(err, rows);
            dbconnect.close();
        });
    });
}

export const getIndexedFilesInsideFolder = (folderid, callback, db) => {
    var dbconnect = new sqlite3.Database(global.sqlite3dbpath);
    dbconnect.serialize(function() {
        dbconnect.all('select * from indexedfiles where folid=' + folderid, function(err, rows) {
            callback(err, rows);
            dbconnect.close()
        });
    });
}

export const getAllTagsInTheFolder = (folderid, callback, db) => {
    var dbconnect = new sqlite3.Database(global.sqlite3dbpath);
    dbconnect.serialize(function() {
        dbconnect.all('select * from indexedfiles where folid=' + folderid, function(err, rows) {
            if (err) {
                throw err;
            }
            var ar = [];
            if (!!rows.length) {
                asyncLoop(rows, function(row, next) {
                    dbconnect.serialize(function() {
                        dbconnect.all('select filetag.filid, filetag.tid, tag.tname, category.cname, category.color ' +
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
                    });
                }, function() {
                    dbconnect.close()
                    callback(ar);
                });
            } else {
                dbconnect.close()
                callback(ar);
            }
        });
    });
}

export const getAllTags = (callback, db) => {
    var dbconnect = new sqlite3.Database(global.sqlite3dbpath);
    dbconnect.serialize(function() {
        dbconnect.all('select tid, tname, cname, color from tag left outer join category on tag.cid=' +
            'category.cid',
            function(err, rows) {
                dbconnect.close()
                if (err) {
                    throw err;
                }
                callback(rows);
            });
    });
}

export const getEmptyCategories = (callback, db) => {
    var dbconnect = new sqlite3.Database(global.sqlite3dbpath);
    dbconnect.serialize(function() {
        dbconnect.all('select cname, color from (select count(tid) as cnt, category.cname as cname,' +
            ' category.color as color  from category left outer join tag  on tag.cid=category.cid group by category.cid)' +
            ' as p where cnt=0',
            function(err, rows) {
                dbconnect.close()
                if (err) {
                    throw err;
                }
                callback(rows);
            });
    });
}

export const insertNewTag = (categoryName, tagName, callback, db) => {
    var dbconnect = new sqlite3.Database(global.sqlite3dbpath);
    // console.log('select cid from category where cname="' + categoryName + '"');
    dbconnect.serialize(function() {
        dbconnect.all('select cid from category where cname="' + categoryName + '"', function(err, rows) {
            dbconnect.close()
            if (err) {
                callback(err);
            }
            var cid = rows[0].cid;
            var idbconnect = new sqlite3.Database(global.sqlite3dbpath);
            // var stmt = idbconnect.prepare('insert into tag(cid, tname) values (?, "' + tagName + '")');
            // idbconnect.con.query('insert into tag(cid, tname) values (' + cid + ', "' + tagName + '")', function(ierr) {
            //     idbconnect.close()
            //     if (ierr) {
            //         callback(ierr);
            //     } else {
            //         callback(null);
            //     }
            // });
            idbconnect.run('insert into tag(cid, tname) values (?, ?)', cid, tagName, function(err) {
                callback(err);
                idbconnect.close();
            });
            // stmt.finalize();
            // callback(err)
        });
    });
}

export const insertCategory = (categoryName, categoryColor, callback, db) => {
    var dbconnect = new sqlite3.Database(global.sqlite3dbpath);
    dbconnect.serialize(function() {
        dbconnect.run('insert into category(cname, color) values ("' + categoryName + '", "' + categoryColor + '")', function(err) {
            dbconnect.close()
            if (err) {
                callback(err);
            } else {
                callback(null);
            }
        });
    });
}

export const removeTag = (categoryName, tagName, callback, db) => {
    var dbconnect = new sqlite3.Database(global.sqlite3dbpath);
    dbconnect.serialize(function() {
        dbconnect.run('delete from tag where tid in (select * from (select tag.tid from' +
            ' tag left outer join category on tag.cid=category.cid where' +
            ' tag.tname="' + tagName +
            '" and category.cname="' + categoryName + '") as p)',
            function(err) {
                dbconnect.close()
                if (err) {
                    callback(err);
                } else {
                    callback(null);
                }
            });
    });
}

export const checkTagAvailabilityBeforeRemoveTag = (categoryName, tagName, callback, db) => {
    var dbconnect = new sqlite3.Database(global.sqlite3dbpath);
    dbconnect.serialize(function() {
        dbconnect.all('select filetag.filid from filetag where tid=(select tag.tid from' +
            ' tag left outer join category on tag.cid=category.cid where' +
            ' tag.tname="' + tagName +
            '" and category.cname="' + categoryName + '")',
            function(err, rows) {
                dbconnect.close()
                if (err) {
                    callback(err);
                } else if (rows.length > 0) {
                    callback(null, true);
                } else {
                    callback(null, false);
                }
            });
    });
}

export const tagFile = (filid, cname, tname, successCallback, errCallback, db) => {
    var dbconnect = new sqlite3.Database(global.sqlite3dbpath);
    // dbconnect.serialize(function() {
    dbconnect.all('select tid from tag, category where tag.cid=category.cid and tag.tname="' +
        tname + '" and category.cname="' + cname + '"',
        function(err, rows) {
            if (err) {
                errCallback();
            } else {
                var tid = rows[0].tid;
                dbconnect.run('insert into filetag(filid, tid) values (' + filid + ', ' + tid + ')', function(err) {
                    dbconnect.close();
                    if (err) {
                        console.log(err);
                        console.log(filid + "err");
                        errCallback();
                    } else {
                        console.log(filid + "success");
                        successCallback(filid);
                    }
                });
            }
        });
    // });
}

export const removeTagFromFile = (filid, tname, cname, callback, db) => {
    var dbconnect = new sqlite3.Database(global.sqlite3dbpath);
    dbconnect.serialize(function() {
        dbconnect.run('delete from filetag where filid=' + filid + ' and tid in (select * from (select tag.tid from' +
            ' tag left outer join category on tag.cid=category.cid where' +
            ' tag.tname="' + tname +
            '" and category.cname="' + cname + '") as p)',
            function(err) {
                dbconnect.close()
                if (err) {} else {
                    callback();
                }
            });
    });
}

export const importFolder = (fpath, callback) => {
    var dbconnect = new DBConnect();
    dbconnect.serialize(function() {
        dbconnect.run('insert into indexedfolders(fpath) values ("' + fpath + '/")', function(err) {
            dbconnect.all('select max(folid) as folid from indexedfolders', function(err, rows) {
                if (err) {} {
                    dbconnect.close()
                        // console.log(rows[0]);
                        // console.log(rows[0].folid);
                    callback(rows[0].folid);
                }
            });
        });
    });
}

export const importFile = (folid, filename, callback) => {
    var dbconnect = new DBConnect();
    // console.log(folid + ' ' + filename);
    // console.log('insert into indexedfiles(folid, filename) values (' + folid + ', "' + filename + '")');
    dbconnect.con.query('insert into indexedfiles(folid, filename) values (' + folid + ', "' + filename + '")', function(err) {
        dbconnect.close()
        if (err) {} else {
            callback();
        }
    })
}