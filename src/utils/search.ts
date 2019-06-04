import words from 'lodash/words.js';
import { QueryResult, query } from 'ndx-query/dist/module';
import { Index, addDocumentToIndex, createIndex } from 'ndx/dist/module';

import {
  SearchResultItem,
  SearchResultType,
} from '../interface';

export class Search {
  private _index: Index<string>; // DocumentIndex<string, SearchResultItem>;

  private _documents: Map<string, SearchResultItem> = new Map();

  constructor() {
    const fields = ['value', 'detail'];
    const i = this._index = createIndex(fields.length);
    const a = fields.map(f => (doc: SearchResultItem) => doc[f]);
    const b = fields.map(_ => 1);
    const termFilter = (term: string) => term.toLowerCase();

    this._index = {
      add: (doc: SearchResultItem) => {
        addDocumentToIndex<string, SearchResultItem>(i, a, words, termFilter, doc.id, doc);
      },
      search: (q: string, limit?: number) => {
        return query(i, b, 1.2, 0.75, words, termFilter,
            undefined, q)
          .slice(0, limit)
          .map((res: QueryResult<string>) => i.docs.get(res.key));
      },
    };
  }

  addDocument(id: string, type: SearchResultType, value = '', detail?: string) {
    const newDoc = { id, type, value, detail };
    this._documents.set(id, newDoc);
    this._index.add(id, newDoc);
  }

  search(q: string, limit?: number) {
    return this._index.search(q).slice(0, limit).reduce((ar: SearchResultItem[], res: any) => {
      if (this._documents.has(res.docId)) {
        const doc = this._documents.get(res.docId);
        if (doc) {
          return [ ...ar, doc ];
        }
      }
      return ar;
    }, [] as SearchResultItem[]);
  }
}
