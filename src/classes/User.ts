import { Entity } from "../models/Entity";
import { UserData } from "../models/UserData";
import { Post } from "./Post";
import { Validate } from "../decorators/Validate";
import { DataBase } from "../database/database";
import { Log } from "../decorators/Log";

// Enum for user roles
export enum Roles {
  "ADMIN",
  "USER",
}

// Permissions for different roles
type AdminPermissions = "CREATE" | "READ" | "UPDATE" | "DELETE";
type UserPermissions = "READ";

// Conditional type for access control based on roles
type Permissions<T extends Roles> = T extends Roles.ADMIN
  ? AdminPermissions
  : UserPermissions;

export class User implements Entity<UserData> {
  posts: Post[] = [];
  constructor(
    public id: number,
    public username: string,
    public data: UserData
  ) {
    this.validateUserData();
  }

  // Role getter
  getRole(): Roles {
    return this.data.role;
  }

  getIdUser() {
    return this.id;
  }

  // Validate User Data (constructor checks)
  private validateUserData(): void {
    if (this.id < 1 || typeof this.id !== "number") {
      throw new Error("ID must be a positive number!");
    }
    if (!this.username || this.username.trim().length === 0) {
      throw new Error("Username must not be empty!");
    }
    if (!this.data.email || !this.isEmailValid(this.data.email)) {
      throw new Error(`Hi ${this.username}, your email is not valid!`);
    }
  }

  // Type guard for admin role
  private isAdmin(role: Roles): role is Roles.ADMIN {
    return role === Roles.ADMIN;
  }

  // Perform an action based on permission
  @Log
  performAction(permission: Permissions<Roles>): string {
    if (this.isAdmin(this.data.role)) {
      return `${this.username} is allowed to perform: ${permission}`;
    } else {
      const message = `${this.username} is not allowed to perform: ${permission}!`;
      return `${this.username} is not allowed to perform: ${permission}!`;
    }
  }

  // Validate and update the user email
  @Validate
  updateEmail(newEmail: string): void {
    if (this.isAdmin(this.data.role) && this.isEmailValid(newEmail)) {
      this.data.email = newEmail;
      console.log(`${this.username} updated email to: ${newEmail}!`);
    } else {
      console.log(
        `${this.username} user doesn't have the permission to update the email!`
      );
    }
  }

  // Check if email format is valid
  private isEmailValid(email: string): boolean {
    const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,20}$/;
    return emailRegex.test(email.trim());
  }

  // Create a post only if the user is an admin
  createPost(title: string, content: string, postDatabase: DataBase<Post>) {
    if (this.data.role === Roles.ADMIN) {
      const newPost = new Post(
        Date.now(), // post id
        this.username,
        title as string,
        content as string,
        this.getIdUser()
      );
      postDatabase.add(newPost);
      console.log(`${this.username} created a new post: ${title}!`);
    } else {
      console.log(`${this.username} does not have permission to create posts!`);
    }
  }

  // Read posts (available to both admin and user)
  readAllPosts(postDatabase: DataBase<Post>) {
    console.log(`${this.username} is reading the posts:`);
    const posts = postDatabase.getAll();
    if (posts.length === 0) {
      console.log("No posts available!");
    } else {
      return posts;
    }
  }

  // Delete a post, only allowed for admins
  deletePost(postId: number, postDatabase: DataBase<Post>) {
    const post = postDatabase.getById(postId);
    if (post !== "Can't find such post!") {
      if (
        this.data.role === Roles.ADMIN &&
        JSON.parse(post).authorId === this.id
      ) {
        const result = postDatabase.delete(postId);
        return result;
      } else {
        console.log(
          `${this.username} does not have permission to delete posts!`
        );
      }
    } else {
      return console.log("Can't find such post!");
    }
  }

  // Update post (admin only)
  updatePost(
    postId: number,
    newTitle: string,
    newContent: string,
    postDatabase: DataBase<Post>
  ) {
    const post = postDatabase.getById(postId);
    if (post !== "Can't find such post!") {
      if (this.data.role === Roles.ADMIN && JSON.parse(post).authorId === this.id) {
        const parsedPost = JSON.parse(post);
        if (post) {
          parsedPost.title = newTitle;
          parsedPost.content = newContent;
          return postDatabase.update(parsedPost.id, parsedPost);
        } else {
          console.log(`Post with ID: ${postId} not found!`);
        }
      } else {
        console.log(
          `${this.username} does not have permission to update posts!`
        );
      }
    } else {
      return console.log("Can't find such post!");
    }
  }
}
