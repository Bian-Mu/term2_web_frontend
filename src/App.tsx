import { useEffect, useState } from 'react'
import './index.css'
import type { qa } from './qa'
import QABox from './component/QABox'


const App: React.FC = () => {
  const [press, setPress] = useState<boolean>(false)
  const [qas, setQAs] = useState<qa[] | null>(null)

  useEffect(() => {

  }, [press])

  const onClick = () => {
    setPress(!press)
  }

  return (
    <div id='full-page' className='bg-foreground w-full h-full text-background relative'>
      <div className='absolute top-1/12 left-1/12 font-bold text-4xl text-red-800'>
        <span>低谷练习</span>
      </div>
      <div className='w-1/2 h-1/2 absolute top-9/20 left-1/2 translate-[-50%] p-3 rounded-xl border-5 border-foreground  outline-5 bg-[#aad6fa] outline-white'>
        {/* <QABox /> */}
      </div>
      <button onClick={onClick} className={(press ? `right-1/5 ` : `right-0 `) + `text-gray-500 py-1 px-1.5 border-y-2 rounded-y-xl rounded-l-xl border-l-2 border-r-0 border-[#a4f9a4] bg-[#f0ff92] absolute right-0 top-1/12 `}>
        答题情况
      </button>
      {press ? <div className='z-2 bg-[#FFF2E2] w-1/5 h-full absolute right-0'>
        正确率
      </div> : ""}
    </div>
  )
}

export default App
