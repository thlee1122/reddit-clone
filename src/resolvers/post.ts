
import { Post } from "../entities/Post";
import { MyContext } from 'src/types';
import { Arg, Ctx, Mutation, Query, Resolver } from 'type-graphql';

@Resolver()
export class PostResolver {
  @Query(() => [Post])
  posts(
    // @Ctx() ctx: MyContext
    @Ctx() { em }: MyContext
  ) : Promise<Post[]> {
    // return ctx.em.
    return em.find(Post, {});
  }

  @Query(() => Post, { nullable: true })
  post( 
    @Arg('id') id: number,
    @Ctx() { em }: MyContext 
  ) : Promise<Post | null> {
    return em.findOne(Post, { id });
  }

  //@Mutation is for updating, creating, deleting; anything you are changing things on the server
  @Mutation(() => Post)
  async createPost( 
    @Arg('title') title: string,
    @Ctx() { em }: MyContext 
  ) : Promise<Post> {
    const post = em.create(Post, {title});
    await em.persistAndFlush(post);
    return post 
  }

  @Mutation(() => Post, {nullable: true})
  async updatePost( 
    @Arg('id') id: number,
    @Arg('title', () => String, { nullable: true }) title: string,
    @Ctx() { em }: MyContext 
  ) : Promise<Post | null> {
    const post = await em.findOne(Post, {id});

    if(!post) {
      return null;
    }
    
    if(typeof title !== undefined) {
      post.title = title;
      await em.persistAndFlush(post);
    }
    
    return post;
  }

  @Mutation(() => Boolean)
  async deletePost( 
    @Arg('id') id: number,
    @Ctx() { em }: MyContext 
  ) : Promise<boolean> {
    await em.nativeDelete(Post, {id});
    return true;
  }
}