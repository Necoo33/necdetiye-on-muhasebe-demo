import { fetchAllDatas, fetchOneDataById, updateDocument } from '../../../lib/firebase.js';
import { Worker } from 'worker_threads';

// burada eğer bir kayıd ödendi veya ödenmedi olarak işaretlenirse ona dair istatistikleri değişdir.

export async function POST(context){
    console.time("tebdil");

    let body = await context.request.json();

    console.log("body nesnesi: ", body);

    let getRecord = fetchOneDataById("records", body.id);
    let getAllStatistics = fetchAllDatas("statistics");

    let [record, allStatistics] = await Promise.all([getRecord, getAllStatistics]);

    allStatistics.sort(function(a, b){
        if(Number(a.id) > Number(b.id)){
            return 1
        } else {
            return -1
        }
    });

    console.log("Record Which subject to upgrade: ", record);

    let calculateKdv;

    if(record.taxRate === 20){
        calculateKdv = record.value * 0.20;
    } else if(record.taxRate === 18){
        calculateKdv = record.value * 0.18
    }else if(record.taxRate === 10){
        calculateKdv = record.value * 0.10;
    } else if(record.taxRate === 8){
        calculateKdv = record.value * 0.08;
    }else if(record.taxRate === 1){
        calculateKdv = record.value * 0.01;
    }

    let concurrentFetchActions = [];

    switch(record.completed){
        case true: 
            if(record.type === "serviceBuy" || record.type === "productBuy"){
                let changePayedTotalRevenueStatus1 = updateDocument("statistics", "5", { value: allStatistics[4].value - record.value });
                let changeUnpayedTotalRevenueStatus1 = updateDocument("statistics", "6", { value: allStatistics[5].value + record.value });

                let changePayedKdvTax = updateDocument("statistics", "23", { value: allStatistics[22].value - calculateKdv });
                let changeUnpayedKdvTax = updateDocument("statistics", "24", { value: allStatistics[23].value + calculateKdv });
    
                concurrentFetchActions.push(changePayedTotalRevenueStatus1);
                concurrentFetchActions.push(changeUnpayedTotalRevenueStatus1);
                concurrentFetchActions.push(changePayedKdvTax);
                concurrentFetchActions.push(changeUnpayedKdvTax);
            }

            if(record.type === "serviceSell" || record.type === "productSell"){
                let changePayedTotalRevenueStatus1 = updateDocument("statistics", "2", { value: allStatistics[1].value - record.value });
                let changeUnpayedTotalRevenueStatus1 = updateDocument("statistics", "3", { value: allStatistics[2].value + record.value });

                let changePayedKdvTax = updateDocument("statistics", "25", { value: allStatistics[24].value - calculateKdv });
                let changeUnpayedKdvTax = updateDocument("statistics", "26", { value: allStatistics[25].value + calculateKdv });
    
                concurrentFetchActions.push(changePayedTotalRevenueStatus1);
                concurrentFetchActions.push(changeUnpayedTotalRevenueStatus1);
                concurrentFetchActions.push(changePayedKdvTax);
                concurrentFetchActions.push(changeUnpayedKdvTax);
            }

            break;
        case false:
            if(record.type === "serviceBuy" || record.type === "productBuy"){
                let changePayedTotalRevenueStatus2 = updateDocument("statistics", "5", { value: allStatistics[4].value + record.value });
                let changeUnpayedTotalRevenueStatus2 = updateDocument("statistics", "6", { value: allStatistics[5].value - record.value });

                let changePayedKdvTax = updateDocument("statistics", "23", { value: allStatistics[22].value + calculateKdv });
                let changeUnpayedKdvTax = updateDocument("statistics", "24", { value: allStatistics[23].value - calculateKdv });
    
                concurrentFetchActions.push(changePayedTotalRevenueStatus2);
                concurrentFetchActions.push(changeUnpayedTotalRevenueStatus2);
                concurrentFetchActions.push(changePayedKdvTax);
                concurrentFetchActions.push(changeUnpayedKdvTax);
            }

            if(record.type === "serviceSell" || record.type === "productSell"){
                let changePayedTotalRevenueStatus2 = updateDocument("statistics", "2", { value: allStatistics[1].value + record.value });
                let changeUnpayedTotalRevenueStatus2 = updateDocument("statistics", "3", { value: allStatistics[2].value - record.value });

                let changePayedKdvTax = updateDocument("statistics", "25", { value: allStatistics[24].value + calculateKdv });
                let changeUnpayedKdvTax = updateDocument("statistics", "26", { value: allStatistics[25].value - calculateKdv });
    
                concurrentFetchActions.push(changePayedTotalRevenueStatus2);
                concurrentFetchActions.push(changeUnpayedTotalRevenueStatus2);
                concurrentFetchActions.push(changePayedKdvTax);
                concurrentFetchActions.push(changeUnpayedKdvTax);
            }


            break;
    }

    let changePaymentStatus = updateDocument("records", record.id, { completed: !record.completed });

    concurrentFetchActions.push(changePaymentStatus);

    await Promise.all(concurrentFetchActions);

    console.timeEnd("tebdil");
    
    return new Response(JSON.stringify({
        message: "Ödeme Statüsü Değişdirildi."
    }));
}