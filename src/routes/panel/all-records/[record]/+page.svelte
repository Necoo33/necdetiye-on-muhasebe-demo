<script>
    import { onMount } from "svelte";
    import { fetchOneDataById } from "../../../../lib/firebase";
    import { page } from "$app/stores"
    import { format } from "date-fns";

    $: record = {};

    let routeParam = $page.params.record;

    onMount(function(){
        let isMounted = true;

        async function fetchRecords(){
            let ourRecord = await fetchOneDataById("records", routeParam);
            console.log("our record: ", ourRecord);


            if(isMounted){
                record = ourRecord; 
            }
        }

        fetchRecords();

        return function(){
            isMounted = false;
        }
    })

    async function handleDeleteRecord(id){
        let request = await fetch(`/records/delete-a-record?recordId=${id}`);

        let response = await request.json();

        if(response.status === 200){
            alert("Muvaffakiyetle kaydı sildiniz!");

            location.assign("/panel/all-records");
        } else {
            alert("Kayıd Silinemedi");
        }
    }

     $: isPaymentStatusChanged = "";

    async function handleChangePaymentStatus(param, recordId){
        param.preventDefault();

        let request = await fetch("/records/handle-record-payment-status", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ id: recordId })
        });

        let response = await request.json();

        isPaymentStatusChanged = response.message;

        setTimeout(function(){
            location.reload();
        }, 2000)
    }
</script>

{ #if record.customer }
    <main class="individual-record-page-container">
        <h2>Müşteri İsmi: {record.customer}</h2>

        <p>Müşteri Cinsi: {record.type === "serviceSell" ? "Hizmet Satımı" : record.type === "serviceBuy" ? "Hizmet Alımı" : record.type === "productSell" ? "Mal Satımı" : record.type === "productBuy" ? "Mal Alımı" : ""}</p>

        <p>Kayıt Tarihi: {format(new Date(record.date), "yyyy-MM-dd")}</p>

        <p>Kayıd Meblağı: {record.value} ₺</p>

        <p>Ödeme Durumu: {record.completed === true ? "Ödendi" : record.completed === false ? "Ödenmedi" : "undefined" }</p>

        <form on:submit={(event) => handleChangePaymentStatus(event, record.id)}>
            <input type="submit" value="Ödemeyi {record.completed === true ? "Yapılmadı" : record.completed === false ? "Yapıldı" : "undefined"} olarak ayarla">
            <p>{isPaymentStatusChanged}</p>
        </form>

        <button on:pointerdown={() => handleDeleteRecord(record.id)}>Kaydı Sil</button>

        <h2>Kayıd Açıklaması:</h2>

        <p>{record.description}</p>

        <p>Ödeme Metodu: {record.paymentType === "cash" ? "Nakid" : record.paymentType === "credit card" ? "Kredi Kartı" : record.paymentType === "bank" ? "Banka" : record.paymentType === "check" ? "Çek" : record.paymentType === "promissory note" ? "Sened" : ""}</p>

        <p>Vergi Yüzdesi: %{record.taxRate}</p>
    </main>    
{/if }
