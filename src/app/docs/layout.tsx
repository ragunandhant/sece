import Link from "next/link"

const metadata = {
    title: "secelive story",
    description: " here , the creators share their stories and experiences in a anonymous way",
    tags: ["story",'sece review', "experience", "anonymous",'secelive','sece','live','sece.live','sece.live story','sece.live docs','sece.live documentation'],
  }

export default function docsLayout({
    children,}: { children: React.ReactNode}) {
    return (
      <main>
          <nav className="flex gap-x-6 text-gray-500 mt-6 sticky top-0 z-10 h-fit py-3 w-full  bg-white">
              <Link href="/" className="hover:text-black">home</Link>
              <Link href="/hottest" className="hover:text-black">hottest</Link>
              <Link href="/write" className="hover:text-black">write</Link>
              <Link href="/docs" className="font-bold text-black">story</Link>
          </nav>
        <section>
        {children}
       </section> 
      </main>
      
    )
  }