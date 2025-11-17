import React, { useState, useEffect } from 'react';
import { Heart, Search, Calendar, User, Phone, MapPin, Clock, CheckCircle, AlertCircle } from 'lucide-react';

const BloodDonationApp = () => {
  const [currentUser, setCurrentUser] = useState(null);
  const [donors, setDonors] = useState([]);
  const [searchBloodGroup, setSearchBloodGroup] = useState('');
  const [searchDistrict, setSearchDistrict] = useState('');
  const [searchThana, setSearchThana] = useState('');
  const [loading, setLoading] = useState(true);
  const [view, setView] = useState('home');
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [loginPhone, setLoginPhone] = useState('');
  const [selectedDistrict, setSelectedDistrict] = useState('');
  const [formData, setFormData] = useState({
    name: '',
    bloodGroup: '',
    phone: '',
    district: '',
    thana: '',
    lastDonation: ''
  });

  const bloodGroups = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'];
  
  const districtThanas = {
    'Dhaka': ['Dhamrai', 'Dohar', 'Keraniganj', 'Nawabganj', 'Savar'],
    'Faridpur': ['Alfadanga', 'Bhanga', 'Boalmari', 'Charbhadrasan', 'Faridpur Sadar', 'Madhukhali', 'Nagarkanda', 'Sadarpur', 'Saltha'],
    'Gazipur': ['Gazipur Sadar', 'Kaliakair', 'Kaliganj', 'Kapasia', 'Sreepur'],
    'Gopalganj': ['Gopalganj Sadar', 'Kashiani', 'Kotalipara', 'Muksudpur', 'Tungipara'],
    'Jamalpur': ['Baksiganj', 'Dewanganj', 'Islampur', 'Jamalpur Sadar', 'Madarganj', 'Melandaha', 'Sarishabari'],
    'Kishoreganj': ['Austagram', 'Bajitpur', 'Bhairab', 'Hossainpur', 'Itna', 'Karimganj', 'Katiadi', 'Kishoreganj Sadar', 'Kuliarchar', 'Mithamain', 'Nikli', 'Pakundia', 'Tarail'],
    'Madaripur': ['Madaripur Sadar', 'Kalkini', 'Rajoir', 'Shibchar'],
    'Manikganj': ['Daulatpur', 'Ghior', 'Harirampur', 'Manikganj Sadar', 'Saturia', 'Shivalaya', 'Singair'],
    'Munshiganj': ['Gazaria', 'Lohajang', 'Munshiganj Sadar', 'Sirajdikhan', 'Sreenagar', 'Tongibari'],
    'Mymensingh': ['Bhaluka', 'Dhobaura', 'Fulbaria', 'Gaffargaon', 'Gauripur', 'Haluaghat', 'Ishwarganj', 'Mymensingh Sadar', 'Muktagachha', 'Nandail', 'Phulpur', 'Trishal', 'Tarakanda'],
    'Narayanganj': ['Araihazar', 'Bandar', 'Narayanganj Sadar', 'Rupganj', 'Sonargaon'],
    'Narsingdi': ['Belabo', 'Monohardi', 'Narsingdi Sadar', 'Palash', 'Raipura', 'Shibpur'],
    'Netrokona': ['Atpara', 'Barhatta', 'Durgapur', 'Khaliajuri', 'Kalmakanda', 'Kendua', 'Madan', 'Mohanganj', 'Netrokona Sadar', 'Purbadhala'],
    'Rajbari': ['Baliakandi', 'Goalandaghat', 'Pangsha', 'Rajbari Sadar', 'Kalukhali'],
    'Shariatpur': ['Bhedarganj', 'Damudya', 'Gosairhat', 'Naria', 'Shariatpur Sadar', 'Zajira', 'Shakhipur'],
    'Sherpur': ['Jhenaigati', 'Nakla', 'Nalitabari', 'Sherpur Sadar', 'Sreebardi'],
    'Tangail': ['Basail', 'Bhuapur', 'Delduar', 'Ghatail', 'Gopalpur', 'Kalihati', 'Madhupur', 'Mirzapur', 'Nagarpur', 'Sakhipur', 'Tangail Sadar', 'Dhanbari'],
    'Bogra': ['Adamdighi', 'Bogra Sadar', 'Dhunat', 'Dhupchanchia', 'Gabtali', 'Kahaloo', 'Nandigram', 'Sariakandi', 'Shajahanpur', 'Sherpur', 'Shibganj', 'Sonatala'],
    'Joypurhat': ['Akkelpur', 'Joypurhat Sadar', 'Kalai', 'Khetlal', 'Panchbibi'],
    'Naogaon': ['Atrai', 'Badalgachhi', 'Manda', 'Dhamoirhat', 'Mohadevpur', 'Naogaon Sadar', 'Niamatpur', 'Patnitala', 'Porsha', 'Raninagar', 'Sapahar'],
    'Natore': ['Bagatipara', 'Baraigram', 'Gurudaspur', 'Lalpur', 'Natore Sadar', 'Singra', 'Naldanga'],
    'Chapainawabganj': ['Bholahat', 'Gomastapur', 'Nachole', 'Chapainawabganj Sadar', 'Shibganj'],
    'Pabna': ['Atgharia', 'Bera', 'Bhangura', 'Chatmohar', 'Faridpur', 'Ishwardi', 'Pabna Sadar', 'Santhia', 'Sujanagar'],
    'Rajshahi': ['Bagha', 'Bagmara', 'Charghat', 'Durgapur', 'Godagari', 'Mohanpur', 'Paba', 'Puthia', 'Tanore'],
    'Sirajganj': ['Belkuchi', 'Chauhali', 'Kamarkhanda', 'Kazipur', 'Raiganj', 'Shahjadpur', 'Sirajganj Sadar', 'Tarash', 'Ullahpara'],
    'Dinajpur': ['Birampur', 'Birganj', 'Biral', 'Bochaganj', 'Chirirbandar', 'Phulbari', 'Ghoraghat', 'Hakimpur', 'Kaharole', 'Khansama', 'Dinajpur Sadar', 'Nawabganj', 'Parbatipur'],
    'Gaibandha': ['Fulchhari', 'Gaibandha Sadar', 'Gobindaganj', 'Palashbari', 'Sadullapur', 'Saghata', 'Sundarganj'],
    'Kurigram': ['Bhurungamari', 'Char Rajibpur', 'Chilmari', 'Phulbari', 'Kurigram Sadar', 'Nageshwari', 'Rajarhat', 'Raomari', 'Ulipur'],
    'Lalmonirhat': ['Aditmari', 'Hatibandha', 'Kaliganj', 'Lalmonirhat Sadar', 'Patgram'],
    'Nilphamari': ['Dimla', 'Domar', 'Jaldhaka', 'Kishoreganj', 'Nilphamari Sadar', 'Saidpur'],
    'Panchagarh': ['Atwari', 'Boda', 'Debiganj', 'Panchagarh Sadar', 'Tetulia'],
    'Rangpur': ['Badarganj', 'Gangachhara', 'Kaunia', 'Rangpur Sadar', 'Mithapukur', 'Pirgachha', 'Pirganj', 'Taraganj'],
    'Thakurgaon': ['Baliadangi', 'Haripur', 'Pirganj', 'Ranisankail', 'Thakurgaon Sadar'],
    'Habiganj': ['Ajmiriganj', 'Bahubal', 'Baniyachong', 'Chunarughat', 'Habiganj Sadar', 'Lakhai', 'Madhabpur', 'Nabiganj', 'Shayestaganj'],
    'Moulvibazar': ['Barlekha', 'Juri', 'Kamalganj', 'Kulaura', 'Moulvibazar Sadar', 'Rajnagar', 'Sreemangal'],
    'Sunamganj': ['Bishwamvarpur', 'Chhatak', 'Derai', 'Dharamapasha', 'Dowarabazar', 'Jagannathpur', 'Jamalganj', 'Sulla', 'Sunamganj Sadar', 'Tahirpur', 'South Sunamganj'],
    'Sylhet': ['Balaganj', 'Beanibazar', 'Bishwanath', 'Companigonj', 'Fenchuganj', 'Golapganj', 'Gowainghat', 'Jaintiapur', 'Kanaighat', 'Sylhet Sadar', 'Zakiganj', 'South Surma'],
    'Bagerhat': ['Bagerhat Sadar', 'Chitalmari', 'Fakirhat', 'Kachua', 'Mollahat', 'Mongla', 'Morrelganj', 'Rampal', 'Sarankhola'],
    'Chuadanga': ['Alamdanga', 'Chuadanga Sadar', 'Damurhuda', 'Jibannagar'],
    'Jessore': ['Abhaynagar', 'Bagherpara', 'Chaugachha', 'Jhikargachha', 'Keshabpur', 'Jessore Sadar', 'Manirampur', 'Sharsha'],
    'Jhenaidah': ['Harinakunda', 'Jhenaidah Sadar', 'Kaliganj', 'Kotchandpur', 'Maheshpur', 'Shailkupa'],
    'Khulna': ['Batiaghata', 'Dacope', 'Dumuria', 'Dighalia', 'Koyra', 'Paikgachha', 'Phultala', 'Rupsa', 'Terokhada'],
    'Kushtia': ['Bheramara', 'Daulatpur', 'Khoksa', 'Kumarkhali', 'Kushtia Sadar', 'Mirpur'],
    'Magura': ['Magura Sadar', 'Mohammadpur', 'Shalikha', 'Sreepur'],
    'Meherpur': ['Gangni', 'Meherpur Sadar', 'Mujibnagar'],
    'Narail': ['Kalia', 'Lohagara', 'Narail Sadar'],
    'Satkhira': ['Assasuni', 'Debhata', 'Kalaroa', 'Kaliganj', 'Satkhira Sadar', 'Shyamnagar', 'Tala'],
    'Bandarban': ['Alikadam', 'Bandarban Sadar', 'Lama', 'Naikhongchhari', 'Rowangchhari', 'Ruma', 'Thanchi'],
    'Brahmanbaria': ['Akhaura', 'Bancharampur', 'Brahmanbaria Sadar', 'Kasba', 'Nabinagar', 'Nasirnagar', 'Sarail', 'Ashuganj', 'Bijoynagar'],
    'Chandpur': ['Chandpur Sadar', 'Faridganj', 'Haimchar', 'Haziganj', 'Kachua', 'Matlab Dakshin', 'Matlab Uttar', 'Shahrasti'],
    'Chattogram': ['Anwara', 'Banshkhali', 'Boalkhali', 'Chandanaish', 'Fatikchhari', 'Hathazari', 'Lohagara', 'Mirsharai', 'Patiya', 'Rangunia', 'Raozan', 'Sandwip', 'Satkania', 'Sitakunda'],
    'Cumilla': ['Barura', 'Brahmanpara', 'Burichang', 'Chandina', 'Chauddagram', 'Daudkandi', 'Debidwar', 'Homna', 'Cumilla Sadar', 'Laksam', 'Muradnagar', 'Nangalkot', 'Meghna', 'Titas', 'Monohargonj', 'Cumilla Sadar Dakshin'],
    "Cox's Bazar": ["Chakaria", "Cox's Bazar Sadar", 'Kutubdia', 'Maheshkhali', 'Ramu', 'Teknaf', 'Ukhia', 'Pekua'],
    'Feni': ['Chhagalnaiya', 'Daganbhuiyan', 'Feni Sadar', 'Parshuram', 'Sonagazi', 'Fulgazi'],
    'Khagrachhari': ['Dighinala', 'Khagrachhari Sadar', 'Lakshmichhari', 'Mahalchhari', 'Manikchhari', 'Matiranga', 'Panchhari', 'Ramgarh', 'Guimara'],
    'Lakshmipur': ['Lakshmipur Sadar', 'Raipur', 'Ramganj', 'Ramgati', 'Kamalnagar'],
    'Noakhali': ['Begumganj', 'Chatkhil', 'Companiganj', 'Hatiya', 'Noakhali Sadar', 'Senbagh', 'Sonaimuri', 'Subarnachar', 'Kabirhat'],
    'Rangamati': ['Baghaichhari', 'Barkal', 'Kawkhali', 'Belaichhari', 'Kaptai', 'Juraichhari', 'Langadu', 'Nannerchar', 'Rajasthali', 'Rangamati Sadar'],
    'Barisal': ['Agailjhara', 'Babuganj', 'Bakerganj', 'Banaripara', 'Barisal Sadar', 'Gaurnadi', 'Hizla', 'Mehendiganj', 'Muladi', 'Wazirpur'],
    'Barguna': ['Amtali', 'Bamna', 'Barguna Sadar', 'Betagi', 'Patharghata', 'Taltali'],
    'Bhola': ['Bhola Sadar', 'Burhanuddin', 'Char Fasson', 'Daulatkhan', 'Lalmohan', 'Manpura', 'Tazumuddin'],
    'Jhalokathi': ['Jhalokathi Sadar', 'Kathalia', 'Nalchity', 'Rajapur'],
    'Patuakhali': ['Bauphal', 'Dashmina', 'Dumki', 'Galachipa', 'Kalapara', 'Mirzaganj', 'Patuakhali Sadar', 'Rangabali'],
    'Pirojpur': ['Bhandaria', 'Kawkhali', 'Mathbaria', 'Nazirpur', 'Nesarabad', 'Pirojpur Sadar', 'Indurkani']
  };

  const districts = Object.keys(districtThanas).sort();

  useEffect(() => {
    loadData();
  }, []);

  useEffect(() => {
    if (currentUser) {
      setSelectedDistrict(currentUser.district || '');
    }
  }, [currentUser]);

  const loadData = async () => {
    try {
      setLoading(true);
      const donorsResult = await window.storage.list('donor:', true);
      
      if (donorsResult && donorsResult.keys) {
        const donorPromises = donorsResult.keys.map(async (key) => {
          try {
            const result = await window.storage.get(key, true);
            return result ? JSON.parse(result.value) : null;
          } catch (error) {
            return null;
          }
        });
        
        const donorData = await Promise.all(donorPromises);
        setDonors(donorData.filter(d => d !== null));
      }
    } catch (error) {
      console.error('Error loading data:', error);
    } finally {
      setLoading(false);
    }
  };

  const canDonate = (lastDonationDate) => {
    if (!lastDonationDate) return true;
    const lastDate = new Date(lastDonationDate);
    const fourMonthsAgo = new Date();
    fourMonthsAgo.setMonth(fourMonthsAgo.getMonth() - 4);
    return lastDate <= fourMonthsAgo;
  };

  const getNextDonationDate = (lastDonationDate) => {
    if (!lastDonationDate) return null;
    const nextDate = new Date(lastDonationDate);
    nextDate.setMonth(nextDate.getMonth() + 4);
    return nextDate;
  };

  const handleSubmit = async () => {
    if (!formData.name || !formData.bloodGroup || !formData.phone || !formData.district || !formData.thana) {
      alert('Please fill in all required fields');
      return;
    }

    const isUpdate = !!currentUser;
    const donorId = currentUser?.id || `donor_${Date.now()}`;
    const donor = {
      id: donorId,
      ...formData,
      createdAt: currentUser?.createdAt || new Date().toISOString()
    };

    try {
      await window.storage.set(`donor:${donorId}`, JSON.stringify(donor), true);
      setCurrentUser(donor);
      setFormData(donor);
      setSelectedDistrict(donor.district);
      await loadData();
      alert(isUpdate ? 'Profile updated successfully!' : 'Registration successful!');
      setView('home');
    } catch (error) {
      console.error('Error saving donor:', error);
      alert('Failed to save profile. Please try again.');
    }
  };

  const handleLogin = async () => {
    if (!loginPhone.trim()) {
      alert('Please enter your phone number');
      return;
    }

    try {
      const donorsResult = await window.storage.list('donor:', true);
      
      if (donorsResult && donorsResult.keys) {
        for (const key of donorsResult.keys) {
          try {
            const result = await window.storage.get(key, true);
            if (result) {
              const donor = JSON.parse(result.value);
              if (donor.phone === loginPhone.trim()) {
                setCurrentUser(donor);
                setFormData(donor);
                setSelectedDistrict(donor.district || '');
                setShowLoginModal(false);
                setLoginPhone('');
                alert('Welcome back, ' + donor.name + '!');
                return;
              }
            }
          } catch (error) {
            continue;
          }
        }
        alert('No profile found with this phone number');
      } else {
        alert('No donors registered yet');
      }
    } catch (error) {
      console.error('Error during login:', error);
      alert('Error accessing profile. Please try again.');
    }
  };

  const filteredDonors = donors.filter(donor => {
    if (!canDonate(donor.lastDonation)) return false;
    
    if (searchBloodGroup && donor.bloodGroup !== searchBloodGroup) return false;
    
    if (searchDistrict && donor.district !== searchDistrict) return false;
    
    if (searchThana && donor.thana !== searchThana) return false;
    
    return true;
  });

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-red-50 to-pink-50 flex items-center justify-center">
        <div className="text-center">
          <Heart className="w-16 h-16 text-red-500 animate-pulse mx-auto mb-4" />
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 to-pink-50">
      {/* Header */}
      <header className="bg-white shadow-md">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <Heart className="w-8 h-8 text-red-500 fill-current" />
              <h1 className="text-2xl font-bold text-gray-800">Blood Donation Network</h1>
            </div>
            <div className="flex items-center space-x-4">
              {currentUser ? (
                <>
                  <span className="text-sm text-gray-600">Welcome, {currentUser.name}</span>
                  <button
                    onClick={() => {
                      setView('profile');
                      setFormData(currentUser);
                    }}
                    className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition"
                  >
                    My Profile
                  </button>
                  <button
                    onClick={() => {
                      setCurrentUser(null);
                      setSelectedDistrict('');
                      setFormData({ name: '', bloodGroup: '', phone: '', district: '', thana: '', lastDonation: '' });
                      setView('home');
                    }}
                    className="text-gray-600 hover:text-gray-800"
                  >
                    Logout
                  </button>
                </>
              ) : (
                <>
                  <button
                    onClick={() => setShowLoginModal(true)}
                    className="text-red-500 hover:text-red-600 font-medium"
                  >
                    Login
                  </button>
                  <button
                    onClick={() => setView('register')}
                    className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition"
                  >
                    Register as Donor
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Login Modal */}
      {showLoginModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-2xl max-w-md w-full p-8">
            <h2 className="text-2xl font-bold text-gray-800 mb-6">Login to Your Profile</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Phone Number
                </label>
                <input
                  type="tel"
                  value={loginPhone}
                  onChange={(e) => setLoginPhone(e.target.value)}
                  placeholder="Enter your registered phone number"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                  onKeyPress={(e) => {
                    if (e.key === 'Enter') {
                      handleLogin();
                    }
                  }}
                />
              </div>
              <div className="flex space-x-3">
                <button
                  onClick={handleLogin}
                  className="flex-1 bg-red-500 text-white py-3 rounded-lg hover:bg-red-600 transition font-medium"
                >
                  Login
                </button>
                <button
                  onClick={() => {
                    setShowLoginModal(false);
                    setLoginPhone('');
                  }}
                  className="flex-1 bg-gray-200 text-gray-700 py-3 rounded-lg hover:bg-gray-300 transition font-medium"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="container mx-auto px-4 py-8">
        {view === 'home' && (
          <>
            {/* Search Section */}
            <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
              <div className="flex items-center space-x-3 mb-4">
                <Search className="w-6 h-6 text-red-500" />
                <h2 className="text-xl font-bold text-gray-800">Find Blood Donors</h2>
              </div>
              <div className="grid md:grid-cols-3 gap-4 mb-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Blood Group
                  </label>
                  <select
                    value={searchBloodGroup}
                    onChange={(e) => setSearchBloodGroup(e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                  >
                    <option value="">All Blood Groups</option>
                    {bloodGroups.map(group => (
                      <option key={group} value={group}>{group}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    District
                  </label>
                  <select
                    value={searchDistrict}
                    onChange={(e) => {
                      setSearchDistrict(e.target.value);
                      setSearchThana('');
                    }}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                  >
                    <option value="">All Districts</option>
                    {districts.map(district => (
                      <option key={district} value={district}>{district}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Thana/Upazila
                  </label>
                  <select
                    value={searchThana}
                    onChange={(e) => setSearchThana(e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                    disabled={!searchDistrict}
                  >
                    <option value="">All Thanas</option>
                    {searchDistrict && districtThanas[searchDistrict]?.map(thana => (
                      <option key={thana} value={thana}>{thana}</option>
                    ))}
                  </select>
                </div>
              </div>
              <div className="flex justify-between items-center">
                <p className="text-sm text-gray-500">
                  Showing {filteredDonors.length} donor{filteredDonors.length !== 1 ? 's' : ''} ready to donate
                  {searchBloodGroup && ` with blood group ${searchBloodGroup}`}
                  {searchDistrict && ` in ${searchDistrict}`}
                  {searchThana && `, ${searchThana}`}
                </p>
                <button
                  onClick={() => {
                    setSearchBloodGroup('');
                    setSearchDistrict('');
                    setSearchThana('');
                  }}
                  className="px-6 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition text-sm font-medium"
                >
                  Clear Filters
                </button>
              </div>
            </div>

            {/* Stats */}
            <div className="grid md:grid-cols-3 gap-6 mb-8">
              <div className="bg-white rounded-xl shadow-lg p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-500 text-sm">Total Donors</p>
                    <p className="text-3xl font-bold text-gray-800">{donors.length}</p>
                  </div>
                  <User className="w-12 h-12 text-red-500 opacity-20" />
                </div>
              </div>
              <div className="bg-white rounded-xl shadow-lg p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-500 text-sm">Available Now</p>
                    <p className="text-3xl font-bold text-green-600">
                      {donors.filter(d => canDonate(d.lastDonation)).length}
                    </p>
                  </div>
                  <CheckCircle className="w-12 h-12 text-green-500 opacity-20" />
                </div>
              </div>
              <div className="bg-white rounded-xl shadow-lg p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-500 text-sm">Blood Groups</p>
                    <p className="text-3xl font-bold text-gray-800">{bloodGroups.length}</p>
                  </div>
                  <Heart className="w-12 h-12 text-red-500 opacity-20" />
                </div>
              </div>
            </div>

            {/* Donors List */}
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h2 className="text-xl font-bold text-gray-800 mb-6">
                Available Donors
                {(searchBloodGroup || searchDistrict || searchThana) && ' - Filtered Results'}
              </h2>
              {filteredDonors.length === 0 ? (
                <div className="text-center py-12">
                  <AlertCircle className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-500">No donors available at the moment</p>
                </div>
              ) : (
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {filteredDonors.map(donor => (
                    <div key={donor.id} className="border border-gray-200 rounded-lg p-5 hover:shadow-md transition">
                      <div className="flex items-start justify-between mb-4">
                        <div>
                          <h3 className="font-bold text-lg text-gray-800">{donor.name}</h3>
                          <span className="inline-block bg-red-100 text-red-600 px-3 py-1 rounded-full text-sm font-bold mt-2">
                            {donor.bloodGroup}
                          </span>
                        </div>
                        <CheckCircle className="w-6 h-6 text-green-500" />
                      </div>
                      <div className="space-y-2 text-sm text-gray-600">
                        <div className="flex items-center space-x-2">
                          <Phone className="w-4 h-4" />
                          <span>{donor.phone}</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <MapPin className="w-4 h-4" />
                          <span>{donor.district}, {donor.thana}</span>
                        </div>
                        {donor.lastDonation && (
                          <div className="flex items-center space-x-2">
                            <Calendar className="w-4 h-4" />
                            <span>Last: {new Date(donor.lastDonation).toLocaleDateString()}</span>
                          </div>
                        )}
                      </div>
                      <div className="mt-4 pt-4 border-t border-gray-200">
                        <p className="text-xs text-green-600 font-medium">✓ Ready to donate</p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </>
        )}

        {(view === 'register' || view === 'profile') && (
          <div className="max-w-2xl mx-auto">
            <div className="bg-white rounded-xl shadow-lg p-8">
              <div className="flex items-center space-x-3 mb-6">
                <User className="w-6 h-6 text-red-500" />
                <h2 className="text-2xl font-bold text-gray-800">
                  {view === 'profile' ? 'Update Profile' : 'Register as Donor'}
                </h2>
              </div>
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Full Name *
                  </label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Blood Group *
                  </label>
                  <select
                    value={formData.bloodGroup}
                    onChange={(e) => setFormData({ ...formData, bloodGroup: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                    required
                  >
                    <option value="">Select Blood Group</option>
                    {bloodGroups.map(group => (
                      <option key={group} value={group}>{group}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Phone Number *
                  </label>
                  <input
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                    required
                    disabled={view === 'profile'}
                  />
                  {view === 'profile' && (
                    <p className="text-xs text-gray-500 mt-1">Phone number cannot be changed</p>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    District *
                  </label>
                  <select
                    value={formData.district}
                    onChange={(e) => {
                      setFormData({ ...formData, district: e.target.value, thana: '' });
                      setSelectedDistrict(e.target.value);
                    }}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                    required
                  >
                    <option value="">Select District</option>
                    {districts.map(district => (
                      <option key={district} value={district}>{district}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Thana/Upazila *
                  </label>
                  <select
                    value={formData.thana}
                    onChange={(e) => setFormData({ ...formData, thana: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                    required
                    disabled={!selectedDistrict}
                  >
                    <option value="">Select Thana/Upazila</option>
                    {selectedDistrict && districtThanas[selectedDistrict]?.map(thana => (
                      <option key={thana} value={thana}>{thana}</option>
                    ))}
                  </select>
                  {!selectedDistrict && (
                    <p className="text-xs text-gray-500 mt-1">Please select a district first</p>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Last Blood Donation Date
                  </label>
                  <input
                    type="date"
                    value={formData.lastDonation}
                    onChange={(e) => setFormData({ ...formData, lastDonation: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                    max={new Date().toISOString().split('T')[0]}
                  />
                  {formData.lastDonation && !canDonate(formData.lastDonation) && (
                    <p className="text-sm text-orange-600 mt-2 flex items-center space-x-1">
                      <Clock className="w-4 h-4" />
                      <span>
                        Next donation available: {getNextDonationDate(formData.lastDonation)?.toLocaleDateString()}
                      </span>
                    </p>
                  )}
                  {formData.lastDonation && canDonate(formData.lastDonation) && (
                    <p className="text-sm text-green-600 mt-2">✓ Ready to donate</p>
                  )}
                </div>
                <div className="flex space-x-4">
                  <button
                    onClick={handleSubmit}
                    className="flex-1 bg-red-500 text-white py-3 rounded-lg hover:bg-red-600 transition font-medium"
                  >
                    {view === 'profile' ? 'Update Profile' : 'Register'}
                  </button>
                  <button
                    type="button"
                    onClick={() => setView('home')}
                    className="flex-1 bg-gray-200 text-gray-700 py-3 rounded-lg hover:bg-gray-300 transition font-medium"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Footer */}
      <footer className="bg-white border-t border-gray-200 mt-12">
        <div className="container mx-auto px-4 py-6">
          <div className="text-center">
            <p className="text-gray-600">💉 Save lives by donating blood • Every donation counts</p>
            <p className="mt-2 text-xs text-gray-500">
              Note: This app uses shared storage - all profiles are visible to everyone
            </p>
            <div className="mt-4 pt-4 border-t border-gray-200">
              <p className="text-sm text-gray-700">
                Developed by <span className="font-semibold text-red-600">Junaed</span>
              </p>
              <p className="text-xs text-gray-500 mt-1">Blood Donation Network © 2024</p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default BloodDonationApp;