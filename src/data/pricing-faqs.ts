export type PricingFaq = {
  id: string;
  question: string;
  answer: string;
};

export const PRICING_FAQS: PricingFaq[] = [
  {
    id: "billing",
    question: "How are subscriptions billed?",
    answer: "Subscriptions are billed through Stripe direct for secure and reliable processing.",
  },
  {
    id: "switch",
    question: "Can I switch tiers anytime?",
    answer: "Yes. Upgrades and downgrades are prorated automatically.",
  },
  {
    id: "cancel",
    question: "What about cancellations?",
    answer: "You can cancel anytime with no penalty.",
  },
  {
    id: "fees",
    question: "Do you charge a per-booking fee?",
    answer: "No. Per-booking platform fees are not charged at launch.",
  },
  {
    id: "trial",
    question: "What's the free trial period?",
    answer: "Most tiers are planned for a 14-day free trial at launch.",
  },
  {
    id: "setup",
    question: "Are there any setup fees?",
    answer: "No setup fees.",
  },
  {
    id: "refund",
    question: "Can I get a refund?",
    answer: "Subscriptions include a 7-day money-back window.",
  },
  {
    id: "student-discount",
    question: "Do students get a discount?",
    answer: "Yes. Verified student pricing is planned through SheerID.",
  },
  {
    id: "schools-scale",
    question: "How do schools handle multiple students?",
    answer: "Schools can start free for up to 75 students and scale by tier as enrollment grows.",
  },
  {
    id: "payment-methods",
    question: "What payment methods are accepted?",
    answer: "Cards, Apple Pay, and Google Pay.",
  },
];
