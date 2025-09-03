import type { qa } from "../lib/qa"

interface StatisticsProps {
    qas: qa[]
}

const Statistics: React.FC<StatisticsProps> = ({ qas }) => {
    let lessQAS = qas.filter(qa => qa.total_count !== 0)
    const sortedQAS = lessQAS.sort((a, b) => b.total_count - a.total_count)
    return (
        <div className='w-full h-full px-2 text-sm text-black'>
            {sortedQAS.map((qa, index) => {
                return (
                    <ul key={qa.id} className="border-b-1 my-2 pb-6 relative ">
                        <div>{(index + 1 + "、") + qa.content}</div>
                        <div className="my-1 absolute right-1 bottom-0 ">

                            {qa.correct_count + "/" + qa.total_count}
                        </div>
                    </ul>
                )
            })}
        </div>
    )
}


export default Statistics