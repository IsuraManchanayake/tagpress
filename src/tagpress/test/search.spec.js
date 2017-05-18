import assert from 'assert'
import fs from 'fs'

import { global } from '../global/global'

import { File } from '../model/fileinformation/file'
import { Searcher } from '../model/search/searcher'
import { SearchResult } from '../model/search/searchresult'

// var searcher;
var searchresult;


describe('The searcher module', function() {
    it('one keyword', function() {
        var searcher = new Searcher('done', 3001);
        searcher.search(function(results) {
            var file = results[0];
            // console.log(results + " ds");
            var found = false;
            file.tags.forEach(function(tag) {
                if (tag.name == 'done') {
                    found = true;
                }
            });
            assert.equal(found, true);
        });
    });
    it('more keywords space seperated', function() {
        var searcher = new Searcher('done next', 3001);
        searcher.search(function(results) {
            var file = results[0];
            // console.log(results + " ds");
            var donefound = false;
            var nextfound = false;
            file.tags.forEach(function(tag) {
                if (tag.name == 'done') {
                    donefound = true;
                }
                if (tag.name == 'next') {
                    nextfound = true;
                }
            });
            assert.equal(donefound && nextfound, true);
        });
    });
    it('more keywords comma seperated', function() {
        var searcher = new Searcher('done,next', 3001);
        searcher.search(function(results) {
            var file = results[0];
            // console.log(results + " ds");
            var donefound = false;
            var nextfound = false;
            file.tags.forEach(function(tag) {
                if (tag.name == 'done') {
                    donefound = true;
                }
                if (tag.name == 'next') {
                    nextfound = true;
                }
            });
            assert.equal(donefound && nextfound, true);
        });
    });
    it('global one keyword', function() {
        var searcher = new Searcher('done');
        searcher.search(function(results) {
            var file = results[0];
            // console.log(results + " ds");
            var found = false;
            file.tags.forEach(function(tag) {
                if (tag.name == 'done') {
                    found = true;
                }
            });
            assert.equal(found, true);
        });
    });
    it('global more keywords space seperated', function() {
        var searcher = new Searcher('done next');
        searcher.search(function(results) {
            var file = results[0];
            // console.log(results + " ds");
            var donefound = false;
            var nextfound = false;
            file.tags.forEach(function(tag) {
                if (tag.name == 'done') {
                    donefound = true;
                }
                if (tag.name == 'next') {
                    nextfound = true;
                }
            });
            assert.equal(donefound && nextfound, true);
        });
    });
    it('global more keywords comma seperated', function() {
        var searcher = new Searcher('done,next');
        searcher.search(function(results) {
            var file = results[0];
            // console.log(results + " ds");
            var donefound = false;
            var nextfound = false;
            file.tags.forEach(function(tag) {
                if (tag.name == 'done') {
                    donefound = true;
                }
                if (tag.name == 'next') {
                    nextfound = true;
                }
            });
            assert.equal(donefound && nextfound, true);
        });
    });
});