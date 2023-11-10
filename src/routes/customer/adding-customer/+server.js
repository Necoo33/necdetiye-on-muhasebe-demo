import { addDocument, fetchAllDatas } from '../../../lib/firebase.js';
import { makeStringsFirstCharacterBig, makeStringsFirstCharacterBigEs6 } from '../../../lib/utils.js';

export async function POST(context){
    console.time("müşteri ekleme hızı");
    let body = await context.request.json();

    console.log("server'e gönderilen daniş'ler: ", body);

    let allCustomers = await fetchAllDatas("customers");

    if(allCustomers.length >= 10){
        return new Response(JSON.stringify({
            status: 403,
            message: "Bu sürüm bir demo sürümü olduğu için 10'dan fazla müşteri kaydı ekleyemezsiniz."
        }))
    }

    let customerObj = {
        customerName: makeStringsFirstCharacterBigEs6(body.customerName),
        customerAddress: makeStringsFirstCharacterBigEs6(body.customerAddress),
        customerTelephone: Number(body.customerTelephone),
        customerFax: Number(body.customerFax),
        customerEmail: body.customerEmail,
        customerType: body.customerType,
        customerTaxAdministration: body.customerTaxAdministration
    }

    await addDocument("customers", customerObj);

    console.timeEnd("müşteri ekleme hızı")
    return new Response(JSON.stringify({
        status: 201,
        message: "muvaffakiyetle müşteri eklediniz!"
    }))
}