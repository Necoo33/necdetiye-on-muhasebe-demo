import { redirect } from '@sveltejs/kit';
import { decode, verify } from 'jsonwebtoken';
import { checkToken } from '../../lib/auth';

// bu sahife sayesinde kullanıcı nesnesi dahildeki bütün rotalardan kabil-i visal oluyor.

/** @type {import('./$types').PageLoad} */
export function load({url, request, cookies}) {
    let token = checkToken(cookies);
    let user = null;

    if(!token.status){
        console.log("url object: ", url);
        console.log("our cookie: ", url.searchParams.get("token"))
    
        let ourToken = url.searchParams.get("token");
    
        if(!ourToken){
            throw redirect(303, "/?error=unauthorized");
        };
    
        let verifyToken = verify(ourToken, "kfnlksdfhvnkjhsdfkgjs");
    
        if(!verifyToken){
            throw redirect(303, "/?error=malformedtoken");
        };
    
        user = decode(ourToken);
    
        cookies.set("imom-auth-token", ourToken);
    
        console.log("/panel server side user obj: ", user);
    } else {
        user = token.user;
    }

    return {
        props: {
            data: user
        }
    }
}