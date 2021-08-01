
interface Post {
    FileName: string,
    Title: string,
    ReleaseDateISOStr: string,
    ReleaseDateDisplayStr: string,
    Tags: string[],
    div: HTMLDivElement | null
}
const mainBody = document.getElementsByTagName("main")[0] as HTMLDivElement
