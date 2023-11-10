<script>
    import { onMount } from "svelte";
    import { fetchDatasWithFiltering, fetchAllDatas } from "../../../lib/firebase";
    import { parseISO } from "date-fns";

    $: statusMessage = "";
    $: allCustomers = [];

    onMount(function(){
        let isMounted = true;

        async function fetchCustomers(){
            let customers = await fetchAllDatas("customers")

            console.log("our customers: ", customers);

            customers.sort((a, b) => a > b ? 1 : a === b ? 0 : a < b ? -1 : 0);

            if(isMounted){
                allCustomers = customers; 
            }
        }

        fetchCustomers();

        return function(){
            isMounted = false;
        }
    })

    $: customCustomerStyles = "none";
    $: stockOptionStyles = "none";

    function handleAddCustomCustomerName(param){
        if(param.currentTarget.value === "customName"){
            customCustomerStyles = "block";
        } else {
            customCustomerStyles = "none";
        }
    }

    function handleAddStockOptions(param){
        if(param.currentTarget.value === "productBuy"){
            stockOptionStyles = "block";
        } else {
            stockOptionStyles = "none";
        }
    }

    console.log(customCustomerStyles);

    async function handleSubmit(param){
        param.preventDefault();

        let customerName = document.querySelector("#customerName");
        let customerType = "not selected on front-end";
        
        if(customerName.value === "customName"){
            customerName = document.querySelector("#customCustomerName");
            customerType = document.querySelector("#customCustomerType").value;
        }

        let recordType = document.querySelector("#type");
        let recordStockName = document.querySelector("#stockName");
        let recordStockQuantity = document.querySelector("#stockQuantity");
        let recordMoneyValue = document.querySelector("#moneyValue");
        let recordGtipValue = document.querySelector("#gtipValue");
        let recordDate = document.querySelector("#recordDate");
        let recordTaxRate = document.querySelector("#taxRate");
        let recordPaymentType = document.querySelector("#paymentType");
        let paymentCompleted = document.querySelector("#completed");
        let description = document.querySelector("#description");

        if(customerName.value === ""){
            statusMessage = "Hata: Müşteri İsmi Boş Bırakılamaz.";
            return;
        }

        if(customerType !== "not selected on front-end" && customerType.value === "none"){
            statusMessage = "Hata: Müşteri Cinsi Boş Bırakılamaz.";
            return;
        }

        if(recordType.value === "none"){
            statusMessage = "Hata: Kayıd Cinsi Boş Bırakılamaz.";
            return;
        }

        if(recordMoneyValue.value === "" || isNaN(Number(recordMoneyValue.value))){
            statusMessage = "Hata: Kayıd Meblağı Boş Bırakılamaz Ve Sayıyla Yazılmalıdır.";
            return;
        }

        if(recordMoneyValue.value !== "" && isNaN(Number(recordGtipValue.value))){
            statusMessage = "Hata: Gümrük Tarife İstatistik Pozisyonu Numarası sadece sayılardan mürekkeb olmalıdır.";
            return;
        }

        if(recordDate.value === ""){
            statusMessage = "Hata: Kayıd Tarihi Boş Bırakılamaz.";
            return;
        }

        if(recordTaxRate.value === "none"){
            statusMessage = "Hata: Kayıd Vergi Yüzdesi Boş Bırakılamaz.";
            return;
        }

        if(recordPaymentType.value === "none"){
            statusMessage = "Kayıd Ödeme Tipi Boş Bırakılamaz.";
            return;
        }

        if(paymentCompleted.value === "none"){
            statusMessage = "Ödemenin Tamamlanıp Tamamlanmadığı Bilgisi Boş Bırakılamaz.";
        }

        let recordObj = {
            customer: customerName.value,
            customerType: customerType,
            type: recordType.value,
            quantity: recordStockQuantity !== "" ? Number(recordStockQuantity.value) : "",
            name: recordStockName.value,
            date: parseISO(recordDate.value),
            value: Number(recordMoneyValue.value),
            gtip: recordGtipValue.value !== "" ? Number(recordGtipValue.value) : "",
            taxRate: Number(recordTaxRate.value),
            paymentType: recordPaymentType.value,
            completed: paymentCompleted.value === "true" ? true : false,
            description: description.value
        }

        let request = await fetch("/records/adding-a-record", {
            method: "post",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(recordObj)
        });

        let response = await request.json();

        if(response.status === 201){
            statusMessage = "Muvaffakiyet: Kayıd Eklendi.";
        } else {
            statusMessage = response.message;
        }
    }
</script>

<h2 class="add-record-page-title">Muhasebe Kaydı Ekle</h2>

<main class="add-record-page-container">
    <form on:submit={handleSubmit}>
        <select name="" id="customerName" on:change={handleAddCustomCustomerName}>
            <option value="none">Müşteri Seç</option>
            <option value="customName" >Müşteri İsmini Elle Yazacağım</option>
            { #each allCustomers as customer }
                <option value="{customer.customerName}">{customer.customerName}</option>
            {/each }
        </select>
        <input type="text" id="customCustomerName" placeholder="Müşteri İsmini Yazın" style="display: {customCustomerStyles};">
        <select id="customCustomerType" style="display: {customCustomerStyles};">
            <option value="none">Müşteri Tipi</option>
            <option value="kurumsal">Kurumsal Müşteri</option>
            <option value="bireysel">Bireysel Müşteri</option>
        </select>
        <select id="type" on:change={handleAddStockOptions}>
            <option value="none">Kaydın Tipi</option>
            <option value="serviceBuy">Hizmet Alımı</option>
            <option value="serviceSell">Hizmet Satımı</option>
            <option value="productBuy">Mal Alımı</option>
            <option value="productSell">Mal Satımı</option>
        </select>
        <input type="text" id="stockName" placeholder="Stok İsmi" style="display: {stockOptionStyles};">
        <input type="number" id="stockQuantity" placeholder="Stok Adedi" style="display: {stockOptionStyles};">
        <input type="text" id="moneyValue" placeholder="Kayıd Meblağı">
        <input type="number" id="gtipValue" placeholder="Gümrük Tarife İstatistik Pozisyonu Numarası">
        <input type="date" id="recordDate">
        <select id="taxRate">
            <option value="none">Kaydın Vergi Yüzdesi</option>
            <option value="1">%1</option>
            <option value="10">%10</option>
            <option value="20">%20</option>
        </select>
        <select id="paymentType">
            <option value="none">Ödeme Tipi</option>
            <option value="credit card">Kredi Kartı</option>
            <option value="bank">Banka</option>
            <option value="check">Çek</option>
            <option value="promissory note">Sened</option>
            <option value="cash">Nakid</option>
        </select>
        <select id="completed">
            <option value="none">Ödeme Tamamlandı Mı?</option>
            <option value="true">Tamamlandı</option>
            <option value="false">Tamamlanmadı</option>
        </select>
        <textarea name="" id="description" cols="30" rows="10"></textarea>
        <input type="submit" value="Kayıd Ekle">
        <p>{statusMessage}</p>
    </form>
</main>

<style>
    .add-record-page-title{
        text-align: center;
    }

    .add-record-page-container{
        display: flex;
        place-content: center;
        align-items: center;
    }

    .add-record-page-container form {
        padding: 1em;
        display: grid;
        grid-template-columns: 1fr;
    }

    .add-record-page-container form > * {
        margin-bottom: 10px;
        display: block;
    }
</style>