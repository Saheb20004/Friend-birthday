'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';

const birthdayDate = new Date('2026-05-18T00:00:00').getTime();

export default function Home() {
  const [days, setDays] = useState(0);
  const [hours, setHours] = useState(0);
  const [minutes, setMinutes] = useState(0);
  const [seconds, setSeconds] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      const now = new Date().getTime();
      const distance = birthdayDate - now;

      if (distance < 0) {
        clearInterval(timer);
        return;
      }

      setDays(Math.floor(distance / (1000 * 60 * 60 * 24)));
      setHours(Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)));
      setMinutes(Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60)));
      setSeconds(Math.floor((distance % (1000 * 60)) / 1000));
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  return (
    <main className="w-full overflow-hidden">
      {/* Hero Section */}
      <section className="relative min-h-screen bg-gradient-to-b from-black via-yellow-950 to-black flex items-center justify-center px-4 py-20">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-20 left-10 w-72 h-72 bg-yellow-500 rounded-full blur-3xl"></div>
          <div className="absolute bottom-20 right-10 w-72 h-72 bg-yellow-600 rounded-full blur-3xl"></div>
        </div>

        <div className="relative z-10 text-center max-w-4xl">
          <div className="mb-8 flex justify-center">
            <span className="text-6xl">🎉</span>
          </div>
          <h1 className="text-7xl md:text-8xl font-bold mb-6 bg-gradient-to-r from-yellow-300 via-yellow-400 to-yellow-500 bg-clip-text text-transparent animate-pulse">
            Happy Birthday!
          </h1>
          <p className="text-2xl md:text-3xl text-yellow-300 mb-8 font-light">
            To my dearest friend
          </p>
          <p className="text-xl text-gray-300 mb-12 max-w-2xl mx-auto">
            A celebration of friendship, laughter, and unforgettable memories.
          </p>

          {/* Countdown Timer */}
          <div className="grid grid-cols-4 gap-4 md:gap-8 mb-12">
            {[
              { value: days, label: 'Days' },
              { value: hours, label: 'Hours' },
              { value: minutes, label: 'Minutes' },
              { value: seconds, label: 'Seconds' }
            ].map((item) => (
              <div key={item.label} className="bg-black border-2 border-yellow-500 rounded-lg p-4 md:p-6 backdrop-blur-sm">
                <div className="text-3xl md:text-4xl font-bold text-yellow-400 font-mono">
                  {String(item.value).padStart(2, '0')}
                </div>
                <div className="text-xs md:text-sm text-gray-400 mt-2 uppercase tracking-widest">
                  {item.label}
                </div>
              </div>
            ))}
          </div>

          <button className="bg-gradient-to-r from-yellow-400 to-yellow-500 text-black px-8 py-4 rounded-full font-bold text-lg hover:shadow-lg hover:shadow-yellow-500/50 transition-all transform hover:scale-105">
            Celebrate Now
          </button>
        </div>
      </section>

      {/* About Friend Section */}
      <section className="py-20 px-4 bg-gradient-to-r from-black to-yellow-950">
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            {/* Image Placeholder */}
            <div className="flex justify-center">
              <div className="relative w-80 h-96 bg-gradient-to-br from-yellow-400 to-yellow-600 rounded-2xl shadow-2xl shadow-yellow-500/20 overflow-hidden group">
                <div className="absolute inset-0">
                  <Image src="/1.jpg" alt="Kousik" fill className="object-cover object-top" />
                </div>
                <div className="absolute inset-0 border-4 border-yellow-300 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity"></div>
              </div>
            </div>

            {/* Text Content */}
            <div>
              <h2 className="text-5xl font-bold text-yellow-400 mb-6">
                About You
              </h2>
              <p className="text-lg text-gray-300 mb-4 leading-relaxed">
                A friend like you is one in a million. Thank you for the countless laughs,
                the shoulder to lean on, and the memories that will last forever.
              </p>
              <p className="text-lg text-gray-300 mb-4 leading-relaxed">
                Your kindness, humor, and genuine care have touched so many hearts.
                On your special day, we celebrate YOU!
              </p>

              {/* Stats */}
              <div className="grid grid-cols-2 gap-4 mt-8">
                <div className="bg-black border border-yellow-500 rounded-lg p-4">
                  <div className="text-3xl font-bold text-yellow-400">∞</div>
                  <div className="text-sm text-gray-400 mt-2">Memories Made</div>
                </div>
                <div className="bg-black border border-yellow-500 rounded-lg p-4">
                  <div className="text-3xl font-bold text-yellow-400">100%</div>
                  <div className="text-sm text-gray-400 mt-2">Best Friend</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Photo Gallery */}
      <section className="py-20 px-4 bg-black">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-5xl font-bold text-center mb-16 text-yellow-400">
            Cherished Moments
          </h2>

          <div className="grid md:grid-cols-3 gap-8">
            {[1, 2, 3, 4, 5, 6].map((num) => (
              <div
                key={num}
                className="group relative h-64 rounded-xl overflow-hidden shadow-xl hover:shadow-2xl hover:shadow-yellow-500/30 transition-all transform hover:scale-105"
              >
                <Image
                  src={num === 1 ? '/7.jpg' : `/${num}.jpg`}
                  alt={`Photo ${num}`}
                  fill
                  className={`object-cover ${num === 1 ? 'object-top' : ''}`}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end justify-center pb-6">
                  <span className="text-2xl">Photo {num}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Special Qualities */}
      <section className="py-20 px-4 bg-gradient-to-r from-yellow-950 to-black">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-5xl font-bold text-center mb-16 text-yellow-400">
            Why You're Special
          </h2>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { icon: '😄', title: 'Always Happy', desc: 'Your smile is contagious!' },
              { icon: '💪', title: 'Strong Heart', desc: 'You inspire us all' },
              { icon: '🎯', title: 'Loyal Friend', desc: 'Always there for us' },
              { icon: '✨', title: 'Golden Soul', desc: 'Pure and genuine' }
            ].map((item) => (
              <div
                key={item.title}
                className="group bg-black border-2 border-yellow-500 rounded-xl p-6 text-center hover:bg-yellow-950 transition-all transform hover:-translate-y-2"
              >
                <div className="text-5xl mb-4">{item.icon}</div>
                <h3 className="text-xl font-bold text-yellow-400 mb-2">{item.title}</h3>
                <p className="text-gray-400">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Messages Section */}
      <section className="py-20 px-4 bg-black">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-5xl font-bold text-center mb-16 text-yellow-400">
            Birthday Messages
          </h2>

          <div className="space-y-6">
            {[
              { name: 'Friend 1', message: 'You make every day brighter. Happy birthday! 🎉' },
              { name: 'Friend 2', message: 'To the best friend ever. Cheers to you! 🥳' },
              { name: 'Friend 3', message: 'May your year be filled with happiness and laughter!' },
              { name: 'Friend 4', message: 'You deserve all the happiness in the world. Happy birthday! 💛' }
            ].map((msg, idx) => (
              <div
                key={idx}
                className="bg-gradient-to-r from-yellow-950 to-black border-l-4 border-yellow-500 p-6 rounded-lg hover:shadow-lg hover:shadow-yellow-500/20 transition-all"
              >
                <p className="text-yellow-400 font-semibold mb-2">{msg.name}</p>
                <p className="text-gray-300">{msg.message}</p>
              </div>
            ))}
          </div>

          {/* Add Your Message */}
          <div className="mt-12 bg-gradient-to-r from-black to-yellow-950 border-2 border-yellow-500 rounded-xl p-8">
            <h3 className="text-2xl font-bold text-yellow-400 mb-4">Leave a Message</h3>
            <textarea
              className="w-full bg-black border border-yellow-500 rounded-lg p-4 text-white placeholder-gray-600 focus:outline-none focus:border-yellow-400 focus:ring-2 focus:ring-yellow-500/20 resize-none"
              rows={4}
              placeholder="Share your birthday wishes..."
            />
            <button className="mt-4 bg-gradient-to-r from-yellow-400 to-yellow-500 text-black px-8 py-3 rounded-lg font-bold hover:shadow-lg hover:shadow-yellow-500/50 transition-all transform hover:scale-105">
              Send Wishes
            </button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gradient-to-r from-black via-yellow-950 to-black text-center py-12 border-t border-yellow-500/20">
        <p className="text-yellow-400 font-semibold mb-2">Celebrating You</p>
        <p className="text-gray-500">Made with 💛 for your special day</p>
        <div className="mt-4 text-4xl">✨🎂✨</div>
      </footer>
    </main>
  );
}
