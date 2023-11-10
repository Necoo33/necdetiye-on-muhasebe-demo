<script>
    import { onMount } from "svelte";
    import { fetchAllDatas } from "../../../lib/firebase";

    export let data;

    let userObj = data.props.data;

    $: allUsers = [];
    $: deletingUserServerMessage = "";
    
    onMount(function(){
        let isMounted = true;

        async function fetchUsers(){
            let users = await fetchAllDatas("users");

            users.sort(function(a, b){
                if(a.role === "admin" && b.role === "moderator"){
                    return -1;
                } else if(a.role === "moderator" && b.role === "admin"){
                    return 1;
                } else if(a.role === b.role){
                    return 0;
                };
            });

            if(isMounted){
                allUsers = users;
            }
        }

        fetchUsers();

        return function(){
            isMounted = false;
        };
    });

    async function handleDeleteUser(subjectId){
        let request = await fetch(`/auth/delete-user?subjectId=${subjectId}&deleterNickname=${userObj.nickname}`);

        let response = await request.json();

        deletingUserServerMessage = `${response.message}, hata kodu: ${response.status}`;
    };
</script>

<h2 class="users-page-title">Bütün Kullanıcılar</h2>

<main class="users-info-titles">
    <h2>Kullanıcı İsmi</h2>
    <h2>Kullanıcı E-Postası</h2>
    <h2>Kullanıcı Rütbesi</h2>
</main>

<main class="users-container">
    { #each allUsers as user }
        <div class="individual-user">
            <p>{user.nickname}</p>
            <p>{user.email}</p>
            <p>{user.role}</p>
            <button on:pointerdown={handleDeleteUser(user.id)}>Kullanıcı'yı Sil</button>
            <a href="/panel/all-users/{user.id}">Kullanıcı'nın Profiline Git</a>
        </div>
    {/each }
</main>

<style>
    .users-page-title{
        text-align: center;
    }

    .users-info-titles{
        display: grid;
        grid-template-columns: repeat(5, 1fr);
        align-items: center;
        gap: 10px;
    }

    .individual-user{
        display: grid;
        grid-template-columns: repeat(5, 1fr);
        align-items: center;
        gap: 10px;
        margin: 10px 0;
    }
</style>