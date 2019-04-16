let storage: Storage | undefined;
try {
  storage = window.localStorage;
} catch (e) {
  // Just here to prevent a blow-up in puppeteer.
}

export function set(key: string, value: any): Promise<void> {
  key = `rl.ls.${key}`;

  return new Promise((resolve, reject) => {
    try {
      if (storage) {
        storage.setItem(key, JSON.stringify(value));
        resolve();
      }
    } catch (err) {
      reject(`Couldnt store object ${err}`);
    }
  });
}

export function remove(key: string): Promise<void> {
  key = `rl.ls.${key}`;

  return new Promise((resolve, reject) => {
    try {
      if (storage !== undefined) {
        storage.removeItem(key);
        resolve();
      }
    } catch (err) {
      reject(`Couldnt remove object ${err}`);
    }
  });
}

export function get(key: string): Promise<any | undefined> {
  key = `rl.ls.${key}`;

  return new Promise((resolve, reject) => {
    try {
      if (storage) {
        const item = storage.getItem(key);

        if (item !== null) {
          resolve(JSON.parse(item));
        }

        resolve(undefined);
      }
    } catch (err) {
      reject(`Couldnt get object: ${err}`);
    }
  });
}
