const getUserIdFromUrlParams = () => {
    const queryString = window.location.search
    const urlParams = new URLSearchParams(queryString)
    const userId = urlParams.get('id')

    return userId
}

const unsubscribeUser = () => {
    const userId = getUserIdFromUrlParams()

    fetch("https://quran-mailer-api.onrender.com/unsubscribe/", {
        method: "POST",
        body: JSON.stringify({
            id: userId
        }),
        headers: {
            "Content-type": "application/json; charset=UTF-8"
        }
    })
    .then(res => res.json())
    .then(data => {
        window.location.href = "../../success/"
    })
}
unsubscribeUser()