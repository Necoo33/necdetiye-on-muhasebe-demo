<script>
    import { setContext, hasContext, getContext, onMount } from 'svelte';
    import { fetchAllDatas, fetchDatasWithFiltering } from "../../lib/firebase"

    export let data;

    console.log("data on /panel's +page.sevlte page: ", data);

    let user = data.props.data;

    // aşşağıdaki dolar işareti bir değeri "reactive" yapıyor, yani bizim değerimizi
    // aktarabilmemizi sağlıyor.

    $: allStatistics = [];
    $: removedStatistics = [];

    onMount(function(){
        // aşşağıdaki kod azalık token'ını kaldırmamıza yarıyor.
        if(location.search.includes("token")){
            location.href = "/panel";
        }

        console.time("istatistik celbi");
        let isMounted = true;

        async function fetchStats(){
            let stats = await fetchDatasWithFiltering("statistics", "visible", "==", true);

            console.log("our stats: ", stats);

            stats.sort(function(a, b){
                if(Number(a.id) > Number(b.id)){
                    return 1
                } else {
                    return -1
                }
            });

            if(isMounted){
                allStatistics = stats; 
            }
        }

        fetchStats();

        console.timeEnd("istatistik celbi");
        return function(){
            isMounted = false;
        }
    })

    function handleRemoveStatistic(name){
        console.time("istatistiği çıkar");
        let filteringStatistics = [];
        let removedStats = [];

        for(let i = 0; i < allStatistics.length; i++){
            if(allStatistics[i].name === name){
                removedStats.push(allStatistics[i])
            } else {
                filteringStatistics.push(allStatistics[i])
            }
        }

        filteringStatistics.sort(function(a, b){
                if(Number(a.id) > Number(b.id)){
                    return 1
                } else {
                    return -1
                }
            });
        
        allStatistics = filteringStatistics;

        let cleanupArray = [];

        cleanupArray.push(removedStats[0]);

        for(let i = 0; i < removedStatistics.length; i++){
            cleanupArray.push(removedStatistics[i]);
        }

        cleanupArray.sort(function(a, b){
                if(Number(a.id) > Number(b.id)){
                    return 1
                } else {
                    return -1
                }
            });

        console.log("our cleanup array: ", cleanupArray)

        removedStatistics = cleanupArray;

        console.timeEnd("istatistiği çıkar");
    }

    function handleAddStatistic(name){
        console.time("istatistiği geri ekle");
        let filteringRemovedStatistics = [];
        let newVisibleStat = {};

        for(let i = 0; i < removedStatistics.length; i++){
            if(removedStatistics[i].name === name){
                newVisibleStat = removedStatistics[i];
            } else {
                filteringRemovedStatistics.push(removedStatistics[i]);
            }
        }

        let cleanupArray = [];

        cleanupArray.push(newVisibleStat);

        for(let i = 0; i < allStatistics.length; i++){
            cleanupArray.push(allStatistics[i]);
        }

        cleanupArray.sort(function(a, b){
            if(Number(a.id) > Number(b.id)){
                return 1
            } else {
                return -1
            }
        });

        allStatistics = cleanupArray;

        filteringRemovedStatistics.sort(function(a, b){
            if(Number(a.id) > Number(b.id)){
                return 1
            } else {
                return -1
            }
        });

        removedStatistics = filteringRemovedStatistics;

        console.timeEnd("istatistiği geri ekle");
    }

    console.log(allStatistics);
</script>

<main class="panel-page-container">
    <div class="panel-page-left">
        <h2>Panel sahifesinden merhaba {user.nickname}</h2>

        <div class="all-statistics-container">
            { #each allStatistics as statistic }
                <div class="individual-statistic">
                    <h3>{statistic.name}</h3>
                    <h3>{statistic.value} ₺</h3>
                    <button on:pointerdown={() => handleRemoveStatistic(statistic.name)}>Ekrandan Gizle</button>
                </div>
            {/each }
        </div>
    </div>

    <div class="panel-page-right">
        <h2>Gizlediğiniz İstatistikler: </h2>

        <ol class="removed-statistic-list">
            { #each removedStatistics as remStat }
                <li class="individual-removed-statistic">
                    <p>{remStat.name}</p>
                    <button on:pointerdown={() => handleAddStatistic(remStat.name)}>Liste'ye geri ekle</button>   
                </li>
            {/each}
        </ol>
    </div>

</main>


<style>
    .panel-page-container{
        display: grid;
        grid-template-columns: 7fr 2fr;
        align-items: top;
        gap: 200px;
    }

    .all-statistics-container{
        display: grid;
        grid-template-columns: repeat(5, 1fr);
        gap: 20px;
    }

    .individual-removed-statistic{
        display: flex;
        place-content: space-between;
        align-items: center;
        gap: 10px;
    }

    .panel-page-right h2{
        text-align: center;
    }
</style>