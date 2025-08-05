"use client";
import { motion, useScroll, useTransform } from "framer-motion";
import { useState, useRef } from "react";
import { useTheme } from "./theme-provider";
import { 
  FaGithub, 
  FaLinkedin, 
  FaEnvelope, 
  FaPhone, 
  FaGlobe,
  FaVuejs,
  FaReact,
  FaNodeJs,
  FaDatabase,
  FaAws,
  FaDocker,
  FaGitAlt,
  FaCode,
  FaRocket,
  FaUsers,
  FaChartLine,
  FaShieldAlt,
  FaMobile,
  FaDesktop,
  FaServer
} from "react-icons/fa";
import { 
  SiTypescript, 
  SiJavascript, 
  SiNextdotjs, 
  SiNuxtdotjs, 
  SiTailwindcss,
  SiPostgresql,
  SiMysql,
  SiExpress,
  SiAdonisjs,
  SiVuetify,
  SiScss,
  SiJest,
  SiCypress,
  SiFigma,
  SiVercel,
  SiNetlify
} from "react-icons/si";

interface Skill {
  name: string;
  icon: React.ReactNode;
  proficiency: number;
  category: 'frontend' | 'backend' | 'database' | 'devops' | 'tools';
  description: string;
}

interface Experience {
  company: string;
  position: string;
  duration: string;
  achievements: string[];
  techStack: string[];
  logo?: string;
}

interface Project {
  name: string;
  description: string;
  techStack: string[];
  link?: string;
  github?: string;
  image?: string;
  features: string[];
}

const skills: Skill[] = [
  // Frontend
  { name: "TypeScript", icon: <SiTypescript className="text-blue-600" />, proficiency: 95, category: 'frontend', description: "Advanced TypeScript development with strict typing and interfaces" },
  { name: "JavaScript", icon: <SiJavascript className="text-yellow-400" />, proficiency: 98, category: 'frontend', description: "ES6+, modern JavaScript patterns and best practices" },
  { name: "Vue.js", icon: <FaVuejs className="text-green-500" />, proficiency: 90, category: 'frontend', description: "Vue 2/3, Composition API, Vuex, Vue Router" },
  { name: "React.js", icon: <FaReact className="text-blue-400" />, proficiency: 85, category: 'frontend', description: "React Hooks, Context API, Redux, React Router" },
  { name: "Next.js", icon: <SiNextdotjs className="text-black" />, proficiency: 80, category: 'frontend', description: "SSR, SSG, API routes, App Router" },
  { name: "Nuxt.js", icon: <SiNuxtdotjs className="text-green-600" />, proficiency: 85, category: 'frontend', description: "Nuxt 2/3, modules, plugins, middleware" },
  { name: "Tailwind CSS", icon: <SiTailwindcss className="text-cyan-500" />, proficiency: 90, category: 'frontend', description: "Utility-first CSS, custom configurations" },
  
  // Backend
  { name: "Node.js", icon: <FaNodeJs className="text-green-600" />, proficiency: 88, category: 'backend', description: "Server-side JavaScript, event-driven architecture" },
  { name: "Express.js", icon: <SiExpress className="text-gray-600" />, proficiency: 85, category: 'backend', description: "RESTful APIs, middleware, routing" },
  { name: "AdonisJS", icon: <SiAdonisjs className="text-green-700" />, proficiency: 80, category: 'backend', description: "Full-stack framework, ORM, authentication" },
  
  // Database
  { name: "PostgreSQL", icon: <SiPostgresql className="text-blue-700" />, proficiency: 75, category: 'database', description: "Relational database, complex queries, optimization" },
  { name: "MySQL", icon: <SiMysql className="text-orange-500" />, proficiency: 70, category: 'database', description: "Database design, stored procedures, indexing" },
  
  // DevOps & Tools
  { name: "AWS", icon: <FaAws className="text-orange-500" />, proficiency: 65, category: 'devops', description: "EC2, S3, Lambda, CloudFront, deployment" },
  { name: "Git", icon: <FaGitAlt className="text-orange-600" />, proficiency: 90, category: 'tools', description: "Version control, branching strategies, CI/CD" },
  { name: "Docker", icon: <FaDocker className="text-blue-500" />, proficiency: 60, category: 'devops', description: "Containerization, Docker Compose, deployment" },
];

const experiences: Experience[] = [
  {
    company: "Credilio Financial Technologies",
    position: "Senior Software Engineer",
    duration: "December 2022 - Present",
    achievements: [
      "Led a team of engineers and conducted thorough code reviews",
      "Successfully onboarded 5+ developers with comprehensive training",
      "Managed and optimized GitHub CI/CD pipelines for AWS deployment",
      "Migrated Nuxt 2 project to Nuxt 3 with scalable architecture",
      "Improved code maintainability by 20% through restructuring",
      "Achieved significant page load time optimization"
    ],
    techStack: ["Vue.js", "Nuxt.js", "React.js", "TypeScript", "Express.js", "AdonisJS", "PostgreSQL", "AWS", "GitHub Actions"]
  },
  {
    company: "Mountblue",
    position: "Software Engineer/Trainee",
    duration: "August 2021 - November 2022",
    achievements: [
      "Built dynamic web applications using Vue.js, React.js, and Node.js",
      "Delivered robust APIs and database connections",
      "Researched and adopted new frameworks and tools",
      "Delivered high-quality code with strong focus on debugging"
    ],
    techStack: ["Vue.js", "React.js", "Node.js", "Express.js", "MySQL", "JavaScript"]
  }
];

const projects: Project[] = [
  {
    name: "Spotlight Chrome Extension",
    description: "A Chrome extension like Spotlight for your browser—quickly search tabs, bookmarks, history, and more with ⌘ (or Ctrl) + ⇧ + K.",
    techStack: ["Chrome Extension API", "JavaScript", "CSS", "HTML"],
    link: "https://chromewebstore.google.com/detail/spotlight-chrome-extensio/abbhoiaihkicmgmmglcomckkbcmdnjpp",
    features: ["Quick search functionality", "Tab management", "Bookmark search", "History search", "Keyboard shortcuts"]
  },
  {
    name: "Symbiote UI",
    description: "A modern UI library built with React, Framer Motion, and Tailwind CSS. Create seamless, interactive, and beautifully styled interfaces effortlessly.",
    techStack: ["React", "Framer Motion", "Tailwind CSS", "TypeScript"],
    link: "https://symbiote-ui.vercel.app/",
    features: ["Component library", "Interactive animations", "Responsive design", "TypeScript support", "Customizable themes"]
  },
  {
    name: "API Logger",
    description: "A Chrome extension that automatically logs all API calls made on a web page, streamlining testing and development.",
    techStack: ["Chrome Extension API", "JavaScript", "Network API"],
    link: "https://github.com/10shubham01/api-log",
    features: ["Real-time API logging", "Network tab integration", "Development debugging", "Testing support"]
  }
];

const InteractiveResume = () => {
  const { themeConfig } = useTheme();
  const [activeSection, setActiveSection] = useState('profile');
  const [selectedSkill, setSelectedSkill] = useState<Skill | null>(null);
  const [hoveredProject, setHoveredProject] = useState<number | null>(null);
  
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"]
  });

  const y = useTransform(scrollYProgress, [0, 1], [0, -50]);

  const skillCategories = {
    frontend: skills.filter(skill => skill.category === 'frontend'),
    backend: skills.filter(skill => skill.category === 'backend'),
    database: skills.filter(skill => skill.category === 'database'),
    devops: skills.filter(skill => skill.category === 'devops'),
    tools: skills.filter(skill => skill.category === 'tools')
  };

  return (
    <div ref={containerRef} className={`min-h-screen ${themeConfig.background} text-white p-8`}>
      {/* Header */}
      <motion.div 
        className="text-center mb-16"
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
      >
        <h1 className={`text-6xl font-bold mb-4 bg-gradient-to-r ${themeConfig.primary} bg-clip-text text-transparent`}>
          Shubham Gupta
        </h1>
        <p className="text-2xl text-gray-300 mb-6">Senior Software Engineer</p>
        <p className="text-lg text-gray-400 max-w-3xl mx-auto mb-8">
          Experienced Software Developer with a solid foundation in full-stack development. 
          Proficient in JavaScript, TypeScript, Vue.js, React.js, Nuxt.js, Next.js, Node.js, 
          and MySQL, committed to delivering impactful and results-focused solutions.
        </p>
        
        {/* Contact Links */}
        <div className="flex justify-center gap-6 mb-8">
          <motion.a
            href="mailto:shubhamedu.01@gmail.com"
            className="flex items-center gap-2 p-3 bg-blue-600 rounded-full hover:bg-blue-700 transition-colors"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
          >
            <FaEnvelope />
            <span className="hidden sm:inline">Email</span>
          </motion.a>
          <motion.a
            href="https://github.com/10shubham01"
            target="_blank"
            className="flex items-center gap-2 p-3 bg-gray-700 rounded-full hover:bg-gray-600 transition-colors"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
          >
            <FaGithub />
            <span className="hidden sm:inline">GitHub</span>
          </motion.a>
          <motion.a
            href="https://www.linkedin.com/in/shubhamgupta001/"
            target="_blank"
            className="flex items-center gap-2 p-3 bg-blue-700 rounded-full hover:bg-blue-800 transition-colors"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
          >
            <FaLinkedin />
            <span className="hidden sm:inline">LinkedIn</span>
          </motion.a>
          <motion.a
            href="tel:+919369745870"
            className="flex items-center gap-2 p-3 bg-green-600 rounded-full hover:bg-green-700 transition-colors"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
          >
            <FaPhone />
            <span className="hidden sm:inline">Call</span>
          </motion.a>
        </div>
      </motion.div>

      {/* Navigation */}
      <motion.nav 
        className="flex justify-center gap-4 mb-12"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
      >
        {['profile', 'skills', 'experience', 'projects'].map((section) => (
          <motion.button
            key={section}
            onClick={() => setActiveSection(section)}
            className={`px-6 py-3 rounded-full font-semibold transition-all ${
              activeSection === section 
                ? `bg-gradient-to-r ${themeConfig.primary} text-white` 
                : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
            }`}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            {section.charAt(0).toUpperCase() + section.slice(1)}
          </motion.button>
        ))}
      </motion.nav>

      {/* Content Sections */}
      <div className="max-w-6xl mx-auto">
        {/* Skills Section */}
        {activeSection === 'skills' && (
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="space-y-12"
          >
            <h2 className="text-4xl font-bold text-center mb-12">Skills & Expertise</h2>
            
            {Object.entries(skillCategories).map(([category, categorySkills]) => (
              <div key={category} className="space-y-6">
                <h3 className="text-2xl font-semibold text-center capitalize">
                  {category === 'frontend' && <FaDesktop className="inline mr-2" />}
                  {category === 'backend' && <FaServer className="inline mr-2" />}
                  {category === 'database' && <FaDatabase className="inline mr-2" />}
                  {category === 'devops' && <FaRocket className="inline mr-2" />}
                  {category === 'tools' && <FaCode className="inline mr-2" />}
                  {category}
                </h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {categorySkills.map((skill, index) => (
                    <motion.div
                      key={skill.name}
                      className="bg-gray-800 p-6 rounded-xl hover:bg-gray-700 transition-colors cursor-pointer"
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1 }}
                      whileHover={{ scale: 1.02 }}
                      onClick={() => setSelectedSkill(skill)}
                    >
                      <div className="flex items-center gap-3 mb-4">
                        <div className="text-2xl">{skill.icon}</div>
                        <h4 className="text-lg font-semibold">{skill.name}</h4>
                      </div>
                      
                      <div className="w-full bg-gray-700 rounded-full h-2 mb-3">
                        <motion.div
                          className="bg-gradient-to-r from-blue-500 to-purple-500 h-2 rounded-full"
                          initial={{ width: 0 }}
                          animate={{ width: `${skill.proficiency}%` }}
                          transition={{ duration: 1, delay: 0.5 + index * 0.1 }}
                        />
                      </div>
                      
                      <p className="text-sm text-gray-400">{skill.proficiency}% proficiency</p>
                    </motion.div>
                  ))}
                </div>
              </div>
            ))}
          </motion.div>
        )}

        {/* Experience Section */}
        {activeSection === 'experience' && (
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="space-y-12"
          >
            <h2 className="text-4xl font-bold text-center mb-12">Professional Experience</h2>
            
            <div className="relative">
              {/* Timeline line */}
              <div className="absolute left-8 top-0 bottom-0 w-1 bg-gradient-to-b from-blue-500 to-purple-500"></div>
              
              {experiences.map((exp, index) => (
                <motion.div
                  key={index}
                  className="relative ml-16 mb-12"
                  initial={{ opacity: 0, x: -50 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.2 }}
                >
                  {/* Timeline dot */}
                  <div className="absolute -left-12 top-4 w-6 h-6 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full border-4 border-gray-900"></div>
                  
                  <div className="bg-gray-800 p-8 rounded-xl hover:bg-gray-700 transition-colors">
                    <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-4">
                      <div>
                        <h3 className="text-2xl font-bold text-blue-400">{exp.position}</h3>
                        <p className="text-xl text-gray-300">{exp.company}</p>
                        <p className="text-gray-400">{exp.duration}</p>
                      </div>
                      <div className="flex flex-wrap gap-2 mt-4 lg:mt-0">
                        {exp.techStack.map((tech) => (
                          <span key={tech} className="px-3 py-1 bg-gray-700 rounded-full text-sm">
                            {tech}
                          </span>
                        ))}
                      </div>
                    </div>
                    
                    <ul className="space-y-2">
                      {exp.achievements.map((achievement, idx) => (
                        <motion.li
                          key={idx}
                          className="flex items-start gap-3"
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: index * 0.2 + idx * 0.1 }}
                        >
                          <span className="text-blue-400 mt-1">•</span>
                          <span>{achievement}</span>
                        </motion.li>
                      ))}
                    </ul>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}

        {/* Projects Section */}
        {activeSection === 'projects' && (
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="space-y-12"
          >
            <h2 className="text-4xl font-bold text-center mb-12">Featured Projects</h2>
            
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {projects.map((project, index) => (
                <motion.div
                  key={project.name}
                  className="bg-gray-800 rounded-xl overflow-hidden hover:bg-gray-700 transition-colors"
                  initial={{ opacity: 0, y: 50 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.2 }}
                  whileHover={{ y: -10 }}
                  onHoverStart={() => setHoveredProject(index)}
                  onHoverEnd={() => setHoveredProject(null)}
                >
                  <div className="p-6">
                    <h3 className="text-xl font-bold mb-3 text-blue-400">{project.name}</h3>
                    <p className="text-gray-300 mb-4">{project.description}</p>
                    
                    <div className="flex flex-wrap gap-2 mb-4">
                      {project.techStack.map((tech) => (
                        <span key={tech} className="px-2 py-1 bg-gray-700 rounded text-xs">
                          {tech}
                        </span>
                      ))}
                    </div>
                    
                    <div className="space-y-2 mb-6">
                      {project.features.map((feature, idx) => (
                        <div key={idx} className="flex items-center gap-2 text-sm text-gray-400">
                          <span className="text-green-400">✓</span>
                          {feature}
                        </div>
                      ))}
                    </div>
                    
                    <div className="flex gap-3">
                      {project.link && (
                        <motion.a
                          href={project.link}
                          target="_blank"
                          className="flex-1 bg-blue-600 text-center py-2 rounded hover:bg-blue-700 transition-colors"
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                        >
                          Live Demo
                        </motion.a>
                      )}
                      {project.github && (
                        <motion.a
                          href={project.github}
                          target="_blank"
                          className="flex-1 bg-gray-600 text-center py-2 rounded hover:bg-gray-700 transition-colors"
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                        >
                          GitHub
                        </motion.a>
                      )}
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}

        {/* Profile Section */}
        {activeSection === 'profile' && (
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="space-y-12"
          >
            <h2 className="text-4xl font-bold text-center mb-12">About Me</h2>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
              {/* Key Achievements */}
              <div className="space-y-6">
                <h3 className="text-2xl font-semibold text-blue-400">Key Achievements</h3>
                <div className="space-y-4">
                  <motion.div
                    className="flex items-start gap-4 p-4 bg-gray-800 rounded-xl"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.1 }}
                  >
                    <FaUsers className="text-2xl text-green-400 mt-1" />
                    <div>
                      <h4 className="font-semibold">Team Leadership</h4>
                      <p className="text-gray-400">Led a team of engineers, conducted code reviews, and mentored junior developers</p>
                    </div>
                  </motion.div>
                  
                  <motion.div
                    className="flex items-start gap-4 p-4 bg-gray-800 rounded-xl"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.2 }}
                  >
                    <FaChartLine className="text-2xl text-blue-400 mt-1" />
                    <div>
                      <h4 className="font-semibold">Performance Optimization</h4>
                      <p className="text-gray-400">Improved code maintainability by 20% and achieved significant page load time optimization</p>
                    </div>
                  </motion.div>
                  
                  <motion.div
                    className="flex items-start gap-4 p-4 bg-gray-800 rounded-xl"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.3 }}
                  >
                    <FaShieldAlt className="text-2xl text-purple-400 mt-1" />
                    <div>
                      <h4 className="font-semibold">Security & Best Practices</h4>
                      <p className="text-gray-400">Implemented robust authentication systems and maintained high code quality standards</p>
                    </div>
                  </motion.div>
                </div>
              </div>
              
              {/* Education & Certifications */}
              <div className="space-y-6">
                <h3 className="text-2xl font-semibold text-blue-400">Education</h3>
                <div className="bg-gray-800 p-6 rounded-xl">
                  <h4 className="text-xl font-semibold mb-2">Bachelor of Computer Applications</h4>
                  <p className="text-gray-300 mb-2">Lovely Professional University</p>
                  <p className="text-gray-400 mb-4">2018 - 2021</p>
                  <div className="space-y-2">
                    <p className="text-sm text-gray-400">Coursework:</p>
                    <div className="flex flex-wrap gap-2">
                      {['Operating Systems', 'Databases', 'C', 'C++', 'HTML5', 'CSS', 'Ionic', 'React Native'].map((course) => (
                        <span key={course} className="px-2 py-1 bg-gray-700 rounded text-xs">
                          {course}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
                
                <h3 className="text-2xl font-semibold text-blue-400">Core Competencies</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-gray-800 p-4 rounded-xl text-center">
                    <FaCode className="text-3xl text-blue-400 mx-auto mb-2" />
                    <h4 className="font-semibold">Full-Stack Development</h4>
                  </div>
                  <div className="bg-gray-800 p-4 rounded-xl text-center">
                    <FaMobile className="text-3xl text-green-400 mx-auto mb-2" />
                    <h4 className="font-semibold">Mobile Development</h4>
                  </div>
                  <div className="bg-gray-800 p-4 rounded-xl text-center">
                    <FaServer className="text-3xl text-purple-400 mx-auto mb-2" />
                    <h4 className="font-semibold">API Development</h4>
                  </div>
                  <div className="bg-gray-800 p-4 rounded-xl text-center">
                    <FaRocket className="text-3xl text-orange-400 mx-auto mb-2" />
                    <h4 className="font-semibold">DevOps & CI/CD</h4>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </div>

      {/* Skill Detail Modal */}
      {selectedSkill && (
        <motion.div
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          onClick={() => setSelectedSkill(null)}
        >
          <motion.div
            className="bg-gray-800 p-8 rounded-xl max-w-md w-full"
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center gap-3 mb-4">
              <div className="text-3xl">{selectedSkill.icon}</div>
              <h3 className="text-2xl font-bold">{selectedSkill.name}</h3>
            </div>
            <p className="text-gray-300 mb-4">{selectedSkill.description}</p>
            <div className="w-full bg-gray-700 rounded-full h-3 mb-4">
              <div 
                className="bg-gradient-to-r from-blue-500 to-purple-500 h-3 rounded-full"
                style={{ width: `${selectedSkill.proficiency}%` }}
              />
            </div>
            <p className="text-center text-gray-400">{selectedSkill.proficiency}% proficiency</p>
            <button
              onClick={() => setSelectedSkill(null)}
              className="mt-6 w-full bg-gray-700 py-2 rounded hover:bg-gray-600 transition-colors"
            >
              Close
            </button>
          </motion.div>
        </motion.div>
      )}
    </div>
  );
};

export default InteractiveResume; 