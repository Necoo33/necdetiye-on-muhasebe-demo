<script>
    import { fetchDatasWithFilteringAndLimit } from "../../../lib/firebase";
    import { onMount } from "svelte";
    import { getYear, getMonth, getDate, format} from "date-fns";

    $: allStocks = [];
    $: currentFilter = [];
    $: amountOfFetch = 20;

    onMount(function(){
        let isMounted = true;

        async function fetchStocks(){
            let stocks = await fetchDatasWithFilteringAndLimit("records", "type", "==", "productBuy", "none", 10);
            
            console.log("our stocks: ", stocks);

            //records.sort((a, b) => a > b ? 1 : a === b ? 0 : a < b ? -1 : 0);

            stocks.sort(function(a, b){
                // Yıl değerlerini karşılaştırıyoruz
                if(getYear(new Date(a.date)) > getYear(new Date(b.date))){
                    return -1;
                } else if(getYear(new Date(a.date)) < getYear(new Date(b.date))){
                    return 1;
                } else {
                    // Yıl değerleri eşitse, ay değerlerini karşılaştırıyoruz
                    if(getMonth(new Date(a.date)) > getMonth(new Date(b.date))){
                        return -1;
                    } else if(getMonth(new Date(a.date)) < getMonth(new Date(b.date))){
                        return 1;
                    } else {
                    // Ay değerleri eşitse, gün değerlerini karşılaştırıyoruz
                        if(getDate(new Date(a.date)) > getDate(new Date(b.date))){
                            return -1;
                        } else if(getDate(new Date(a.date)) < getDate(new Date(b.date))){
                            return 1;
                        } else {
                            // Gün değerleri eşitse, sıralama yapmıyoruz
                            return 0;
                        }
                    }
                }
            });


            if(isMounted){
                allStocks = stocks; 
                currentFilter = stocks;
            }
        }

        fetchStocks();

        return function(){
            isMounted = false;
        }
    })

    async function handleDeleteRecord(id){
        let request = await fetch(`/records/delete-a-record?recordId=${id}`);

        let response = await request.json();

        if(response.status === 200){
            alert("Muvaffakiyetle kaydı sildiniz!");
        } else {
            alert("Kayıd Silinemedi");
        }
    }

    function addFilterToFunction(number, event){
        switch(number){
            case 1:
                let sortByName = allStocks.sort(function(a, b){
                    if(a.customer > b.customer){
                        return 1;
                    } else if(a.customer < b.customer){
                        return -1;
                    } else {
                        return 0;
                    }
                });

                currentFilter = sortByName;
                break;
            case 2:
                let sortByType = allStocks.sort(function(a, b){
                    if(a.type > b.type){
                        return -1;
                    } else if(a.type < b.type){
                        return 1;
                    } else {
                        return 0;
                    }
                });

                currentFilter = sortByType;
                break;
            case 3:
                let sortByValue = allStocks.sort(function(a, b){
                    if(a.value > b.value){
                        return -1;
                    } else if(a.value < b.value){
                        return 1;
                    } else {
                        return 0;
                    };
                });

                currentFilter = sortByValue;
                break;
            case 4:
                let sortByDate = allStocks.sort(function(a, b){
                    // Yıl değerlerini karşılaştırıyoruz
                    if(getYear(new Date(a.date)) > getYear(new Date(b.date))){
                        return -1;
                    } else if(getYear(new Date(a.date)) < getYear(new Date(b.date))){
                        return 1;
                    } else {
                        // Yıl değerleri eşitse, ay değerlerini karşılaştırıyoruz
                        if(getMonth(new Date(a.date)) > getMonth(new Date(b.date))){
                            return -1;
                        } else if(getMonth(new Date(a.date)) < getMonth(new Date(b.date))){
                            return 1;
                        } else {
                        // Ay değerleri eşitse, gün değerlerini karşılaştırıyoruz
                            if(getDate(new Date(a.date)) > getDate(new Date(b.date))){
                                return -1;
                            } else if(getDate(new Date(a.date)) < getDate(new Date(b.date))){
                                return 1;
                            } else {
                                // Gün değerleri eşitse, sıralama yapmıyoruz
                                return 0;
                            }
                        }
                    }
                });

                currentFilter = sortByDate;
                break;
        }

        let allTitlesSelector = document.querySelectorAll(".title-styles");

        for(let i = 0; i < allTitlesSelector.length; i++){
            allTitlesSelector[i].lastChild.src = "/arrow-drop-down.png"
        }

        event.currentTarget.lastChild.src = "/arrow-drop-up.png";
    };

    async function handleFetchMore(fetchAmount){
        let moreStocks = await fetchDatasWithFilteringAndLimit("records", "type", "==", "productBuy", "none", fetchAmount);

        currentFilter = moreStocks;
        allStocks = moreStocks;

        let newFetchAmount = fetchAmount + 10;
        
        currentFetchAmount = newFetchAmount;
    };
</script>

<main class="all-records-page-container">
    <h2 class="all-records-page-title">Tüm Stok Kayıdları</h2>

    <p class="all-records-page-disclaimer">Aşşağıdaki başlıklara tıklayarak sıralama seçeneklerini değiştirebilirsiniz. Eğer ok yukarı dönükse kayıdlar o sütuna göre sıralanmışdır.</p>
    
    <div class="all-records-titles">
        <div class="title-styles" on:pointerdown={(event) => addFilterToFunction(1, event)}>
            <h2>Müşteri İsmi</h2>
            <img src="/arrow-drop-down.png" alt="">
        </div>
        <div class="title-styles" on:pointerdown={(event) => addFilterToFunction(2, event)}>
            <h2>Stok İsmi</h2>
            <img src="/arrow-drop-down.png" alt="">
        </div>
        <div class="title-styles" on:pointerdown={(event) => addFilterToFunction(3, event)}>
            <h2>Kayıd Meblağı</h2>
            <img src="/arrow-drop-down.png" alt="">
        </div>
        <div class="title-styles" on:pointerdown={(event) => addFilterToFunction(4, event)}>
            <h2>Kayıd Tarihi</h2>
            <img src="/arrow-drop-up.png" alt="">
        </div>
        <p></p>
    </div>

    <div class="records-container">
        { #each currentFilter as stock }
            <div class="individual-record">
                <p>{stock.customer}</p>
                <p>{stock.name}</p>
                <p>{stock.value} ₺</p>
                <p>{format(new Date(stock.date), "dd-MM-yyyy")}</p>
                <button on:pointerdown={() => handleDeleteRecord(stock.id)}>Kaydı Sil</button>
                <a href="/panel/stocks/{stock.id}">Kayıd Teferruatları</a>
            </div>
        {/each }
    </div>

    <div class="fetch-others-button">
        <button on:pointerdown={() => handleFetchMore(amountOfFetch)}>Daha Fazla Kayıd Göster</button>
    </div>
</main>

<style>
    .all-records-page-title{
        text-align: center;
    }
    
    .all-records-page-disclaimer{
        text-align: center;
    }

    .all-records-page-container{
        padding: 1em;
    }

    .all-records-titles{
        display: grid;
        grid-template-columns: repeat(6, 1fr);
        gap: 10px;
        align-items: center;
    }

    .individual-record{
        display: grid;
        grid-template-columns: repeat(6, 1fr);
        gap: 5px;
        align-items: center;
    }

    .title-styles{
        display: flex;
        place-content: center;
        align-items: center;
        gap: 2px;
        cursor: pointer;
    }

    .title-styles img {
        width: 30px;
    }

    .fetch-others-button{
        display: flex;
        place-content: center;
        align-items: center;
        padding: 1em;
        margin: 20px 0;
    }

    .fetch-others-button button{
        padding: 2em;
    }
</style>