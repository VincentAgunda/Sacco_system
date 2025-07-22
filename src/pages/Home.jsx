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
import CloseIcon from '@mui/icons-material/Close';

// Import your images
import benefitsImage from '../assets/images/benefits-image.jpg';
import propertyInsuranceImage from '../assets/images/property-insurance.jpg';
import groupBenefitsImage from '../assets/images/group-benefits.jpg';
import heroBackgroundImage from '../assets/images/hero-image.png';
import retirementPlanningImage from '../assets/images/retirement-planning.jpg';
import assetFinancingImage from '../assets/images/asset-financing.jpg';

// --- Data for the solutions section ---
const solutions = [
    {
      icon: <HomeWorkIcon className="text-[#0b5394] mr-2" fontSize="medium" />,
      title: "Property Insurance",
      image: propertyInsuranceImage,
      description: "Protect your business and assets with our comprehensive property insurance.",
      details: [
        "Our Property Insurance provides extensive coverage against risks like fire, theft, and natural disasters.",
        "We offer customizable plans tailored to the specific needs of your business, from small shops to large complexes.",
        "Key benefits include building coverage, contents insurance, and business interruption protection."
      ]
    },
    {
      icon: <BusinessCenterIcon className="text-[#0b5394] mr-2" fontSize="medium" />,
      title: "Group Benefits",
      image: groupBenefitsImage,
      description: "Attract and retain top talent with comprehensive health insurance for teams.",
      details: [
          "Our Group Employment Benefits are flexible and affordable, providing essential health coverage for your employees.",
          "Packages include medical, dental, and vision insurance, along with options for life and disability coverage.",
          "A strong benefits package helps you build a loyal and motivated team in a competitive job market."
      ]
    },
    {
      icon: <ElderlyIcon className="text-[#0b5394] mr-2" fontSize="medium" />,
      title: "Retirement Planning",
      image: retirementPlanningImage,
      description: "Secure your future with tailored pension and retirement plans. Start planning today.",
      details: [
        "Build your nest egg with our range of retirement savings plans, including pension plans and provident funds.",
        "Our financial advisors will create a personalized strategy based on your financial goals and timeline.",
        "Benefit from tax advantages and competitive interest rates to maximize your long-term growth."
      ]
    },
    {
      icon: <DirectionsCarIcon className="text-[#0b5394] mr-2" fontSize="medium" />,
      title: "Asset Financing",
      image: assetFinancingImage,
      description: "Acquire vehicles and equipment with our flexible financing options.",
      details: [
          "Whether buying a new car, upgrading equipment, or investing in machinery, our Asset Financing can help.",
          "We offer flexible repayment terms and competitive interest rates to fit your budget.",
          "Our quick approval process means you can get the assets you need without delay."
      ]
    },
];

// --- Reusable Components ---

const SectionHeader = ({ title, subtitle }) => (
  <motion.div
    className="max-w-4xl mx-auto text-center mb-10 px-4"
    initial={{ opacity: 0, y: 20 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true, amount: 0.5 }}
    transition={{ duration: 0.5 }}
  >
    <h2 className="text-2xl md:text-3xl font-bold text-[#0c343d] mb-2">{title}</h2>
    <p className="text-base md:text-lg text-[#6d8791] max-w-2xl mx-auto">{subtitle}</p>
  </motion.div>
);

const FeatureCard = React.memo(({ icon, title, description }) => (
  <motion.div
    whileHover={{ y: -6, scale: 1.03, boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)' }}
    className="bg-white rounded-xl p-6 shadow-md border border-gray-100 flex flex-col h-full cursor-pointer"
  >
    <motion.div
      className="bg-[#e8f0fe] text-[#0b5394] w-12 h-12 rounded-full flex items-center justify-center mb-3"
      animate={{ y: [0, -5, 0] }}
      transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
    >
      {icon}
    </motion.div>
    <h3 className="text-lg font-bold text-[#0c343d] mb-1">{title}</h3>
    <p className="text-sm text-[#6d8791]">{description}</p>
  </motion.div>
));

const BenefitItem = React.memo(({ title, children }) => (
  <motion.div className="flex items-start">
    <CheckCircleIcon className="text-[#0b5394] mr-3 mt-1 shrink-0" style={{ fontSize: '20px' }} />
    <div>
      <h3 className="text-base font-semibold text-[#0c343d]">{title}</h3>
      <p className="text-sm text-[#6d8791]">{children}</p>
    </div>
  </motion.div>
));

const SolutionCard = React.memo(({ solution, onLearnMore }) => (
  <div className="flex flex-col w-64 flex-shrink-0 bg-white rounded-lg shadow-md border border-gray-100 overflow-hidden group">
    <div className="overflow-hidden h-36">
      <img src={solution.image} alt={solution.title} className="w-full h-full object-cover transition-transform duration-300 ease-in-out group-hover:scale-110" loading="lazy" />
    </div>
    <div className="p-4 flex flex-col flex-grow">
      <div className="flex items-center mb-2">
        {solution.icon}
        <h3 className="text-base font-bold text-[#0c343d]">{solution.title}</h3>
      </div>
      <p className="text-xs text-[#6d8791] mb-3 flex-grow">{solution.description}</p>
      <motion.button
        onClick={onLearnMore}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        className="bg-[#0b5394] text-white font-semibold py-1.5 px-4 rounded-full hover:bg-[#0c343d] transition self-start mt-auto text-xs"
      >
        Learn more
      </motion.button>
    </div>
  </div>
));

// --- MOBILE RESPONSIVE Modal Component ---
const SolutionModal = ({ solution, onClose }) => {
    const backdropVariants = {
        visible: { opacity: 1 },
        hidden: { opacity: 0 }
    };

    const modalVariants = {
        hidden: { y: "20vh", opacity: 0, scale: 0.9 },
        visible: { y: 0, opacity: 1, scale: 1, transition: { type: "spring", stiffness: 150, damping: 20 } },
        exit: { y: "20vh", opacity: 0, scale: 0.9, transition: { duration: 0.2 } }
    };

    return (
        <motion.div
            className="fixed inset-0 bg-black/60 backdrop-blur-sm flex justify-center items-center z-50 p-4"
            variants={backdropVariants}
            initial="hidden"
            animate="visible"
            exit="hidden"
            onClick={onClose}
        >
            <motion.div
                className="bg-white/95 backdrop-blur-xl rounded-xl shadow-2xl w-full max-w-sm sm:max-w-md mx-auto flex flex-col max-h-[90vh]"
                variants={modalVariants}
                onClick={(e) => e.stopPropagation()}
            >
                <div className="relative">
                    <img src={solution.image} alt={solution.title} className="w-full h-40 object-cover rounded-t-xl" />
                    <button onClick={onClose} className="absolute top-2 right-2 bg-black/50 text-white rounded-full p-1 hover:bg-black/70 transition">
                        <CloseIcon fontSize="small"/>
                    </button>
                </div>

                <div className="p-4 sm:p-6 overflow-y-auto">
                    <div className="flex items-center mb-3">
                        {React.cloneElement(solution.icon, { fontSize: 'medium' })}
                        <h2 className="ml-2 text-lg sm:text-xl font-bold text-[#0c343d]">{solution.title}</h2>
                    </div>
                    <div className="space-y-3">
                        {solution.details.map((paragraph, index) => (
                            <p key={index} className="text-sm sm:text-base text-gray-800 leading-relaxed">
                                {paragraph}
                            </p>
                        ))}
                    </div>
                </div>
            </motion.div>
        </motion.div>
    );
};


const marqueeVariants = {
    animate: {
      x: "-50%",
      transition: { x: { repeat: Infinity, repeatType: "loop", duration: 35, ease: "linear" } },
    },
};

// --- Main Home Component ---
export default function Home() {
  const { currentUser } = useAuth();
  const [selectedSolution, setSelectedSolution] = useState(null);

  return (
    <div className="min-h-screen bg-[#f3f6f4]">
        {/* Hero Section */}
        <section
            className="relative py-20 md:py-28 text-white"
            style={{ backgroundImage: `url(${heroBackgroundImage})`, backgroundSize: 'cover', backgroundPosition: 'center' }}
        >
            <div className="absolute inset-0 bg-black opacity-50"></div>
            <div className="container mx-auto px-4 relative z-10 text-center">
                <motion.h1
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.7, type: 'spring' }}
                    className="text-3xl md:text-4xl font-extrabold mb-3" style={{ textShadow: '2px 2px 6px rgba(0, 0, 0, 0.6)' }}
                >
                    Katch Cooperative
                </motion.h1>
                <motion.p
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.7, delay: 0.2 }}
                    className="text-base md:text-lg mb-6 max-w-xl mx-auto font-light" style={{ textShadow: '1px 1px 4px rgba(0, 0, 0, 0.6)' }}
                >
                    Empowering communities through cooperative savings and credit solutions.
                </motion.p>
                <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.7, delay: 0.4 }}
                    className="flex flex-col sm:flex-row justify-center items-center gap-3"
                >
                    {currentUser ? (
                    <Link to="/dashboard" className="bg-[#0b5394] hover:bg-[#0a4a83] text-white font-bold py-2.5 px-6 rounded-full text-base transition-transform transform hover:scale-105 shadow-lg">
                        Go to Dashboard
                    </Link>
                    ) : (
                    <>
                        <Link to="/register" className="bg-[#0b5394] hover:bg-[#0a4a83] text-white font-bold py-2.5 px-6 rounded-full text-base transition-transform transform hover:scale-105 shadow-lg">
                        Join Now
                        </Link>
                        <Link to="/login" className="bg-transparent border-2 border-white text-white hover:bg-white hover:text-[#0b5394] font-bold py-2.5 px-6 rounded-full text-base transition-transform transform hover:scale-105">
                        Member Login
                        </Link>
                    </>
                    )}
                </motion.div>
            </div>
        </section>

        {/* Features Section */}
        <section className="py-12 bg-[#f3f6f4]">
            <div className="container mx-auto">
                <SectionHeader
                    title="One account to transact and invest"
                    subtitle="Catering to your growth and development as an institution"
                />
                <motion.div
                    className="grid grid-cols-1 md:grid-cols-3 gap-5 max-w-5xl mx-auto px-4"
                    viewport={{ once: true, amount: 0.2 }}
                >
                    <FeatureCard title="Savings" description="Build your savings with competitive interest rates" icon={<SavingsIcon />} />
                    <FeatureCard title="Loans" description="Access affordable loans with favorable terms" icon={<MonetizationOnIcon />} />
                    <FeatureCard title="Community" description="Join a supportive community for financial freedom" icon={<GroupsIcon />} />
                </motion.div>
            </div>
        </section>

        {/* Benefits Section */}
        <section className="py-12 bg-white">
            <div className="container mx-auto px-4">
                <div className="flex flex-col md:flex-row items-center gap-8 max-w-5xl mx-auto">
                    <motion.div
                        className="md:w-1/2"
                        initial={{ opacity: 0, x: -40 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true, amount: 0.5 }}
                        transition={{ duration: 0.7 }}
                    >
                        <div className="rounded-lg overflow-hidden shadow-lg">
                            <motion.img
                            src={benefitsImage}
                            alt="Collaborative financial planning"
                            className="w-full h-auto object-cover"
                            loading="lazy"
                            whileHover={{ scale: 1.05 }}
                            transition={{ duration: 0.3 }}
                            />
                        </div>
                    </motion.div>
                    <motion.div
                        className="md:w-1/2"
                        viewport={{ once: true, amount: 0.5 }}
                    >
                        <h2 className="text-2xl md:text-3xl font-bold text-[#0c343d] mb-4">Benefits of banking with us</h2>
                        <div className="space-y-4">
                            <BenefitItem title="Streamlined, seamless & smarter">Our digital-first approach ensures effortless banking.</BenefitItem>
                            <BenefitItem title="Driven & dedicated service">Our team is committed to your financial success.</BenefitItem>
                            <BenefitItem title="Diverse & informed investment">Grow your wealth with our curated opportunities.</BenefitItem>
                        </div>
                    </motion.div>
                </div>
            </div>
        </section>

        {/* Solutions Section */}
        <section className="py-12 bg-[#f3f6f4] overflow-hidden">
            <div className="container mx-auto">
                <SectionHeader title="Solutions structured around you" subtitle="Tailored financial solutions for your unique needs"/>
            </div>
            <motion.div className="flex" variants={marqueeVariants} animate="animate">
                <div className="flex flex-none gap-4 px-2">
                    {solutions.map((solution, index) => (
                        <SolutionCard key={`solution-a-${index}`} solution={solution} onLearnMore={() => setSelectedSolution(solution)} />
                    ))}
                </div>
                <div className="flex flex-none gap-4 px-2">
                    {solutions.map((solution, index) => (
                        <SolutionCard key={`solution-b-${index}`} solution={solution} onLearnMore={() => setSelectedSolution(solution)} />
                    ))}
                </div>
            </motion.div>
        </section>

        {/* CTA Section */}
        <section className="py-12 bg-gradient-to-r from-[#0b5394] to-[#6d8791] text-white">
            <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: 0.8 }} transition={{ duration: 0.7 }} className="container mx-auto px-4 text-center">
                <h2 className="text-2xl md:text-3xl font-bold mb-3">Ready to join our community?</h2>
                <p className="text-base mb-6 max-w-xl mx-auto">Become part of a financial cooperative that puts your needs first.</p>
                <div className="flex flex-col sm:flex-row justify-center gap-3">
                    <Link to="/register" className="bg-white hover:bg-gray-100 text-[#0b5394] font-bold py-2.5 px-6 rounded-full text-base transition shadow-md transform hover:scale-105">Open an Account</Link>
                    <Link to="/contact" className="bg-transparent border-2 border-white text-white hover:bg-white hover:text-[#0b5394] font-bold py-2.5 px-6 rounded-full text-base transition transform hover:scale-105">Contact Us</Link>
                </div>
            </motion.div>
        </section>

        {/* Footer */}
        <footer className="bg-[#0c343d] text-white py-8">
            <div className="container mx-auto px-4">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6 max-w-5xl mx-auto text-xs">
                    <div className="mb-4 md:mb-0">
                        <h3 className="text-base font-bold mb-2">Cooperative SACCO</h3>
                        <p className="text-[#d0d2db]">Empowering communities through cooperative savings and credit solutions.</p>
                    </div>
                    <div>
                        <h4 className="font-bold mb-2">Quick Links</h4>
                        <ul className="space-y-1.5 text-[#d0d2db]">
                            <li><Link to="/about" className="hover:text-white transition">About Us</Link></li>
                            <li><Link to="/services" className="hover:text-white transition">Services</Link></li>
                            <li><Link to="/loans" className="hover:text-white transition">Loans</Link></li>
                            <li><Link to="/savings" className="hover:text-white transition">Savings</Link></li>
                        </ul>
                    </div>
                    <div>
                        <h4 className="font-bold mb-2">Resources</h4>
                        <ul className="space-y-1.5 text-[#d0d2db]">
                            <li><Link to="/faq" className="hover:text-white transition">FAQs</Link></li>
                            <li><Link to="/blog" className="hover:text-white transition">Blog</Link></li>
                            <li><Link to="/calculators" className="hover:text-white transition">Calculators</Link></li>
                            <li><Link to="/contact" className="hover:text-white transition">Support</Link></li>
                        </ul>
                    </div>
                    <div>
                        <h4 className="font-bold mb-2">Contact Us</h4>
                        <ul className="space-y-2 text-[#d0d2db]">
                            <li className="flex items-start"><LocationOnIcon className="mr-2 mt-0.5 shrink-0" style={{fontSize: '14px'}} /><span>123 Financial St, Nairobi, Kenya</span></li>
                            <li className="flex items-start"><PhoneIcon className="mr-2 mt-0.5 shrink-0" style={{fontSize: '14px'}} /><span>+254 792 823 182</span></li>
                            <li className="flex items-start"><EmailIcon className="mr-2 mt-0.5 shrink-0" style={{fontSize: '14px'}} /><span>info@sacco.co.ke</span></li>
                        </ul>
                    </div>
                </div>
                <div className="border-t border-gray-700 mt-6 pt-4 text-center text-xs text-[#d0d2db]">
                    <p>&copy; {new Date().getFullYear()} Cooperative SACCO. All rights reserved.</p>
                </div>
            </div>
        </footer>

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