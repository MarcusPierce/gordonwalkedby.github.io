interface InsideJSON {
    Articles: ArticleCollection[]
}

interface Article {
    Title: string,
    FileName: string,
    Tags: string[]
}

interface ArticleCollection {
    Name: string,
    Articles: Article[]
}
