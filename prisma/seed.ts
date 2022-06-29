import { PrismaClient } from "@prisma/client";
import { hashPassword } from "../src/utils";
const prisma = new PrismaClient();

async function users() {
    const password = await hashPassword("test family");
    await prisma.user.createMany({
        data: [
            {
                firstName: "mr",
                lastName: "test",
                email: "mrTest@test.com",
                password,
                birthDate: new Date("1960-10-10").toISOString(),
                gender: true,
            },
            {
                firstName: "mrs",
                lastName: "test",
                email: "mrsTest@test.com",
                password,
                birthDate: new Date("1965-10-10").toISOString(),
                gender: false,
            },
            {
                firstName: "test",
                lastName: "jr",
                email: "testJr@test.com",
                password,
                birthDate: new Date("1990-10-10").toISOString(),
                gender: true,
            },
        ],
    });
    console.log("Users ✅");
}

async function posts() {
    await prisma.post.createMany({
        data: [
            { body: "mr test post 1", authorId: 1 },
            { body: "mr test post 1", authorId: 1 },
            { body: "mr test post 3", authorId: 1 },
            { body: "mrs test post 1", authorId: 2 },
            { body: "mrs test post 2", authorId: 2 },
            { body: "mrs test post 3", authorId: 2 },
            { body: "test jr post 1", authorId: 3 },
            { body: "test jr post 2", authorId: 3 },
            { body: "test jr post 3", authorId: 3 },
        ],
    });
    console.log("Posts ✅");
}

async function postImages() {
    await prisma.postImage.createMany({
        data: [
            {
                image: "../src/public/uploads/default.jpg",
                description: "My test jr pic",
                postId: 4,
            },
            {
                image: "../src/public/uploads/default.jpg",
                description: "My test jr pic2",
                postId: 4,
            },
        ],
    });
    console.log("PostsImages ✅");
}

async function savedPosts() {
    await prisma.savedPost.createMany({
        data: [
            { postId: 4, userId: 1 },
            { postId: 4, userId: 3 },
            { postId: 2, userId: 2 },
        ],
    });
    console.log("SavedPosts ✅");
}

async function postReactions() {
    await prisma.postReaction.createMany({
        data: [
            { postId: 4, userId: 1, reaction: true },
            { postId: 4, userId: 3, reaction: true },
            { postId: 1, userId: 2, reaction: true },
            { postId: 1, userId: 3, reaction: false },
            { postId: 2, userId: 2, reaction: true },
            { postId: 7, userId: 1, reaction: true },
        ],
    });
    console.log("PostReactions ✅");
}

async function comments() {
    await prisma.comment.createMany({
        data: [
            { authorId: 1, postId: 4, body: "good pics" },
            { authorId: 2, postId: 4, commentId: 1, body: "thanks" },
            { authorId: 3, postId: 4, body: "looks great" },
            { authorId: 1, postId: 4, commentId: 2, body: "no" },
        ],
    });
    console.log("Comments ✅");
}

async function commentReactions() {
    await prisma.commentReaction.createMany({
        data: [
            { userId: 2, commentId: 2, reaction: true },
            { userId: 2, commentId: 1, reaction: true },
            { userId: 1, commentId: 4, reaction: false },
            { userId: 1, commentId: 1, reaction: true },
            { userId: 2, commentId: 3, reaction: true },
        ],
    });
    console.log("CommentReactions ✅");
}

async function main() {
    await users();
    await posts();
    await postImages();
    await savedPosts();
    await postReactions();
    await comments();
    await commentReactions();
}

main()
    .catch((e) => {
        console.log(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
