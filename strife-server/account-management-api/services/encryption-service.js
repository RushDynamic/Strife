export async function updateUserKeyPair(account, publicKey, privateKeyAccessStr) {
    try {
        account.publicKey = publicKey;
        account.privateKeyAccessStr = privateKeyAccessStr;
        await account.save();
        return true;
    }
    catch (err) {
        return false;
    }
}