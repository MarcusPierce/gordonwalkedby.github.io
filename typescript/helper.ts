function RandomInt(a: number, b: number): number {
    if (a == b) { return Math.floor(a) }
    let min = Math.round(Math.min(a, b)) - 0.49
    let max = Math.round(Math.max(a, b)) + 0.49
    let rnd = Math.random()
    return Math.round(rnd * (max - min) + min)
}

function RandomChoose<T>(array: Array<T>): T {
    let l = array.length
    if (l < 2) {
        return array[0]
    }
    let index = RandomInt(0, l - 1)
    return array[index]
}

function RandomHSLColor(s: number = 100, b: number = 85): string {
    let str = "hsl("
    str += RandomInt(0, 359).toFixed() + ","
    str += s.toFixed() + "%,"
    str += b.toFixed() + "%)"
    return str
}
