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

  
    document.getElementById("register-form-content").addEventListener("submit", function (event) {
        event.preventDefault();

        let valid = true;

    
        const login = document.getElementById("register-login").value;
        const loginError = document.getElementById("login-error");
        if (login.length < 5) {
            loginError.textContent = "Логін повинен містити мінімум 5 символів";
            valid = false;
        } else {
            loginError.textContent = "";
        }

   
        const name = document.getElementById("register-name").value;
        const nameError = document.getElementById("name-error");
        if (!/^[a-zA-Zа-яА-Я]+$/.test(name)) {
            nameError.textContent = "Ім'я повинно містити лише літери";
            valid = false;
        } else {
            nameError.textContent = "";
        }

        const email = document.getElementById("register-email").value;
        const emailError = document.getElementById("email-error");
        const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailPattern.test(email)) {
            emailError.textContent = "Введіть правильний email";
            valid = false;
        } else {
            emailError.textContent = "";
        }

        const password = document.getElementById("register-password").value;
        const passwordError = document.getElementById("password-error");
        const passwordPattern = /^(?=.*[A-Z])(?=.*\d).{8,}$/;
        if (!passwordPattern.test(password)) {
            passwordError.textContent = "Пароль повинен містити мінімум 8 символів, одну велику літеру та одну цифру";
            valid = false;
        } else {
            passwordError.textContent = "";
        }

        const dob = document.getElementById("register-dob").value;
        const dobError = document.getElementById("dob-error");
        const currentDate = new Date().toISOString().split("T")[0];
        if (dob >= currentDate) {
            dobError.textContent = "Дата народження не може бути в майбутньому";
            valid = false;
        } else {
            dobError.textContent = "";
        }

        if (valid) {
            const phone = document.getElementById("register-phone").value;
            registerUser(login, name, email, password, phone, dob); 
        }
    });


    async function registerUser(login, name, email, password, phone, dob) {
        try {
            const response = await fetch('/register', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ login, name, email, password, phone, dob }) 
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
    }


    function showModal(modal) {
        modal.style.display = "block";
    }

    function closeModal(modal) {
        modal.style.display = "none";
    }


    loginLink.addEventListener("click", function () {
        showModal(loginForm);
    });


    registerLink.addEventListener("click", function () {
        showModal(registerForm);
    });

 
    const forgotPasswordLink = document.getElementById("forgot-password-link");
    forgotPasswordLink.addEventListener("click", function () {
        showModal(resetPasswordForm);
    });

    closeButtons.forEach(button => {
        button.addEventListener("click", function () {
            closeModal(button.closest(".modal"));
        });
    });


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
                profileNameSpan.textContent = newName; 
            } else {
                const errorText = await response.text(); 
                alert(errorText); 
            }
        } catch (error) {
            console.error('Помилка:', error);
            alert('Сталася помилка при оновленні профілю.');
        }
    });
});
