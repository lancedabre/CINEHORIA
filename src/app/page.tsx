import Link from 'next/link';
import { Github, Instagram, ArrowUpRight } from 'lucide-react';

export default function LandingPage() {
  return (
    <div className="bg-[#050505] text-white min-h-screen scroll-smooth font-sans selection:bg-white selection:text-black">

      {/* NAVBAR */}
      <nav className="fixed top-0 w-full z-50 flex justify-between items-center px-6 md:px-12 py-6">
        <div className="flex items-center gap-8 md:gap-12">
          <div className="text-xl font-bold">
            Cinehoria
          </div>
          <div className="hidden md:flex gap-6 text-sm tracking-widest opacity-80">
            <a href="#home" className="hover:text-white transition-colors">Home</a>
            <a href="#about" className="hover:text-white transition-colors">About</a>
            <a href="#contribute" className="hover:text-white transition-colors">Contribute</a>
            <a href="#social" className="hover:text-white transition-colors">Social</a>
            <Link href="/manual" className="hover:text-white transition-colors">Manual</Link>
          </div>
        </div>
        <Link
          href="/login"
          className="flex items-center gap-1 border border-white/30 px-6 py-2 text-sm md:rounded-[3rem] tracking-widest hover:bg-white hover:text-black transition-all duration-300 rounded-sm"
        >
          Try It <ArrowUpRight size={15} />
        </Link>
      </nav>

      <main className="pt-24 pb-12 flex flex-col gap-32">

        {/* PAGE 1: HOME */}
        <section id="home" className="flex flex-col items-center px-4 md:px-12">
          <div className="w-full max-w-6xl">
            <div className="mt-29 mb-9 text-center md:text-left px-4">
              <h1 className="text-5xl md:text-3xl font-light tracking-wide leading-tight text-white/95">
                A no BS screenwriting software to get<br></br>you started
              </h1>
            </div>
            {/* Using standard img tags with rounded corners instead of full backgrounds */}
            <img
              src="/bg-home.jpg"
              alt="Cinehoria Home"
              className="w-full h-[50vh] md:h-[70vh] object-cover rounded-2xl mb-20 md:rounded-[1rem] border border-white/10 shadow-2xl"
            />
          </div>
        </section>

        {/* PAGE 2: ABOUT */}
        <section id="about" className="flex flex-col items-center px-4 md:px-12">
          {/* Added md:flex-row and a gap to space them out */}
          <div className="w-full max-w-6xl flex flex-col mt-20 mb-20 md:flex-row items-center gap-12 lg:gap-24">
            {/* Text side - takes up half width on desktop */}
            <div className="w-full md:w-1/2 px-4 max-w-xl">
              <h2 className="text-3xl md:text-4xl font-light mb-2">About</h2>
              <p className="text-sm uppercase tracking-widest mb-8 text-white/50">March 17 2026</p>

              <div className="space-y-6 text-lg md:text-xl font-light leading-relaxed text-white/80">
                <p>
                  Cinehoria is a sleek, web-based screenplay editor designed for focus and creativity. Built to rival industry standards like Final Draft, it offers standardised screenplay formatting, real-time cloud sync, and a distraction-free "dark mode" environment.
                </p>
                <p>
                  Whether you're outlining your next blockbuster or drafting an indie short, Cinehoria keeps your formatting perfect so you can focus on the story.
                </p>
                <p className="italic border-l-2 border-white/20 pl-4 mt-8">
                  Just kidding, I vibe-coded this because I was bored. It works, though.
                </p>
              </div>
            </div>

            {/* Image side - takes up half width on desktop */}
            <div className="w-full md:w-2/2">
              <img
                src="/bg-about.jpg"
                alt="Blade Runner Environment"
                className="w-full aspect-[3/2] md:aspect-square lg:aspect-[3/2] object-cover rounded-1xl md:rounded-[1rem]"
              />
            </div>



          </div>
        </section>

        {/* PAGE 3: CONTRIBUTE */}
        <section id="contribute" className="flex flex-col items-center px-4 md:px-12">
        <div className="w-full max-w-6xl flex flex-col mt-20 mb-20 md:flex-row items-center gap-12 lg:gap-24">
            {/* Text side - takes up half width on desktop */}
            {/* Image side - takes up half width on desktop */}
            <div className="w-full md:w-2/2">
            <img
                src="/bg-contribute.jpg"
                alt="Scorsese Directing"
                className="w-full aspect-[3/2] md:aspect-square lg:aspect-[3/2] object-cover rounded-1xl md:rounded-[1rem]"
              />
            </div>
            <div className="w-full md:w-1/2 px-4 max-w-xl">
              <h2 className="text-3xl md:text-4xl font-light mb-2">Source</h2>
              <p className="text-sm uppercase tracking-widest mb-8 text-white/50">March 17 2026</p>

              <div className="space-y-6 text-lg md:text-xl font-light leading-relaxed text-white/80">
              <p>
                Here is my GitHub link, do something if you feel like.
              </p>
              <a
                href="https://github.com/lancedabre/cinehoria"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-3 bg-white text-black px-8 py-3 font-medium uppercase tracking-widest hover:bg-gray-200 transition-colors rounded-sm"
              >
                <Github size={20} />
                GitHub
              </a>
              </div>
            </div>
          </div>
        </section>

        {/* PAGE 4: SOCIAL */}
        <section id="social" className="flex flex-col items-center px-4 md:px-12 mb-24">
          {/* md:flex-row puts the image back on the left */}
          <div className="w-full max-w-6xl flex flex-col mt-20 mb-20 md:flex-row items-center gap-12 lg:gap-24">

            <div className="w-full md:w-1/2">
              <img
                src="/bg-social.jpg"
                alt="Scorsese on Set"
                className="w-full aspect-[4/3] md:aspect-square lg:aspect-[4/5] object-cover rounded-2xl md:rounded-[2rem] border border-white/10 shadow-2xl"
              />
            </div>

            <div className="w-full md:w-1/2 px-4 max-w-xl">
              <h2 className="text-3xl md:text-4xl font-light mb-2">Social</h2>
              <p className="text-sm uppercase tracking-widest mb-8 border-b border-transparent text-transparent select-none">Spacer</p>

              <a
                href="https://instagram.com/cinehoria"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-4 text-3xl md:text-4xl font-light hover:text-gray-300 transition-colors text-white/90"
              >
                <Instagram size={40} />
                @cinehoria
              </a>
            </div>

          </div>
        </section>

      </main>
      <p className='text-sm md:text-sm text-black'>Cinehoria is created by and for the personal use of Lance Dabre</p>
    </div>
  );
}