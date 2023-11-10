export async function POST(context){
    let body = await context.request.json();

    return new Promise(JSON.stringify({
        status: 200,
        message: "Başarıyla Muhasebe Kaydını Tecdid Etdiniz!"
    }))
}