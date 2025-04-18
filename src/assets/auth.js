import { APILogin, APIRegister } from "./Constants";
import { showError } from "./functions";

export const headerKey = "78ddf18d-7d41-498d-939d-195c2b76f939";

export async function login() {
    const loginEmail = document.getElementById("email-login").value;
    const loginPass = document.getElementById("password-login").value;

    const loginResponse = await fetch(APILogin, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            email: loginEmail,
            password: loginPass,
        }),
    });

    if (loginResponse.ok) {
        const loginData = await loginResponse.json();
        localStorage.setItem("token", loginData.data.accessToken);
        localStorage.setItem("userId", loginData.data.email);
        localStorage.setItem("userName", loginData.data.name);
        localStorage.setItem("userImage", loginData.data.avatar.url);

        const profileInfo = await fetch(
            `${APIRegister}${loginData.data.name}`,
            {
                method: "GET",
                headers: {
                    Authorization: `Bearer ${loginData.data.accessToken}`,
                    "X-Noroff-API-Key": headerKey,
                },
            }
        );
        if (profileInfo.ok) {
            const profileData = await profileInfo.json();
            localStorage.setItem("credits", profileData.data.credits);
        } else {
            showError(await profileInfo.text(), "Failed to fetch profile info");
        }

        window.location.href = "/";
    } else {
        const err = await loginResponse.json();
        const errorMessage = document.createElement("p");
        const loginForm = document.querySelector("#login-form");
        errorMessage.classList.add("text-red-500", "dark:text-red-400");
        errorMessage.innerText = `${err.errors[0].message}`;
        loginForm.appendChild(errorMessage);
        setTimeout(() => {
            errorMessage.innerText = "";
        }, 4000);
    }
}

export async function register() {
    const registerName = document.getElementById("username").value;
    const registerEmail = document.getElementById("email-register").value;
    const registerPass = document.getElementById("password-register").value;

    const registerResponse = await fetch(APIRegister, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            name: registerName,
            email: registerEmail,
            password: registerPass,
        }),
    });

    if (registerResponse.ok) {
        alert("Registration successful! Please login to continue.");
        window.location.href = "/";
    } else {
        const err = await registerResponse.json();
        const errorMessage = document.createElement("p");
        const registerForm = document.querySelector("#register-form");
        errorMessage.classList.add("text-red-500", "dark:text-red-400");
        errorMessage.innerText = `${err.errors[0].message}`;
        registerForm.appendChild(errorMessage);
        setTimeout(() => {
            errorMessage.innerText = "";
        }, 4000);
    }
}

// Logout
export function logout() {
    localStorage.clear();
    window.location.href = "/";
}
