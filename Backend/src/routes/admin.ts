import { Router } from "express";
import reportPostHandler from "../handlers/reportPostHandler";
import viewPostHandler from "../handlers/admin/viewPostHandler";
import postRouter from "./posts";
import { createAdminHandler } from "../handlers/createAdminHandler";
import { adminLoginHandler } from "../handlers/adminLoginHandler";
import { adminMiddleware } from "../middlewares/auth";
import { adminDeletePostHandler } from "../handlers/deletePostHandler";
import { viewUsersHandler } from "../handlers/viewUsersHanlder";
import { adminDeleteCommentHandler } from "../handlers/deleteCommentHandler";
import { adminInfoHandler } from "../handlers/adminInfoHandlert";
import { checkAdminAuth } from "../handlers/checkAdminHandler";
import { adminLogoutHandler } from "../handlers/adminLogoutHandler";
import { createForumhandler } from "../handlers/forums/createForumHandler";
import { getAllForumsHandler } from "../handlers/forums/getAllForumsHandler";
import { searchForumHandler } from "../handlers/forums/searchForumHandler";
import { adminDeletePostForumHandler } from "../handlers/forums/adminDeletePostForumHandler";
import { adminDeleteCommentForumHandler } from "../handlers/forums/adminDeleteCommentForumhandler";
import { adminDeleteThreadHandler } from "../handlers/forums/adminDeleteThreadHandler";
import { adminDeleteForumHandler } from "../handlers/forums/adminDeleteForumHandler";
import { editForumAdminHandler } from "../handlers/forums/editForumAdminHandler";
import { getAllThreadsFromAForumHandler } from "../handlers/forums/getAllThreadsFromAForumHandler";
import { adminGetForumRequestHandler } from "../handlers/forums/adminGetForumRequestHandler";
import { adminApproveForumHandler } from "../handlers/forums/adminApproveForumRequestHandler";
import { adminRejectForumRequestHandler } from "../handlers/forums/adminRejectForumRequestHandler";
import { adminGetRejectedForumRequestHandler } from "../handlers/forums/adminGetRejectedForumRequestHandler";
import { getAllCommentsFromAPostHandler } from "../handlers/forums/getAllCommentsFromAPostHandler";
import { getAllUsersStatsHandler, getUserStatsHandler } from "../handlers/userStatsHandler";
import { getDailyTimeSpentHandler } from '../handlers/timeTrackingHandler';
import { timeTrackingService } from "../services/timeTrackingService";
import viewProfileHanler from "../handlers/viewProfileHandler";
import { adminGetReportedPostsCommentsThreadsHandler } from "../handlers/forums/adminGetReportedPostsCommentsThreadsHandler";
import { getAllPostsFromAThreadHandler } from "../handlers/forums/getAllPostsFromAThreadHandler";
import { pageViewHandler } from "../handlers/admin/pageViewsHandler";
import { adminUnreportContentHandler } from "../handlers/forums/adminUnreportContentHandler";
import { backupWeaviateData } from "../lib/weaviateBackupCron";

const adminRouter: Router = Router();

// create admin
adminRouter.post("/create-admin", createAdminHandler)

// admin login
adminRouter.post("/signin", adminLoginHandler)

adminRouter.use(adminMiddleware)

// check auth of admin
adminRouter.get("/check", checkAdminAuth)

adminRouter.post("/logout", adminLogoutHandler)

// view admin info
adminRouter.get("/view-admin-info", adminInfoHandler)

// delete a post
adminRouter.use("/delete", postRouter)

// view posts
adminRouter.use("/view-posts", viewPostHandler)

// delete a post
adminRouter.delete("/delete-post/:postId", adminDeletePostHandler)

// view reported posts
adminRouter.use("/report", reportPostHandler)

// view profile handler
adminRouter.use("/view-profile", viewProfileHanler)

// view user count and user list
adminRouter.get("/view-users", viewUsersHandler)

// comment get handler
// adminRouter.get("/comment/:id", getCommentHandler)

// delete comment
adminRouter.delete("/comment/:postId/:commentId", adminDeleteCommentHandler)

// create forum
adminRouter.post("/create-forum", createForumhandler)

// get all forums
adminRouter.get("/get-forums", getAllForumsHandler)

// get all threads in a forum
adminRouter.get("/get-threads/:forumId", getAllThreadsFromAForumHandler)

// get all posts in a thread
adminRouter.get("/get-thread-posts/:threadId/:page", getAllPostsFromAThreadHandler)

// get forums comments 
adminRouter.get("/get-comments/:postId", getAllCommentsFromAPostHandler)

// delete post
adminRouter.delete("/delete-post/:mongoId/:weaviateId", adminDeletePostForumHandler)

// search forums
adminRouter.get("/search-forums/:query", searchForumHandler)

// delete comments
adminRouter.delete("/delete-comment/:mongoId/:weaviateId", adminDeleteCommentForumHandler)

// delete thread
adminRouter.delete("/delete-thread/:mongoId/:weaviateId", adminDeleteThreadHandler)

// delete forum
adminRouter.delete("/delete-forum/:mongoId/:weaviateId", adminDeleteForumHandler)

// edit forum
adminRouter.put("/edit-forum/:mongoId/:weaviateId", editForumAdminHandler)

// get requested forums
adminRouter.get("/requested-forums", adminGetForumRequestHandler)

// approve requested forums
adminRouter.post("/approve-forum/:requestId", adminApproveForumHandler)

// reject requested forums
adminRouter.post("/reject-forum/:requestId", adminRejectForumRequestHandler)

// get rejected forums
adminRouter.get("/rejected-forums", adminGetRejectedForumRequestHandler)

// get all users stats (admin only)
adminRouter.get("/stats", getAllUsersStatsHandler);

// get specific user stats (admin only)
adminRouter.get("/stats/:userId", getUserStatsHandler);

// Change the route to be more specific and avoid conflict with user ID routes
adminRouter.get('/stats/daily-time/:date', getDailyTimeSpentHandler);

adminRouter.get('/stats/page-views/:date', pageViewHandler);

// get reported forums content
adminRouter.get("/reported-content", adminGetReportedPostsCommentsThreadsHandler)

// unreport forum content
adminRouter.put("/unreport-content/:id", adminUnreportContentHandler)

// trigger weaviate backup
adminRouter.post("/trigger-weaviate-backup", async (req, res) => {
  try {
    await backupWeaviateData();
    res.json({ message: "Backup completed successfully" });
  } catch (error) {
    res.status(500).json({ error: "Backup failed" });
  }
});

export default adminRouter;