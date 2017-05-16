import { global } from '../../global/global'
import { File } from '../fileinformation/file'
import { Tag } from '../fileinformation/tag'
import { Category } from '../fileinformation/category'

export class SearchResult {

    constructor(rawDataList) {
        this.rawDataList = rawDataList;
    }

    simplify() {
        var results = [];
        this.rawDataList.forEach(function(row) {
            // row {filename, filid, tid, cname, tname, color, fpath}
            if (row.filid in results) {} else {
                results[row.filid] = new File(row.fpath + row.filename, []);
            }
        });
        this.rawDataList.forEach(function(row) {
            results[row.filid].tags.push(new Tag(row.tname, new Category(row.cname, row.color)));
        });
        return results;
    }
}