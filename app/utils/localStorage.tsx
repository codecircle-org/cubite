export function getLocalStorage(key: string): string | null {
    if (typeof window !== 'undefined') {
      return window.localStorage.getItem(key);
    }
    return null;
  }
  
  export function setLocalStorage(key: string, value: string): void {
    if (typeof window !== 'undefined') {
      window.localStorage.setItem(key, value);
    }
  }