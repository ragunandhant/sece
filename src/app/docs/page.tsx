const metadata = {
    title: "story",
    description: "About sece.live and its creators",
    url: "https://sece.live/story",
    type: "website",
    tags: ["story",'sece review', "experience", "anonymous",'secelive','sece','live','sece.live','sece.live story','sece.live docs','sece.live documentation'],
}
function page() {
    return (
        <article className="flex flex-col gap-y-5">
            <section>
                <blockquote className="text-5xl font-semibold  ">how it started ? </blockquote>
                <p className="md:text-xl text-lg font-mono text-wrap  mt-8  "> So, there I was, hunched over a computer in the IT center, staring blankly at my career options. A blog seemed like the safe bet for my portfolio, right? But something was missing - it felt like just another drop in the ocean. </p>
                <p className="md:text-xl text-lg font-mono text-wrap  mt-8  ">  Then, like a bolt of lightning, my friend piped up during a random chat with some visiting guru. They said something that shook me out of my coding cocoon. People around us are drowning in tiny problems, but they are too shy to even mention them. It was like everyone was trapped in their own personal swamp, and no one wanted to be the first to call for a rescue boat. </p>
                <p className="md:text-xl text-lg font-mono text-wrap  mt-8 ">   A lightbulb went off! What if I could build a place where people could spill their guts about their problems without fear? A digital therapy session, if you will. A platform where you could shout about your leaky roof or your cats hairball obsession without anyone judging. And guess what? Maybe, just maybe, someone else has the perfect solution hiding in their back pocket. </p>
            </section>
            <section>
                <blockquote className="text-5xl font-semibold  ">why sece.live ?  </blockquote>
                <p className="md:text-xl text-lg  font-mono text-wrap  mt-8">Sece.live is a straightforward and user-friendly domain. Its brevity and the .live extension both contribute to its potential for attracting users and making a positive impact.</p>
            </section>
            <section>
                <blockquote className="text-5xl font-semibold">still curious about me ? </blockquote>
                <p className="md:text-xl text-lg font-mono text-wrap  mt-8 "> I am creating this forum to foster open and respectful discussions. However, I am aware that there are people who might misuse the platform. To protect myself and maintain a positive environment, I have decided to remain anonymous for now. But dont worry, I plan to reveal my identity soon.</p>
            </section>
            <section>
                <blockquote className="text-5xl font-semibold  ">techstack used 🤔 </blockquote>
                <p className="md:text-xl text-lg font-mono text-wrap  mt-8 "> Next.js - Prisma - postgresql  </p>
            </section>
            <section>
                <blockquote className="text-5xl font-semibold  ">wanna work with me ? </blockquote>
                <p className="md:text-xl text-lg font-mono text-wrap  mt-8 "> We understand that there are always room for improvement. Thats why we are building this web app as an open-source project. If you are passionate about enhancing its efficiency and user-friendliness, we encourage you to get in touch. Your feedback and ideas are invaluable to us. < a href="mailto:secelive@gmail.com " className="text-blue-600 font-medium underline">Contact</a> </p>
            </section>

        </article>
    );
}

export default page;