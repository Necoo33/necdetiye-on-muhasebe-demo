<script>
    import { page } from "$app/stores";
    import { onMount } from "svelte";
    import { fetchOneDataById } from "../../../../lib/firebase";

    export let data;

    let routeParam = $page.params.user;

    let currentUser = data.props.data;

    $: fetchedUser = {};

    $: upgradingStatusInfo = "";

    $: deletingStatusInfo = "";

    $: updatingStatusInfo = "";

    onMount(function(){
        let isMounted = true;

        async function fetchUser(){
            let individualUser = await fetchOneDataById("users", routeParam);

            if(isMounted){
                fetchedUser = individualUser;
            }
        }

        fetchUser();

        return function(){
            isMounted = false;
        }
    });

    async function handleUpgradeRole(fetchedUser){
        let request = await fetch("/auth/upgrade-role", {
            method: "post",
            headers: {
                "Content-Type": "application/json"
            }, body: JSON.stringify({ subjectUserId: fetchedUser.id, upgraderNickname: currentUser.nickname })
        });

        let response = await request.json();

        upgradingStatusInfo = `Muamele neticesi: ${response.message}, kod: ${response.status}`;
    }

    async function handleDeleteUser(fetchedUser){
        if(currentUser.role !== "admin"){
            upgradingStatusInfo = "admin rütbesinde olmayan hesaplar rütbe yükseltemez.";
        }

        let request = await fetch(`/auth/delete-user?subjectId=${fetchedUser.id}&deleterNickname=${currentUser.nickname}`);

        let response = await request.json();

        deletingStatusInfo = `Muamele neticesi: ${response.message}, kod: ${response.status}`;
    }

    function handleOpenUpdateForm(){
        let formSelector = document.querySelector(".update-user-form-container");

        formSelector.style.display = "flex";
    }

    async function handleSubmit(param, subjectUser){
        param.preventDefault();

        let nicknameInput = document.querySelector("#nicknameInput");
        let passwordInput = document.querySelector("#passwordInput");
        let emailInput = document.querySelector("#emailInput");

        let conditionCount = 0;

        let userForUpdate = {}

        if(nicknameInput.value !== subjectUser.nickname){
            userForUpdate.nickname = nicknameInput.value
        } else{
            conditionCount++;
        }

        if(passwordInput.value === ""){
            conditionCount++;
        } else {
            let regex = /^(?=.*\d)(?=.*[A-ZİĞÜÇÖŞ])(?=.*[a-zığüçöş])(?=.*\W).+$/;

            if(!regex.test(passwordInput.value)){
                updatingStatusInfo = "Hata: kullanıcı şifresi en az 1 tane küçük harf, bir tane büyük harf, bir tane küçük harf, bir tane rakam ve bir tane işaret ihtiva etmelidir.";
                return;
            };

            if(passwordInput.value.length < 6 || passwordInput.value.length > 16){
                updatingStatusInfo = "Hata: kullanıcı şifresi en az 6, en fazla 16 karakter ihtiva etmelidir.";
                return;
            };

            userForUpdate.password = passwordInput.value;
        };

        if(emailInput.value !== subjectUser.email){
            userForUpdate.email = emailInput.value;
        } else {
            conditionCount++;
        };

        if(conditionCount >= 3){
            updatingStatusInfo = "Hata: Hiçbir farklı bilgi girmeden formu yollayamazsınız.";
            return;
        };

        userForUpdate.updaterName = currentUser.nickname;
        userForUpdate.subjectName = subjectUser.nickname;

        let request = await fetch("/auth/update-user", {
            method: "post",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(userForUpdate)
        });

        let response = await request.json();

        updatingStatusInfo = response.message;

        if(response.status === 201){
            setTimeout(function(){
                location.reload();
            }, 1000)
        }
    }
</script>

<main class="individual-user-page-container">
    { #if fetchedUser.nickname !== "" }
        <h2>Kullanıcı İsmi: {fetchedUser.nickname}</h2>
        <p>E-Posta: {fetchedUser.email}</p>
        <p>Kullanıcı Rütbesi: {fetchedUser.role}</p>
        <button on:pointerdown={() => handleDeleteUser(fetchedUser)}>Kullanıcı'yı Sil</button>
        <p>{deletingStatusInfo}</p>
        { #if fetchedUser.role !== "admin" }
            <button on:pointerdown={() => handleUpgradeRole(fetchedUser)}>Rütbe Yükselt</button>
            <p>{upgradingStatusInfo}</p>
        { /if }   

        <button on:pointerdown={handleOpenUpdateForm}>Kullanıcıyı Güncelleme Formunu Aç</button>

        <div class="update-user-form-container">
            <form on:submit={(event) => handleSubmit(event, fetchedUser)}>
                <h2>Kullanıcı Güncelleme Formu</h2>

                <input type="text" id="nicknameInput" placeholder="Kullanıcı İsmi" value="{fetchedUser.nickname}">
                <input type="password" id="passwordInput" placeholder="Şifre">
                <input type="email" id="emailInput" placeholder="E-Posta" value="{fetchedUser.email}">
                <input type="submit" value="Kullanıcıyı Güncelle">
                <p>{updatingStatusInfo}</p>
            </form>
        </div>
    {/if }
</main>

<style>
    .update-user-form-container{
        display: none;
    }

    .update-user-form-container form{
        display: grid;
        grid-template-columns: 1fr 5fr 1fr;
        gap: 20px;
        margin-top: 10vh;
    }

    .update-user-form-container form > * {
        display: block;
        grid-column: 2;
    }
</style>