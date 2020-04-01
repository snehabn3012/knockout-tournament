export const getStoreItem = itemName => localStorage.getItem(itemName);

export const setStoreItem = ( itemName, data ) => {
    localStorage.setItem(itemName, data);
}

export const getStoreCollection = itemName => JSON.parse(getStoreItem(itemName));

export const setStoreCollection = (itemName, data) => {
    setStoreItem(itemName, JSON.stringify(data));
}

export const removeStoreItem = itemName => {
    localStorage.removeItem(itemName);
}

export const clearStorage = () => {
    localStorage.clear();
}