import { Book } from "../entities/Book";
import { Arg, Mutation, Query, Resolver } from "type-graphql";

@Resolver()
export class BookResolver {
  @Query(() => [Book])
  books(): Promise<Book[]> {
    return Book.find();
  }
  @Query(() => Book, { nullable: true })
  book(@Arg("id") id: number): Promise<Book | undefined> {
    return Book.findOne(id);
  }

  @Mutation(() => Book)
  createBook(@Arg("title") title: string): Promise<Book> {
    return Book.create({ title }).save();
  }

  @Mutation(() => Book, { nullable: true })
  async updateBook(
    @Arg("id") id: number,
    @Arg("title") title: string
  ): Promise<Book | null> {
    let book = await Book.findOne(id);
    if (!book) return null;

    if (typeof title !== "undefined") {
      book.title = title;
      await Book.save(book);
    }

    return book;
  }

  @Mutation(() => Boolean)
  async deleteBook(@Arg("id") id: number): Promise<boolean> {
    const deleteResult = await Book.delete(id);
    return !!deleteResult.affected;
  }
}
