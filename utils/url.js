const getUrlParam = ({ param, defaultValue } = {}) => {
    const queryString = window.location.search
    const urlParams = new URLSearchParams(queryString)
    const currentParam = urlParams.get(param) || defaultValue

    return currentParam
}

export { getUrlParam }
