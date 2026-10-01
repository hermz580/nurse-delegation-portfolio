import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';
import InteractiveMapSection from '../components/InteractiveMapSection';
import '../styles/App.css';

export default function HomePage() {
  const navLinks = [
    { label: 'Map', id: 'map-section' },
    { label: 'Providers', id: 'providers' },
    { label: 'Case Workers', id: 'caseworkers' },
    { label: 'Resources', id: 'resources' },
    { label: 'Contact', id: 'contact' },
  ];

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleFormClick = (e: React.MouseEvent, formNumber: string) => {
    e.preventDefault();
    toast('DSHS Form ' + formNumber + ' download coming soon!', {
      icon: '📄',
      style: {
        background: '#1e293b',
        color: '#fff',
        border: '1px solid rgba(110, 231, 183, 0.3)',
      },
    });
  };

  return (
    <div className="ndn-app" style={{ position: 'relative', overflow: 'hidden' }}>
      {/* Shimmer Background */}
      <div style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        background: 'linear-gradient(45deg, transparent 30%, rgba(251, 191, 36, 0.06) 50%, transparent 70%)',
        backgroundSize: '200% 200%',
        animation: 'shimmerBackground 8s ease infinite',
        pointerEvents: 'none',
        zIndex: 0
      }} />

      {/* Floating Particles */}
      {[...Array(12)].map((_, i) => (
        <motion.div
          key={i}
          style={{
            position: 'fixed',
            width: Math.random() * 4 + 2 + 'px',
            height: Math.random() * 4 + 2 + 'px',
            borderRadius: '50%',
            background: i % 2 === 0 ? '#fbbf24' : '#f5f5f0',
            opacity: 0.25,
            left: Math.random() * 100 + '%',
            top: Math.random() * 100 + '%',
            zIndex: 0
          }}
          animate={{
            y: [0, -25, 0],
            opacity: [0.25, 0.5, 0.25],
          }}
          transition={{
            duration: Math.random() * 3 + 2,
            repeat: Infinity,
            delay: Math.random() * 2,
          }}
        />
      ))}

      <style>{`
        @keyframes shimmerBackground {
          0% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }
      `}</style>

      <div className="bg-grid"></div>

      {/* Navigation */}
      <nav className="nav">
        <a href="#" className="nav-logo">
          <div className="nav-logo-icon">🏥</div>
          <span className="nav-logo-text">Nurse Delegation Network</span>
        </a>
        <div className="nav-links">
          {navLinks.map(link => (
            <a key={link.id} href={`#${link.id}`} className="nav-link" onClick={(e) => { e.preventDefault(); scrollToSection(link.id); }}>
              {link.label}
            </a>
          ))}
        </div>
      </nav>

      {/* MAP HERO SECTION */}
      <section id="map-section">
        <InteractiveMapSection />
      </section>

      {/* PROVIDERS SECTION */}
      <section className="section" id="providers" style={{ position: 'relative', zIndex: 1 }}>
        <motion.div
          className="section-header"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <div className="section-badge">For Healthcare Providers</div>
          <h2 className="section-title">Registered Nurse <span className="gradient">Delegation Services</span></h2>
          <p className="section-desc">Join Washington's DSHS-contracted nurse delegation network</p>
        </motion.div>
        <div className="providers-grid">
          {[
            { icon: "📋", title: "DSHS Contract Requirements", desc: "To become a DSHS contracted nurse delegator...", list: ["Active WA RN License", "6-hr Orientation", "Contract 1008XS"] },
            { icon: "📜", title: "Legal Framework", desc: "Nurse delegation in Washington is governed by...", list: ["RCW 18.79.260", "WAC 246-840-910", "NCQAC Oversight"] },
            { icon: "🗺️", title: "Service Settings", desc: "Delegate to DSHS Medicaid clients in...", list: ["In-Home Services", "Adult Family Homes", "Assisted Living"] },
            { icon: "👥", title: "Who Can Receive Delegation", desc: "Delegation is provided to credentialed...", list: ["NAR / NAC / HCA-C", "9-hr Core Training", "Diabetes Training"] }
          ].map((card, i) => (
            <motion.div
              className="feature-card"
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: i * 0.1 }}
              whileHover={{
                scale: 1.03,
                rotate: [0, -0.5, 0.5, 0],
                transition: { duration: 0.4 }
              }}
            >
              <div className="feature-icon">{card.icon}</div>
              <h3 className="feature-title">{card.title}</h3>
              <p className="feature-desc">{card.desc}</p>
              <ul className="feature-list">
                {card.list.map((item, j) => <li key={j}>{item}</li>)}
              </ul>
            </motion.div>
          ))}
        </div>
      </section>

      {/* CASE WORKERS */}
      <section className="section" id="caseworkers" style={{ position: 'relative', zIndex: 1 }}>
        <motion.div
          className="section-header"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <div className="section-badge">For Case Workers</div>
          <h2 className="section-title">Finding <span className="gradient">Nurse Delegators</span></h2>
          <p className="section-desc">Connect your clients with qualified RN delegators across Washington State</p>
        </motion.div>
        <div className="caseworker-grid">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h3 style={{ fontSize: '24px', marginBottom: '20px', fontFamily: 'Poppins, sans-serif' }}>Referral Workflow</h3>
            <div className="workflow-steps">
              {[
                { n: 1, t: "Search Nurse Delegation Network Directory", d: "Use our interactive map to find contracted RN delegators." },
                { n: 2, t: "Submit Referral Form", d: "Complete DSHS 01-212 with client information." },
                { n: 3, t: "RN Evaluation", d: "RN assesses client condition and trains caregivers." },
                { n: 4, t: "Ongoing Supervision", d: "RN provides supervisory visits per requirements." }
              ].map((step, i) => (
                <motion.div
                  className="workflow-step"
                  key={i}
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: i * 0.1 }}
                  whileHover={{ x: 5 }}
                >
                  <div className="step-number">{step.n}</div>
                  <div>
                    <div className="step-title">{step.t}</div>
                    <div className="step-desc">{step.d}</div>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <h3 style={{ fontSize: '24px', marginBottom: '20px', fontFamily: 'Poppins, sans-serif' }}>Key Resources</h3>
            <div className="resource-links">
              {[
                { label: "DSHS 01-212 Referral Form", num: "01-212" },
                { label: "Nurse Delegation Core Training", num: "core" },
                { label: "NCQAC Standards", num: "ncqac" },
                { label: "Billing Guidelines", num: "billing" }
              ].map((res, i) => (
                <motion.a
                  href="#"
                  className="resource-link"
                  key={i}
                  onClick={(e) => handleFormClick(e, res.num)}
                  initial={{ opacity: 0, y: 10 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: i * 0.1 }}
                  whileHover={{ x: 5, color: '#fbbf24' }}
                >
                  📄 {res.label}
                </motion.a>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* RESOURCES */}
      <section className="section" id="resources" style={{ position: 'relative', zIndex: 1 }}>
        <motion.div
          className="section-header"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <div className="section-badge">Resources</div>
          <h2 className="section-title">Essential <span className="gradient">Documents & Forms</span></h2>
          <p className="section-desc">Everything you need to navigate nurse delegation in Washington State</p>
        </motion.div>
        <div className="resources-grid">
          {[
            { cat: "Legal & Regulatory", items: ["RCW 18.79.260 - Nurse Delegation Law", "WAC 246-840-910 - Delegation Rules", "NCQAC Standards & Guidelines"] },
            { cat: "Training Materials", items: ["Core Delegation Training (9 hrs)", "Diabetes Training Module", "Medication Administration"] },
            { cat: "Forms & Templates", items: ["DSHS 01-212 Referral Form", "Contract 1008XS Application", "Billing Documentation"] }
          ].map((cat, i) => (
            <motion.div
              className="resource-category"
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: i * 0.1 }}
              whileHover={{
                scale: 1.02,
                transition: { duration: 0.3 }
              }}
            >
              <h3 style={{ fontFamily: 'Poppins, sans-serif' }}>{cat.cat}</h3>
              <ul>
                {cat.items.map((item, j) => (
                  <motion.li
                    key={j}
                    whileHover={{ x: 5, color: '#fbbf24' }}
                  >
                    <a href="#" onClick={(e) => handleFormClick(e, `${i}-${j}`)}>{item}</a>
                  </motion.li>
                ))}
              </ul>
            </motion.div>
          ))}
        </div>
      </section>

      {/* CONTACT */}
      <section className="section" id="contact" style={{ position: 'relative', zIndex: 1 }}>
        <motion.div
          className="section-header"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <div className="section-badge">Get in Touch</div>
          <h2 className="section-title">Have <span className="gradient">Questions?</span></h2>
          <p className="section-desc">We're here to help you navigate Washington's nurse delegation network</p>
        </motion.div>
        <motion.div
          className="contact-container"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <div className="contact-info">
            <motion.div
              className="contact-card"
              whileHover={{ scale: 1.03, rotate: [0, -1, 1, 0] }}
            >
              <div className="contact-icon">📧</div>
              <h3>Email Us</h3>
              <p>support@example.com</p>
            </motion.div>
            <motion.div
              className="contact-card"
              whileHover={{ scale: 1.03, rotate: [0, -1, 1, 0] }}
            >
              <div className="contact-icon">📞</div>
              <h3>Call Us</h3>
              <p>(360) 555-0100</p>
            </motion.div>
            <motion.div
              className="contact-card"
              whileHover={{ scale: 1.03, rotate: [0, -1, 1, 0] }}
            >
              <div className="contact-icon">🏢</div>
              <h3>Visit Us</h3>
              <p>Olympia, WA</p>
            </motion.div>
          </div>
          <motion.div
            style={{ textAlign: 'center', marginTop: '40px' }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Link to="/contact" className="cta-button">
              Send Message
            </Link>
          </motion.div>
        </motion.div>
      </section>

      {/* Footer */}
      <footer className="footer" style={{ position: 'relative', zIndex: 1 }}>
        <div className="footer-content">
          <div className="footer-section">
            <h4>Nurse Delegation Network</h4>
            <p>Washington State's comprehensive nurse delegation directory</p>
          </div>
          <div className="footer-section">
            <h4>Quick Links</h4>
            <ul>
              <li><Link to="/map">Provider Map</Link></li>
              <li><Link to="/resources">Resources</Link></li>
              <li><Link to="/contact">Contact</Link></li>
            </ul>
          </div>
          <div className="footer-section">
            <h4>Legal</h4>
            <ul>
              <li><Link to="/privacy">Privacy Policy</Link></li>
              <li><Link to="/terms">Terms of Service</Link></li>
            </ul>
          </div>
        </div>
        <div className="footer-bottom">
          <p>&copy; 2024 Nurse Delegation Network. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}
