import assert from 'assert'
import fs from 'fs'
import exec from 'exec'

import { global } from '../global/global'

import { FileGrouper } from '../model/corefunctionhandler/filegrouper'
import { File } from '../model/fileinformation/file'
import { Tag } from '../model/fileinformation/tag'
import { Category } from '../model/fileinformation/category'


var fg;

exec('rm -r /media/isura/2030CA7330CA5008/shiki/da/', function(err, out, code) {
    describe('The file grouper module', function() {

        before(function() {
            var file1 = new File('/media/isura/2030CA7330CA5008/shiki/SHIKI01S_xbox.mp4', [
                new Tag('abc', new Category('def', 'ghi'), "1"),
                new Tag('jkl', new Category('mno', 'pqr'), "2")
            ]);
            var file2 = new File('/media/isura/2030CA7330CA5008/shiki/SHIKI02S_xbox.mp4', [
                new Tag('abc', new Category('def', 'ghi'), "1"),
                new Tag('321', new Category('mno', 'pqr'), "3")
            ]);
            var file3 = new File('/media/isura/2030CA7330CA5008/shiki/SHIKI01S_xbox.mp4', [
                new Tag('abc', new Category('def', 'ghi'), "1"),
                new Tag('jkl', new Category('mno', 'pqr'), "2"),
                new Tag('321', new Category('mno', 'pqr'), "3")
            ]);
            var files = [file1, file2, file3];
            var tags = [new Tag('abc', new Category('def', 'ghi'), "1"), new Tag('jkl', new Category('mno', 'pqr'), "2")];
            fg = new FileGrouper(files, tags, '/media/isura/2030CA7330CA5008/shiki/da/');
        });

        it('groups files', function() {
            var c = 0;
            fg.copyFiles(function() {
                fs.stat('/media/isura/2030CA7330CA5008/shiki/da/[def][abc]/SHIKI01S_xbox.mp4', function(err, stats) {
                    if (!err) c++;
                });
                fs.stat('/media/isura/2030CA7330CA5008/shiki/da/[mno][jkl]/SHIKI01S_xbox.mp4', function(err, stats) {
                    if (!err) c++;
                });
                fs.stat('/media/isura/2030CA7330CA5008/shiki/da/[def][abc]/SHIKI02S_xbox.mp4', function(err, stats) {
                    if (!err) c++;
                });
                assert.equal(c, 3);
            });
        });
    });
});