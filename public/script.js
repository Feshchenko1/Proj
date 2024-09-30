document.addEventListener("DOMContentLoaded", function () {
    const loginLink = document.getElementById("login-link");
    const registerLink = document.getElementById("register-link");
    const loginForm = document.getElementById("login-form");
    const registerForm = document.getElementById("register-form");
    const resetPasswordForm = document.getElementById("reset-password-form");
    const closeButtons = document.querySelectorAll(".close-button");
    const profilePage = document.getElementById("profile-page");
    const profileNameSpan = document.getElementById("profile-name");
    const profileEmailSpan = document.getElementById("profile-email");
    const saveProfileButton = document.getElementById("save-profile");
    const profileNameInput = document.getElementById("profile-name-input");

    // Функція для показу модального вікна
    function showModal(modal) {
        modal.style.display = "block";
    }

    // Функція для закриття модального вікна
    function closeModal(modal) {
        modal.style.display = "none";
    }

    // Вхід користувача
    loginLink.addEventListener("click", function () {
        showModal(loginForm);
    });

    registerLink.addEventListener("click", function () {
        showModal(registerForm);
    });

    // Обробка забутого пароля
    const forgotPasswordLink = document.getElementById("forgot-password-link");
    forgotPasswordLink.addEventListener("click", function () {
        showModal(resetPasswordForm);
    });

    closeButtons.forEach(button => {
        button.addEventListener("click", function () {
            closeModal(button.closest(".modal"));
        });
    });

    // Обробка входу
    document.getElementById("login-form-content").addEventListener("submit", async function (event) {
        event.preventDefault();
        
        const email = document.getElementById("login-email").value;
        const password = document.getElementById("login-password").value;

        try {
            const response = await fetch('/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ email, password })
            });

            if (response.ok) {
                const user = await response.json();
                profileNameSpan.textContent = user.name;
                profileEmailSpan.textContent = user.email;
                closeModal(loginForm);
                profilePage.classList.remove("hidden");
            } else {
                alert('Неправильний email або пароль');
            }
        } catch (error) {
            console.error('Помилка:', error);
            alert('Сталася помилка при вході.');
        }
    });

    // Обробка реєстрації
    document.getElementById("register-form-content").addEventListener("submit", async function (event) {
        event.preventDefault();
        
        const name = document.getElementById("register-name").value;
        const email = document.getElementById("register-email").value;
        const password = document.getElementById("register-password").value;

        try {
            const response = await fetch('/register', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ name, email, password })
            });

            if (response.ok) {
                alert('Користувача зареєстровано');
                closeModal(registerForm);
            } else {
                const errorText = await response.text();
                alert(errorText);
            }
        } catch (error) {
            console.error('Помилка:', error);
            alert('Сталася помилка при реєстрації.');
        }
    });

    // Обробка скидання пароля
    document.getElementById("reset-password-form-content").addEventListener("submit", async function (event) {
        event.preventDefault();
        
        const email = document.getElementById("reset-email").value;
        const newPassword = document.getElementById("reset-password").value;

        try {
            const response = await fetch('/resetPassword', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ email, newPassword })
            });

            if (response.ok) {
                alert('Пароль успішно скинуто');
                closeModal(resetPasswordForm);
            } else {
                alert('Помилка скидання пароля');
            }
        } catch (error) {
            console.error('Помилка:', error);
            alert('Сталася помилка при скиданні пароля.');
        }
    });

     // Обробка оновлення профілю
     saveProfileButton.addEventListener("click", async function () {
        const newName = profileNameInput.value;
        try {
            const response = await fetch('/updateProfile', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ email: profileEmailSpan.textContent, newName })
            });

            if (response.ok) {
                alert('Профіль успішно оновлено');
                profileNameSpan.textContent = newName; // Оновлюємо ім'я на сторінці
            } else {
                const errorText = await response.text(); // Отримуємо текстову відповідь
                alert(errorText); // Виводимо текст у випадку помилки
            }
        } catch (error) {
            console.error('Помилка:', error);
            alert('Сталася помилка при оновленні профілю.');
        }
    });

});
