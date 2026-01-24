import React, { useEffect, useState } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import { 
  ArrowLeft, Clock, Calendar, Tag, User, Share2, 
  BookOpen, ChevronRight, FileText, ExternalLink
} from 'lucide-react';
import { blogPosts } from '../data/blogPosts';

// Full blog content for each post
const blogContent = {
  'understanding-chronic-pain-science-based-guide': {
    sections: [
      {
        title: "What Is Chronic Pain? Why Does It Last So Long?",
        content: `Chronic pain affects over **1.5 billion people worldwide**, making it one of the most prevalent health conditions on the planet. But what exactly makes pain "chronic"?

**The key question everyone asks: "Why won't my pain go away?"**

Unlike acute pain (the sharp sting of a cut or burn that fades as you heal), chronic pain persists **long after tissue healing has occurred**—often fundamentally changing how your nervous system processes information.

The International Association for the Study of Pain (IASP) now recognizes chronic pain as a disease in its own right, not merely a symptom.`
      },
      {
        title: "How Do Doctors Define Chronic Pain?",
        content: `**Duration matters, but it's not the whole story:**
- Pain lasting more than **3-6 months** is typically classified as chronic
- It persists beyond normal tissue healing time
- Often, there's no ongoing tissue damage

**Key characteristics that define chronic pain:**
- **Neuroplastic changes:** Your nervous system adapts and becomes sensitized
- **Multidimensional impact:** Affects physical, emotional, social, and cognitive function
- **Variable presentation:** Pain intensity fluctuates without clear triggers
- **Central involvement:** The brain and spinal cord play major roles`
      },
      {
        title: "What Causes Chronic Pain? The Biopsychosocial Model Explained",
        content: `**"Is my pain all in my head?"** — This is perhaps the most damaging misconception about chronic pain.

Modern pain science uses the **biopsychosocial model**, which recognizes pain is influenced by THREE interconnected factors:

**1. Biological Factors:**
- Tissue health and injury history
- Genetics and family history
- Neurological function
- Inflammation levels
- Sleep quality

**2. Psychological Factors:**
- Thoughts and beliefs about pain
- Emotional state (anxiety, depression)
- Attention and focus
- Past experiences
- Coping strategies

**3. Social Factors:**
- Relationships and support
- Work situation
- Financial stress
- Cultural beliefs about pain
- Healthcare access

**Why this matters:** Treatment that addresses ALL three areas is most effective.`
      },
      {
        title: "What Is Central Sensitization? (And Why Your Pain Alarm Is Stuck)",
        content: `**"Why does everything hurt more than it should?"**

Central sensitization is one of the most important concepts in chronic pain. It's when your nervous system becomes **hypersensitive**—like a smoke alarm that goes off when you make toast.

**Signs of central sensitization:**
- **Allodynia:** Normal touch feels painful (even clothing or light pressure)
- **Hyperalgesia:** Mild stimuli cause exaggerated pain
- **Spreading pain:** Pain spreads beyond the original injury site
- **Persistent pain:** Continues after tissues have healed

**The good news?** Central sensitization can be reversed with the right approaches.`
      },
      {
        title: "What Are The Best Treatments for Chronic Pain?",
        content: `**"What actually works for chronic pain?"**

Research shows **multimodal treatment** (combining multiple approaches) works best:

**1. Pain Neuroscience Education (PNE)**
Understanding how pain works reduces fear and literally changes pain processing. Studies show PNE alone can reduce pain intensity.

**2. Graded Exercise Therapy**
Progressive, structured movement helps retrain the nervous system:
- Start low, progress slowly
- Consistency beats intensity
- Focus on function, not just pain

**3. Cognitive Behavioral Therapy (CBT)**
Addresses thought patterns that perpetuate pain:
- Reduces catastrophizing
- Improves sleep
- Enhances coping strategies

**4. Mindfulness-Based Stress Reduction (MBSR)**
Research shows 57% of chronic pain patients experience reduced pain intensity.

**5. Appropriate Medication**
When needed, may include non-opioid analgesics, certain antidepressants, or anticonvulsants.`
      },
      {
        title: "Can Lifestyle Changes Really Help Chronic Pain?",
        content: `**Absolutely yes.** Here's what the research shows:

**Sleep:**
- Poor sleep increases pain sensitivity by 15-25%
- Improving sleep often improves pain
- CBT-I (therapy for insomnia) is highly effective

**Nutrition:**
- Anti-inflammatory diet reduces pain markers
- Mediterranean diet patterns show benefit
- Reduce: processed foods, sugar, excess alcohol
- Increase: omega-3s, vegetables, whole grains

**Stress:**
- Chronic stress amplifies pain through multiple pathways
- Relaxation techniques have measurable effects
- Even 10 minutes of deep breathing helps

**Movement:**
- "Motion is lotion" for chronic pain
- Gentle, enjoyable activity is key
- Avoiding movement often makes pain worse`
      },
      {
        title: "Frequently Asked Questions About Chronic Pain",
        content: `**Q: Is chronic pain "real" or psychological?**
A: Chronic pain is 100% real. Modern imaging shows measurable changes in the brain. Understanding the psychological components doesn't make it less real—it opens doors to effective treatment.

**Q: Will I have pain forever?**
A: Many people experience significant improvement with proper treatment. The nervous system can change in positive directions (neuroplasticity works both ways).

**Q: Should I push through pain or rest?**
A: Neither extreme. Pacing—balancing activity and rest—is most effective. Complete rest often worsens chronic pain.

**Q: Do I need to find the exact cause?**
A: Not always. Many effective treatments work regardless of the original cause. Focus on function, not just finding a diagnosis.

**Q: Are pain medications the answer?**
A: Medications can help but work best as part of a comprehensive approach, not as the only treatment.`
      }
    ]
  },
  'pain-neuroscience-education-brain-processes-pain': {
    sections: [
      {
        title: "Does Pain Equal Damage? The Surprising Truth",
        content: `**What if everything you believed about pain was incomplete?**

For centuries, we thought pain worked like a simple alarm system: damage the tissue, feel the pain. More damage = more pain. Fix the tissue = fix the pain.

**But this model fails to explain:**
- Phantom limb pain (pain in amputated limbs)
- Chronic pain without ongoing damage
- Why paper cuts hurt so much despite minimal injury
- Why soldiers sometimes feel no pain during battle injuries
- Why the same injury hurts differently on different days

**The revolutionary insight:** Pain is not a measure of tissue damage. Pain is a **protection output** created by your brain.`
      },
      {
        title: "How Does Your Brain Actually Create Pain?",
        content: `Your brain is constantly asking one question: **"How dangerous is this?"**

Here's the actual process:

**Step 1: Danger Detection (Nociception)**
Specialized nerve endings detect potentially harmful stimuli. Important: This is NOT pain yet—it's just information.

**Step 2: Spinal Cord Processing**
Signals get processed and filtered. They can be amplified OR dampened before reaching the brain.

**Step 3: Brain Evaluation**
Your brain evaluates the signals against:
- Past experiences and memories
- Current emotions and stress levels
- Beliefs and expectations
- Environmental context
- What you're paying attention to

**Step 4: Decision**
If your brain concludes you need protection, it creates pain. If it determines you're safe, it might not—even with tissue damage.`
      },
      {
        title: "What Are DIMs and SIMs? (Danger vs Safety Signals)",
        content: `Your brain constantly weighs **Danger In Me (DIMs)** against **Safety In Me (SIMs)**.

**DIMs — Things that increase pain:**
- Fear and anxiety about symptoms
- Negative beliefs ("my back is damaged")
- Poor sleep and exhaustion
- Stress and overwhelm
- Social isolation
- Scary medical language
- Focusing intensely on pain

**SIMs — Things that decrease pain:**
- Understanding pain neuroscience
- Confidence in your body
- Good sleep and rest
- Social support and connection
- Positive coping strategies
- Reassuring explanations
- Engaging in enjoyable activities

**Key strategy:** Increase your SIMs and decrease your DIMs.`
      },
      {
        title: "Can Learning About Pain Actually Reduce Pain?",
        content: `**Yes!** This is one of the most remarkable findings in pain science.

**Research shows Pain Neuroscience Education (PNE):**
- Reduces pain intensity (moderate effect size)
- Improves physical function (large effect size)
- Decreases fear of movement
- Reduces anxiety and depression
- Changes actual brain processing of pain

**How does learning reduce pain?**
When you understand that pain doesn't mean damage, your brain recalibrates its threat assessment. The alarm system becomes less sensitive.

**This doesn't mean:**
- Your pain isn't real
- You should ignore all pain
- It's "all in your head"

**It does mean:**
- Knowledge is medicine
- Your beliefs matter
- Change is possible`
      },
      {
        title: "What About My Scan Results?",
        content: `**"But my MRI shows degeneration/bulging discs/arthritis..."**

Here's what research shows about imaging:

**Shocking statistics:**
- 80% of people WITHOUT back pain have disc bulges on MRI
- 60% of pain-free people have disc degeneration
- Many "abnormalities" are normal age-related changes
- Imaging findings often DON'T correlate with pain levels

**What this means:**
- Structural findings are just one piece of information
- They don't determine your pain destiny
- Many people with "bad" scans have no pain
- Many people with "normal" scans have severe pain

**Focus on function, not pictures.**`
      },
      {
        title: "Practical Steps: How to Use Pain Neuroscience",
        content: `**Daily practices to apply this knowledge:**

**Morning:**
- Remind yourself: pain = protection, not damage
- Set intentions for gentle, confident movement
- Notice what your body CAN do

**Throughout the day:**
- Challenge threatening thoughts about pain
- Notice when you're tensing or bracing
- Take movement breaks
- Practice slow breathing

**When pain flares:**
- Ask: "What is my brain trying to protect me from?"
- Reduce DIMs, increase SIMs
- Move gently rather than freezing
- Use calming self-talk

**Remember:** This is a skill. It takes practice. Start small and build.`
      }
    ]
  },
  'sleep-chronic-pain-breaking-vicious-cycle': {
    sections: [
      {
        title: "Why Does Pain Get Worse When I Don't Sleep?",
        content: `**The sleep-pain connection is bidirectional—and vicious:**
- Poor sleep increases pain sensitivity the next day
- Pain disrupts sleep quality and duration
- Sleep deprivation impairs your body's natural pain-relief systems

**The numbers are striking:**
- 67-88% of chronic pain patients report sleep disturbances
- Just ONE night of poor sleep can increase pain sensitivity by 15-25%
- Sleep problems actually PREDICT who will develop chronic pain

**Why does this happen?**
- During sleep, your brain's "cleaning system" removes inflammatory markers
- Sleep deprivation reduces opioid receptor sensitivity
- Poor sleep increases systemic inflammation
- Emotional regulation suffers without sleep`
      },
      {
        title: "What Is CBT-I and Why Is It the Gold Standard?",
        content: `**CBT-I (Cognitive Behavioral Therapy for Insomnia)** is recommended as first-line treatment by the American Academy of Sleep Medicine.

**Core components:**

**1. Sleep Restriction**
Sounds counterintuitive, but limiting time in bed builds sleep pressure and improves sleep efficiency.

**2. Stimulus Control**
Strengthen the bed-sleep connection:
- Use bed only for sleep (and intimacy)
- Get up if not asleep within 20 minutes
- Return only when sleepy

**3. Cognitive Restructuring**
Challenge unhelpful thoughts:
- "I'll never fall asleep" → "Sleep will come eventually"
- "Tomorrow will be ruined" → "I've functioned on little sleep before"

**4. Sleep Hygiene**
Optimize your environment and habits.

**Key finding:** CBT-I works even when chronic pain is present. Often, improving sleep improves pain.`
      },
      {
        title: "How Should I Set Up My Bedroom for Better Sleep?",
        content: `**Environment optimization checklist:**

**Temperature:**
- Keep bedroom cool: 65-68°F (18-20°C)
- Your body temperature naturally drops during sleep
- A cool room facilitates this process

**Light:**
- Make it as dark as possible
- Even small amounts of light disrupt melatonin
- Consider blackout curtains or eye masks
- Cover LED lights from electronics

**Sound:**
- Minimize noise disruptions
- White noise can mask inconsistent sounds
- Some people benefit from earplugs

**Comfort (especially with pain):**
- Medium-firm mattress often works best
- Pillows that maintain neutral spine alignment
- Consider adjustable bed for position flexibility
- Experiment with pillow placement for support`
      },
      {
        title: "What Positions Help Me Sleep With Chronic Pain?",
        content: `**Back pain:**
- On back: Place pillow under knees
- On side: Pillow between knees
- Avoid stomach sleeping

**Hip pain:**
- Soft mattress topper may help
- Pillow between knees when side-lying
- Avoid sleeping on the painful side

**Neck pain:**
- Contoured pillow that maintains neutral alignment
- Avoid high pillows that flex the neck
- Back sleeping often best

**Shoulder pain:**
- Avoid sleeping on painful side
- Hug a pillow for support
- Back sleeping with arm supported

**General tips:**
- Change positions is okay—you don't need to stay perfectly still
- Use as many pillows as you need for support
- Your comfort matters more than "perfect" positioning`
      },
      {
        title: "What Should I Avoid Before Bed?",
        content: `**Substances:**
- **Caffeine:** Avoid 6+ hours before bed (some need 8-10 hours)
- Hidden sources: chocolate, some medications, certain teas
- **Alcohol:** May help you fall asleep but fragments sleep architecture
- **Nicotine:** Stimulant that disrupts sleep

**Screens:**
- Blue light suppresses melatonin production
- Stop screens 1-2 hours before bed
- If you must use devices, enable night mode

**Food:**
- Avoid large meals close to bedtime
- Light snack is okay if hungry
- Limit fluids to reduce nighttime bathroom trips

**Activities:**
- Avoid intense exercise within 3 hours of bed
- Gentle stretching or yoga is fine
- Don't work or problem-solve in bed
- Keep bedroom for sleep, not stress`
      },
      {
        title: "What Should I Do When Pain Wakes Me Up?",
        content: `**Step 1: Don't panic**
- Clock-watching increases anxiety
- Remind yourself: occasional waking is normal

**Step 2: Stay relaxed**
- Try to accept being awake without fighting
- Resistance creates more tension

**Step 3: Use relaxation techniques**
- Deep breathing: 4 counts in, 6 counts out
- Progressive muscle relaxation
- Body scan meditation

**Step 4: Get up if needed**
- If awake more than 20 minutes, go to another room
- Do something quiet and non-stimulating
- Return to bed only when sleepy

**Medication timing:**
- Discuss with your doctor about timing of pain medications
- Some medications can be taken if you wake with pain
- Don't let fear of pain keep you from returning to sleep`
      }
    ]
  },
  'mindfulness-pain-management-evidence-based-approaches': {
    sections: [
      {
        title: "What Is Mindfulness and Can It Really Help Pain?",
        content: `**Mindfulness is paying attention to the present moment with openness and without judgment.**

Let's break that down:
- **Paying attention:** Deliberately directing focus
- **Present moment:** Not dwelling on past pain or fearing future pain
- **Openness:** Approaching experiences with curiosity
- **Without judgment:** Observing sensations without labeling them "bad"

**Can it actually help chronic pain?**
Yes—and there's strong research to prove it. A 2017 meta-analysis found:
- **Moderate effects** on pain intensity
- **Large effects** on depression and quality of life
- **Benefits lasting 6+ months** after program completion

**Important:** Mindfulness doesn't eliminate pain—it changes your relationship with it.`
      },
      {
        title: "How Does Mindfulness Change Pain in the Brain?",
        content: `**Brain imaging studies reveal fascinating changes:**

**Reduced activation in:**
- Somatosensory cortex (pain intensity processing)
- Thalamus (sensory relay station)
- Areas associated with pain suffering

**Increased activation in:**
- Prefrontal cortex (executive function)
- Areas associated with emotion regulation
- Attention control networks

**What this means practically:**
Mindfulness doesn't block pain signals—it changes how your brain responds to them.

**The two components of pain:**
1. **Sensory dimension:** The physical sensation
2. **Affective dimension:** The emotional suffering

Mindfulness helps separate these. You might still feel pain, but with significantly less emotional distress.`
      },
      {
        title: "How Do I Practice Breath Awareness Meditation?",
        content: `**This is the foundation of most mindfulness practices.**

**Basic Instructions:**
1. Sit or lie comfortably
2. Close eyes or soften your gaze
3. Bring attention to your breath
4. Notice sensations: rise and fall, air flow, temperature
5. When mind wanders (it will!), gently return to breath
6. Practice for 5-20 minutes

**Common questions:**

**"My mind won't stop wandering."**
That's normal! The practice isn't about preventing thoughts—it's about noticing when you've wandered and returning. Each return is a "rep" that strengthens mindfulness.

**"What about when I'm in pain?"**
Acknowledge the pain, then gently guide attention back to breath. You're not ignoring pain—you're choosing where to focus.

**"How long should I practice?"**
Start with 5 minutes. Consistency beats duration. Daily short practice is better than occasional long sessions.`
      },
      {
        title: "What Is the RAIN Technique for Pain?",
        content: `**RAIN is a four-step process for working with difficult experiences:**

**R — Recognize**
"I notice pain in my lower back right now."
Simply acknowledge what's happening without trying to change it.

**A — Allow**
"I can let this sensation be here."
Not resignation—just willingness to stop fighting for a moment.

**I — Investigate**
"Where exactly is the sensation? What's its quality? Is it constant or pulsing?"
Bring curiosity rather than fear. Often, examining pain closely reveals it's not a solid block but a changing experience.

**N — Non-identification**
"I have pain, but I am not only pain."
You are the awareness observing the pain, not the pain itself.

**When to use RAIN:**
- During pain flares
- When anxiety about pain rises
- When you notice yourself tensing against pain
- Anytime you feel overwhelmed`
      },
      {
        title: "What About Body Scan Meditation?",
        content: `**Body scan is systematic attention through the body—particularly useful for chronic pain.**

**How to practice:**
1. Lie down comfortably
2. Start at the top of your head
3. Slowly move attention down through the body
4. Notice sensations without trying to change them
5. Breathe into areas of tension
6. Continue to your feet
7. End by noticing the body as a whole

**For painful areas:**
- Approach with curiosity, not fear
- Notice specific qualities: sharp? dull? hot? tight?
- Often, breaking pain into components makes it more manageable
- Breathe slowly as you observe

**If pain is too intense:**
- Spend less time on painful areas
- "Touch and go"—acknowledge and move on
- Or skip that area and return later
- Pain-specific guided meditations can help`
      },
      {
        title: "How Can I Be Mindful During the Day?",
        content: `**Mindfulness isn't just meditation—it's a way of being.**

**Informal practice ideas:**

**Mindful eating:**
- Full attention to taste, texture, temperature
- Put down utensils between bites
- Notice hunger and fullness

**Mindful walking:**
- Feel each step's sensations
- Notice feet connecting with ground
- Can be very slow or normal pace

**Mindful transitions:**
- Three breaths before starting car
- Pause before answering phone
- Brief body check when sitting down

**STOP technique:**
- **S**top what you're doing
- **T**ake a breath
- **O**bserve your experience
- **P**roceed mindfully

**During pain flares:**
- Pause and acknowledge
- Breathe slowly
- Soften muscles around the pain
- Offer yourself compassion
- Then decide how to respond`
      }
    ]
  },
  'building-pain-management-support-team': {
    sections: [
      {
        title: "Why Do I Need a Team for Pain Management?",
        content: `**Chronic pain is complex—it affects multiple life domains:**
- Physical function
- Emotional wellbeing
- Work and productivity
- Relationships
- Sleep and energy
- Daily activities

**No single provider can address all these optimally.**

**Research consistently shows:**
- Multidisciplinary care produces better outcomes than single-provider treatment
- Functional outcomes improve more with coordinated care
- Return-to-work rates are higher
- Long-term benefits are more sustained

**The question isn't whether you need a team—it's how to build the right one for YOU.**`
      },
      {
        title: "Who Should Be On My Core Pain Management Team?",
        content: `**1. Primary Care Physician (PCP)**
Your quarterback for overall health:
- Coordinates care between specialists
- Manages general health issues
- Provides referrals
- Monitors medications

**2. Pain Specialist / Pain Medicine Physician**
For complex pain needs:
- Advanced diagnosis
- Interventional procedures (injections, nerve blocks)
- Complex medication management
- Types: Anesthesiologists, PM&R physicians, Neurologists

**3. Physical Therapist (PT)**
Foundation for most chronic pain:
- Movement assessment
- Exercise prescription
- Manual therapy
- Pain education
- Building confidence in your body

**4. Pain Psychologist**
NOT because pain is "in your head":
- Cognitive Behavioral Therapy (CBT)
- Acceptance and Commitment Therapy (ACT)
- Coping skills development
- Addresses pain's emotional impact
- Proven to reduce pain and improve function`
      },
      {
        title: "Who Else Might I Need on My Team?",
        content: `**Extended team members based on your needs:**

**Occupational Therapist (OT)**
- Daily activity modification
- Workplace ergonomics
- Pacing strategies
- Assistive devices

**Pharmacist**
Often overlooked but valuable:
- Medication review
- Drug interaction checking
- Timing optimization
- Cost-effective alternatives

**Nutritionist / Dietitian**
- Anti-inflammatory diet guidance
- Weight management
- Addressing nutritional deficiencies

**Mental Health Support**
- Psychiatrist (medication for depression/anxiety)
- Licensed counselor (ongoing support)
- Support groups (peer connection)

**Complementary Practitioners**
Evidence-supported options:
- Acupuncturist
- Massage therapist
- Yoga instructor
- Meditation teacher`
      },
      {
        title: "How Do I Find the Right Providers?",
        content: `**Step 1: Assess your needs**
- What aspects of life are most affected?
- What treatments have you tried?
- What gaps exist in current care?
- What are your goals?

**Step 2: Get recommendations**
- Ask current providers for referrals
- Check with insurance about coverage
- Look for providers who specialize in chronic pain
- Read reviews, but weigh them appropriately

**Step 3: Look for these qualities**
- Interest and knowledge in chronic pain
- Believes in biopsychosocial approach
- Good communicator
- Willing to coordinate with other providers
- Respects your input and goals

**Red flags to avoid:**
- Dismisses your pain as "not real"
- Unwilling to explain treatments
- Over-reliance on single approaches
- Poor communication
- Doesn't listen to your concerns`
      },
      {
        title: "How Do I Coordinate Care Between Multiple Providers?",
        content: `**The challenge:**
Multiple providers can mean conflicting advice, duplicated tests, medication interactions, and falling through gaps.

**Solutions:**

**Designate a coordinator**
- Often your PCP
- Could be a case manager
- May need to be YOU (empowered patient)

**Create a care summary document**
Include:
- Current diagnoses
- All providers and their roles
- Current treatments and medications
- Allergies and sensitivities
- Treatment goals

**Facilitate communication**
- Request providers share notes
- Use patient portals to message
- Sign releases for record sharing
- Mention other team members at appointments

**Regular check-ins**
- Update your care summary
- Ensure everyone has current information
- Address any conflicting recommendations`
      },
      {
        title: "How Do I Advocate for Myself?",
        content: `**You are the expert on YOUR experience.**

Providers have clinical expertise, but YOU know:
- Your lived experience
- What's working and what's not
- Your values and priorities
- How pain affects YOUR specific life

**Effective self-advocacy tips:**

**Be prepared**
- Write down concerns before appointments
- Bring data (pain diaries, tracking info)
- Know your medication history

**Communicate clearly**
- Describe pain specifically (location, quality, triggers)
- Express concerns directly
- Ask questions until you understand
- Repeat back what you've heard

**Set expectations**
- Share your treatment goals
- Ask about realistic timelines
- Discuss what success looks like for you

**Follow up**
- Request results proactively
- Report concerning symptoms promptly
- Schedule regular follow-ups

**Remember:** You have the right to a second opinion. You can change providers. Your voice matters in your care.`
      }
    ]
  }
};

export default function BlogPostPage() {
  const { slug } = useParams();
  const navigate = useNavigate();
  const [post, setPost] = useState(null);
  const [content, setContent] = useState(null);

  useEffect(() => {
    const foundPost = blogPosts.find(p => p.slug === slug);
    if (foundPost) {
      setPost(foundPost);
      setContent(blogContent[slug]);
    } else {
      navigate('/blog');
    }
    window.scrollTo(0, 0);
  }, [slug, navigate]);

  if (!post || !content) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin w-8 h-8 border-4 border-purple-500 border-t-transparent rounded-full"></div>
      </div>
    );
  }

  // Find related posts
  const relatedPosts = blogPosts.filter(p => p.id !== post.id).slice(0, 3);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-purple-50/30 to-indigo-50/50">
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-gradient-to-r from-slate-900 via-purple-900 to-indigo-900 shadow-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3">
          <div className="flex items-center justify-between">
            <Link to="/" className="flex items-center space-x-2">
              <img 
                src="/recalibrate-logo-optimized.png" 
                alt="Recalibrate" 
                className="h-10 w-auto" 
              />
              <span className="text-xl font-bold text-white">Recalibrate</span>
            </Link>
            <div className="flex items-center gap-4">
              <Link to="/blog" className="text-white/80 hover:text-white text-sm font-medium flex items-center gap-1">
                <ArrowLeft className="w-4 h-4" /> All Articles
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Article Header */}
      <header className={`pt-24 pb-12 px-4 sm:px-6 ${
        post.color === 'blue' ? 'bg-gradient-to-br from-blue-500 to-cyan-500' :
        post.color === 'purple' ? 'bg-gradient-to-br from-purple-500 to-violet-500' :
        post.color === 'indigo' ? 'bg-gradient-to-br from-indigo-500 to-blue-500' :
        post.color === 'emerald' ? 'bg-gradient-to-br from-emerald-500 to-teal-500' :
        'bg-gradient-to-br from-rose-500 to-pink-500'
      }`}>
        <div className="max-w-3xl mx-auto">
          <div className="flex items-center gap-3 mb-4">
            <span className="bg-white/20 backdrop-blur text-white text-sm font-semibold px-3 py-1 rounded-full">
              {post.category}
            </span>
            <span className="text-white/80 text-sm flex items-center gap-1">
              <Clock className="w-4 h-4" /> {post.readTime}
            </span>
          </div>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white leading-tight mb-4">
            {post.title}
          </h1>
          <p className="text-lg text-white/90 mb-6">
            {post.excerpt}
          </p>
          <div className="flex items-center gap-4 text-white/80 text-sm">
            <span className="flex items-center gap-1">
              <User className="w-4 h-4" /> Recalibrate Health Team
            </span>
            <span className="flex items-center gap-1">
              <Calendar className="w-4 h-4" /> {post.date}
            </span>
          </div>
        </div>
      </header>

      {/* Article Content */}
      <article className="py-12 px-4 sm:px-6">
        <div className="max-w-3xl mx-auto">
          {/* Tags */}
          <div className="flex flex-wrap gap-2 mb-8 pb-8 border-b border-gray-200">
            {post.tags.map((tag, i) => (
              <span key={i} className="text-sm bg-purple-100 text-purple-700 px-3 py-1 rounded-full flex items-center gap-1">
                <Tag className="w-3 h-3" /> {tag}
              </span>
            ))}
          </div>

          {/* Content Sections */}
          <div className="prose prose-lg prose-purple max-w-none">
            {content.sections.map((section, index) => (
              <section key={index} className="mb-12">
                <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-start gap-3">
                  <span className="flex-shrink-0 w-8 h-8 bg-purple-100 text-purple-600 rounded-lg flex items-center justify-center text-sm font-bold">
                    {index + 1}
                  </span>
                  {section.title}
                </h2>
                <div className="text-gray-700 leading-relaxed whitespace-pre-line">
                  {section.content.split('\n').map((paragraph, pIndex) => {
                    // Handle bold text
                    if (paragraph.startsWith('**') && paragraph.endsWith('**')) {
                      return <p key={pIndex} className="font-bold text-gray-900 my-4">{paragraph.replace(/\*\*/g, '')}</p>;
                    }
                    // Handle headers within content
                    if (paragraph.startsWith('**') && paragraph.includes(':**')) {
                      const parts = paragraph.split(':**');
                      return (
                        <p key={pIndex} className="my-2">
                          <strong className="text-gray-900">{parts[0].replace(/\*\*/g, '')}:</strong>
                          {parts[1]?.replace(/\*\*/g, '')}
                        </p>
                      );
                    }
                    // Handle list items
                    if (paragraph.startsWith('- ')) {
                      return (
                        <div key={pIndex} className="flex items-start gap-2 my-1 ml-4">
                          <span className="w-1.5 h-1.5 bg-purple-500 rounded-full mt-2.5 flex-shrink-0"></span>
                          <span dangerouslySetInnerHTML={{ __html: paragraph.substring(2).replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>') }}></span>
                        </div>
                      );
                    }
                    // Handle numbered items
                    if (/^\d+\.\s/.test(paragraph)) {
                      return (
                        <div key={pIndex} className="flex items-start gap-2 my-1 ml-4">
                          <span className="text-purple-600 font-bold">{paragraph.match(/^\d+/)[0]}.</span>
                          <span dangerouslySetInnerHTML={{ __html: paragraph.replace(/^\d+\.\s/, '').replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>') }}></span>
                        </div>
                      );
                    }
                    // Handle Q&A format
                    if (paragraph.startsWith('**Q:')) {
                      return <p key={pIndex} className="font-bold text-gray-900 mt-4" dangerouslySetInnerHTML={{ __html: paragraph.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>') }}></p>;
                    }
                    if (paragraph.startsWith('A:')) {
                      return <p key={pIndex} className="text-gray-700 mb-4 ml-4">{paragraph.substring(2).trim()}</p>;
                    }
                    // Regular paragraph
                    if (paragraph.trim()) {
                      return <p key={pIndex} className="my-3" dangerouslySetInnerHTML={{ __html: paragraph.replace(/\*\*(.*?)\*\*/g, '<strong class="text-gray-900">$1</strong>') }}></p>;
                    }
                    return null;
                  })}
                </div>
              </section>
            ))}
          </div>

          {/* End of article content */}
        </div>
      </article>

      {/* Related Articles */}
      <section className="py-12 px-4 sm:px-6 bg-white border-t border-gray-200">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-2xl font-bold text-gray-900 mb-8">Related Articles</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {relatedPosts.map((relatedPost) => (
              <Link 
                key={relatedPost.id}
                to={`/blog/${relatedPost.slug}`}
                className="group bg-gray-50 rounded-xl p-6 hover:bg-purple-50 transition-all"
              >
                <span className="text-3xl mb-3 block">{relatedPost.icon}</span>
                <h3 className="font-bold text-gray-900 group-hover:text-purple-700 transition-colors mb-2 line-clamp-2">
                  {relatedPost.title}
                </h3>
                <p className="text-sm text-gray-500 flex items-center gap-1">
                  {relatedPost.readTime} <ChevronRight className="w-3 h-3" />
                </p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-gray-200 py-8 px-4 sm:px-6 bg-white/50">
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <Link to="/" className="flex items-center gap-2">
            <img src="/recalibrate-logo-optimized.png" alt="Recalibrate" className="h-8 w-auto" />
            <span className="font-bold text-gray-900">Recalibrate</span>
          </Link>
          <p className="text-sm text-gray-500">
            © 2025 Recalibrate. Evidence-based pain management.
          </p>
        </div>
      </footer>
    </div>
  );
}
