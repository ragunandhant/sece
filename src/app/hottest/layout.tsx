import Link from "next/link"

const metadata = {
    title: "trending posts",
    description: " trending posts on sece.live is a collection of the most popular posts on the platform",
    tags: ["trending",'sece review', "posts","anonymous",'secelive','sece','live','sece.live','sece.live story','sece trending posts','sece.live hottest','sece.live trending','sece.live trending posts'],
  }

export default function hottestLayout({
    children,  } : {  children: React.ReactNode}) {
    return (
      <main>
         <nav className="flex gap-x-6 text-gray-500 mt-6 sticky top-0 z-10 h-fit py-3 w-full  bg-white">
            <Link href="/" className="hover:text-black">home</Link>
            <Link href="/hottest"className="font-bold text-black" >hottest</Link>
            <Link href="/write" className="hover:text-black">write</Link>
            <Link href="/docs" className="hover:text-black">story</Link>
        </nav>
        <article className="">
          <h1 className="text-5xl text-wrap mt-2 mb-4 ">trending posts</h1>
        </article>
        <section>
        {children}
      </section>
      </main>
    )
  }