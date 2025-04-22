export function showError(link, message) {
    const errorLink = document.createElement("div");
    errorLink.innerText = message;
    errorLink.classList.add(
        "text-red-500",
        "dark:text-red-400",
        "text-center",
        "mt-24",
        "text-xl",
        "font-semibold",
        "bg-white",
        "dark:bg-gray-800",
        "border-4",
        "border-red-500",
        "dark:border-red-400",
        "p-2",
        "rounded-xl",
        "absolute",
        "z-50"
    );

    const linkRect = link.getBoundingClientRect();
    errorLink.style.top = linkRect.top - 40 + "px";
    errorLink.style.left = linkRect.left - 50 + "px";

    document.body.appendChild(errorLink);
    setTimeout(() => {
        errorLink.remove();
    }, 2000);
}

export function isLoggedIn() {
    return !!localStorage.getItem("token");
}

export function checkLogin() {
    if (!localStorage.getItem("token")) {
        alert("You need to be logged in to access this page.");
        window.location.href = "/";
    }
}
