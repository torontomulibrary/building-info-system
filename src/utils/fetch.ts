export function fetchJSON(input: string, init?: any): Promise<any> {
  return fetch(input, init).then(res => {
    if (res.ok) {
      return res.json();
    }
    throw new Error('Network response was not OK.');
  }).catch((err) => {
    console.log('Fetch json error: ' + err.message);
  });
}

/**
 * This function loads a given URL as an IMG resource and returns an IMG
 * object of the data loaded from the URL.  Will throw an error if fetching
 * the URL was unsuccessful.
 *
 * @param url The URL to load
 * @return The results of loading the URL, as a blob
 */
export function fetchIMG(url: string): Promise<any> {
  return fetch(url).then((response) => {
    if (response.ok) {
      return response.blob();
    }
    throw new Error('Network response was not OK.');
  }).then((blob) => {
    return URL.createObjectURL(blob);
  }).catch((error) => {
    console.log('Fetch image error: ' + error.message);
  });
}