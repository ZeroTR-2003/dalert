import { FormEvent, useState } from 'react';

function Navbar() {
  return (
    <div className="pointer-events-none fixed left-1/2 top-6 z-50 w-[95%] max-w-5xl -translate-x-1/2">
      <nav className="pointer-events-auto flex items-center justify-between rounded-full border border-black/10 bg-[#f8f8f1]/60 px-4 py-3 shadow-[0_18px_60px_rgba(17,23,17,0.08)] backdrop-blur-xl md:px-5">
        <a href="#" className="flex items-center gap-3" aria-label="Dalert home">
          <span className="flex h-9 items-center gap-2.5 rounded-full bg-white/65 py-1.5 pl-1.5 pr-4 ring-1 ring-black/5">
            <img src="/brand/dalert-mark.svg" alt="" className="h-6 w-6 rounded-full" />
            <span className="font-sans text-[16px] font-semibold tracking-[-0.02em] text-[#111711]">
              dalert
            </span>
          </span>
        </a>

        <div className="hidden items-center gap-10 font-sans text-[14px] text-[#1a1a1a] md:flex">
          <a className="transition-opacity hover:opacity-55" href="#product">
            Product
          </a>
          <a className="transition-opacity hover:opacity-55" href="#vision">
            Vision
          </a>
          <a className="transition-opacity hover:opacity-55" href="#access">
            Access
          </a>
        </div>

        <a
          href="#access"
          className="group relative isolate overflow-hidden rounded-full bg-[#087A3F] px-5 py-2.5 font-sans text-[14px] font-medium text-white outline outline-1 -outline-offset-1 outline-[#087A3F] shadow-[inset_0_-4px_4px_rgba(255,255,255,0.22),0_10px_28px_rgba(8,122,63,0.22)]"
        >
          <span className="absolute left-[10%] top-[1px] -z-10 h-4 w-[80%] rounded-[12px] bg-gradient-to-b from-[#DDF5E5] to-transparent transition-transform group-hover:scale-x-105" />
          Join waitlist
        </a>
      </nav>
    </div>
  );
}

function Hero() {
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [message, setMessage] = useState('');

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    const formData = new FormData(form);
    const email = String(formData.get('email') ?? '');
    const website = String(formData.get('website') ?? '');

    setStatus('loading');
    setMessage('');

    try {
      const response = await fetch('/api/waitlist', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, website }),
      });
      const contentType = response.headers.get('content-type') ?? '';

      if (!contentType.includes('application/json')) {
        throw new Error('Waitlist backend is not available in this preview.');
      }

      const data = (await response.json()) as { message?: string; error?: string };

      if (!response.ok) {
        throw new Error(data.error ?? 'Something went wrong.');
      }

      setStatus('success');
      setMessage(data.message ?? "You're on the list.");
      form.reset();
    } catch (error) {
      setStatus('error');
      setMessage(error instanceof Error ? error.message : 'Could not join the waitlist yet.');
    }
  }

  return (
    <section className="relative flex min-h-screen overflow-hidden bg-[#F3F4ED] px-5 pt-24 md:pt-32">
      {/* Hero video path: public/media/dalert-hero.mp4 is served by Vite as /media/dalert-hero.mp4 */}
      <video
        className="absolute inset-0 z-0 h-full w-full object-cover"
        autoPlay
        loop
        muted
        playsInline
        preload="metadata"
        poster="/media/dalert-hero-poster.jpg"
        aria-hidden="true"
      >
        <source src="/media/dalert-hero.mp4" type="video/mp4" />
      </video>
      <div className="absolute inset-0 z-10 bg-[#F3F4ED]/10" />
      <div className="absolute inset-0 z-10 bg-gradient-to-r from-[#F3F4ED]/88 via-[#F3F4ED]/38 to-transparent" />
      <div className="absolute inset-x-0 bottom-0 z-10 h-40 bg-gradient-to-t from-[#F3F4ED] to-transparent" />

      <div className="relative z-20 mx-auto flex w-full max-w-5xl items-center">
        <div className="max-w-xl pb-16 pt-14 md:pb-20">
          <p className="hero-reveal mb-5 font-sans text-[13px] font-medium uppercase tracking-[0.16em] text-[#087A3F]">
            Early access for dalert.app
          </p>

          <h1 className="hero-reveal hero-reveal-delay-1 font-instrument mb-6 max-w-[8ch] text-[50px] leading-[0.9] tracking-tight text-[#111711] sm:max-w-[11ch] sm:text-[72px] md:text-[88px]">
            Alerts that feel calm.
          </h1>

          <p className="hero-reveal hero-reveal-delay-2 max-w-lg font-sans text-[16px] font-normal leading-relaxed text-[#111711]/72 md:text-[18px]">
            Dalert is a simple way to send quiet alerts, check-ins, and short messages without
            adding more noise.
          </p>

          <form
            id="access"
            onSubmit={handleSubmit}
            className="hero-reveal hero-reveal-delay-3 mt-9 flex w-full max-w-lg flex-col gap-3 rounded-[28px] border border-black/10 bg-[#fffdf5]/72 p-2 shadow-[0_20px_70px_rgba(17,23,17,0.12)] backdrop-blur-xl sm:flex-row"
          >
            <label className="sr-only" htmlFor="waitlist-email">
              Email address
            </label>
            <input
              id="waitlist-email"
              name="email"
              type="email"
              required
              autoComplete="email"
              placeholder="you@example.com"
              className="min-h-12 flex-1 rounded-full bg-transparent px-5 font-sans text-[15px] text-[#111711] outline-none placeholder:text-[#111711]/38"
            />
            <label className="hidden" htmlFor="company-website">
              Website
            </label>
            <input
              id="company-website"
              className="hidden"
              name="website"
              tabIndex={-1}
              autoComplete="off"
            />
            <button
              type="submit"
              disabled={status === 'loading'}
              className="min-h-12 whitespace-nowrap rounded-full bg-[#087A3F] px-7 font-sans text-[14px] font-medium text-white shadow-[inset_0_-4px_4px_rgba(255,255,255,0.22),0_10px_26px_rgba(8,122,63,0.2)] transition-transform hover:-translate-y-0.5"
            >
              {status === 'loading' ? 'Requesting...' : 'Request access'}
            </button>
          </form>

          <p
            className={`mt-4 min-h-6 font-sans text-[14px] ${
              status === 'error' ? 'text-[#8A2F16]' : 'text-[#087A3F]'
            }`}
            role="status"
          >
            {message || ' '}
          </p>
        </div>
      </div>
    </section>
  );
}

function App() {
  return (
    <main className="min-h-screen bg-[#F3F4ED] text-[#111711]">
      <Navbar />
      <Hero />

      <section
        id="product"
        className="mx-auto grid max-w-5xl gap-5 px-5 py-16 md:grid-cols-2 md:py-24"
      >
        <article className="rounded-[30px] border border-black/8 bg-[#fffdf5]/70 p-8 shadow-[0_20px_60px_rgba(17,23,17,0.06)]">
          <p className="mb-4 font-sans text-[13px] font-medium uppercase tracking-[0.14em] text-[#087A3F]">
            What Dalert is
          </p>
          <h2 className="font-instrument mb-5 text-[38px] leading-none tracking-tight md:text-[48px]">
            Message-first alerts.
          </h2>
          <p className="font-sans text-[16px] leading-7 text-[#111711]/68">
            Dalert is being shaped as a private, message-first alert product for short notices,
            simple check-ins, and communication that stays easy to understand.
          </p>
        </article>

        <article
          id="vision"
          className="rounded-[30px] border border-black/8 bg-[#fffdf5]/48 p-8 shadow-[0_20px_60px_rgba(17,23,17,0.045)]"
        >
          <p className="mb-4 font-sans text-[13px] font-medium uppercase tracking-[0.14em] text-[#087A3F]">
            Built quietly
          </p>
          <h2 className="font-instrument mb-5 text-[38px] leading-none tracking-tight md:text-[48px]">
            Early access soon.
          </h2>
          <p className="font-sans text-[16px] leading-7 text-[#111711]/68">
            The product is under development with a focus on clarity, privacy, and calm interaction.
            Early access for dalert.app will open as the foundation becomes ready.
          </p>
        </article>
      </section>
    </main>
  );
}

export default App;
