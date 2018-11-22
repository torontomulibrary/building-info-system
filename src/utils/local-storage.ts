const storage = window.localStorage;

export function set(key: string, value: any): Promise<void> {
  return new Promise((resolve, reject) => {
    try {
      if (storage) {
        storage.setItem(key, JSON.stringify(value));
      }
      resolve();
    } catch (err) {
      reject(`Couldnt store object ${err}`);
    }
  });
}

export function remove(key: string): Promise<void> {
  return new Promise((resolve, reject) => {
    try {
      if (storage) {
        storage.removeItem(key);
      }
      resolve();
    } catch (err) {
      reject(`Couldnt remove object ${err}`);
    }
  });
}

export function get(key: string): Promise<any> {
  return new Promise((resolve, reject) => {
    try {
      if (storage) {
        const item = storage.getItem(key);
        if (item) {
          resolve(JSON.parse(item));
        }
        resolve(undefined);
      }
      resolve(undefined);
    } catch (err) {
      reject(`Couldnt get object: ${err}`);
    }
  });
}
