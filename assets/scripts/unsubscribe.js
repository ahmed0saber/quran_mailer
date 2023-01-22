const getUserIdFromUrlParams = () => {
    const queryString = window.location.search
    const urlParams = new URLSearchParams(queryString)
    const userId = urlParams.get('id')

    return userId
}

const unsubscribeUser = () => {
    const userId = getUserIdFromUrlParams()

    fetch(`http://54.242.5.95/unsubscribe/${userId}/`, {
        method: "POST",
        body: JSON.stringify({}),
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