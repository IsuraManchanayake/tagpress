import { global } from '../../global/global'
import path from 'path'

export const getFileNavigationFolderHTML = (folder) => {
    return '<button type="button" class="folder"><p class="folder-name">' +
        folder.name +
        '</p><p class="folder-path">' +
        folder.path +
        '</p></button>';
}

export const getNewFontFaceHTML = (fontFile) => {
    var fontFaceName = fontFile.name.substr(0, fontFile.name.lastIndexOf('.')) || fontFile.name;
    return "@font-face {\
                font-family: " + fontFaceName + ";\
                src: url('file://" + path.resolve(fontFile.path) + "') format('TrueType');\
            }";
}

export const getFontThumbnailPreview = (fontFile) => {
    var fontFaceName = fontFile.name.substr(0, fontFile.name.lastIndexOf('.')) || fontFile.name;
    return '<div class="gallery"><p style="font-family: ' + fontFaceName + '; font-size: 30px; ' +
        'text-align: center; padding: 15px;">' +
        global.defaultFontPreviewLine + '</p><div class="desc"><p title="open file" class="file-name">' +
        fontFile.name +
        '</p><p id="file-id-' + fontFile.fid + '" class="tags"></p></div></div>'
        // '</p><p class="tags" style="margin-left: 10px; margin-right: 10px;"><kbd>serif</kbd><kbd>sans-serif</kbd><kbd>mono</kbd></p></div></div>';
}

export const getImageThumbnailPreview = (file) => {
    return '<div class="gallery"><img src="' +
        'file://' + path.resolve(file.thumbnail) +
        '"><div class="desc"><p title="open file" class="file-name">' +
        file.name +
        '</p><p id="file-id-' + file.fid + '" class="tags"></p></div></div>';
}

export const showTags = (files) => {
    // console.log(files);
    if (!!Object.keys(files).length) {
        for (var filid in files) {
            if (files.hasOwnProperty(filid)) {
                var tagp = document.querySelector('#file-id-' + filid);
                files[filid].tags.forEach(function(tag) {
                    var tagkbd = document.createElement('kbd');
                    tagkbd.innerHTML = tag.name;
                    tagkbd.style.backgroundColor = tag.category.color;
                    tagkbd.title = "tag: " + tag.name + "; category: " + tag.category.name;
                    var icon = document.createElement('i');
                    icon.className = 'glyphicon glyphicon-remove tag-remove';
                    icon.id = 'remove-' + filid + '-' + tag.name;
                    icon.style.display = "none";
                    icon.title = 'remove tag';
                    tagkbd.appendChild(icon);
                    tagp.appendChild(tagkbd);
                    tagkbd.addEventListener("mouseout", function(x) {
                        this.lastChild.style.display = "none";
                    });
                    tagkbd.addEventListener("mouseover", function(x) {
                        this.lastChild.style.display = "inline-block";
                    });
                    icon.addEventListener('click', function(x) {
                        console.log('to remove ' + tag.name);
                    });
                    tagp.appendChild(tagkbd);
                });
            }
        }
    }
}

export const showTagInventory = (tags) => {
    console.log(tags);
    if (!!Object.keys(tags).length) {
        for (var category in tags) {
            if (tags.hasOwnProperty(category)) {
                var categoryDiv = document.createElement('div');
                var categoryH = document.createElement('h3');
                categoryH.innerHTML = category;
                categoryDiv.className = "tag-inventory-category";
                categoryDiv.id = "category-div-" + category;
                categoryDiv.appendChild(categoryH);
                tags[category].tags.forEach(function(tag) {
                    var tagkbd = document.createElement('kbd');
                    tagkbd.innerHTML = tag.name;
                    tagkbd.style.backgroundColor = tag.category.color;
                    tagkbd.style.cssFloat = "left";
                    categoryDiv.appendChild(tagkbd);
                });
                var addnewTag = document.createElement('kbd');
                addnewTag.style.cssFloat = "left";
                addnewTag.className = "add-newtag-kbd";
                addnewTag.title = "add new tag to " + category;
                addnewTag.style.backgroundColor = tags[category].tags[0].category.color;
                addnewTag.id = 'add-newtag-kbd-' + category
                addnewTag.innerHTML = '<i id="add-newtag-icon-' + tags[category].tags[0].category.name +
                    '" class="glyphicon glyphicon-plus add-newtag"></i>';
                categoryDiv.appendChild(addnewTag);
                var clearFix = document.createElement('div');
                clearFix.style.clear = "both";
                categoryDiv.appendChild(clearFix);
                document.querySelector('#tag-inventory').appendChild(categoryDiv);
                var testdiv = document.createElement('div');
            }
        }
    }
}

export const showCreateNewTag = (category) => {
    var plusIcon = document.querySelector('#add-newtag-kbd-' + category.name);
    console.log('#category-name-' + category.name);
    plusIcon.style.display = 'none';
    var categoryDiv = document.querySelector('#category-div-' + category.name);
    var newTag = document.createElement('input');
    newTag.type = 'text';
    newTag.className = 'add-newtag-input form-control';
    categoryDiv.appendChild(newTag);
}