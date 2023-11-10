import { deleteDocument, fetchDatasWithFiltering, fetchOneDataById } from '../../../lib/firebase.js';

export async function GET(context){
    let getSubjectUser = await fetchOneDataById("users", context.url.searchParams.get("subjectId"));

    if(getSubjectUser.nickname === "admin"){
        return new Response(JSON.stringify({
            status: 403,
            message: "Hata: admin kullanıcısı silinemez."
        }));
    };

    // gerçek nev'de aşşağıdaki if kod bloğu silinecek.

    //-------

    if(getSubjectUser.nickname === "moderator"){
        return new Response(JSON.stringify({
            status: 403,
            message: "Hata: Demo nev'inde moderatör hesabı silinemez."
        }));
    };

    //--------

    let getDeleter = await fetchDatasWithFiltering("users", "nickname", "==", context.url.searchParams.get("deleterNickname"));

    if(getDeleter[0].role === "moderator" && getSubjectUser.role === "admin"){
        return new Response(JSON.stringify({
            status: 401,
            message: "Hata: Moderatör Rütbeli Kullanıcılar Adminleri Silemez."
        }));
    };

    await deleteDocument("users", getSubjectUser.id);

    return new Response(JSON.stringify({
        status: 201,
        message: "Kullanıcı Muvaffakiyetle Silindi.",
    }));
}