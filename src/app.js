import './helpers/context_menu.js';
import './helpers/external_links.js';

import { remote } from 'electron';
import path from 'path'
import jetpack from 'fs-jetpack';
import env from './env';
import { listAllFiles } from './tagpress/model/tagpressfilehandler/validator'
import { Folder } from './tagpress/model/fileinformation/folder'
import { File } from './tagpress/model/fileinformation/file'
import { Tag } from './tagpress/model/fileinformation/tag'
import { Category } from './tagpress/model/fileinformation/category'
import { DBConnect } from './tagpress/data/dbconnect'
import { global } from './tagpress/global/global'
import * as filequery from './tagpress/data/filequery'
import * as hf from './tagpress/view/js/htmlfactory'

var lista = listAllFiles(new Folder('src/tagpress/test/example/'))

const app = remote.app;
const appDir = jetpack.cwd(app.getAppPath());

const manifest = appDir.read('package.json', 'json');

const osMap = {
    win32: 'Windows',
    darwin: 'macOS',
    linux: 'Linux',
};

filequery.listAllIndexedFolders(function(err, rows) {
    if (err) {
        console.error(err);
    } else {
        rows.forEach(function(row) {
            var folder = new Folder(row.fpath);
            folder.fid = row.fid;
            var div = document.createElement('div');
            div.innerHTML = hf.getFileNavigationFolderHTML(folder);
            div.addEventListener('click', function() {
                showFiles(folder);
            });
            document.querySelector("#file-nav").appendChild(div);
        });
    }
});


var showFiles = function(folder) {
    var ul = document.createElement('ul');
    filequery.getAllTagsInTheFolder(folder.fid, function(tagMap) {
        filequery.getIndexedFilesInsideFolder(folder.fid, function(err, rows) {
            if (err) {
                console.error(err);
            } else {
                document.querySelector("#file-preview").innerHTML = '';
                var dbconnect = new DBConnect();
                rows.forEach(function(row) {
                    var file = new File(folder.path + row.filename);
                    file.fid = row.filid;
                    var div = document.createElement('div');
                    if (file.isFont) {
                        var fontFace = document.createElement('style');
                        fontFace.appendChild(document.createTextNode(hf.getNewFontFaceHTML(file)));
                        document.head.appendChild(fontFace);
                        div.innerHTML = hf.getFontThumbnailPreview(file);
                    } else {
                        div.innerHTML = hf.getImageThumbnailPreview(file);
                    }
                    document.querySelector("#file-preview").appendChild(div);
                    // document.querySelector("#file-id-" + file.fid).innerHTML = "dsf";
                });
                var files = [];
                // console.log(tagMap);
                tagMap.forEach(function(tag) {
                    if (tag.filid in files) {} else {
                        files[tag.filid] = {};
                        files[tag.filid].tags = [];
                    }
                    files[tag.filid].tags.push(new Tag(tag.tname, new Category(tag.cname, tag.color)));
                });
                hf.showTags(files);
            }
        });
    });
}

filequery.getAllTags(function(tagrows) {
    var tags = [];
    tagrows.forEach(function(tagrow) {
        if (tagrow.cname in tags) {} else {
            tags[tagrow.cname] = {};
            tags[tagrow.cname].tags = [];
        }
        var tag = new Tag(tagrow.tname, new Category(tagrow.cname, tagrow.color));
        tag.tid = tagrow.tid;
        tags[tagrow.cname].tags.push(tag);
    });
    hf.showTagInventory(tags);
});