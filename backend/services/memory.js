const memory = new Map();

export function getUserMemory(userId) {
    if (!memory.has(userId)) memory.set(userId, []);
    return memory.get(userId);
}

export function setUserName(userId, name) {
    const mem = getUserMemory(userId);
    mem.name = name;
}