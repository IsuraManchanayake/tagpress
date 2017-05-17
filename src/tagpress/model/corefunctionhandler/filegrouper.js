import { global } from '../../global/global'
import fs from 'fs'
import mkdirp from 'mkdirp'

export class FileGrouper {

    /**
     * 
     * @param {File[]} files
     * @param {Tag[]} tags 
     * @param {string} target
     *  
     */
    constructor(files, tags, target) {
        this.files = files;
        this.tags = tags;
        this.target = target;
        // var pathMap = [];
        // files.forEach(function(file) {
        //     pathMap[file.path] = [];
        // });
        // tags.forEach(function(tag) {
        //     files.forEach(function(file) {
        //         file.tags.forEach(function(filetag) {
        //             if (filetag.tid == tag.tid) {
        //                 if (pathMap[file.path].indexOf(target + '[' + tag.category.name + '].[' + tag.name + ']' + file.name) == -1) {
        //                     pathMap[file.path].push(target + '[' + tag.category.name + '].[' + tag.name + ']' + file.name);
        //                 }
        //             }
        //         })
        //     });
        // });
        // console.log(pathMap);
    }

    copyFiles() {
        var pathMap = [];
        this.files.forEach(function(file) {
            pathMap[file.path] = [];
        });
        var self = this;
        this.tags.forEach(function(tag) {
            mkdirp(self.target + '[' + tag.category.name + '].[' + tag.name + ']');
            self.files.forEach(function(file) {
                file.tags.forEach(function(filetag) {
                    if (filetag.tid == tag.tid) {
                        if (pathMap[file.path].indexOf(self.target + '[' + tag.category.name + '].[' + tag.name + ']/' + file.name) == -1) {
                            pathMap[file.path].push(self.target + '[' + tag.category.name + '].[' + tag.name + ']/' + file.name);
                        }
                    }
                })
            });
        });
        for (var source in pathMap) {
            if (pathMap.hasOwnProperty(source)) {
                pathMap[source].forEach(function(target) {
                    console.log(source + '**[TO]**' + target + '**[STARTED]');
                    self.copyFile(source, target, function(err) {
                        if (err) {
                            console.log(err);
                        }
                        console.log(source + '**[TO]**' + target + '**[DONE]');
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