const emailField = document.querySelector(".js-email-input")
const subscribeBtn = document.querySelector(".subscribe-btn")
const EMAIL_REGEX_PATTERN = /^[a-z]\w{2,}@\w{2,}\.\w{2,}$/

const submitSubscriptionForm = () => {
    const isValid = isEmailFieldValid()
    if(!isValid){
        return
    }

    subscribeBtn.classList.add("is-loading")
    fetch("https://quran-mailer-api.onrender.com/subscribe/", {
        method: "POST",
        body: JSON.stringify({
            email: emailField.value,
            active: true
        }),
        headers: {
            "Content-type": "application/json; charset=UTF-8"
        }
    })
    .then(res => res.json())
    .then(data => {
        window.location.href = "../../success/"
    })
    .finally(() => {
        subscribeBtn.classList.remove("is-loading")
    })
}
subscribeBtn.addEventListener("click", submitSubscriptionForm)

const isEmailFieldValid = () => {
    const errorHolder = emailField.closest(".js-input-container").querySelector(".js-error-holder")
    if(emailField.value.trim() === ""){
        errorHolder.textContent = "البريد الالكتروني مطلوب"
        return false
    }
    if(!EMAIL_REGEX_PATTERN.test(emailField.value)){
        errorHolder.textContent = "يرجى ادخال بريد الكتروني صحيح"
        return false
    }
    errorHolder.textContent = ""
    return true
}

emailField.addEventListener("keyup", isEmailFieldValid)