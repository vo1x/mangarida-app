type Listener = (...args: any[]) => void;

const listeners: Map<string, Listener[]> = new Map();

export const emitAsyncStorageUpdated = () => {
  const asyncStorageListeners = listeners.get("AsyncStorageUpdated") || [];
  asyncStorageListeners.forEach((listener) => listener());
};

export const subscribeAsyncStorageUpdated = (listener: Listener) => {
  const asyncStorageListeners = listeners.get("AsyncStorageUpdated") || [];
  listeners.set("AsyncStorageUpdated", [...asyncStorageListeners, listener]);

  return () => {
    listeners.set(
      "AsyncStorageUpdated",
      asyncStorageListeners.filter((l) => l !== listener)
    );
  };
};
