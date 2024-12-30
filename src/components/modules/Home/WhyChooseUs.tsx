"use client"
import React from 'react';
import { motion } from 'motion/react';
import { 
  ShieldCheck, 
  Truck, 
  Headphones, 
  CreditCard,
  Users,
  ShoppingBag,
  Star,
  Clock
} from 'lucide-react';

const WhyChooseUs = () => {
  const stats = [
    { value: '50K+', label: 'Happy Customers', icon: Users },
    { value: '5K+', label: 'Products Available', icon: ShoppingBag },
    { value: '4.8', label: 'Average Rating', icon: Star },
    { value: '24/7', label: 'Customer Support', icon: Clock }
  ];

  const features = [
    {
      icon: ShieldCheck,
      title: 'Secure Shopping',
      description: 'Your security is our top priority. We use industry-leading encryption to protect your data.'
    },
    {
      icon: Truck,
      title: 'Fast Delivery',
      description: 'Free shipping on orders over $50. Quick delivery right to your doorstep.'
    },
    {
      icon: Headphones,
      title: '24/7 Support',
      description: 'Our dedicated support team is here to help you anytime, anywhere.'
    },
    {
      icon: CreditCard,
      title: 'Easy Payments',
      description: 'Multiple payment options available for your convenience.'
    }
  ];

  return (
    <div className="w-full py-16 my-20">
      <div className="container mx-auto px-4">
        {/* Stats Section */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-16">
          {stats.map((stat, index) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              viewport={{ once: true }}
              className="text-center"
            >
              <div className="flex justify-center mb-4">
                <div className="p-3 bg-primary/10 rounded-full">
                  <stat.icon className="h-6 w-6 text-primary" />
                </div>
              </div>
              <h3 className="text-3xl font-bold text-primary mb-1">{stat.value}</h3>
              <p className="text-muted-foreground">{stat.label}</p>
            </motion.div>
          ))}
        </div>

        {/* Features Grid */}
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-4">Why Choose Us</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            We&apos;re committed to providing you with the best shopping experience possible.
            Here&apos;s what sets us apart.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature, index) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.1 }}
              viewport={{ once: true }}
              className="group"
            >
              <div className="bg-card p-6 rounded-xl shadow-md hover:shadow-xl transition-all duration-300 h-full">
                <div className="mb-4 transform group-hover:scale-110 transition-transform duration-300">
                  <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mx-auto">
                    <feature.icon className="h-6 w-6 text-primary" />
                  </div>
                </div>
                <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                <p className="text-muted-foreground">{feature.description}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default WhyChooseUs;