<script>
    export let data;

    let user = data.props.data;

    console.log("panel'in +layout.svelte sayfasındaki kullanıcı nesnesi: ", user);

    /*async function handleLogout(){
        let request = await fetch("/auth/logouting");

        let response = await request.json();

        console.log(response);

        if(response.status === 302){
            location.assign("/");
        };
    };*/
</script>


<div class="panel-navbar">
    <div class="panel-left">
        <a href="/panel">Ana Sayfa</a>
        <a href="/panel/statistics">İstatistik Ayarları</a>
        <a href="/panel/add-customer">Müşteri Ekle</a>
        <a href="/panel/all-customers">Müşteriler</a>
        <a href="/panel/add-record">Kayıt Ekle</a>
        <a href="/panel/all-records">Kayıtlar</a>
        <a href="/panel/add-users">Kullanıcı Ekle</a>
        <a href="/panel/all-users">Kullanıcılar</a>
        <a href="/panel/stocks">Stoklar</a>
        <a href="/panel/info">Bilgilendirme</a>
        <a href="/auth/logouting">Çıkış Yap</a>
    </div>

    <div class="panel-right">
        <slot ></slot>
    </div>
</div>


<style>
    .panel-navbar{
        display: grid;
        grid-template-columns: 1fr 6fr;;
        gap: 20px;
    }

    .panel-left > *{
        display: block;
        border-right: 3px solid black;
        padding: 1em;
        font-size: 1.5rem;
        text-decoration: none;
        cursor: pointer;
    }

    .panel-left > *:hover{
        font-style: italic;
        text-decoration: underline;
    }
</style>