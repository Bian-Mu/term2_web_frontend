//类型：qa，用于结构化题目
export interface qa {
    id: string,
    content: string,
    type: "single_select" | "multi_select",
    options: option[],
    total_count: number,
    correct_count: number
}

//类型：option，用于为题目设置选项
export interface option {
    id: string,
    content: string,
    order: number,
    is_correct: boolean
}

//类型：group，用于选择数据库中不同的题组
export interface group {
    id: string,
    name: string,
    count: number,
}