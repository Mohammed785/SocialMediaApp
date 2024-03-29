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
            {
                firstName: "mr",
                lastName: "block",
                email: "block@test.com",
                password,
                birthDate: new Date("2000-10-10").toISOString(),
                gender: true,
            },
            {
                firstName: "mr",
                lastName: "friendRequest",
                email: "request@test.com",
                password,
                birthDate: new Date("2000-10-10").toISOString(),
                gender: true,
            },
        ],
    });
    console.log("Users ✅");
}

async function friendRequests(){
    await prisma.friendRequest.createMany({
        data: [
            {
                senderId: 3,
                receiverId: 1,
                accepted: true,
                acceptTime: new Date().toISOString(),
            },
            {
                senderId: 3,
                receiverId: 2,
                accepted: true,
                acceptTime: new Date().toISOString(),
            },
            {
                senderId: 1,
                receiverId: 2,
                accepted: true,
                acceptTime: new Date().toISOString(),
            },
            {
                senderId: 5,
                receiverId: 1,
                accepted: null,
            },
            {
                senderId: 5,
                receiverId: 2,
                accepted: null,
            },
        ],
    });
    console.log("Friend Requests ✅");
}

async function relations(){
    await prisma.relation.createMany({
        data: [
            { userId: 1, relatedId: 2, friend: true },
            { userId: 2, relatedId: 1, friend: true },
            { userId: 1, relatedId: 3, friend: true },
            { userId: 3, relatedId: 1, friend: true },
            { userId: 3, relatedId: 2, friend: true },
            { userId: 2, relatedId: 3, friend: true },
            { userId: 1, relatedId: 4, friend: false },
            { userId: 2, relatedId: 4, friend: false },
            { userId: 3, relatedId: 4, friend: false },
        ],
    });
    console.log("Friends & Blocks ✅");
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

async function status(){
    await prisma.status.createMany({
        data: [
            { authorId: 1, caption: "1 Status" },
            { authorId: 2, caption: "2 Status" },
        ],
    });
    console.log("Status ✅");
}

async function statusView(){
    await prisma.statusView.createMany({
        data: [
            { viewerId: 2, statusId: 1 },
            { viewerId: 1, statusId: 2 },
            { viewerId: 3, statusId: 1 },
            { viewerId: 3, statusId: 2 },
        ],
    });
    console.log("Status View ✅");
}
async function group() {
    await prisma.group.create({
        data: {
            creatorId: 1,
            name: "test Group",
            description: "our test group",
            image: "test.png",
        },
    });
    console.log("Group ✅");
}

async function groupMembership(){
    await prisma.groupMembership.createMany({
        data: [
            { userId: 1, isAdmin: true, groupId: 1 },
            { userId: 2, isAdmin: false, groupId: 1 },
            { userId: 3, isAdmin: false, groupId: 1 },
        ],
    });
    console.log("Group Membership ✅");
}

async function groupPost(){
    await prisma.post.createMany({
        data: [
            { authorId: 1, groupId: 1, body: "1 group post" },
            { authorId: 2, groupId: 1, body: "2 group post" },
        ],
    });
    console.log("Group Posts ✅");
}

async function main() {
    await users();
    await friendRequests();
    await relations();
    await posts();
    await postImages();
    await savedPosts();
    await postReactions();
    await comments();
    await commentReactions();
    await status()
    await statusView()
    await group()
    await groupMembership()
    await groupPost()
}

main()
    .catch((e) => {
        console.log(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
