import { fetchDatasWithFiltering, fetchOneDataById, updateDocument } from '../../../lib/firebase.js'
import { encrypt4 } from 'necdetiye-crypto';

export async function POST(context){
    let body = await context.request.json()

    let [getUpdater, getSubject] = await Promise.all([fetchDatasWithFiltering("users", "nickname", "==", body.updaterName), fetchDatasWithFiltering("users", "nickname", "==", body.subjectName)]);

    if(getUpdater[0].role === "moderator" && getSubject[0].role === "admin"){
        return new Response(JSON.stringify({
            status: 403,
            message: "Hata: Moderatörler Adminlerin Bilgilerini Güncelleyemez."
        }));
    };

    let newUpdateObject = {};

    for(let [key, value] of Object.entries(body)){
        if(key !== "updaterName" && key !== "subjectName" && key !== "role"){
            if(key === "password"){
                newUpdateObject[key] = encrypt4(value, "asdfsdasfasdsfd")
            } else {
                newUpdateObject[key] = value;
            }
        };
    };
    
    // aşşağıdaki kodlar sadece demo nev'inde mevcud olacakdır:

    //------------

    if((getSubject.nickname === "admin" || getSubject.nickname === "moderator") && newUpdateObject.nickname !== ""){
        return new Response(JSON.stringify({
            status: 403,
            message: "Hata: Demo Sürümünde 'admin' veya 'moderator' kullanıcılarının kullanıcı ismi değiştirilemez."
        }));
    };

    //----------

    await updateDocument("users", getSubject[0].id, newUpdateObject);

    return new Response(JSON.stringify({
        status: 201,
        message: "Kullanıcı Güncellendi."
    }));
}