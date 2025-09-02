import { useState } from "react"
import type { qa } from "../qa"

interface QABoxProps {
    qas: qa[]
}

const QABox: React.FC<QABoxProps> = ({ qas }) => {
    const length = qas.length
    const [index, setIndex] = useState<number>(length % (Math.floor(100 * Math.random())))

    return (
        <div className='w-full h-full'>
            <p id='question' className='text-xl h-2/5 mt-5 mx-3'>
                这是问题
                {/* {qas[index].id + `. ` + qas[index].text} */}
            </p>
            <div id='answer' className='grid place-items-center grid-cols-2 h-2/5 text-lg'>
                <label className='w-3/4 h-3/4'>
                    <input
                        type="radio"
                        name="sex"
                        value="1"
                        className="hidden peer"
                    />
                    <div className="flex items-center justify-center w-full h-full rounded-4xl border-5 border-white 
                    bg-foreground peer-checked:bg-[#fff67f] cursor-pointer">
                        A: awdaddd
                    </div>
                </label>

            </div>
        </div>
    )
}


export default QABox