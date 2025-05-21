import React from 'react';

const tweets = [
  {
    user: 'Eco Waste Hub',
    handle: '@ecowastehub',
    avatar: 'https://upload.wikimedia.org/wikipedia/commons/a/a5/Instagram_icon.png',
    time: '2h',
    text: 'We just rescued 500kg of fresh produce from going to waste! 🥕🥦 #FoodRescue #EcoWasteHub',
    img: 'https://images.unsplash.com/photo-1464983953574-0892a716854b?auto=format&fit=crop&w=600&q=80',
    likes: 120,
    retweets: 34,
    replies: 7
  },
  {
    user: 'Eco Waste Hub',
    handle: '@ecowastehub',
    avatar: 'https://upload.wikimedia.org/wikipedia/commons/a/a5/Instagram_icon.png',
    time: '5h',
    text: 'Thank you to all our volunteers for making a difference every day! 🌱💚',
    img: '',
    likes: 89,
    retweets: 21,
    replies: 3
  },
  {
    user: 'Eco Waste Hub',
    handle: '@ecowastehub',
    avatar: 'https://upload.wikimedia.org/wikipedia/commons/a/a5/Instagram_icon.png',
    time: '1d',
    text: 'Did you know? Reducing food waste is one of the top ways to fight climate change. Join us!',
    img: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=600&q=80',
    likes: 142,
    retweets: 40,
    replies: 9
  },
  {
    user: 'Eco Waste Hub',
    handle: '@ecowastehub',
    avatar: 'https://upload.wikimedia.org/wikipedia/commons/a/a5/Instagram_icon.png',
    time: '2d',
    text: 'Our new eco-marketplace is live! Shop surplus food and help the planet. 🌍🛒',
    img: '',
    likes: 98,
    retweets: 27,
    replies: 4
  },
];

const TwitterPage: React.FC = () => (
  <div className="min-h-screen bg-black text-white flex flex-col items-center font-sans">
    {/* Top bar */}
    <div className="w-full flex items-center justify-between px-4 py-3 border-b border-neutral-800 sticky top-0 z-20 bg-black/90">
      <svg width="32" height="32" viewBox="0 0 24 24" fill="none"><path d="M22.162 5.656c-.793.352-1.645.59-2.54.698a4.48 4.48 0 0 0 1.962-2.475 8.94 8.94 0 0 1-2.828 1.082A4.48 4.48 0 0 0 11.08 9.6c0 .352.04.695.116 1.022C7.728 10.47 4.1 8.7 1.671 5.965a4.48 4.48 0 0 0-.607 2.254c0 1.555.792 2.927 2.002 3.732a4.48 4.48 0 0 1-2.03-.56v.057a4.48 4.48 0 0 0 3.6 4.393c-.193.053-.397.08-.607.08-.148 0-.292-.014-.432-.04a4.48 4.48 0 0 0 4.18 3.11A8.98 8.98 0 0 1 2 19.54a12.7 12.7 0 0 0 6.88 2.017c8.26 0 12.78-6.84 12.78-12.78 0-.195-.004-.39-.013-.583A9.13 9.13 0 0 0 24 4.59a8.98 8.98 0 0 1-2.538.696z" fill="#fff"/></svg>
      <div className="flex gap-2">
        <button className="px-4 py-1 rounded font-semibold bg-transparent border border-blue-500 text-blue-500 hover:bg-blue-500 hover:text-white transition">Log in</button>
        <button className="px-4 py-1 rounded font-semibold bg-blue-500 text-white hover:bg-blue-600 transition">Sign up</button>
      </div>
    </div>
    {/* Banner and profile */}
    <div className="w-full max-w-3xl relative">
      <div className="h-48 bg-gradient-to-tr from-eco-green to-blue-900" />
      <div className="absolute left-6 -bottom-12 z-10">
        <img src="https://upload.wikimedia.org/wikipedia/commons/a/a5/Instagram_icon.png" alt="Eco Waste Hub" className="w-32 h-32 rounded-full border-4 border-black object-cover bg-white" />
      </div>
    </div>
    <div className="w-full max-w-3xl flex flex-col md:flex-row md:items-end gap-4 px-6 pt-8 pb-4 border-b border-neutral-800 bg-black">
      <div className="flex-1 min-w-0 mt-8 md:mt-0">
        <div className="flex items-center gap-2 mb-2">
          <span className="text-2xl font-bold">Eco Waste Hub</span>
          <svg width="20" height="20" fill="#1da1f2" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10"/></svg>
        </div>
        <div className="text-gray-400">@ecowastehub</div>
        <div className="text-sm mt-2">Your eco-marketplace for surplus food and sustainable groceries. 🌱<br />Fighting food waste, one meal at a time.</div>
        <div className="flex gap-4 mt-2 text-gray-400 text-xs">
          <span>Joined January 2022</span>
          <span>1,900 Followers</span>
          <span>15 Following</span>
        </div>
      </div>
      <button className="px-4 py-2 rounded-full bg-blue-500 text-white font-bold shadow hover:bg-blue-600 transition">Follow</button>
    </div>
    {/* Tabs */}
    <div className="w-full max-w-3xl flex items-center border-b border-neutral-800 text-neutral-400 text-sm font-semibold">
      <button className="flex-1 py-3 flex items-center justify-center border-b-2 border-blue-500 text-blue-400">Posts</button>
      <button className="flex-1 py-3 flex items-center justify-center hover:text-white">Replies</button>
      <button className="flex-1 py-3 flex items-center justify-center hover:text-white">Highlights</button>
      <button className="flex-1 py-3 flex items-center justify-center hover:text-white">Media</button>
    </div>
    {/* Feed */}
    <div className="w-full max-w-3xl flex flex-col gap-2 p-2 md:p-4 bg-black">
      {tweets.map((tweet, i) => (
        <div key={i} className="flex gap-4 p-4 border-b border-neutral-800 bg-neutral-900/60 rounded-xl hover:bg-neutral-800/80 transition">
          <img src={tweet.avatar} alt={tweet.user} className="w-14 h-14 rounded-full object-cover mt-1" />
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2">
              <span className="font-bold text-white">{tweet.user}</span>
              <span className="text-gray-400">{tweet.handle}</span>
              <span className="text-gray-400 text-xs">· {tweet.time}</span>
            </div>
            <div className="mt-1 text-white text-base mb-2">{tweet.text}</div>
            {tweet.img && <img src={tweet.img} alt="tweet" className="rounded-xl w-full max-h-64 object-cover mb-2" />}
            <div className="flex gap-6 text-gray-400 text-sm mt-1">
              <span>💬 {tweet.replies}</span>
              <span>🔁 {tweet.retweets}</span>
              <span>❤️ {tweet.likes}</span>
            </div>
          </div>
        </div>
      ))}
    </div>
    {/* Right sidebar (static) */}
    <div className="hidden lg:block fixed right-0 top-0 h-full w-96 bg-black/90 border-l border-neutral-800 p-8 pt-24 z-10">
      <div className="bg-neutral-900 rounded-xl p-6 mb-8">
        <h2 className="text-xl font-bold mb-2">New to X?</h2>
        <button className="w-full bg-white text-black font-bold py-2 rounded mb-2 hover:bg-gray-200 transition">Sign up with Google</button>
        <button className="w-full bg-white text-black font-bold py-2 rounded mb-2 hover:bg-gray-200 transition">Sign up with Apple</button>
        <button className="w-full bg-blue-500 text-white font-bold py-2 rounded hover:bg-blue-600 transition">Create account</button>
      </div>
      <div className="bg-neutral-900 rounded-xl p-6">
        <h2 className="text-lg font-bold mb-2">Trending for you</h2>
        <ul className="text-sm text-gray-300 space-y-2">
          <li>#EcoWasteHub</li>
          <li>#FoodRescue</li>
          <li>#Sustainability</li>
          <li>#ClimateAction</li>
        </ul>
      </div>
    </div>
  </div>
);

export default TwitterPage; 