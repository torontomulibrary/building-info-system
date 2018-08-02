export interface SearchResult {
  name: string;
  link: string;
}

export interface SearchResultGroup {
  name: string;
  items: SearchResult[];
}