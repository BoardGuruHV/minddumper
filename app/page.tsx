import Link from "next/link";

// The landing page — the calm "front door" of MindDumper.
export default function HomePage() {
  return (
    <main
      className="flex min-h-screen flex-col items-center justify-center px-6 text-center
                 bg-gradient-to-b from-[#e7efe3] via-[#f4ecd9] to-[#e6eef2]"
    >
      {/* A soft glowing circle behind the title, gently breathing. */}
      <div className="relative flex flex-col items-center">
        <div
          aria-hidden
          className="absolute -z-10 h-64 w-64 rounded-full bg-white/50 blur-3xl animate-breathe"
        />

        <h1 className="text-5xl font-semibold tracking-tight text-stone-800 sm:text-6xl">
          MindDumper
        </h1>

        <p className="mt-4 text-lg italic text-stone-500">
          your safe space to dump it all
        </p>

        <Link
          href="/chat"
          className="mt-10 inline-block rounded-full bg-[#5b7053] px-10 py-3 text-base
                     font-medium text-stone-50 shadow-sm transition
                     hover:bg-[#4e6147] focus:outline-none focus-visible:ring-2
                     focus-visible:ring-[#5b7053] focus-visible:ring-offset-2"
        >
          Start
        </Link>

        <p className="mt-8 text-sm text-stone-400">
          no sign-up · anonymous · a kind space to think out loud
        </p>
      </div>
    </main>
  );
}
