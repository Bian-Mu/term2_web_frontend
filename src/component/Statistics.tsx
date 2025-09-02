import { useState } from "react"
import type { qa } from "../qa"

interface StatisticsProps {
    qas: qa[]
}

const Statistics: React.FC<StatisticsProps> = ({ qas }) => {


    return (
        <div className='w-full h-full'>
            {qas.map((qa, index) => {
                return (
                    <div>

                    </div>
                )
            })}
        </div>
    )
}


export default Statistics