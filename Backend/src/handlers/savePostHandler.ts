import { Router } from "express";
import { postModel } from "../models/db"; 
import { Request, Response } from "express";

const savePostHandler: Router = Router();  

// Save a post
savePostHandler.post("/:postId", async (req: Request, res: Response) => {
  try {
    const userId = req.user.id;
    const { postId } = req.params;

    const post = await postModel.findById(postId);
    if (!post) {
       res.status(404).json({ message: "Post not found" });
       return
    }

    if (!post.savedBy.includes(userId)) {
      post.savedBy.push(userId);
      await post.save();
    }

    res.status(200).json({ message: "Post saved successfully" });
  } catch (error) {
    console.error("Error saving post:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

// Get all saved posts
savePostHandler.get("/", async (req: Request, res: Response) => {
    try {
      const userId = req.user.id;
      
      const savedPosts = await postModel.find({ savedBy: userId }).sort({ createdAt: -1 })
  
      const postsWithFlags = savedPosts.map((post: any) => ({
        ...post._doc,
        isLiked: post.likes.includes(userId),
        isSaved: true, // Force true since these are saved posts
      }));
  
      res.json(postsWithFlags);
    } catch (error) {
      console.error("Error fetching saved posts:", error);
      res.status(500).json({ message: "Failed to fetch saved posts" });
    }
  });

savePostHandler.delete("/:postId", async (req: Request, res: Response) => {
    try {
      const userId = req.user.id;
      const { postId } = req.params;
  
      const post = await postModel.findById(postId);
      if (!post) {
         res.status(404).json({ message: "Post not found" });
         return
      }
  
      post.savedBy = post.savedBy.filter(id => id.toString() !== userId);
      await post.save();
  
      res.status(200).json({ message: "Post unsaved successfully" });
    } catch (error) {
      console.error("Error unsaving post:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  });

export default savePostHandler;
