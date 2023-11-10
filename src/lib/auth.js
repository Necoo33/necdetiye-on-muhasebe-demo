import { verify, decode } from "jsonwebtoken";

export function checkToken(cookies){
    let authToken = cookies.get("imom-auth-token");

    if(!authToken){
        return { status: false, user: null };
    };

    console.log("our auth cookie: ", authToken);

    let verifyToken = verify(authToken, "kfnlksdfhvnkjhsdfkgjs");

    if(!verifyToken){
        return { status: false, user: null };
    };

    return { status: true, user: decode(authToken) };
};