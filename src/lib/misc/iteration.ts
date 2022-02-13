export function range(size: number): number[] {
    return Array.from(Array(size).keys())
}

export const flatten = <T>(arrays: T[][]) => [].concat.apply([], arrays) as T[]