import { DocumentIndex } from 'ndx-compat';

import {
  SearchResultItem,
  SearchResultType,
} from '../interface';

export class Search {
  private _index: DocumentIndex<string, SearchResultItem>;

  private _documents: Map<string, SearchResultItem> = new Map();

  constructor() {
    this._index = new DocumentIndex();

    this._index.addField('value');
    this._index.addField('detail');
  }

  addDocument(id: string, type: SearchResultType, value = '', detail?: string) {
    const newDoc = { id, type, value, detail };
    this._documents.set(id, newDoc);
    this._index.add(id, newDoc);
  }

  search(query: string, limit?: number) {
    return this._index.search(query).slice(0, limit).reduce((ar: SearchResultItem[], res: any) => {
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