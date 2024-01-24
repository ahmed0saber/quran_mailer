const getUrlParam = ({ param, defaultValue } = {}) => {
    const queryString = window.location.search
    const urlParams = new URLSearchParams(queryString)
    const currentParam = urlParams.get(param) || defaultValue

    return currentParam
}

const getParamFromUrl = ({ param, url } = {}) => {
    const fullUrl = new URL(url)
    const currentParam = fullUrl.searchParams.get(param)

    return currentParam
}

export { getUrlParam, getParamFromUrl }
