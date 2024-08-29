import Link from "next/link"

const metadata = {
    title: "write your thoughts",
    description: "write your thoughts and ideas in a anonymous way",
    tags: ["write",'sece review', "thoughts", "anonymous",'secelive','sece','live','sece.live','sece.live write','sece.live write your thoughts'],
  }

export default function WriteLayout({
    children, }: { children: React.ReactNode
  }) {
    return (
      <section className="w-full">
         <nav className="flex gap-x-6 text-gray-500 mt-6 z-10 sticky top-0 h-fit py-3 w-full  bg-white">
            <Link href="/" className="hover:text-black"  >home</Link>
            <Link href="/hottest" className="hover:text-black" >hottest</Link>
            <Link href="/write" className="font-bold text-black">write</Link>
            <Link href="/docs" className="hover:text-black">story</Link>
        </nav>
        <article className="mt-2">
          <h2 className="text-2xl font-medium text-wrap  mb-2">write what you thought ,</h2>
          <h1 className="text-4xl text-wrap mt-2 mb-2">  a single spark can ignite a wildfire</h1> 
        </article>
        {children}
      </section>
    )
  }