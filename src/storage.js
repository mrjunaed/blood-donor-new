// localStorage-based storage implementation for the app
const storage = {
  async list(prefix, includeValues) {
    const keys = [];
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key.startsWith(prefix)) {
        keys.push(key);
      }
    }
    
    if (includeValues) {
      const values = keys.map(key => ({
        key,
        value: localStorage.getItem(key)
      }));
      return { keys, values };
    }
    
    return { keys };
  },

  async get(key, includeValues) {
    const value = localStorage.getItem(key);
    if (!value) return null;
    return { key, value };
  },

  async set(key, value, flag) {
    localStorage.setItem(key, value);
    return { ok: true };
  }
};

window.storage = storage;
