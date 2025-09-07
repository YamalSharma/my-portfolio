import React, { useEffect, useMemo, useRef, useState } from "react";
import { motion, AnimatePresence, useDragControls  } from "framer-motion";
import { Mail, Phone, MapPin, Github, Linkedin, ExternalLink, FolderGit2, GraduationCap, Cpu, ShieldCheck, Award, Download, Menu } from "lucide-react";
import emailjs from "emailjs-com";

// =============================
// Single-file, production-ready React portfolio
// - TailwindCSS styles
// - Framer Motion micro-interactions
// - Smooth scroll, skip-link, accessible landmarks
// - Fully responsive with grid-based layout
// =============================

// ---- Editable profile image ----
// Replace this with your image path or URL
// Put my.gif in public/ (public/my.gif)
const PROFILE_IMG = "/my.gif";
 // e.g. "/yamal.jpg" or an external URL

// ---- Site content (pulled from resume) ----
const SITE = {
  name: "Yamal Sharma",
  role: "Computer Science Student — AI/ML & Web-Dev",
  location: "Bilaspur, Himachal Pradesh, India",
  email: "yamalsharma0729@gmail.com",
  phone: "+91 8894565929",
  socials: [
    { icon: Github, label: "GitHub", href: "https://github.com/YamalSharma" },
    { icon: Linkedin, label: "LinkedIn", href: "https://www.linkedin.com/in/yamal-sharma/" },
  ],
  about:
    "Computer Science student with hands‑on experience in AI, ML, and Python‑based projects. I enjoy building practical tools, learning fast, and shipping polished work.",
  education: [
    {
      school: "Bahra University Shimla Hills",
      period: "2022 – Present",
      credential: "B.Tech. — Computer Science (CGPA: 8.19)",
      location: "Solan, India",
    },
    {
      school: "Govt. Senior Secondary, Guggaghat",
      period: "2021 – 2022",
      credential: "Senior Secondary (XII) — Science (76%)",
      location: "Solan, India",
    },
  ],
  skills: {
    languages: ["Python", "C++", "HTML", "CSS", "JavaScript", "SQL"],
    libraries: [
      "Scikit‑learn",
      "Pandas",
      "NumPy",
      "Matplotlib",
      "Seaborn",
      "NLTK",
      "Transformers",
      "PyTorch",
      "Tkinter",
    ],
    tools: ["Flask", "Tailwind CSS", "Git", "GitHub", "Firebase", "Hugging Face Hub", "VS Code", "Jupyter"],
  },
  experience: [
    {
      title: "Artificial Intelligence (AI) — Internship",
      org: "Edunet Foundation (Virtual)",
      period: "Apr 2025 – May 2025",
      bullets: [
        "Completed a 4‑week internship focused on core AI concepts.",
        "Gained foundational knowledge of AI algorithms, ML models, and ethical AI practices.",
        "Completed hands‑on assignments and quizzes.",
      ],
      icon: Cpu,
    },
    {
      title: "Cyber Security — Internship",
      org: "Edunet Foundation (Virtual)",
      period: "Jan 2025 – Feb 2025",
      bullets: [
        "Ethical hacking basics, threat analysis, and risk management.",
        "Simulated attacks with Wireshark, Nmap, and Linux tooling.",
      ],
      icon: ShieldCheck,
    },
  ],
  projects: [
    {
      title: "Secure Data Hiding in Images (Steganography)",
      period: "Jan 2025 – Feb 2025",
      summary:
        "Python application for image‑based message hiding with passcode‑protected decryption.",
      tags: ["Python", "Pillow", "Security"],
      links: [],
    },
    {
      title: "Student Performance Prediction (ML)",
      period: "Apr 2025 – May 2025",
      summary:
        "Model to predict pass/fail outcomes from academic and demographic data.",
      tags: ["scikit‑learn", "Pandas", "ML"],
      links: [],
    },
    {
      title: "Local CLI Chatbot — SmolLM‑360M‑Instruct",
      period: "Aug 2025",
      summary:
        "Lightweight CLI chatbot with sliding‑window memory (last 3 exchanges), built with Transformers & PyTorch.",
      tags: ["Transformers", "PyTorch", "CLI"],
      links: [],
    },
  ],
  achievements: [
    "Instructed a webinar for school students at Bahra University",
    "Member of the Cybersecurity Cell (Club) at Bahra University",
  ],
};

// ===== Typewriter + Hero Intro =====
const useTypewriter = (text, speed = 75, start = true) => {
  const [output, setOutput] = useState("");
  const [done, setDone] = useState(false);
  useEffect(() => {
    if (!start) return;
    setOutput("");
    setDone(false);
    let i = 0;
    const id = setInterval(() => {
      setOutput(text.slice(0, i + 1));
      i++;
      if (i >= text.length) {
        clearInterval(id);
        setDone(true);
      }
    }, speed);
    return () => clearInterval(id);
  }, [text, speed, start]);
  return { output, done };
};

const Cursor = ({ active }) => (
  <span aria-hidden className="inline-block w-[2px] h-[1.05em] align-[-0.15em] ml-0.5 bg-current animate-pulse" style={{ opacity: active ? 1 : 0 }} />
);


// ===== Reusable UI =====
const Section = ({ id, title, icon: Icon, children }) => (
  <section id={id} className="scroll-mt-24 py-12 sm:py-16" aria-labelledby={`${id}-title`}>
    <div className="mx-auto max-w-6xl px-4">
      <div className="flex items-center gap-3 mb-6">
        {Icon && (
          <div className="p-2 rounded-2xl shadow-sm">
            <Icon className="w-6 h-6" aria-hidden />
          </div>
        )}
        <h2 id={`${id}-title`} className="text-2xl sm:text-3xl font-semibold tracking-tight">
          {title}
        </h2>
      </div>
      {children}
    </div>
  </section>
);

const Tag = ({ children }) => (
  <span className="inline-flex items-center text-xs sm:text-sm px-2 py-1 rounded-full border">
    {children}
  </span>
);

const Card = ({ children }) => (
  <div className="rounded-2xl border p-5 sm:p-6 shadow-sm hover:shadow-md transition-shadow bg-white/60 dark:bg-zinc-900/60 backdrop-blur">
    {children}
  </div>
);

// ===== Nav =====
const Nav = ({ show }) => {
  const [open, setOpen] = useState(false);
  const links = [
    { id: "about", label: "About" },
    { id: "skills", label: "Skills" },
    { id: "experience", label: "Experience" },
    { id: "projects", label: "Projects" },
    { id: "education", label: "Education" },
    { id: "achievements", label: "Achievements" },
    { id: "contact", label: "Contact" },
  ];

  return (
    <AnimatePresence>
      {show && (
        <motion.nav
          initial={{ y: -40, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: -40, opacity: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="sticky top-0 z-40 backdrop-blur supports-[backdrop-filter]:bg-white/60 dark:supports-[backdrop-filter]:bg-zinc-950/40 border-b"
        >
          <div className="mx-auto max-w-6xl px-4 h-14 flex items-center justify-between">
            <a href="#home" className="font-semibold tracking-tight">
              {SITE.name}
            </a>
            <div className="hidden sm:flex gap-1">
              {links.map((l) => (
                <a
                  key={l.id}
                  href={`#${l.id}`}
                  className="px-3 py-2 rounded-xl hover:bg-black/5 dark:hover:bg-white/10 text-sm"
                >
                  {l.label}
                </a>
              ))}
            </div>
            <button
              aria-label="Menu"
              className="sm:hidden p-2 rounded-xl hover:bg-black/5 dark:hover:bg-white/10"
              onClick={() => setOpen((v) => !v)}
            >
              <Menu className="w-5 h-5" />
            </button>
          </div>

          {/* Mobile menu */}
          <AnimatePresence>
            {open && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.3 }}
                className="sm:hidden border-t"
              >
                <div className="mx-auto max-w-6xl px-4 py-2 grid grid-cols-2 gap-2">
                  {links.map((l) => (
                    <a
                      key={l.id}
                      href={`#${l.id}`}
                      className="px-3 py-2 rounded-xl hover:bg-black/5 dark:hover:bg-white/10 text-sm"
                      onClick={() => setOpen(false)}
                    >
                      {l.label}
                    </a>
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.nav>
      )}
    </AnimatePresence>
  );
};

// ===== Hero with typewriter -> zoom-in text -> zoom-out profile =====
const Hero = ({ setPhase }) => {
  const hello = "{ hello world }"; // with curly braces
  const { output, done } = useTypewriter(hello, 70, true);
  const [phase, setLocalPhase] = useState("typing"); // typing -> zoomText -> showImage -> ready

  useEffect(() => {
    if (done && phase === "typing") {
      const t = setTimeout(() => setLocalPhase("zoomText"), 300);
      return () => clearTimeout(t);
    }
  }, [done, phase]);

  useEffect(() => {
    if (phase === "ready") {
      setPhase("ready"); // 🔑 tell parent we're done
    }
  }, [phase, setPhase]);

  return (
    <div
      id="home"
      className="relative flex items-center justify-center min-h-[80dvh] sm:min-h-[86dvh] overflow-hidden"
    >
      {/* Background grid */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 [mask-image:radial-gradient(white,transparent_70%)]"
      >
        <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(0,0,0,.06)_1px,transparent_1px),linear-gradient(to_bottom,rgba(0,0,0,.06)_1px,transparent_1px)] dark:bg-[linear-gradient(to_right,rgba(255,255,255,.08)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,.08)_1px,transparent_1px)] bg-[size:24px_24px]" />
      </div>

      {/* Type text */}
      <AnimatePresence>
        {(phase === "typing" || phase === "zoomText") && (
          <motion.h1
            initial={{ scale: 1, opacity: 1 }}
            animate={
              phase === "zoomText"
                ? {
                    scale: 10,
                    opacity: 0,
                    transition: { duration: 0.9, ease: [0.16, 1, 0.3, 1] },
                  }
                : {}
            }
            onAnimationComplete={() =>
              phase === "zoomText" && setLocalPhase("showImage")
            }
            className="font-mono text-3xl sm:text-5xl md:text-6xl font-semibold tracking-tight"
          >
            <span>{output}</span>
            <Cursor active={phase === "typing" && !done} />
          </motion.h1>
        )}
      </AnimatePresence>

      {/* Profile image zoom-out */}
      <AnimatePresence>
        {(phase === "showImage" || phase === "ready") && (
          <motion.div
            initial={{ scale: 1.15, opacity: 0 }}
            animate={{
              scale: 1,
              opacity: 1,
              transition: { duration: 0.9, ease: [0.16, 1, 0.3, 1] },
            }}
            onAnimationComplete={() =>
              phase === "showImage" && setLocalPhase("ready")
            }
            className="absolute inset-0 flex items-center justify-center"
          >
            <div className="relative w-40 h-40 sm:w-52 sm:h-52 md:w-60 md:h-60 rounded-full overflow-hidden border shadow-lg bg-white/50 dark:bg-zinc-900/50">
              <motion.img
                src={PROFILE_IMG}
                alt="Animated portrait of Yamal Sharma"
                className="w-full h-full object-cover select-none pointer-events-none"
                draggable="false"
                animate={{ y: [0, -8, 0] }}
                transition={{
                  duration: 3,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
              />
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Sub-headline appears when ready */}
      {phase === "ready" && (
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0, transition: { delay: 0.05 } }}
          className="absolute bottom-10 left-1/2 -translate-x-1/2 text-center px-4"
        >
          <h2 className="text-base sm:text-lg md:text-xl font-medium">
            {SITE.role}
          </h2>
          <p className="mt-1 text-sm opacity-80">{SITE.location}</p>
          <div className="mt-4 flex items-center justify-center gap-3">
            {SITE.socials.map((s) => (
              <a
                key={s.label}
                href={s.href}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-2 px-3 py-2 rounded-xl border text-sm hover:shadow-sm"
              >
                <s.icon className="w-4 h-4" /> {s.label}
              </a>
            ))}
            <a
              href="#contact"
              className="inline-flex items-center gap-2 px-3 py-2 rounded-xl border text-sm hover:shadow-sm"
            >
              <Mail className="w-4 h-4" /> Contact
            </a>
            <a
                href="/resumeself.pdf"  // <-- put your resume in /public folder
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-3 py-2 rounded-xl border text-sm hover:shadow-sm"
              >
                <Download className="w-4 h-4" /> Resume
              </a>

          </div>
        </motion.div>
      )}
    </div>
  );
};


// ===== Sections =====
const About = () => (
  <Section id="about" title="About" icon={Cpu}>
    <Card>
      <p className="leading-relaxed text-balance">{SITE.about}</p>
    </Card>
  </Section>
);

const Skills = () => (
  <Section id="skills" title="Skills" icon={FolderGit2}>
    <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
      <Card>
        <h3 className="font-medium mb-3">Programming Languages</h3>
        <div className="flex flex-wrap gap-2">
          {SITE.skills.languages.map((s) => (
            <Tag key={s}>{s}</Tag>
          ))}
        </div>
      </Card>
      <Card>
        <h3 className="font-medium mb-3">AI / ML Libraries</h3>
        <div className="flex flex-wrap gap-2">
          {SITE.skills.libraries.map((s) => (
            <Tag key={s}>{s}</Tag>
          ))}
        </div>
      </Card>
      <Card>
        <h3 className="font-medium mb-3">Frameworks & Tools</h3>
        <div className="flex flex-wrap gap-2">
          {SITE.skills.tools.map((s) => (
            <Tag key={s}>{s}</Tag>
          ))}
        </div>
      </Card>
    </div>
  </Section>
);

const Experience = () => (
  <Section id="experience" title="Experience" icon={ShieldCheck}>
    <div className="grid gap-4">
      {SITE.experience.map((exp, i) => (
        <Card key={i}>
          <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-2">
            <div>
              <h3 className="font-semibold text-lg flex items-center gap-2"><exp.icon className="w-5 h-5" />{exp.title}</h3>
              <p className="opacity-80">{exp.org}</p>
            </div>
            <div className="text-sm opacity-80 whitespace-nowrap">{exp.period}</div>
          </div>
          <ul className="mt-3 list-disc pl-5 space-y-1">
            {exp.bullets.map((b, j) => (
              <li key={j}>{b}</li>
            ))}
          </ul>
        </Card>
      ))}
    </div>
  </Section>
);

const Projects = () => (
  <Section id="projects" title="Projects" icon={FolderGit2}>
    <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
      {SITE.projects.map((p, i) => (
        <Card key={i}>
          <h3 className="font-semibold text-lg">{p.title}</h3>
          <div className="text-sm opacity-80">{p.period}</div>
          <p className="mt-2 text-sm leading-relaxed">{p.summary}</p>
          <div className="mt-3 flex flex-wrap gap-2">
            {p.tags.map((t) => (
              <Tag key={t}>{t}</Tag>
            ))}
          </div>
          {!!p.links?.length && (
            <div className="mt-4 flex gap-3">
              {p.links.map((l) => (
                <a key={l.href} href={l.href} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1 text-sm underline">
                  <ExternalLink className="w-4 h-4" /> {l.label}
                </a>
              ))}
            </div>
          )}
        </Card>
      ))}
    </div>
  </Section>
);

const Education = () => (
  <Section id="education" title="Education" icon={GraduationCap}>
    <div className="grid gap-4 sm:grid-cols-2">
      {SITE.education.map((e, i) => (
        <Card key={i}>
          <h3 className="font-semibold">{e.school}</h3>
          <div className="text-sm opacity-80">{e.location}</div>
          <div className="mt-1">{e.credential}</div>
          <div className="text-sm opacity-80 mt-1">{e.period}</div>
        </Card>
      ))}
    </div>
  </Section>
);

const Achievements = () => (
  <Section id="achievements" title="Achievements" icon={Award}>
    <div className="grid gap-4">
      {SITE.achievements.map((a, i) => (
        <Card key={i}><p>{a}</p></Card>
      ))}
    </div>
  </Section>
);

const Contact = () => {
  const sendEmail = (e) => {
    e.preventDefault();

    emailjs
      .sendForm(
        "service_ykt18av",    // from EmailJS dashboard
        "template_ldtw9w9",   // from EmailJS dashboard
        e.target,
        "L8C6-9g4KKJpH-UZS"     // from EmailJS account
      )
      .then(
        (result) => {
          alert("Message sent successfully!");
        },
        (error) => {
          alert("Failed to send message. Try again later.");
        }
      );

    e.target.reset();
  };

  return (
    <Section id="contact" title="Contact" icon={Mail}>
      <Card>
        <form onSubmit={sendEmail} className="space-y-4">
          <div>
            <label className="block text-sm mb-1 font-medium">Name</label>
            <input
              type="text"
              name="from_name"
              required
              className="w-full px-3 py-2 rounded-lg border bg-white/80 dark:bg-zinc-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm mb-1 font-medium">Email</label>
            <input
              type="email"
              name="reply_to"
              required
              className="w-full px-3 py-2 rounded-lg border bg-white/80 dark:bg-zinc-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm mb-1 font-medium">Message</label>
            <textarea
              name="message"
              rows="4"
              required
              className="w-full px-3 py-2 rounded-lg border bg-white/80 dark:bg-zinc-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <button
            type="submit"
            className="px-4 py-2 rounded-lg bg-blue-600 text-white font-medium hover:bg-blue-700 transition"
          >
            Send Message
          </button>
        </form>
      </Card>
    </Section>
  );
};

// ===== Root =====
export default function Portfolio() {
  const [phase, setPhase] = useState("typing");

  return (
    <div className="min-h-dvh bg-white text-zinc-900 dark:bg-zinc-950 dark:text-zinc-100 selection:bg-black/10 dark:selection:bg-white/20">
      <a
        href="#home"
        className="sr-only focus:not-sr-only focus:fixed focus:top-3 focus:left-3 bg-white dark:bg-zinc-900 border rounded px-3 py-2"
      >
        Skip to content
      </a>

      {/* Nav appears only after intro */}
      <Nav show={phase === "ready"} />


      <main>
        <Hero setPhase={setPhase} />

        {/* Fade in all sections once intro is done */}
        {phase === "ready" && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <About />
            <Skills />
            <Experience />
            <Projects />
            <Education />
            <Achievements />
            <Contact />
          </motion.div>
        )}
      </main>

      {phase === "ready" && (
        <footer className="py-10 text-center opacity-70 text-sm">
          © {new Date().getFullYear()} {SITE.name}. Built with React, Tailwind &
          Framer Motion.
        </footer>
      )}
    </div>
  );
}

