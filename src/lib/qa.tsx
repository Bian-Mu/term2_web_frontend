export interface qa {
    id: string,
    content: string,
    type: "single_select" | "multi_select",
    options: option[],
    total_count: number,
    correct_count: number
}

export interface option {
    id: string,
    content: string,
    order: number,
    is_correct: boolean
}
