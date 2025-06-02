// This service provides mock RAG (Retrieval Augmented Generation) responses
// to simulate AI answering questions about the uploaded Terms & Conditions

interface MockResponse {
  content: string;
  references?: {
    page: number;
    section: string;
    text: string;
  }[];
}

// Sample T&C sections to reference in responses
const mockSections = {
  refundPolicy: {
    section: "3.2 Refund Policy",
    text: "Customers may request a refund within 14 days of purchase if the service does not meet expectations. Refunds are processed within 7-10 business days to the original payment method.",
    page: 2
  },
  cancellation: {
    section: "4.1 Account Cancellation",
    text: "Users may cancel their account at any time through the Account Settings page. Upon cancellation, access to premium features will continue until the end of the billing cycle.",
    page: 3
  },
  dataCollection: {
    section: "6.3 Data Collection",
    text: "We collect personal information including but not limited to: name, email address, billing information, IP address, and usage data. This information is used to provide and improve our services.",
    page: 5
  },
  payment: {
    section: "5.1 Payment Terms",
    text: "Payment is due at the time of subscription. For monthly plans, your account will be charged on the same day each month. For annual plans, your account will be charged once per year on the anniversary of your subscription date.",
    page: 4
  },
  disputes: {
    section: "8.2 Dispute Resolution",
    text: "Any disputes arising from or relating to these Terms shall first be attempted to be resolved through informal negotiation. If that fails, disputes will be resolved through binding arbitration in accordance with the American Arbitration Association rules.",
    page: 7
  },
  liability: {
    section: "7.1 Limitation of Liability",
    text: "Our liability is limited to the amount paid by you for the service in the 12 months preceding the claim. We are not liable for indirect, incidental, special, or consequential damages.",
    page: 6
  },
  intellectualProperty: {
    section: "2.3 Intellectual Property",
    text: "All content, features, and functionality of our service are owned by us and are protected by international copyright, trademark, and other intellectual property laws.",
    page: 1
  }
};

// Keywords to match questions to responses
const keywordMap: Record<string, string[]> = {
  refund: ['refund', 'money back', 'return'],
  cancel: ['cancel', 'terminate', 'end subscription', 'close account'],
  data: ['data', 'information', 'privacy', 'collect', 'personal information'],
  payment: ['payment', 'billing', 'charge', 'subscription', 'pay'],
  disputes: ['dispute', 'conflict', 'disagreement', 'resolution', 'arbitration', 'legal'],
  liability: ['liability', 'responsible', 'damages', 'claim'],
  intellectualProperty: ['intellectual', 'copyright', 'trademark', 'ownership']
};

// Helper function to determine which topic a question is about
function identifyTopic(question: string): string {
  question = question.toLowerCase();
  
  for (const [topic, keywords] of Object.entries(keywordMap)) {
    if (keywords.some(keyword => question.includes(keyword))) {
      return topic;
    }
  }
  
  return 'general';
}

// Generate responses based on the identified topic
export function generateMockResponse(question: string): MockResponse {
  const topic = identifyTopic(question);
  
  switch (topic) {
    case 'refund':
      return {
        content: `According to Section 3.2 of the Terms & Conditions document, you can request a refund within 14 days of purchase if the service doesn't meet your expectations. Refunds are processed within 7-10 business days to your original payment method. Is there anything specific about the refund process you'd like to know?`,
        references: [{
          page: mockSections.refundPolicy.page,
          section: mockSections.refundPolicy.section,
          text: mockSections.refundPolicy.text
        }]
      };
      
    case 'cancel':
      return {
        content: `Based on Section 4.1 of the document, you can cancel your account at any time through the Account Settings page. After cancellation, you'll still have access to premium features until the end of your current billing cycle. Would you like instructions on how to navigate to your account settings?`,
        references: [{
          page: mockSections.cancellation.page,
          section: mockSections.cancellation.section,
          text: mockSections.cancellation.text
        }]
      };
      
    case 'data':
      return {
        content: `According to Section 6.3 on page 5, the service collects personal information including your name, email address, billing information, IP address, and usage data. This information is used to provide and improve the services. Is there a specific aspect of data collection you're concerned about?`,
        references: [{
          page: mockSections.dataCollection.page,
          section: mockSections.dataCollection.section,
          text: mockSections.dataCollection.text
        }]
      };
      
    case 'payment':
      return {
        content: `As stated in Section 5.1 of the Terms & Conditions, payment is due at subscription time. For monthly plans, your account is charged on the same day each month. For annual plans, charging occurs once per year on your subscription anniversary. Would you like to know more about payment methods or billing disputes?`,
        references: [{
          page: mockSections.payment.page,
          section: mockSections.payment.section,
          text: mockSections.payment.text
        }]
      };
      
    case 'disputes':
      return {
        content: `Section 8.2 on page 7 outlines that any disputes must first go through informal negotiation. If that doesn't resolve the issue, disputes will be handled through binding arbitration following American Arbitration Association rules. This means legal disputes typically won't go to court but will be resolved through this arbitration process instead.`,
        references: [{
          page: mockSections.disputes.page,
          section: mockSections.disputes.section,
          text: mockSections.disputes.text
        }]
      };
      
    case 'liability':
      return {
        content: `According to Section 7.1, the company's liability is limited to the amount you paid for the service in the 12 months before making a claim. They are not liable for indirect, incidental, special, or consequential damages. In simple terms, this means they've capped their financial responsibility if something goes wrong.`,
        references: [{
          page: mockSections.liability.page,
          section: mockSections.liability.section,
          text: mockSections.liability.text
        }]
      };
      
    case 'intellectualProperty':
      return {
        content: `Section 2.3 on page 1 states that all content, features, and functionality of the service are owned by the company and protected by international copyright, trademark, and other intellectual property laws. This means you can't reproduce or use their materials without permission.`,
        references: [{
          page: mockSections.intellectualProperty.page,
          section: mockSections.intellectualProperty.section,
          text: mockSections.intellectualProperty.text
        }]
      };
      
    default:
      return {
        content: `I don't see specific information about that in the Terms & Conditions document. Would you like me to check for related topics, or could you rephrase your question? You might want to ask about refund policies, account cancellation, data collection, payment terms, dispute resolution, or liability limitations.`
      };
  }
}

// Common FAQs about Terms & Conditions
export const commonFAQs = [
  {
    id: 1,
    question: "What is the refund policy?",
    category: "Billing"
  },
  {
    id: 2,
    question: "How can I cancel my account?",
    category: "Account"
  },
  {
    id: 3,
    question: "What data do you collect?",
    category: "Privacy"
  },
  {
    id: 4,
    question: "What are the payment terms?",
    category: "Billing"
  },
  {
    id: 5,
    question: "How do you handle disputes?",
    category: "Legal"
  },
  {
    id: 6,
    question: "What are the limitations of liability?",
    category: "Legal"
  },
  {
    id: 7,
    question: "Who owns the intellectual property?",
    category: "Legal"
  }
];