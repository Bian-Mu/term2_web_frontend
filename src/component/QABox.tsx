import { useState } from "react"
import type { option, qa } from "../lib/qa"
import axios from "axios"

interface QABoxProps {
    qas: qa[]
}

const numToLetter = ['A', 'B', 'C', 'D']

const OptionBox: React.FC<{
    option: option
    type: "single_select" | "multi_select"
    selected: number[]
    setSelected: (val: number[]) => void
}> = ({ option, type, selected, setSelected }) => {
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (type === "multi_select") {
            if (e.target.checked) {
                setSelected([...selected, option.order])
            } else {
                setSelected(selected.filter((v) => v !== option.order))
            }
        } else {
            setSelected([option.order])
        }
    }

    return (
        <label className="w-3/4 h-3/4">
            <input
                type={type === "multi_select" ? "checkbox" : "radio"}
                name="question"
                value={option.order}
                checked={selected.includes(option.order)}
                onChange={handleChange}
                className="hidden peer"
            />
            <div
                className="p-3 flex items-center justify-center w-full h-full  border-5 border-gray-400
                    bg-foreground peer-checked:bg-[#ffdc6b] peer-checked:text-black cursor-pointer text-lg"
            >
                {numToLetter[option.order] + "、"}{option.content}
            </div>
        </label>
    )
}

const QABox: React.FC<QABoxProps> = ({ qas }) => {
    const length = qas.length
    const [index, setIndex] = useState<number>(
        length % Math.floor(100 * Math.random())
    )
    const [selected, setSelected] = useState<number[]>([])
    const [showCorrect, setShowCorrect] = useState(false)
    const [result, setResult] = useState<null | boolean>(null)


    const currentQA = qas[index]

    const handleConfirm = () => {
        const correctOptions = currentQA.options
            .filter((o) => o.is_correct)
            .map((o) => o.order)

        const isCorrect =
            correctOptions.length === selected.length &&
            correctOptions.every((o) => selected.includes(o))

        setResult(isCorrect)
        setShowCorrect(true)
    }

    const handleNext = async () => {
        if (result !== null) {
            try {
                const res = await axios.get("http://localhost:8000/api/v1/sheet/report", {
                    params: {
                        problem_id: currentQA.id,
                        correct: result
                    }
                })
                if (res.status !== 200) {
                    console.log("上报出错")
                }
            } catch (err) {
                throw err
            }
        }

        setIndex((prev) => (prev + 1) % length)
        setSelected([])
        setShowCorrect(false)
        setResult(null)
    }

    const basicCss = 'grid place-items-center grid-cols-2 '

    return (
        <div className='w-full h-full relative bg-orange-50'>
            <p id="type" className='text-xl h-fit  text-black opacity-30'>
                {currentQA.type === "multi_select" ? "（多选题）" : "（单选题）"}
            </p>
            <p id='question' className='text-2xl h-4/15 mt-6 mx-10 text-black '>
                {currentQA.content}
            </p>
            <div id='answer' className={currentQA.options.length > 2 ? basicCss + " h-3/10" : basicCss + " h-3/20"}>
                {currentQA.options && currentQA.options.map((option) => (
                    <OptionBox
                        key={option.order}
                        option={option}
                        type={currentQA.type}
                        selected={selected}
                        setSelected={setSelected}
                    />
                ))}
            </div>
            {showCorrect && (
                <div className="mt-4 p-2 mx-9 ">
                    <p className="font-bold text-black border-b-1">
                        正确答案：
                        {currentQA.options
                            .filter((o) => o.is_correct)
                            .map((o) => numToLetter[o.order] + "、" + o.content)
                            .join("；")}
                    </p>
                </div>
            )}

            <div className="w-full absolute bottom-8 grid grid-cols-7 ">
                <button
                    className="col-start-2 col-end-4 basis-1/5  py-3 mx-12 bg-blue-400 text-white rounded-4xl"
                    onClick={handleConfirm}
                >
                    确认
                </button>
                <button
                    className="col-start-5 col-end-7 basis-1/5 py-3 mx-12 bg-gray-700 text-white rounded-4xl"
                    onClick={handleNext}
                >
                    下一题
                </button>
            </div>
        </div>
    )
}


export default QABox