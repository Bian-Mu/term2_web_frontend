import { useState } from "react"
import type { option, qa } from "../lib/qa"
import axios from "axios"

interface QABoxProps {
    qas: qa[]
}

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
                className="flex items-center justify-center w-full h-full rounded-4xl border-5 border-white 
                    bg-foreground peer-checked:bg-[#ffed85] cursor-pointer"
            >
                {option.content}
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
                const res = await axios.get("/api/v1", {
                    params: {
                        id: index,
                        result: result
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



    return (
        <div className='w-full h-full'>
            <p id='question' className='text-xl h-2/5 mt-5 mx-3'>
                {currentQA.id + `. ` + currentQA.content}
            </p>
            <div id='answer' className='grid place-items-center grid-cols-2 h-2/5 text-lg'>
                {currentQA.options.map((option) => (
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
                <div className="mt-4 p-2">
                    <p className="font-bold">
                        正确答案：
                        {currentQA.options
                            .filter((o) => o.is_correct)
                            .map((o) => o.content)
                            .join("，")}
                    </p>
                </div>
            )}
            <div className="flex gap-4 mt-6">
                <button
                    className="px-4 py-2 bg-blue-500 text-white rounded"
                    onClick={handleConfirm}
                >
                    确认
                </button>
                <button
                    className="px-4 py-2 bg-green-500 text-white rounded"
                    onClick={handleNext}
                >
                    下一题
                </button>
            </div>
        </div>
    )
}


export default QABox