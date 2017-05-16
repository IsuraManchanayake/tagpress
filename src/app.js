import './helpers/context_menu.js';
import './helpers/external_links.js';

import { remote } from 'electron';
import path from 'path'
import jetpack from 'fs-jetpack';
import env from './env';
import interact from 'interact.js'
import $ from 'jquery';
import 'jquery-ui';

import { listAllFiles } from './tagpress/model/tagpressfilehandler/validator'
import { Folder } from './tagpress/model/fileinformation/folder'
import { File } from './tagpress/model/fileinformation/file'
import { Tag } from './tagpress/model/fileinformation/tag'
import { Category } from './tagpress/model/fileinformation/category'
import { DBConnect } from './tagpress/data/dbconnect'
import { global } from './tagpress/global/global'
import * as filequery from './tagpress/data/filequery'
import * as hf from './tagpress/view/js/htmlfactory'

// var lista = listAllFiles(new Folder('src/tagpress/test/example/'))

const app = remote.app;
const appDir = jetpack.cwd(app.getAppPath());

const manifest = appDir.read('package.json', 'json');

const osMap = {
    win32: 'Windows',
    darwin: 'macOS',
    linux: 'Linux',
};

var currentFolder;

filequery.listAllIndexedFolders(function(err, rows) {
    if (err) {
        console.error(err);
    } else {
        rows.forEach(function(row) {
            var folder = new Folder(row.fpath);
            folder.fid = row.folid;
            var div = document.createElement('div');
            div.innerHTML = hf.getFileNavigationFolderHTML(folder);
            div.addEventListener('click', function() {
                currentFolder = folder;
                showFiles(folder);
            });
            document.querySelector("#file-nav").appendChild(div);
        });
    }
});

var onRemoveTagFromAFile = function(filid, tname, cname, callback) {
    // alert(filid + ' ' + tname);
    filequery.removeTagFromFile(filid, tname, cname, callback);
}

var showFiles = function(folder) {
    // console.log(folder);
    var ul = document.createElement('ul');
    filequery.getAllTagsInTheFolder(folder.fid, function(tagMap) {
        filequery.getIndexedFilesInsideFolder(folder.fid, function(err, rows) {
            if (err) {
                console.error(err);
            } else {
                document.querySelector("#file-preview").innerHTML = '';
                var dbconnect = new DBConnect();
                // var ol = document.createElement('ol');
                // ol.id = 'selectable';
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
                    div.className = 'ui-state-default';
                    // ol.appendChild(div);
                    document.querySelector("#file-preview").appendChild(div);
                });
                // document.querySelector("#file-preview").appendChild(ol);
                var files = [];
                tagMap.forEach(function(tag) {
                    if (tag.filid in files) {} else {
                        files[tag.filid] = {};
                        files[tag.filid].tags = [];
                    }
                    files[tag.filid].tags.push(new Tag(tag.tname, new Category(tag.cname, tag.color)));
                });
                hf.showTags(files, onRemoveTagFromAFile);
                // $('#selectable').selectable();
                // document.querySelectorAll('.tags').forEach(function(div) {
                //     console.log(div);
                //     div.style.display = "none";
                // });
                // document.querySelector('#tag-inventory').style.pointerEvents = "none !important";
            }
        });
    });
}

var onNewTagEnterKey = function(inputText, categoryName, categoryColor) {
    filequery.insertNewTag(categoryName, inputText, function(err) {
        if (err && err.message.startsWith('ER_DUP_ENTRY')) {
            alert('No duplicate tag names');
        } else {
            hf.showNewTag(categoryName, inputText, categoryColor, onEditTag, onRemoveTag);
        }
    });
}

var onAddNewTag = function(category) {
    console.log('sdfsdf');
    console.log(category);
    hf.showInputNewTag(category).addEventListener('keydown', function(e) {
        if (e.keyCode == 13) { // Enter key
            onNewTagEnterKey(this.value, category.name, category.color);
            this.remove();
            hf.showAddNewTagIcon(category).addEventListener('click', function() {
                onAddNewTag(category);
            });
        } else if (e.keyCode == 27) { // Escape key
            this.remove();
            hf.showAddNewTagIcon(category).addEventListener('click', function() {
                onAddNewTag(category);
            });
        } else if (e.keyCode == 32) { // Space key
            e.preventDefault();
        }
    });
}

var onCreateNewCategory = function(categoryName, categoryColor) {
    // alert(categoryName + ' - ' + categoryColor);
    filequery.insertCategory(categoryName, categoryColor, function(err) {
        if (err && err.message.startsWith('ER_DUP_ENTRY')) {
            alert('no duplicate categories');
        } else {
            hf.showNewCategory(categoryName, categoryColor, onAddNewTag);
        }
    });
}

var onAddNewCategoryBtnClicked = function() {
    hf.showInputNewCategory(onCreateNewCategory);
}

var onRemoveTag = function(category, tag) {
        filequery.checkTagAvailabilityBeforeRemoveTag(category, tag, function(err, avail) {
            if (!err) {
                if (avail) {
                    var ans = confirm('The tag: ' + tag + '(' + category + ') has been tagged by some of ' +
                        'files. Do you want to remove the tag? (The tag of those files will be automatically removed)');
                    if (ans) {
                        filequery.removeTag(category, tag, function(err) {
                            document.querySelector('#tagkbd-' + category + '-' + tag).remove();
                            showFiles(currentFolder);
                        });
                    }
                } else {
                    var ans = confirm('The tag: ' + tag + '(' + category + ') is not tagged by any of ' +
                        'files. Do you want to remove the tag?');
                    if (ans) {
                        filequery.removeTag(category, tag, function(err) {
                            document.querySelector('#tagkbd-' + category + '-' + tag).remove();
                        });
                    }
                }
            }
        });
    }
    // filequery.removeTag(category, tag, function(err) {
    //     if (!err) {
    //         document.querySelector('#tagkbd-' + category + '-' + tag).remove();
    //     };
    // });

var onEditTag = function(category, tag) {
    alert('edit ' + category + ' - ' + tag);
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
    var emptyCategories = [];
    filequery.getEmptyCategories(function(emptyCategoryRows) {
        if (emptyCategoryRows) {
            emptyCategoryRows.forEach(function(categoryrow) {
                emptyCategories.push(new Category(categoryrow.cname, categoryrow.color));
            });
        }
        hf.showTagInventory(tags, emptyCategories, onAddNewTag, onRemoveTag, onEditTag, onAddNewCategoryBtnClicked);
    });
});

document.querySelector('#tag-inventory').style.overflowY = "scroll";


var onTag = function(filid, cname, tname, successCallback, errCallback) {
    filequery.tagFile(filid, cname, tname, successCallback, errCallback);
}

hf.makeInventoryTagsDraggable(onTag, onRemoveTagFromAFile);