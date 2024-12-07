export class CustomError extends Error {
  statusCode: number;
  constructor(message: string, statusCode: number) {
    super(message);
    this.statusCode = statusCode;
  }
}

export class CustomDatabaseError extends Error {
  constructor(message: string) {
    super(message);
  }
}

export class ArticleError extends Error {
  constructor(message: string) {
    super(message);
  }
}

export class ArticleFormError extends Error {
  article: {
    title: string;
    content: string;
  };
  constructor(
    article: {
      title: string;
      content: string;
    },
    message: string
  ) {
    super(message);
    this.article = article;
  }
}
