const getRandomItemFromArray = (arr) => {
    const randomItem = arr[Math.floor((Math.random() * arr.length))]

    return randomItem
}

export { getRandomItemFromArray }
