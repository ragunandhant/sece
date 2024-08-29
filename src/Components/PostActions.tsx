"use client"
import { useEffect, useState } from "react";
import { BiDislike, BiLike, BiSolidDislike, BiSolidLike } from "react-icons/bi";

const metadata = {
    title: "PostActions",
    description: "PostActions for sece.live",
  }

interface Post {
    id: number;
    title: string;
    content: string;
    upvote: number;
    downvote: number;
    author: string;
    authorImg: string;
    createdAt: string;
    comments: Comment[];
    _count: {
      comments: number;
    };
  };

  interface Comment {
    id: number;
    content: string;
    author: string;
  }
  

export default function PostActions ({ post }: { post: Post })  {
    const [isLiked, setIsLiked] = useState(false);
    const [isDisliked, setIsDisliked] = useState(false)
    
    function gettingLikedArray(){
    const likedArray = localStorage.getItem("likedArray") || "[]";
    const dislikedArray = localStorage.getItem("dislikedArray") || "[]";
   
    if(likedArray === "[]" ){
        localStorage.setItem("likedArray", JSON.stringify(["dummy"]));
    }
    if(dislikedArray === "[]" ){
        localStorage.setItem("dislikedArray", JSON.stringify(["dummy"]));
    }
    if(likedArray?.includes(post.id.toString())){
        setIsLiked(true);
    }
    if(dislikedArray?.includes(post.id.toString())){
        setIsDisliked(true);
    }
    }

    useEffect(() => {
        gettingLikedArray();
    }
    , []);


     let likeCount = post.upvote;
     let dislikeCount = post.downvote;
     let isTimeoutActiveLike = false;
     let isTimeoutActiveDislike = false;

    const handleLikeClickOne = async () => {
        if (isTimeoutActiveLike) {
            return; 
          }
        isTimeoutActiveLike = true;
        setIsLiked(!isLiked);
        setIsDisliked(false); 
        setTimeout(() => {
          handleLikeClick();
          isTimeoutActiveLike = false; 
        }, 30000);
    }
    
    const handleDislikeClickOne = async () => {
        if (isTimeoutActiveDislike) {
            return; 
          }
        isTimeoutActiveDislike = true;
        setIsLiked(false); 
        setIsDisliked(!isDisliked);
        setTimeout(() => {
          handleDislikeClick();
          isTimeoutActiveDislike = false; 
        }, 30000);
    }

    const handleLikeClick = async () => {

        try{
            const response = await fetch("/api/posts/", {
                method: "PATCH",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: "Bearer token"
                },
                body: JSON.stringify({
                    id: post.id,
                    upvote: true,
                }),
            });
            if (response.ok) {
                const data = await response.json();
                likeCount = data.upvote;
                const likedArray = localStorage.getItem("likedArray") || "[]";
                const dislikedArray = localStorage.getItem("dislikedArray") || "[]";
                if(dislikedArray.includes(post.id.toString())){
                    dislikeCount = dislikeCount - 1;
                    localStorage.setItem("dislikedArray", JSON.stringify(JSON.parse(dislikedArray).filter((id: string) => id !== post.id.toString())));
                }
                localStorage.setItem("likedArray", JSON.stringify([...JSON.parse(likedArray), post.id.toString()]));
            }
        } catch (error) {
            console.error("Error liking post:", error);
        }
    };
  
    const handleDislikeClick = async () => {

        try{
            const response = await fetch("/api/posts/", {
                method: "PATCH",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: "Bearer token"
                },
                body: JSON.stringify({
                    id: post.id,
                    downvote: true,
                }),
            });
            if (response.ok) {
                const data = await response.json();
                dislikeCount = data.upvote;
                const likedArray = localStorage.getItem("likedArray") || "[]";
                const dislikedArray = localStorage.getItem("dislikedArray") || "[]";
                if(likedArray.includes(post.id.toString())){
                    likeCount = likeCount - 1;
                    localStorage.setItem("likedArray", JSON.stringify(JSON.parse(likedArray).filter((id: string) => id !== post.id.toString())));
                }
                localStorage.setItem("dislikedArray", JSON.stringify([...JSON.parse(dislikedArray), post.id.toString()]));
            }
        } catch (error) {
            console.error("Error liking post:", error);
        }
    };
  
    return (
      <div className="flex">
        <div className="flex cursor-pointer items-center gap-x-1 mr-2" onClick={handleLikeClickOne}>
          {isLiked ? <BiSolidLike fill="#228CDB" size={25} /> : <BiLike fill="#228CDB" size={25} /> } 
          {isLiked ? likeCount + 1 : likeCount}
        </div>
        <div className="flex cursor-pointer items-center gap-x-1 md:ml-3 ml-2" onClick={handleDislikeClickOne}>
          {isDisliked ? <BiSolidDislike fill="#EF233C" size={25} />  : <BiDislike fill='#EF233C' size={25} /> } 
          {isDisliked ? dislikeCount +1 : dislikeCount}
        </div>
      </div>
    );
  };
  