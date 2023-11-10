import { redirect } from '@sveltejs/kit';

export async function GET(context){
    console.log("context çerezler: ", context.cookies);

    context.cookies.delete("imom-auth-token", { path: "/", sameSite: "lax" });

    throw redirect(302, "/");
};