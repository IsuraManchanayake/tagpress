import './helpers/context_menu.js';
import './helpers/external_links.js';

import { remote } from 'electron';
import path from 'path'
import jetpack from 'fs-jetpack';
import env from './env';
import interact from 'interact.js'

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
                });
                var files = [];
                tagMap.forEach(function(tag) {
                    if (tag.filid in files) {} else {
                        files[tag.filid] = {};
                        files[tag.filid].tags = [];
                    }
                    files[tag.filid].tags.push(new Tag(tag.tname, new Category(tag.cname, tag.color)));
                });
                hf.showTags(files);
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

// target elements with the "draggable" class
/*
interact('.draggable')
    .draggable({
        // enable inertial throwing
        inertia: true,
        // keep the element within the area of it's parent
        restrict: {
            // restriction: "parent",
            // restriction: "#file-nav",
            endOnly: true,
            elementRect: { top: 0, left: 0, bottom: 1, right: 1 }
        },
        // enable autoScroll
        autoScroll: true,

        // call this function on every dragmove event
        onmove: global.dragMoveListener
            // call this function on every dragend event
            // onend: function(event) {
            //     var textEl = event.target.querySelector('p');

        //     textEl && (textEl.textContent =
        //         'moved a distance of ' +
        //         (Math.sqrt(event.dx * event.dx +
        //             event.dy * event.dy) | 0) + 'px');
        // }
    }).on('move', function(event) {
        var interaction = event.interaction;
        if (interaction.pointerIsDown && !interaction.interacting() && event.currentTarget.getAttribute('clonable') != 'false') {
            var original = event.currentTarget;
            var clone = event.currentTarget.cloneNode(true);
            var x = clone.offsetLeft;
            var y = clone.offsetTop;
            clone.setAttribute('clonable', 'false');
            clone.style.position = "absolute";
            clone.style.left = original.offsetLeft + "px";
            clone.style.top = original.offsetTop + "px";
            original.parentElement.appendChild(clone);
            interaction.start({ name: 'drag' }, event.interactable, clone);
        }
    });






// this is used later in the resizing and gesture demos
window.dragMoveListener = global.dragMoveListener;
*/
// import $ from 'jquery'

// console.log($('#file-nav'));

// var startPos = { x: 0, y: 0 };

// interact('.draggable')
//     .draggable({
//         onmove: dragMoveListener,
//         onstart: dragStartListener,
//         inertia: true,
//         snap: {
//             targets: [startPos],
//             range: Infinity,
//             relativePoints: [{ x: 0.5, y: 0.5 }],
//             endOnly: true
//         }
//     });

// function dragMoveListener(event) {
//     var target = event.target,
//         // keep the dragged position in the data-x/data-y attributes
//         x = (parseFloat(target.getAttribute('data-x')) || 0) + event.dx,
//         y = (parseFloat(target.getAttribute('data-y')) || 0) + event.dy;

//     // translate the element
//     target.style.webkitTransform =
//         target.style.transform =
//         'translate(' + x + 'px, ' + y + 'px)';

//     // update the posiion attributes
//     target.setAttribute('data-x', x);
//     target.setAttribute('data-y', y);
// }

// function dragStartListener(event) {
//     var rect = interact.getElementRect(event.target);

//     // record center point when starting a drag
//     startPos.x = rect.left + rect.width / 2;
//     startPos.y = rect.top + rect.height / 2;
// }
// document.querySelector('#tag-inventory').style.overflowY = "";
// document.querySelector('#tag-inventory').style.overflow = "";

var startPos = null;

interact('.draggable').draggable({
    snap: {
        targets: [startPos],
        range: Infinity,
        relativePoints: [{ x: 0.5, y: 0.5 }],
        endOnly: true
    },
    inertia: true,
    onstart: function(event) {
        var rect = interact.getElementRect(event.target);
        document.querySelector('#tag-inventory').style.overflowY = "";
        console.log('kjhbj');
        // record center point when starting the very first a drag
        startPos = {
            x: rect.left + rect.width / 2,
            y: rect.top + rect.height / 2
        }

        event.interactable.draggable({
            snap: {
                targets: [startPos]
            }
        });
    },
    // call this function on every dragmove event
    onmove: function(event) {
        var target = event.target,
            // keep the dragged position in the data-x/data-y attributes
            x = (parseFloat(target.getAttribute('data-x')) || 0) + event.dx,
            y = (parseFloat(target.getAttribute('data-y')) || 0) + event.dy;

        // translate the element
        target.style.webkitTransform =
            target.style.transform =
            'translate(' + x + 'px, ' + y + 'px)';

        // update the posiion attributes
        target.setAttribute('data-x', x);
        target.setAttribute('data-y', y);
        // target.classList.add('getting--dragged');
    },
    onend: function(event) {
        document.querySelector('#tag-inventory').style.overflowY = "scroll";
        // event.target.classList.remove('getting--dragged');
        // if(event.target.classList.contains('been'))
        if (!event.target.classList.contains('dropped')) {
            // if (!event.relatedTarget.classList.contains('caught--it')) {
            event.target.remove();
        }
        event.target.classList.remove('draggable');
        event.target.style.position = "";
        // event.target.style.top = "";
        // event.target.style.left = "";
        event.target.style.transform = "";
        // document.querySelector('#do-bar').appendChild(event.target);
    }
}).on('move', function(event) {
    var interaction = event.interaction;
    if (interaction.pointerIsDown && !interaction.interacting() && event.currentTarget.getAttribute('clonable') != 'false') {
        var original = event.currentTarget;
        var clone = event.currentTarget.cloneNode(true);
        var x = clone.offsetLeft;
        var y = clone.offsetTop;
        clone.setAttribute('clonable', 'false');
        clone.style.position = "absolute";
        clone.style.left = original.offsetLeft + "px";
        clone.style.top = original.offsetTop + "px";
        clone.lastChild.remove();
        clone.lastChild.remove();
        original.parentElement.appendChild(clone);
        interaction.start({ name: 'drag' }, event.interactable, clone);
    }
});

interact('.droppable').dropzone({

    accept: '.draggable',
    overlap: .1,

    //     ondropactivate: function(event) {
    //         event.target.classList.add('can--drop');
    //     },
    ondragenter: function(event) {
        var draggableElement = event.relatedTarget,
            dropzoneElement = event.target,
            dropRect = interact.getElementRect(dropzoneElement),
            dropCenter = {
                x: dropRect.left + dropRect.width / 2,
                y: dropRect.top + dropRect.height / 2
            };
        // feedback the possibility of a drop
        // dropzoneElement.classList.add('can--catch');
        // draggableElement.classList.add('drop--me');
        event.target.classList.add('drop--me');
        event.relatedTarget.classList.add('dropped');
        // console.log('shit');
        event.draggable.draggable({
            snap: {
                targets: [dropCenter]
            }
        });
        // if (!event.relatedTarget.classList.contains('dropped')) {
        //     event.draggable.draggable({
        //         snap: {
        //             targets: [startPos]
        //         }
        //     });
        // }
    },
    ondragleave: function(event) {
        event.draggable.draggable({
            snap: {
                targets: [{ x: Infinity, y: Infinity }]
            }
        });
        // remove the drop feedback style
        // console.log(event.target);
        // console.log(event.relatedTarget); 
        // event.target.classList.remove('can--catch', 'caught--it');
        event.target.classList.remove('drop--me');
        event.relatedTarget.classList.remove('dropped');
        // event.relatedTarget.classList.remove('left-someone');
    },
    ondrop: function(event) {
        event.target.classList.remove('drop--me');
        // event.target.appendChild(event.relatedTarget);
        var tagkbd = event.relatedTarget;
        var icon = document.createElement('i');
        icon.className = 'glyphicon glyphicon-remove tag-remove';
        // icon.id = 'remove-' + filid + '-' + tag.name;
        icon.style.display = "none";
        icon.title = 'remove tag';
        tagkbd.addEventListener("mouseout", function(x) {
            this.lastChild.style.display = "none";
        });
        tagkbd.addEventListener("mouseover", function(x) {
            this.lastChild.style.display = "inline-block";
        });
        icon.addEventListener('click', function(x) {
            console.log('to remove ' + tag.name);
        });
        tagkbd.appendChild(icon);
        event.target.querySelector('.tags').appendChild(tagkbd);
        //         console.log("Index of dropped node: " + (event.target));
        //         console.log("Index of dragged node: " + getNodeIndex(event.relatedTarget.parentNode));
        //         //event.relatedTarget.textContent = 'Dropped';
        //         console.log("Dropped!");
        //         console.log("related target: " + event.relatedTarget.parentNode);
        //         console.log(event.draggable);
        // event.relatedTarget.classList.add('no-shit');
        // event.target.classList.add('caught--it');
    },
    //     ondropdeactivate: function(event) {
    //         // remove active dropzone feedback
    //         event.target.classList.remove('can--drop');
    //         event.target.classList.remove('can--catch');
    //     }
});