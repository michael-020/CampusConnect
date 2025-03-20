import { useState, useEffect } from "react";
import LikeIcon from "@/icons/LikeIcon";
import MessageIcon from "../icons/MessageIcon";
import SaveIcon from "../icons/SaveIcon";
import { usePostStore } from "../stores/PostStore/usePostStore";
import Threedot from "../icons/Threedot";
import { Comment, Post } from "../lib/utils";
import { axiosInstance } from "@/lib/axios";
import { Loader } from "lucide-react";
import CommentCard from "./CommentCard";
import { useAuthStore } from "@/stores/AuthStore/useAuthStore";
import { useNavigate } from "react-router-dom";

interface PostCardProps {
  post: Post;
  isAdmin?: boolean;
}

export default function PostCard({ post, isAdmin }: PostCardProps) {
  const { toggleLike, toggleSave, addComment, isUplaodingComment } = usePostStore();
  const [showCommentInput, setShowCommentInput] = useState(false);
  const [commentText, setCommentText] = useState("");
  const [showReport, setShowReport] = useState(false);
  const { reportPost, unReportPost } = usePostStore();
  const [comments, setComments] = useState<Comment[]>([]);
  const { authUser } = useAuthStore();
  const navigate = useNavigate();

  const getComments = async (postId: string) => {
    const res = await axiosInstance.get(`/post/comment/${postId}`);
    setComments(res.data);
    console.log("comments: ", comments);
  };

  const handleCommentSubmit = async () => {
    if (commentText.trim()) {
      // Force TypeScript to treat the return as unknown first, then as Comment
      const result = await addComment(post._id, commentText);
      const newComment = result as unknown as Comment | null;

      if (newComment) {
        setComments((prevComments) => [newComment, ...prevComments]);
        setCommentText("");
      } else {
        console.error("Failed to add comment.");
        // Fallback to refreshing comments
        await getComments(post._id);
      }
    }
  };
  useEffect(() => {
    const handleClickOutside = (e: any) => {
      if (!e.target.closest(".relative")) {
        setShowReport(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [comments]);

  return (
    <div
      className="max-w-[700px] mx-auto rounded-xl bg-white p-4 shadow-lg mb-4 border border-gray-200"
      onClick={(e) => {
        if (!(e.target as HTMLElement).closest("[data-comment-section]")) {
          setShowCommentInput(false);
        }
      }}
    >
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center">
          <div
            className="size-12 rounded-full border-2 border-white shadow-sm overflow-hidden mr-3 cursor-pointer"
            onClick={(e) => {
              e.stopPropagation();
              navigate(`/profile/${post.postedBy}`);
            }}
          >
            <img
              src={post.userImagePath ? post.userImagePath : "/avatar.jpeg"}
              alt="Profile"
              className="w-full h-full object-cover bg-gray-100"
            />
          </div>
          <div className="flex flex-col">
            <span
              className="font-semibold text-gray-800 text-base cursor-pointer hover:underline"
              onClick={(e) => {
                e.stopPropagation();
                navigate(`/profile/${post.postedBy}`);
              }}
            >
              {post.username}
            </span>
          </div>
        </div>

        {/* Report Button */}
        <div className="relative z-10">
          <button
            onClick={(e) => {
              e.stopPropagation();
              setShowReport(!showReport);
            }}
            className="p-1.5 hover:bg-gray-100 rounded-full transition-colors duration-200 -z-10"
          >
            <Threedot />
          </button>

          {showReport && !isAdmin && post.postedBy !== authUser?._id && (
            <div className=" bg-white border border-gray-200 rounded-lg shadow-xl z-[5] overflow-hidden w-48 absolute">
              <button
                onClick={async (e) => {
                  e.stopPropagation();
                  try {
                    if (post.isReported) {
                      await unReportPost(post._id);
                    } else {
                      await reportPost(post._id);
                    }
                  } catch (error) {
                    console.error("Report action failed:", error);
                  }
                  setShowReport(false);
                }}
                className={`w-full px-4 py-2.5 text-sm text-left flex items-center justify-between
          ${
            post.isReported
              ? "text-red-600 hover:bg-red-50"
              : "text-gray-700 hover:bg-gray-50"
          }
          transition-colors duration-150`}
              >
                <span>{post.isReported ? "Unreport Post" : "Report Post"}</span>
                <span className="text-xs font-medium text-gray-400">
                  {post.reportCount || 0}
                </span>
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Text Content */}
      {post.text && (
        <div className="mb-4 text-gray-800 text-[15px] leading-relaxed">
          {post.text}
        </div>
      )}

      {/* Post Image */}
      {post.postsImagePath && (
        <div className="rounded-xl overflow-hidden mb-4 border border-gray-100">
          <img
            src={post.postsImagePath}
            alt="Post content"
            className="w-full h-auto aspect-video object-cover"
            onError={(e) => {
              (e.target as HTMLImageElement).style.display = "none";
            }}
          />
        </div>
      )}

      {/* Actions */}
      <div className="flex items-center text-gray-500 text-sm border-t border-gray-100 pt-3">
        <button
          className="flex items-center mr-6 hover:text-red-500 transition-colors"
          onClick={() => toggleLike(post._id)}
        >
          <LikeIcon />
          <span className="ml-2 font-medium">{post.likes.length}</span>
        </button>

        <button
          className="flex items-center mr-6 hover:text-blue-500 transition-colors"
          onClick={(e) => {
            e.stopPropagation();
            setShowCommentInput(!showCommentInput);
            getComments(post._id);
          }}
        >
          <MessageIcon />
          <span className="ml-2 font-medium">{post.comments.length}</span>
        </button>

        <button
          className="ml-auto hover:text-blue-500 transition-colors"
          onClick={() => toggleSave(post._id)}
        >
          <SaveIcon
            filled={post.isSaved}
            className={post.isSaved ? "text-blue-500" : "text-gray-500"}
          />
        </button>
      </div>

      {/* Comment Section */}
      {showCommentInput && (
        <div className="mt-4 space-y-4" data-comment-section>
          {/* Comment input section remains the same */}
          <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
            <textarea
              value={commentText}
              onChange={(e) => setCommentText(e.target.value)}
              placeholder="Write a comment..."
              className="w-full border rounded-lg p-3 text-sm focus:ring-2 focus:ring-blue-200 focus:border-blue-500 outline-none transition-all"
              rows={2}
              onClick={(e) => e.stopPropagation()}
            />
            <div className="flex justify-end mt-2">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handleCommentSubmit();
                }}
                className={`px-4 py-2 ${
                  isUplaodingComment ? "bg-blue-300" : "bg-blue-500"
                } text-white rounded-lg text-sm font-medium hover:bg-blue-600 transition-colors`}
                disabled={isUplaodingComment}
              >
                {isUplaodingComment ? (
                  <div className="px-10">
                    <Loader className="animate-spin size-5" />
                  </div>
                ) : (
                  "Post Comment"
                )}
              </button>
            </div>
          </div>

          {comments.length > 0 && (
            <div className="bg-gray-50 p-4 rounded-lg border border-gray-200 space-y-3">
              {comments
                .filter((comment) => comment?._id)
                .map((comment) => (
                  <div key={comment._id}>
                    <CommentCard
                      user={comment.user}
                      content={comment.content}
                      date={comment.date}
                      _id={comment._id}
                    />
                  </div>
                ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
