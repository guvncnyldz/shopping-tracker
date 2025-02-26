const STORAGE_KEY = "auth_user";
const EXPIRE_TIME = 7 * 24 * 60 * 60 * 1000;

export function setAuth(user) {
    const data = {
        id: user.id,
        username: user.username,
        home_id: user.home_id,
        expiresAt: Date.now() + EXPIRE_TIME
    };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
}

export function removeAuth()
{
    localStorage.removeItem(STORAGE_KEY)
}
export function getAuth() {
    const data = localStorage.getItem(STORAGE_KEY);

    if (!data) return null;

    const parsedData = JSON.parse(data);
    if (Date.now() > parsedData.expiresAt) {
        localStorage.removeItem(STORAGE_KEY);
        return null;
    }

    // Süreyi uzat
    parsedData.expiresAt = Date.now() + EXPIRE_TIME;
    localStorage.setItem(STORAGE_KEY, JSON.stringify(parsedData));

    return parsedData;
}