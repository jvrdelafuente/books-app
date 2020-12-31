import { User } from "../entities/User";
import { Arg, Field, InputType, Mutation, Resolver } from "type-graphql";
import { hash } from "argon2";

@InputType()
class UsernamePasswordInput {
  @Field()
  username: string;

  @Field()
  password: string;
}
@Resolver()
export class UserResolver {
  @Mutation(() => User)
  async register(@Arg("options") options: UsernamePasswordInput) {
    return User.create({
      username: options.username,
      password: await hash(options.password),
    }).save();
  }
}
