"use client"
import { usePathname, useRouter } from 'next/navigation'
import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { formatDate } from '@/utils/formatDate';
import toast from 'react-hot-toast';
import { BiSolidLike } from 'react-icons/bi';
import { IoArrowBack } from 'react-icons/io5';
import PostActions from '@/Components/PostActions';
import share_svg from '../../../../../public/share-svgrepo-com.svg'
import { handleShare } from '@/services';
// for sample data
export default function CommentsPage() {
  const pathname = usePathname()
  const postId = pathname.split("/")[2]
  const pageNumber = pathname.split("/")[3]
  const [page, setPage] = useState(parseInt(pageNumber) || 1);
  const [post, setPost] = useState<any | null>(null);
  const [comments, setComments] = useState<Comment[]>([]);
  const [newComment, setNewComment] = useState('');
  const [likedComments, setLikedComments] = useState<number[]>([]);
  const [loading, setLoading] = useState(true);
  const [postLoading, setPostLoading] = useState(false);

  const router = useRouter();

  interface Comment {
    id: number;
    content: string;
    author: string;
    authorImg: string;
    createdAt: string;
  }

  const fetchLikedComments = () => {
    const liked = JSON.parse(localStorage.getItem('likedComments') || '[]');
    if(liked.length === 0){
      localStorage.setItem('likedComments', JSON.stringify(["dummy"]));
    }
    setLikedComments(liked);
  }

  useEffect(() => {
    fetchLikedComments();
    if (postId) {
      fetchPosts();
      fetchComments();
    }
  }, [postId, page]);

const fetchPosts = async () => {
  setLoading(true);
  try {
    const response = await fetch(`/api/posts/${postId}`, {
      headers: {
        Authorization: "Bearer token" 
      }
    });
    if (!response.ok) {
      throw new Error('Failed to fetch post');
    }
    const data = await response.json();
    setPost(data);
  } catch (error) {
    console.error("Error fetching post:", error);
  } finally {
    setLoading(false);
  }
};

  const fetchComments = async () => {
    try {
      const response = await fetch(`/api/posts/${postId}/comments`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      setComments(data);
    } catch (error) {
      console.error("Error fetching comments:", error);
    }
  };

  let isTimeoutActiveLike = false;

  const handleTimoutLike = (commentId: number) => {
   const likedArray =  localStorage.getItem("likedComments")
    if(likedArray){
      const likedComments = JSON.parse(likedArray);
      if(likedComments.includes(commentId)){
        toast.error("your like already counted , dont be greedy");
        return;
       }
    if (isTimeoutActiveLike) {
      return; 
    }
  isTimeoutActiveLike = true;
     setTimeout(() => {
      handleLikeComment(commentId);
      isTimeoutActiveLike = false; 
    }, 100);
  }
}

  const handleLikeComment = async (commentId: number) => {
    // if(likedComments.includes(commentId)){
    //   const newLikedComments = likedComments.filter(id => id !== commentId);
    //   setLikedComments(newLikedComments);
    //   localStorage.setItem("likedComments", JSON.stringify(newLikedComments));
    //   return;
    // }
    try {
      const response = await fetch(`/api/comments/${commentId}/like`, {
        method: 'POST',
      });

      if (response.ok) {
        const updatedComment = await response.json();
        setComments(comments.map(comment => 
          comment.id === commentId ? updatedComment : comment
        ));

        const likedcomment = localStorage.getItem('likedComments') || '[]';
        console.log(likedcomment,"before like",likedComments);

        const newLikedComments = likedComments.includes(commentId)
          ? likedComments.filter(id => id !== commentId)
          : [...likedComments, commentId];
        setLikedComments(newLikedComments);
        console.log(newLikedComments,"after like",likedComments);
        localStorage.setItem("likedComments", JSON.stringify([...JSON.parse(likedcomment), commentId]));
      }
    } catch (error) {
      console.error("Error liking comment:", error);
    }
  };

  const handleAddComment = async (e: React.FormEvent) => {
    e.preventDefault();
    setPostLoading(true);
    if(newComment == ""){
      toast.error("Comment cannot be empty");
      setPostLoading(false);
      return;
    }
    try {
      const response = await fetch(`/api/posts/${postId}/comments`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          content: newComment,
          author: localStorage.getItem("author") || "Anonymous",
          authorImg: localStorage.getItem("authorImg") || "default-avatar.png",
        }),
      });

      if (response.ok) {
        const addedComment = await response.json();
        setComments([addedComment, ...comments]);
        setNewComment("");
        setPostLoading(false);
      }
    } catch (error) {
      setPostLoading(false);
      console.error("Error adding comment:", error);
    }
  };

  if (loading) return <div className='mt-10'>Loading post...</div>;
  if (!post) return <div>Post not found</div>;

  const handleBackToPostsClick = (e: React.MouseEvent) => {
    e.preventDefault();
    const lastViewedPage = localStorage.getItem('lastViewedPage');
    router.push(`/?page=${lastViewedPage || 1}`);
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <Link href="/" onClick={handleBackToPostsClick} className="text-blue-500 hover:underline mb-4 flex gap-x-2">
      <IoArrowBack size={25} /> Back to Posts
      </Link>
      <div className="mb-3">
        <h1 className="text-2xl font-bold mb-2 max-w-[600px]">{post.title}</h1>
        <p className="text-gray-600 mb-4 max-w-[600px] whitespace-pre-line">{post.content}</p>
        {post.image && (
          <div className="flex justify-center mb-4">
            <Image src={post.image} alt={post.title}  width={200} height={150} />
          </div>
        )}
        <div className="flex gap-x-2 md:gap-x-5 items-center">
             {/* <PostActions post={post} /> */}
              <button className="flex justify-center items-center h-[30px] gap-x-1" onClick={()=>{handleShare(`${process.env.NEXT_PUBLIC_API_URL}/comments/${post.id}/${page}`)}}>
                  <div className="text-gray-400">
                      Share
                  </div>
                <Image src={share_svg} alt="share" className="w-[20px] h-[20px]"/>
             </button>
        </div>
      </div>
      <div className="mb-8">
        <h2 className="text-xl font-semibold mb-4">Comments</h2>
        <form onSubmit={handleAddComment} className="mb-4 flex flex-col gap-y-4">
          <textarea
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            className="lg:max-w-[600px] w-full p-2 border rounded"
            placeholder="Add a comment..."
          />
          <button type="submit" className={`${postLoading?"bg-gray-400 disabled:true":"bg-blue-500 hover:bg-blue-600 text-white " } h-fit w-fit p-2 px-2  text-white rounded`}>
            Post Comment
          </button>
        </form>
        {comments.map((comment: any) => (
          <div key={comment.id} className="mb-4 p-2 px-3 bg-slate-50 shadow-sm lg:max-w-[600px] w-full rounded">
            <div className="flex items-center justify-between mb-2">
              <div className='flex items-center'>
                <Image src={comment.authorImg} alt={comment.author} width={30} height={30} className="rounded-full mr-2" />
                <span className="font-semibold">{comment.author}</span>
                <span className="text-gray-500 text-sm ml-2">{formatDate(comment.createdAt)}</span>
              </div>
              {
                likedComments.includes(comment.id) ?
                <button
                  onClick={() => handleLikeComment(comment.id)}
                  className="text-blue-500  flex items-center gap-x-1 font-semibold"
                >
                  <BiSolidLike size={20} /> {comment.likeCount}
                </button>
                :
                <button
                  onClick={() => handleTimoutLike(comment.id)}
                  className="text-gray-500  flex items-center gap-x-1"
                >
                  <BiSolidLike size={20} /> {comment.likeCount}
                </button>
              }
            </div>
            <p>{comment.content}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

export const runtime = 'edge';
