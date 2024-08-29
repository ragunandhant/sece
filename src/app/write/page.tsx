"use client"

import Image from "next/image";
import { useState,useEffect } from "react";
import newVideo from "../../../public/newVideo.gif"
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";

const metadata = {
    title: "sece.live",
    description: "An open-source platform for sharing your thoughts and ideas in a anonymous way",
    tags: ["write", "posts","anonymous",'secelive','sece','live','sece.live','sece.live story','sece write','sece.live write','sece review','sece.live review'],
  
  }

function Page() {
    const [content,setContent] = useState("");
    const [image,setImage] = useState("");
    const [title , setTitle] = useState("");
    const [maxLength, setMaxLength] = useState(70);
    const [author, setAuthor] = useState<string | null>(null);
    const [authorImg, setAuthorImg] = useState<string | null>(null);
    const [Loading,setLoading]  = useState(false);

    const router = useRouter();



    useEffect(() => {
        const storedAuthor = localStorage.getItem('author');
        const storedAuthorImg = localStorage.getItem('authorImg');
    
        if (storedAuthor) {
          setAuthor(storedAuthor);
        } else {
          toast.error('Author information not found, please refresh the page');
        }
    
        if (storedAuthorImg) {
          setAuthorImg(storedAuthorImg);
        } else {
          toast.error('Author image not found, please refresh the page');
        }
      }, []);
    


    const handleTitleChange = (event:any) => {
        const newTitle = event.target.value.slice(0, maxLength); 
        setTitle(newTitle);
      };

      const wordsToCensor = ["fuck","punda","sunni","fcuk","Fuck","FUCK","Punda","Sunni"];

      const handleContentChange = (event:any) => {
        const newContent = event.target.value;
        const censoredContent = newContent.split(' ').map((word: string) => {
          if (wordsToCensor.includes(word)) {
            return '****';
          } else {
            return word;
          }
        }).join(' ');
        setContent(censoredContent);
      };

      function convertDriveUrlToThumbnailUrl(url: string): string {
        // Extract the file ID from the URL
        console.log(url);
        const match = url.match(/\/(?:file|folder)\/d\/([^\/]+)\/?(view)?/);
        console.log(match,"aa")
      
        if (match) {
          const fileId = match[1];
          console.log(fileId);
          setImage(`https://drive.google.com/thumbnail?id=${fileId}`);
          return `https://drive.google.com/thumbnail?id=${fileId}`; // Construct thumbnail URL
        } else {
          // Handle invalid URL format (optional)
          toast.error("Invalid Google Drive URL format");
          return ""; // Or return a default value
        }
      }

    const handleSubmit = async (event:any) => {
      setLoading(true);
        event.preventDefault();
        if(title.length < 5){
            setLoading(false);
            return toast.error("Title must be at least 5 characters long");
        }
        if(content.length < 10){
          setLoading(false);
            return toast.error("Content must be at least 10 characters long");
        }
        if(author === null || authorImg === null){
            setLoading(false);
            return toast.error("Author information not found , please refresh the page");
        }
        let convertedImage: any = ""; 
        if (image) {
            const thumbnailUrl = convertDriveUrlToThumbnailUrl(image);
            if (thumbnailUrl === "") {
              return;
            }
           convertedImage = thumbnailUrl;
          }
        
          console.log("posting", convertedImage);
    
        const response = await fetch("/api/posts", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: "Bearer token"
            },
            body: JSON.stringify({
                title,
                content,
                image:convertedImage,
                author, 
                authorImg  
    
            }),
        });
        if (response.ok) {
            toast.success("Post submitted successfully");
            setLoading(false);
            router.push("/");
            setTitle("");
            setContent("");
            setImage("");
        } else {
            toast.error("due to heavy traffic, your post was not submitted");
            setLoading(false);
        }
    }

    return (
            <section className="py-3">
                <form onSubmit={handleSubmit} className="flex flex-col gap-y-3 ">
                    <input 
                        type="text"
                        value={title}
                        onChange={handleTitleChange}
                        placeholder="Title (Min 5 characters | Max 70 characters ,)"
                        className="border border-gray-300 hover:border-black  rounded-lg p-2 max-w-2xl"
                    />
                    {title.length > 0 ? <p className="text-gray-500 text-wrap font-medium">{title.length} / {maxLength}</p>: null}
                    <textarea
                        value={content}
                        onChange={handleContentChange}
                        placeholder="Write something...(Min 10 characters)"
                        className="border border-gray-300 hover:border-black whitespace-pre-line  min-h-36 rounded-lg p-2 max-w-2xl"
                    ></textarea>
                   {content.length > 0 ?  <p className="text-gray-500 text-wrap">{content.length} letters</p>: null}
                    <input 
                        type ="text"
                        value={image}
                        onChange={(e) => setImage(e.target.value)}
                        placeholder="Image URL (Optional) only google drive link"
                        className="border border-gray-300 hover:border-black  rounded-lg p-2 max-w-2xl"
                    />
                    <section className="flex flex-col md:flex-row ">
                        <div>
                            <p className="text-wrap text-red-600 font-mono  p-1">
                            1. Upload image to Google Drive. <br />
                            2. Right-click image, choose Share. <br />
                            3. Set Anyone with the link can view. <br />
                            4. Copy the link, paste here. <br /> 
                            5. upload only file link not folder link <br />
                            Note : Once posted , you cant edit or delete the post.
                            </p>
                        </div>
                        {/* <div>
                           <Image src={newVideo} alt="image" width={300} height={300} className="rounded-lg" />
                        </div> */}
                    </section>
                    
                    <button
                        type="submit"
                        className={`${Loading?"disabled:true bg-gray-300 hover:bg-gray-300":"bg-blue-500"} hover:bg-blue-600 text-white px-4 p-2 rounded-lg w-fit h-fit  `}
                    >
                        Post
                    </button>
                </form>
            </section>
    );
}

export default Page;