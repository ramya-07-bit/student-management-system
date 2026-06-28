
document.getElementById("loginForm").addEventListener("submit", function(e){

    e.preventDefault();

    const email = document.getElementById("email").value.trim();
    const password = document.getElementById("password").value.trim();

    if(email === "admin@gmail.com" && password === "admin123"){

        // Save login status
        localStorage.setItem("loggedIn", "true");

        alert("Login Successful");

        // Go to dashboard
        window.location.href = "/index.html";

    }else{

        alert("Invalid Email or Password");

    }

});

