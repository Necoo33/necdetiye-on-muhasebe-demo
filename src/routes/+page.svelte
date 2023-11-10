<script>

    let statusMessage = "";

    function changeStatusMessage(message){
        statusMessage = message;
    };

    async function handleSubmit(param){
        param.preventDefault();

        let nicknameInput = document.querySelector("#nicknameInput");
        let passwordInput = document.querySelector("#passwordInput");

        //console.log("nickname input value: ", nicknameInput.value);
        //console.log("password input value: ", passwordInput.value);

        let request = await fetch("/auth/logining", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ nickname: nicknameInput.value, password: passwordInput.value })
        });

        let response = await request.json();

        //console.log(response);

        if(response.status !== 201){
            changeStatusMessage(response.message);
        } else {
            location.assign(`/panel?token=${response.body.token}`);
        };
    }

</script>

<h2 class="login-page-title">Necdetiye Ön Muhasebe Programına Hoş Geldiniz!</h2>

<main class="login-page">
    <form on:submit={handleSubmit}>
        <label for="nicknameInput">Kullanıcı Adı:</label>
        <input type="text" name="nickname" id="nicknameInput" placeholder="Kullanıcı Adınız">
        <label for="passwordInput">Şifre:</label>
        <input type="password" name="password" id="passwordInput" placeholder="Şifreniz">
        <input type="submit" value="Giriş Yap">
        <p>{statusMessage}</p>
    </form>
</main>

<style>
    .login-page-title{
        margin-top: 30vh;
        text-align: center;
    }

    .login-page{
        display: flex;
        place-content: center;
        align-items: center;
    }

    .login-page form {
        display: grid;
        grid-template-columns: 1fr;
        padding: 1em;
        border-radius: 20px;
        width: 30vw;
    }

    .login-page form > * {
        grid-column: 1;
        display: block;
        height: 1.5em;
        margin-bottom: 3vh;
        font-size: 1.5rem;
    }
</style>


