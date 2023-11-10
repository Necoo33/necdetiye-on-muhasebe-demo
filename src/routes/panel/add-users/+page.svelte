<script>
    $: addUserServerMessage = "";

    async function handleSubmit(param){
        param.preventDefault();

        let nicknameInput = document.querySelector("#nicknameInput");
        let passwordInput = document.querySelector("#passwordInput");
        let emailInput = document.querySelector("#emailInput");
        let roleInput = document.querySelector("#roleInput");

        if(nicknameInput.value.length < 6){
            addUserServerMessage = "Hata, kullanıcı ismi en az 6 karakter ihtiva etmelidir.";
            return;
        }

        let regex = /^(?=.*\d)(?=.*[A-ZİĞÜÇÖŞ])(?=.*[a-zığüçöş])(?=.*\W).+$/;

        if(!regex.test(passwordInput.value)){
            addUserServerMessage = "Hata, kullanıcı şifresi en az 1 tane küçük harf, bir tane büyük harf, bir tane küçük harf, bir tane rakam ve bir tane işaret ihtiva etmelidir.";
            return;
        };

        if(passwordInput.value.length < 6 || passwordInput.value.length > 16){
            addUserServerMessage = "Hata, kullanıcı şifresi en az 6, en fazla 16 karakter ihtiva etmelidir.";
            return;
        };

        let userObj = {
            nickname: nicknameInput.value,
            password: passwordInput.value,
            email: emailInput.value,
            role: roleInput.value
        }

        let request = await fetch("/auth/registering", {
            method: "post",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(userObj)
        });

        let response = await request.json();

        addUserServerMessage = response.message;
    }
</script>

<h2 class="add-users-page-title">Kullanıcı Ekleme Formu</h2>

<main class="add-users-page-container">
    <form on:submit={handleSubmit}>
        <input type="text" id="nicknameInput" placeholder="Kullanıcı İsmi">
        <input type="password" id="passwordInput" placeholder="Şifre">
        <input type="email" id="emailInput" placeholder="E-Posta">
        <select id="roleInput">
            <option value="none">Kullanıcı'nın Rütbesini Seçiniz</option>
            <option value="moderator">Moderatör</option>
            <option value="admin">Admin</option>
        </select>
        <input type="submit" value="Kullanıcı Ekle">
        <p>{addUserServerMessage}</p>
    </form>
</main>

<style>
    .add-users-page-title{
        text-align: center;
    }

    .add-users-page-container{
        display: flex;
        place-content: center;
        align-items: center;
        margin: 5vh 0;
    }

    .add-users-page-container form{
        display: grid;
        grid-template-columns: 1fr 3fr 1fr;
        gap: 20px;
    }

    .add-users-page-container form > * {
        display: block;
        grid-column: 2;
    }
</style>