import type { qa } from "../lib/qa"

interface StatisticsProps {
    qas: qa[]
}

const Statistics: React.FC<StatisticsProps> = ({ qas }) => {
    // let sortedQAS = qas.sort((a, b) => a.total_content - b.total_content)

    return (
        <div className='w-full h-full'>
            {typeof qas === typeof Array && qas.map((qa) => {
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