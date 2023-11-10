<script>
    import { onMount } from "svelte";
    import { fetchAllDatas, fetchDatasWithFiltering } from "../../../lib/firebase";

    $: allCustomers = [];
    $: customerTypesTitle = "Kurumsal Müşteriler";
    $: activeCustomerType = "kurumsal";

    onMount(function(){
        console.time("müşteri celbi");
        let isMounted = true;

        async function fetchCustomers(){
            let customers = await fetchDatasWithFiltering("customers", "customerType", "==", "kurumsal");

            console.log("our customers: ", customers);

            customers.sort((a, b) => a > b ? 1 : a === b ? 0 : a < b ? -1 : 0);

            if(isMounted){
                allCustomers = customers; 
            }
        }

        fetchCustomers();

        console.timeEnd("müşteri celbi");
        return function(){
            isMounted = false;
        }
    })

    async function changeCustomerType(activeType){
        switch(activeType){
            case "kurumsal":
                let otherCustomerTypes1 = await fetchDatasWithFiltering("customers", "customerType", "==", "bireysel");

                otherCustomerTypes1.sort((a, b) => a > b ? 1 : a === b ? 0 : a < b ? -1 : 0);

                allCustomers = otherCustomerTypes1;

                activeCustomerType = "bireysel";
                customerTypesTitle = "Bireysel Müşteriler";
                break;
            
            case "bireysel":
                let otherCustomerTypes2 = await fetchDatasWithFiltering("customers", "customerType", "==", "kurumsal");

                otherCustomerTypes2.sort((a, b) => a > b ? 1 : a === b ? 0 : a < b ? -1 : 0);

                allCustomers = otherCustomerTypes2;

                activeCustomerType = "kurumsal";
                customerTypesTitle = "Kurumsal Müşteriler";
                break;
        }
    }

</script>

<h2>{customerTypesTitle}</h2>

<main class="all-customers-page-container">
    <div class="all-customers-page-left">
        <div class="all-customers-titles">
            <h2>Müşteri İsmi</h2>
            <h2>Müşteri Telefonu</h2>
            <h2>Müşteri E-Posta'sı</h2>
        </div>
    
        <div class="all-customers-outputs">
            { #each allCustomers as customer }
                <div class="individual-customer">
                    <p>{customer.customerName}</p>
                    <p>{customer.customerTelephone}</p>
                    <p>{customer.customerEmail}</p>
                    <a href="/panel/all-customers/{customer.id}">Müşteri Detayları</a>
                </div>
            {/each }
        </div>
    </div>

    <div class="all-customers-page-right">
        <h2>Filtreler</h2>

        <button on:click={changeCustomerType(activeCustomerType)}>{activeCustomerType === "kurumsal" ? "Kurumsal" : "Bireysel"} Müşteriler</button>
    </div>
</main>

<style>
    .all-customers-page-container{
        padding: 1em;
        display: grid;
        grid-template-columns: 4fr 1fr;
        align-items: top;
    }

    .all-customers-titles{
        display: grid;
        grid-template-columns: repeat(4, 1fr);
        align-items: center;
        gap: 10px;
    }

    .all-customers-outputs{
        margin-bottom: 10px;
    }

    .individual-customer{
        display: grid;
        grid-template-columns: repeat(4, 1fr);
        align-items: center;
        gap: 10px;
    }
</style>