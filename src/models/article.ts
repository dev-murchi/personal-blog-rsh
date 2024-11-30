export class Article {
  title: string;
  content: string;
  author: string;
  publishDate: string;
  id: number | undefined;
  constructor(
    title?: string,
    content?: string,
    date?: string,
    author?: string,
    id?: number
  ) {
    this.id = !id ? undefined : id > 0 ? id : undefined;
    this.title = title ? title : "";
    this.content = content ? content : "";
    this.author = author ? author : "";
    this.publishDate = date ? date : "";
  }
}
