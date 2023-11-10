import { fetchOneDataById, updateDocument } from '../../../lib/firebase.js';

export async function POST(context){
    let body = await context.request.json();

    let getStock = await fetchOneDataById("records", body.id);

    let decreasingTheStockAmount = getStock.quantity - body.decreaseAmount;

    await updateDocument("records", body.id, { quantity: decreasingTheStockAmount });

    return new Response(JSON.stringify({
        message: "stok mikdarı değişdirildi.",
        remainedAmount: decreasingTheStockAmount
    }));
};