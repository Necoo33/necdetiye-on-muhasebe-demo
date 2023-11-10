export async function POST(context){
    let body = await context.request.json();

    return new Response(JSON.stringify({
        message: "Görülecek istatistik ayarları başarıyla değiştirildi."
    }))
}