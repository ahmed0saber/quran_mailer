const getSurahAyahs = async () => {
    const fs = require('fs')

    console.log("Task started")
    const contentObj = {}

    for (let i = 1; i <= 114; i++) {
        const res = await fetch(`https://api.alquran.cloud/v1/surah/${i}`)
        const data = await res.json()

        console.log(`Loading: ${i}/114`)
        contentObj[i] = {
            name: data.data.name,
            ayahs: data.data.ayahs,
        }
    }

    const content = `const surahAyahs = ${JSON.stringify(contentObj)};
export default surahAyahs;`

    fs.writeFile('./app/api/data/surah-ayahs.js', content, err => {
        if (err) {
            console.error(err)
        } else {
            console.log("Success")
        }
    })
}

getSurahAyahs()
