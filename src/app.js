// Here is the starting point for your application code.

// Small helpers you might want to keep
import './helpers/context_menu.js';
import './helpers/external_links.js';

// All stuff below is just to show you how it works. You can delete all of it.
import { remote } from 'electron';
import jetpack from 'fs-jetpack';
import env from './env';
import { listAllFiles } from './tagpress/model/tagpressfilehandler/validator'
import { Folder } from './tagpress/model/fileinformation/folder'
import { File } from './tagpress/model/fileinformation/file'
import { DBConnect } from './tagpress/data/dbconnect'
import { global } from './tagpress/global/global'
import path from 'path'
import {
    listAllIndexedFolders,
    getIndexedFilesInsideFolder,
    getAllTags
} from './tagpress/data/filequery'

var lista = listAllFiles(new Folder('src/tagpress/test/example/'))


const app = remote.app;
const appDir = jetpack.cwd(app.getAppPath());

const manifest = appDir.read('package.json', 'json');

const osMap = {
    win32: 'Windows',
    darwin: 'macOS',
    linux: 'Linux',
};

document.querySelector("#import-btn").onclick = function() {

};

listAllIndexedFolders(function(err, rows) {
    if (err) {
        console.error(err);
    } else {
        rows.forEach(function(row) {
            var folder = new Folder(row.fpath);
            folder.fid = row.fid;
            var div = document.createElement('div');
            div.innerHTML = '<button type="button" class="folder"><p class="folder-name">' +
                folder.name +
                '</p><p class="folder-path">' +
                folder.path +
                '</p></button>';
            div.addEventListener('click', function() {
                showFiles(folder);
            });
            document.querySelector("#file-nav").appendChild(div);
        });
    }
});


var showFiles = function(folder) {
    var ul = document.createElement('ul');
    getIndexedFilesInsideFolder(folder.fid, function(err, rows) {
        if (err) {
            console.error(err);
        } else {
            document.querySelector("#file-preview").innerHTML = '';
            rows.forEach(function(row) {
                var file = new File(folder.path + row.filename);
                var div = document.createElement('div');
                if (file.isFont) {
                    var newStyle = document.createElement('style');
                    var fontFaceName = file.name.substr(0, file.name.lastIndexOf('.')) || file.name;
                    newStyle.appendChild(document.createTextNode("\
                    @font-face {\
                        font-family: " + fontFaceName + ";\
                        src: url('file://" + path.resolve(file.path) + "') format('TrueType');\
                    }\
                    "));
                    document.head.appendChild(newStyle);
                    div.innerHTML = '<div class="gallery"><p style="font-family: ' + fontFaceName + '; font-size: 30px; ' +
                        'text-align: center; padding: 15px;">' +
                        global.defaultFontPreviewLine + '</p><div class="desc"><p class="file-name">' +
                        file.name +
                        '</p><p style="margin-left: 10px; margin-right: 10px;"><kbd>serif</kbd><kbd>sans-serif</kbd><kbd>mono</kbd></p></div></div>';
                } else {
                    div.innerHTML = '<div class="gallery"><img src="' +
                        'file://' + path.resolve(file.thumbnail) +
                        '"><div class="desc"><p class="file-name">' +
                        file.name +
                        '</p></div></div>';
                }
                // var dbconnect = new DBConnect();
                getAllTags(row.filid, function(err, tags) {
                    if (!err) {
                        tags.forEach(function(tag) {
                            console.log(file.name + ": " + tag.tname);
                        })
                    }
                });
                // dbconnect.con.end();
                document.querySelector("#file-preview").appendChild(div);
            });
        }
    })
}

var fontmanager = require('font-manager');
fontmanager.getAvailableFonts(function(fonts) {
    console.log(fonts);
});
// var con = new DBConnect();

// document.querySelector('#import').innerHTML = global.defaultFileThumb;
// document.querySelector('#os').innerHTML = osMap[process.platform];
// document.querySelector('#author').innerHTML = manifest.author;
// document.querySelector('#env').innerHTML = env.name;
// document.querySelector('#electron-version').innerHTML = process.versions.electron;

// console.log('shit')
// jQuery(document).ready(function() {
//     console.log('dsd')
//     jQuery(".resizable").resizable();
// });