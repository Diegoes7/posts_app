import { Field, ObjectType } from "type-graphql";
import { BaseEntity, Column, CreateDateColumn, Entity, PrimaryGeneratedColumn } from "typeorm";
import { GraphQLJSONObject } from 'graphql-type-json';


@ObjectType()
@Entity({ name: 'audit_logs' })
export class AuditLog extends BaseEntity {
  @Field()
  @PrimaryGeneratedColumn()
  id!: number;

  @Field({ nullable: true })
  @Column({ nullable: true })
  actorId: number; // ID of the user who performed the action

  @Field(() => String)
  @CreateDateColumn()
  createdAt: Date;

  @Field(() => String)
  @Column()
  timestamp: string;

  @Field(() => String)
  @Column()
  event: string; // e.g. "user.registered", "post.created"

  @Field(() => String)
  @Column()
  description: string; // e.g. "User registered with ID 123, name John Doe, track location, get from browser"

  @Field(() => GraphQLJSONObject, { nullable: true })
  @Column({ type: 'jsonb', nullable: true })
  payload: Record<string, any>;
}