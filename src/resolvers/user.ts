import { User } from "../entities/User";
import {
  Arg,
  Field,
  InputType,
  Mutation,
  ObjectType,
  Resolver,
} from "type-graphql";
import { hash, verify } from "argon2";

@InputType()
class UsernamePasswordInput {
  @Field()
  username: string;

  @Field()
  password: string;
}

@ObjectType()
class FieldError {
  @Field()
  field: string;

  @Field()
  message: string;
}

@ObjectType()
class UserResponse {
  @Field(() => [FieldError], { nullable: true })
  errors?: FieldError[];

  @Field(() => User, { nullable: true })
  user?: User;
}

@Resolver()
export class UserResolver {
  @Mutation(() => UserResponse)
  async register(
    @Arg("options") options: UsernamePasswordInput
  ): Promise<UserResponse> {
    if (options.username.length <= 2) {
      return {
        errors: [
          {
            field: "username",
            message: "lenght must be greater than 2",
          },
        ],
      };
    }

    /* TODO - add better password validation */
    if (options.password.length <= 3) {
      return {
        errors: [
          {
            field: "password",
            message: "lenght must be greater than 3",
          },
        ],
      };
    }

    try {
      const user = await User.create({
        username: options.username,
        password: await hash(options.password),
      }).save();

      return { user };
    } catch (err) {
      //duplicate username error
      if (err.code === "23505") {
        return {
          errors: [{ field: "username", message: "Username already exists" }],
        };
      }

      throw err;
    }
  }

  @Mutation(() => UserResponse)
  async login(
    @Arg("options") options: UsernamePasswordInput
  ): Promise<UserResponse> {
    const user = await User.findOne({ username: options.username });
    if (!user) {
      return {
        errors: [{ field: "username", message: "User does not exist" }],
      };
    }

    if (!(await verify(user.password, options.password))) {
      return {
        errors: [{ field: "password", message: "Credentials are not valid" }],
      };
    }

    return { user };
  }
}
