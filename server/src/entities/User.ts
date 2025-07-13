import { Field, ObjectType } from 'type-graphql';
import { BaseEntity, Column, CreateDateColumn, Entity, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';
import { Post } from './Post';
import { Updoot } from './Updoot';

//! this is description of the entities different properties have
@ObjectType()
@Entity()
export class User extends BaseEntity {
	@Field()
	@PrimaryGeneratedColumn()
	id!: number;

	@Field()
	@Column({ unique: true })
	username!: string;

	@Field()
	@Column({ unique: true })
	email!: string;

	//! no field prop, because NOT return in a mutation, only can set it /can't expose it/ 
	@Column()
	password!: string;
	
	@OneToMany(() => Post, (post) => post.creator)
	posts: Post[]

	@OneToMany(() => Updoot, (updoot) => updoot.user)
	updoots: Updoot[]

	@Field(() => String)
	@CreateDateColumn()
	createdAt: Date;

	@Field(() => String)
	@UpdateDateColumn()
	updatedAt: Date;

}
