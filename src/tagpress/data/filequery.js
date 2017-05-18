import { global } from '../global/global'
import { DBConnect } from './dbconnect'
import mysql from 'mysql'
import asyncLoop from 'node-async-loop'

/**
 * list all indexed folders from the database
 * @param {Function} callback(err, rows)
 *      err: {Error}
 *      rows: {RawDataPacket[]}
 */
export const listAllIndexedFolders = (callback) => {
    var dbconnect = new DBConnect();
    dbconnect.con.query('select * from indexedfolders', function(err, rows) {
        dbconnect.con.end();
        callback(err, rows);
    });
}

/**
 * list all file names and ids inside a given folder from the database
 * @param {Number} folderid 
 * @param {Function} callback(err, rows)
 *      err: {Error}
 *      rows: {RawDataPacket[]}
 */
export const getIndexedFilesInsideFolder = (folderid, callback) => {
    var dbconnect = new DBConnect();
    dbconnect.con.query('select * from indexedfiles where folid=' + folderid, function(err, rows) {
        dbconnect.con.end();
        callback(err, rows);
    });
}

/**
 * list file information with tags in a folder
 * @param {Number} folderid 
 * @param {Function} callback(ar): 
 *      ar {RawDataPacket[]}
 */
export const getAllTagsInTheFolder = (folderid, callback) => {
    var dbconnect = new DBConnect();
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

/**
 * list all current tags from the database 
 * @param {Function} callback(rows)
 *      rows {RawDataPacket[]}
 */
export const getAllTags = (callback) => {
    var dbconnect = new DBConnect();
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

/**
 * return empty categories(without tags) from the database 
 * @param {Function} callback(rows) 
 *      rows {RawDataPacket[]}
 */
export const getEmptyCategories = (callback) => {
    var dbconnect = new DBConnect();
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

/**
 * insert new tag to a category
 * @param {String} categoryName 
 * @param {String} tagName 
 * @param {Function} callback(err) 
 *      err {Error}: possible errors for duplicates
 */
export const insertNewTag = (categoryName, tagName, callback) => {
    var dbconnect = new DBConnect();
    // console.log('select cid from category where cname="' + categoryName + '"');
    dbconnect.con.query('select cid from category where cname="' + categoryName + '"', function(err, rows) {
        dbconnect.con.end();
        if (err) {
            callback(err);
        }
        var cid = rows[0].cid;
        var idbconnect = new DBConnect();
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

/**
 * insert new category with name and color
 * @param {String} categoryName 
 * @param {String} categoryColor 
 * @param {Function} callback(err)
 *      err {Error}: error for possible duplicates
 */
export const insertCategory = (categoryName, categoryColor, callback) => {
    var dbconnect = new DBConnect();
    dbconnect.con.query('insert into category(cname, color) values ("' + categoryName + '", "' + categoryColor + '")', function(err) {
        dbconnect.con.end();
        if (err) {
            callback(err);
        } else {
            callback(null);
        }
    });
}

/**
 * remove a tag from the database
 * @param {String} categoryName 
 * @param {String} tagName 
 * @param {Function} callback:
 *      err {Error}: possible errors if not available
 */
export const removeTag = (categoryName, tagName, callback) => {
    var dbconnect = new DBConnect();
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

/**
 * check tag availability in files globally before removing tag
 * @param {String} categoryName 
 * @param {String} tagName 
 * @param {Function} callback(err, avail)
 *      err: {Error} possible errors
 *      avail: {Boolean} availability 
 */
export const checkTagAvailabilityBeforeRemoveTag = (categoryName, tagName, callback) => {
    var dbconnect = new DBConnect();
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

/**
 * tag a file
 * @param {Number} filid : file id
 * @param {String} cname : category name
 * @param {String} tname : tag name
 * @param {Function} successCallback(filid)
 *      filid {Number}: file id
 * @param {Function} errCallback() : possible errors
 */
export const tagFile = (filid, cname, tname, successCallback, errCallback) => {
    var dbconnect = new DBConnect();
    dbconnect.con.query('select tid from tag, category where tag.cid=category.cid and tag.tname="' +
        tname + '" and category.cname="' + cname + '"',
        function(err, rows) {
            if (err) {
                dbconnect.con.end();
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

/**
 * remove a tag from a file
 * @param {Number} filid : file id
 * @param {String} tname : tag name
 * @param {String} cname : category name
 * @param {Function} callback() 
 */
export const removeTagFromFile = (filid, tname, cname, callback) => {
    var dbconnect = new DBConnect();
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

/**
 * import a folder path to database
 * @param {String} fpath : folder path
 * @param {Function} callback(folid) : folid {Number} : the assigned folder id
 */
export const importFolder = (fpath, callback) => {
    var dbconnect = new DBConnect();
    dbconnect.con.query('insert into indexedfolders(fpath) values ("' + fpath + '/")', function(err) {
        var e = err;
        dbconnect.con.query('select max(folid) as folid from indexedfolders', function(_err, rows) {
            if (_err) {} {
                dbconnect.con.end();
                // console.log(rows[0]);
                // console.log(rows[0].folid);
                callback(e || _err, rows[0].folid);
            }
        });
    });
}

/**
 * import file to the database
 * @param {Number} folid : folder id
 * @param {String} filename : file name
 * @param {Function} callback() 
 */
export const importFile = (folid, filename, callback) => {
    var dbconnect = new DBConnect();
    // console.log(folid + ' ' + filename);
    // console.log('insert into indexedfiles(folid, filename) values (' + folid + ', "' + filename + '")');
    dbconnect.con.query('insert into indexedfiles(folid, filename) values (' + folid + ', "' + filename + '")', function(err) {
        dbconnect.con.end();
        if (err) {} else {
            callback();
        }
    })
}