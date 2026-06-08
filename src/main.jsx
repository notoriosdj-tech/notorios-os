import React, { useMemo, useState } from 'react';
import { createRoot } from 'react-dom/client';
import { Activity, ArrowRight, BadgeDollarSign, CalendarDays, CreditCard, Dumbbell, ExternalLink, Flame, Gauge, Home, PiggyBank, ShieldCheck, Wallet } from 'lucide-react';
import './styles.css';

const SHEETS = {
  weight: {
    title: 'Notorios Cut OS',
    subtitle: 'Weight, meals, calories, protein and daily cut decisions.',
    url: 'https://docs.google.com/spreadsheets/d/16ey67g-Qf3x8RF33Gq3ZLMfysfMFaM4Jy1hj00GSuig/edit',
    embed: 'https://docs.google.com/spreadsheets/d/16ey67g-Qf3x8RF33Gq3ZLMfysfMFaM4Jy1hj00GSuig/preview?gid=0&rm=minimal',
  },
  money: {
    title: 'Notorios Money Dashboard',
    subtitle: 'Budget control, account snapshot, credit-score guardrails and spending decisions.',
    url: 'https://docs.google.com/spreadsheets/d/1rQvwsMXSJi4wzAjy5-UZlTcOLmCDdl83tNV_SFdad0Q/edit',
    embed: 'https://docs.google.com/spreadsheets/d/1rQvwsMXSJi4wzAjy5-UZlTcOLmCDdl83tNV_SFdad0Q/preview?gid=159692961&rm=minimal',
  },
};

const moneyMetrics = [
  { label: 'Chequing', value: '$92.24', helper: 'Current cash account', icon: Wallet },
  { label: 'Savings', value: '$10.00', helper: 'Current savings', icon: PiggyBank },
  { label: 'CC Exposure', value: '$574.95', helper: 'Current + pending', icon: CreditCard, tone: 'warning' },
  { label: 'Safe / Day', value: '$73.45', helper: 'Remaining daily budget', icon: Gauge },
  { label: 'Car Payment', value: '$281.33', helper: 'Fixed bill included', icon: BadgeDollarSign },
  { label: 'Paydown Needed', value: '$274.95', helper: 'To reach $300 CC target', icon: ShieldCheck, tone: 'warning' },
];

const weightMetrics = [
  { label: 'Calories Left', value: '720 kcal', helper: 'Used 1130 / 1850', icon: Flame },
  { label: 'Protein Left', value: '100 g', helper: 'Used 40 / 140', icon: Dumbbell },
  { label: 'Day Status', value: 'Yellow', helper: 'Controlled day', icon: Activity, tone: 'warning' },
  { label: 'Meals Logged', value: '2', helper: 'Today', icon: CalendarDays },
  { label: 'Current Weight', value: 'Log weight', helper: 'No trend yet', icon: Gauge },
  { label: 'Goal Weight', value: '74 kg', helper: 'Start: 90 kg', icon: ShieldCheck },
];

function routeFromPath() {
  const path = window.location.pathname.toLowerCase();
  if (path.includes('money')) return 'money';
  if (path.includes('weight')) return 'weight';
  return 'home';
}

function useRoute() {
  const [route, setRoute] = useState(routeFromPath());
  const go = (next) => {
    const path = next === 'home' ? '/' : `/${next}`;
    window.history.pushState({}, '', path);
    setRoute(next);
  };
  React.useEffect(() => {
    const onPop = () => setRoute(routeFromPath());
    window.addEventListener('popstate', onPop);
    return () => window.removeEventListener('popstate', onPop);
  }, []);
  return [route, go];
}

function Nav({ route, go }) {
  return (
    <header className="topbar">
      <button className="brand" onClick={() => go('home')}>
        <span className="brandMark">N</span>
        <span>
          <strong>NOTORIOS OS</strong>
          <small>Cut + Money dashboards</small>
        </span>
      </button>
      <nav>
        <button className={route === 'home' ? 'active' : ''} onClick={() => go('home')}><Home size={16} /> Home</button>
        <button className={route === 'weight' ? 'active' : ''} onClick={() => go('weight')}><Activity size={16} /> Weight</button>
        <button className={route === 'money' ? 'active' : ''} onClick={() => go('money')}><Wallet size={16} /> Money</button>
      </nav>
    </header>
  );
}

function MetricCard({ item }) {
  const Icon = item.icon;
  return (
    <article className={`metric ${item.tone || ''}`}>
      <div className="metricIcon"><Icon size={20} /></div>
      <div>
        <p>{item.label}</p>
        <strong>{item.value}</strong>
        <span>{item.helper}</span>
      </div>
    </article>
  );
}

function HomePage({ go }) {
  return (
    <main className="page homePage">
      <section className="hero">
        <div>
          <p className="eyebrow">Personal operating system</p>
          <h1>One website. Two separate systems.</h1>
          <p className="heroText">The Google Sheets stay separate. The website gives you one clean entry point with a dedicated weight page and a dedicated money page.</p>
          <div className="heroActions">
            <button onClick={() => go('weight')} className="primaryBtn">Open Weight <ArrowRight size={17} /></button>
            <button onClick={() => go('money')} className="secondaryBtn">Open Money <ArrowRight size={17} /></button>
          </div>
        </div>
        <div className="statusPanel">
          <div className="statusHeader">Today’s combined rule</div>
          <p>Protein-first meals. Essentials-only spending until the credit card is under $300.</p>
          <div className="pillRow">
            <span>Cut: Yellow day</span>
            <span>Money: CC paydown</span>
          </div>
        </div>
      </section>

      <section className="splitCards">
        <button className="projectCard weight" onClick={() => go('weight')}>
          <Activity size={28} />
          <h2>Weight Dashboard</h2>
          <p>Meals, calories, protein, damage-control label, confidence and weekly cut tracking.</p>
        </button>
        <button className="projectCard money" onClick={() => go('money')}>
          <Wallet size={28} />
          <h2>Money Dashboard</h2>
          <p>Accounts, budget, fixed bills, credit utilization guardrails and realistic spending control.</p>
        </button>
      </section>
    </main>
  );
}

function DashboardPage({ type }) {
  const config = SHEETS[type];
  const metrics = type === 'money' ? moneyMetrics : weightMetrics;
  const isMoney = type === 'money';

  const insight = useMemo(() => {
    if (isMoney) {
      return {
        title: 'Money decision',
        text: 'Do not add new credit-card spending until the card is under $300. Use debit for essentials; LOC only if cash flow forces it.',
        tags: ['CC ceiling: $600', 'Ideal zone: $150-$300', 'LOC ceiling: $700'],
      };
    }
    return {
      title: 'Cut decision',
      text: 'Next meal should be lean protein first. The day is controlled, but protein is still low versus target.',
      tags: ['Target: 1850 kcal', 'Protein target: 140g', 'Status: Yellow'],
    };
  }, [isMoney]);

  return (
    <main className="page dashboardPage">
      <section className={`dashboardHero ${type}`}>
        <div>
          <p className="eyebrow">{isMoney ? 'Financial control' : 'Weight-loss control'}</p>
          <h1>{config.title}</h1>
          <p>{config.subtitle}</p>
        </div>
        <a className="openSheet" href={config.url} target="_blank" rel="noreferrer">Open source sheet <ExternalLink size={16} /></a>
      </section>

      <section className="metricsGrid">
        {metrics.map((item) => <MetricCard key={item.label} item={item} />)}
      </section>

      <section className="insightStrip">
        <div>
          <p className="eyebrow">Current recommendation</p>
          <h2>{insight.title}</h2>
          <p>{insight.text}</p>
        </div>
        <div className="tagStack">{insight.tags.map((tag) => <span key={tag}>{tag}</span>)}</div>
      </section>

      <section className="sheetFrameBlock">
        <div className="frameHeader">
          <div>
            <h2>Live dashboard view</h2>
            <p>This embeds the existing Google Sheet dashboard. The source files remain separate.</p>
          </div>
          <a href={config.url} target="_blank" rel="noreferrer">Open full sheet</a>
        </div>
        <iframe title={`${type} Google Sheet dashboard`} src={config.embed} />
      </section>
    </main>
  );
}

function App() {
  const [route, go] = useRoute();
  return (
    <>
      <Nav route={route} go={go} />
      {route === 'home' && <HomePage go={go} />}
      {route === 'weight' && <DashboardPage type="weight" />}
      {route === 'money' && <DashboardPage type="money" />}
    </>
  );
}

createRoot(document.getElementById('root')).render(<App />);
