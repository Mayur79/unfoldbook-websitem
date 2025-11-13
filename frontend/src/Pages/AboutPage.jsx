import React from "react";
import { motion } from "framer-motion";
import {
  BookOpen,
  Target,
  Award,
  Users,
  Rocket,
  Mail,
  Sparkles,
} from "lucide-react";

const AboutPage = () => {
  return (
    <div className="font-poppins bg-gradient-to-r from-blue-100 via-white to-cyan-100 min-h-screen text-gray-800">
      {/* 🌟 HERO SECTION */}
      <section className="relative text-center py-16 px-6 md:px-10 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-100 via-white to-cyan-100 opacity-60 blur-3xl" />
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="relative z-10"
        >
          <h1 className="text-4xl md:text-5xl font-extrabold text-blue-700 mb-4">
            About <span className="text-cyan-500">UnfoldBooks</span>
          </h1>
          <p className="max-w-2xl mx-auto text-gray-600 text-base md:text-lg">
            Empowering the next generation with powerful, affordable, and
            accessible study resources for India’s toughest entrance exams.
          </p>
          <motion.div
            animate={{ y: [0, -6, 0] }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: "easeInOut",
            }}
            className="flex justify-center mt-6"
          >
            <div className="w-14 h-14 rounded-full bg-gradient-to-br from-blue-500 to-cyan-400 flex items-center justify-center shadow-md">
              <Sparkles size={26} color="white" />
            </div>
          </motion.div>
        </motion.div>
           <section className="relative py-12 px-6 md:px-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="max-w-5xl mx-auto bg-white/80 backdrop-blur-xl border border-gray-100 rounded-2xl shadow-md p-8 md:p-10"
        >
          <h2 className="text-2xl md:text-3xl font-bold text-blue-700 mb-5 flex items-center gap-2">
            <BookOpen className="text-cyan-500 w-7 h-7" /> About Us
          </h2>
          <p className="text-gray-700 leading-relaxed mb-3">
            Welcome to <strong>UnfoldBooks</strong>, your one-stop destination
            for high-quality study materials, books, and model papers tailored
            specifically for competitive entrance exams in India. We specialize
            in resources for{" "}
            <strong>
              Navodaya Vidyalaya (JNVST), Sainik School (AISSEE), and Rashtriya
              Military School (RMS)
            </strong>{" "}
            exams, as well as <strong>Maharashtra Scholarship</strong> exams,
            <strong>Olympiads</strong>, <strong>NMMS</strong>, and{" "}
            <strong>NTSE</strong>.
          </p>
          <p className="text-gray-700 leading-relaxed">
            Our mission is to empower young minds with accessible, affordable,
            and effective preparation tools that pave the way for academic
            excellence and success.
          </p>
        </motion.div>
      </section>
      </section>

      {/* 🧭 ABOUT SECTION */}
   

      {/* 🎯 VISION SECTION */}
      <section className="relative py-12 px-6 md:px-10 bg-gradient-to-r from-blue-50 to-cyan-50">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          viewport={{ once: true }}
          className="max-w-5xl mx-auto rounded-2xl bg-white shadow-md p-8 md:p-10 border border-blue-100"
        >
          <h2 className="text-2xl md:text-3xl font-bold text-blue-700 mb-4 flex items-center gap-2">
            <Target className="text-blue-600 w-7 h-7" /> Our Vision
          </h2>
          <p className="text-gray-700 leading-relaxed mb-3">
            At <strong>UnfoldBooks</strong>, we envision a world where every
            aspiring student—regardless of background—has equal access to
            world-class educational resources.
          </p>
          <p className="text-gray-700 leading-relaxed mb-5">
            Our vision goes beyond just books — we aim to democratize education
            with:
          </p>

          <ul className="grid sm:grid-cols-2 gap-3 text-gray-700 text-sm">
            {[
              "Solved model papers & previous year papers",
              "Subject-wise books for Maths, Science, and more",
              "Olympiad kits for national & international levels",
              "NMMS & NTSE guides for scholarship success",
              "Maharashtra Scholarship books (Class 4 & 5)",
            ].map((item, i) => (
              <li
                key={i}
                className="flex items-start gap-2 bg-blue-50/40 rounded-lg px-3 py-2"
              >
                <span className="text-blue-500">📘</span> {item}
              </li>
            ))}
          </ul>
        </motion.div>
      </section>

      {/* 💡 WHY CHOOSE US */}
      <section className="py-16 px-6 md:px-10 bg-white">
        <h2 className="text-center text-3xl md:text-4xl font-bold text-blue-700 mb-10">
          Why <span className="text-cyan-500">Choose Us?</span>
        </h2>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
          {[
            {
              icon: <Award className="w-8 h-8 text-blue-600" />,
              title: "Expert-Curated Content",
              desc: "All materials are designed and reviewed by top educators.",
            },
            {
              icon: <Users className="w-8 h-8 text-cyan-500" />,
              title: "Affordable & Accessible",
              desc: "Both physical books and instant digital downloads available.",
            },
            {
              icon: <BookOpen className="w-8 h-8 text-blue-600" />,
              title: "Smart Categorization",
              desc: "Our platform makes finding the right book effortless.",
            },
            {
              icon: <Target className="w-8 h-8 text-cyan-500" />,
              title: "Latest Syllabus Updates",
              desc: "Content reviewed annually to stay exam-relevant.",
            },
            {
              icon: <Rocket className="w-8 h-8 text-blue-600" />,
              title: "Student-Centric Support",
              desc: "Free sample papers, blogs, and study tips for all learners.",
            },
          ].map((item, i) => (
            <motion.div
              key={i}
              whileHover={{ scale: 1.04 }}
              transition={{ type: "spring", stiffness: 180 }}
              className="bg-gradient-to-br from-blue-50 to-cyan-50 rounded-xl shadow-sm p-6 text-center hover:shadow-lg transition-all duration-300 border border-gray-100"
            >
              <div className="flex justify-center mb-3">{item.icon}</div>
              <h3 className="text-lg font-semibold text-blue-700 mb-1">
                {item.title}
              </h3>
              <p className="text-sm text-gray-600">{item.desc}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* 🚀 CTA SECTION */}
      <section className="relative py-20 text-center text-white bg-gradient-to-br from-blue-600 via-cyan-500 to-blue-700 overflow-hidden">
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/white-diamond.png')] opacity-10" />
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          viewport={{ once: true }}
          className="relative z-10 max-w-3xl mx-auto"
        >
          <h2 className="text-3xl md:text-4xl font-bold mb-3">
            Together, Let’s Unlock Every Learner’s Potential 🚀
          </h2>
          <p className="text-blue-50 leading-relaxed mb-6 text-base md:text-lg">
            Whether you’re a parent guiding your child or a student preparing
            for NMMS or NTSE, <strong>UnfoldBooks</strong> is your trusted
            learning partner.
          </p>
          <a
            href="mailto: theroyal.gondia@gmail.com"
            className="inline-flex items-center gap-2 px-8 py-3 bg-white text-blue-700 font-medium rounded-full shadow-md hover:bg-blue-50 hover:-translate-y-1 transition-transform"
          >
            <Mail size={18} /> Contact Us
          </a>
        </motion.div>
      </section>
    </div>
  );
};

export default AboutPage;
