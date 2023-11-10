import { fetchDatasWithFiltering, fetchOneDataById, updateDocument } from '../../../lib/firebase.js';

export async function POST(context){
    let body = await context.request.json();

    let [updater, subject] = await Promise.all([fetchDatasWithFiltering("users", "nickname", "==", body.upgraderNickname, "none"), fetchOneDataById("users", body.subjectUserId)]);

    if(subject.role === "admin"){
        return new Response(JSON.stringify({
            status: 403,
            message: "Hata: Adminlerin Rütbesi Yükseltilemez."
        }));
    };

    if(updater[0].role === "moderator"){
        return new Response(JSON.stringify({
            status: 403,
            message: "Hata: Moderatörler Rütbe Yükseltemez."           
        }));
    };

    await updateDocument("users", body.subjectUserId, { role: "admin" });

    return new Response(JSON.stringify({
        status: 201,
        message: "Kullanıcı'nın Rütbesi Muvaffakiyetle Yükseltildi."
    }));
};