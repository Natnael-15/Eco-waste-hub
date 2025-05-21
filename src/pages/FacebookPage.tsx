import React from 'react';

const posts = [
  {
    user: 'Eco Waste Hub',
    avatar: 'https://upload.wikimedia.org/wikipedia/commons/a/a5/Instagram_icon.png',
    time: '3 hrs',
    text: 'We just delivered 200 meal kits to local families! Thank you for supporting our mission. 💚',
    img: 'https://images.unsplash.com/photo-1519864600265-abb23847ef2c?auto=format&fit=crop&w=600&q=80',
    likes: 120,
    comments: 18,
    shares: 7
  },
  {
    user: 'Eco Waste Hub',
    avatar: 'https://upload.wikimedia.org/wikipedia/commons/a/a5/Instagram_icon.png',
    time: '1 day',
    text: 'Our volunteers rescued 500kg of fresh produce this week! #EcoWasteHub',
    img: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=600&q=80',
    likes: 98,
    comments: 12,
    shares: 4
  },
  {
    user: 'Eco Waste Hub',
    avatar: 'https://upload.wikimedia.org/wikipedia/commons/a/a5/Instagram_icon.png',
    time: '2 days',
    text: 'Reducing food waste is a team effort. Join us and make a difference! 🌱',
    img: '',
    likes: 76,
    comments: 9,
    shares: 2
  },
];

const FacebookPage: React.FC = () => (
  <div className="min-h-screen bg-gray-100 flex flex-col items-center font-sans">
    {/* Top bar */}
    <div className="w-full flex items-center justify-between px-4 py-3 border-b border-gray-300 bg-white sticky top-0 z-20">
      <span className="font-logo text-2xl font-bold text-blue-600 tracking-wide">facebook</span>
      <div className="flex gap-2">
        <input type="text" placeholder="Email or phone" className="px-2 py-1 rounded border border-gray-300 text-sm" />
        <input type="password" placeholder="Password" className="px-2 py-1 rounded border border-gray-300 text-sm" />
        <button className="px-3 py-1 rounded bg-blue-600 text-white font-semibold text-sm hover:bg-blue-700 transition">Log in</button>
      </div>
    </div>
    {/* Cover and profile */}
    <div className="w-full max-w-3xl relative">
      <div className="h-48 bg-gradient-to-tr from-blue-200 to-blue-400" />
      <div className="absolute left-8 -bottom-16 z-10">
        <img src="https://upload.wikimedia.org/wikipedia/commons/a/a5/Instagram_icon.png" alt="Eco Waste Hub" className="w-32 h-32 rounded-full border-4 border-white object-cover bg-white" />
      </div>
    </div>
    <div className="w-full max-w-3xl flex flex-col md:flex-row md:items-end gap-4 px-8 pt-20 pb-4 border-b border-gray-300 bg-white">
      <div className="flex-1 min-w-0 mt-8 md:mt-0">
        <div className="flex items-center gap-2 mb-2">
          <span className="text-2xl font-bold text-gray-900">Eco Waste Hub</span>
          <svg width="20" height="20" fill="#1877f2" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10"/></svg>
        </div>
        <div className="text-gray-500">@ecowastehub · Nonprofit Organization</div>
        <div className="text-sm mt-2 text-gray-700">Your eco-marketplace for surplus food and sustainable groceries.<br />Join us in reducing food waste and supporting communities. 🌱</div>
        <div className="flex gap-4 mt-2 text-gray-500 text-xs">
          <span>2,100 followers</span>
          <span>12 following</span>
        </div>
      </div>
      <button className="px-4 py-2 rounded bg-blue-600 text-white font-bold shadow hover:bg-blue-700 transition">Follow</button>
    </div>
    {/* Tabs */}
    <div className="w-full max-w-3xl flex items-center border-b border-gray-300 text-gray-600 text-sm font-semibold bg-white">
      <button className="flex-1 py-3 flex items-center justify-center border-b-2 border-blue-600 text-blue-600">Posts</button>
      <button className="flex-1 py-3 flex items-center justify-center hover:text-blue-600">About</button>
      <button className="flex-1 py-3 flex items-center justify-center hover:text-blue-600">Reels</button>
      <button className="flex-1 py-3 flex items-center justify-center hover:text-blue-600">Photos</button>
      <button className="flex-1 py-3 flex items-center justify-center hover:text-blue-600">Videos</button>
    </div>
    {/* Feed */}
    <div className="w-full max-w-3xl flex flex-col gap-4 p-2 md:p-6">
      {posts.map((post, i) => (
        <div key={i} className="bg-white rounded-xl shadow p-4 flex gap-4 border border-gray-200">
          <img src={post.avatar} alt={post.user} className="w-14 h-14 rounded-full object-cover mt-1" />
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2">
              <span className="font-bold text-gray-900">{post.user}</span>
              <span className="text-gray-500 text-xs">· {post.time}</span>
            </div>
            <div className="mt-1 text-gray-800 text-base mb-2">{post.text}</div>
            {post.img && (
              <div className="w-full min-h-[120px] bg-gray-200 rounded-xl mb-2 flex items-center justify-center overflow-hidden">
                <img
                  src={post.img}
                  alt="post"
                  className="rounded-xl w-full max-h-64 object-cover"
                  onError={e => { e.currentTarget.style.display = 'none'; }}
                />
              </div>
            )}
            <div className="flex gap-6 text-gray-500 text-sm mt-1">
              <span>👍 {post.likes}</span>
              <span>💬 {post.comments}</span>
              <span>↗️ {post.shares}</span>
            </div>
          </div>
        </div>
      ))}
    </div>
  </div>
);

export default FacebookPage; 