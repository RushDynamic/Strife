export async function updateUserKeyPair(account, localStorageKey) {
    try {
        account.localStorageKey = localStorageKey;
        await account.save();
        return true;
    }
    catch (err) {
        console.log("An error occured while saving keys to DB:", err.toString());
        return false;
    }
}