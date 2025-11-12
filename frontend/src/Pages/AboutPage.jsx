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
    <div className="font-poppins bg-gradient-to-b from-blue-50 via-white to-cyan-50 min-h-screen text-gray-800 overflow-hidden">
      {/* 🌟 HERO SECTION */}
      <section className="relative text-center py-20 px-6 md:px-16 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-100 via-white to-cyan-100 opacity-60 blur-3xl" />
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="relative z-10"
        >
          <h1 className="text-4xl md:text-6xl font-bold text-blue-700 mb-4 leading-tight">
            About <span className="text-cyan-500">UnfoldBooks</span>
          </h1>
          <p className="max-w-2xl mx-auto text-gray-600 text-lg md:text-xl">
            Empowering the next generation with powerful, affordable, and
            accessible study resources for India’s toughest entrance exams.
          </p>
          <div className="flex justify-center mt-8">
            <motion.div
              animate={{ y: [0, -6, 0] }}
              transition={{
                duration: 2,
                repeat: Infinity,
                ease: "easeInOut",
              }}
              className="w-16 h-16 rounded-full bg-gradient-to-br from-blue-500 to-cyan-400 flex items-center justify-center shadow-lg"
            >
              <Sparkles size={28} color="white" />
            </motion.div>
          </div>
        </motion.div>
      </section>

      {/* 🧭 ABOUT SECTION */}
      <section className="relative py-16 px-6 md:px-16">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="max-w-5xl mx-auto bg-white/70 backdrop-blur-lg border border-gray-100 rounded-3xl shadow-lg p-8 md:p-12"
        >
          <h2 className="text-3xl font-bold text-blue-700 mb-6 flex items-center gap-2">
            <BookOpen className="text-cyan-500 w-8 h-8" /> About Us
          </h2>
          <p className="text-gray-700 leading-relaxed mb-4">
            Welcome to <strong>UnfoldBooks</strong>, your one-stop destination
            for high-quality study materials, books, and model papers tailored
            specifically for competitive entrance exams in India. We specialize
            in resources for{" "}
            <strong>
              Navodaya Vidyalaya entrance exams (Class 6 and 9)
            </strong>
            , <strong>Sainik School entrance exams (Class 6 and 9)</strong>,{" "}
            <strong>Rashtriya Military School (RMS) entrance exams</strong>, and{" "}
            <strong>Maharashtra Scholarship exams (Class 4 and 5)</strong> — 
            along with <strong>Olympiad exams</strong>,{" "}
            <strong>NMMS (National Means-cum-Merit Scholarship)</strong>, and{" "}
            <strong>NTSE (National Talent Search Examination)</strong>.
          </p>
          <p className="text-gray-700 leading-relaxed">
            Our mission is to empower young minds with accessible, affordable,
            and effective preparation tools that pave the way for academic
            excellence and success.
          </p>
        </motion.div>
      </section>

      {/* 🎯 VISION SECTION */}
      <section className="relative py-16 px-6 md:px-16 bg-gradient-to-r from-blue-50 to-cyan-50">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          viewport={{ once: true }}
          className="max-w-5xl mx-auto rounded-3xl bg-white shadow-xl p-10 md:p-12 border border-blue-100"
        >
          <h2 className="text-3xl font-bold text-blue-700 mb-4 flex items-center gap-2">
            <Target className="text-blue-600 w-8 h-8" /> Our Vision
          </h2>
          <p className="text-gray-700 leading-relaxed mb-4">
            At <strong>UnfoldBooks</strong>, we envision a world where every
            aspiring student—regardless of their background—has equal access to
            world-class educational resources. Founded by passionate educators,
            we understand the challenges students face when preparing for{" "}
            <strong>JNVST</strong>, <strong>AISSEE</strong>, and{" "}
            <strong>RMS CET</strong>.
          </p>
          <p className="text-gray-700 leading-relaxed mb-6">
            Our vision goes beyond just books — we aim to democratize education
            with:
          </p>

          <ul className="grid sm:grid-cols-2 gap-4 text-gray-700">
            <li className="flex items-start gap-2">
              <span>📘</span> <strong>Solved model papers</strong> and previous year papers.
            </li>
            <li className="flex items-start gap-2">
              <span>📘</span> <strong>Subject-wise books</strong> for Maths, Science, and more.
            </li>
            <li className="flex items-start gap-2">
              <span>📘</span> <strong>Olympiad kits</strong> for national & international levels.
            </li>
            <li className="flex items-start gap-2">
              <span>📘</span> <strong>NMMS & NTSE guides</strong> for scholarship success.
            </li>
            <li className="flex items-start gap-2">
              <span>📘</span> <strong>Maharashtra Scholarship</strong> books (Class 4 & 5).
            </li>
          </ul>

          <p className="text-gray-700 leading-relaxed mt-6">
            We believe in nurturing talent, helping students build confidence
            and achieve their dreams of joining prestigious institutions.
          </p>
        </motion.div>
      </section>

      {/* 💡 WHY CHOOSE US */}
      <section className="py-20 px-6 md:px-16 bg-white">
        <h2 className="text-center text-4xl font-bold text-blue-700 mb-12">
          Why <span className="text-cyan-500">Choose Us?</span>
        </h2>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {[
            {
              icon: <Award className="w-8 h-8 text-blue-600" />,
              title: "Expert-Curated Content",
              desc: "All materials are created by top educators and reviewed by experts.",
            },
            {
              icon: <Users className="w-8 h-8 text-cyan-500" />,
              title: "Affordable & Accessible",
              desc: "Physical books and instant digital downloads to fit every budget.",
            },
            {
              icon: <BookOpen className="w-8 h-8 text-blue-600" />,
              title: "SEO-Optimized Platform",
              desc: "Find exactly what you need instantly with smart categorization.",
            },
            {
              icon: <Target className="w-8 h-8 text-cyan-500" />,
              title: "Commitment to Quality",
              desc: "Annual updates ensure our content matches the latest exam formats.",
            },
            {
              icon: <Rocket className="w-8 h-8 text-blue-600" />,
              title: "Student-Centric Approach",
              desc: "Free sample papers, blogs, and tips to help you excel.",
            },
          ].map((item, i) => (
            <motion.div
              key={i}
              whileHover={{ scale: 1.05 }}
              transition={{ type: "spring", stiffness: 180 }}
              className="bg-gradient-to-br from-blue-50 to-cyan-50 rounded-2xl shadow-lg p-6 text-center hover:shadow-2xl transition-all duration-300"
            >
              <div className="flex justify-center mb-4">{item.icon}</div>
              <h3 className="text-lg font-semibold text-blue-700 mb-2">
                {item.title}
              </h3>
              <p className="text-sm text-gray-600 leading-relaxed">
                {item.desc}
              </p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* 🚀 CTA SECTION */}
      <section className="relative py-24 text-center text-white overflow-hidden bg-gradient-to-br from-blue-600 via-cyan-500 to-blue-700">
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/white-diamond.png')] opacity-10" />
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          viewport={{ once: true }}
          className="relative z-10 max-w-3xl mx-auto"
        >
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Together, Let’s Unlock the Potential in Every Learner! 🚀
          </h2>
          <p className="text-blue-50 leading-relaxed mb-6 text-base md:text-lg">
            Whether you're a parent guiding your child or a student aiming for
            NTSE success, <strong>UnfoldBooks</strong> is here for you every
            step of the way.
          </p>
          <a
            href="mailto:contact@unfoldbooks.in"
            className="inline-flex items-center gap-2 px-8 py-3 bg-white text-blue-700 font-medium rounded-full shadow-md hover:bg-blue-50 transition-transform hover:-translate-y-1"
          >
            <Mail size={18} /> Contact Us
          </a>
        </motion.div>
      </section>
    </div>
  );
};

export default AboutPage;
