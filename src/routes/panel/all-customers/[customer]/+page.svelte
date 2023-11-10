<script>
    import { page } from "$app/stores";
    import { onMount } from "svelte";
    import { fetchOneDataById } from "../../../../lib/firebase";

    let customerId = $page.params.customer;

    console.log("Rota Kıstasımız: ", customerId);

    $: individualCustomer = {};

    onMount(function(){
        let isMounted = true;

        async function fetchCustomer(){
            let customer = await fetchOneDataById("customers", customerId);

            if(isMounted){
                individualCustomer = customer; 
            }
        }

        fetchCustomer();

        return function(){
            isMounted = false;
        }
    })

    console.log(individualCustomer);
</script>

<h1>Müşteri Profili</h1>

<h2>Müşteri İsmi: {individualCustomer.customerName}</h2>

<p>Müşteri Cinsi: {individualCustomer.customerType}</p>

<p>Müşteri E-Posta Adresi: {individualCustomer.customerEmail}</p>

<p>Müşteri Telefonu: {individualCustomer.customerTelephone}</p>

<p>Müşteri Faks'ı: {individualCustomer.customerFax}</p>

<p>Müşteri'nin bağlı bulunduğu vergi dairesi: {individualCustomer.customerTaxAdministration}</p>

<h2>Müşteri Adresi:</h2>

<p>{individualCustomer.customerAddress}</p>


