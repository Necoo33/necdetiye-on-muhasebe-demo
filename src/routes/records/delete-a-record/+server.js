import { deleteDocument, fetchAllDatas, fetchOneDataById, updateDocument } from '../../../lib/firebase.js';

// burada ise "/record/adding-a-record" rotasında yapdığının tam tersini yapacaksın.
// yaparken aşşağıda getirdiğin 2 unsuru kullan.

export async function GET(context){
    console.time("delete record rotası müddeti");

    let recordId = context.url.searchParams.get("recordId");

    let allStatisticsPromise = fetchAllDatas("statistics");
    let getIndividualRecordPromise = fetchOneDataById("records", recordId);

    let [allStatistics, individualRecord] = await Promise.all([allStatisticsPromise, getIndividualRecordPromise]);

    console.log("bütün istatistikler: ", allStatistics);
    console.log("silinecek kayıd", individualRecord);

    allStatistics.sort(function(a, b){
        if(Number(a.id) > Number(b.id)){
            return 1
        } else {
            return -1
        }
    });

    let calculateKdv;

    if(individualRecord.taxRate === 20){
        calculateKdv = individualRecord.value * 0.20;
    } else if(individualRecord.taxRate === 18){
        calculateKdv = individualRecord.value * 0.18
    }else if(individualRecord.taxRate === 10){
        calculateKdv = individualRecord.value * 0.10;
    } else if(individualRecord.taxRate === 8){
        calculateKdv = individualRecord.value * 0.08;
    }else if(individualRecord.taxRate === 1){
        calculateKdv = individualRecord.value * 0.01;
    }

    let concurrentFetchActions = [];

    switch(individualRecord.type){
        case "serviceBuy":
            let updateTotalCost1 = updateDocument("statistics", "7", { value: allStatistics[6].value - individualRecord.value });
            let updateServiceBuy = updateDocument("statistics", "4", { value: allStatistics[3].value - individualRecord.value });
            let updateKdvTax1 = updateDocument("statistics", "21", { value: allStatistics[20].value - calculateKdv });

            if(individualRecord.completed){
                let updateCompletedServiceBuy = updateDocument("statistics", "5", { value: allStatistics[4].value - individualRecord.value });
                let updateCompletedKdvTax = updateDocument("statistics", "23", { value: allStatistics[22].value - calculateKdv });

                concurrentFetchActions.push(updateCompletedServiceBuy);
                concurrentFetchActions.push(updateCompletedKdvTax);
            } else {
                let updateCompletedServiceBuy = updateDocument("statistics", "6", { value: allStatistics[5].value - individualRecord.value });
                let updateUnCompletedKdvTax = updateDocument("statistics", "24", { value: allStatistics[23].value - calculateKdv });

                concurrentFetchActions.push(updateCompletedServiceBuy);
                concurrentFetchActions.push(updateUnCompletedKdvTax);
            }

            switch(individualRecord.paymentType){
                case "cash":
                    let updateCashCosts = updateDocument("statistics", "12", { value: allStatistics[11].value - individualRecord.value });

                    concurrentFetchActions.push(updateCashCosts);
                    break;
                case "credit card":
                    let updateCreditCardCosts = updateDocument("statistics", "14", { value: allStatistics[13].value - individualRecord.value });

                    concurrentFetchActions.push(updateCreditCardCosts);
                    break;
                case "bank":
                    let updateBankCosts = updateDocument("statistics", "16", { value: allStatistics[15].value - individualRecord.value });

                    concurrentFetchActions.push(updateBankCosts);
                    break;
                case "check":
                    let updatingCheckCosts = updateDocument("statistics", "18", { value: allStatistics[17].value - individualRecord.value });

                    concurrentFetchActions.push(updatingCheckCosts);
                    break;
                case "promissory note":
                    let updatingPromissoryNoteCosts = updateDocument("statistics", "20", { value: allStatistics[19].value - individualRecord.value });

                    concurrentFetchActions.push(updatingPromissoryNoteCosts);
                    break;
            }

            concurrentFetchActions.push(updateTotalCost1);
            concurrentFetchActions.push(updateServiceBuy);
            concurrentFetchActions.push(updateKdvTax1);
            break;
        case "serviceSell":
            let updateTotalRevenue1 = updateDocument("statistics", "8", { value: allStatistics[7].value - individualRecord.value });
            let updateServiceSell = updateDocument("statistics", "1", { value: allStatistics[0].value - individualRecord.value });
            let updateKdvTax2 = updateDocument("statistics", "22", { value: allStatistics[21].value - calculateKdv });

            if(individualRecord.completed){
                let updateCompletedServiceSell = updateDocument("statistics", "2", { value: allStatistics[1].value - individualRecord.value });
                let updateUnCompletedKdvTax = updateDocument("statistics", "25", { value: allStatistics[24].value - calculateKdv });

                concurrentFetchActions.push(updateCompletedServiceSell);
                concurrentFetchActions.push(updateUnCompletedKdvTax);
            } else {
                let updateUnCompletedServiceSell = updateDocument("statistics", "3", { value: allStatistics[2].value - individualRecord.value });
                let updateUnCompletedKdvTax = updateDocument("statistics", "26", { value: allStatistics[25].value - calculateKdv });

                concurrentFetchActions.push(updateUnCompletedServiceSell);
                concurrentFetchActions.push(updateUnCompletedKdvTax);
            }

            switch(individualRecord.paymentType){
                case "cash":
                    let updateCashProfits = updateDocument("statistics", "11", { value: allStatistics[10].value - individualRecord.value });

                    concurrentFetchActions.push(updateCashProfits);
                    break;
                case "credit card":
                    let updateCreditCardProfits = updateDocument("statistics", "13", { value: allStatistics[12].value - individualRecord.value });

                    concurrentFetchActions.push(updateCreditCardProfits);
                    break;
                case "bank":
                    let updateBankProfits = updateDocument("statistics", "15", { value: allStatistics[14].value - individualRecord.value });

                    concurrentFetchActions.push(updateBankProfits);
                    break;
                case "check":
                    let updateCheckProfits = updateDocument("statistics", "17", { value: allStatistics[16].value - individualRecord.value });

                    concurrentFetchActions.push(updateCheckProfits);
                    break;
                case "promissory note":
                    let updatePromissoryNoteProfits = updateDocument("statistics", "19", { value: allStatistics[18].value - individualRecord.value });

                    concurrentFetchActions.push(updatePromissoryNoteProfits);
                    break;
            }

            concurrentFetchActions.push(updateTotalRevenue1);
            concurrentFetchActions.push(updateServiceSell);
            concurrentFetchActions.push(updateKdvTax2);
            break;
        case "productBuy":
            let updateTotalCost2 = updateDocument("statistics", "9", { value: allStatistics[8].value - individualRecord.value });
            let updateProductBuy = updateDocument("statistics", "4", { value: allStatistics[3].value - individualRecord.value });
            let updateKdvTax3 = updateDocument("statistics", "21", { value: allStatistics[20].value - calculateKdv });

            if(individualRecord.completed){
                let updateCompletedProductBuy = updateDocument("statistics", "5", { value: allStatistics[4].value - individualRecord.value });
                let updateCompletedKdvTax = updateDocument("statistics", "23", { value: allStatistics[22].value - calculateKdv });

                concurrentFetchActions.push(updateCompletedProductBuy);
                concurrentFetchActions.push(updateCompletedKdvTax);
            } else {
                let updateUnCompletedProductBuy = updateDocument("statistics", "6", { value: allStatistics[5].value - individualRecord.value });
                let updateCompletedKdvTax = updateDocument("statistics", "24", { value: allStatistics[23].value - calculateKdv });

                concurrentFetchActions.push(updateUnCompletedProductBuy);
                concurrentFetchActions.push(updateCompletedKdvTax);
            }

            switch(individualRecord.paymentType){
                case "cash":
                    let updateCashCosts = updateDocument("statistics", "12", { value: allStatistics[11].value - individualRecord.value });

                    concurrentFetchActions.push(updateCashCosts);
                    break;
                case "credit card":
                    let updateCreditCardCosts = updateDocument("statistics", "14", { value: allStatistics[13].value - individualRecord.value });

                    concurrentFetchActions.push(updateCreditCardCosts);
                    break;
                case "bank":
                    let updateBankCosts = updateDocument("statistics", "16", { value: allStatistics[15].value - individualRecord.value });

                    concurrentFetchActions.push(updateBankCosts);
                    break;
                case "check":
                    let updatingCheckCosts = updateDocument("statistics", "18", { value: allStatistics[17].value - individualRecord.value });

                    concurrentFetchActions.push(updatingCheckCosts);
                    break;
                case "promissory note":
                    let updatingPromissoryNoteCosts = updateDocument("statistics", "20", { value: allStatistics[19].value - individualRecord.value });

                    concurrentFetchActions.push(updatingPromissoryNoteCosts);
                    break;
            }

            concurrentFetchActions.push(updateTotalCost2);
            concurrentFetchActions.push(updateProductBuy);
            concurrentFetchActions.push(updateKdvTax3);
            break;
        case "productSell":
            let updateTotalRevenue2 = updateDocument("statistics", "10", { value: allStatistics[9].value - individualRecord.value });
            let updateProductSell = updateDocument("statistics", "1", { value: allStatistics[0].value - individualRecord.value });
            let updateKdvTax4 = updateDocument("statistics", "22", { value: allStatistics[21].value - calculateKdv });

            if(individualRecord.completed){
                let updateCompletedProductSell = updateDocument("statistics", "2", { value: allStatistics[1].value - individualRecord.value });
                let updateUnCompletedKdvTax = updateDocument("statistics", "25", { value: allStatistics[24].value - calculateKdv });

                concurrentFetchActions.push(updateCompletedProductSell);
                concurrentFetchActions.push(updateUnCompletedKdvTax);
            } else {
                let updateUnCompletedProductSell = updateDocument("statistics", "3", { value: allStatistics[2].value - individualRecord.value });
                let updateUnCompletedKdvTax = updateDocument("statistics", "26", { value: allStatistics[25].value - calculateKdv });

                concurrentFetchActions.push(updateUnCompletedProductSell);
                concurrentFetchActions.push(updateUnCompletedKdvTax);
            }

            switch(individualRecord.paymentType){
                case "cash":
                    let updateCashProfits = updateDocument("statistics", "11", { value: allStatistics[10].value - individualRecord.value });

                    concurrentFetchActions.push(updateCashProfits);
                    break;
                case "credit card":
                    let updateCreditCardProfits = updateDocument("statistics", "13", { value: allStatistics[12].value - individualRecord.value });

                    concurrentFetchActions.push(updateCreditCardProfits);
                    break;
                case "bank":
                    let updateBankProfits = updateDocument("statistics", "15", { value: allStatistics[14].value - individualRecord.value });

                    concurrentFetchActions.push(updateBankProfits);
                    break;
                case "check":
                    let updateCheckProfits = updateDocument("statistics", "17", { value: allStatistics[16].value - individualRecord.value });

                    concurrentFetchActions.push(updateCheckProfits);
                    break;
                case "promissory note":
                    let updatePromissoryNoteProfits = updateDocument("statistics", "19", { value: allStatistics[18].value - individualRecord.value });

                    concurrentFetchActions.push(updatePromissoryNoteProfits);
                    break;
            }

            concurrentFetchActions.push(updateTotalRevenue2);
            concurrentFetchActions.push(updateProductSell);
            concurrentFetchActions.push(updateKdvTax4);
            break;
    }

    let deletingTheDoc = deleteDocument("records", individualRecord.id);

    concurrentFetchActions.push(deletingTheDoc);

    await Promise.all(concurrentFetchActions);

    console.timeEnd("delete record rotası müddeti");
    return new Response(JSON.stringify({
        status: 200,
        message: "Başarıyla Muhasebe Kaydını Sildiniz!"
    }))
}