/**
 * An array of search results.  Results are simply the ID of the document.
 * @template T The type of index.
 */
export interface SearchResults<T> {
  docId: T;
  score: number;
}
