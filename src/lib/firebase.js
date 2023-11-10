import { initializeApp } from "firebase/app";
import { getFirestore, collection, getDoc, getDocs, setDoc, addDoc, deleteDoc, query, where, doc, updateDoc, orderBy, onSnapshot, limit } from "firebase/firestore";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
    apiKey: import.meta.env.VITE_API_KEY,
    authDomain: import.meta.env.VITE_AUTH_DOMAIN,
    projectId: import.meta.env.VITE_PROJECT_ID,
    storageBucket: import.meta.env.VITE_STORAGE_BUCKET,
    messagingSenderId: import.meta.env.VITE_MESSAGING_SENDER_ID,
    appId: import.meta.env.VITE_APP_ID,
    measurementId: import.meta.env.VITE_MEASUREMENT_ID
};

let firebaseInit = initializeApp(firebaseConfig);

let firestore = getFirestore(firebaseInit);
let storage = getStorage(firebaseInit);

export async function fetchAllDatas(collectionName){
    let colref = collection(firestore, collectionName)

    let allDatas = [];

    let getAllDocs = await getDocs(colref);

    for(let i = 0; i < getAllDocs.docs.length; i++){
        let newObj = {};
        newObj.id = getAllDocs.docs[i].id;
        
        for(let [key, value] of Object.entries(getAllDocs.docs[i].data())){
            newObj[key] = value;
        }

        allDatas.push(newObj);
    }

    return allDatas;
}

export async function fetchAllDatasWithLimit(collectionName, fetchLimit = 10){
    let colref = collection(firestore, collectionName)

    let ourQuery = query(colref, limit(fetchLimit))

    let allDatas = [];

    let getAllDocs = await getDocs(ourQuery);

    for(let i = 0; i < getAllDocs.docs.length; i++){
        let newObj = {};
        newObj.id = getAllDocs.docs[i].id;
        
        for(let [key, value] of Object.entries(getAllDocs.docs[i].data())){
            newObj[key] = value;
        }

        allDatas.push(newObj);
    }

    return allDatas;
}

export function fetchAllDatasSnapshot(collectionName) {
    let colRef = collection(db, collectionName);
    
    let allDatas = [];
    
    const unsub = onSnapshot(colRef, function(querySnapshot){
        allDatas = [];

        for(let i = 0; i < querySnapshot.size; i++){
            let newObj = {};
            newObj.id = querySnapshot.docs[i].id;

            for (let [key, value] of Object.entries(querySnapshot.docs[i].data())) {
                newObj[key] = value;
            }

            allDatas.push(newObj);
        }
        
        console.log(allDatas);
    });
    
        // Dinleyiciyi iptal etmek için fonksiyonu döndürün
    return function(){
        unsub();

        return allDatas;
    }
}

export async function fetchDatasWithFiltering(collectionName, filterProperty, filterOperator, filterValue, ordering = "none"){
    let colref = collection(firestore, collectionName);

    let filterTheDocs;

    switch(ordering){
        case "none":
            filterTheDocs = query(colref, where(filterProperty, filterOperator, filterValue));
            break;
        case "id":
            filterTheDocs = query(colref, where(filterProperty, filterOperator, filterValue), orderBy("id"));
            break;
    }

    let allDatas = [];

    let getAllDocs = await getDocs(filterTheDocs);

    for(let i = 0; i < getAllDocs.docs.length; i++){
        let newObj = {};
        newObj.id = getAllDocs.docs[i].id;

        for(let [key, value] of Object.entries(getAllDocs.docs[i].data())){
            newObj[key] = value;
        }

        allDatas.push(newObj);
    }

    return allDatas;
}

export async function fetchDatasWithFilteringAndLimit(collectionName, filterProperty, filterOperator, filterValue, ordering = "none", fetchLimit = 10){
    let colref = collection(firestore, collectionName);

    let filterTheDocs;

    switch(ordering){
        case "none":
            filterTheDocs = query(colref, where(filterProperty, filterOperator, filterValue), limit(fetchLimit));
            break;
        case "id":
            filterTheDocs = query(colref, where(filterProperty, filterOperator, filterValue), orderBy("id"), limit(fetchLimit));
            break;
    }

    let allDatas = [];

    let getAllDocs = await getDocs(filterTheDocs);

    for(let i = 0; i < getAllDocs.docs.length; i++){
        let newObj = {};
        newObj.id = getAllDocs.docs[i].id;

        for(let [key, value] of Object.entries(getAllDocs.docs[i].data())){
            newObj[key] = value;
        }

        allDatas.push(newObj);
    }

    return allDatas;
}

export async function fetchDatasWithFilteringSnapshot(collectionName, filterProperty, filterOperator, filterValue, ordering = "none"){
    let colref = collection(firestore, collectionName);

    let filterTheDocs;

    switch(ordering){
        case "none":
            filterTheDocs = query(colref, where(filterProperty, filterOperator, filterValue));
            break;
        case "id":
            filterTheDocs = query(colref, where(filterProperty, filterOperator, filterValue), orderBy("id"));
            break;
    }

    let allDatas = [];

    const unsub = onSnapshot(filterTheDocs, function(querySnapshot){
        allDatas = [];

        for(let i = 0; i < querySnapshot.size; i++){
            let newObj = {};
            newObj.id = querySnapshot.docs[i].id;

            for (let [key, value] of Object.entries(querySnapshot.docs[i].data())) {
                newObj[key] = value;
            }

            allDatas.push(newObj);
        }
        
        console.log(allDatas);
    });
    
        // Dinleyiciyi iptal etmek için fonksiyonu döndürün
    return function(){
        unsub();

        return allDatas;
    }
}

export async function fetchOneDataById(collectionName, id){
    let colref = collection(firestore, collectionName);

    let wantedDoc = doc(colref, id);

    let getTheDoc = await getDoc(wantedDoc);

    let getWantedDoc = getTheDoc.data();

    if(!getWantedDoc){
        return null;
    };

    getWantedDoc.id = getTheDoc.id;

    return getWantedDoc;
}

export async function addDocumentWithUniqueId(collectionName, document, uniqueId){
    let colref = collection(firestore, collectionName);

    let ourDoc = doc(colref, uniqueId);

    await setDoc(ourDoc, document);
}

export async function addDocument(collectionName, document){
    let colref = collection(firestore, collectionName);

    await addDoc(colref, document);
}

export async function deleteDocument(collectionName, id){
    let colref = collection(firestore, collectionName);

    let getTheDoc = doc(colref, id);

    await deleteDoc(getTheDoc);
}

export async function updateDocument(collectionName, id, updateObj){
    let colref = collection(firestore, collectionName);

    let createDoc = doc(colref, id);

    await updateDoc(createDoc, updateObj)
}

// Muhasebe Programı Default Unsurlar:

// her muhasebe bernamesinde bulunması mucib statistics koleksiyonu ve bunu alakalı firestore daniş mahfazasına ekleyen kod:
// bu dosyayı her bir proje teşkilinde çalışdır.

/*let statistics = [
    { id: 1, name: "Toplam Gelir", value: 0, visible: true },
    { id: 2, name: "Ödenmiş Toplam Gelir", value: 0, visible: true },
    { id: 3, name: "Ödenmemiş Toplam Gelir", value: 0, visible: true },
    { id: 4, name: "Toplam Gider", value: 0, visible: true },
    { id: 5, name: "Ödenmiş Toplam Gider", value: 0, visible: true },
    { id: 6, name: "Ödenmemiş Toplam Gider", value: 0, visible: true },
    { id: 7, name: "Toplam Hizmet Alımı", value: 0, visible: true },
    { id: 8, name: "Toplam Hizmet Satımı", value: 0, visible: true },
    { id: 9, name: "Toplam Mal Alımı", value: 0, visible: true },
    { id: 10, name: "Toplam Mal Satımı", value: 0, visible: true },
    { id: 11, name: "Nakit Gelirleri", value: 0, visible: true },
    { id: 12, name: "Nakit Giderleri", value: 0, visible: true },
    { id: 13, name: "Kredi Kartı Gelirleri", value: 0, visible: true },
    { id: 14, name: "Kredi Kartı Giderleri", value: 0, visible: true },
    { id: 15, name: "Banka Gelirleri", value: 0, visible: true },
    { id: 16, name: "Banka Giderleri", value: 0, visible: true },
    { id: 17, name: "Çek Gelirleri", value: 0, visible: true },
    { id: 18, name: "Çek Giderleri", value: 0, visible: true },
    { id: 19, name: "Senet Gelirleri", value: 0, visible: true },
    { id: 20, name: "Senet Giderleri", value: 0, visible: true },
    { id: 21, name: "İndirilecek Kdv", value: 0, visible: true },
    { id: 22, name: "Eklenecek Kdv", value: 0, visible: true },
    { id: 23, name: "Ödenmiş İndirilecek Kdv", value: 0, visible: true },
    { id: 24, name: "Ödenmemiş İndirilecek Kdv", value: 0, visible: true },
    { id: 25, name: "Ödenmiş Eklenecek Kdv", value: 0, visible: true },
    { id: 26, name: "Ödenmemiş Eklenecek Kdv", value: 0, visible:true },
];

async function addAllStandardValues(collectionName){  
    let colref = collection(firestore, collectionName);

    for(let i = 0; i < statistics.length; i++){
        let createDoc = doc(colref, String(statistics[i].id));

        await setDoc(createDoc, { name: statistics[i].name, value: statistics[i].value, visible: statistics[i].visible });
    };
}

addAllStandardValues("statistics").then(param => console.log(param)).catch(err => console.log(err));*/

// customer nesnesi:

/*let customer = {
    id: "şirket id'si", // string
    name: "şirket ismi", // string,
    address: "şirket adresi", // string
    totalOccuredBalance: "müşteriye karşı tahakkuk etmiş olan alacak/verecek dengesi", // number
    customersDebt: "müşteri'nin eğer ödenmemiş borcu varsa 0'dan başka bir şey olacak değer", // number
    ourDebt: "bizim eğer müşteri'ye ", // number
    telephone: "şirket'in telefon numarası", // number
    email: "şirket'in email numarası",
    taxNumber: "Şirket'in vergi numarası",
    taxAdministration: "Şirket'in bağlı olduğu vergi dairesi", 
}

// kayıd nesnesi:

let record = {
    id: "kayıd id'si", // string
    value: "kayıd meblağ'ı, numara", // number
    date: "kaydın yapıldığı tarih", // string, date-fns kütübhanesini kullanarak ekle.
    customer: "şirket ismi veya müşteri ismi", // string
    customerType: "Müşteri cinsi. Ferdî müşteri, Müessesevî müşteri", // string
    taxRate: "kaydın vergisi yüzdesi", // number
    tax: "kayda tahakkuk eden kesin vergi.",  // number
    type: "kaydın tipi. Hizmet bey'i, Hizmet şira'ı, Mal bey'i, Mal şira'ı", // string
    completed: "ödemenin yapılıp yapılmadığının bilgisi, yapıldıysa true, yapılmadıysa false", // boolean
    paymentType: "Ödeme cinsi. Nakid, Kredi Kartı, Banka, Çek, Senet",
}*/
