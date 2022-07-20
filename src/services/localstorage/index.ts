const getLocalStorage = () => {
  if (typeof window === 'undefined' || typeof (Storage) === 'undefined') {
    throw Error('Local Storage is not available, either on server side or browser is not supported.');
  }

  return window.localStorage;
};

const localStorage = {
  setItem: (key: string, value: string): void => getLocalStorage().setItem(key, value),
  getItem: (key: string): string | null => getLocalStorage().getItem(key),
  removeItem: (key: string): void => getLocalStorage().removeItem(key),
  clear: (): void => getLocalStorage().clear(),
  key: (index: number): string | null => getLocalStorage().key(index)
};

export default localStorage;

export enum StorageKey {
  USER = 'user',
  FAVORITE_FRUIT = 'favoriteFruit'
}