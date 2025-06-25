import React, { useState, useEffect } from 'react';
import './App.css';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL || 'http://localhost:8001';

function App() {
  const [currentPage, setCurrentPage] = useState('home');
  const [donationForm, setDonationForm] = useState({
    amount: '',
    donor_name: '',
    donor_email: '',
    message: ''
  });
  const [contactForm, setContactForm] = useState({
    name: '',
    email: '',
    message: ''
  });
  const [stats, setStats] = useState({
    total_donations: 0,
    total_amount: 0,
    total_contacts: 0
  });
  const [submissionStatus, setSubmissionStatus] = useState('');

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const response = await fetch(`${BACKEND_URL}/api/stats`);
      if (response.ok) {
        const data = await response.json();
        setStats(data);
      }
    } catch (error) {
      console.error('Error fetching stats:', error);
    }
  };

  const handleDonationSubmit = async (e) => {
    e.preventDefault();
    setSubmissionStatus('submitting');
    
    try {
      const response = await fetch(`${BACKEND_URL}/api/donations`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...donationForm,
          amount: parseFloat(donationForm.amount)
        }),
      });

      if (response.ok) {
        setSubmissionStatus('success');
        setDonationForm({ amount: '', donor_name: '', donor_email: '', message: '' });
        fetchStats();
        setTimeout(() => setSubmissionStatus(''), 3000);
      } else {
        setSubmissionStatus('error');
      }
    } catch (error) {
      setSubmissionStatus('error');
      console.error('Error submitting donation:', error);
    }
  };

  const handleContactSubmit = async (e) => {
    e.preventDefault();
    setSubmissionStatus('submitting');
    
    try {
      const response = await fetch(`${BACKEND_URL}/api/contacts`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(contactForm),
      });

      if (response.ok) {
        setSubmissionStatus('success');
        setContactForm({ name: '', email: '', message: '' });
        fetchStats();
        setTimeout(() => setSubmissionStatus(''), 3000);
      } else {
        setSubmissionStatus('error');
      }
    } catch (error) {
      setSubmissionStatus('error');
      console.error('Error submitting contact:', error);
    }
  };

  const Navigation = () => (
    <nav className="bg-white shadow-lg sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center">
            <button
              onClick={() => setCurrentPage('home')}
              className="text-2xl font-bold text-blue-600 hover:text-blue-800"
            >
              HopeBridge
            </button>
          </div>
          <div className="hidden md:block">
            <div className="ml-10 flex items-baseline space-x-4">
              {['home', 'about', 'donate', 'stories', 'contact'].map((page) => (
                <button
                  key={page}
                  onClick={() => setCurrentPage(page)}
                  className={`px-3 py-2 rounded-md text-sm font-medium capitalize transition-colors ${
                    currentPage === page
                      ? 'bg-blue-600 text-white'
                      : 'text-gray-600 hover:bg-blue-50 hover:text-blue-600'
                  }`}
                >
                  {page === 'home' ? 'Home' : page}
                </button>
              ))}
            </div>
          </div>
          <div className="md:hidden">
            <div className="flex flex-col space-y-1">
              {['home', 'about', 'donate', 'stories', 'contact'].map((page) => (
                <button
                  key={page}
                  onClick={() => setCurrentPage(page)}
                  className={`px-2 py-1 text-xs capitalize ${
                    currentPage === page ? 'text-blue-600 font-semibold' : 'text-gray-600'
                  }`}
                >
                  {page}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </nav>
  );

  const HomePage = () => (
    <div className="min-h-screen">
      {/* Hero Section */}
      <div className="relative h-screen bg-gradient-to-r from-blue-800 to-blue-600">
        <div 
          className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-30"
          style={{
            backgroundImage: 'url(https://images.unsplash.com/photo-1507427100689-2bf8574e32d4)'
          }}
        ></div>
        <div className="relative z-10 flex items-center justify-center h-full">
          <div className="text-center text-white px-4 max-w-4xl">
            <h1 className="text-4xl md:text-6xl font-bold mb-6 leading-tight">
              Building Bridges of Hope
            </h1>
            <p className="text-xl md:text-2xl mb-8 opacity-90">
              Together, we can provide life-saving aid to families affected by conflict and crisis in African countries and around the world.
            </p>
            <button
              onClick={() => setCurrentPage('donate')}
              className="bg-orange-500 hover:bg-orange-600 text-white font-bold py-4 px-8 rounded-full text-lg transition-all transform hover:scale-105 shadow-2xl"
            >
              Donate Now
            </button>
          </div>
        </div>
      </div>

      {/* Mission Section */}
      <div className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-800 mb-4">Our Mission</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              HopeBridge is dedicated to providing humanitarian aid to those affected by war and conflict, 
              focusing on African countries and global crisis zones where help is needed most.
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center p-6 bg-white rounded-lg shadow-lg">
              <img 
                src="https://images.pexels.com/photos/6590920/pexels-photo-6590920.jpeg" 
                alt="Humanitarian Aid" 
                className="w-full h-40 object-cover rounded-lg mb-4"
              />
              <h3 className="text-xl font-semibold mb-2">Direct Aid</h3>
              <p className="text-gray-600">Providing essential supplies, food, and medical aid directly to those in need.</p>
            </div>
            <div className="text-center p-6 bg-white rounded-lg shadow-lg">
              <img 
                src="https://images.unsplash.com/photo-1492176273113-2d51f47b23b0" 
                alt="Hope" 
                className="w-full h-40 object-cover rounded-lg mb-4"
              />
              <h3 className="text-xl font-semibold mb-2">Restoring Hope</h3>
              <p className="text-gray-600">Bringing hope and dignity back to communities devastated by conflict.</p>
            </div>
            <div className="text-center p-6 bg-white rounded-lg shadow-lg">
              <img 
                src="https://images.unsplash.com/photo-1582213782179-e0d53f98f2ca" 
                alt="Community Support" 
                className="w-full h-40 object-cover rounded-lg mb-4"
              />
              <h3 className="text-xl font-semibold mb-2">Community Unity</h3>
              <p className="text-gray-600">Building stronger communities through support and solidarity.</p>
            </div>
          </div>
        </div>
      </div>

      {/* Stats Section */}
      <div className="py-16 bg-blue-600 text-white">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-12">Our Impact So Far</h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div>
              <div className="text-4xl font-bold mb-2">${stats.total_amount.toLocaleString()}</div>
              <div className="text-xl opacity-90">Total Raised</div>
            </div>
            <div>
              <div className="text-4xl font-bold mb-2">{stats.total_donations}</div>
              <div className="text-xl opacity-90">Donations Made</div>
            </div>
            <div>
              <div className="text-4xl font-bold mb-2">50+</div>
              <div className="text-xl opacity-90">Families Helped</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const AboutPage = () => (
    <div className="py-20 bg-gray-50 min-h-screen">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-4xl font-bold text-center mb-12 text-gray-800">About HopeBridge</h1>
        
        <div className="bg-white rounded-lg shadow-lg p-8 mb-8">
          <h2 className="text-2xl font-semibold mb-4 text-blue-600">Our Vision</h2>
          <p className="text-gray-700 leading-relaxed mb-6">
            We envision a world where no one suffers alone during times of crisis. HopeBridge was founded 
            with the belief that through collective action, we can build bridges of hope that span across 
            continents and cultures, connecting those who can help with those who need it most.
          </p>
          
          <h2 className="text-2xl font-semibold mb-4 text-blue-600">Our Mission</h2>
          <p className="text-gray-700 leading-relaxed mb-6">
            HopeBridge is committed to providing immediate humanitarian relief to individuals and families 
            affected by war, conflict, and displacement, with a special focus on African countries and 
            global crisis zones. We work to ensure that basic human needs—food, water, shelter, and 
            medical care—are met with dignity and compassion.
          </p>

          <h2 className="text-2xl font-semibold mb-4 text-blue-600">Why We Focus on Conflict Zones</h2>
          <p className="text-gray-700 leading-relaxed mb-6">
            Wars and conflicts disproportionately affect the most vulnerable populations, leaving millions 
            without access to basic necessities. Many of these crises, particularly in African countries, 
            receive limited international attention despite the urgent need for aid. HopeBridge bridges 
            this gap by directing resources where they are needed most.
          </p>

          <h2 className="text-2xl font-semibold mb-4 text-blue-600">Our Approach</h2>
          <ul className="list-disc list-inside text-gray-700 space-y-2">
            <li>Direct aid delivery to ensure maximum impact</li>
            <li>Partnership with local organizations for sustainable support</li>
            <li>Transparent use of donations with regular impact reports</li>
            <li>Cultural sensitivity and respect for local communities</li>
            <li>Long-term rehabilitation and community rebuilding</li>
          </ul>
        </div>

        <div className="text-center">
          <img 
            src="https://images.unsplash.com/photo-1505231509341-30534a9372ee" 
            alt="Hope Message" 
            className="w-full max-w-md mx-auto rounded-lg shadow-lg mb-6"
          />
          <p className="text-xl text-gray-600 italic">
            "There is always hope. Together, we can make a difference."
          </p>
        </div>
      </div>
    </div>
  );

  const DonatePage = () => (
    <div className="py-20 bg-gray-50 min-h-screen">
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-4xl font-bold text-center mb-8 text-gray-800">Make a Donation</h1>
        <p className="text-center text-gray-600 mb-12 text-lg">
          Your generosity can change lives. Every donation, no matter the size, makes a real difference 
          for families affected by conflict and crisis.
        </p>

        <div className="bg-white rounded-lg shadow-lg p-8">
          <form onSubmit={handleDonationSubmit} className="space-y-6">
            {/* Quick Amount Buttons */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">Choose Amount</label>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-4">
                {[25, 50, 100, 250].map((amount) => (
                  <button
                    key={amount}
                    type="button"
                    onClick={() => setDonationForm({...donationForm, amount: amount.toString()})}
                    className={`py-3 px-4 rounded-lg border-2 text-center font-semibold transition-colors ${
                      donationForm.amount === amount.toString()
                        ? 'border-blue-600 bg-blue-50 text-blue-600'
                        : 'border-gray-300 hover:border-blue-300'
                    }`}
                  >
                    ${amount}
                  </button>
                ))}
              </div>
              <input
                type="number"
                placeholder="Custom amount"
                value={donationForm.amount}
                onChange={(e) => setDonationForm({...donationForm, amount: e.target.value})}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
                min="1"
                step="0.01"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Full Name</label>
              <input
                type="text"
                value={donationForm.donor_name}
                onChange={(e) => setDonationForm({...donationForm, donor_name: e.target.value})}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Email Address</label>
              <input
                type="email"
                value={donationForm.donor_email}
                onChange={(e) => setDonationForm({...donationForm, donor_email: e.target.value})}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Message (Optional)</label>
              <textarea
                value={donationForm.message}
                onChange={(e) => setDonationForm({...donationForm, message: e.target.value})}
                rows="4"
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Share why you're donating or leave a message of hope..."
              />
            </div>

            <button
              type="submit"
              disabled={submissionStatus === 'submitting'}
              className="w-full bg-orange-500 hover:bg-orange-600 disabled:bg-gray-400 text-white font-bold py-4 px-6 rounded-lg text-lg transition-colors"
            >
              {submissionStatus === 'submitting' ? 'Processing...' : `Donate $${donationForm.amount || '0'}`}
            </button>
          </form>

          {submissionStatus === 'success' && (
            <div className="mt-6 p-4 bg-green-100 border border-green-400 text-green-700 rounded-lg">
              Thank you! Your donation has been processed successfully. You'll receive a confirmation email shortly.
            </div>
          )}

          {submissionStatus === 'error' && (
            <div className="mt-6 p-4 bg-red-100 border border-red-400 text-red-700 rounded-lg">
              There was an error processing your donation. Please try again.
            </div>
          )}

          <div className="mt-8 p-4 bg-blue-50 rounded-lg">
            <h3 className="font-semibold text-blue-800 mb-2">How Your Donation Helps:</h3>
            <ul className="text-sm text-blue-700 space-y-1">
              <li>• $25 provides clean water for a family for one week</li>
              <li>• $50 supplies emergency food packages for two families</li>
              <li>• $100 provides medical care for 10 children</li>
              <li>• $250 builds temporary shelter for a displaced family</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );

  const StoriesPage = () => {
    const stories = [
      {
        id: 1,
        image: "https://images.pexels.com/photos/13415997/pexels-photo-13415997.jpeg",
        title: "The Malika Family",
        story: "After fleeing conflict in their hometown, the Malika family found refuge in a displacement camp. With HopeBridge's support, they received emergency shelter, clean water, and medical care. Today, their children are healthy and attending school in the camp.",
        impact: "Shelter, clean water, and medical care provided"
      },
      {
        id: 2,
        image: "https://images.unsplash.com/photo-1727698980749-ae2eb9482bb6",
        title: "Amara and Kira",
        story: "Sisters Amara and Kira lost their parents during a conflict but found hope through our community support program. They now live with their grandmother and attend local school thanks to donations that cover their education and daily needs.",
        impact: "Education, daily meals, and emotional support"
      },
      {
        id: 3,
        image: "https://images.pexels.com/photos/28101461/pexels-photo-28101461.jpeg",
        title: "Clean Water for Kofi",
        story: "8-year-old Kofi used to walk miles every day to fetch water that often made his family sick. Thanks to HopeBridge donors, a clean water pump was installed in his village, giving him time to go to school instead of searching for water.",
        impact: "Clean water access for entire village of 200+ families"
      },
      {
        id: 4,
        image: "https://images.unsplash.com/photo-1697665387559-253e7a645e96",
        title: "Community Recovery",
        story: "The village of Tendara was devastated by conflict, but through collective support and donations, the community has rebuilt. Families have come together to reconstruct homes, restore their school, and create a sustainable future.",
        impact: "Entire community rebuilding with 50+ families helped"
      }
    ];

    return (
      <div className="py-20 bg-gray-50 min-h-screen">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-4xl font-bold text-center mb-8 text-gray-800">Stories of Hope</h1>
          <p className="text-center text-gray-600 mb-16 text-lg max-w-3xl mx-auto">
            Every donation creates a story of hope. Meet some of the families and individuals whose 
            lives have been transformed through the generosity of our donors.
          </p>

          <div className="grid md:grid-cols-2 gap-8">
            {stories.map((story) => (
              <div key={story.id} className="bg-white rounded-lg shadow-lg overflow-hidden">
                <img 
                  src={story.image} 
                  alt={story.title}
                  className="w-full h-64 object-cover"
                />
                <div className="p-6">
                  <h3 className="text-2xl font-semibold mb-4 text-gray-800">{story.title}</h3>
                  <p className="text-gray-600 mb-4 leading-relaxed">{story.story}</p>
                  <div className="border-t pt-4">
                    <p className="text-sm text-blue-600 font-semibold">Impact: {story.impact}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="text-center mt-16">
            <h2 className="text-2xl font-semibold mb-4 text-gray-800">Your Donation Creates the Next Story</h2>
            <p className="text-gray-600 mb-6">
              Join thousands of others who are making a difference in lives affected by conflict and crisis.
            </p>
            <button
              onClick={() => setCurrentPage('donate')}
              className="bg-orange-500 hover:bg-orange-600 text-white font-bold py-3 px-8 rounded-lg text-lg transition-colors"
            >
              Donate Now
            </button>
          </div>
        </div>
      </div>
    );
  };

  const ContactPage = () => (
    <div className="py-20 bg-gray-50 min-h-screen">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-4xl font-bold text-center mb-8 text-gray-800">Contact Us</h1>
        <p className="text-center text-gray-600 mb-12 text-lg">
          Have questions about our work or want to get involved? We'd love to hear from you.
        </p>

        <div className="grid md:grid-cols-2 gap-12">
          <div>
            <h2 className="text-2xl font-semibold mb-6 text-gray-800">Get in Touch</h2>
            <div className="space-y-4">
              <div className="flex items-start">
                <div className="bg-blue-100 p-3 rounded-lg mr-4">
                  <svg className="w-6 h-6 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 7.89a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-800">Email</h3>
                  <p className="text-gray-600">contact@hopebridge.org</p>
                </div>
              </div>
              
              <div className="flex items-start">
                <div className="bg-blue-100 p-3 rounded-lg mr-4">
                  <svg className="w-6 h-6 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064" />
                  </svg>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-800">Phone</h3>
                  <p className="text-gray-600">+1 (555) 123-HOPE</p>
                </div>
              </div>

              <div className="flex items-start">
                <div className="bg-blue-100 p-3 rounded-lg mr-4">
                  <svg className="w-6 h-6 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-800">Address</h3>
                  <p className="text-gray-600">123 Hope Street<br />Humanitarian District<br />Global City, GC 12345</p>
                </div>
              </div>
            </div>
          </div>

          <div>
            <form onSubmit={handleContactSubmit} className="bg-white rounded-lg shadow-lg p-6 space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Name</label>
                <input
                  type="text"
                  value={contactForm.name}
                  onChange={(e) => setContactForm({...contactForm, name: e.target.value})}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
                <input
                  type="email"
                  value={contactForm.email}
                  onChange={(e) => setContactForm({...contactForm, email: e.target.value})}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Message</label>
                <textarea
                  value={contactForm.message}
                  onChange={(e) => setContactForm({...contactForm, message: e.target.value})}
                  rows="5"
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                  placeholder="Tell us how we can help or how you'd like to get involved..."
                />
              </div>

              <button
                type="submit"
                disabled={submissionStatus === 'submitting'}
                className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white font-semibold py-3 px-6 rounded-lg transition-colors"
              >
                {submissionStatus === 'submitting' ? 'Sending...' : 'Send Message'}
              </button>
            </form>

            {submissionStatus === 'success' && (
              <div className="mt-4 p-4 bg-green-100 border border-green-400 text-green-700 rounded-lg">
                Thank you for your message! We'll get back to you within 24 hours.
              </div>
            )}

            {submissionStatus === 'error' && (
              <div className="mt-4 p-4 bg-red-100 border border-red-400 text-red-700 rounded-lg">
                There was an error sending your message. Please try again.
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );

  const renderCurrentPage = () => {
    switch (currentPage) {
      case 'home':
        return <HomePage />;
      case 'about':
        return <AboutPage />;
      case 'donate':
        return <DonatePage />;
      case 'stories':
        return <StoriesPage />;
      case 'contact':
        return <ContactPage />;
      default:
        return <HomePage />;
    }
  };

  return (
    <div className="App">
      <Navigation />
      {renderCurrentPage()}
      
      {/* Footer */}
      <footer className="bg-gray-800 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-3 gap-8">
            <div>
              <h3 className="text-2xl font-bold mb-4 text-blue-400">HopeBridge</h3>
              <p className="text-gray-300">
                Building bridges of hope for families affected by conflict and crisis worldwide.
              </p>
            </div>
            <div>
              <h4 className="text-lg font-semibold mb-4">Quick Links</h4>
              <ul className="space-y-2">
                {['home', 'about', 'donate', 'stories', 'contact'].map((page) => (
                  <li key={page}>
                    <button
                      onClick={() => setCurrentPage(page)}
                      className="text-gray-300 hover:text-blue-400 capitalize transition-colors"
                    >
                      {page}
                    </button>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h4 className="text-lg font-semibold mb-4">Connect With Us</h4>
              <p className="text-gray-300 mb-2">Email: contact@hopebridge.org</p>
              <p className="text-gray-300 mb-4">Phone: +1 (555) 123-HOPE</p>
              <p className="text-sm text-gray-400">
                © 2024 HopeBridge. All rights reserved.
              </p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default App;