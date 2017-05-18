import { global } from '../../global/global'
import fs from 'fs'
import mkdirp from 'mkdirp'
import exec from 'exec'

/**
 * @class
 */
export class FileGrouper {

    /**
     * @constructor
     * @param {File[]} files
     * @param {Tag[]} tags 
     * @param {string} target
     *  
     */
    constructor(files, tags, target) {
        this.files = files;
        this.tags = tags;
        this.target = target;
    }

    copyFiles(callback) {
        var pathMap = [];
        this.files.forEach(function(file) {
            pathMap[file.path] = [];
        });
        var self = this;
        var count = 0;
        this.tags.forEach(function(tag) {
            mkdirp.sync(self.target + '[' + tag.category.name + '][' + tag.name + ']');
            self.files.forEach(function(file) {
                file.tags.forEach(function(filetag) {
                    // if (filetag.tid == tag.tid) {
                    if (filetag.name == tag.name && filetag.category.name == tag.category.name) {
                        if (pathMap[file.path].indexOf(self.target + '[' + tag.category.name + '][' + tag.name + ']/' + file.name) == -1) {
                            pathMap[file.path].push(self.target + '[' + tag.category.name + '][' + tag.name + ']/' + file.name);
                            count++;
                        }
                    }
                })
            });
        });
        // console.log("pathMap " + pathMap);
        var i = 0;
        for (var source in pathMap) {
            if (pathMap.hasOwnProperty(source)) {
                pathMap[source].forEach(function(target) {
                    // console.log(source + '**[TO]**' + target + '**[STARTED]');
                    self.copyFile(source, target, function(err) {
                        if (err) {
                            console.log(err);
                        }
                        // console.log(source + '**[TO]**' + target + '**[DONE]');
                        i++;
                        if (i == count) {
                            alert('File grouping done');
                            exec('nautilus ' + self.target, function(err, out, code) {

                            });
                            callback();
                        }
                    });
                });
            }
        }
    }

    /**
     * @deprecated [DO NOT USE THIS. USE copyfiles() instead]
     */
    moveFiles() {
        this.copyFiles();
    }

    /**
     * @private
     * @param {String} source 
     * @param {String} target 
     * @param {Function} callback 
     */
    copyFile(source, target, callback) {
        var cbCalled = false;
        var rd = fs.createReadStream(source);
        rd.on("error", function(err) {
            done(err);
        });
        var wr = fs.createWriteStream(target);
        wr.on("error", function(err) {
            done(err);
        });
        wr.on("close", function(ex) {
            done();
        });
        rd.pipe(wr);

        function done(err) {
            if (!cbCalled) {
                callback(err);
                cbCalled = true;
            }
        }
    }

    /**
     * @deprecated
     * @param {String} source 
     * @param {String} target 
     * @param {Function} callback
     */
    moveFile(source, target, callback) {
        fs.rename(source, target, function(err) {
            if (err) throw err;
            fs.stat(target, function(err, stats) {
                if (err) throw err;
                callback(err);
                console.log('stats: ' + JSON.stringify(stats));
            });
        });
    }

}