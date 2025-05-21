import React from 'react';

const posts = [
  {
    img: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=600&q=80',
    caption: 'Turning surplus into smiles! #EcoWasteHub #FoodRescue',
    likes: 324,
    comments: 12
  },
  {
    img: 'https://images.unsplash.com/photo-1464983953574-0892a716854b?auto=format&fit=crop&w=600&q=80',
    caption: 'Fresh produce, fresh start. Join the movement! 🌱',
    likes: 287,
    comments: 8
  },
  {
    img: 'https://images.unsplash.com/photo-1519864600265-abb23847ef2c?auto=format&fit=crop&w=600&q=80',
    caption: 'Every meal rescued is a win for the planet. 🌍',
    likes: 412,
    comments: 19
  },
  {
    img: 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=600&q=80',
    caption: 'Volunteers making a difference every day! #EcoHeroes',
    likes: 198,
    comments: 5
  },
  {
    img: 'https://images.unsplash.com/photo-1465101046530-73398c7f28ca?auto=format&fit=crop&w=600&q=80',
    caption: 'Sustainable groceries for all. Shop with purpose.',
    likes: 256,
    comments: 7
  },
  {
    img: 'https://images.unsplash.com/photo-1506089676908-3592f7389d4d?auto=format&fit=crop&w=600&q=80',
    caption: 'Together, we reduce waste and feed communities.',
    likes: 301,
    comments: 10
  },
];

const InstagramPage: React.FC = () => (
  <div className="min-h-screen bg-black text-white flex flex-col items-center font-sans">
    {/* Top bar */}
    <div className="w-full border-b border-neutral-800 flex items-center justify-between px-4 md:px-12 py-3 sticky top-0 z-20 bg-black/90">
      <span className="font-logo text-2xl font-bold tracking-wide">Instagram</span>
      <div className="flex gap-2">
        <button className="px-4 py-1 rounded font-semibold bg-transparent border border-blue-500 text-blue-500 hover:bg-blue-500 hover:text-white transition">Log in</button>
        <button className="px-4 py-1 rounded font-semibold bg-blue-500 text-white hover:bg-blue-600 transition">Sign up</button>
      </div>
    </div>
    {/* Profile header */}
    <div className="w-full max-w-4xl flex flex-col md:flex-row items-center gap-8 md:gap-12 py-10 px-4 border-b border-neutral-800">
      <div className="relative">
        <span className="block w-36 h-36 rounded-full bg-gradient-to-tr from-yellow-400 via-pink-500 to-purple-600 p-1">
          <img src="https://upload.wikimedia.org/wikipedia/commons/a/a5/Instagram_icon.png" alt="Eco Waste Hub" className="w-full h-full rounded-full border-4 border-black object-cover" />
        </span>
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex flex-col md:flex-row md:items-center gap-4 mb-4">
          <span className="text-2xl font-semibold">ecowastehub</span>
          <span className="bg-blue-500 text-xs px-2 py-1 rounded text-white font-bold ml-2">Follow</span>
        </div>
        <div className="flex gap-8 mb-4">
          <span><b>6</b> posts</span>
          <span><b>2,100</b> followers</span>
          <span><b>12</b> following</span>
        </div>
        <div className="mb-2 text-sm">
          Your eco-marketplace for surplus food and sustainable groceries.<br />
          Join us in reducing food waste and supporting communities. 🌱
        </div>
        <a href="https://ecowastehub.com" className="text-blue-400 hover:underline text-sm">ecowastehub.com</a>
      </div>
    </div>
    {/* Tabs */}
    <div className="w-full max-w-4xl flex items-center border-b border-neutral-800 text-neutral-400 text-sm font-semibold">
      <button className="flex-1 py-3 flex items-center justify-center border-b-2 border-white text-white"> <svg className="mr-2" width="18" height="18" fill="currentColor" viewBox="0 0 24 24"><path d="M21 21H3V3h18v18zM5 5v14h14V5H5zm2 2h10v10H7V7z"/></svg> POSTS</button>
      <button className="flex-1 py-3 flex items-center justify-center hover:text-white"> <svg className="mr-2" width="18" height="18" fill="currentColor" viewBox="0 0 24 24"><path d="M12 7.77L18.39 21H5.61L12 7.77z"/></svg> REELS</button>
      <button className="flex-1 py-3 flex items-center justify-center hover:text-white"> <svg className="mr-2" width="18" height="18" fill="currentColor" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10"/><circle cx="12" cy="12" r="4"/></svg> TAGGED</button>
    </div>
    {/* Posts grid */}
    <div className="w-full max-w-4xl grid grid-cols-3 gap-1 md:gap-4 p-1 md:p-4 bg-black">
      {posts.map((post, i) => (
        <div key={i} className="relative group aspect-square bg-neutral-900 overflow-hidden cursor-pointer">
          <img src={post.img} alt={post.caption} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200" />
          <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex flex-col items-center justify-center text-white transition-opacity">
            <div className="flex gap-4 text-lg font-semibold">
              <span>❤️ {post.likes}</span>
              <span>💬 {post.comments}</span>
            </div>
            <p className="text-xs mt-2 text-center line-clamp-2 max-w-[90%]">{post.caption}</p>
          </div>
        </div>
      ))}
    </div>
  </div>
);

export default InstagramPage; 