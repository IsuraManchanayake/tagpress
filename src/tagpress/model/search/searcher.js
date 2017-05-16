import { global } from '../../global/global'
import { File } from '../fileinformation/file'
import { Tag } from '../fileinformation/tag'
import { Category } from '../fileinformation/category'
import { SearchResult } from './searchresult'
import * as seachquery from '../../data/searchquery'

export class Searcher {

    constructor(keywords, folderid) {
        this.keywords = keywords.split(/(?:,| )+/);
        this.global = !folderid;
        if (folderid) {
            this.folderid = folderid;
        }
    }

    search(callback) {
        var results = [];
        if (!this.global) {
            seachquery.searchFolder(this.folderid, this.keywords, function(ar) {
                results = (new SearchResult(ar)).simplify();
                callback(results);
            });
        } else {
            seachquery.searchAllFolders(this.keywords, function(ar) {
                results = (new SearchResult(ar)).simplify();
                callback(results);
            });
        }
    }
}