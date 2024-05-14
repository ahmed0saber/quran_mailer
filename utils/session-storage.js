const getSession = ({ key, defaultValue } = {}) => {
    const storedSession = sessionStorage.getItem(key)
    if (storedSession) {
        return JSON.parse(storedSession)
    }

    return defaultValue
}

const setSession = ({ key, value } = {}) => {
    sessionStorage.setItem(key, JSON.stringify(value))
}

const removeSession = (key) => {
    sessionStorage.removeItem(key)
}

export { getSession, setSession, removeSession }
