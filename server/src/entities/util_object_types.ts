import { User } from "./User"; //* need to be with ../ instead of src/ for some reason ??? 
import { Field, ObjectType } from "type-graphql";

//i return from mutations, after perform action on the entity

@ObjectType()
export class UserResponse {
  @Field(() => [FieldError], { nullable: true })
  errors?: FieldError[];

  @Field(() => User, { nullable: true })
  user?: User;
}

@ObjectType()
export class FieldError {
  @Field()
  field: string;

  @Field()
  message: string;
}