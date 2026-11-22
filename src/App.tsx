import { FormEvent, ReactNode, useEffect, useState } from "react";
import { joinWaitingList, WaitingListResult } from "./waitingList";

type Page = "home" | "features" | "solutions" | "pricing" | "about" | "contact";

const pageLabels: Record<Page, string> = {
  home: "Home",
  features: "Features",
  solutions: "Solutions",
  pricing: "Pricing",
  about: "About us",
  contact: "Request trial",
};

function Icon({
  name,
  size = 20,
  className = "",
}: {
  name: string;
  size?: number;
  className?: string;
}) {
  const paths: Record<string, ReactNode> = {
    arrow: (
      <>
        <path d="M5 12h14M13 6l6 6-6 6" />
      </>
    ),
    check: <path d="m5 12 4 4L19 6" />,
    chevron: <path d="m7 10 5 5 5-5" />,
    menu: (
      <>
        <path d="M4 7h16M4 12h16M4 17h16" />
      </>
    ),
    close: (
      <>
        <path d="M6 6l12 12M18 6 6 18" />
      </>
    ),
    calendar: (
      <>
        <rect x="3" y="5" width="18" height="16" rx="2" />
        <path d="M16 3v4M8 3v4M3 10h18" />
      </>
    ),
    users: (
      <>
        <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
        <circle cx="9" cy="7" r="4" />
        <path d="M22 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75" />
      </>
    ),
    wallet: (
      <>
        <path d="M20 7V5a2 2 0 0 0-2-2H5a3 3 0 0 0 0 6h16v10a2 2 0 0 1-2 2H5a3 3 0 0 1-3-3V6" />
        <path d="M16 14h2" />
      </>
    ),
    chart: (
      <>
        <path d="M4 19V9M10 19V5M16 19v-7M22 19V3" />
      </>
    ),
    tooth: (
      <>
        <path d="M12 3.2c-2.1 0-3.1-1.1-5.2-.5C3.5 3.7 2.2 7 3.2 10c.8 2.3 2.4 3.4 2.8 6.2.3 2.1.8 4.8 2.5 4.8 2.1 0 1.4-5.9 3.5-5.9s1.4 5.9 3.5 5.9c1.7 0 2.2-2.7 2.5-4.8.4-2.8 2-3.9 2.8-6.2 1-3-.3-6.3-3.6-7.3-2.1-.6-3.1.5-5.2.5Z" />
      </>
    ),
    flask: (
      <>
        <path d="M9 3h6M10 3v6l-5 9a2 2 0 0 0 1.7 3h10.6a2 2 0 0 0 1.7-3l-5-9V3" />
        <path d="M7.5 15h9" />
      </>
    ),
    desktop: (
      <>
        <rect x="2" y="3" width="20" height="14" rx="2" />
        <path d="M8 21h8M12 17v4" />
      </>
    ),
    shield: (
      <>
        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10" />
        <path d="m9 12 2 2 4-4" />
      </>
    ),
    clock: (
      <>
        <circle cx="12" cy="12" r="9" />
        <path d="M12 7v5l3 2" />
      </>
    ),
    globe: (
      <>
        <circle cx="12" cy="12" r="9" />
        <path d="M3 12h18M12 3a14 14 0 0 1 0 18M12 3a14 14 0 0 0 0 18" />
      </>
    ),
    report: (
      <>
        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8Z" />
        <path d="M14 2v6h6M8 17v-3M12 17v-6M16 17v-2" />
      </>
    ),
    xray: (
      <>
        <rect x="3" y="4" width="18" height="16" rx="2" />
        <path d="m7 15 3-3 2 2 3-4 3 5M8 8h.01" />
      </>
    ),
    spark: (
      <>
        <path d="m12 3 1.5 4.5L18 9l-4.5 1.5L12 15l-1.5-4.5L6 9l4.5-1.5L12 3Z" />
        <path d="m19 15 .7 2.3L22 18l-2.3.7L19 21l-.7-2.3L16 18l2.3-.7L19 15Z" />
      </>
    ),
    mail: (
      <>
        <rect x="3" y="5" width="18" height="14" rx="2" />
        <path d="m3 7 9 6 9-6" />
      </>
    ),
    play: <path d="m9 7 8 5-8 5V7Z" />,
  };
  return (
    <svg
      className={className}
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      {paths[name]}
    </svg>
  );
}

function Logo({ light = false }: { light?: boolean }) {
  return (
    <div className={`logo ${light ? "logo-light" : ""}`}>
      <img className="logo-img" src="/images/logo.png" alt="" aria-hidden="true" />
      <span>DentiChair</span>
    </div>
  );
}

function Button({
  children,
  variant = "primary",
  onClick,
  type = "button",
}: {
  children: ReactNode;
  variant?: "primary" | "secondary" | "light";
  onClick?: () => void;
  type?: "button" | "submit";
}) {
  return (
    <button className={`button button-${variant}`} onClick={onClick} type={type}>
      {children}
    </button>
  );
}

function Badge({ children }: { children: ReactNode }) {
  return (
    <div className="eyebrow">
      <span>
        <Icon name="spark" size={14} />
      </span>
      {children}
    </div>
  );
}

function Navbar({ page, navigate }: { page: Page; navigate: (page: Page) => void }) {
  const [open, setOpen] = useState(false);
  return (
    <header className="nav-wrap">
      <nav className="nav container">
        <button
          className="logo-button"
          onClick={() => navigate("home")}
          aria-label="DentiChair home"
        >
          <Logo />
        </button>
        <div className="nav-links">
          {(["features", "solutions", "pricing", "about"] as Page[]).map((item) => (
            <button
              className={page === item ? "active" : ""}
              onClick={() => navigate(item)}
              key={item}
            >
              {pageLabels[item]}
            </button>
          ))}
        </div>
        <div className="nav-actions">
          <button className="sign-in">Sign in</button>
          <Button onClick={() => navigate("contact")}>
            Request trial <Icon name="arrow" size={16} />
          </Button>
        </div>
        <button
          className="mobile-menu-button"
          onClick={() => setOpen(!open)}
          aria-label="Toggle menu"
        >
          <Icon name={open ? "close" : "menu"} />
        </button>
      </nav>
      {open && (
        <div className="mobile-menu">
          {(["features", "solutions", "pricing", "about"] as Page[]).map((item) => (
            <button
              onClick={() => {
                navigate(item);
                setOpen(false);
              }}
              key={item}
            >
              {pageLabels[item]}
            </button>
          ))}
          <button>Sign in</button>
          <Button
            onClick={() => {
              navigate("contact");
              setOpen(false);
            }}
          >
            Request trial
          </Button>
        </div>
      )}
    </header>
  );
}

function SectionTitle({
  eyebrow,
  title,
  copy,
  align = "center",
}: {
  eyebrow: string;
  title: string;
  copy: string;
  align?: "center" | "left";
}) {
  return (
    <div className={`section-title section-title-${align}`}>
      <span className="kicker">{eyebrow}</span>
      <h2>{title}</h2>
      <p>{copy}</p>
    </div>
  );
}

function Shot({
  src,
  alt,
  className = "",
}: {
  src: string;
  alt: string;
  className?: string;
}) {
  return (
    <div className={`shot ${className}`}>
      <img src={src} alt={alt} loading="lazy" decoding="async" />
    </div>
  );
}

function Hero({ navigate }: { navigate: (page: Page) => void }) {
  return (
    <section className="hero">
      <div className="hero-glow hero-glow-one" />
      <div className="hero-glow hero-glow-two" />
      <div className="container hero-content">
        <Badge>DENTICHAIR DESKTOP · WINDOWS & MACOS</Badge>
        <h1>
          The practice app that
          <br />
          <em>never stops working.</em>
        </h1>
        <p>
          DentiChair Desktop runs patients, appointments, charting, billing and labs at full speed on
          your own computers, then syncs securely to the cloud the moment you’re back online.
        </p>
        <div className="hero-actions">
          <Button onClick={() => navigate("contact")}>
            Start your 2-month free trial <Icon name="arrow" size={17} />
          </Button>
          <Button
            variant="secondary"
            onClick={() =>
              document.getElementById("product")?.scrollIntoView({ behavior: "smooth" })
            }
          >
            <span className="play">
              <Icon name="play" size={14} />
            </span>{" "}
            See DentiChair in action
          </Button>
        </div>
        <div className="hero-note">
          <span>
            <Icon name="check" size={14} /> No credit card
          </span>
          <span>
            <Icon name="check" size={14} /> Setup support included
          </span>
          <span>
            <Icon name="check" size={14} /> Cancel anytime
          </span>
        </div>
        <div className="hero-product" id="product">
          <div className="float-pill float-one">
            <span>
              <Icon name="check" size={15} />
            </span>
            <div>
              <strong>Saved offline</strong>
              <small>Syncs automatically when online</small>
            </div>
          </div>
          <div className="float-pill float-two">
            <span>
              <Icon name="calendar" size={16} />
            </span>
            <div>
              <strong>24 appointments</strong>
              <small>Today, at Downtown Clinic</small>
            </div>
          </div>
          <div className="desktop-frame hero-desktop">
            <div className="desktop-bar">
              <span />
              <span />
              <span />
              <small>DentiChair Desktop</small>
            </div>
            <img
              className="desktop-shot"
              src="/images/dashboard.png"
              alt="DentiChair Desktop dashboard showing revenue, active patients, appointments and today’s upcoming schedule"
              decoding="async"
            />
          </div>
        </div>
        <div className="trusted">
          <span>TRUSTED BY DENTAL CLINICS ACROSS UGANDA</span>
          <div>
            <b>KAMPALA</b>
            <b>MBALE</b>
          </div>
        </div>
      </div>
    </section>
  );
}

const features = [
  [
    "users",
    "Patient self-service",
    "Patients book appointments, register themselves and securely submit their details before they arrive.",
  ],
  [
    "calendar",
    "Social appointment inbox",
    "Receive appointment requests from all your social media channels directly inside DentiChair.",
  ],
  [
    "mail",
    "Automatic reminders",
    "Reduce no-shows with timely SMS, email and in-app appointment reminders and notifications.",
  ],
  [
    "tooth",
    "Clinical records & HMIS",
    "Complete HMIS-ready clinical records with medical history, notes, odontograms and periodontal charts.",
  ],
  [
    "xray",
    "X-rays & diagnostics",
    "Upload, view and organize patient X-rays, scans and diagnostic images directly in the clinical record.",
  ],
  [
    "wallet",
    "Billing & payments",
    "Simple invoices, insurance claims, payment plans and financial visibility.",
  ],
  [
    "flask",
    "Laboratory management",
    "Request tests, receive lab results and track dental laboratory cases from impression to fitting.",
  ],
  [
    "report",
    "Easy, lossless migration",
    "Move from Excel or another system without losing patient, appointment or financial data.",
  ],
];

function FeatureGrid() {
  return (
    <section className="section">
      <div className="container">
        <SectionTitle
          eyebrow="EVERYTHING ON YOUR DESKTOP"
          title="One desktop app for the whole practice."
          copy="From the front desk to the treatment room to the finance office, DentiChair brings every workflow into one fast, dependable application."
        />
        <div className="feature-page-grid">
          {features.map(([icon, title, copy], i) => (
            <article key={title}>
              <span className={`feature-icon icon-${i % 3}`}>
                <Icon name={icon} />
              </span>
              <h3>{title}</h3>
              <p>{copy}</p>
            </article>
          ))}
        </div>
        <div className="proof-strip">
          <div>
            <strong>40%</strong>
            <span>less time on admin</span>
          </div>
          <div>
            <strong>2.4×</strong>
            <span>faster patient check-in</span>
          </div>
          <div>
            <strong>99.9%</strong>
            <span>platform uptime</span>
          </div>
          <div>
            <strong>4.9/5</strong>
            <span>average team rating</span>
          </div>
        </div>
      </div>
    </section>
  );
}

function ClinicalShowcase() {
  const [tab, setTab] = useState(0);
  const tabs = [
    [
      "Advanced charting",
      "See the complete clinical picture",
      "Chart faster with an intuitive odontogram, detailed periodontal records and treatment planning that stays connected to the patient’s history.",
    ],
    [
      "Patient records",
      "One complete HMIS-ready clinical record.",
      "Keep medical history, clinical notes, diagnoses, treatment, prescriptions and every patient interaction together in one secure timeline.",
    ],
    [
      "Treatment plans",
      "Turn recommendations into action",
      "Build clear, visual treatment plans, explain options with confidence and track acceptance from one seamless workflow.",
    ],
    [
      "X-rays & labs",
      "Diagnostics, right where you need them.",
      "View X-rays and scans beside the dental chart, receive laboratory results and keep every diagnostic file connected to the patient record.",
    ],
  ];
  return (
    <section className="section section-tint">
      <div className="container">
        <div className="feature-tabs">
          {tabs.map((t, i) => (
            <button className={tab === i ? "active" : ""} onClick={() => setTab(i)} key={t[0]}>
              <span>0{i + 1}</span>
              {t[0]}
            </button>
          ))}
        </div>
        <div className="showcase-copy">
          <div>
            <span className="kicker">CLINICAL INTELLIGENCE</span>
            <h2>{tabs[tab][1]}</h2>
            <p>{tabs[tab][2]}</p>
          </div>
          <a>
            Explore clinical tools <Icon name="arrow" size={16} />
          </a>
        </div>
        <div className="mockup-stage mockup-stage-shot">
          {tab === 3 ? (
            <Shot
              src="/images/xray-requests.png"
              alt="Radiology and X-ray requests list with patient, examination, diagnostic centre, fee and status"
            />
          ) : (
            <Shot
              src="/images/odontogram.png"
              alt="Odontogram showing tooth-by-tooth charting with status legend and live metrics"
            />
          )}
        </div>
      </div>
    </section>
  );
}

function SplitShowcase({
  kind,
  eyebrow,
  title,
  copy,
  points,
  reverse = false,
}: {
  kind: "calendar" | "billing" | "lab" | "offline";
  eyebrow: string;
  title: string;
  copy: string;
  points: string[];
  reverse?: boolean;
}) {
  const visual =
    kind === "calendar" ? (
      <Shot
        src="/images/appointment%20module.png"
        alt="DentiChair appointments week view showing scheduled and in-consultation patient bookings across the week"
        className="shot-split"
      />
    ) : kind === "billing" ? (
      <Shot
        src="/images/invoices.png"
        alt="Billing screen listing invoices with patient, issue date, total bill, paid amount and balance"
        className="shot-split"
      />
    ) : kind === "lab" ? (
      <Shot
        src="/images/laboratory.png"
        alt="Laboratory screen with lab orders, status, doctor and item details"
        className="shot-split"
      />
    ) : (
      <OfflineMockup />
    );
  return (
    <section className={`split-section ${reverse ? "reverse" : ""}`}>
      <div className="container split-grid">
        <div className="split-copy">
          <span className="kicker">{eyebrow}</span>
          <h2>{title}</h2>
          <p>{copy}</p>
          <ul>
            {points.map((p) => (
              <li key={p}>
                <span>
                  <Icon name="check" size={14} />
                </span>
                {p}
              </li>
            ))}
          </ul>
          <a>
            Discover more <Icon name="arrow" size={16} />
          </a>
        </div>
        <div className="split-visual">{visual}</div>
      </div>
    </section>
  );
}

function OfflineMockup() {
  return (
    <div className="offline-scene">
      <div className="desktop-frame">
        <div className="desktop-bar">
          <span />
          <span />
          <span />
          <small>DentiChair Desktop</small>
        </div>
        <img
          className="desktop-shot"
          src="/images/offline-settings.png"
          alt="DentiChair Desktop settings showing Online Cloud Mode with synced status and an empty sync queue"
          loading="lazy"
          decoding="async"
        />
      </div>
      <div className="sync-card">
        <span>
          <Icon name="check" size={18} />
        </span>
        <div>
          <strong>All changes synced</strong>
          <small>Last synced just now</small>
        </div>
      </div>
      <div className="offline-badge">
        <Icon name="desktop" size={18} /> Works without internet
      </div>
    </div>
  );
}

function HowItWorks({ navigate }: { navigate: (page: Page) => void }) {
  return (
    <section className="section how-section">
      <div className="container">
        <SectionTitle
          eyebrow="SIMPLE FROM DAY ONE"
          title="From setup to smoother days in three steps"
          copy="Your onboarding specialist securely moves your data from Excel or any other system, configures your workflows and gets your team confident."
        />
        <div className="steps">
          <div className="step-line" />
          {[
            [
              "01",
              "Tell us how you work",
              "We learn your practice, team and goals—then tailor your workspace.",
            ],
            [
              "02",
              "Switch without losing data",
              "We securely migrate and verify every record from Excel or your current system.",
            ],
            [
              "03",
              "Run a better practice",
              "Go live with expert support whenever and wherever you need it.",
            ],
          ].map(([n, title, copy]) => (
            <article key={n}>
              <span>{n}</span>
              <h3>{title}</h3>
              <p>{copy}</p>
            </article>
          ))}
        </div>
        <div className="center-action">
          <Button onClick={() => navigate("contact")}>
            Plan your switch <Icon name="arrow" size={16} />
          </Button>
        </div>
      </div>
    </section>
  );
}

const plans = [
  {
    name: "DentiChair Complete",
    sub: "Everything your dental practice needs in one simple plan.",
    popular: true,
    features: [
      "Two-month free trial",
      "Patient self-booking & registration",
      "Social media appointment inbox",
      "Email & in-app reminders",
      "HMIS-ready clinical records",
      "X-rays, scans & diagnostic images",
      "Invoices & payments",
      "Lab requests, results & case tracking",
      "Reports & analytics",
      "Excel and system data migration",
      "Desktop and offline access",
    ],
  },
];

function PricingCards({
  navigate,
  full = false,
}: {
  navigate: (page: Page) => void;
  full?: boolean;
}) {
  return (
    <div className={`pricing-block ${full ? "pricing-full" : ""}`}>
      <div className="price-promise">
        <span>
          <Icon name="check" size={14} />
        </span>
        Two months free, then a plan priced for your clinic
      </div>
      <div className="pricing-grid pricing-grid-single">
        {plans.map((plan) => (
          <article className={`price-card ${plan.popular ? "popular" : ""}`} key={plan.name}>
            {plan.popular && <div className="popular-label">MOST POPULAR</div>}
            <h3>{plan.name}</h3>
            <p>{plan.sub}</p>
            <Button
              variant={plan.popular ? "primary" : "secondary"}
              onClick={() => navigate("contact")}
            >
              Start 2 months free <Icon name="arrow" size={16} />
            </Button>
            <div className="plan-divider" />
            <small className="included">WHAT’S INCLUDED</small>
            <ul>
              {plan.features.map((f) => (
                <li key={f}>
                  <Icon name="check" size={15} />
                  {f}
                </li>
              ))}
            </ul>
          </article>
        ))}
      </div>
      <p className="pricing-note">
        Secure cloud backup, desktop access and assisted data migration are included. No setup fee,
        no credit card and no long-term contract.
      </p>
    </div>
  );
}

const faqs = [
  [
    "What can I store in a DentiChair clinical record?",
    "Each secure HMIS-ready record can include medical and dental history, clinical notes, diagnoses, prescriptions, odontograms, periodontal charts, treatment plans, X-rays, scans, laboratory requests and results.",
  ],
  [
    "Can I move my existing patient data to DentiChair?",
    "Yes. Our onboarding team securely moves your data from Excel spreadsheets or virtually any other practice management system. We verify your patient, appointment and financial records with you before go-live so nothing is lost.",
  ],
  [
    "Can patients book and register without calling reception?",
    "Yes. Patients can choose an available appointment, register themselves and submit their details before they arrive. DentiChair captures everything directly in the system, saving your reception team from repetitive data entry.",
  ],
  [
    "Can DentiChair collect appointments from social media?",
    "Yes. Appointment requests from your connected social media channels flow into one DentiChair inbox, where your team can review and confirm them without switching between apps.",
  ],
  [
    "How do appointment reminders work?",
    "DentiChair automatically sends SMS and email reminders and keeps your team informed with in-app notifications, helping patients arrive on time and reducing missed appointments.",
  ],
  [
    "Does DentiChair work if my internet goes down?",
    "Yes. DentiChair Desktop keeps your essential clinical and appointment workflows available offline, then automatically syncs when your connection returns.",
  ],
  [
    "Is patient information secure?",
    "DentiChair uses encryption in transit and at rest, role-based permissions, audit logs and regular backups. We support data-protection requirements across the regions we serve.",
  ],
  [
    "What happens after the two-month trial?",
    "After your full two-month free trial, your clinic continues on a plan priced for your practice. There are no setup fees, no lock-in contract and no surprise charges.",
  ],
];

function FAQ() {
  const [open, setOpen] = useState(0);
  return (
    <section className="section faq-section">
      <div className="container faq-grid">
        <div>
          <span className="kicker">QUESTIONS, ANSWERED</span>
          <h2>Everything you need to know</h2>
          <p>Can’t find the answer you’re looking for?</p>
          <a href="mailto:sales@dentichair.com">
            Talk to our team <Icon name="arrow" size={15} />
          </a>
        </div>
        <div className="accordion">
          {faqs.map(([q, a], i) => (
            <article className={open === i ? "open" : ""} key={q}>
              <button onClick={() => setOpen(open === i ? -1 : i)}>
                <strong>{q}</strong>
                <span>{open === i ? "−" : "+"}</span>
              </button>
              {open === i && <p>{a}</p>}
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

function CTA({ navigate }: { navigate: (page: Page) => void }) {
  return (
    <section className="cta-section">
      <div className="container">
        <div className="cta-card">
          <div className="cta-orbit orbit-one" />
          <div className="cta-orbit orbit-two" />
          <div className="cta-content">
            <Badge>YOUR BEST PRACTICE STARTS HERE</Badge>
            <h2>Make every chair count.</h2>
            <p>
              Join modern dental teams replacing busywork with better care. Try every DentiChair
              feature free for two months, then continue with a plan priced for your clinic.
            </p>
            <div>
              <Button variant="light" onClick={() => navigate("contact")}>
                Request your 2-month trial <Icon name="arrow" size={16} />
              </Button>
              <button className="text-button">Or start free today</button>
            </div>
          </div>
          <div className="cta-teeth">
            <div className="tooth-orb tooth-a">
              <Icon name="tooth" size={46} />
            </div>
            <div className="tooth-orb tooth-b">
              <Icon name="chart" size={34} />
            </div>
            <div className="tooth-orb tooth-c">
              <Icon name="calendar" size={28} />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function Footer({ navigate }: { navigate: (page: Page) => void }) {
  return (
    <footer>
      <div className="container footer-grid">
        <div className="footer-brand">
          <Logo light />
          <p>
            Elevating dental practice management,
            <br />
            one clinic at a time.
          </p>
          <div className="status">
            <i /> All systems operational
          </div>
          <div className="footer-mails">
            <a href="mailto:info@dentichair.com">info@dentichair.com</a>
            <a href="mailto:sales@dentichair.com">sales@dentichair.com</a>
            <a href="mailto:support@dentichair.com">support@dentichair.com</a>
          </div>
        </div>
        <div>
          <strong>Product</strong>
          <button onClick={() => navigate("features")}>Features</button>
          <button onClick={() => navigate("solutions")}>Solutions</button>
          <button onClick={() => navigate("pricing")}>Pricing</button>
          <button>Security</button>
        </div>
        <div>
          <strong>Company</strong>
          <button onClick={() => navigate("about")}>About us</button>
          <button>Careers</button>
          <button>Partners</button>
          <button>Contact</button>
        </div>
        <div>
          <strong>Resources</strong>
          <button>Help centre</button>
          <button>Guides</button>
          <button>System status</button>
          <button>Privacy</button>
        </div>
        <div className="newsletter">
          <strong>Practice better, monthly.</strong>
          <p>Product updates and smart practice insights.</p>
          <div>
            <input placeholder="Work email address" />
            <button aria-label="Subscribe">
              <Icon name="arrow" size={17} />
            </button>
          </div>
        </div>
      </div>
      <div className="container footer-bottom">
        <span>© 2026 DentiChair Technologies. All rights reserved.</span>
        <div>
          <button>Terms</button>
          <button>Privacy</button>
          <button>Cookies</button>
        </div>
        <span>Built for dental teams everywhere.</span>
      </div>
    </footer>
  );
}

const onboardedClients = [
  { name: "DOCDICO Dental Services", image: "DOCDICO DENTAL SERVICES.jpg" },
  { name: "Arise Dental Care", image: "arise-dental-care.webp" },
  { name: "Icon Dental Services Mbale", image: "icon-dental service-mbale.jpg" },
  { name: "Rubaga Dental Surgery", image: "rubaga dental surgery.jpeg" },
];

function ClientsSection() {
  return (
    <section className="section clients-section">
      <div className="container">
        <SectionTitle
          eyebrow="OUR CLIENTS"
          title="Clinics already running on DentiChair."
          copy="Dental practices that have moved their patients, appointments and records onto DentiChair."
        />
        <ul className="clients-grid">
          {onboardedClients.map((client) => (
            <li className="client-card" key={client.name}>
              <img
                src={`/images/clients/${encodeURIComponent(client.image)}`}
                alt={`${client.name} logo`}
                loading="lazy"
                decoding="async"
              />
              <span>{client.name}</span>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}

function HomePage({ navigate }: { navigate: (page: Page) => void }) {
  return (
    <>
      <Hero navigate={navigate} />
      <ClientsSection />
      <FeatureGrid />
      <SplitShowcase
        kind="offline"
        eyebrow="DENTICHAIR DESKTOP"
        title="Your practice keeps moving—even when the internet doesn’t."
        copy="Get the speed and resilience of a desktop application with the convenience of secure cloud sync."
        points={[
          "Reliable offline access to essential workflows",
          "Automatic background sync when you reconnect",
          "Optimized for Windows and macOS",
        ]}
      />
      <ClinicalShowcase />
      <SplitShowcase
        kind="calendar"
        eyebrow="APPOINTMENTS & QUEUE"
        title="A calmer day starts with a smarter calendar."
        copy="Bring every appointment into one calendar and let patients handle routine booking and registration themselves."
        points={[
          "Capture appointment requests from all social media channels",
          "Let patients self-book, register and submit their details",
          "Send automatic SMS, email and in-app reminders",
        ]}
        reverse
      />
      <SplitShowcase
        kind="billing"
        eyebrow="BILLING & FINANCE"
        title="Know exactly how your practice is performing."
        copy="From treatment estimates to final payments, make every financial conversation clear and every number easy to understand."
        points={[
          "Professional estimates and invoices in seconds",
          "Track payments, claims and outstanding balances",
          "Real-time revenue and collection insights",
        ]}
      />
      <SplitShowcase
        kind="lab"
        eyebrow="LABORATORY MANAGEMENT"
        title="Every lab case, exactly where it should be."
        copy="Give your team a clear view of every external and in-house lab order—from impression to delivery."
        points={[
          "Visual case tracking and due dates",
          "Store prescriptions, shades and attachments",
          "Automatic status updates for your care team",
        ]}
        reverse
      />
      <HowItWorks navigate={navigate} />
      <section className="section pricing-section">
        <div className="container">
          <SectionTitle
            eyebrow="SIMPLE, TRANSPARENT PRICING"
            title="Every feature. One plan for your clinic."
            copy="Use DentiChair Desktop free for two full months, then keep your complete practice system on a plan priced for your clinic."
          />
          <PricingCards navigate={navigate} />
        </div>
      </section>
      <FAQ />
      <CTA navigate={navigate} />
    </>
  );
}

function PageHero({ eyebrow, title, copy }: { eyebrow: string; title: string; copy: string }) {
  return (
    <section className="page-hero">
      <div className="page-orb" />
      <div className="container">
        <Badge>{eyebrow}</Badge>
        <h1>{title}</h1>
        <p>{copy}</p>
      </div>
    </section>
  );
}

function FeaturesPage({ navigate }: { navigate: (page: Page) => void }) {
  return (
    <>
      <PageHero
        eyebrow="ONE CONNECTED PLATFORM"
        title="Everything your practice needs to thrive."
        copy="Powerful clinical, operational and financial tools—designed to feel remarkably simple from the first click."
      />
      <section className="section">
        <div className="container feature-page-grid">
          {features.map(([icon, title, copy], i) => (
            <article key={title}>
              <span className={`feature-icon icon-${i % 3}`}>
                <Icon name={icon} />
              </span>
              <h3>{title}</h3>
              <p>{copy}</p>
              <a>
                Learn more <Icon name="arrow" size={15} />
              </a>
            </article>
          ))}
        </div>
      </section>
      <ClinicalShowcase />
      <SplitShowcase
        kind="calendar"
        eyebrow="SMART SCHEDULING"
        title="Turn a busy calendar into a smooth day."
        copy="Bring social enquiries, online self-bookings, patient registrations and your team’s schedule into one clear view."
        points={[
          "Appointments captured from social media",
          "Patient self-booking and registration",
          "SMS, email and in-app notifications",
        ]}
      />
      <SplitShowcase
        kind="billing"
        eyebrow="FINANCIAL CLARITY"
        title="Understand every dollar, at a glance."
        copy="Take control of estimates, invoices, claims and collections without switching between systems."
        points={["Flexible payment options", "Daily reconciliation", "Export-ready reports"]}
        reverse
      />
      <CTA navigate={navigate} />
    </>
  );
}

function SolutionsPage({ navigate }: { navigate: (page: Page) => void }) {
  const solutions = [
    [
      "tooth",
      "Independent practices",
      "Professional tools without enterprise complexity. Spend less time managing software and more time growing patient relationships.",
    ],
    [
      "users",
      "Multi-chair clinics",
      "Keep providers, reception and clinical teams aligned with workflows that scale as your clinic grows.",
    ],
    [
      "globe",
      "Dental groups",
      "Standardize excellence across every location while giving each practice the flexibility to operate effectively.",
    ],
  ];
  return (
    <>
      <PageHero
        eyebrow="BUILT AROUND YOUR PRACTICE"
        title="The right fit, at every stage of growth."
        copy="Whether you run one chair or a network of clinics, DentiChair brings the visibility and control your team needs."
      />
      <section className="section">
        <div className="container solution-grid">
          {solutions.map(([icon, title, copy], i) => (
            <article key={title}>
              <div className={`solution-visual sv-${i}`}>
                <Icon name={icon} size={58} />
                <span>{i === 0 ? "01" : i === 1 ? "08" : "24"}</span>
              </div>
              <div>
                <h3>{title}</h3>
                <p>{copy}</p>
                <ul>
                  <li>
                    <Icon name="check" size={14} /> Fast, guided setup
                  </li>
                  <li>
                    <Icon name="check" size={14} /> Workflows that fit your team
                  </li>
                  <li>
                    <Icon name="check" size={14} /> Support from real people
                  </li>
                </ul>
              </div>
            </article>
          ))}
        </div>
      </section>
      <section className="section section-tint">
        <div className="container">
          <SectionTitle
            eyebrow="DESIGNED FOR REAL-WORLD DENTISTRY"
            title="Global standards. Local understanding."
            copy="Built for the realities of modern practices across Africa and beyond—from connectivity and currencies to multi-location growth."
          />
          <div className="global-card">
            <div>
              <span className="kicker">AVAILABLE EVERYWHERE</span>
              <h3>
                One platform.
                <br />
                Every location.
              </h3>
              <p>
                Multi-currency billing, configurable tax, regional date formats and offline
                reliability make DentiChair at home wherever you practice.
              </p>
            </div>
            <div className="globe-visual">
              <Icon name="globe" size={180} />
              <i className="pin p1" />
              <i className="pin p2" />
              <i className="pin p3" />
              <i className="pin p4" />
            </div>
          </div>
        </div>
      </section>
      <CTA navigate={navigate} />
    </>
  );
}

function PricingPage({ navigate }: { navigate: (page: Page) => void }) {
  return (
    <>
      <PageHero
        eyebrow="PRICING WITHOUT SURPRISES"
        title="Two months free. Then a plan priced for your clinic."
        copy="One complete plan with every DentiChair feature. No setup fee, no hidden extras and no long-term contract."
      />
      <section className="section pricing-page-section">
        <div className="container">
          <PricingCards navigate={navigate} full />
          <div className="guarantee">
            <span>
              <Icon name="shield" size={28} />
            </span>
            <div>
              <strong>Two months, entirely on us.</strong>
              <p>
                Get expert onboarding, move every record from Excel or your current system and let
                your whole team experience DentiChair. No data loss, no credit card and no
                obligation.
              </p>
            </div>
          </div>
        </div>
      </section>
      <FAQ />
      <CTA navigate={navigate} />
    </>
  );
}

function AboutPage({ navigate }: { navigate: (page: Page) => void }) {
  return (
    <>
      <PageHero
        eyebrow="OUR PURPOSE"
        title="Better systems make room for better care."
        copy="We’re building the modern operating system for dental teams—starting with the practices too often overlooked by global software."
      />
      <section className="section story-section">
        <div className="container story-grid">
          <div>
            <span className="kicker">WHY DENTICHAIR</span>
            <h2>Dental software should move at the speed of your team.</h2>
          </div>
          <div>
            <p>
              Too many dental teams still choose between outdated desktop systems and generic cloud
              tools that ignore the realities of their day.
            </p>
            <p>
              DentiChair was created to change that: world-class practice technology that is
              resilient, intuitive and deeply connected—from front desk to treatment room to finance
              office.
            </p>
            <p>
              We partner closely with practicing dentists, nurses and administrators to make sure
              every decision starts with real clinical work.
            </p>
          </div>
        </div>
        <div className="container values-grid">
          {[
            [
              "spark",
              "Care deeply",
              "We build with empathy for the people delivering care and the people receiving it.",
            ],
            [
              "chart",
              "Raise the standard",
              "We believe every practice deserves software that is secure, beautiful and capable.",
            ],
            [
              "globe",
              "Design for everywhere",
              "We embrace different markets, workflows and realities from the very beginning.",
            ],
            [
              "users",
              "Win together",
              "The best outcomes happen when customers, teams and partners work as one.",
            ],
          ].map(([icon, title, copy]) => (
            <article key={title}>
              <Icon name={icon} />
              <h3>{title}</h3>
              <p>{copy}</p>
            </article>
          ))}
        </div>
      </section>
      <section className="numbers-band">
        <div className="container">
          <div>
            <strong>6</strong>
            <span>countries and growing</span>
          </div>
          <div>
            <strong>120k+</strong>
            <span>patient records managed</span>
          </div>
          <div>
            <strong>99.9%</strong>
            <span>reliable platform uptime</span>
          </div>
          <div>
            <strong>24/5</strong>
            <span>human customer support</span>
          </div>
        </div>
      </section>
      <CTA navigate={navigate} />
    </>
  );
}

function TrialRequestForm() {
  const [submitting, setSubmitting] = useState(false);
  const [result, setResult] = useState<WaitingListResult | null>(null);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string[]>>({});

  const submit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = new FormData(e.currentTarget);
    const value = (name: string) => String(form.get(name) ?? "").trim();
    setSubmitting(true);
    setResult(null);
    setFieldErrors({});
    const res = await joinWaitingList({
      client_email: value("client_email"),
      phone: value("phone"),
      location: value("location") || undefined,
      branch: value("branch") || undefined,
    });
    setSubmitting(false);
    setResult(res);
    if (!res.ok && res.fieldErrors) setFieldErrors(res.fieldErrors);
  };

  if (result?.ok) {
    return (
      <div className="form-success">
        <span>
          <Icon name="check" size={28} />
        </span>
        <h2>Your trial request is in.</h2>
        <p>{result.message}</p>
      </div>
    );
  }

  const errorFor = (field: string) => fieldErrors[field]?.[0];

  return (
    <form onSubmit={submit} noValidate>
      <h2>Request your 2-month trial</h2>
      <p>Tell us where you are and we’ll contact you to set up your trial.</p>
      <label>
        Email address
        <input required type="email" name="client_email" placeholder="jane@example.com" />
        {errorFor("client_email") && <small role="alert">{errorFor("client_email")}</small>}
      </label>
      <label>
        Phone number
        <input required type="tel" name="phone" placeholder="+256 712 345 678" />
        {errorFor("phone") && <small role="alert">{errorFor("phone")}</small>}
      </label>
      <div className="form-row">
        <label>
          Location
          <input name="location" placeholder="Kampala" />
          {errorFor("location") && <small role="alert">{errorFor("location")}</small>}
        </label>
        <label>
          Branch
          <input name="branch" placeholder="Kololo" />
          {errorFor("branch") && <small role="alert">{errorFor("branch")}</small>}
        </label>
      </div>
      {result && !result.ok && (
        <p role="alert" className="form-error">
          {result.message}
        </p>
      )}
      <Button type="submit">
        {submitting ? "Requesting…" : "Request my trial"} <Icon name="arrow" size={17} />
      </Button>
    </form>
  );
}

function ContactPage() {
  return (
    <section className="contact-page">
      <div className="container contact-grid">
        <div className="contact-copy">
          <Badge>2-MONTH FREE TRIAL</Badge>
          <h1>Try DentiChair free for two months.</h1>
          <p>
            Request your trial and we’ll help you set up DentiChair for your clinic. Every feature
            is included, with no setup fees and no lock-in contract.
          </p>
          <div className="demo-points">
            {[
              ["calendar", "Two months with every feature included"],
              ["users", "Tailored to your practice and team"],
              ["desktop", "No pressure. Just helpful answers."],
            ].map(([icon, text]) => (
              <div key={text}>
                <span>
                  <Icon name={icon} />
                </span>
                <strong>{text}</strong>
              </div>
            ))}
          </div>
          <div className="contact-emails">
            <a href="mailto:sales@dentichair.com">
              <small>Sales</small> sales@dentichair.com
            </a>
            <a href="mailto:support@dentichair.com">
              <small>Support</small> support@dentichair.com
            </a>
            <a href="mailto:info@dentichair.com">
              <small>General</small> info@dentichair.com
            </a>
          </div>
          <blockquote>
            “DentiChair has transformed the rhythm of our clinic. Everyone knows what’s happening,
            patients wait less, and I finally understand the business at a glance.”
            <footer>
              <span className="quote-avatar">NA</span>
              <div>
                <strong>Dr. Nana Agyeman</strong>
                <small>Clinical Director, Pearl Dental</small>
              </div>
            </footer>
          </blockquote>
        </div>
        <div className="form-card">
          <TrialRequestForm />
        </div>
      </div>
    </section>
  );
}

export default function App() {
  const getPage = (): Page => {
    const hash = window.location.hash.replace("#/", "") as Page;
    return hash in pageLabels ? hash : "home";
  };
  const [page, setPage] = useState<Page>(getPage);
  useEffect(() => {
    const update = () => {
      setPage(getPage());
      window.scrollTo({ top: 0, behavior: "instant" });
    };
    window.addEventListener("hashchange", update);
    return () => window.removeEventListener("hashchange", update);
  }, []);
  const navigate = (next: Page) => {
    if (next === page) window.scrollTo({ top: 0, behavior: "smooth" });
    else window.location.hash = `/${next}`;
  };
  return (
    <div className="app">
      <Navbar page={page} navigate={navigate} />
      <main>
        {page === "home" && <HomePage navigate={navigate} />}
        {page === "features" && <FeaturesPage navigate={navigate} />}
        {page === "solutions" && <SolutionsPage navigate={navigate} />}
        {page === "pricing" && <PricingPage navigate={navigate} />}
        {page === "about" && <AboutPage navigate={navigate} />}
        {page === "contact" && <ContactPage />}
      </main>
      <Footer navigate={navigate} />
    </div>
  );
}
