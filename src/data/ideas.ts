export interface ProjectIdea {
  id: number;
  title: string;
  category: string;
  targetUsers: string;
  coreFeatures: string[];
  difficulty: number;
  monetization: string;
  description: string;
  shortlist?: {
    justification: string;
    buildTime: string;
    rank: number;
    mvp?: {
      core: string[];
      nonMvp: string[];
      userFlow: string;
    };
  };
}

export const ideas: ProjectIdea[] = [
  {
    id: 1,
    title: "AgroDirect B2B",
    category: "Agriculture",
    targetUsers: "Smallholder farmers and Urban Restaurants/Hotels",
    coreFeatures: ["Real-time inventory listing", "Direct chat/negotiation", "Logistics integration", "Escrow payments"],
    difficulty: 4,
    monetization: "Transaction commission (3-5%) + Premium placement for farmers.",
    description: "Connects rural farmers directly to bulk buyers in cities, cutting out multiple middlemen to increase farmer profit and reduce restaurant costs."
  },
  {
    id: 2,
    title: "NaijaRent Escrow",
    category: "Real Estate",
    targetUsers: "Tenants and Landlords",
    coreFeatures: ["Rent deposit holding", "Automated receipt generation", "Dispute resolution interface", "Installment payment tracker"],
    difficulty: 3,
    monetization: "Service fee per transaction + Interest on held deposits.",
    description: "A platform that holds rent in escrow until the tenant moves in and verifies the property condition, protecting both parties from fraud."
  },
  {
    id: 3,
    title: "ArtisanVerify",
    category: "Services",
    targetUsers: "Homeowners and Local Artisans (Plumbers, Electricians)",
    coreFeatures: ["Verified ID badges", "Customer reviews & ratings", "Job booking system", "Standardized pricing guide"],
    difficulty: 3,
    monetization: "Subscription for artisans + Lead generation fees.",
    description: "A trusted directory of verified local handymen with a focus on security and quality assurance in Nigerian neighborhoods."
  },
  {
    id: 4,
    title: "MarketPrice Tracker",
    category: "Data/Finance",
    targetUsers: "Households and Food Vendors",
    coreFeatures: ["Daily price updates for major markets", "Price trend analytics", "Cheapest market locator", "Crowdsourced price reporting"],
    difficulty: 2,
    monetization: "Ad revenue from food brands + Premium data API for retailers.",
    description: "Tracks the fluctuating prices of food items across major markets (like Mile 12, Bodija, Oil Mill) to help users save money.",
    shortlist: {
      rank: 2,
      buildTime: "2 Weeks",
      justification: "Extremely feasible for a solo developer. It demonstrates skills in data visualization (Recharts/D3) and crowdsourcing logic. In the current high-inflation economy, this has immediate 'viral' potential and high social impact.",
      mvp: {
        core: [
          "Market Selection (Mile 12, Bodija, etc.)",
          "Price Submission Form (Crowdsourced)",
          "Price Trend Charts (D3/Recharts)",
          "Cheapest Market Finder (Comparison)",
          "User Verification System (Trust Score)"
        ],
        nonMvp: [
          "Predictive AI for future prices",
          "Direct purchase integration",
          "Bulk buying group coordination",
          "Retailer inventory management"
        ],
        userFlow: "User visits app -> Selects a food item (e.g., 'Basket of Tomatoes') -> Views current prices across 5 markets -> Sees which market is cheapest today -> Optionally submits a new price they just saw at their local market."
      }
    }
  },
  {
    id: 5,
    title: "FuelFinder NG",
    category: "Utility",
    targetUsers: "Motorists and Logistics companies",
    coreFeatures: ["Real-time fuel availability map", "Price per liter reporting", "Queue length estimates", "User-verified status updates"],
    difficulty: 3,
    monetization: "In-app ads + Premium alerts for logistics fleets.",
    description: "Crowdsourced app to find petrol stations with fuel and short queues during periods of scarcity."
  },
  {
    id: 6,
    title: "AjoDigital (Esusu)",
    category: "Fintech",
    targetUsers: "Informal savings groups and Market traders",
    coreFeatures: ["Automated contribution tracking", "Payout rotation scheduler", "SMS notifications", "Default risk scoring"],
    difficulty: 4,
    monetization: "Small management fee per cycle + Integration with micro-insurance.",
    description: "Digitizes the traditional 'Ajo' or 'Esusu' thrift savings system, providing transparency and record-keeping for community groups.",
    shortlist: {
      rank: 1,
      buildTime: "4 Weeks",
      justification: "Fintech is the strongest sector in Nigeria. Building this shows you understand complex ledger logic, security, and cultural financial nuances. It's a gold-standard portfolio piece for landing roles at top Nigerian startups like Paystack or Moniepoint.",
      mvp: {
        core: [
          "Group Creation (Amount & Frequency)",
          "Automated Payout Rotation Algorithm",
          "Contribution Status Dashboard",
          "Manual Payment Verification (Admin)",
          "SMS/Push Payment Reminders"
        ],
        nonMvp: [
          "Direct Bank API (Automated Debits)",
          "Credit Scoring (Consistency-based)",
          "Micro-insurance Integration",
          "Legal Escrow/Dispute Resolution"
        ],
        userFlow: "Organizer creates a group -> Invites members via link -> Members join and see their assigned payout dates -> Members upload proof of payment weekly -> Admin verifies and system notifies the week's winner."
      }
    }
  },
  {
    id: 7,
    title: "Waste2Cash",
    category: "Environment",
    targetUsers: "Urban households and Recycling plants",
    coreFeatures: ["On-demand waste pickup request", "Weight-based reward points", "Points-to-Airtime conversion", "Educational recycling tips"],
    difficulty: 3,
    monetization: "Reselling collected recyclables to plants + Corporate sustainability partnerships.",
    description: "Encourages proper waste sorting by rewarding users with digital points redeemable for airtime or data when they recycle."
  },
  {
    id: 8,
    title: "NaijaLegal SME",
    category: "LegalTech",
    targetUsers: "Small Business Owners and Startups",
    coreFeatures: ["Automated CAC-compliant documents", "Employment contract templates", "NDA generator", "Legal consultation booking"],
    difficulty: 3,
    monetization: "Pay-per-document + Monthly legal support subscription.",
    description: "Simplifies legal compliance for small businesses with automated document generation tailored to Nigerian laws."
  },
  {
    id: 9,
    title: "EduScholar Portal",
    category: "Education",
    targetUsers: "Nigerian Students (Undergrad & Postgrad)",
    coreFeatures: ["Local scholarship database", "Eligibility auto-checker", "Application deadline alerts", "Essay review community"],
    difficulty: 2,
    monetization: "Premium application assistance + Ad revenue from private universities.",
    description: "A centralized hub for state, federal, and private scholarships available specifically to Nigerian students."
  },
  {
    id: 10,
    title: "LekkiTrafficAI",
    category: "Transport",
    targetUsers: "Commuters in Lagos/Abuja",
    coreFeatures: ["AI-based traffic prediction", "Alternative route suggestions", "Public transport (Danfo/BRT) tracker", "Incident reporting"],
    difficulty: 5,
    monetization: "Premium route optimization for delivery companies + Local business ads.",
    description: "Uses historical data and real-time user input to predict traffic bottlenecks and suggest the fastest routes in congested cities."
  },
  {
    id: 11,
    title: "HealthTrack NG",
    category: "Healthcare",
    targetUsers: "New Parents and Rural Health Workers",
    coreFeatures: ["Vaccination schedule reminders", "USSD integration for offline access", "Growth milestone tracking", "Nearby clinic locator"],
    difficulty: 4,
    monetization: "Government health grants + Sponsored child-care products.",
    description: "A hybrid web/USSD platform to ensure children in both urban and rural areas don't miss critical vaccinations."
  },
  {
    id: 12,
    title: "SolarPay Microgrid",
    category: "Energy",
    targetUsers: "Community solar grid users",
    coreFeatures: ["Pay-as-you-go energy credits", "Real-time usage monitoring", "Low balance alerts", "Remote shut-off/activation"],
    difficulty: 5,
    monetization: "Transaction fees on energy purchases + Hardware maintenance contracts.",
    description: "A payment and monitoring system for community-shared solar power, allowing users to buy energy in small increments."
  },
  {
    id: 13,
    title: "LingoLearn NG",
    category: "Education",
    targetUsers: "Expats, Tourists, and Nigerians in Diaspora",
    coreFeatures: ["Interactive Yoruba/Igbo/Hausa lessons", "Pidgin English slang dictionary", "Voice recognition for pronunciation", "Cultural etiquette tips"],
    difficulty: 3,
    monetization: "Freemium model + Corporate training packages for expats.",
    description: "An immersive app for learning major Nigerian languages with a focus on conversational skills and cultural context."
  },
  {
    id: 14,
    title: "QuickVet",
    category: "Agriculture/Health",
    targetUsers: "Livestock farmers and Pet owners",
    coreFeatures: ["Tele-vet consultations", "Emergency vet dispatch", "Drug authenticity checker", "Farm health records"],
    difficulty: 4,
    monetization: "Consultation fees + Commission on veterinary drugs/supplies.",
    description: "Connects livestock farmers in peri-urban areas to qualified veterinarians for quick consultations and emergency visits."
  },
  {
    id: 15,
    title: "NaijaEventPass",
    category: "Events",
    targetUsers: "Event Organizers and Attendees",
    coreFeatures: ["Offline-first QR ticketing", "USSD ticket purchase", "Real-time attendee analytics", "Vendor management system"],
    difficulty: 3,
    monetization: "Ticketing fee (per ticket sold) + Premium event marketing.",
    description: "A ticketing platform designed for the Nigerian environment, working reliably even with poor internet connectivity."
  },
  {
    id: 16,
    title: "InventoryManager for Chemists",
    category: "SaaS",
    targetUsers: "Small Pharmacy (Chemist) Owners",
    coreFeatures: ["Expiry date alerts", "NAFDAC number verification", "Sales reporting", "Low stock notifications"],
    difficulty: 3,
    monetization: "Monthly SaaS subscription.",
    description: "Specialized inventory management for local pharmacies to prevent the sale of expired drugs and track stock levels."
  },
  {
    id: 17,
    title: "SkillSwap NG",
    category: "Community",
    targetUsers: "Freelancers and Students",
    coreFeatures: ["Skill matching algorithm", "Trust-based rating system", "Virtual classroom integration", "Project collaboration tools"],
    difficulty: 3,
    monetization: "Premium matching + Ad revenue.",
    description: "A cashless platform where Nigerians can trade skills (e.g., 'I'll teach you Graphic Design if you teach me Tailoring')."
  },
  {
    id: 18,
    title: "PropertyTax Helper",
    category: "GovTech",
    targetUsers: "Property Owners",
    coreFeatures: ["Tax liability calculator", "Online payment integration", "Document storage", "Deadline reminders"],
    difficulty: 4,
    monetization: "Service fee per payment + Premium advisory services.",
    description: "Helps property owners calculate and pay their Land Use Charge and other property-related taxes easily."
  },
  {
    id: 19,
    title: "NaijaGrantFinder",
    category: "Non-Profit",
    targetUsers: "Local NGOs and Social Enterprises",
    coreFeatures: ["Curated grant database", "Proposal writing templates", "Grant tracking dashboard", "Partnership matching"],
    difficulty: 2,
    monetization: "Subscription for advanced filters + Proposal review services.",
    description: "Specifically helps Nigerian non-profits find and apply for international and local funding opportunities."
  },
  {
    id: 20,
    title: "LocalLogistics Aggregator",
    category: "Logistics",
    targetUsers: "Instagram/WhatsApp Vendors",
    coreFeatures: ["Multi-provider price comparison", "Unified tracking dashboard", "Automated waybill generation", "Bulk delivery discounts"],
    difficulty: 4,
    monetization: "Small markup on delivery fees + Subscription for high-volume vendors.",
    description: "Aggregates various 'last-mile' delivery services (dispatch riders) into one app for small online vendors.",
    shortlist: {
      rank: 3,
      buildTime: "3 Weeks",
      justification: "Solves a massive, visible pain point for the thousands of 'social commerce' vendors in Nigeria. It involves complex state management and API integration, making it a highly impressive project for logistics or e-commerce companies.",
      mvp: {
        core: [
          "Price Comparison (GIGL, Gokada, etc.)",
          "Unified Booking Interface",
          "Real-time Tracking Dashboard",
          "Automated Waybill Generator",
          "Vendor Wallet System"
        ],
        nonMvp: [
          "AI-based route optimization",
          "Insurance for lost items",
          "International shipping integration",
          "Inventory storage coordination"
        ],
        userFlow: "Vendor enters pickup and delivery addresses -> App fetches prices from 3-5 providers -> Vendor selects cheapest/fastest -> App generates waybill and notifies rider -> Vendor tracks delivery in real-time."
      }
    }
  }
];
