import "reflect-metadata";
import { __prod__ } from "./constants";
import { createConnection } from "typeorm";
import express from "express";
import { ApolloServer } from "apollo-server-express";
import { buildSchema } from "type-graphql";
import { HelloResolver } from "./resolvers/hello";
import { BookResolver } from "./resolvers/book";
import { Book } from "./entities/Book";

const main = async () => {
  await createConnection({
    database: "booksdb",
    type: "postgres",
    username: "postgres",
    host: "localhost",
    port: 5432,
    password: "mysecretpassword",
    logging: true,
    synchronize: true,
    entities: [Book],
  });

  const app = express();

  const apolloServer = new ApolloServer({
    schema: await buildSchema({
      resolvers: [HelloResolver, BookResolver],
      validate: false,
    }),
  });

  apolloServer.applyMiddleware({ app });

  app.listen(4000, () => {
    console.log("Server started on 4000");
  });

  // const book = Book.create({ title: "My first book" });
  // await Book.save(book);
};

main();
