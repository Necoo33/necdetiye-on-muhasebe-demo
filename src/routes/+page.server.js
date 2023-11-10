import { redirect } from '@sveltejs/kit';
import { checkToken } from '../lib/auth';

/** @type {import('./$types').PageLoad} */
export function load({ cookies }) {
    let token = checkToken(cookies);

    console.log(token);

    if(token.status){
        throw redirect(301, "/panel");
    };

    return {
        props: {
            data: "not authenticated"
        }
    }
};