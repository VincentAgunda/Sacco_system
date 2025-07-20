import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { motion, AnimatePresence } from 'framer-motion';

// Import Material-UI Icons
import SavingsIcon from '@mui/icons-material/Savings';
import MonetizationOnIcon from '@mui/icons-material/MonetizationOn';
import GroupsIcon from '@mui/icons-material/Groups';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import HomeWorkIcon from '@mui/icons-material/HomeWork';
import BusinessCenterIcon from '@mui/icons-material/BusinessCenter';
import ElderlyIcon from '@mui/icons-material/Elderly';
import DirectionsCarIcon from '@mui/icons-material/DirectionsCar';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import PhoneIcon from '@mui/icons-material/Phone';
import EmailIcon from '@mui/icons-material/Email';
import CloseIcon from '@mui/icons-material/Close'; // For the modal close button

// Import your images
import benefitsImage from '../assets/images/benefits-image.jpg';
import propertyInsuranceImage from '../assets/images/property-insurance.jpg';
import groupBenefitsImage from '../assets/images/group-benefits.jpg';
import heroBackgroundImage from '../assets/images/hero-image.png';
import retirementPlanningImage from '../assets/images/retirement-planning.jpg';
import assetFinancingImage from '../assets/images/asset-financing.jpg';

// --- Data for the solutions section with NEW 'details' field ---
const solutions = [
    {
      icon: <HomeWorkIcon className="text-[#0b5394] mr-3" fontSize="large" />,
      title: "Property Insurance",
      image: propertyInsuranceImage,
      description: "Protect your business and assets to ensure continuity with our comprehensive property insurance.",
      details: [
        "Our Property Insurance provides extensive coverage against risks such as fire, theft, and natural disasters, safeguarding your physical assets.",
        "We offer customizable plans tailored to the specific needs of your business, whether you own a small shop or a large industrial complex.",
        "Key benefits include building coverage, contents insurance, and business interruption protection to keep you operational even in a crisis."
      ]
    },
    {
      icon: <BusinessCenterIcon className="text-[#0b5394] mr-3" fontSize="large" />,
      title: "Group Benefits",
      image: groupBenefitsImage,
      description: "Attract and retain top talent with comprehensive health insurance for teams of all sizes.",
      details: [
          "Our Group Employment Benefits are designed to be flexible and affordable, providing essential health and wellness coverage for your employees.",
          "Packages include medical, dental, and vision insurance, along with options for life and disability coverage.",
          "A strong benefits package is a key differentiator in today's competitive job market, helping you build a loyal and motivated team."
      ]
    },
    {
      icon: <ElderlyIcon className="text-[#0b5394] mr-3" fontSize="large" />,
      title: "Retirement Planning",
      image: retirementPlanningImage,
      description: "Secure your future with our tailored pension and retirement plans. Start planning for a comfortable tomorrow.",
      details: [
        "Start building your nest egg with our range of retirement savings plans, including individual pension plans and provident funds.",
        "Our financial advisors will work with you to create a personalized strategy based on your financial goals and retirement timeline.",
        "Benefit from tax advantages and competitive interest rates to maximize your long-term growth and ensure a secure retirement."
      ]
    },
    {
      icon: <DirectionsCarIcon className="text-[#0b5394] mr-3" fontSize="large" />,
      title: "Asset Financing",
      image: assetFinancingImage,
      description: "Acquire the assets you need, from vehicles to equipment, with our flexible financing options.",
      details: [
          "Whether you're buying a new car, upgrading business equipment, or investing in machinery, our Asset Financing makes it possible.",
          "We offer flexible repayment terms and competitive interest rates to fit your budget.",
          "Our quick approval process means you can get the assets you need to grow your business or improve your personal life without delay."
      ]
    },
];


// --- Reusable Components ---

const SectionHeader = ({ title, subtitle }) => (
  <motion.div
    className="max-w-4xl mx-auto text-center mb-16"
    initial={{ opacity: 0, y: 20 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true, amount: 0.5 }}
    transition={{ duration: 0.7 }}
  >
    <h2 className="text-3xl md:text-4xl font-bold text-[#0c343d] mb-4">{title}</h2>
    <p className="text-lg md:text-xl text-[#6d8791] max-w-3xl mx-auto">{subtitle}</p>
  </motion.div>
);

const FeatureCard = React.memo(({ icon, title, description }) => (
  <motion.div
    whileHover={{ y: -10, scale: 1.03, boxShadow: '0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1)' }}
    className="bg-white rounded-2xl p-8 shadow-lg border border-gray-100 flex flex-col h-full cursor-pointer"
  >
    <motion.div
      className="bg-[#e8f0fe] text-[#0b5394] w-16 h-16 rounded-full flex items-center justify-center mb-5"
      animate={{ y: [0, -8, 0] }}
      transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
    >
      {icon}
    </motion.div>
    <h3 className="text-xl font-bold text-[#0c343d] mb-2">{title}</h3>
    <p className="text-[#6d8791]">{description}</p>
  </motion.div>
));

const BenefitItem = React.memo(({ title, children }) => (
  <motion.div className="flex items-start">
    <CheckCircleIcon className="text-[#0b5394] mr-4 mt-1 shrink-0" style={{ fontSize: '28px' }} />
    <div>
      <h3 className="text-xl font-semibold text-[#0c343d]">{title}</h3>
      <p className="text-[#6d8791] mt-1">{children}</p>
    </div>
  </motion.div>
));

// MODIFIED SolutionCard to trigger the modal
const SolutionCard = React.memo(({ solution, onLearnMore }) => (
  <div className="flex flex-col w-80 flex-shrink-0 bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden group">
    <div className="overflow-hidden h-44">
      <img src={solution.image} alt={solution.title} className="w-full h-full object-cover transition-transform duration-500 ease-in-out group-hover:scale-110" loading="lazy" />
    </div>
    <div className="p-6 flex flex-col flex-grow">
      <div className="flex items-center mb-3">
        {solution.icon}
        <h3 className="text-xl font-bold text-[#0c343d]">{solution.title}</h3>
      </div>
      <p className="text-base text-[#6d8791] mb-4">{solution.description}</p>
      {/* Changed to a button to trigger the modal onClick */}
      <motion.button
        onClick={onLearnMore}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        className="bg-[#0b5394] text-white font-semibold py-2 px-6 rounded-full hover:bg-[#0c343d] transition self-start mt-auto"
      >
        Learn more
      </motion.button>
    </div>
  </div>
));

// --- NEW: Frosted Glass Modal Component ---
const SolutionModal = ({ solution, onClose }) => {
    // Animation variants for the modal components
    const backdropVariants = {
        visible: { opacity: 1 },
        hidden: { opacity: 0 }
    };

    const modalVariants = {
        hidden: { y: "100vh", opacity: 0, scale: 0.7 },
        visible: { y: 0, opacity: 1, scale: 1, transition: { type: "spring", stiffness: 120, damping: 15 } },
        exit: { y: "100vh", opacity: 0, scale: 0.7, transition: { duration: 0.3 } }
    };
    
    const contentVariants = {
        hidden: { opacity: 0 },
        visible: { opacity: 1, transition: { staggerChildren: 0.1, delayChildren: 0.2 } }
    };

    const textItemVariants = {
        hidden: { y: 20, opacity: 0 },
        visible: { y: 0, opacity: 1 }
    };

    return (
        <motion.div
            className="fixed inset-0 bg-black/50 backdrop-blur-sm flex justify-center items-center z-50 p-4"
            variants={backdropVariants}
            initial="hidden"
            animate="visible"
            exit="hidden"
            onClick={onClose}
        >
            <motion.div
                className="bg-white/80 backdrop-blur-lg rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-hidden flex flex-col"
                variants={modalVariants}
                onClick={(e) => e.stopPropagation()} // Prevent closing modal when clicking inside
            >
                <div className="relative">
                    <img src={solution.image} alt={solution.title} className="w-full h-56 object-cover" />
                    <button onClick={onClose} className="absolute top-4 right-4 bg-black/40 text-white rounded-full p-2 hover:bg-black/60 transition">
                        <CloseIcon />
                    </button>
                </div>

                <motion.div 
                    className="p-8 overflow-y-auto"
                    variants={contentVariants}
                    initial="hidden"
                    animate="visible"
                >
                    <motion.div variants={textItemVariants} className="flex items-center mb-4">
                        {solution.icon}
                        <h2 className="text-3xl font-bold text-[#0c343d]">{solution.title}</h2>
                    </motion.div>
                    <div className="space-y-4">
                        {solution.details.map((paragraph, index) => (
                            <motion.p key={index} variants={textItemVariants} className="text-lg text-gray-700 leading-relaxed">
                                {paragraph}
                            </motion.p>
                        ))}
                    </div>
                </motion.div>
            </motion.div>
        </motion.div>
    );
};

// Animation variant for the marquee
const marqueeVariants = {
    animate: {
      x: "-50%",
      transition: { x: { repeat: Infinity, repeatType: "loop", duration: 35, ease: "linear" } },
    },
};


// --- Main Home Component ---
export default function Home() {
  const { currentUser } = useAuth();
  // State to manage which solution modal is open
  const [selectedSolution, setSelectedSolution] = useState(null);

  return (
    <div className="min-h-screen bg-[#f3f6f4]">
        {/* Hero Section */}
        <section
            className="relative py-32 md:py-48 text-white overflow-hidden"
            style={{ backgroundImage: `url(${heroBackgroundImage})`, backgroundSize: 'cover', backgroundPosition: 'center' }}
        >
            <div className="absolute inset-0 bg-black opacity-50"></div>
            <div className="container mx-auto px-4 relative z-10 text-center">
                <motion.h1
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, type: 'spring', stiffness: 100 }}
                    className="text-4xl md:text-6xl font-extrabold mb-6" style={{ textShadow: '2px 2px 8px rgba(0, 0, 0, 0.7)' }}
                >
                    Katch Cooperative
                </motion.h1>
                <motion.p
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 0.3 }}
                    className="text-lg md:text-xl mb-12 max-w-3xl mx-auto font-light" style={{ textShadow: '1px 1px 4px rgba(0, 0, 0, 0.7)' }}
                >
                    Empowering communities through cooperative savings and credit solutions.
                </motion.p>
                <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.8, delay: 0.6 }}
                    className="flex flex-col sm:flex-row justify-center items-center gap-4"
                >
                    {currentUser ? (
                    <Link to="/dashboard" className="bg-[#0b5394] hover:bg-[#0a4a83] text-white font-bold py-4 px-10 rounded-full text-lg transition-transform transform hover:scale-105 shadow-2xl">
                        Go to Dashboard
                    </Link>
                    ) : (
                    <>
                        <Link to="/register" className="bg-[#0b5394] hover:bg-[#0a4a83] text-white font-bold py-4 px-10 rounded-full text-lg transition-transform transform hover:scale-105 shadow-2xl">
                        Join Now
                        </Link>
                        <Link to="/login" className="bg-transparent border-2 border-white text-white hover:bg-white hover:text-[#0b5394] font-bold py-4 px-10 rounded-full text-lg transition-transform transform hover:scale-105">
                        Member Login
                        </Link>
                    </>
                    )}
                </motion.div>
            </div>
        </section>

        {/* Features Section */}
        <section className="py-20 bg-[#f3f6f4]">
            <div className="container mx-auto px-4">
            <SectionHeader
                title="One account to transact and invest"
                subtitle="Catering to your growth and development as an institution"
            />
            <motion.div
                className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto"
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, amount: 0.2 }}
            >
                <FeatureCard title="Savings" description="Build your savings with competitive interest rates" icon={<SavingsIcon fontSize="large" />} />
                <FeatureCard title="Loans" description="Access affordable loans with favorable terms" icon={<MonetizationOnIcon fontSize="large" />} />
                <FeatureCard title="Community" description="Join a supportive community working towards financial freedom" icon={<GroupsIcon fontSize="large" />} />
            </motion.div>
            </div>
        </section>

        {/* Benefits Section */}
        <section className="py-20 bg-white">
            <div className="container mx-auto px-4">
                <div className="flex flex-col md:flex-row items-center gap-12 max-w-6xl mx-auto">
                    <motion.div
                        className="md:w-1/2"
                        initial={{ opacity: 0, x: -50 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true, amount: 0.5 }}
                        transition={{ duration: 0.8 }}
                    >
                        <div className="rounded-2xl overflow-hidden shadow-xl">
                            <motion.img
                            src={benefitsImage}
                            alt="A team collaborating on financial planning"
                            className="w-full h-auto object-cover"
                            loading="lazy"
                            whileHover={{ scale: 1.05 }}
                            transition={{ duration: 0.4 }}
                            />
                        </div>
                    </motion.div>
                    <motion.div
                        className="md:w-1/2"
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true, amount: 0.5 }}
                    >
                        <h2 className="text-3xl md:text-4xl font-bold text-[#0c343d] mb-8">Benefits of banking with us</h2>
                        <div className="space-y-6">
                            <BenefitItem title="Streamlined, seamless & smarter">Our digital-first approach ensures effortless banking anytime, anywhere.</BenefitItem>
                            <BenefitItem title="Driven & dedicated service">Our team is committed to your financial success with personalized support.</BenefitItem>
                            <BenefitItem title="Diverse & informed investment">Grow your wealth with our expertly curated investment opportunities.</BenefitItem>
                        </div>
                    </motion.div>
                </div>
            </div>
        </section>

        {/* Solutions Section */}
        <section className="py-20 bg-[#f3f6f4]">
            <div className="container mx-auto px-4">
                <SectionHeader title="Solutions structured around you" subtitle="Tailored financial solutions for your unique needs"/>
            </div>
            <div className="w-full overflow-hidden relative">
                <div className="absolute top-0 bottom-0 left-0 w-24 bg-gradient-to-r from-[#f3f6f4] to-transparent z-10"></div>
                <motion.div className="flex" variants={marqueeVariants} animate="animate" whileHover={{ paused: true }}>
                    <div className="flex flex-none gap-8 pr-8">
                        {solutions.map((solution, index) => (
                            <SolutionCard key={`solution-a-${index}`} solution={solution} onLearnMore={() => setSelectedSolution(solution)} />
                        ))}
                    </div>
                    <div className="flex flex-none gap-8 pr-8">
                        {solutions.map((solution, index) => (
                            <SolutionCard key={`solution-b-${index}`} solution={solution} onLearnMore={() => setSelectedSolution(solution)} />
                        ))}
                    </div>
                </motion.div>
                <div className="absolute top-0 bottom-0 right-0 w-24 bg-gradient-to-l from-[#f3f6f4] to-transparent z-10"></div>
            </div>
        </section>

        {/* CTA Section */}
        <section className="py-20 bg-gradient-to-r from-[#0b5394] to-[#6d8791] text-white">
            <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: 0.8 }} transition={{ duration: 0.8 }} className="container mx-auto px-4 text-center">
                <h2 className="text-3xl md:text-4xl font-bold mb-6">Ready to join our community?</h2>
                <p className="text-xl mb-10 max-w-2xl mx-auto">Become part of a financial cooperative that puts your needs first.</p>
                <div className="flex flex-col sm:flex-row justify-center gap-4">
                    <Link to="/register" className="bg-white hover:bg-gray-100 text-[#0b5394] font-bold py-3 px-8 rounded-full text-lg transition shadow-lg transform hover:scale-105">Open an Account</Link>
                    <Link to="/contact" className="bg-transparent border-2 border-white text-white hover:bg-white hover:text-[#0b5394] font-bold py-3 px-8 rounded-full text-lg transition transform hover:scale-105">Contact Us</Link>
                </div>
            </motion.div>
        </section>

        {/* Footer */}
        <footer className="bg-[#0c343d] text-white py-12">
            <div className="container mx-auto px-4">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-8 max-w-6xl mx-auto">
                    <div>
                        <h3 className="text-xl font-bold mb-4">Cooperative SACCO</h3>
                        <p className="text-[#d0d2db]">Empowering communities through cooperative savings and credit solutions.</p>
                    </div>
                    <div>
                        <h4 className="font-bold mb-4">Quick Links</h4>
                        <ul className="space-y-2 text-[#d0d2db]">
                            <li><Link to="/about" className="hover:text-white transition">About Us</Link></li>
                            <li><Link to="/services" className="hover:text-white transition">Services</Link></li>
                            <li><Link to="/loans" className="hover:text-white transition">Loans</Link></li>
                            <li><Link to="/savings" className="hover:text-white transition">Savings</Link></li>
                        </ul>
                    </div>
                    <div>
                        <h4 className="font-bold mb-4">Resources</h4>
                        <ul className="space-y-2 text-[#d0d2db]">
                            <li><Link to="/faq" className="hover:text-white transition">FAQs</Link></li>
                            <li><Link to="/blog" className="hover:text-white transition">Blog</Link></li>
                            <li><Link to="/calculators" className="hover:text-white transition">Calculators</Link></li>
                            <li><Link to="/contact" className="hover:text-white transition">Support</Link></li>
                        </ul>
                    </div>
                    <div>
                        <h4 className="font-bold mb-4">Contact Us</h4>
                        <ul className="space-y-3 text-[#d0d2db]">
                            <li className="flex items-start"><LocationOnIcon className="mr-3 mt-1 shrink-0" fontSize="small" /><span>123 Financial St, Nairobi, Kenya</span></li>
                            <li className="flex items-start"><PhoneIcon className="mr-3 mt-1 shrink-0" fontSize="small" /><span>+254 792 823 182</span></li>
                            <li className="flex items-start"><EmailIcon className="mr-3 mt-1 shrink-0" fontSize="small" /><span>info@sacco.co.ke</span></li>
                        </ul>
                    </div>
                </div>
                <div className="border-t border-gray-700 mt-12 pt-6 text-center text-[#d0d2db]">
                    <p>&copy; {new Date().getFullYear()} Cooperative SACCO. All rights reserved.</p>
                </div>
            </div>
        </footer>

        {/* Modal is rendered here using a Portal-like pattern at the root */}
        <AnimatePresence>
            {selectedSolution && (
                <SolutionModal 
                    solution={selectedSolution} 
                    onClose={() => setSelectedSolution(null)} 
                />
            )}
        </AnimatePresence>
    </div>
  );
}