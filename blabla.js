import { encrypt4, decrypt4 } from "necdetiye-crypto";

let encrypted = encrypt4("12345678", "asdfsdasfasdsfd");

console.log("encrypted text: ", encrypted);

let decrypted = decrypt4(encrypted, "asdfsdasfasdsfd");

console.log("decrypted text: ", decrypted);