import { useEffect } from 'react';

// FAQ data for schema markup - extracted from blog content
export const blogFAQs = {
  'understanding-chronic-pain-science-based-guide': [
    {
      question: "What is chronic pain?",
      answer: "Chronic pain is pain that persists for more than 3-6 months, beyond normal tissue healing time. The International Association for the Study of Pain (IASP) recognizes it as a disease in its own right, involving neuroplastic changes in the nervous system, not just tissue damage."
    },
    {
      question: "Why won't my chronic pain go away?",
      answer: "Chronic pain persists because your nervous system has become sensitized through a process called central sensitization. Your brain creates pain as protection even after tissues have healed. This is why pain can continue without ongoing tissue damage."
    },
    {
      question: "Is chronic pain real or psychological?",
      answer: "Chronic pain is 100% real. Modern brain imaging shows measurable changes in the nervous system. Understanding the psychological components doesn't make pain less real—it explains how pain works and opens doors to effective treatment."
    },
    {
      question: "What is the biopsychosocial model of pain?",
      answer: "The biopsychosocial model recognizes that chronic pain is influenced by three interconnected factors: biological (tissue health, genetics, inflammation), psychological (thoughts, emotions, stress), and social (relationships, work, support). Treatment addressing all three areas is most effective."
    },
    {
      question: "What is central sensitization?",
      answer: "Central sensitization is when your nervous system becomes hypersensitive to stimuli—like a smoke alarm that goes off at burnt toast. It explains why normal touch can feel painful (allodynia), mild stimuli cause exaggerated pain (hyperalgesia), and pain spreads beyond original injury sites."
    }
  ],
  'pain-neuroscience-education-brain-processes-pain': [
    {
      question: "Does pain equal damage?",
      answer: "No. Pain is an output created by your brain based on perceived threat, not a direct measure of tissue damage. Paper cuts hurt intensely but cause minimal damage, while soldiers sometimes feel no pain from serious battle wounds. Pain is protection, not a damage report."
    },
    {
      question: "How does the brain create pain?",
      answer: "Your brain evaluates danger signals (nociception) against past experiences, emotions, beliefs, and context to decide whether pain is necessary for protection. If your brain concludes you need protection, it creates pain. If it determines you're safe, pain may not occur even with tissue input."
    },
    {
      question: "What are DIMs and SIMs in pain management?",
      answer: "DIMs (Danger In Me) are things that increase pain: fear, anxiety, negative beliefs, poor sleep, stress. SIMs (Safety In Me) are things that decrease pain: understanding pain neuroscience, positive coping, social support, good sleep. The goal is to increase SIMs and decrease DIMs."
    },
    {
      question: "Can learning about pain actually reduce pain?",
      answer: "Yes! Pain Neuroscience Education (PNE) has been shown in multiple studies to reduce pain intensity, improve function, decrease fear of movement, and reduce anxiety. Understanding that pain doesn't mean damage helps your brain recalibrate its threat assessment."
    },
    {
      question: "Do abnormal MRI results mean I'll have pain?",
      answer: "Not necessarily. 80% of people WITHOUT back pain have disc bulges on MRI. 60% of pain-free people have disc degeneration. Imaging findings often don't correlate well with pain levels. Many people with 'bad' scans have no pain, and many with 'normal' scans have severe pain."
    }
  ],
  'sleep-chronic-pain-breaking-vicious-cycle': [
    {
      question: "Why does chronic pain get worse when I don't sleep?",
      answer: "Sleep and pain form a bidirectional relationship. Poor sleep increases pain sensitivity by 15-25%, impairs your body's natural pain-relief systems, increases inflammation, and affects the same brain regions involved in pain processing. 67-88% of chronic pain patients report sleep disturbances."
    },
    {
      question: "What is CBT-I for chronic pain?",
      answer: "CBT-I (Cognitive Behavioral Therapy for Insomnia) is the gold standard treatment for sleep problems, recommended even ahead of medication. It includes sleep restriction therapy, stimulus control, cognitive restructuring, and sleep hygiene education. It works even when chronic pain is present."
    },
    {
      question: "What is the best sleeping position for chronic pain?",
      answer: "For back pain: pillow under knees when on back, between knees when on side. For hip pain: soft mattress topper, pillow between knees. For neck pain: contoured pillow maintaining neutral alignment. For shoulder pain: avoid sleeping on painful side, use pillow support."
    },
    {
      question: "What should I avoid before bed with chronic pain?",
      answer: "Avoid caffeine 6+ hours before bed, alcohol (fragments sleep), screens 1-2 hours before bed (blue light suppresses melatonin), large meals, intense exercise within 3 hours, and working or problem-solving in bed."
    },
    {
      question: "What should I do when pain wakes me up at night?",
      answer: "Don't panic or clock-watch. Stay relaxed and use relaxation techniques like deep breathing (4 counts in, 6 counts out) or progressive muscle relaxation. If awake more than 20 minutes, go to another room for quiet activity and return only when sleepy."
    }
  ],
  'mindfulness-pain-management-evidence-based-approaches': [
    {
      question: "Does mindfulness actually work for chronic pain?",
      answer: "Yes, with strong research support. A 2017 meta-analysis found mindfulness produces moderate effects on pain intensity, large effects on depression and quality of life, with benefits lasting 6+ months. It changes how your brain processes pain, reducing suffering even if sensation remains."
    },
    {
      question: "How does mindfulness change pain in the brain?",
      answer: "Brain imaging shows mindfulness reduces activation in pain-processing areas (somatosensory cortex, thalamus) while increasing activity in regulatory areas (prefrontal cortex). It helps separate the sensory component of pain from the emotional suffering."
    },
    {
      question: "What is the RAIN technique for pain?",
      answer: "RAIN is a four-step mindfulness process: Recognize (acknowledge what's happening), Allow (let it be without fighting), Investigate (bring curiosity to the sensation), Non-identification (remember you are not your pain). It's particularly useful during pain flares."
    },
    {
      question: "How do I start mindfulness meditation with chronic pain?",
      answer: "Start with 5 minutes of breath awareness daily. Sit or lie comfortably, focus on breath sensations, and when your mind wanders, gently return attention to breath. Use guided meditations from apps like Headspace, Calm, or Insight Timer. Consistency beats duration."
    },
    {
      question: "What if mindfulness makes me more aware of my pain?",
      answer: "This can happen initially. Start with shorter practices, focus on breath or neutral body areas first, and use guided meditations designed for pain. The goal isn't to eliminate awareness of pain but to change your relationship with it over time."
    }
  ],
  'building-pain-management-support-team': [
    {
      question: "Why do I need a team for chronic pain management?",
      answer: "Chronic pain affects multiple life domains—physical, emotional, work, relationships, sleep. No single provider can optimally address all these. Research shows multidisciplinary care produces better outcomes, higher return-to-work rates, and more sustained long-term benefits than single-provider treatment."
    },
    {
      question: "Who should be on my chronic pain management team?",
      answer: "Core team typically includes: Primary Care Physician (coordinates overall care), Pain Specialist (advanced diagnosis and procedures), Physical Therapist (movement and exercise), and Pain Psychologist (CBT, coping skills). Extended team may include OT, pharmacist, nutritionist, and complementary practitioners."
    },
    {
      question: "How do I find a good pain specialist?",
      answer: "Look for providers with chronic pain experience who believe in the biopsychosocial approach, communicate well, and coordinate with other providers. Red flags: dismissing your pain as 'not real', unwilling to explain treatments, over-reliance on single approaches, poor listening."
    },
    {
      question: "How do I coordinate care between multiple pain providers?",
      answer: "Designate a coordinator (often PCP or yourself), create a care summary document with diagnoses/providers/medications/goals, facilitate communication between providers through releases and patient portals, and address conflicting recommendations directly."
    },
    {
      question: "How do I advocate for myself with chronic pain?",
      answer: "Be prepared with written concerns and questions, describe pain specifically, ask questions until you understand, set treatment goals, and follow up proactively. Remember: you are the expert on your lived experience. You can request second opinions and change providers if needed."
    }
  ]
};

// Generate Article Schema
export const generateArticleSchema = (post, siteUrl = 'https://recalibratepain.com') => {
  return {
    "@context": "https://schema.org",
    "@type": "Article",
    "headline": post.title,
    "description": post.metaDescription || post.excerpt,
    "image": `${siteUrl}/recalibrate-logo-optimized.png`,
    "author": {
      "@type": "Organization",
      "name": "Recalibrate Health Team",
      "url": siteUrl
    },
    "publisher": {
      "@type": "Organization",
      "name": "Recalibrate",
      "logo": {
        "@type": "ImageObject",
        "url": `${siteUrl}/recalibrate-logo-optimized.png`
      }
    },
    "datePublished": "2025-12-15",
    "dateModified": "2026-01-24",
    "mainEntityOfPage": {
      "@type": "WebPage",
      "@id": `${siteUrl}/blog/${post.slug}`
    },
    "keywords": post.keywords?.join(', ') || post.tags?.join(', '),
    "articleSection": post.category,
    "wordCount": post.readTime?.includes('12') ? 3000 : post.readTime?.includes('11') ? 2750 : 2500
  };
};

// Generate FAQ Schema
export const generateFAQSchema = (slug) => {
  const faqs = blogFAQs[slug];
  if (!faqs) return null;
  
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": faqs.map(faq => ({
      "@type": "Question",
      "name": faq.question,
      "acceptedAnswer": {
        "@type": "Answer",
        "text": faq.answer
      }
    }))
  };
};

// Generate Breadcrumb Schema
export const generateBreadcrumbSchema = (post, siteUrl = 'https://recalibratepain.com') => {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": [
      {
        "@type": "ListItem",
        "position": 1,
        "name": "Home",
        "item": siteUrl
      },
      {
        "@type": "ListItem",
        "position": 2,
        "name": "Blog",
        "item": `${siteUrl}/blog`
      },
      {
        "@type": "ListItem",
        "position": 3,
        "name": post.title,
        "item": `${siteUrl}/blog/${post.slug}`
      }
    ]
  };
};

// Generate Organization Schema
export const generateOrganizationSchema = (siteUrl = 'https://recalibratepain.com') => {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    "name": "Recalibrate",
    "url": siteUrl,
    "logo": `${siteUrl}/recalibrate-logo-optimized.png`,
    "description": "Comprehensive allied health platform for chronic pain, chronic illness, and health management.",
    "sameAs": [
      "https://recalibrate.beehiiv.com",
      "https://www.etsy.com/shop/RecalibratePain"
    ]
  };
};

// Hook to inject schema into page head
export const useSchemaMarkup = (schemas) => {
  useEffect(() => {
    // Remove any existing schema scripts
    const existingScripts = document.querySelectorAll('script[type="application/ld+json"]');
    existingScripts.forEach(script => script.remove());
    
    // Add new schema scripts
    schemas.forEach((schema, index) => {
      if (schema) {
        const script = document.createElement('script');
        script.type = 'application/ld+json';
        script.id = `schema-${index}`;
        script.textContent = JSON.stringify(schema);
        document.head.appendChild(script);
      }
    });
    
    // Cleanup on unmount
    return () => {
      schemas.forEach((_, index) => {
        const script = document.getElementById(`schema-${index}`);
        if (script) script.remove();
      });
    };
  }, [schemas]);
};

export default {
  blogFAQs,
  generateArticleSchema,
  generateFAQSchema,
  generateBreadcrumbSchema,
  generateOrganizationSchema,
  useSchemaMarkup
};
