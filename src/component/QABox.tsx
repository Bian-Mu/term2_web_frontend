import { useState } from "react"
import type { option, qa } from "../lib/qa"
import axios from "axios"

interface QABoxProps {
    qas: qa[]
}

//映射题目每个选项的编号
const numToLetter = ['A', 'B', 'C', 'D']

//用于设置选项的组件
const OptionBox: React.FC<{
    option: option
    type: "single_select" | "multi_select"
    selected: number[]
    setSelected: (val: number[]) => void
}> = ({ option, type, selected, setSelected }) => {
    //分别为多选题和单选题设置选择逻辑
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
                className="p-3 flex items-center justify-center w-full h-full  border-5 border-white rounded-xl
                    bg-[#ffdaaf] hover:bg-[#ffb36b] peer-checked:bg-[#ffb36b] text-black cursor-pointer text-lg"
            >
                {numToLetter[option.order] + ". "}{option.content}
            </div>
        </label>
    )
}

//答题区域，在接收后端题库后形成题列
const QABox: React.FC<QABoxProps> = ({ qas }) => {
    const length = qas.length
    const [index, setIndex] = useState<number>(
        length % Math.floor(100 * Math.random())
    )
    const [selected, setSelected] = useState<number[]>([])
    const [showCorrect, setShowCorrect] = useState(false)
    const [result, setResult] = useState<null | boolean>(null)


    const currentQA = qas[index]
    //由前端根据选项判断做题结果
    const handleConfirm = () => {
        const correctOptions = currentQA?.options
            .filter((o) => o.is_correct)
            .map((o) => o.order)

        const isCorrect =
            correctOptions.length === selected.length &&
            correctOptions.every((o) => selected.includes(o))

        setResult(isCorrect)
        setShowCorrect(true)
    }

    //将结果发给后端并写入数据库，同时切至下一题
    const handleNext = async () => {
        if (result !== null) {
            try {
                const res = await axios.get("http://127.0.0.1:8000/api/v1/sheet/report", {
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
            <div id="type" className='rounded-lg bg-amber-400 text-xl h-fit w-fit text-black opacity-60'>
                {currentQA.type === "multi_select" ? "（多选题）" : "（单选题）"}
            </div>
            <p id='question' className='text-2xl h-4/15 mt-6 mx-10 text-black '>
                {currentQA.content}
            </p>
            <div id='answer' className={currentQA.options?.length > 2 ? basicCss + " h-3/10" : basicCss + " h-3/20"}>
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
            {/* 展示正确答案 */}
            {showCorrect && (
                <div className="mt-4 p-2 mx-9 ">
                    <p className="font-bold text-black border-b-1">
                        正确答案：
                        {currentQA.options
                            .filter((o) => o.is_correct)
                            .map((o) => numToLetter[o.order] + ". " + o.content)
                            .join("；")}
                    </p>
                </div>
            )}

            <div className="w-full absolute bottom-8 grid grid-cols-7 ">
                <button
                    className=" hover:bg-blue-500 col-start-2 col-end-4 basis-1/5  py-3 mx-12 bg-blue-400 text-white rounded-4xl"
                    onClick={handleConfirm}
                >
                    确认
                </button>
                <button
                    className="hover:bg-gray-800 col-start-5 col-end-7 basis-1/5 py-3 mx-12 bg-gray-700 text-white rounded-4xl"
                    onClick={handleNext}
                >
                    下一题
                </button>
            </div>
        </div>
    )
}


export default QABox