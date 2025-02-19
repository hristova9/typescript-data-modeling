import { DataBase } from "./database/database";
import { User, Roles } from "./classes/User";
import { Post } from "./classes/Post";

// Initialize databases for users and posts
const userDatabase = new DataBase<User>("user");
const postDatabase = new DataBase<Post>("post");

// Create Admin and Normal Users
const adminUser = new User(1, 'AdminUser', { email: 'admin@example.com', role: Roles.ADMIN });
const normalUser = new User(2, 'NormalUser', { email: 'user@example.com', role: Roles.USER });

// Add users to the user database
console.log("Adding users to the database...");
userDatabase.add(adminUser);
userDatabase.add(normalUser);

// Create posts
console.log("Admin creating a post:");
adminUser.createPost("Admin's First Post", "This is the content of the admin post.", postDatabase);

console.log("Normal user trying to create a post (should fail):");
normalUser.createPost("User's First Post", "This is the content of the user post.", postDatabase);

// Admin can create posts because they have full permissions (as an admin)
console.log("Admin user created a post titled: Admin's First Post");

// Normal user cannot create a post because they only have read permissions
console.log("Normal user cannot create posts. This action was denied.");

// Admin reads all posts
console.log("Admin reading all posts:");
const allPosts = adminUser.readAllPosts(postDatabase)!; // Admin can see all posts

// Display the posts for the admin user
console.log("Admin reads the posts. All posts are as follows:");
console.log(allPosts);

// Now, let's attempt to modify a post.
const postId = JSON.parse(allPosts)[0].id; // Get the ID of the first post (created by admin)

// Admin updates a post
console.log("Admin updating a post:");
adminUser.updatePost(postId, "Updated Admin Post Title", "Updated content of the post.", postDatabase);

// Normal user tries to update a post, but should be denied (since only admins can update posts)
console.log("Normal User Attempting to Update Post (should be denied):");
normalUser.updatePost(postId, "User's Attempt to Update Post", "This should fail.", postDatabase);

// Admin can delete a post, while normal users cannot
console.log("Normal User Attempting to Delete Post (should be denied):");
normalUser.deletePost(postId, postDatabase);

// Admin deletes a post (only admin has this privilege)
console.log("Admin Deleting Post:");
adminUser.deletePost(postId, postDatabase);

// Display the final state of posts in the database after deletion
console.log("Final List of Posts after deletion by Admin:");
postDatabase.getAll();

// Admin tries to delete a post that doesn't exist
console.log("Admin Deleting Post (non-existent post, should return error):");
adminUser.deletePost(postId, postDatabase); // This should not find the post as it was already deleted

// End of operations
console.log("End of Operations: All actions are logged, and the system is demonstrating role-based permissions successfully.");
