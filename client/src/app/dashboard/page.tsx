"use client";

import { useSession, signOut } from "next-auth/react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import styles from "./dashboard.module.css";

/* Material Symbols helper */
const Icon = ({ name, fill, className = "" }: { name: string; fill?: boolean; className?: string }) => (
  <span
    className={`material-symbols-outlined ${className}`}
    style={fill ? { fontVariationSettings: "'FILL' 1" } : undefined}
  >
    {name}
  </span>
);

/* ── Template Data ── */
const TEMPLATES = [
  { id: "modern", name: "Modern", icon: "palette", desc: "Clean sans-serif with blue accents", color: "#0061a4" },
  { id: "minimal", name: "Minimal", icon: "format_align_left", desc: "Elegant serif typography", color: "#404752" },
  { id: "faang", name: "FAANG", icon: "terminal", desc: "Ultra-dense monospace layout", color: "#006398" },
  { id: "executive", name: "Executive", icon: "workspace_premium", desc: "Distinguished double borders", color: "#904d00" },
  { id: "creative", name: "Creative", icon: "brush", desc: "Vibrant colors & bold design", color: "#7b2d8e" },
  { id: "professional", name: "Professional", icon: "business_center", desc: "Corporate blue header bars", color: "#1565c0" },
  { id: "tech", name: "Tech", icon: "code", desc: "Developer-focused dashed style", color: "#2e7d32" },
];

/* ── Animation Variants ── */
const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.16, 1, 0.3, 1] as [number, number, number, number] } }
};
const stagger = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.06 } }
};

/* ── Saved Resume type ── */
interface SavedResume {
  id: string;
  name: string;
  template: string;
  updatedAt: string;
  preview: string; // first ~80 chars of the resume
}

export default function Dashboard() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [savedResumes, setSavedResumes] = useState<SavedResume[]>([]);
  const [searchQuery, setSearchQuery] = useState("");

  // Redirect to home if not authenticated
  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/");
    }
  }, [status, router]);

  // Load saved resumes from localStorage
  useEffect(() => {
    try {
      const saved = localStorage.getItem("luminance_resumes");
      if (saved) {
        setSavedResumes(JSON.parse(saved));
      }
    } catch { /* empty */ }
  }, []);

  const deleteResume = (id: string) => {
    const updated = savedResumes.filter(r => r.id !== id);
    setSavedResumes(updated);
    localStorage.setItem("luminance_resumes", JSON.stringify(updated));
  };

  const filteredResumes = savedResumes.filter(r =>
    r.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    r.template.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (status === "loading") {
    return (
      <div className={styles.loadingScreen}>
        <div className={styles.spinner}></div>
        <p>Loading your workspace...</p>
      </div>
    );
  }

  const userName = session?.user?.name?.split(" ")[0] || "there";
  const userAvatar = session?.user?.image;

  return (
    <div className={styles.container}>
      {/* ═══ Sidebar ═══ */}
      <aside className={styles.sidebar}>
        <div className={styles.sidebarBrand}>
          <Icon name="auto_awesome" fill className="text-primary" />
          <span className={styles.brandText}>Luminance AI</span>
        </div>

        <nav className={styles.sidebarNav}>
          <a className={`${styles.navItem} ${styles.navItemActive}`}>
            <Icon name="home" fill className="text-lg" /> Home
          </a>
          <a className={styles.navItem}>
            <Icon name="description" className="text-lg" /> My Resumes
          </a>
          <a className={styles.navItem}>
            <Icon name="style" className="text-lg" /> Templates
          </a>
          <a className={styles.navItem}>
            <Icon name="star" className="text-lg" /> Favorites
          </a>
          <a className={styles.navItem}>
            <Icon name="delete" className="text-lg" /> Trash
          </a>
        </nav>

        <div className={styles.sidebarFooter}>
          <button className={styles.signOutBtn} onClick={() => signOut({ callbackUrl: "/" })}>
            <Icon name="logout" className="text-lg" /> Sign Out
          </button>
        </div>
      </aside>

      {/* ═══ Main Content ═══ */}
      <main className={styles.main}>
        {/* Top Bar */}
        <header className={styles.topBar}>
          <div className={styles.searchBox}>
            <Icon name="search" className="text-xl text-on-surface-variant" />
            <input
              type="text"
              placeholder="Search resumes, templates..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className={styles.searchInput}
            />
          </div>

          <div className={styles.userArea}>
            <button className={styles.iconBtn}>
              <Icon name="notifications" className="text-xl" />
            </button>
            <button className={styles.iconBtn}>
              <Icon name="settings" className="text-xl" />
            </button>
            <div className={styles.avatar}>
              {userAvatar ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={userAvatar} alt={userName} className={styles.avatarImg} />
              ) : (
                <Icon name="person" className="text-xl" />
              )}
            </div>
          </div>
        </header>

        {/* Scrollable Content */}
        <div className={styles.content}>

          {/* ── Welcome + Create CTA ── */}
          <motion.section
            initial="hidden" animate="visible" variants={stagger}
            className={styles.welcomeSection}
          >
            <motion.div variants={fadeUp}>
              <h1 className={styles.welcomeTitle}>
                Welcome back, <span className="text-primary">{userName}</span>
              </h1>
              <p className={styles.welcomeSubtitle}>
                What would you like to create today?
              </p>
            </motion.div>

            <motion.div variants={fadeUp} className={styles.createCards}>
              {/* PRIMARY — AI Resume */}
              <button
                className={styles.createCardPrimary}
                onClick={() => router.push("/form")}
              >
                <div className={styles.createCardIcon}>
                  <Icon name="auto_awesome" fill className="text-3xl text-white" />
                </div>
                <div>
                  <h3 className={styles.createCardTitle}>Create with AI</h3>
                  <p className={styles.createCardDesc}>
                    Let AI craft your perfect resume from scratch
                  </p>
                </div>
                <Icon name="arrow_forward" className="text-xl ml-auto opacity-60" />
              </button>

              {/* SECONDARY — Blank */}
              <button
                className={styles.createCardSecondary}
                onClick={() => router.push("/form")}
              >
                <div className={styles.createCardIconAlt}>
                  <Icon name="add" className="text-3xl text-primary" />
                </div>
                <div>
                  <h3 className={styles.createCardTitleAlt}>Start from Blank</h3>
                  <p className={styles.createCardDescAlt}>
                    Choose a template and fill in your details
                  </p>
                </div>
                <Icon name="arrow_forward" className="text-xl ml-auto opacity-40" />
              </button>
            </motion.div>
          </motion.section>

          {/* ── Recent Resumes ── */}
          {filteredResumes.length > 0 && (
            <motion.section
              initial="hidden" whileInView="visible" viewport={{ once: true }}
              variants={stagger}
              className={styles.section}
            >
              <motion.div variants={fadeUp} className={styles.sectionHeader}>
                <h2 className={styles.sectionTitle}>
                  <Icon name="history" className="text-xl" /> Recent Resumes
                </h2>
                <button className={styles.viewAllBtn}>View all</button>
              </motion.div>

              <motion.div variants={stagger} className={styles.resumeGrid}>
                {filteredResumes.map((resume) => (
                  <motion.div key={resume.id} variants={fadeUp} className={styles.resumeCard}>
                    <div className={styles.resumeCardPreview}>
                      <div className={styles.resumeCardPreviewInner}>
                        <div className={styles.previewLine} style={{ width: "60%" }}></div>
                        <div className={styles.previewLine} style={{ width: "40%", marginTop: "4px" }}></div>
                        <div className={styles.previewBlock}></div>
                        <div className={styles.previewLine} style={{ width: "90%" }}></div>
                        <div className={styles.previewLine} style={{ width: "75%" }}></div>
                        <div className={styles.previewLine} style={{ width: "85%" }}></div>
                      </div>
                      <div className={styles.resumeCardOverlay}>
                        <button className={styles.overlayBtn}>
                          <Icon name="edit" className="text-sm" /> Edit
                        </button>
                        <button
                          className={styles.overlayBtnDanger}
                          onClick={(e) => { e.stopPropagation(); deleteResume(resume.id); }}
                        >
                          <Icon name="delete" className="text-sm" />
                        </button>
                      </div>
                    </div>
                    <div className={styles.resumeCardInfo}>
                      <p className={styles.resumeCardName}>{resume.name}</p>
                      <p className={styles.resumeCardMeta}>
                        <span className={styles.templateBadge}>{resume.template}</span>
                        &nbsp;·&nbsp;{resume.updatedAt}
                      </p>
                    </div>
                  </motion.div>
                ))}
              </motion.div>
            </motion.section>
          )}

          {/* ── Templates Gallery ── */}
          <motion.section
            initial="hidden" whileInView="visible" viewport={{ once: true }}
            variants={stagger}
            className={styles.section}
          >
            <motion.div variants={fadeUp} className={styles.sectionHeader}>
              <h2 className={styles.sectionTitle}>
                <Icon name="style" className="text-xl" /> Start from a Template
              </h2>
            </motion.div>

            <motion.div variants={stagger} className={styles.templateGrid}>
              {TEMPLATES.map((t) => (
                <motion.button
                  key={t.id}
                  variants={fadeUp}
                  className={styles.templateCard}
                  onClick={() => router.push("/form")}
                >
                  <div className={styles.templatePreview} style={{ borderTopColor: t.color }}>
                    {/* Mini resume skeleton with template accent color */}
                    <div className={styles.tplHeader} style={{ backgroundColor: t.color + "18" }}>
                      <div className={styles.tplNameBar} style={{ backgroundColor: t.color }}></div>
                      <div className={styles.tplSubBar} style={{ backgroundColor: t.color + "60" }}></div>
                    </div>
                    <div className={styles.tplBody}>
                      <div className={styles.tplSectionLabel} style={{ backgroundColor: t.color + "25" }}></div>
                      <div className={styles.tplLine}></div>
                      <div className={styles.tplLine} style={{ width: "80%" }}></div>
                      <div className={styles.tplLine} style={{ width: "60%" }}></div>
                      <div className={styles.tplSectionLabel} style={{ backgroundColor: t.color + "25", marginTop: "8px" }}></div>
                      <div className={styles.tplLine}></div>
                      <div className={styles.tplLine} style={{ width: "70%" }}></div>
                    </div>
                  </div>
                  <div className={styles.templateInfo}>
                    <div className={styles.templateIconWrap} style={{ backgroundColor: t.color + "15", color: t.color }}>
                      <Icon name={t.icon} className="text-lg" />
                    </div>
                    <div>
                      <p className={styles.templateName}>{t.name}</p>
                      <p className={styles.templateDesc}>{t.desc}</p>
                    </div>
                  </div>
                </motion.button>
              ))}
            </motion.div>
          </motion.section>

          {/* ── Quick Tips ── */}
          <motion.section
            initial="hidden" whileInView="visible" viewport={{ once: true }}
            variants={stagger}
            className={`${styles.section} ${styles.tipsSection}`}
          >
            <motion.div variants={fadeUp} className={styles.sectionHeader}>
              <h2 className={styles.sectionTitle}>
                <Icon name="lightbulb" fill className="text-xl text-tertiary-container" /> Quick Tips
              </h2>
            </motion.div>

            <motion.div variants={stagger} className={styles.tipsGrid}>
              {[
                { icon: "target", title: "Tailor for each job", desc: "Use our Job Match tool to optimize your resume for specific positions." },
                { icon: "edit_note", title: "Action verbs matter", desc: "Start bullet points with strong verbs: Led, Built, Achieved, Delivered." },
                { icon: "format_list_numbered", title: "Quantify results", desc: "\"Increased revenue by 40%\" beats \"Helped increase revenue.\"" },
              ].map((tip, i) => (
                <motion.div key={i} variants={fadeUp} className={styles.tipCard}>
                  <div className={styles.tipIcon}>
                    <Icon name={tip.icon} className="text-lg" />
                  </div>
                  <h4 className={styles.tipTitle}>{tip.title}</h4>
                  <p className={styles.tipDesc}>{tip.desc}</p>
                </motion.div>
              ))}
            </motion.div>
          </motion.section>

        </div>
      </main>
    </div>
  );
}
