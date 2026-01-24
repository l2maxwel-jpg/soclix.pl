// Mock data for Soclix clone

export const features = [
  {
    id: 1,
    icon: "Zap",
    title: "AI-Powered Extraction",
    description: "Our AI automatically identifies and extracts customer orders from live stream comments."
  },
  {
    id: 2,
    icon: "Clock",
    title: "Save Hours Daily",
    description: "Stop manually scrolling through thousands of comments. Let automation do the work."
  },
  {
    id: 3,
    icon: "Monitor",
    title: "Real-Time Processing",
    description: "Comments are processed as they come in, giving you instant order visibility."
  },
  {
    id: 4,
    icon: "BarChart3",
    title: "Smart Analytics",
    description: "Track your sales performance with detailed insights and reporting."
  }
];

export const steps = [
  {
    id: 1,
    number: "01",
    title: "Paste URL",
    description: "Copy your live stream video URL and paste it into Soclix"
  },
  {
    id: 2,
    number: "02",
    title: "AI Extracts",
    description: "Our AI scans all comments and identifies customer orders"
  },
  {
    id: 3,
    number: "03",
    title: "Manage & Export",
    description: "Review orders, manage customers, and export to Excel"
  }
];

export const pricingPlans = [
  {
    id: 1,
    name: "Starter",
    price: "0",
    currency: "zł",
    period: "/miesiąc",
    description: "Idealny do rozpoczęcia",
    features: [
      "5 streamów miesięcznie",
      "Do 500 komentarzy/stream",
      "Eksport do Excel",
      "Email support"
    ],
    buttonText: "Rozpocznij za darmo",
    popular: false
  },
  {
    id: 2,
    name: "Pro",
    price: "99",
    currency: "zł",
    period: "/miesiąc",
    description: "Dla profesjonalnych sprzedawców",
    features: [
      "Nieograniczone streamy",
      "Nieograniczone komentarze",
      "Zaawansowana analityka",
      "Priorytetowy support",
      "API dostęp",
      "Automatyczne powiadomienia"
    ],
    buttonText: "Wybierz Pro",
    popular: true
  },
  {
    id: 3,
    name: "Enterprise",
    price: "299",
    currency: "zł",
    period: "/miesiąc",
    description: "Dla dużych zespołów",
    features: [
      "Wszystko z Pro",
      "Dedykowany manager",
      "Custom integracje",
      "SLA gwarancja",
      "Szkolenia zespołu",
      "White-label opcja"
    ],
    buttonText: "Skontaktuj się",
    popular: false
  }
];

export const mockStreams = [
  {
    id: 1,
    title: "Wyprzedaż zimowa - Ubrania",
    url: "https://www.facebook.com/123456789/videos/987654321",
    platform: "facebook",
    date: "2025-01-20",
    status: "completed",
    commentsCount: 1247,
    ordersCount: 89,
    revenue: 4520
  },
  {
    id: 2,
    title: "Live shopping - Kosmetyki",
    url: "https://www.facebook.com/123456789/videos/111222333",
    platform: "facebook",
    date: "2025-01-18",
    status: "completed",
    commentsCount: 856,
    ordersCount: 67,
    revenue: 3280
  },
  {
    id: 3,
    title: "Nowości - Biżuteria handmade",
    url: "https://www.facebook.com/123456789/videos/444555666",
    platform: "facebook",
    date: "2025-01-15",
    status: "completed",
    commentsCount: 2103,
    ordersCount: 156,
    revenue: 8940
  },
  {
    id: 4,
    title: "Flash sale - Elektronika",
    url: "https://www.facebook.com/123456789/videos/777888999",
    platform: "facebook",
    date: "2025-01-22",
    status: "processing",
    commentsCount: 432,
    ordersCount: 28,
    revenue: 2100
  }
];

export const mockOrders = [
  {
    id: 1,
    streamId: 1,
    customerName: "Anna Kowalska",
    comment: "Biorę sukienkę czerwoną M i bluzę szarą L",
    products: ["Sukienka czerwona M", "Bluza szara L"],
    quantity: 2,
    status: "pending",
    timestamp: "2025-01-20 14:32"
  },
  {
    id: 2,
    streamId: 1,
    customerName: "Maria Nowak",
    comment: "Poproszę spodnie czarne 38 i kurtka zimowa M",
    products: ["Spodnie czarne 38", "Kurtka zimowa M"],
    quantity: 2,
    status: "confirmed",
    timestamp: "2025-01-20 14:35"
  },
  {
    id: 3,
    streamId: 1,
    customerName: "Ewa Wiśniewska",
    comment: "Biorę! Sweter beżowy S",
    products: ["Sweter beżowy S"],
    quantity: 1,
    status: "shipped",
    timestamp: "2025-01-20 14:38"
  },
  {
    id: 4,
    streamId: 2,
    customerName: "Katarzyna Zielińska",
    comment: "Krem nawilżający x2 i serum witamina C",
    products: ["Krem nawilżający", "Krem nawilżający", "Serum witamina C"],
    quantity: 3,
    status: "pending",
    timestamp: "2025-01-18 18:12"
  },
  {
    id: 5,
    streamId: 3,
    customerName: "Joanna Dąbrowska",
    comment: "Poproszę kolczyki złote i bransoletka perły",
    products: ["Kolczyki złote", "Bransoletka perły"],
    quantity: 2,
    status: "confirmed",
    timestamp: "2025-01-15 20:45"
  }
];

export const dashboardStats = {
  totalStreams: 47,
  totalOrders: 1893,
  totalRevenue: 89450,
  averageOrderValue: 47.25,
  conversionRate: 7.8,
  thisMonth: {
    streams: 12,
    orders: 456,
    revenue: 21340
  }
};
