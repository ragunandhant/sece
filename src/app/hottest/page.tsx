"use client";
import { useState,useEffect } from "react";
import Image from "next/image";
import PostActions from "@/Components/PostActions";
import { FaCommentDots } from "react-icons/fa";
import { useRouter } from 'next/navigation'
import share_svg from '../../../public/share-svgrepo-com.svg'
import { handleShare } from "@/services";
import LoadingUI from "@/Components/LoadingUI";
import toast from "react-hot-toast";

const metadata = {
  title: "sece.live",
  description: "An open-source platform for sharing your thoughts and ideas in a anonymous way",
  tags: ["trending",'sece review', "posts","anonymous",'secelive','sece','live','sece.live','sece.live story','sece trending posts','sece.live hottest','sece.live trending','sece.live trending posts'],

};

interface Comment {
  id: number;
  content: string;
  author: string;
  authorImg: string;
}

interface Post {
  id: number;
  title: string;
  content: string;
  image: string;
  upvote: number;
  downvote: number;
  author: string;
  authorImg: string;
  createdAt: string;
  comments: Comment[];
  _count: {
    comments: number;
  }
}


export default function Page() {

  const [posts, setPosts] = useState<Post[]>([]);
  const [scroll,setScroll] = useState(true);
  const router = useRouter();

  useEffect(() => {
    async function fetchPosts() {
      try{
      const response = await fetch('/api/hottest', {
        headers: {
          Authorization: "Bearer token" 
        }
      }
      );
      const data = await response.json();
      console.log(data);
      setPosts(data);
    }catch(error){
      toast.error("due to taffic error occurd , try refreshing again..");
      console.log(error);
    }
  }
    fetchPosts();
  }, []);

  useEffect(() => {
    const intervalId = setInterval(() => {
      setScroll((prevScroll) => !prevScroll);
    }, 5000);
    return () => clearInterval(intervalId);
  }, []);

  const formatDate = (createdAt: string): string => {
    const now = Date.now();
    const postDate = new Date(createdAt).getTime();
    const diffInMs = (now)-(postDate) ;
    const diffInSec = Math.floor(diffInMs / 1000);
    const diffInMin = Math.floor(diffInSec / 60);
    const diffInHour = Math.floor(diffInMin / 60);
    const diffInDays = Math.floor(diffInHour / 24);
  
    if (diffInSec < 60) {
      return 'just now';
    } else if (diffInMin < 60) {
      return `${diffInMin} min ago`;
    } else if (diffInHour < 24) {
      return `${diffInHour} hour ago`;
    } else if (diffInDays < 30) {
      return `${diffInDays} day ago`;
    } else {
      const options = { day: 'numeric', month: 'short', year: 'numeric' };
      return new Date(postDate).toLocaleDateString('en-US', options as any);
    }
  };

  const handleCommentSection = (post: Post) => {
    router.push(`/comments/${post.id}/`);
  }

  return (
    <main>
      <section>
      {posts?.length === 0 ? (
        <div className="mt-5"><LoadingUI/></div>
        ) :  posts.map((post: Post) => (
          <div key={post.id} className="flex flex-col lg:w-[700px] md:w-[600px] sm:w-[500px]  rounded-lg gap-y-3 mt-10 shadow-md border border-[#c0c0c0] p-4  md:p-7">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-x-5">
                <Image src={post.authorImg} alt={post.author} width={40} height={30} />
                <p className="text-gray-600">{post.author}</p>
              </div>
              <div>
                <h1 className="text-gray-400 font-normal">{formatDate(post.createdAt)}</h1>
              </div>
            </div>
            <hr />
            <div>
              <h2 className="font-medium text-2xl w-full">{post.title}</h2>
            </div>
            { post.image !="" && <div className="flex justify-center p-2">
              <Image  src={post.image} alt="error in uploaded image URL" width={300} height={250} />
            </div>}
            <div>
              <p className="text-lg mt-4 whitespace-pre-line max-h-56 overflow-y-auto scrollbar">{post.content}</p>
            </div>
            <div className="flex mt-2 justify-between items-center">
              <div className="flex gap-x-2 md:gap-x-5 items-center">
                <PostActions post={post} />
                <button className="flex justify-center items-center h-[30px] gap-x-1" onClick={()=>{handleShare(`${process.env.NEXT_PUBLIC_API_URL}/comments/${post.id}/`)}}>
                  <div className="text-gray-400">
                      Share
                  </div>
                  <Image src={share_svg} alt="share" className="w-[20px] h-[20px]"/>
                 </button>
              </div>

              <h1 className="font-normal text-gray-400 cursor-pointer" onClick={() => handleCommentSection(post)}>{post._count.comments} comments </h1>
            </div>
            <hr />
            <section className={`cursor-pointer relative overflow-hidden`} onClick={() => handleCommentSection(post)}>
                <div
                  className={`comments-container ${
                    scroll ? ' translate-y-0' : 'translate-y-full'} bg-slate-50 hover:bg-slate-100 rounded-lg transition ease-in px-2 absolute w-full flex items-center h-[50px]`}
                    style={{ transition: 'transform 0.5s ease-in-out' }}
                >
                  { (post.comments !== null &&  post.comments.length > 0) ? (
                    <div key={post.comments[0].id} className="flex gap-x-2 h-full w-full items-center">
                      <div>
                        <Image src={post.comments[0]?.authorImg} alt={post.comments[0].author} width={40} height={30} />
                      </div>
                      <div className="flex flex-col w-full">
                        <div className=" flex justify-between items-center px-1">
                          <h1 className="text-gray-400 text-sm">{post.comments[0].author}</h1>
                          <h1 className="text-blue-500 underline text-sm md:text-md">view comments</h1>
                        </div>
                        <div>
                         <p className="h-[30px] truncate ...">{post.comments[0].content} </p>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <p className="text-wrap flex gap-x-2 items-center"><FaCommentDots />Share your thoughts on it.. </p>
                  )}
                </div>
                <article className={`comments-input ${!scroll ? 'translate-y-0' : 'translate-y-full'} w-full`}
                  style={{ transition: 'transform 0.5s ease-in-out' }}>
                    <input type="text" placeholder=" Add a comment" className="border h-[50px] px-4 w-full rounded-md" />
                </article>
            </section>
          </div>
        ))}
        </section>
    </main>
  )
}
