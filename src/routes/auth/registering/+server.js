import { addDocument, fetchAllDatas, fetchDatasWithFiltering } from '../../../lib/firebase.js';
import { encrypt4 } from 'necdetiye-crypto';

export async function POST(context){
    let body = await context.request.json();

    let getAllUsers = await fetchAllDatas("users");

    if(getAllUsers.length > 3){
        return new Response(JSON.stringify({
            message: "Hata: Demo ve Şahsî nev'lerde 3'den fazla kullanıcı bulunamaz."
        }));
    };

    let tryToGetSameNickname = fetchDatasWithFiltering("users", "nickname", "==", body.nickname);
    let tryToGetSameEmail = fetchDatasWithFiltering("users", "email", "==", body.email);

    let [sameNickname, sameEmail] = await Promise.all([tryToGetSameNickname, tryToGetSameEmail]);

    console.log(sameNickname, sameEmail);

    if(sameNickname.length > 0){
        return new Response(JSON.stringify({
            message: "Hata: aynı kullanıcı ismi kayıdlıdır."
        }));
    };

    if(sameEmail.length > 0){
        return new Response(JSON.stringify({
            message: "Hata: aynı e-posta adresi kayıdlıdır."
        }));
    };

    let userObj = {
        nickname: body.nickname,
        password: encrypt4(body.password, "asdfsdasfasdsfd"),
        email: body.email,
        role: body.role
    };

    await addDocument("users", userObj);

    return new Response(JSON.stringify({
        message: "Muvaffakiyetle Kullanıcı'yı eklediniz."
    }))
}