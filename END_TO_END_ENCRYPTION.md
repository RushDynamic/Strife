# How does the end-to-end encryption work?

Strife uses a combination of symmetric and asymmetric encryption to ensure that end-to-end encryption is maintained.

Registration
-------------
During the time of registration, Elliptic Curve Cryptography (Curve25519-XSalsa20-Poly1305) is used to generate a public-private keypair (publicKey & privateKey).
The privateKey is then symmetrically encrypted (xsalsa20-poly1305) with a newly generated key known as the secureStorageKey. This key is then encrypted using the user's password, resulting in encryptedSecureStorageKey
The secureStorageKey is then stored in plain-text in the browser's localStorage. The publicKey, encryptedPrivateKey, and encryptedSecureStorageKey is stored at the server during the registration process.

Login
-----
During the time of login, the upon successful authentication, the server will return the stored publicKey, encryptedPrivateKey, and the encryptedSecureStorageKey. The encryptedSecureStorageKey is then decrypted using the user's password (which is available as plain-text during login), giving us the original secureStorageKey. Subsequently, the encryptedPrivateKey is also decrypted using the newly decrypted secureStorageKey. The secureStorageKey is then stored in the browser's localStorage for future use.

JWT Authorization
-----------------
Since this is a browser-based application, the state is lost every time the page is reloaded. Without some form of authorization, the user will be forced to enter their credentials whenever the page is reloaded. To work around this, I have introduced JWT authorization which uses a pair of access and refresh tokens to authorize the user. Basically, every time the page is reloaded, we hit an endpoint on the server that validates the JWT tokens to authorize the user and also return the same encryption data that the login endpoint does (publicKey, encryptedPrivateKey). This encryptedPrivateKey can then be decrypted with the secureStorageKey that is present in the browser's localStorage. If this key is not available in localStorage, the user will be prompted to login again.

Purpose of secureStorageKey
---------------------------
The reason I introduced this seemingly redundant key is for the whole process to synergize with JWT authorization. Since we lose access to the user's plain-text password after the login process, we need a way to decrypt the encryptedPrivateKey during subsequent page reloads that are authorized using JWT (without the user's password). To work around this, we encrypt the privateKey with the secureStorageKey during registration and store the secureStorageKey in plain-text in our browser during the time of Login/Registration. The alternative to this is storing the privateKey itself in plain-text in localStorage (x).

Messaging
---------
Every message is encrypted at the client-side using the recipient's publicKey and the signed with the sender's privateKey before being sent to the server. Therefore, the server will never have access to the plain-text message, and only the intended recipient with the corresponding privateKey can decrypt it, thereby ensuring end-to-end encryption.
