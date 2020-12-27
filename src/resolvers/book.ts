import { Book } from "../entities/Book";
import { Query, Resolver } from "type-graphql";

@Resolver()
export class BookResolver {
  @Query(() => [Book])
  books(): Promise<Book[]> {
    return Book.find();
  }
}
