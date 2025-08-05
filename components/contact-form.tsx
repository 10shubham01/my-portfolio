"use client";
import { motion } from "framer-motion";
import { useState } from "react";
import { FaEnvelope, FaUser, FaMessage, FaPhone, FaPaperPlane, FaCheck, FaTimes } from "react-icons/fa";
import { useTheme } from "./theme-provider";

interface FormData {
  name: string;
  email: string;
  phone: string;
  message: string;
}

interface FormErrors {
  name?: string;
  email?: string;
  phone?: string;
  message?: string;
}

const ContactForm = () => {
  const { themeConfig } = useTheme();
  const [formData, setFormData] = useState<FormData>({
    name: "",
    email: "",
    phone: "",
    message: "",
  });

  const [errors, setErrors] = useState<FormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [focusedField, setFocusedField] = useState<string | null>(null);

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};

    // Name validation
    if (!formData.name.trim()) {
      newErrors.name = "Name is required";
    } else if (formData.name.trim().length < 2) {
      newErrors.name = "Name must be at least 2 characters";
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!emailRegex.test(formData.email)) {
      newErrors.email = "Please enter a valid email address";
    }

    // Phone validation (optional but if provided, validate format)
    if (formData.phone.trim() && !/^[\+]?[1-9][\d]{0,15}$/.test(formData.phone.replace(/\s/g, ""))) {
      newErrors.phone = "Please enter a valid phone number";
    }

    // Message validation
    if (!formData.message.trim()) {
      newErrors.message = "Message is required";
    } else if (formData.message.trim().length < 10) {
      newErrors.message = "Message must be at least 10 characters";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (field: keyof FormData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: undefined }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Here you would typically send the data to your backend
      console.log("Form submitted:", formData);
      
      setIsSubmitted(true);
      setFormData({ name: "", email: "", phone: "", message: "" });
      
      // Reset success state after 5 seconds
      setTimeout(() => {
        setIsSubmitted(false);
      }, 5000);
      
    } catch (error) {
      console.error("Error submitting form:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const inputVariants = {
    focused: { scale: 1.02, borderColor: "#3B82F6" },
    unfocused: { scale: 1, borderColor: "#374151" }
  };

  const buttonVariants = {
    idle: { scale: 1 },
    hover: { scale: 1.05 },
    tap: { scale: 0.95 },
    submitting: { scale: 0.98 }
  };

  return (
    <div className="max-w-2xl mx-auto p-8">
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="bg-gray-800 rounded-2xl p-8 shadow-2xl"
      >
        <div className="text-center mb-8">
          <motion.div
            className={`w-16 h-16 bg-gradient-to-r ${themeConfig.primary} rounded-full flex items-center justify-center mx-auto mb-4`}
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
          >
            <FaEnvelope className="text-2xl text-white" />
          </motion.div>
          <h2 className="text-3xl font-bold text-white mb-2">Get In Touch</h2>
          <p className="text-gray-400">
            Let's discuss your next project or just say hello!
          </p>
        </div>

        {isSubmitted ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-center py-12"
          >
            <motion.div
              className="w-20 h-20 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-6"
              initial={{ scale: 0, rotate: -180 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
            >
              <FaCheck className="text-3xl text-white" />
            </motion.div>
            <h3 className="text-2xl font-bold text-white mb-2">Message Sent!</h3>
            <p className="text-gray-400 mb-6">
              Thank you for reaching out. I'll get back to you soon!
            </p>
            <motion.button
              onClick={() => setIsSubmitted(false)}
              className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Send Another Message
            </motion.button>
          </motion.div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Name Field */}
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-300">
                  <FaUser className="inline mr-2" />
                  Name *
                </label>
                <motion.div
                  variants={inputVariants}
                  animate={focusedField === "name" ? "focused" : "unfocused"}
                  transition={{ duration: 0.2 }}
                >
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => handleInputChange("name", e.target.value)}
                    onFocus={() => setFocusedField("name")}
                    onBlur={() => setFocusedField(null)}
                    className={`w-full px-4 py-3 bg-gray-700 border-2 rounded-lg text-white placeholder-gray-400 focus:outline-none transition-colors ${
                      errors.name ? "border-red-500" : ""
                    }`}
                    placeholder="Your full name"
                  />
                </motion.div>
                {errors.name && (
                  <motion.p
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-red-400 text-sm flex items-center gap-1"
                  >
                    <FaTimes className="text-xs" />
                    {errors.name}
                  </motion.p>
                )}
              </div>

              {/* Email Field */}
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-300">
                  <FaEnvelope className="inline mr-2" />
                  Email *
                </label>
                <motion.div
                  variants={inputVariants}
                  animate={focusedField === "email" ? "focused" : "unfocused"}
                  transition={{ duration: 0.2 }}
                >
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => handleInputChange("email", e.target.value)}
                    onFocus={() => setFocusedField("email")}
                    onBlur={() => setFocusedField(null)}
                    className={`w-full px-4 py-3 bg-gray-700 border-2 rounded-lg text-white placeholder-gray-400 focus:outline-none transition-colors ${
                      errors.email ? "border-red-500" : ""
                    }`}
                    placeholder="your.email@example.com"
                  />
                </motion.div>
                {errors.email && (
                  <motion.p
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-red-400 text-sm flex items-center gap-1"
                  >
                    <FaTimes className="text-xs" />
                    {errors.email}
                  </motion.p>
                )}
              </div>
            </div>

            {/* Phone Field */}
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-300">
                <FaPhone className="inline mr-2" />
                Phone (Optional)
              </label>
              <motion.div
                variants={inputVariants}
                animate={focusedField === "phone" ? "focused" : "unfocused"}
                transition={{ duration: 0.2 }}
              >
                <input
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => handleInputChange("phone", e.target.value)}
                  onFocus={() => setFocusedField("phone")}
                  onBlur={() => setFocusedField(null)}
                  className={`w-full px-4 py-3 bg-gray-700 border-2 rounded-lg text-white placeholder-gray-400 focus:outline-none transition-colors ${
                    errors.phone ? "border-red-500" : ""
                  }`}
                  placeholder="+1 (555) 123-4567"
                />
              </motion.div>
              {errors.phone && (
                <motion.p
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="text-red-400 text-sm flex items-center gap-1"
                >
                  <FaTimes className="text-xs" />
                  {errors.phone}
                </motion.p>
              )}
            </div>

            {/* Message Field */}
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-300">
                <FaMessage className="inline mr-2" />
                Message *
              </label>
              <motion.div
                variants={inputVariants}
                animate={focusedField === "message" ? "focused" : "unfocused"}
                transition={{ duration: 0.2 }}
              >
                <textarea
                  value={formData.message}
                  onChange={(e) => handleInputChange("message", e.target.value)}
                  onFocus={() => setFocusedField("message")}
                  onBlur={() => setFocusedField(null)}
                  rows={5}
                  className={`w-full px-4 py-3 bg-gray-700 border-2 rounded-lg text-white placeholder-gray-400 focus:outline-none transition-colors resize-none ${
                    errors.message ? "border-red-500" : ""
                  }`}
                  placeholder="Tell me about your project, ask a question, or just say hello!"
                />
              </motion.div>
              {errors.message && (
                <motion.p
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="text-red-400 text-sm flex items-center gap-1"
                >
                  <FaTimes className="text-xs" />
                  {errors.message}
                </motion.p>
              )}
            </div>

            {/* Submit Button */}
            <motion.button
              type="submit"
              disabled={isSubmitting}
              variants={buttonVariants}
              animate={isSubmitting ? "submitting" : "idle"}
              whileHover={!isSubmitting ? "hover" : undefined}
              whileTap={!isSubmitting ? "tap" : undefined}
              className={`w-full py-4 px-6 rounded-lg font-semibold text-white transition-all duration-300 flex items-center justify-center gap-3 ${
                isSubmitting
                  ? "bg-gray-600 cursor-not-allowed"
                  : `bg-gradient-to-r ${themeConfig.primary} hover:from-blue-600 hover:to-purple-600`
              }`}
            >
              {isSubmitting ? (
                <>
                  <motion.div
                    className="w-5 h-5 border-2 border-white border-t-transparent rounded-full"
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                  />
                  Sending Message...
                </>
              ) : (
                <>
                  <FaPaperPlane />
                  Send Message
                </>
              )}
            </motion.button>
          </form>
        )}

        {/* Contact Info */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
          className="mt-8 pt-8 border-t border-gray-700"
        >
          <h3 className="text-lg font-semibold text-white mb-4 text-center">
            Or reach out directly:
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
            <motion.a
              href="mailto:shubhamedu.01@gmail.com"
              className="flex items-center justify-center gap-2 p-3 bg-gray-700 rounded-lg hover:bg-gray-600 transition-colors"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <FaEnvelope className="text-blue-400" />
              <span className="text-sm">Email</span>
            </motion.a>
            <motion.a
              href="tel:+919369745870"
              className="flex items-center justify-center gap-2 p-3 bg-gray-700 rounded-lg hover:bg-gray-600 transition-colors"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <FaPhone className="text-green-400" />
              <span className="text-sm">Call</span>
            </motion.a>
            <motion.a
              href="https://www.linkedin.com/in/shubhamgupta001/"
              target="_blank"
              className="flex items-center justify-center gap-2 p-3 bg-gray-700 rounded-lg hover:bg-gray-600 transition-colors"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <FaEnvelope className="text-blue-600" />
              <span className="text-sm">LinkedIn</span>
            </motion.a>
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default ContactForm; 