import { DocumentIndex } from 'ndx-compat';

import {
  SearchResultItem,
  SearchResultType,
} from '../interface';

export class Search {
  /**
   * The document index object.
   */
  private _index: DocumentIndex<string, SearchResultItem>;

  /**
   * A map of documents to search.
   */
  private _documents: Map<string, SearchResultItem> = new Map();

  constructor() {
    this._index = new DocumentIndex();

    this._index.addField('value');
    this._index.addField('detail');
  }

  /**
   * Add a document to the search object.
   *
   * @param id The ID of the document
   * @param type The type of document
   * @param value The value of the document, used for searching
   * @param detail Additional details for the document
   */
  addDocument(id: string, type: SearchResultType, value = '', detail?: string) {
    const newDoc = { id, type, value, detail };
    this._documents.set(id, newDoc);
    this._index.add(id, newDoc);
  }

  /**
   * Perform a document search.
   *
   * @param query The search query string
   * @param limit A limit to the number of items returned.
   */
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
