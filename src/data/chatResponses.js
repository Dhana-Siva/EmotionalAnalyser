import accounts from './accounts.json';
import transactions from './transactions.json';

const formatCurrency = (amount) =>
  new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(amount);

const recentTransactions = transactions
  .filter((t) => t.accountId === 'chk-001' && t.amount < 0)
  .slice(0, 5);

const anomalies = transactions.filter((t) => t.anomaly);

const patterns = [
  {
    match: /balance/i,
    response: () => {
      const lines = accounts.map(
        (a) => `**${a.name}** (${a.type}): ${formatCurrency(a.balance)}`
      );
      return `Here are your current balances:\n\n${lines.join('\n\n')}`;
    },
  },
  {
    match: /recent.*(transaction|activity|purchase|spending)/i,
    response: () => {
      const lines = recentTransactions.map(
        (t) => `• ${t.date} — ${t.description}: ${formatCurrency(t.amount)}`
      );
      return `Here are your 5 most recent transactions:\n\n${lines.join('\n\n')}`;
    },
  },
  {
    match: /unusual|anomal|suspicious|fraud|alert/i,
    response: () => {
      if (anomalies.length === 0) return "Great news! I don't see any unusual activity on your accounts.";
      const lines = anomalies.map(
        (t) => `⚠️ **${t.description}** (${formatCurrency(t.amount)}) — ${t.anomalyReason}`
      );
      return `I found ${anomalies.length} flagged transactions:\n\n${lines.join('\n\n')}\n\nWould you like me to help you dispute any of these?`;
    },
  },
  {
    match: /transfer|send|pay/i,
    response: () =>
      "I can help you with transfers! Here are your options:\n\n• **Internal Transfer** — Move money between your checking and savings\n• **External Transfer** — Send money to another bank\n• **Bill Pay** — Pay bills directly from your account\n\nWhich would you like to do? (Note: This is a demo — no actual transfers will be made.)",
  },
  {
    match: /spend|budget|category|insight/i,
    response: () => {
      const spending = {};
      transactions
        .filter((t) => t.amount < 0 && !t.anomaly)
        .forEach((t) => {
          spending[t.category] = (spending[t.category] || 0) + Math.abs(t.amount);
        });
      const sorted = Object.entries(spending).sort((a, b) => b[1] - a[1]);
      const lines = sorted.slice(0, 5).map(
        ([cat, amt]) => `• **${cat}**: ${formatCurrency(amt)}`
      );
      return `Here's your spending breakdown this month:\n\n${lines.join('\n\n')}\n\n💡 **Tip**: Your dining spending is up 30% compared to last month. Consider setting a budget alert!`;
    },
  },
  {
    match: /save|saving|interest/i,
    response: () => {
      const savings = accounts.find((a) => a.type === 'Savings');
      return `Your **${savings.name}** account has ${formatCurrency(savings.balance)} earning **${savings.interestRate}% APY**.\n\nAt this rate, you'll earn approximately ${formatCurrency(savings.balance * savings.interestRate / 100)} in interest this year. Want me to set up automatic transfers to boost your savings?`;
    },
  },
  {
    match: /credit|card|limit|payment/i,
    response: () => {
      const cc = accounts.find((a) => a.type === 'Credit Card');
      return `Your **${cc.name}** card:\n\n• Current Balance: ${formatCurrency(cc.balance)}\n• Available Credit: ${formatCurrency(cc.availableCredit)}\n• Credit Limit: ${formatCurrency(cc.creditLimit)}\n• Minimum Payment: ${formatCurrency(cc.minimumPayment)} due ${cc.dueDate}\n\nYou're using ${((cc.balance / cc.creditLimit) * 100).toFixed(1)}% of your credit limit — that's great for your credit score!`;
    },
  },
  {
    match: /hello|hi|hey|help/i,
    response: () =>
      "Hello! 👋 I'm your AI banking assistant. I can help you with:\n\n• Check your **account balances**\n• View **recent transactions**\n• Get **spending insights**\n• Detect **unusual activity**\n• Help with **transfers**\n\nWhat would you like to know?",
  },
];

const moodWrappers = {
  happy: {
    prefix: "Great to see you in good spirits! 🎉 ",
    suffix: "\n\nBy the way, check out today's exclusive offers on your dashboard!",
  },
  sad: {
    prefix: "I'm here for you. ",
    suffix: "\n\nRemember, your finances are looking strong — you're doing better than you think!",
  },
  stressed: {
    prefix: "",
    suffix: "\n\nIf you'd prefer to speak with a real person, call 1-800-NOVA-BANK or tap Live Chat anytime.",
  },
  angry: {
    prefix: "",
    suffix: "\n\nNeed to escalate? Tap **Get Help Now** on your dashboard to reach a supervisor directly.",
  },
};

function applyMoodTone(response, mood) {
  if (!mood || mood === 'neutral') return response;

  const wrapper = moodWrappers[mood];
  if (!wrapper) return response;

  let result = response;

  if (mood === 'stressed') {
    result = result.replace(/\n\n/g, '\n').replace(/💡.*$/m, '');
  }

  return wrapper.prefix + result + wrapper.suffix;
}

export function getResponse(message, mood) {
  let baseResponse;
  for (const pattern of patterns) {
    if (pattern.match.test(message)) {
      baseResponse = pattern.response();
      break;
    }
  }

  if (!baseResponse) {
    baseResponse = "I'm not sure I understand that request. Try asking about your **balance**, **recent transactions**, **spending insights**, or **unusual activity**. You can also say **help** to see what I can do!";
  }

  return applyMoodTone(baseResponse, mood);
}

export const quickActions = [
  "What's my balance?",
  "Show recent transactions",
  "Any unusual activity?",
  "Spending insights",
  "Credit card info",
];
