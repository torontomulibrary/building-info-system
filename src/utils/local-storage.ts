const storage = window.localStorage;

export function set(key: string, value: any): Promise<void> {
  return new Promise((resolve, reject) => {
    try {
      storage.setItem(key, JSON.stringify(value));
      resolve();
    } catch (err) {
      reject(`Couldnt store object ${err}`);
    }
  });
}

export function remove(key: string): Promise<void> {
  return new Promise((resolve, reject) => {
    try {
      storage.removeItem(key);
      resolve();
    } catch (err) {
      reject(`Couldnt remove object ${err}`);
    }
  });
}

export function get(key: string): Promise<any | undefined> {
  return new Promise((resolve, reject) => {
    try {
      const item = storage.getItem(key);

      if (item !== null) {
        resolve(JSON.parse(item));
      }

      resolve(undefined);
    } catch (err) {
      reject(`Couldnt get object: ${err}`);
    }
  });
}
