import "dotenv/config";
import { Article } from "../models/article";
import { DBService } from "./db.service";
import { ArticleError, CustomError } from "../models/custom-error";

class ArticleService {
  private _db: DBService | null = null;
  constructor() {
    console.log({
      DB_HOST: process.env.DB_HOST,
      DB_PORT: process.env.DB_PORT,
      DB_NAME: process.env.DB_NAME,
      DB_USER: process.env.DB_USER,
      DB_PASSKEY: process.env.DB_PASSKEY,
    });
    if (
      process.env.DB_HOST &&
      process.env.DB_PORT &&
      !isNaN(parseInt(process.env.DB_PORT)) &&
      process.env.DB_NAME &&
      process.env.DB_USER &&
      process.env.DB_PASSKEY
    ) {
      this._db = new DBService({
        host: process.env.DB_HOST,
        port: parseInt(process.env.DB_PORT),
        database: process.env.DB_NAME,
        user: process.env.DB_USER,
        password: process.env.DB_PASSKEY,
      });
    }
  }

  async getArticles(): Promise<Article[]> {
    try {
      if (this._db === null) {
        throw new CustomError("Could not connected to DB", 500);
      }

      await this._db.connect();
      const text = `SELECT 
        ${process.env.DB_TARTICLE_TITLE} as title, 
        ${process.env.DB_TARTICLE_SLUG} as slug, 
        ${process.env.DB_TARTICLE_CONTENT} as content, 
        ${process.env.DB_TARTICLE_AUTHOR} as author,  
        ${process.env.DB_TARTICLE_UPDATE_DATE} as date
      FROM ${process.env.DB_TARTICLE};`;

      const articles = await this._db.query<Article>({
        text: text.trim(),
        values: [],
      });
      await this._db.disconnect();
      return articles.data;
    } catch (error) {
      throw error;
    }
  }

  async getArticle(slug: string): Promise<Article[]> {
    try {
      if (this._db === null) {
        throw new CustomError("Could not connected to DB", 500);
      }

      const articleSlug = slug.trim();
      if (!articleSlug) {
        return [];
      }

      await this._db.connect();
      const text = `SELECT 
        ${process.env.DB_TARTICLE_TITLE} as title, 
        ${process.env.DB_TARTICLE_SLUG} as slug, 
        ${process.env.DB_TARTICLE_CONTENT} as content, 
        ${process.env.DB_TARTICLE_AUTHOR} as author,  
        ${process.env.DB_TARTICLE_UPDATE_DATE} as date
      FROM ${process.env.DB_TARTICLE} 
      WHERE ${process.env.DB_TARTICLE_SLUG}=$1;`;

      const article = await this._db.query<Article>({
        text: text.trim(),
        values: [articleSlug],
      });
      await this._db.disconnect();
      return article.data;
    } catch (error) {
      throw error;
    }
  }

  async save(
    article: Article
  ): Promise<{ data: Article[]; error: string | null }> {
    try {
      if (this._db === null) {
        throw new CustomError("Could not connected to DB", 500);
      }

      const title = article.title.trim();
      const content = article.content.trim();
      const author = article.author.trim();
      const slug = `a-${Math.floor(Math.random() * 1000)}`;

      if (!title) {
        throw new ArticleError("Please provide the title of the article!");
      }
      if (!content) {
        throw new ArticleError("Please provide the content of the article!");
      }
      if (!author) {
        throw new ArticleError("Please provide the author of the article!");
      }

      await this._db.connect();
      let text = `SELECT COUNT(${process.env.DB_TARTICLE_SLUG}) FROM ${process.env.DB_TARTICLE} WHERE ${process.env.DB_TARTICLE_SLUG}=$1;`;

      const isExist = await this._db.query<{ count: string }>({
        text: text.trim(),
        values: [slug],
      });

      if (parseInt(isExist.data[0].count) !== 0) {
        throw new ArticleError(
          "Article is already exist. Plase change the title!"
        );
      }

      text = `INSERT INTO ${process.env.DB_TARTICLE} (
        ${process.env.DB_TARTICLE_TITLE}, 
        ${process.env.DB_TARTICLE_SLUG}, 
        ${process.env.DB_TARTICLE_CONTENT}, 
        ${process.env.DB_TARTICLE_AUTHOR}, 
        ${process.env.DB_TARTICLE_CREATE_DATE}, 
        ${process.env.DB_TARTICLE_UPDATE_DATE}
      ) 
      VALUES ($1, $2, $3, $4, $5, $6)
      RETURNING
        ${process.env.DB_TARTICLE_TITLE} as title, 
        ${process.env.DB_TARTICLE_SLUG} as slug, 
        ${process.env.DB_TARTICLE_CONTENT} as content, 
        ${process.env.DB_TARTICLE_AUTHOR} as author,  
        ${process.env.DB_TARTICLE_UPDATE_DATE} as date
      ;`;
      const date = new Date().toString();

      const savedArticle = await this._db.query<Article>({
        text: text.trim(),
        values: [title, slug, content, author, date, date],
      });
      await this._db.disconnect();
      if (savedArticle.count === 0) {
        throw new ArticleError("Article could not be saved!");
      }
      return {
        data: savedArticle.data,
        error: null,
      };
    } catch (error) {
      if (error instanceof ArticleError) {
        return {
          data: [],
          error: error.message,
        };
      }
      throw error;
    }
  }

  async delete(slug: string): Promise<Article[]> {
    try {
      if (this._db === null) {
        throw new CustomError("Could not connected to DB", 500);
      }

      const articleSlug = slug.trim();

      if (!articleSlug) {
        return [];
      }

      await this._db.connect();
      const text = `DELETE FROM ${process.env.DB_TARTICLE} 
        WHERE ${process.env.DB_TARTICLE_SLUG}=$1
        RETURNING
          ${process.env.DB_TARTICLE_TITLE} as title, 
          ${process.env.DB_TARTICLE_SLUG} as slug, 
          ${process.env.DB_TARTICLE_CONTENT} as content, 
          ${process.env.DB_TARTICLE_AUTHOR} as author,  
          ${process.env.DB_TARTICLE_UPDATE_DATE} as date
        ;`;
      const deleted = await this._db.query<Article>({
        text: text.trim(),
        values: [articleSlug],
      });
      await this._db.disconnect();
      return deleted.data;
    } catch (error) {
      throw error;
    }
  }

  async update(
    slug: string,
    content: string
  ): Promise<{ data: Article[]; error: string | null }> {
    try {
      if (this._db === null) {
        throw new CustomError("Could not connected to DB", 500);
      }

      const articleSlug = slug.trim();
      const articleContent = content.trim();

      if (!articleContent) {
        throw new ArticleError("Please provide the content of the article!");
      }

      await this._db.connect();

      const text = `UPDATE ${process.env.DB_TARTICLE} 
        SET ${process.env.DB_TARTICLE_CONTENT}=$1 
        WHERE ${process.env.DB_TARTICLE_SLUG}=$2
        RETURNING
          ${process.env.DB_TARTICLE_TITLE} as title, 
          ${process.env.DB_TARTICLE_SLUG} as slug, 
          ${process.env.DB_TARTICLE_CONTENT} as content, 
          ${process.env.DB_TARTICLE_AUTHOR} as author,  
          ${process.env.DB_TARTICLE_UPDATE_DATE} as date
        ;`;

      const updatedArticle = await this._db.query<Article>({
        text: text.trim(),
        values: [articleContent, articleSlug],
      });
      await this._db.disconnect();
      if (updatedArticle.count === 0) {
        throw new ArticleError("Article could not updated!");
      }

      return {
        data: updatedArticle.data,
        error: null,
      };
    } catch (error) {
      if (error instanceof ArticleError) {
        return {
          data: [],
          error: error.message,
        };
      }
      throw error;
    }
  }
}

export const articleService = new ArticleService();
