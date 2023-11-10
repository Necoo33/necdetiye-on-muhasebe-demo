<script>
    import { getContext } from "svelte";

    export let data;

    console.log("data on /add-customer +page.svelte page: ", data);

    let user = data.props.data;

    $: statusMessage = "";

    async function handleSubmit(param){
        param.preventDefault();

        let customerName = document.querySelector("#customerName");
        let customerAddress = document.querySelector("#customerAddress");
        let customerTelephone = document.querySelector("#customerTelephone");
        let customerFax = document.querySelector("#customerFax");
        let customerEmail = document.querySelector("#customerEmail");
        let customerType = document.querySelector("#customerType");
        let customerTaxAdministration = document.querySelector("#customerTaxAdministration");

        if(customerName.value === ""){
            statusMessage = "Müşteri/Şirket İsmi Girdisi Boş Olamaz.";
            return;
        };

        if(customerType.value === "" || customerType.value === "none"){
            statusMessage = "Müşteri/Şirket Cinsi Girdisi Boş Olamaz.";
            return;
        };

        let request = await fetch("/customer/adding-customer", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                customerName: customerName.value, 
                customerAddress: customerAddress.value, 
                customerTelephone: customerTelephone.value, 
                customerFax: customerFax.value, 
                customerEmail: customerEmail.value, 
                customerType: customerType.value, 
                customerTaxAdministration: customerTaxAdministration.value
            })
        })

        let response = await request.json();

        statusMessage = response.message;
    }

</script>

<h2 class="add-customer-page-title">Müşteri Ekleme Formu</h2>

<main class="add-customer-form-container">
    <form on:submit={handleSubmit}>
        <input type="text" id="customerName" placeholder="Müşteri/Şirket İsmi">
        <textarea id="customerAddress" cols="30" rows="10">Müşteri/Şirket Adresi</textarea>
        <input type="tel" id="customerTelephone" placeholder="Müşteri/Şirket Telefonu">
        <input type="tel" id="customerFax" placeholder="Müşteri/Şirket Fax Numarası">
        <input type="email" id="customerEmail" placeholder="Müşteri/Şirket E-Postası">
        <select id="customerType">
            <option value="none">Seçiniz</option>
            <option value="bireysel">Bireysel Müşteri</option>
            <option value="kurumsal">Kurumsal Müşteri</option>
        </select>
        <input type="text" id="customerTaxAdministration" placeholder="Şirket Vergi Dairesi">
        <input type="submit" value="Müşteri Ekle">
        <p>{statusMessage}</p>
    </form>
</main>

<style>
    .add-customer-page-title{
        text-align: center;
    }

    .add-customer-form-container{
        display: flex;
        place-content: center;
        align-items: center;
    }

    .add-customer-form-container form {
        display: grid;
        grid-template-columns: repeat(3, 1fr);
        gap: 20px;
    }

    .add-customer-form-container form > * {
        grid-column: 2;
        height: 2em;
    }

</style>