import type { qa } from "../lib/qa"

interface StatisticsProps {
    qas: qa[]
}

const Statistics: React.FC<StatisticsProps> = ({ qas }) => {
    const sortedQAS = qas.sort((a, b) => a.total_content - b.correct_count)

    return (
        <div className='w-full h-full'>
            {sortedQAS.map((qa) => {
                return (
                    <ul>
                        {qa.id}
                        {qa.content}
                        正确率：
                        {qa.correct_count / qa.total_content}
                    </ul>
                )
            })}
        </div>
    )
}


export default Statistics