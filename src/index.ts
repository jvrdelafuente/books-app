import "reflect-metadata";
import { __prod__ } from "./constants";
import { createConnection } from "typeorm";
import express from "express";
import { ApolloServer } from "apollo-server-express";
import { buildSchema } from "type-graphql";
import { HelloResolver } from "./resolvers/hello";
import { BookResolver } from "./resolvers/book";
import { Book } from "./entities/Book";
import { User } from "./entities/User";
import { UserResolver } from "./resolvers/user";
import redis from "redis";
import session from "express-session";
import ConnectRedis from "connect-redis";
import { MyContext } from "./types";

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
    entities: [Book, User],
  });

  const app = express();

  const RedisStore = ConnectRedis(session);
  const redisClient = redis.createClient();

  app.use(
    session({
      name: "qid",
      store: new RedisStore({
        client: redisClient,
        disableTouch: true,
      }),
      cookie: {
        maxAge: 1000 * 60 * 60 * 24 * 365 * 10,
        httpOnly: true,
        secure: __prod__, //cookie only works in https
        sameSite: "lax", //csrf
      },
      saveUninitialized: false,
      secret: "fdgurgtyrbehhdfbs435hbfi%7^",
      resave: false,
    })
  );

  const apolloServer = new ApolloServer({
    schema: await buildSchema({
      resolvers: [HelloResolver, BookResolver, UserResolver],
      validate: false,
    }),
    context: ({ req, res }): MyContext => ({ req, res }),
  });

  apolloServer.applyMiddleware({ app });

  app.listen(4000, () => {
    console.log("Server started on 4000");
  });

  // const book = Book.create({ title: "My first book" });
  // await Book.save(book);
};

main();
