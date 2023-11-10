<script>
    import { page } from "$app/stores";
    import { fetchOneDataById } from "../../../../lib/firebase";
    import { onMount } from "svelte";
    import { format } from "date-fns";

    let routeParam = $page.params.stock;

    $: ourStock = {};

    onMount(function(){
        let isMounted = true;

        async function fetchStock(){
            let stock = await fetchOneDataById("records", routeParam);
            
            console.log("our stock: ", stock);

            if(isMounted){
                ourStock = stock;
            };
        };

        fetchStock();

        return function(){
            isMounted = false;
        };
    });

    async function handleDeleteRecord(id){
        let request = await fetch(`/records/delete-a-record?recordId=${id}`);

        let response = await request.json();

        if(response.status === 200){
            alert("Muvaffakiyetle kaydı sildiniz!");

            location.assign("/panel/stocks");
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

    $: isStockAmountChanged = "";

    async function handleChangeStockQuantity(param, stockId, quantity){
        param.preventDefault();

        let decreasedStockAmount = document.querySelector("#howManyStockConsumed");

        if(decreasedStockAmount.value === ""){
            isStockAmountChanged = "Hata: azaltılacak stok mikdarını yazmadan stok mikdarını değiştiremezsiniz."
            return;
        }

        if(Number(decreasedStockAmount.value) > quantity){
            isStockAmountChanged = "Hata: azaltılacak stok adedi mevcud veya temel stok adedinden fazla olamaz.";
            return;
        }

        if(Number(decreasedStockAmount.value) <= 0){
            isStockAmountChanged = "Hata: azaltılacak stok adedi 0'dan küçük veya 0 olamaz.";
            return;
        }

        let request = await fetch("/stocks/change-stock-amount", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                decreaseAmount: Number(decreasedStockAmount.value),
                id: stockId
            })
        });

        let response = await request.json();

        isStockAmountChanged = `Stok Mikdarı değişdirildi. Yeni stok mikdarı: ${response.remainedAmount}`;
    }
</script>

<main class="individual-stock-page-container">
    { #if ourStock.customer }
    <h2>Müşteri İsmi: {ourStock.customer}</h2>

    <p>Stok İsmi: {ourStock.name}</p>

    <p>Temel Stok Adedi: {ourStock.baseQuantity}</p>

    <p>Mevcud Stok Adedi: {ourStock.quantity}</p>

    <form on:submit={(event) => handleChangeStockQuantity(event, ourStock.id, ourStock.quantity)}>
        <input type="number" id="howManyStockConsumed" placeholder="Azaltılacak Stok Mikdarı">
        <input type="submit" value="Stok Miktarını Azalt">
        <p>{isStockAmountChanged}</p>
    </form>

    <p>Kayıt Tarihi: {format(new Date(ourStock.date), "yyyy-MM-dd")}</p>

    <p>Kayıd Meblağı: {ourStock.value} ₺</p>

    <p>Ödeme Durumu: {ourStock.completed === true ? "Ödendi" : ourStock.completed === false ? "Ödenmedi" : "undefined" }</p>

    <form on:submit={(event) => handleChangePaymentStatus(event, ourStock.id)}>
        <input type="submit" value="Ödemeyi {ourStock.completed === true ? "Yapılmadı" : ourStock.completed === false ? "Yapıldı" : "undefined"} olarak ayarla">
        <p>{isPaymentStatusChanged}</p>
    </form>

    <button on:pointerdown={() => handleDeleteRecord(ourStock.id)}>Kaydı Sil</button>

    <h2>Kayıd Açıklaması:</h2>

    <p>{ourStock.description}</p>

    <p>Ödeme Metodu: {ourStock.paymentType === "cash" ? "Nakid" : ourStock.paymentType === "credit card" ? "Kredi Kartı" : ourStock.paymentType === "bank" ? "Banka" :ourStock.paymentType === "check" ? "Çek" :ourStock.paymentType === "promissory note" ? "Sened" : ""}</p>

    <p>Vergi Yüzdesi: %{ourStock.taxRate}</p>
    {/if }
    
</main>

<style>
    .individual-stock-page-container{
        padding: 1em;
    }
</style>