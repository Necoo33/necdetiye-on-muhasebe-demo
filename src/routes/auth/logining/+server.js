import { redirect, json } from "@sveltejs/kit";
import { fetchDatasWithFiltering } from "../../../lib/firebase";
import { decrypt4 } from "necdetiye-crypto";
import jwt from "jsonwebtoken";

let { sign } = jwt;

export async function POST(context){
    console.log("our context object: ", context);

    let body = await context.request.json();

    console.log("our body object: ", body);

    let getUserObject = await fetchDatasWithFiltering("users", "nickname", "==", body.nickname);

    console.log("our user object: ", getUserObject);

    if(!getUserObject || getUserObject.length === 0 || getUserObject[0].nickname !== body.nickname){
        return json({ status: false, message: "Hata: Bu kullanıcı ismine sahip hiçbir kullanıcı yok." });
    };

    if(decrypt4(getUserObject[0].password, "asdfsdasfasdsfd") !== body.password){
        return json({ status: false, message: "Hata: Kullanıcı şifresi yanlış." });
    };

    let userObj = {
        nickname: getUserObject[0].nickname,
        email: getUserObject[0].email,
        role: getUserObject[0].role
    }

    let jwtToken = sign({ "nickname": userObj.nickname,
                          "email": userObj.email,
                          "role": userObj.role }, "kfnlksdfhvnkjhsdfkgjs", { expiresIn: "100 days" });

    context.cookies.set("imom-auth-token", jwtToken);

    return new Response(JSON.stringify({
        status: 201,
        headers: {
            "Content-Type": "application/json"
        },
        body: { message: "successfull authentication", token: jwtToken }
    }));
};
