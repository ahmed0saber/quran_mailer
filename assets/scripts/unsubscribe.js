const getUserIdFromUrlParams = () => {
    const queryString = window.location.search
    const urlParams = new URLSearchParams(queryString)
    const userId = urlParams.get('id')

    return userId
}

const unsubscribeUser = () => {
    const userId = getUserIdFromUrlParams()
    console.log(userId)

    // fetch("http://54.242.5.95/unsubscribe/", {
    //     method: "POST",
    //     body: JSON.stringify({
    //         email: emailField.value
    //     }),
    //     headers: {
    //         "Content-type": "application/json; charset=UTF-8"
    //     }
    // })
    // .then(res => res.json())
    // .then(data => {
    //     window.location.href = "../../success/"
    // })
}
unsubscribeUser()