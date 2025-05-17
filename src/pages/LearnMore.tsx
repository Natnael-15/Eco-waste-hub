import React from 'react';

const LearnMore: React.FC = () => (
  <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 px-4 py-12">
    <div className="bg-white rounded-2xl shadow-xl p-10 max-w-2xl w-full text-center">
      <h1 className="text-4xl font-bold text-eco-green font-playfair mb-4">About Eco Waste Hub</h1>
      <p className="text-lg text-gray-700 mb-6">Eco Waste Hub is on a mission to rescue surplus food, reduce waste, and support communities in need. We connect local producers, businesses, and volunteers to make a real impact—one meal at a time.</p>
      <div className="my-8 text-left">
        <h2 className="text-2xl font-bold text-eco-green mb-2">Our Mission</h2>
        <p className="mb-4 text-gray-700">To create a sustainable food system by rescuing surplus food and redistributing it to those who need it most, while minimizing environmental impact.</p>
        <h2 className="text-2xl font-bold text-eco-green mb-2">Our Impact</h2>
        <ul className="list-disc list-inside text-gray-700 mb-4">
          <li>Thousands of meals provided to families and individuals</li>
          <li>Partnerships with local farms, groceries, and restaurants</li>
          <li>Hundreds of volunteers making a difference</li>
          <li>Significant reduction in food waste and carbon footprint</li>
        </ul>
        <h2 className="text-2xl font-bold text-eco-green mb-2">How You Can Help</h2>
        <ul className="list-disc list-inside text-gray-700 mb-4">
          <li><b>Volunteer:</b> Join our team to help collect, pack, or distribute food.</li>
          <li><b>Donate:</b> Support our mission financially to help us rescue more food.</li>
          <li><b>Partner:</b> If you're a business or organization, collaborate with us to make a bigger impact.</li>
          <li><b>Spread the Word:</b> Share our mission with your network and help us grow.</li>
        </ul>
      </div>
      <div className="flex flex-col sm:flex-row gap-4 justify-center mt-6">
        <a href="/sign-up" className="bg-eco-yellow text-eco-green font-bold px-8 py-3 rounded-lg shadow hover:bg-yellow-300 transition text-lg">Sign Up</a>
        <a href="/donate" className="bg-white/80 text-eco-green font-bold px-8 py-3 rounded-lg shadow hover:bg-white transition border border-eco-green text-lg">Donate</a>
        <a href="/become-partner" className="bg-eco-green text-white font-bold px-8 py-3 rounded-lg shadow hover:bg-eco-yellow hover:text-eco-green transition text-lg">Become a Partner</a>
      </div>
    </div>
  </div>
);

export default LearnMore; 