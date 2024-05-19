import { useState } from "react"
import "../style.css"

export default function Ayah({ ayah }) {
    const [isHighlighted, setIsHighlighted] = useState(false)

    const toggleHighlight = () => {
        setIsHighlighted(prev => !prev)
    }

    return (
        <>
            <span
                onClick={toggleHighlight}
                className={isHighlighted ? "highlighted" : null}
            >{ayah.text.replace("\n", "")}</span>
            <span class="ayah-number">{ayah.numberInSurah}</span>
        </>
    )
}
