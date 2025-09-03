import { useEffect, useState } from 'react'
import './index.css'
import type { qa } from './lib/qa'
import QABox from './component/QABox'
import axios from 'axios'
import Statistics from './component/Statistics'

interface group {
  id: string,
  name: string,
  count: number,
}

const App: React.FC = () => {
  const [press, setPress] = useState<boolean>(false)
  const [qas, setQAs] = useState<qa[] | null>(null)
  const [group, setGroup] = useState<group[] | null>(null)

  useEffect(() => {
    const fetchGroups = async () => {
      try {
        const groupRes = await axios.get<group[]>("/api/v1/problem/list_set")
        setGroup(groupRes.data as group[])
        return groupRes.data
      } catch (err) {
        console.error("获取分组失败:", err)
        return []
      }
    }

    const fetchQAs = async (groups: group[]) => {
      if (groups && groups.length > 0) {
        try {
          const qasRes = await axios.get<qa[]>("http://localhost:8000/api/v1/problem/get", {
            params: {
              page_size: 0,
            }
          })
          setQAs(qasRes.data)
        } catch (err) {
          console.error("获取问题失败:", err)
        }
      }
    }

    const fetchData = async () => {
      const groups = await fetchGroups()
      await fetchQAs(groups)
    }

    fetchData()
  }, [press])

  const onClick = () => {
    setPress(!press)
  }

  return (
    <div id='full-page' className='bg-foreground w-full h-full text-background relative overflow-hidden'>
      <div className='absolute top-1/12 left-1/12 font-bold text-4xl text-blue-400 '>
        <span>低谷练习</span>
      </div>
      <div className='w-3/5 h-2/3 absolute top-1/2 left-1/2 translate-[-50%] p-3 rounded-xl border-5 border-foreground  outline-5 bg-[#ffffff] outline-white'>
        {qas ? <QABox qas={qas} /> : ""}
      </div>
      <button onClick={onClick} className={(press ? `right-3/20 ` : `right-0 `) + `font-bold text-lg text-foreground py-1 px-1.5 border-y-2 rounded-y-xl rounded-l-xl border-l-2 border-r-0 border-[#e3f7ff] bg-[#f9debe] absolute right-0 top-1/12 `}>
        已答情况
      </button>
      {press && qas ? <div className='z-2 bg-orange-50 w-3/20 h-full absolute right-0 overflow-y-scroll'>
        <Statistics qas={qas} />
      </div> : ""}
    </div>
  )
}

export default App
