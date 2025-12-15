import { Chapter, SectionType } from './types';

export const MOCK_CHAPTER: Chapter = {
  id: 0, // Special ID for Mock Test
  title: "संपूर्ण पाठ्यक्रम मॉक टेस्ट (Full Mock Test)",
  section: SectionType.COMMON, // Placeholder
  description: "सभी 21 अध्यायों से 30 मिश्रित प्रश्नों के साथ वास्तविक परीक्षा का अभ्यास करें।"
};

export const CHAPTERS: Chapter[] = [
  // Section 1
  { id: 1, title: "बीमा का परिचय", section: SectionType.COMMON, description: "जोखिम और बीमा तंत्र की मूल बातें।" },
  { id: 2, title: "ग्राहक सेवा", section: SectionType.COMMON, description: "बीमा उद्योग में सेवा का महत्व।" },
  { id: 3, title: "शिकायत निवारण तंत्र", section: SectionType.COMMON, description: "उपभोक्ता संरक्षण और लोकपाल योजनाएं।" },
  { id: 4, title: "बीमा एजेंटों के नियामक पहलू", section: SectionType.COMMON, description: "IRDAI नियम और आचार संहिता।" },
  { id: 5, title: "बीमा अनुबंध के कानूनी सिद्धांत", section: SectionType.COMMON, description: "परम सद्भाव, बीमा योग्य हित, आदि।" },
  
  // Section 2
  { id: 6, title: "जीवन बीमा में क्या शामिल है", section: SectionType.LIFE, description: "मानव जीवन मूल्य और प्रीमियम की अवधारणा।" },
  { id: 7, title: "वित्तीय योजना", section: SectionType.LIFE, description: "वित्तीय लक्ष्यों में बीमा की भूमिका।" },
  { id: 8, title: "जीवन बीमा उत्पाद – I", section: SectionType.LIFE, description: "पारंपरिक उत्पाद: टर्म, बंदोबस्ती (Endowment), आजीवन (Whole Life)।" },
  { id: 9, title: "जीवन बीमा उत्पाद – II", section: SectionType.LIFE, description: "ULIP और अन्य आधुनिक उत्पाद।" },
  { id: 10, title: "जीवन बीमा के अनुप्रयोग", section: SectionType.LIFE, description: "MWP अधिनियम, कीमैन बीमा।" },
  { id: 11, title: "जीवन बीमा में मूल्य निर्धारण और मूल्यांकन", section: SectionType.LIFE, description: "प्रीमियम गणना और अधिशेष (Surplus)।" },
  { id: 12, title: "दस्तावेज़ीकरण – प्रस्ताव चरण", section: SectionType.LIFE, description: "प्रस्ताव फॉर्म और केवाईसी (KYC)।" },
  { id: 13, title: "दस्तावेज़ीकरण – पॉलिसी शर्तें - I", section: SectionType.LIFE, description: "प्रथम प्रीमियम रसीद और पॉलिसी दस्तावेज़।" },
  { id: 14, title: "दस्तावेज़ीकरण – पॉलिसी शर्तें - II", section: SectionType.LIFE, description: "अनुग्रह अवधि, व्यपगमन (Lapse) और पुनरुद्धार (Revival)।" },
  { id: 15, title: "हामीदारी (Underwriting)", section: SectionType.LIFE, description: "जोखिम मूल्यांकन और वर्गीकरण।" },
  { id: 16, title: "जीवन बीमा पॉलिसी के तहत भुगतान", section: SectionType.LIFE, description: "दावे: परिपक्वता, मृत्यु और समर्पण।" },

  // Section 3
  { id: 17, title: "स्वास्थ्य बीमा का परिचय", section: SectionType.HEALTH, description: "स्वास्थ्य सेवा प्रणाली और बीमा का विकास।" },
  { id: 18, title: "बीमा दस्तावेज़ीकरण", section: SectionType.HEALTH, description: "स्वास्थ्य प्रस्तावों के लिए विशिष्टताएँ।" },
  { id: 19, title: "स्वास्थ्य बीमा उत्पाद", section: SectionType.HEALTH, description: "मेडिक्लेम, गंभीर बीमारी, आदि।" },
  { id: 20, title: "स्वास्थ्य बीमा हामीदारी", section: SectionType.HEALTH, description: "रग्णता जोखिम और पहले से मौजूद बीमारियां।" },
  { id: 21, title: "स्वास्थ्य बीमा दावे", section: SectionType.HEALTH, description: "कैशलेस और प्रतिपूर्ति प्रक्रियाएं।" },
];
