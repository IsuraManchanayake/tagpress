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

export const showTagInventory = (tags, emptyCategories, onAddNewTag, onRemoveTag, onEditTag, onAddNewCategory) => {
    console.log(tags);
    if (!!Object.keys(tags).length) {
        for (var category in tags) {
            if (tags.hasOwnProperty(category)) {
                var categoryDiv = document.createElement('div');
                var categoryH = document.createElement('h5');
                categoryH.innerHTML = category;
                categoryDiv.className = "tag-inventory-category";
                categoryDiv.id = "category-div-" + category;
                categoryDiv.appendChild(categoryH);
                tags[category].tags.forEach(function(tag) {
                    var tagkbd = document.createElement('kbd');
                    tagkbd.innerHTML = tag.name;
                    tagkbd.style.backgroundColor = tag.category.color;
                    tagkbd.style.cssFloat = "left";
                    tagkbd.id = 'tagkbd-' + category + '-' + tag.name;
                    tagkbd.className = 'tag-inventory-draggable draggable'

                    var eicon = document.createElement('i');
                    eicon.className = 'glyphicon glyphicon-pencil tag-edit';
                    eicon.id = 'edit-' + tag.name;
                    eicon.style.display = "none";
                    eicon.title = 'edit tag';
                    eicon.setAttribute('data-tag-name', tag.name);
                    eicon.setAttribute('data-category-name', category);
                    tagkbd.appendChild(eicon);

                    var ricon = document.createElement('i');
                    ricon.className = 'glyphicon glyphicon-remove tag-remove';
                    ricon.id = 'remove-' + tag.name;
                    ricon.style.display = "none";
                    ricon.title = 'remove tag';
                    ricon.setAttribute('data-tag-name', tag.name);
                    ricon.setAttribute('data-category-name', category);
                    tagkbd.appendChild(ricon);

                    tagkbd.addEventListener("mouseout", function(x) {
                        document.querySelector('#remove-' + tag.name).style.display = "none";
                        document.querySelector('#edit-' + tag.name).style.display = "none";
                    });
                    tagkbd.addEventListener("mouseover", function(x) {
                        document.querySelector('#remove-' + tag.name).style.display = "inline-block";
                        document.querySelector('#edit-' + tag.name).style.display = "inline-block";
                    });

                    ricon.addEventListener('click', function() {
                        onRemoveTag(this.getAttribute('data-category-name'), this.getAttribute('data-tag-name'));
                    });
                    eicon.addEventListener('click', function() {
                        onEditTag(this.getAttribute('data-category-name'), this.getAttribute('data-tag-name'));
                    });

                    categoryDiv.appendChild(tagkbd);
                });
                var clearFix = document.createElement('div');
                clearFix.style.clear = "both";
                clearFix.id = 'category-clearfix-' + category;
                categoryDiv.appendChild(clearFix);
                document.querySelector('#tag-inventory').appendChild(categoryDiv);
                showAddNewTagIcon({ name: category, color: tags[category].tags[0].category.color })
                    .addEventListener('click', function() {
                        onAddNewTag({ name: this.getAttribute('data-category-name'), color: this.style.backgroundColor });
                    });
            }
        }
    }
    emptyCategories.forEach(function(category) {
        var categoryDiv = document.createElement('div');
        var categoryH = document.createElement('h5');
        categoryH.innerHTML = category.name;
        categoryDiv.className = "tag-inventory-category";
        categoryDiv.id = "category-div-" + category.name;
        categoryDiv.appendChild(categoryH);
        var clearFix = document.createElement('div');
        clearFix.style.clear = "both";
        clearFix.id = 'category-clearfix-' + category.name;
        categoryDiv.appendChild(clearFix);
        document.querySelector('#tag-inventory').appendChild(categoryDiv);
        showAddNewTagIcon(category)
            .addEventListener('click', function() {
                onAddNewTag({ name: this.getAttribute('data-category-name'), color: this.style.backgroundColor });
            });
    });
    var button = document.createElement('button');
    button.type = 'button';
    button.id = 'btn-addnew-category';
    button.className = 'btn btn-default';
    button.title = 'Add new category';
    var plusIcon = document.createElement('i');
    plusIcon.className = 'glyphicon glyphicon-plus';
    button.appendChild(plusIcon);
    button.addEventListener('click', function() {
        button.disabled = true;
        onAddNewCategory();
    });
    document.querySelector('#tag-inventory').appendChild(button);
}

export const showInputNewCategory = (onCreateNewCategory) => {
    var categoryDiv = document.createElement('div');
    categoryDiv.className = 'create-category-div';
    categoryDiv.innerHTML = ' <div class="row newcategory-div">\
                    <div class="form-group">\
                        <input type="text" maxlength="20" placeholder="Category name" class="form-control" id="newcategory-name">\
                    </div>\
                    <div class="row last-line">\
                        <div class="col-md-8">\
                            <select class="form-control" id="newcategory-color">\
                            </select>\
                        </div>\
                            <button type="button" class="btn btn-default" style="float: right; margin-right: 15px" id="create-category">Create</button>\
                    </div>\
                </div>';
    var tagInventory = document.querySelector('#tag-inventory');
    tagInventory.insertBefore(categoryDiv, tagInventory.lastChild);
    document.querySelector('#newcategory-name').focus();
    var categoryColor = document.querySelector('#newcategory-color');
    global.CSSColors.forEach(function(color) {
        if (global.lightCSSColors.indexOf(color) == -1) {
            var option = document.createElement('option');
            option.class = 'category-color-option';
            option.style.color = 'white';
            option.value = color;
            option.style.background = color;
            option.innerText = color;
            categoryColor.appendChild(option);
        }
    });
    document.querySelector('#newcategory-name').addEventListener('keydown', function(e) {
        if (e.keyCode == 32) { // Space key`
            e.preventDefault();
        }
    })
    document.querySelector('#create-category').addEventListener('click', function() {
        onCreateNewCategory(document.querySelector('#newcategory-name').value, document.querySelector('#newcategory-color').value);
        document.querySelectorAll('.create-category-div').forEach(function(ccdiv) {
            ccdiv.remove();
        });
        document.querySelector('#btn-addnew-category').disabled = false;
    });
}

export const showNewCategory = (categoryName, categoryColor, onAddNewTag) => {
    // console.log('shit');
    var categoryDiv = document.createElement('div');
    var categoryH = document.createElement('h5');
    categoryH.innerHTML = categoryName;
    categoryDiv.className = "tag-inventory-category";
    categoryDiv.id = "category-div-" + categoryName;
    categoryDiv.appendChild(categoryH);
    var clearFix = document.createElement('div');
    clearFix.style.clear = "both";
    clearFix.id = 'category-clearfix-' + categoryName;
    categoryDiv.appendChild(clearFix);
    // document.querySelector('#tag-inventory').appendChild(categoryDiv);
    var tagInventoryDiv = document.querySelector('#tag-inventory');
    tagInventoryDiv.insertBefore(categoryDiv, tagInventoryDiv.lastChild);
    showAddNewTagIcon({ name: categoryName, color: categoryColor })
        .addEventListener('click', function() {
            onAddNewTag({ name: this.getAttribute('data-category-name'), color: this.style.backgroundColor });
        });
}

export const showInputNewTag = (category) => {
    console.log(category);
    var plusIcon = document.querySelector('#add-newtag-kbd-' + category.name);
    console.log('#category-name-' + category.name);
    // plusIcon.style.display = 'none';
    plusIcon.remove();
    var categoryDiv = document.querySelector('#category-div-' + category.name);
    var newTag = document.createElement('input');
    newTag.required = true;
    newTag.type = 'text';
    newTag.className = 'add-newtag-input form-control';
    newTag.placeholder = "New tag name";
    newTag.maxLength = global.tagMaxLength;
    categoryDiv.insertBefore(newTag, document.querySelector('#category-clearfix-' + category.name));
    newTag.focus();
    return newTag;
}

export const showAddNewTagIcon = (category, onAddNewTag) => {
    var addnewTag = document.createElement('kbd');
    addnewTag.style.cssFloat = "left";
    addnewTag.className = "add-newtag-kbd";
    addnewTag.title = "add new tag to " + category.name;
    addnewTag.style.backgroundColor = category.color;
    addnewTag.id = 'add-newtag-kbd-' + category.name;
    addnewTag.innerHTML = '<i id="add-newtag-icon-' + category.name +
        '" class="glyphicon glyphicon-plus add-newtag"></i>';
    addnewTag.setAttribute('data-category-name', category.name);
    var categoryDiv = document.querySelector('#category-div-' + category.name);
    categoryDiv.insertBefore(addnewTag, categoryDiv.lastChild);
    return addnewTag;
}

export const showNewTag = (categoryName, tagName, categoryColor, onEditTag, onRemoveTag) => {
    var categoryDiv = document.querySelector('#category-div-' + categoryName);
    var tagkbd = document.createElement('kbd');
    tagkbd.innerHTML = tagName;
    tagkbd.style.backgroundColor = categoryColor;
    tagkbd.style.cssFloat = "left";
    tagkbd.title = 'tag: ' + tagName + ';category: ' + categoryName;
    tagkbd.id = 'tagkbd-' + categoryName + '-' + tagName;

    var eicon = document.createElement('i');
    eicon.className = 'glyphicon glyphicon-pencil tag-edit';
    eicon.id = 'edit-' + tagName;
    eicon.style.display = "none";
    eicon.title = 'edit tag';
    eicon.setAttribute('data-tag-name', tagName);
    eicon.setAttribute('data-category-name', categoryName);
    tagkbd.appendChild(eicon);

    var ricon = document.createElement('i');
    ricon.className = 'glyphicon glyphicon-remove tag-remove';
    ricon.id = 'remove-' + tagName;
    ricon.style.display = "none";
    ricon.title = 'remove tag';
    ricon.setAttribute('data-tag-name', tagName);
    ricon.setAttribute('data-category-name', categoryName);
    tagkbd.appendChild(ricon);

    tagkbd.addEventListener("mouseout", function(x) {
        document.querySelector('#remove-' + tagName).style.display = "none";
        document.querySelector('#edit-' + tagName).style.display = "none";
    });
    tagkbd.addEventListener("mouseover", function(x) {
        document.querySelector('#remove-' + tagName).style.display = "inline-block";
        document.querySelector('#edit-' + tagName).style.display = "inline-block";
    });

    ricon.addEventListener('click', function() {
        onRemoveTag(this.getAttribute('data-category-name'), this.getAttribute('data-tag-name'));
    });
    eicon.addEventListener('click', function() {
        onEditTag(this.getAttribute('data-category-name'), this.getAttribute('data-tag-name'));
    });
    categoryDiv.insertBefore(tagkbd, categoryDiv.childNodes[categoryDiv.childNodes.length - 2]);
}