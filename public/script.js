// GLOBAL
const EMAIL_REGEX_PATTERN = /^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$/

// SUBSCRIBE
const subscribeEmailField = document.querySelector(".js-email-input")
const subscribeBtn = document.querySelector(".subscribe-btn")

const submitSubscriptionForm = () => {
    const isValid = isSubscribeEmailFieldValid()
    if(!isValid){
        return
    }

    subscribeBtn.classList.add("is-loading")
    fetch("/api/subscribe", {
        method: "POST",
        body: JSON.stringify({
            email: subscribeEmailField.value,
        }),
        headers: {
            "Content-type": "application/json; charset=UTF-8"
        }
    })
    .then(res => res.json())
    .then(data => {
        window.location.href = "/success"
    })
    .finally(() => {
        subscribeBtn.classList.remove("is-loading")
    })
}
subscribeBtn?.addEventListener("click", submitSubscriptionForm)

const isSubscribeEmailFieldValid = () => {
    const errorHolder = subscribeEmailField.closest(".js-input-container").querySelector(".js-error-holder")
    if(subscribeEmailField.value.trim() === ""){
        errorHolder.textContent = "البريد الالكتروني مطلوب"
        return false
    }
    if(!EMAIL_REGEX_PATTERN.test(subscribeEmailField.value)){
        errorHolder.textContent = "يرجى ادخال بريد الكتروني صحيح"
        return false
    }
    errorHolder.textContent = ""
    return true
}

subscribeEmailField?.addEventListener("keyup", isSubscribeEmailFieldValid)

// CONTACT
const contactNameField = document.querySelector(".js-name-input")
const contactEmailField = document.querySelector(".js-email-input")
const contactMsgField = document.querySelector(".js-msg-input")
const contactBtn = document.querySelector(".contact-btn")
const NAME_REGEX_PATTERN = /^([a-z]|[A-Z])\w{4,}$/

const submitContactForm = () => {
    const isValid = (isContactEmailFieldValid() & isNameFieldValid() & isMsgFieldValid()) === 0 ? false : true
    if(!isValid){
        return
    }

    contactBtn.classList.add("is-loading")
    fetch("/api/contact", {
        method: "POST",
        body: JSON.stringify({
            name: contactNameField.value,
            email: contactEmailField.value,
            message: contactMsgField.value
        }),
        headers: {
            "Content-type": "application/json; charset=UTF-8"
        }
    })
    .then(res => res.json())
    .then(data => {
        window.location.href = "/success"
    })
    .finally(() => {
        contactBtn.classList.remove("is-loading")
    })
}
contactBtn?.addEventListener("click", submitContactForm)

const isNameFieldValid = () => {
    const errorHolder = contactNameField.closest(".js-input-container").querySelector(".js-error-holder")
    if(contactNameField.value.trim() === ""){
        errorHolder.textContent = "اسم المستخدم مطلوب"
        return false
    }
    if(!NAME_REGEX_PATTERN.test(contactNameField.value)){
        errorHolder.textContent = "يرجى ادخال اسم مستخدم صحيح مكون من 5 حروف و ارقام و _ فقط ، بشرط ان يبدء بحرف"
        return false
    }
    errorHolder.textContent = ""
    return true
}

const isContactEmailFieldValid = () => {
    const errorHolder = contactEmailField.closest(".js-input-container").querySelector(".js-error-holder")
    if(contactEmailField.value.trim() === ""){
        errorHolder.textContent = "البريد الالكتروني مطلوب"
        return false
    }
    if(!EMAIL_REGEX_PATTERN.test(contactEmailField.value)){
        errorHolder.textContent = "يرجى ادخال بريد الكتروني صحيح"
        return false
    }
    errorHolder.textContent = ""
    return true
}

const isMsgFieldValid = () => {
    const errorHolder = contactMsgField.closest(".js-input-container").querySelector(".js-error-holder")
    if(contactMsgField.value.trim() === ""){
        errorHolder.textContent = "الرسالة مطلوبة"
        return false
    }
    errorHolder.textContent = ""
    return true
}

contactNameField?.addEventListener("keyup", isNameFieldValid)
contactEmailField?.addEventListener("keyup", isContactEmailFieldValid)
contactMsgField?.addEventListener("keyup", isMsgFieldValid)
