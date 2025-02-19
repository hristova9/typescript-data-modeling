export class Post {
  constructor(
    public id: number,
    public username: string,
    public title: string,
    public content: string,
    public authorId: number
  ) {}
}