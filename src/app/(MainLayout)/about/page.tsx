"use client";

import React from "react";
import { motion } from "motion/react";
import {
  Store,
  Users,
  Heart,
  Coffee,
  Globe,
  Shield,
  Sparkles,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import Image from "next/image";

const WavePattern = () => (
  <svg
    className="absolute bottom-0 left-0 w-full"
    viewBox="0 0 1440 320"
    preserveAspectRatio="none"
  >
    <path
      fill="currentColor"
      fillOpacity="0.1"
      d="M0,96L48,112C96,128,192,160,288,186.7C384,213,480,235,576,213.3C672,192,768,128,864,128C960,128,1056,192,1152,208C1248,224,1344,192,1392,176L1440,160L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"
    ></path>
  </svg>
);

const AboutUs = () => {
  const stats = [
    {
      icon: Users,
      value: "10K+",
      label: "Happy Customers",
      color: "text-blue-500",
    },
    {
      icon: Store,
      value: "1000+",
      label: "Active Vendors",
      color: "text-green-500",
    },
    {
      icon: Coffee,
      value: "50K+",
      label: "Products Sold",
      color: "text-amber-500",
    },
    {
      icon: Heart,
      value: "99%",
      label: "Satisfaction Rate",
      color: "text-red-500",
    },
  ];

  const features = [
    {
      title: "Global Reach",
      description:
        "Connect with verified vendors and customers worldwide through our expansive network.",
      icon: Globe,
      gradient: "from-blue-500 to-cyan-500",
    },
    {
      title: "Quality Assurance",
      description:
        "Rigorous quality checks and verification processes ensure premium product standards.",
      icon: Shield,
      gradient: "from-green-500 to-emerald-500",
    },
    {
      title: "Innovation First",
      description:
        "Cutting-edge features and technology driving the future of e-commerce.",
      icon: Sparkles,
      gradient: "from-purple-500 to-pink-500",
    },
  ];

  return (
    <div className="min-h-screen bg-background overflow-hidden">
      {/* Hero Section with Abstract Background */}
      <div className="relative">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-secondary/20 -z-10" />
        <motion.section
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8 }}
          className="container mx-auto px-4 pt-32 pb-24 text-center relative"
        >
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="absolute top-0 right-0 w-72 h-72 bg-primary/10 rounded-full blur-3xl -z-10"
          />
          <motion.h1
            initial={{ y: -50 }}
            animate={{ y: 0 }}
            className="text-5xl md:text-7xl font-bold mb-6 bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent"
          >
            Welcome to Vendozy
          </motion.h1>
          <motion.p
            initial={{ y: 50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="text-xl text-muted-foreground max-w-2xl mx-auto"
          >
            Revolutionizing e-commerce through innovation, trust, and global
            connectivity.
          </motion.p>
        </motion.section>
      </div>

      {/* Stats Section with Floating Cards */}
      <section className="relative py-24 bg-secondary/5">
        <WavePattern />
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <motion.div
                key={index}
                initial={{ y: 50, opacity: 0 }}
                whileInView={{ y: 0, opacity: 1 }}
                transition={{ delay: index * 0.1 }}
                className="relative group"
              >
                <div className="absolute inset-0 bg-gradient-to-br from-primary/10 to-secondary/10 rounded-xl transform group-hover:scale-105 transition-transform duration-300" />
                <Card className="h-full bg-background/50 backdrop-blur-sm border-0 relative">
                  <CardContent className="p-6 text-center">
                    <stat.icon
                      className={`w-8 h-8 mx-auto mb-4 ${stat.color}`}
                    />
                    <motion.h3
                      className="text-3xl font-bold mb-2"
                      initial={{ scale: 0.5 }}
                      whileInView={{ scale: 1 }}
                      transition={{ delay: index * 0.2 }}
                    >
                      {stat.value}
                    </motion.h3>
                    <p className="text-muted-foreground">{stat.label}</p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section with Gradient Cards */}
      <section className="py-24 container mx-auto px-4">
        <motion.h2
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          className="text-4xl font-bold text-center mb-16"
        >
          Why Choose Vendozy?
        </motion.h2>
        <div className="grid md:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <motion.div
              key={index}
              initial={{ x: -50, opacity: 0 }}
              whileInView={{ x: 0, opacity: 1 }}
              transition={{ delay: index * 0.2 }}
              viewport={{ once: true }}
              className="group"
            >
              <Card className="h-full hover:shadow-xl transition-all duration-300 overflow-hidden">
                <CardContent className="p-8 relative">
                  <div
                    className={`absolute top-0 right-0 w-32 h-32 bg-gradient-to-br ${feature.gradient} opacity-10 rounded-full blur-2xl transform group-hover:scale-150 transition-transform duration-500`}
                  />
                  <feature.icon className="w-12 h-12 mb-6 text-primary" />
                  <h3 className="text-2xl font-bold mb-4">{feature.title}</h3>
                  <p className="text-muted-foreground leading-relaxed">
                    {feature.description}
                  </p>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Mission Statement with Parallax Effect */}
      <motion.section
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        className="relative py-32 overflow-hidden"
      >
        <div className="absolute inset-0 bg-gradient-to-r from-primary to-accent" />
        <motion.div
          initial={{ y: 100 }}
          whileInView={{ y: 0 }}
          className="container mx-auto px-4 text-center relative"
        >
          <h2 className="text-4xl md:text-5xl font-bold mb-8 text-white">
            Our Mission
          </h2>
          <p className="text-xl text-white/90 max-w-3xl mx-auto leading-relaxed">
            To create a trusted marketplace where quality meets convenience,
            empowering vendors to grow their businesses and customers to
            discover exceptional products with confidence.
          </p>
        </motion.div>
      </motion.section>

      {/* Team Section with Hover Effects */}
      <section className="py-24 container mx-auto px-4">
        <motion.h2
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          className="text-4xl font-bold text-center mb-16"
        >
          Meet Our Leadership
        </motion.h2>
        <div className="grid md:grid-cols-3 gap-12">
          <motion.div
            initial={{ y: 50, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            transition={{ delay: 1 * 0.2 }}
            viewport={{ once: true }}
            className="group relative"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-secondary/20 rounded-2xl transform group-hover:scale-105 transition-transform duration-300" />
            <Card className="relative bg-background/50 backdrop-blur-sm border-0">
              <CardContent className="p-8 text-center">
                <div className="w-32 h-32 mx-auto mb-6 rounded-full overflow-hidden relative">
                  <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-secondary/20" />
                  <Image
                    src={`https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MXx8cG9ydHJhaXR8ZW58MHx8MHx8fDI%3D`}
                    alt="Team member"
                    className="relative rounded-full transform group-hover:scale-110 transition-transform duration-300"
                    height={100}
                    width={100}
                  />
                </div>
                <h3 className="text-2xl font-bold mb-2">Rahim Ullah</h3>
                <p className="text-primary mb-4">Co-Founder & CEO</p>
              </CardContent>
            </Card>
          </motion.div>
          <motion.div
            initial={{ y: 50, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            transition={{ delay: 2 * 0.2 }}
            viewport={{ once: true }}
            className="group relative"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-secondary/20 rounded-2xl transform group-hover:scale-105 transition-transform duration-300" />
            <Card className="relative bg-background/50 backdrop-blur-sm border-0">
              <CardContent className="p-8 text-center">
                <div className="w-32 h-32 mx-auto mb-6 rounded-full overflow-hidden relative">
                  <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-secondary/20" />
                  <Image
                    src={`https://images.unsplash.com/photo-1542909168-82c3e7fdca5c?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MjV8fHBvcnRyYWl0fGVufDB8fDB8fHwy`}
                    alt="Team member"
                    className="relative rounded-full transform group-hover:scale-110 transition-transform duration-300"
                    height={100}
                    width={100}
                  />
                </div>
                <h3 className="text-2xl font-bold mb-2">Karim Khan</h3>
                <p className="text-primary mb-4">COO</p>
              </CardContent>
            </Card>
          </motion.div>
          <motion.div
            initial={{ y: 50, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            transition={{ delay: 3 * 0.2 }}
            viewport={{ once: true }}
            className="group relative"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-secondary/20 rounded-2xl transform group-hover:scale-105 transition-transform duration-300" />
            <Card className="relative bg-background/50 backdrop-blur-sm border-0">
              <CardContent className="p-8 text-center">
                <div className="w-32 h-32 mx-auto mb-6 rounded-full overflow-hidden relative">
                  <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-secondary/20" />
                  <Image
                    src={`https://images.unsplash.com/photo-1509305717900-84f40e786d82?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MjN8fHBvcnRyYWl0fGVufDB8fDB8fHwy`}
                    alt="Team member"
                    className="relative rounded-full transform group-hover:scale-110 transition-transform duration-300"
                    height={100}
                    width={100}
                  />
                </div>
                <h3 className="text-2xl font-bold mb-2">Jashim Uddin</h3>
                <p className="text-primary mb-4">Head of Marketing</p>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default AboutUs;
