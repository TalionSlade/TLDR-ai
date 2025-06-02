import { Message } from '../context/ChatContext';

interface MockResponse {
  text: string;
  references?: {
    section: string;
    page: number;
  }[];
}

// Function to generate realistic looking mock responses
export const generateMockResponse = async (
  question: string,
  documentName: string
): Promise<MockResponse> => {
  // Convert question to lowercase for easier matching
  const lowerQuestion = question.toLowerCase();
  
  // Define sections that might exist in a T&C document
  const sections = [
    'Privacy Policy',
    'Terms of Service',
    'Data Processing Agreement',
    'User Rights and Responsibilities',
    'Refund Policy',
    'Cancellation Terms',
    'Payment Processing',
    'Intellectual Property',
    'Liability Limitations',
    'Dispute Resolution',
    'User Content',
    'Account Termination'
  ];
  
  // Common phrases to make responses seem like they reference a document
  const referenceIntros = [
    `According to the ${documentName}`,
    `As stated in the document`,
    `Based on the terms outlined`,
    `The document specifically mentions that`,
    `In section ${Math.floor(Math.random() * 10) + 1}.${Math.floor(Math.random() * 10) + 1}`,
    `As noted on page ${Math.floor(Math.random() * 20) + 1}`,
    `The terms clearly state that`
  ];
  
  let response = '';
  let referencedSections: {section: string; page: number}[] = [];
  
  // Generate response based on the question topic
  if (lowerQuestion.includes('refund') || lowerQuestion.includes('money back')) {
    const section = 'Refund Policy';
    const page = Math.floor(Math.random() * 5) + 3;
    
    response = `${referenceIntros[Math.floor(Math.random() * referenceIntros.length)]}, refunds are available within 30 days of purchase if you're unsatisfied with the service. To request a refund, you need to contact customer support with your order number and reason for the refund. Processing typically takes 5-7 business days, and the refund will be issued to the original payment method.`;
    
    referencedSections.push({ section, page });
  } 
  else if (lowerQuestion.includes('cancel') || lowerQuestion.includes('termination')) {
    const section = 'Account Termination';
    const page = Math.floor(Math.random() * 5) + 6;
    
    response = `${referenceIntros[Math.floor(Math.random() * referenceIntros.length)]}, you can cancel your account at any time through your account settings page. Once canceled, you'll have access until the end of your current billing period. Any unused portion of your subscription will not be refunded. After cancellation, your data will be retained for 30 days before being permanently deleted.`;
    
    referencedSections.push({ section, page });
  }
  else if (lowerQuestion.includes('data') || lowerQuestion.includes('privacy') || lowerQuestion.includes('information')) {
    const section1 = 'Privacy Policy';
    const section2 = 'Data Processing Agreement';
    const page1 = Math.floor(Math.random() * 3) + 1;
    const page2 = Math.floor(Math.random() * 3) + 10;
    
    response = `${referenceIntros[Math.floor(Math.random() * referenceIntros.length)]}, the service collects several types of user data including: (1) Account information (name, email, password); (2) Usage data (features accessed, time spent); (3) Payment information; and (4) Device information (IP address, browser type, operating system). This data is primarily used to provide and improve services, personalize your experience, and for legal compliance purposes. Your data is stored securely and not shared with third parties except as outlined in the Privacy Policy.`;
    
    referencedSections.push({ section: section1, page: page1 });
    referencedSections.push({ section: section2, page: page2 });
  }
  else if (lowerQuestion.includes('payment') || lowerQuestion.includes('billing')) {
    const section = 'Payment Processing';
    const page = Math.floor(Math.random() * 3) + 7;
    
    response = `${referenceIntros[Math.floor(Math.random() * referenceIntros.length)]}, payment terms require upfront payment for the selected subscription period. Accepted payment methods include major credit cards, PayPal, and bank transfers in some regions. Recurring billing happens automatically at the start of each billing cycle. Failed payments may result in account suspension after a 7-day grace period. Price changes will be communicated at least 30 days in advance.`;
    
    referencedSections.push({ section, page });
  }
  else if (lowerQuestion.includes('dispute') || lowerQuestion.includes('conflict') || lowerQuestion.includes('arbitration')) {
    const section = 'Dispute Resolution';
    const page = Math.floor(Math.random() * 5) + 15;
    
    response = `${referenceIntros[Math.floor(Math.random() * referenceIntros.length)]}, disputes are handled through a multi-step process. First, you must submit a formal complaint to customer service. If the issue remains unresolved after 30 days, either party may initiate binding arbitration under the rules of the American Arbitration Association. The arbitration will take place in the jurisdiction specified in the terms (typically the company's headquarters location). Class action lawsuits are explicitly waived, and each party is responsible for their own legal fees.`;
    
    referencedSections.push({ section, page });
  }
  else if (lowerQuestion.includes('violate') || lowerQuestion.includes('break') || lowerQuestion.includes('breach')) {
    const section = 'User Rights and Responsibilities';
    const page = Math.floor(Math.random() * 5) + 5;
    
    response = `${referenceIntros[Math.floor(Math.random() * referenceIntros.length)]}, violations of the terms may result in a range of consequences depending on severity. For minor violations, you may receive a warning or temporary restriction of certain features. Serious or repeated violations can lead to immediate account suspension or permanent termination without refund. The company reserves the right to report illegal activities to relevant authorities. If your account is terminated for violations, you may be prohibited from creating new accounts.`;
    
    referencedSections.push({ section, page });
  }
  else if (lowerQuestion.includes('share') || lowerQuestion.includes('account sharing')) {
    const section = 'Terms of Service';
    const page = Math.floor(Math.random() * 3) + 2;
    
    response = `${referenceIntros[Math.floor(Math.random() * referenceIntros.length)]}, account sharing is explicitly prohibited unless you have purchased a family or team plan that specifically allows multiple users. Each account is licensed for use by a single individual only. Sharing your login credentials or allowing others to access your account may result in immediate termination of your account without refund. If you need multiple users to access the service, there are specific multi-user plans available for purchase.`;
    
    referencedSections.push({ section, page });
  }
  else if (lowerQuestion.includes('liability') || lowerQuestion.includes('damages')) {
    const section = 'Liability Limitations';
    const page = Math.floor(Math.random() * 4) + 12;
    
    response = `${referenceIntros[Math.floor(Math.random() * referenceIntros.length)]}, the company's liability is limited to the amount paid by you in the 12 months preceding any claim. The service is provided "as is" without warranties of any kind, either express or implied. The company specifically disclaims liability for any consequential, incidental, or special damages, including lost profits or data loss. Some jurisdictions do not allow the exclusion of certain warranties or limitations on liability, so these limitations may not fully apply to you.`;
    
    referencedSections.push({ section, page });
  }
  else {
    // Generic response for questions that don't match specific patterns
    const randomSection = sections[Math.floor(Math.random() * sections.length)];
    const page = Math.floor(Math.random() * 20) + 1;
    
    response = `I've analyzed the document and found some relevant information that might help. ${referenceIntros[Math.floor(Math.random() * referenceIntros.length)]}, this topic is addressed but without specific details that directly answer your question. You might want to ask a more specific question about a particular aspect of the terms and conditions, or I can help you locate the relevant section in the document.`;
    
    referencedSections.push({ section: randomSection, page });
  }
  
  return {
    text: response,
    references: referencedSections
  };
};