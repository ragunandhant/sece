"use client";
import { useState, useEffect } from "react";
import Image from "next/image";
import PostActions from "@/Components/PostActions";
import Link from "next/link";
import { FaCommentDots } from "react-icons/fa";
import { formatDate } from "@/utils/formatDate";
import { useRouter, useSearchParams } from 'next/navigation'
import share_svg from '../../public/share-svgrepo-com.svg'
import { handleShare } from "@/services";
import { AvatarGenerator } from 'random-avatar-generator';
import { nameByRace } from "fantasy-name-generator";
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
  image: string;
  content: string;
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


export default function Home() {
  const searchParams = useSearchParams();
  const initialPage = parseInt(searchParams.get('page') || '1');
  const [page, setPage] = useState(initialPage);
  const [posts, setPosts] = useState<Post[]>([]);
  const [scroll, setScroll] = useState(true);
  const [hasMore, setHasMore] = useState(true);
  const [loading, setLoading] = useState(false);
  const generator = new AvatarGenerator();

  const router = useRouter();

  useEffect(() => {
    const avathar = generator.generateRandomAvatar();
    const name = nameByRace("human")
    localStorage.setItem("author",name as string);
    localStorage.setItem("authorImg",avathar);
    setPage(1); 
    setPosts([]); 
  }, []);

  useEffect(() => {
    fetchPosts();
  }, [page]);

  // useEffect(() => {
  //   if (commentModal || scroll) {
  //     return;
  //   }
  //   window.scrollTo(0, parseInt(localStorage.getItem('scrollPosition')|| '2000'));
  //   const scrollPosition = window.scrollY;
  //   localStorage.setItem('scrollPosition', scrollPosition.toString()); 
  // }, [commentModal, scroll]);
  

  useEffect(() => {
    const intervalId = setInterval(() => {
      setScroll((prevScroll) => !prevScroll);
    }, 5000);

    return () => clearInterval(intervalId);
  }, []);

  const fetchPosts = async () => {
    setLoading(true);
    try {
      const response = await fetch(`/api/posts?page=${page}`, {
        headers: {
          Authorization: "Bearer token"
        }
      });
      const data = await response.json();
      setPosts(prevPosts => {
        const newPosts = [...prevPosts, ...data.posts];
        const uniquePosts = Array.from(new Set(newPosts.map(post => post.id)))
          .map(id => newPosts.find(post => post.id === id))
          .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
        return uniquePosts;
      });
      setHasMore(data.hasMore);
      console.log(data);
    } catch (error) {
      toast.error("due to taffic error occurd , try refreshing again..");
      console.error("Error fetching posts:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleCommentSection = (post: Post) => {
    const scrollPosition = window.scrollY;
    localStorage.setItem('scrollPosition', scrollPosition.toString());
    localStorage.setItem('lastViewedPage', page.toString()); 
    router.push(`/comments/${post.id}/${page}`);
  }
  

  return (
    <main>
      <nav className="flex gap-x-6 text-gray-500 mt-6 sticky top-0 z-10 h-fit py-3 w-full  bg-white ">
        <Link href="/" className="font-bold text-black">home</Link>
        <Link href="/hottest" className="hover:text-black">hottest</Link>
        <Link href="/write" className="hover:text-black">write</Link>
        <Link href="/docs" className="hover:text-black">story</Link>
      </nav>
      <h1 className="text-lg sm:text-xl md:text-3xl text-wrap mt-2 mb-4 first-letter:tracking-widest first-letter:text-6xl md:first-letter:text-7xl first-letter:font-bold  first-letter:float-left">A safe place for open discussion, <br />nonymity is guaranteed.</h1>
      <section>
        {posts.length === 0 && !loading ? (
          <div><LoadingUI/></div>
        ) : (
          posts.map((post: Post) => (
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
              { post.image !="" && <div className="flex justify-center  p-2">
                <Image  src={post.image} alt="error in uploaded image URL"  width={200} height={150} />
              </div>}
              <div>
                <p className="text-lg mt-4 whitespace-pre-line max-h-56 overflow-y-auto scrollbar">{post.content}</p>
              </div>
              <div className="flex mt-2 justify-between items-center">
                <div className="flex gap-x-2 md:gap-x-5 w-auto items-center">
                  <PostActions post={post} />
                  <button className="flex justify-center items-center h-[30px] gap-x-1" onClick={()=>{handleShare(`${process.env.NEXT_PUBLIC_API_URL}/comments/${post.id}/${page}`)}}>
                    <div className="text-gray-400">
                        Share
                    </div>
                    <Image src={share_svg} alt="image" className="w-[20px] h-[20px]"/>
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
                    {post.comments.length > 0 ? (
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
          ))
        )}
        {/* {loading && <p className="mt-5"><LoadingUI/></p>}
        {hasMore && !loading &&  (
          <button
          onClick={() => {
            setPage(prevPage => prevPage + 1);
          }}
          className="mt-5 text-blue-500 text-2xl underline font-semibold hover:text-blue-600 py-2 px-4 rounded"
        >
          Read More
        </button>
        )} */}
      </section>
    </main>
  );
}