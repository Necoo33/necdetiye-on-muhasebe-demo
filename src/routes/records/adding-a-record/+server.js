import { addDocument, updateDocument, fetchOneDataById, fetchAllDatas, fetchDatasWithFiltering } from '../../../lib/firebase.js';

// şimdi, burayı yazarken şu elharizmî'yi takib et:

// evvela, eğer body'nin "customerType" unsurunun değeri "not selected on front-end"
// ise kullanıcı nesnesini celb et ve oradan customerType'ı al.

// daha sonra body'nin "type" unsurunun aldığı değere göre alakalı istatistik dökümanını
// tecdid et. Eğer "serviceBuy" ise Hizmet Alımı, eğer "serviceSell" ise Hizmet Satımı, eğer "productBuy"
// ise Mal Alımı ve eğer "productSell" ise Mal Satımı değerlerine body nesnesinin value değerini
// eklemek suretiyle onu tecdid et.

// eğer body'nin "type" unsuru "serviceBuy" veya "productBuy" ise toplam gider dökümanını, "serviceSell" veya
// "productSell" ise toplam gelir dökümanını value değerini eklemek suretiyle tecdid et.

// eğer body'nin "tax" unsuru boş string ise şunu yap:

// 1 - eğer "type" unsuru "serviceBuy" veya "productBuy" ise "indirilecek kdv" sütununa

// 2 - eğer "type" unsuru "serviceSell" veya "productSell" ise "eklenecek kdv" sütununa

// value değerini taxRate değerine bölerek neticeyi ekle.

// BURAYA KADAR YAPILDI. ŞİMDİ ŞUNLARI YAP:

// "body"nin "paymentType" nesnesine göre şu muamelatı yap:

// nakid, kredi kartı, banka, çek veya sened değerlerinden biri gelecek, bunlardan
// hangisi gelirse bunlarla alakalı sahalardan biri seçilecek. Mesela şöyle olacak:

// eğer "paymentType" değeri "credit card" ise ve "type" unsuru "serviceBuy" veya "productBuy" ise
// kredi kartı giderleri dökümanına "value" değerini ekleyerek güncelle.

//

export async function POST(context){
    console.time("9 müvazi muamele");
    let body = await context.request.json();

    console.log("our body object: ", body);

    console.time("temel danişleri toplama"); // 200 - 300 milisaniye felan sürüyor.
    // let getAllStatistics = await fetchAllDatas("statistics");
    let statistics = fetchAllDatas("statistics");
    let records = fetchAllDatas("records");

    let [getAllStatistics, allRecords] = await Promise.all([statistics, records]);

    // --- imalat nev'inde sil.

    if(allRecords.length >= 50){
        return new Response(JSON.stringify({
            status: 403,
            message: "Bu sürüm demo sürümü olduğu için 50'den fazla kayıd eklenemez."
        }));
    }

    // ---

    getAllStatistics.sort(function(a, b){
        if(Number(a.id) > Number(b.id)){
            return 1
        } else {
            return -1
        }
    });

    let finalCustomerType = "";

    if(body.customerType === "not selected on front-end"){
        let getCustomerObject = await fetchDatasWithFiltering("customers", "customerName", "==", body.customer);
        finalCustomerType = getCustomerObject[0].customerType;
    } else {
        finalCustomerType = body.customerType;
    }

    console.timeEnd("temel danişleri toplama");

    let concurrentFetchActions = [];

    let calculateKdv;

    if(body.taxRate === 20){
        calculateKdv = body.value * 0.20;
    } else if(body.taxRate === 18){
        calculateKdv = body.value * 0.18
    }else if(body.taxRate === 10){
        calculateKdv = body.value * 0.10;
    } else if(body.taxRate === 8){
        calculateKdv = body.value * 0.08;
    }else if(body.taxRate === 1){
        calculateKdv = body.value * 0.01;
    }

    switch(body.type){
        case "serviceBuy":
            let updatingServiceBuy = updateDocument("statistics", "7", { value: getAllStatistics[6].value + body.value });
            let incrementTotalCost1 = updateDocument("statistics", "4", { value: getAllStatistics[3].value + body.value });
            let addKdvTax1 = updateDocument("statistics", "21", { value: getAllStatistics[20].value + (/*body.value * body.taxRate / 100*/calculateKdv) });

            if(body.completed){
                let updateCompletedServiceBuy = updateDocument("statistics", "5", { value: getAllStatistics[4].value + body.value });
                let addCompletedKdvTax = updateDocument("statistics", "23", { value: getAllStatistics[22].value + calculateKdv });

                concurrentFetchActions.push(updateCompletedServiceBuy);
                concurrentFetchActions.push(addCompletedKdvTax);
            } else {
                let updateUnCompletedServiceBuy = updateDocument("statistics", "6", { value: getAllStatistics[5].value + body.value });
                let addUnCompletedKdvTax1 = updateDocument("statistics", "24", { value: getAllStatistics[23].value + calculateKdv });

                concurrentFetchActions.push(updateUnCompletedServiceBuy);
                concurrentFetchActions.push(addUnCompletedKdvTax1);
            }

            switch(body.paymentType){
                case "cash":
                    let updatingCashCosts1 = updateDocument("statistics", "12", { value: getAllStatistics[11].value + body.value });

                    concurrentFetchActions.push(updatingCashCosts1);
                    break;
                case "credit card":
                    let updatingCreditCardCosts1 = updateDocument("statistics", "14", { value: getAllStatistics[13].value + body.value });

                    concurrentFetchActions.push(updatingCreditCardCosts1);
                    break;
                case "bank":
                    let updatingBankCosts1 = updateDocument("statistics", "16", { value: getAllStatistics[15].value + body.value });

                    concurrentFetchActions.push(updatingBankCosts1);
                    break;
                case "check":
                    let updatingCheckCosts1 = updateDocument("statistics", "18", { value: getAllStatistics[17].value + body.value });

                    concurrentFetchActions.push(updatingCheckCosts1);
                    break;
                case "promissory note":
                    let updatingPromissoryNoteCosts1 = updateDocument("statistics", "20", { value: getAllStatistics[19].value + body.value });

                    concurrentFetchActions.push(updatingPromissoryNoteCosts1);
                    break;
            }

            concurrentFetchActions.push(updatingServiceBuy);
            concurrentFetchActions.push(incrementTotalCost1);
            concurrentFetchActions.push(addKdvTax1);
            break;
        case "serviceSell":
            let updatingServiceSell = updateDocument("statistics", "8", { value: getAllStatistics[7].value + body.value });
            let incrementTotalRevenue1 = updateDocument("statistics", "1", { value: getAllStatistics[0].value + body.value });
            let addKdvTax2 = updateDocument("statistics", "22", { value: getAllStatistics[21].value + (/*body.value * body.taxRate / 100*/calculateKdv) })

            if(body.completed){
                let updateCompletedServiceSell = updateDocument("statistics", "2", { value: getAllStatistics[1].value + body.value });
                let addCompletedKdvTax = updateDocument("statistics", "25", { value: getAllStatistics[24].value + calculateKdv });

                concurrentFetchActions.push(updateCompletedServiceSell);
                concurrentFetchActions.push(addCompletedKdvTax);
            } else {
                let updateUnCompletedServiceSell = updateDocument("statistics", "3", { value: getAllStatistics[2].value + body.value });
                let addUnCompletedKdvTax = updateDocument("statistics", "26", { value: getAllStatistics[25].value + calculateKdv });

                concurrentFetchActions.push(updateUnCompletedServiceSell);
                concurrentFetchActions.push(addUnCompletedKdvTax);
            }

            switch(body.paymentType){
                case "cash":
                    let updatingCashProfits1 = updateDocument("statistics", "11", { value: getAllStatistics[10].value + body.value });

                    concurrentFetchActions.push(updatingCashProfits1);
                    break;
                case "credit card":
                    let updatingCreditCardProfits1 = updateDocument("statistics", "13", { value: getAllStatistics[12].value + body.value });

                    concurrentFetchActions.push(updatingCreditCardProfits1);
                    break;
                case "bank":
                    let updatingBankProfits1 = updateDocument("statistics", "15", { value: getAllStatistics[14].value + body.value });

                    concurrentFetchActions.push(updatingBankProfits1);
                    break;
                case "check":
                    let updatingCheckProfits1 = updateDocument("statistics", "17", { value: getAllStatistics[16].value + body.value });

                    concurrentFetchActions.push(updatingCheckProfits1);
                    break;
                case "promissory note":
                    let updatingPromissoryNoteProfits1 = updateDocument("statistics", "19", { value: getAllStatistics[18].value + body.value });

                    concurrentFetchActions.push(updatingPromissoryNoteProfits1);
                    break;
            }

            concurrentFetchActions.push(updatingServiceSell);
            concurrentFetchActions.push(incrementTotalRevenue1);
            concurrentFetchActions.push(addKdvTax2);
            break;
        case "productBuy":
            let updatingProductBuy = updateDocument("statistics", "9", { value: getAllStatistics[8].value + body.value });
            let incrementTotalCost2 = updateDocument("statistics", "4", { value: getAllStatistics[3].value + body.value });
            let addKdvTax3 = updateDocument("statistics", "21", { value: getAllStatistics[20].value + (/*body.value * body.taxRate / 100*/calculateKdv)})

            if(body.completed){
                let updateCompletedProductBuy = updateDocument("statistics", "5", { value: getAllStatistics[4].value + body.value });
                let addCompletedKdvTax = updateDocument("statistics", "23", { value: getAllStatistics[22].value + calculateKdv });

                concurrentFetchActions.push(updateCompletedProductBuy);
                concurrentFetchActions.push(addCompletedKdvTax);
            } else {
                let updateUnCompletedProductBuy = updateDocument("statistics", "6", { value: getAllStatistics[5].value + body.value });
                let addUnCompletedKdvTax = updateDocument("statistics", "24", { value: getAllStatistics[23].value + calculateKdv });

                concurrentFetchActions.push(updateUnCompletedProductBuy);
                concurrentFetchActions.push(addUnCompletedKdvTax);
            }

            switch(body.paymentType){
                case "cash":
                    let updatingCashCosts1 = updateDocument("statistics", "12", { value: getAllStatistics[11].value + body.value });

                    concurrentFetchActions.push(updatingCashCosts1);
                    break;
                case "credit card":
                    let updatingCreditCardCosts1 = updateDocument("statistics", "14", { value: getAllStatistics[13].value + body.value });

                    concurrentFetchActions.push(updatingCreditCardCosts1);
                    break;
                case "bank":
                    let updatingBankCosts1 = updateDocument("statistics", "16", { value: getAllStatistics[15].value + body.value });

                    concurrentFetchActions.push(updatingBankCosts1);
                    break;
                case "check":
                    let updatingCheckCosts1 = updateDocument("statistics", "18", { value: getAllStatistics[17].value + body.value });

                    concurrentFetchActions.push(updatingCheckCosts1);
                    break;
                case "promissory note":
                    let updatingPromissoryNoteCosts1 = updateDocument("statistics", "20", { value: getAllStatistics[19].value + body.value });

                    concurrentFetchActions.push(updatingPromissoryNoteCosts1);
                    break;
            }

            concurrentFetchActions.push(updatingProductBuy);
            concurrentFetchActions.push(incrementTotalCost2);
            concurrentFetchActions.push(addKdvTax3);
            break;
        case "productSell":
            let updatingProductSell = updateDocument("statistics", "10", { value: getAllStatistics[9].value + body.value });
            let incrementTotalRevenue2 = updateDocument("statistics", "1", { value: getAllStatistics[0].value + body.value });
            let addKdvTax4 = updateDocument("statistics", "22", { value: getAllStatistics[21].value + (/*body.value * body.taxRate / 100*/calculateKdv) })

            if(body.completed){
                let updateCompletedProductSell = updateDocument("statistics", "2", { value: getAllStatistics[1].value + body.value });
                let addCompletedKdvTax = updateDocument("statistics", "25", { value: getAllStatistics[24].value + calculateKdv });

                concurrentFetchActions.push(updateCompletedProductSell);
                concurrentFetchActions.push(addCompletedKdvTax);
            } else {
                let updateUnCompletedProductSell = updateDocument("statistics", "3", { value: getAllStatistics[2].value + body.value });
                let addUnCompletedKdvTax = updateDocument("statistics", "26", { value: getAllStatistics[25].value + calculateKdv });

                concurrentFetchActions.push(updateUnCompletedProductSell);
                concurrentFetchActions.push(addUnCompletedKdvTax);
            }

            switch(body.paymentType){
                case "cash":
                    let updatingCashProfits1 = updateDocument("statistics", "11", { value: getAllStatistics[10].value + body.value });

                    concurrentFetchActions.push(updatingCashProfits1);
                    break;
                case "credit card":
                    let updatingCreditCardProfits1 = updateDocument("statistics", "13", { value: getAllStatistics[12].value + body.value });

                    concurrentFetchActions.push(updatingCreditCardProfits1);
                    break;
                case "bank":
                    let updatingBankProfits1 = updateDocument("statistics", "15", { value: getAllStatistics[14].value + body.value });

                    concurrentFetchActions.push(updatingBankProfits1);
                    break;
                case "check":
                    let updatingCheckProfits1 = updateDocument("statistics", "17", { value: getAllStatistics[16].value + body.value });

                    concurrentFetchActions.push(updatingCheckProfits1);
                    break;
                case "promissory note":
                    let updatingPromissoryNoteProfits1 = updateDocument("statistics", "19", { value: getAllStatistics[18].value + body.value });

                    concurrentFetchActions.push(updatingPromissoryNoteProfits1);
                    break;
            }

            concurrentFetchActions.push(updatingProductSell);
            concurrentFetchActions.push(incrementTotalRevenue2);
            concurrentFetchActions.push(addKdvTax4);
            break;
    }

    let recordObj = {
        customer: body.customer,
        customerType: finalCustomerType,
        type: body.type,
        name: body.name,
        quantity: body.quantity,
        baseQuantity: body.quantity,
        date: body.date,
        value: body.value,
        gtip: body.gtip,
        taxRate: body.taxRate,
        paymentType: body.paymentType,
        completed: body.completed,
        description: body.description
    }

    let addingRecordToDatabase = addDocument("records", recordObj);
    concurrentFetchActions.push(addingRecordToDatabase);

    console.time("nihaî fetch muamelatı");
    await Promise.all(concurrentFetchActions); // bu muamelat takribî 400 milisaniye sürüyor.
    console.timeEnd("nihaî fetch muamelatı");

    console.timeEnd("9 müvazi muamele");
    return new Response(JSON.stringify({
        status: 201,
        message: "Başarıyla Kaydı eklediniz!"
    }));
}