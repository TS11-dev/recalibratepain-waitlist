import React, { useEffect, useState } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import { 
  ArrowLeft, Clock, Calendar, Tag, User, 
  BookOpen, ChevronRight, FileText, ExternalLink, Linkedin
} from 'lucide-react';
import { Helmet } from 'react-helmet-async';
import { blogPosts } from '../data/blogPosts';
import { 
  generateArticleSchema, 
  generateFAQSchema, 
  generateBreadcrumbSchema,
  generateOrganizationSchema,
  useSchemaMarkup 
} from '../utils/schemaMarkup';
import { DIAGRAM_MAP } from '../components/BlogDiagrams';

// Diagram placement: which section index in each post gets a diagram
const diagramMap = {
  'understanding-chronic-pain-science-based-guide':         { 1: 'biopsychosocial' },
  'pain-neuroscience-education-brain-processes-pain':       { 2: 'paindecision' },
  'sleep-chronic-pain-breaking-vicious-cycle':              { 3: 'sleeppain' },
  'mindfulness-pain-management-evidence-based-approaches':  { 1: 'mindfulnesspain' },
  'building-pain-management-support-team':                  { 1: 'teamwheel' },
  'activity-pacing-boom-bust-cycle-chronic-pain':           { 3: 'boombust' },
  'fibromyalgia-flare-triggers-management':                 { 1: 'fibromyalgia' },
  'central-sensitization-why-pain-persists':                { 1: 'centralsensitization' },
  'pain-catastrophizing-break-negative-thought-patterns':   { 1: 'catastrophizing' },
  'gabapentin-alternatives-non-medication-pain-relief':     { 3: 'treatmentevidence' },
};

// Concentric zones diagram component
const ZonesDiagram = () => (
  <div className="my-8 flex flex-col items-center">
    <div className="relative flex items-center justify-center" style={{ width: '300px', height: '300px' }}>
      {/* Growth Zone - outermost */}
      <div className="absolute inset-0 rounded-full border-2 border-dashed border-blue-400 bg-blue-50 flex items-start justify-center pt-3">
        <div className="text-center px-2">
          <span className="text-xs font-bold text-blue-700 uppercase tracking-wider block">Growth Zone</span>
          <span className="text-xs text-blue-500 block">Flow Architecture</span>
        </div>
      </div>
      {/* Learning Zone */}
      <div className="absolute rounded-full border-2 border-dashed border-amber-400 bg-amber-50 flex items-start justify-center pt-3" style={{ width: '218px', height: '218px' }}>
        <div className="text-center px-2">
          <span className="text-xs font-bold text-amber-700 uppercase tracking-wider block">Learning Zone</span>
          <span className="text-xs text-amber-500 block">Neuroplasticity Active</span>
        </div>
      </div>
      {/* Fear Zone */}
      <div className="absolute rounded-full border-2 border-dashed border-red-400 bg-red-50 flex items-start justify-center pt-2" style={{ width: '145px', height: '145px' }}>
        <div className="text-center px-2">
          <span className="text-xs font-bold text-red-700 uppercase tracking-wider block">Fear Zone</span>
          <span className="text-xs text-red-400 block">Amygdala Hijack</span>
        </div>
      </div>
      {/* Comfort Zone - innermost */}
      <div className="absolute rounded-full border-2 border-green-400 bg-green-50 flex items-center justify-center" style={{ width: '80px', height: '80px' }}>
        <div className="text-center px-1">
          <span className="text-xs font-bold text-green-700 uppercase tracking-wider leading-tight block">Comfort<br/>Zone</span>
        </div>
      </div>
    </div>
    <p className="text-xs text-gray-400 mt-3 text-center max-w-xs">Each outer zone requires managing the one before it. There is no shortcut from Comfort to Growth.</p>
  </div>
);

// Full blog content for each post - written in Tristan Siokos's voice
const blogContent = {
  'neuroscience-comfort-zone-growth': {
    sections: [
      {
        title: "The Phrase That Gets Misused More Than Any Other",
        content: `"Get out of your comfort zone."

You have heard this a thousand times. From coaches, managers, motivational speakers, gym posters.

Almost none of them explain what is actually happening in the brain when you do. Or do not.

The four-zone model is not just a motivational framework. It is a neurological map. Each zone represents a distinct biological state with a distinct neurochemical signature. The transition between zones is not a mindset shift. It is a physiological process.

And once you understand the biology, you have leverage that "push through it" never gives you.`
      },
      {
        title: "The 4 Zones: Your Brain's Actual Map",
        content: `This is what the diagram shows. Not just where you sit emotionally but what your nervous system is doing in each zone.

**The Comfort Zone (The Stagnation Trap)**
The Science: This is a state of Neural Autopilot. When you stop encountering novelty, your brain prioritizes metabolic efficiency over growth. It begins Synaptic Pruning, literally deleting unused neural pathways to conserve energy. The brain is always editing itself based on what you actually use.
💡 If you are not building new circuits, you are losing the ones you have. Comfort is not neutral. It is a slow subtraction.

**The Fear Zone (The Amygdala Hijack)**
The Science: This is the HPA Axis in overdrive. Encountering the unknown triggers a cortisol surge that physically shrinks the Prefrontal Cortex (your decision-making and rational evaluation center) and enlarges the Amygdala. You lose access to your CEO and get stuck running on your alarm system.
💡 Most people retreat here not because they are weak but because they lack the biological protocols to flush cortisol and stay cognitively online.

**The Learning Zone (The Rewiring Phase)**
The Science: Manageable discomfort triggers the release of Norepinephrine and Acetylcholine. Think of these as chemical highlighters. They mark specific synapses for Neuroplasticity, signaling the brain to physically reshape itself around the new skill or experience. No friction = no chemical signal = no rewiring.
💡 This is where you upgrade your hardware. Not through motivation. Through chemistry.

**The Growth Zone (The Flow Architecture)**
The Science: This is a state of Prefrontal Oxygenation. When you consistently manage the Fear Zone without retreating, you build Cognitive Reserve: redundant neural pathways that make your brain genuinely resilient to stress and cognitive aging.
💡 You are not just "finding purpose." You are operating at peak biological capacity.`,
        diagram: 'zones'
      },
      {
        title: "The Biology of Retreating: Why the Fear Zone Wins by Default",
        content: `The Fear Zone is neurologically persuasive.

When the amygdala fires, it does three things simultaneously:
- Cortisol suppresses prefrontal activity (rational thinking goes offline)
- Norepinephrine narrows attention to the perceived threat
- The body primes for retreat: increased heart rate, shallow breathing, muscle tension

Your biology is actively working to push you back into the Comfort Zone. This is not a character flaw. It is a survival mechanism that evolved for short-term physical threats.

The problem: it applies the same response to giving a presentation, starting a new business, reintroducing movement after chronic pain, or having a difficult conversation.

**The Science:** The amygdala cannot distinguish between a genuine threat and a novel challenge. To the amygdala, both look like danger. The cortisol response is identical.

This means retreating from the Fear Zone is the biologically expected outcome. Staying in it is the skill. And skills are trainable.`
      },
      {
        title: "The Protocols: How to Stay Online in the Fear Zone",
        content: `Staying in the Fear Zone is not a matter of wanting it more. It is a matter of actively flushing cortisol and restoring Prefrontal function before you make the decision to retreat.

**Protocol 1: Box Breathing (The Cortisol Flush)**
Inhale 4s, hold 4s, exhale 4s, hold 4s. This directly activates the vagus nerve and parasympathetic nervous system, interrupting the HPA axis response. Do this before making any decision in the Fear Zone.
The mechanism: extended exhale activates the vagal brake → parasympathetic activity → cortisol levels begin dropping → prefrontal access returns.

**Protocol 2: Grounding (The Thalamic Re-tune)**
Name 5 things you can see, 4 you can physically feel. This re-tunes the thalamus (the sensory relay station) which becomes hyperactive during amygdala activation, amplifying every signal as a threat. Grounding gives it accurate, neutral sensory data.

**Protocol 3: Reframe the Signal**
The physical sensation of the Fear Zone (elevated heart rate, heightened alertness) is neurologically identical to excitement. This is not a metaphor. The physiological signature is the same. Your interpretation is the variable.
Telling yourself "I am excited" rather than "I am afraid" in the Fear Zone has been shown in research to improve performance outcomes because it keeps the Prefrontal Cortex in the evaluation seat rather than handing control to the amygdala.

**Protocol 4: Minimum Viable Action**
The longest you stay frozen in the Fear Zone, the stronger the amygdala's case becomes. Take the smallest possible action in the direction of the Learning Zone. Movement breaks the cortisol loop. Any movement.`
      },
      {
        title: "Building Cognitive Reserve: The Long-Term Payoff",
        content: `Cognitive Reserve is the Growth Zone's most important product. And most people have never heard of it.

**The Science:** Cognitive Reserve refers to the brain's capacity to maintain function under stress, injury, or aging by using alternative neural pathways. It is built through:
- Consistently engaging in novel, challenging tasks
- Managing the Fear Zone repeatedly without permanent retreat
- Learning new skills that require the brain to form new networks
- Physical exercise (which releases BDNF, the brain's primary growth factor)

People with higher Cognitive Reserve show later onset of cognitive decline, better recovery from neurological injury, and greater resilience to chronic stress. This is not a supplement or a hack. It is the compounding effect of spending time in the Learning and Growth Zones over years.

**For chronic pain specifically:** Cognitive Reserve directly impacts pain resilience. A brain with robust redundant pathways is more capable of activating its own descending inhibitory systems, regulating the emotional distress component of pain, and maintaining function under the cognitive load that chronic pain creates.

Building Cognitive Reserve is not separate from chronic pain management. It is part of it.`
      },
      {
        title: "Why This Applies Directly to Chronic Pain Recovery",
        content: `The four-zone model is not just a performance framework. It maps directly onto what happens in chronic pain recovery.

**Comfort Zone in chronic pain:** Complete avoidance of feared movements and activities. Feels safe. Is actively making the sensitization worse through deconditioning and reinforced fear-avoidance memory in the amygdala.

**Fear Zone in chronic pain:** Attempting any movement beyond your current baseline. The amygdala fires. Cortisol rises. The Prefrontal Cortex loses the ability to accurately assess whether the movement is actually harmful or just unfamiliar.
This is why graded exposure requires protocols. Without them, the Fear Zone reliably triggers retreat.

**Learning Zone in chronic pain:** Graded exposure done correctly. Manageable discomfort. Norepinephrine and acetylcholine release marking the nervous system for rewiring. The amygdala's threat memory is being updated with new, accurate information: this movement is safe.

**Growth Zone in chronic pain:** Restored function, reduced fear-avoidance, built Cognitive Reserve, and a nervous system that has learned to distinguish between threat and challenge.

The biology of growth and the biology of chronic pain recovery are the same biology.

Recalibrate builds the protocols to manage your nervous system through all four zones: the education, the tracking, the pacing tools, the care team integration. So you can spend less time in the Comfort Zone of avoidance and more time in the zones where recovery actually happens.`
      }
    ]
  },

  'understanding-chronic-pain-science-based-guide': {
    sections: [
      {
        title: "The Question Everyone Gets Wrong",
        content: `Your doctor says the scans are clear. Your physio cannot find a structural reason. Your blood work is normal.

So why does it still hurt?

Most chronic pain frameworks start with the wrong question. They ask: "What is damaged?"

The right question is: "What is your nervous system trying to protect you from?"

That single shift changes everything.

**Pain is not a damage report.** It is a protection output. Your brain manufactures it when it decides you are under threat. Whether that threat is real, remembered, or anticipated.

The International Association for the Study of Pain made this official. Chronic pain is now classified as a disease in its own right. Not a symptom. Not a sign of ongoing injury. A disease of the nervous system.`
      },
      {
        title: "The Biological Operating System Behind Pain",
        content: `Most people hear "biopsychosocial model" and think their doctor is saying the pain is in their head.

That is not what it means.

It means your pain experience is shaped by three systems running simultaneously:

**Biological System:**
- Tissue health and inflammation levels
- Neurological sensitization state
- Sleep quality and hormonal regulation
- Genetic predisposition

**Psychological System:**
- Threat assessment and beliefs about pain
- Emotional state: anxiety, depression, fear
- Attention and what you focus on
- Past pain experiences and memory

**Social System:**
- Relationships and quality of support
- Work and financial stress
- Cultural beliefs about pain and suffering
- Access to knowledgeable healthcare

**The Science:** When any one of these systems is dysregulated, the other two compensate. And usually amplify. A stressed HPA axis raises cortisol → lowers pain thresholds → increases psychological distress → further taxes the biological system.

This is not a model. It is a feedback loop.

Treatment that addresses all three systems consistently outperforms treatment that targets only one.`
      },
      {
        title: "Central Sensitization: When the Smoke Alarm Won't Turn Off",
        content: `Think of your pain alarm like a smoke detector.

In acute pain, it fires accurately. Fire = alarm. Injury = pain. Tissue heals, alarm stops.

In central sensitization, the detector gets recalibrated upward. Now toast sets it off. Light clothing. A gentle touch. Temperature changes. Emotions.

**What is actually happening:**
- Neurons lower their firing threshold (less stimulus needed to trigger pain)
- Pain signals are amplified in the spinal cord before reaching the brain
- The brain's natural pain-dampening systems weaken
- Pain spreads beyond the original site
- Normal sensation starts registering as painful

**The Science:** This is a measurable neurological change. It shows up in imaging. It is not imaginary, dramatic, or psychological in the dismissive sense. It is your nervous system running a protection program that got stuck on.

💡 **The Key Insight:** Treatment targeting only the tissues will not fix a nervous system problem. Most chronic pain persisting beyond 6 months has a central sensitization component.`
      },
      {
        title: "The 3 Drivers That Keep Chronic Pain Alive",
        content: `Once you understand central sensitization, you can see what actually maintains chronic pain.

**1. Threat Perception**

Your brain is constantly asking: "How dangerous is this?" Everything that signals danger, whether physical, emotional, or psychological, turns up the volume on pain.

Danger signals that amplify pain:
- Fear about what pain means
- Catastrophic thinking ("this will never end")
- Chronic stress and life overwhelm
- Poor sleep (raises threat sensitivity by 15-25%)
- Social isolation
- Scary medical language ("degenerated," "worn down")

Safety signals that reduce pain:
- Understanding why pain persists
- Confidence in your body's ability to change
- Quality sleep and nervous system regulation
- Connection and support
- Gentle movement that does not cause harm

**2. Nervous System Dysregulation**

A chronically activated sympathetic nervous system keeps pain sensitivity elevated. You cannot fully recover from chronic pain while living in fight-or-flight.

**3. Avoidance**

Pain leads to avoiding movement. Avoidance leads to deconditioning. Deconditioning leads to more pain. More pain leads to more avoidance. Your nervous system learns that the avoided thing is dangerous. Sensitivity increases.`
      },
      {
        title: "What the Evidence Says About Treatment",
        content: `Not all treatment is equal. Here is what consistently outperforms single-approach care:

**Pain Neuroscience Education (PNE)**
Understanding how pain works reduces threat perception. Studies show PNE alone produces measurable reductions in pain intensity and disability. Knowledge changes the brain's threat assessment. This is not a soft intervention. It is a neurological one.

**Graded Exercise Therapy**
Progressive, structured movement retrains the nervous system that movement is safe. Start low. Progress slowly. Consistency beats intensity every time.

**Cognitive Behavioral Therapy**
Targets the psychological drivers of central sensitization: catastrophizing, fear-avoidance, sleep disruption. Long-term outcomes consistently outperform medication-only approaches.

**Sleep and Stress Regulation**
Sleep, stress management, circadian rhythm regulation, and social connection are not soft lifestyle factors. They directly regulate the biological systems that maintain chronic pain.

Pacing, nervous system downregulation, and daily movement are not complementary to treatment. They are treatment.`
      },
      {
        title: "Your Nervous System Can Change. That is Not a Metaphor.",
        content: `The same neuroplasticity that sensitized your pain system can be redirected.

Your nervous system learned to amplify pain. It can learn to turn the volume down.

This is not positive thinking. It is neurobiology.

**The strategies that work:**
- Move gently and consistently (do not wait until pain-free)
- Sleep as a non-negotiable clinical priority
- Reduce physiological stress wherever possible
- Learn pain neuroscience (reading this article is already therapeutic)
- Build safety signals into your daily environment systematically

Chronic pain is not a life sentence. It is a state your nervous system entered.

With the right inputs, consistently applied, it can shift.

Recalibrate was built on this exact principle. Give people the tools, education, and connected care to change the system. Not mask the output.`
      }
    ]
  },

  'pain-neuroscience-education-brain-processes-pain': {
    sections: [
      {
        title: "The Most Important Discovery in Modern Pain Science",
        content: `Here is the most important thing modern neuroscience has established about pain:

**Pain is not a signal that travels from your tissues to your brain.**

Pain is a decision your brain makes.

Your tissues send danger signals. These are called nociceptive signals. Your brain evaluates those signals against your past experiences, your current emotional state, what you believe the sensation means, and what you are paying attention to.

Then it decides: is this worth protecting against?

If yes, it manufactures pain.

The same tissue damage can produce severe pain in one context and no pain in another. Soldiers in combat sustain serious injuries and report no pain until they are safe. People with structurally "terrible" MRIs report no symptoms. People with perfectly normal scans are in agony.

The tissue is not the whole story. The brain is the whole story.

And once you understand that, you have leverage.`
      },
      {
        title: "How Your Brain Actually Makes Pain",
        content: `Your brain is running a continuous threat assessment. Here is the actual process:

**Step 1: Danger Detection**
Specialized nerve endings detect potentially harmful stimuli. This is called nociception. Important: this is NOT pain yet. It is raw data.

**Step 2: Spinal Cord Processing**
Signals are processed and filtered at the dorsal horn. They can be amplified OR dampened here before reaching the brain. This gate is not passive. It responds to emotional state, attention, and stress.

**Step 3: Brain Evaluation**
Your brain evaluates the signals against:
- Past pain experiences and memories
- Current emotional state and stress levels
- What you believe the sensation means
- Your environment and context
- What you are paying attention to right now

**Step 4: The Decision**
If your brain concludes you need protection, it creates pain. If it determines you are safe, it may not create pain. Even with real tissue damage present.

This is not a malfunction. This is the system working exactly as designed. The problem in chronic pain is that the threat assessment gets stuck.`
      },
      {
        title: "The 5 Brain Regions Running Your Pain System",
        content: `Understanding which parts of your brain produce pain gives you real leverage to change it.

**1. The Prefrontal Cortex (The CEO)**
The Science: Evaluates threat, regulates emotional response to pain, applies rational brakes to pain processing. Chronic stress and high cortisol shunt blood flow away from here toward survival hubs. Less prefrontal activity means less pain regulation.
💡 **Box Breathing:** Inhale 4s, hold 4s, exhale 4s, hold 4s. This re-perfuses the frontal lobe and restores rational threat assessment.

**2. The Anterior Cingulate Cortex (The Volume Knob)**
The Science: Determines how much you care about a pain signal. High catastrophizing and anxiety crank up this region, amplifying the emotional suffering of pain independent of its intensity.
💡 **Labelling Practice:** Name the emotion attached to the pain: "I notice fear" or "I notice frustration." Labelling activates the prefrontal cortex and dials down the ACC.

**3. The Amygdala (The Alarm)**
The Science: Fires a threat response faster than conscious thought. If your amygdala has learned that certain movements mean danger, it generates pain in anticipation. Before any tissue is touched.
💡 **Graded Exposure:** Slow, safe reintroduction to feared movements retrains the amygdala that the movement is not dangerous.

**4. The Hippocampus (The Librarian)**
The Science: Stores pain memories with strong emotional tags. Highly stressful pain experiences create memory traces that can be re-triggered by context, smell, or emotion alone.
💡 **BDNF Surge:** Novel physical tasks such as writing with your non-dominant hand trigger neuroplasticity in the hippocampus, supporting new learning pathways.

**5. The Insula (The Body Scanner)**
The Science: Monitors internal body states and maps them to threat significance. In chronic pain, the insula becomes hypervigilant, interpreting normal bodily signals as threatening.
💡 **Interoception Training:** Slow breathing with focused attention on neutral, non-painful body sensations recalibrates insular mapping over time.`
      },
      {
        title: "What Your MRI Isn't Telling You",
        content: `"But my MRI shows degeneration. Bulging discs. Arthritis."

Here is what population-level research actually shows:

- 80% of people without back pain have disc bulges on MRI
- 60% of pain-free adults show disc degeneration
- Structural findings frequently do not correlate with pain levels
- Many people with "terrible" scans report no pain
- Many people with "normal" scans are in agony

This is not an argument that structural findings are irrelevant. It is evidence that the brain, not the tissue, is the final arbiter of whether pain is produced.

**What this means practically:**
- Chasing a structural diagnosis as the sole explanation will not resolve chronic pain
- Treating the nervous system is not an alternative to treating the body
- It is treating the body at its most fundamental level
- Knowledge of this fact is itself therapeutic

When you understand that pain does not equal damage, your brain recalculates its threat assessment. That recalculation is not just psychological. It is neurological.`
      },
      {
        title: "Practical Threat Management: DIMs and SIMs",
        content: `Your brain runs a constant threat calculator. Everything goes on one side or the other.

**DIMs (Danger In Me signals that amplify pain):**
- Fear about what symptoms mean
- Catastrophic beliefs ("I will never get better")
- Poor sleep and physical exhaustion
- Chronic stress and life overwhelm
- Scary medical language ("degenerated," "wear and tear")
- Social isolation and disconnection
- Being told nothing can be done

**SIMs (Safety In Me signals that reduce pain):**
- Understanding pain neuroscience (like this article)
- Confidence in your body's capacity to change
- Good sleep and nervous system regulation
- Social support and genuine connection
- Reassuring, accurate explanations from clinicians
- Enjoyable gentle movement
- A genuine sense of control and agency over your health

Your practical goal: systematically reduce your DIMs and build SIMs into your daily structure.

This is not a mindset exercise. It is a biological intervention. Every SIM you add is a direct input to the threat calculator your brain uses to decide how much pain to produce.`
      },
      {
        title: "Daily Practice: Applying This Science",
        content: `Pain neuroscience education is only useful if it changes how you live day to day.

**Morning:**
- Remind yourself: pain equals protection, not damage
- Set an intention for gentle, confident movement
- Notice what your body can do, not just what it cannot

**Throughout the day:**
- Challenge threatening thoughts about pain with evidence
- Notice when you are tensing or bracing against anticipated pain
- Take short movement breaks rather than long sedentary periods
- Practice slow breathing to keep the prefrontal cortex online

**During pain flares:**
- Ask: "What is my brain trying to protect me from right now?"
- Reduce DIMs actively: what specific danger signal is elevated?
- Move gently rather than freezing
- Use grounding and calm self-talk

This is a skill set. It improves with practice. The nervous system changes slowly but it changes.

Start small. Build consistently. The direction matters more than the speed.`
      }
    ]
  },

  'sleep-chronic-pain-breaking-vicious-cycle': {
    sections: [
      {
        title: "Sleep Hygiene is Not Your Problem",
        content: `No shade to the blackout curtain crowd.

But if you have chronic pain and you cannot sleep, "try a cooler room and avoid screens before bed" is not the answer.

It is not even close to the answer.

The real problem is your HPA Axis.

The Hypothalamic-Pituitary-Adrenal axis is your primary stress response system. It regulates cortisol, your body's most powerful inflammatory modulator. When it is dysregulated from chronic pain, chronic stress, or sustained nervous system activation, cortisol does not drop when it should.

Your body does not shift into the parasympathetic state required for restorative sleep. Pain thresholds drop. Inflammatory markers rise. You lie in bed with a sensitized nervous system and no physiological off switch.

That is not a sleep hygiene problem. That is a neuroendocrine problem. And it requires a different solution.`
      },
      {
        title: "The HPA Axis: The Real Driver",
        content: `Cortisol should peak around 8am and decline through the day. This is the normal cortisol curve.

In chronic pain states, the HPA axis stays in high-output mode. Cortisol remains elevated at night. This disrupts melatonin production, delays sleep onset, fragments sleep architecture, and keeps the nervous system in a state of low-grade alert even when you are exhausted.

The result: you are tired but wired. Physically exhausted but neurologically activated. This is the hallmark of HPA dysregulation.

**The Science:** This is not just poor sleep. Sleep deprivation from HPA dysregulation does three specific things in a chronic pain context:
- Reduces opioid receptor sensitivity (your own natural pain killers work less effectively)
- Increases systemic inflammatory markers
- Impairs the glymphatic system, your brain's overnight waste-clearance network, which removes inflammatory proteins linked to pain sensitization

One night of poor sleep raises pain sensitivity by 15-25% the following day. Do that for months and you have a nervous system that cannot reset.

💡 **Circadian Reset:** Get natural morning sunlight within 30 minutes of waking. No sunglasses. Minimum 10 minutes outside. This anchors the cortisol pulse to the correct time and starts the 14-16 hour countdown to appropriate melatonin release at night.`
      },
      {
        title: "The 4 Systems Sleep Must Navigate in Chronic Pain",
        content: `Chronic pain disrupts sleep through 4 distinct biological systems. Addressing only one will not fix the problem.

**1. The HPA Axis (The Thermostat)**
The Science: Keeps cortisol elevated at night, blocks the parasympathetic shift required for sleep onset, and disrupts melatonin production.
💡 Morning sunlight for 10 minutes. Consistent wake time regardless of sleep quality. These two inputs are more powerful than any sleep supplement.

**2. The Autonomic Nervous System (The Switch)**
The Science: Sleep requires a shift from sympathetic (fight-or-flight) to parasympathetic (rest-digest-repair). Chronic pain keeps the sympathetic system active. The switch does not flip.
💡 **Vagal Activation:** An extended exhale directly engages the vagus nerve and forces parasympathetic activation. Try 4s inhale, 8s exhale for 5-10 minutes before sleep. The exhale activates the vagal brake.

**3. The Glymphatic System (The Night Cleaner)**
The Science: During deep sleep, your brain activates a waste-clearance network that removes inflammatory proteins including those linked to pain sensitization. Poor sleep means this system does not run. Proteins accumulate. Pain sensitivity increases. More pain disrupts sleep further.
💡 Side sleeping enhances glymphatic clearance. Left lateral position shows the strongest effect in the available research.

**4. The Hippocampus (The Memory Sorter)**
The Science: Sleep consolidates pain memories and emotional associations. Sleep deprivation impairs the brain's ability to down-regulate fear memories. This is why poor sleep makes everything feel more threatening, including pain.
💡 **Pre-Sleep Audit:** Write down 3 factual, non-threatening statements about your pain before bed. "My scans are clear. This is nervous system sensitivity. I have had better days before." Give the hippocampus accurate material to process overnight.`
      },
      {
        title: "The Bidirectional Trap",
        content: `The sleep-pain cycle is bidirectional and self-reinforcing:

Pain disrupts sleep → poor sleep raises pain sensitivity → more pain disrupts the next night's sleep → repeat

Breaking this requires targeting both systems simultaneously, not one at a time.

**For the pain system:**
- Pain neuroscience education to reduce threat perception
- Pacing to prevent activity spikes that cause flares and disrupt sleep
- Stress regulation throughout the day, not just before bed
- Gentle movement during the day to support autonomic regulation

**For the sleep system:**
- Consistent wake time is more important than bedtime
- Morning light exposure for HPA regulation
- Vagal activation as part of a wind-down routine
- Stimulus control: bed is for sleep only, not worry, work, or phone scrolling

The key principle: you cannot fix chronic pain sleep problems with sleep interventions alone. The pain system must be addressed in parallel.`
      },
      {
        title: "CBT-I: The Evidence-Based Protocol",
        content: `CBT-I (Cognitive Behavioral Therapy for Insomnia) is the American Academy of Sleep Medicine's first-line recommendation for insomnia. It outperforms sleep medication in head-to-head trials. Especially in chronic pain populations.

The core components:

**Sleep Restriction**
Temporarily limit time in bed to build genuine sleep pressure and improve sleep efficiency. Counterintuitive but consistently effective.

**Stimulus Control**
Eliminate the association between bed and wakefulness, worry, or pain focus. Use bed only for sleep. Get up if not asleep within 20 minutes. Return only when genuinely sleepy.

**Cognitive Restructuring**
Challenge unhelpful beliefs about sleep:
- "I will never fall asleep" → "Sleep pressure builds over time. It will come."
- "Tomorrow will be ruined" → "I have functioned on poor sleep before. I can manage."

**Sleep Hygiene (the part most people start with and should start with last)**
Optimize environment and habits after the above is in place.

The critical finding from pain-specific research: improving sleep often improves pain, even when pain is not directly targeted. The sleep system and pain system share enough biological infrastructure that fixing one repairs the other.`
      },
      {
        title: "Your 5-Step Sleep Recalibration Protocol",
        content: `Apply these in order. Do not skip to step 5.

**Step 1: Set a fixed wake time and hold it regardless of how the night went.**
This is the single most effective behavioral intervention for sleep. It rebuilds sleep pressure and recalibrates the circadian clock.

**Step 2: Get 10 minutes of morning sunlight within 30 minutes of waking.**
This sets the HPA cortisol pulse and initiates the melatonin countdown. Non-negotiable for HPA dysregulation.

**Step 3: Build a 20-minute wind-down routine with vagal activation.**
4s inhale, 8s exhale for 5-10 minutes. Add a pre-sleep cognitive audit: 3 factual, non-threatening statements about your pain and your body.

**Step 4: Implement stimulus control.**
Bed for sleep only. If awake for more than 20 minutes, get up, go to another room, do something quiet and non-stimulating, return when genuinely sleepy.

**Step 5: Track both sleep and pain together.**
The patterns that emerge over 2-4 weeks are more valuable than any single night's data. You are looking for correlations, not perfection.

Sleep is not a lifestyle factor in chronic pain. It is a primary treatment target.`
      }
    ]
  },

  'mindfulness-pain-management-evidence-based-approaches': {
    sections: [
      {
        title: "Mindfulness is Not Relaxation",
        content: `"Have you tried meditation?"

If you have chronic pain, you have heard this. Possibly from multiple healthcare providers. Often delivered with the vague energy of someone who read a blog post about it once.

Here is the problem: they are usually describing relaxation. Not mindfulness.

And they rarely explain the neuroscience behind why mindfulness actually works for pain, which means most people try it, do not immediately feel better, and conclude it does not work.

It works. But not the way most people think.

Mindfulness does not reduce pain by relaxing you. It structurally changes the brain regions that manufacture pain. There is a difference. And that difference matters enormously for how you practice it and what you expect from it.

The shift is not from pain to no pain. It is from pain plus suffering to pain with significantly less suffering. That is not a small distinction. For many people, it is the difference between being disabled by chronic pain and being able to live with it.`
      },
      {
        title: "What Mindfulness Actually Does to Your Brain",
        content: `Brain imaging studies on meditators with chronic pain reveal measurable structural differences in regions directly involved in pain processing.

**Reduced activation in:**
- Somatosensory cortex (pain intensity processing)
- Thalamus (the sensory relay station)
- Areas associated with pain-related emotional suffering

**Increased activation and thickness in:**
- Prefrontal cortex (rational evaluation and pain regulation)
- Attention control networks
- Areas associated with emotional regulation

**What this means practically:**
Mindfulness does not block pain signals. It changes how your brain responds to them.

Pain has two components:
- Sensory dimension: the raw physical sensation
- Affective dimension: the emotional suffering attached to it

Mindfulness consistently reduces the affective component. You may still feel the sensation. The suffering attached to it decreases. A 2011 study found a 40% reduction in pain unpleasantness after just 4 days of mindfulness training.

The sensation remained. The suffering reduced. That is the mechanism.`
      },
      {
        title: "The 4 Brain Regions Mindfulness Changes",
        content: `**1. The Prefrontal Cortex (The Regulator)**
The Science: Mindfulness practice thickens the prefrontal cortex over time. This region applies rational evaluation to pain signals and regulates the emotional distress component. More prefrontal cortex activity means more braking power on pain amplification.
💡 **Labelling Practice:** Name your pain sensations precisely as you observe them. "Burning. Pressure. Pulsing." This activates prefrontal regulation and moves pain processing from reactive to observational.

**2. The Anterior Cingulate Cortex (The Suffering Amplifier)**
The Science: The ACC processes the emotional dimension of pain, how much it bothers you, how threatening it feels. Mindfulness practice reduces ACC activation in response to the same pain signal.
💡 **RAIN Technique:** Recognize what is present. Allow it without fighting. Investigate with curiosity (what exactly does this feel like?). Non-identify ("I have pain. I am not pain."). This is not passive acceptance. It is active neural regulation.

**3. The Insula (The Body Map)**
The Science: The insula maps internal body states to threat significance. In chronic pain, it becomes hypervigilant, interpreting normal signals as threatening. Mindfulness recalibrates the insula toward accurate, non-threatening body awareness.
💡 **Body Scan:** Systematic, non-judgmental attention from head to feet. The goal is not to feel better. It is to build accurate, non-threatening awareness of your body's internal landscape.

**4. The Default Mode Network (The Rumination Engine)**
The Science: When not focused on a task, the brain defaults to self-referential processing. For chronic pain patients, the DMN often defaults to pain: what it means, how long it will last, what it prevents. This rumination amplifies pain. Mindfulness practice reduces DMN activity.
💡 **Breath Anchor:** 5 minutes of focused attention on breath sensations interrupts the default mode loop. Not because breathing is magic. Because sustained focus deactivates the rumination network.`
      },
      {
        title: "Why Most People Quit Before It Works",
        content: `The most common mistake: expecting mindfulness to feel peaceful.

It will not feel peaceful. Especially at first.

You are not trying to silence thoughts. You are training the ability to notice thoughts without being hijacked by them.

Each time your mind wanders to pain and you redirect attention back to your breath, that is a successful repetition. Not a failure. The neurological benefit comes from the redirection. Not the stillness.

**What to expect in the first 2 weeks:**
You will notice how much your mind wanders. You will find it frustrating. You may feel that you are bad at it. This is normal. The noticing is the practice.

**What to expect at 4-8 weeks:**
Reduced reactivity to pain during practice sessions. More space between pain sensation and emotional response to it.

**What the research shows at 8+ weeks:**
Measurable changes in brain structure and function in pain-relevant regions. This is not anecdotal. This is structural neuroplasticity.

Timeline for realistic expectation: 10-15 minutes per day for 8 weeks minimum before drawing conclusions.`
      },
      {
        title: "MBSR: What the Research Actually Shows",
        content: `Mindfulness-Based Stress Reduction (MBSR) is the most rigorously researched mindfulness program for chronic pain.

Results from meta-analyses:
- Moderate reductions in pain intensity
- Large effects on depression and quality of life
- Benefits lasting 6+ months after program completion
- Significant reductions in pain catastrophizing
- Improved physical function independent of pain reduction

The mechanism: MBSR does not teach you to ignore pain. It reduces the threat value your brain assigns to pain. Reduced threat value → reduced pain output from the same nervous system.

The program is typically 8 weeks, with 2.5 hour weekly sessions and daily home practice. The daily home practice is where the actual neural change occurs.

MBSR is available in-person, online, and through app-based programs. The delivery method matters less than the consistency of daily practice.`
      },
      {
        title: "Your 4-Week Mindfulness Starter Protocol",
        content: `Do not start with 30 minutes. Start with what you will actually do consistently.

**Week 1 (5 minutes daily):**
Breath awareness only. Sit or lie comfortably. Focus on the physical sensation of breathing. When the mind wanders, notice it and return. That is the entire practice.

**Week 2 (8 minutes daily):**
Add body scan. 3 minutes breath awareness, then 5 minutes systematic attention from head to feet. Notice without judging. Approach painful areas with curiosity, not avoidance.

**Week 3 (10-12 minutes daily):**
Add RAIN during pain moments. When pain spikes during the day, take 3-5 minutes to practice: Recognize, Allow, Investigate, Non-identify.

**Week 4 (12-15 minutes daily):**
Add labelling practice throughout the day. Name sensations, emotions, and thoughts as they arise. Build the habit of observational awareness outside formal practice.

The goal is not to be good at meditation. The goal is to change how your nervous system responds to pain.

Consistency over perfection. Every session counts.`
      }
    ]
  },

  'building-pain-management-support-team': {
    sections: [
      {
        title: "Why Single-Provider Care Keeps You Stuck",
        content: `Chronic pain is not a single-system problem.

It affects your biology, your nervous system, your psychology, your sleep, your relationships, your work, and your identity simultaneously. No single clinician is equipped to address all of that. No single appointment is long enough. No single discipline has all the tools.

This is why research consistently shows multidisciplinary care produces dramatically better outcomes than single-provider treatment. Not slightly better. Dramatically better.

- Higher rates of return to work
- Better functional outcomes sustained over time
- Lower long-term medication dependence
- More effective management of the psychological drivers

The question is not whether you need a team. The question is whether your current team is actually built for chronic pain. Because most are not.

Most chronic pain patients are being managed by a single GP with limited chronic pain training, occasional specialist referrals, and a prescription. That is not a multidisciplinary team. That is one person doing their best with inadequate backup.`
      },
      {
        title: "The Core Team: Who You Actually Need",
        content: `**1. The GP (The Coordinator)**
The Science: Your GP's primary role in chronic pain is coordination and systemic oversight, not sole treatment delivery. The best GPs for chronic pain understand the biopsychosocial model and make referrals to the right specialists rather than defaulting immediately to medication management.
What to look for: Someone who believes your pain is real, understands central sensitization, and is willing to coordinate between multiple providers.
Red flag: "Your scans are clear, there's nothing structurally wrong" delivered as a conclusion rather than a starting point.

**2. The Physiotherapist (The Movement Re-educator)**
The Science: The most effective physios for chronic pain are not primarily fixing structural problems. They are re-educating your nervous system about movement. They understand that pain with movement does not equal harm from movement. They help your brain learn this too.
What to look for: Graded exposure approach, pain neuroscience education, focus on building confidence in movement. Not just symptom reduction session by session.
💡 Before your first appointment: write down 3 movements you are currently avoiding due to pain. A good physio will help you systematically reintroduce these.

**3. The Pain Psychologist (The System Re-programmer)**
The Science: This is the most under-utilized and most evidence-backed member of the chronic pain team. Not because chronic pain is psychological in the dismissive sense. Because the psychological system is one of the three active drivers of chronic pain. CBT, ACT, and pain neuroscience education directly target the neural drivers of central sensitization.
This is not an alternative to physical treatment. It is a parallel track that makes physical treatment work better.

**4. The Occupational Therapist (The Life Adapter)**
The Science: OTs work on the gap between what chronic pain makes difficult and what you need to do in your daily life. Pacing strategies, activity modification, workplace ergonomics, energy management. Their question is not "how do we fix the pain?" but "how do we get you functioning at your highest possible level right now?"

**5. The Pharmacist (The Chemistry Auditor)**
Chronically overlooked. Your pharmacist has the deepest knowledge of your full medication stack: interactions, timing, dose optimization, evidence-based alternatives. Many chronic pain patients are taking combinations that interact in ways neither they nor their GP are fully tracking.
💡 Schedule a dedicated medication review. Ask specifically: "Are there any interactions in my current medications that might be affecting my pain or sleep?"`
      },
      {
        title: "The Extended Team (Based on Your Specific Needs)",
        content: `Beyond the core five, your extended team depends on what your chronic pain is actually affecting.

**For sleep problems:**
A sleep specialist or CBT-I trained clinician. Sleep is a primary treatment target in chronic pain, not a lifestyle factor. Treat it accordingly.

**For mental health impact:**
A psychiatrist (medication for depression or anxiety), a licensed counselor (ongoing psychological support), or a structured peer support program. The psychological burden of chronic pain is significant and undertreated.

**For nutritional factors:**
A dietitian with chronic pain or inflammatory condition experience. Dietary patterns have measurable effects on neuroinflammation, sleep quality, and pain sensitization.

**For movement-based support:**
An exercise physiologist who understands chronic pain physiology. The difference between a good graded exercise program and a harmful one for central sensitization is significant.

**Evidence-supported complementary options:**
- Acupuncture: reasonable evidence for specific conditions, particularly headache and back pain
- Massage therapy: short-term benefits for pain and muscle tension, useful as part of a broader plan
- Yoga and tai chi: combine movement with nervous system regulation, both have chronic pain research support`
      },
      {
        title: "How to Actually Coordinate the Team",
        content: `The biggest failure mode in multidisciplinary care is siloed treatment. Each provider seeing you in isolation. No communication between them. Conflicting advice with no one to resolve it.

Build this infrastructure now:

**Create a one-page care summary.**
Include: current diagnoses, all providers and their specific roles, current medications, allergies, treatment goals, and what has and has not worked. Bring this to every appointment.

**Designate a coordinator.**
Usually your GP. But if your GP is not engaged enough to play this role, it may need to be you. Being the project manager of your own care is not ideal. It is often the reality.

**Facilitate active communication.**
Ask each provider to copy others on key notes where possible. Use patient portals. Sign record-sharing releases. Mention other team members at each appointment so providers know who else is involved.

**Address conflicting advice directly.**
If two providers give contradictory recommendations, bring this to your coordinator rather than guessing which to follow. Conflicting advice is extremely common in chronic pain care and usually reflects gaps in communication, not disagreement in the evidence.`
      },
      {
        title: "Red Flags: Providers to Approach With Caution",
        content: `Not every provider you see will be right for chronic pain. Watch for these patterns:

**Red flags:**
- Dismisses or minimises your pain without explanation
- Uses language that increases threat ("your spine is crumbling," "significant degeneration")
- Focuses exclusively on finding structural causes without considering the nervous system
- Over-reliance on a single approach or modality
- Unwilling to coordinate with your other providers
- Does not listen to your specific experience or goals
- Promises complete cure with their particular approach

**Green flags:**
- Uses the biopsychosocial framework or at minimum acknowledges it
- Focuses on function and quality of life, not just pain scores
- Willing to communicate with your other providers
- Respects your input and incorporates your goals
- Honest about what their particular discipline can and cannot deliver
- Understands that chronic pain requires sustained effort over time, not short-term fixes`
      },
      {
        title: "Advocating for Yourself Effectively",
        content: `You are the expert on your own experience.

Providers have clinical expertise. But you know:
- Your lived experience in detail
- What is working and what is not
- Your values and personal priorities
- Exactly how pain affects your specific life

**Be prepared before every appointment:**
- Write down your top 3 concerns or questions
- Bring symptom data if you track it
- Know your current medication list
- Be clear on what your goals are for the appointment

**Communicate specifically:**
- Describe pain with precision: location, quality, pattern, triggers, what helps
- Express concerns directly rather than hoping they will be inferred
- Ask questions until you genuinely understand
- Repeat back what you have heard to confirm you understood

**Know your rights:**
- You have the right to a second opinion at any time
- You can change providers if the relationship is not working
- You can ask why a treatment is being recommended before agreeing to it
- Your voice is a clinical input, not an inconvenience

Chronic pain is complex and long-term. The relationship you build with your care team is a significant determinant of your outcome.`
      }
    ]
  },

  'activity-pacing-boom-bust-cycle-chronic-pain': {
    sections: [
      {
        title: "The Boom-Bust Cycle is a Nervous System Problem",
        content: `You have a good day. Energy is there. Pain is manageable.

So you do the laundry, and the dishes, and return the calls, and go for a walk, and cook properly for the first time in a week.

Three days later you can barely get off the couch.

This is the boom-bust cycle. And it is not a willpower problem. It is not a planning problem. It is a dysautonomia problem.

Your autonomic nervous system is responsible for energy allocation. In chronic pain states, this system malfunctions in a specific way. It underestimates available resources during off periods and overestimates them during on periods.

So when you feel good, your biological signal says "go." When you crash, it says "stop completely."

The result is a permanently unstable baseline rather than a recovering one. Deconditioning continues. Sensitivity increases. The window for manageable activity keeps narrowing.

Understanding this as a nervous system problem rather than a motivation or discipline problem changes how you approach fixing it.`
      },
      {
        title: "The 4 Biological Mechanisms Behind Boom-Bust",
        content: `**1. Post-Exertional Malaise (The Delayed Crash)**
The Science: In sensitized nervous systems, physical or cognitive exertion triggers an immune and neurological cascade that does not peak for 12-48 hours. On the day you overdo it, you feel fine. Two days later, you cannot understand what happened. The delay is what makes the boom-bust cycle so difficult to self-correct without systematic data tracking.
💡 **The 50% Rule:** On good days, complete 50-60% of what you think you can manage. Build in the buffer the delayed response requires.

**2. Allostatic Load (The Debt Accumulation)**
The Science: Every stressor, whether physical, emotional, cognitive, or environmental, adds to your allostatic load. This is the cumulative physiological burden on your stress response systems. Chronic pain patients are typically operating with a much higher baseline load than the average person. Each boom adds to a debt the bust is trying to repay.
💡 **Daily Load Audit:** Each morning, rate your load across 4 dimensions: physical, emotional, cognitive, social (1-10 each). Use this total to calibrate the day's activity level before you commit to anything.

**3. Nervous System Sensitization (The Amplified Crash)**
The Science: Post-exertional crashes in sensitized nervous systems are not proportional. A modest overshoot of your energy budget can trigger a disproportionate crash because the sensitized nervous system amplifies recovery signals the same way it amplifies pain signals. The overcorrection is a feature of sensitization, not a measure of how much damage was done.
💡 **Symptom Tracking with a 48-Hour Lag:** Track activity levels and symptoms together, looking at what happened 2 days prior. This reveals your actual tolerance windows, which are consistently different from how you feel in the moment.

**4. Psychological Overestimation (The Good Day Trap)**
The Science: Pain relief feels like recovery. It is not always recovery. On good days, the temporary reduction in pain, fatigue, and cognitive load creates a subjective sense of capacity that consistently exceeds your actual physiological reserves. This is one of the most common and damaging cognitive errors in chronic pain self-management.`
      },
      {
        title: "How to Find Your Real Baseline",
        content: `Your baseline is the amount of activity you can sustain WITHOUT triggering a crash or flare.

Not your best-day capacity. Your every-day capacity.

**Step 1: Track for 2 weeks without changing behavior.**
Record what activities you do, how long, pain and fatigue levels before and after, and any crashes. Do not try to fix anything yet. Build the data picture first.

**Step 2: Identify your crash-free tolerance for key activities.**
How long can you walk before symptoms escalate? Sit at a computer? Stand while cooking? Do these need to be done in multiple shorter sessions?

**Step 3: Set your starting baseline at 60-70% of your crash-free tolerance.**
Example: If you can walk 20 minutes before symptoms increase, your baseline walk is 12-14 minutes.

Why start lower? Because you need a buffer for allostatic load, delayed responses, and the natural variation in your daily starting state.

**Step 4: Separate activities into categories.**
Not everything draws from the same reserve. Physical, cognitive, emotional, and social activities all consume energy. Pace all four, not just physical activity.`
      },
      {
        title: "The Step-by-Step Pacing Protocol",
        content: `This protocol looks frustratingly slow. It is the fastest sustainable route to higher function.

**Week 1-2: Baseline only.**
Hold your calculated baseline on both good and bad days. The point is consistency, not performance. Resist doing more on good days.

**Week 3-4: Add 10%.**
Increase your baseline by 10% only if you have completed the previous 2 weeks without a crash or significant flare.

**Week 5+: Continue progressive 10% increments.**
Each increment requires 2 weeks of stable completion before progressing. If you crash, return to the previous level and hold there for an additional week before retrying.

**The mindset shift required:**
Stop measuring success by how much you did on your best day. Start measuring it by consistency across 7 days. A week where you did 60% of what you can on a good day, every single day without crashing, is a better week than one where you did 100% on Monday and were in bed Wednesday.

**What you are building:**
- A stable nervous system baseline
- Confidence that movement is safe
- Objective data on your actual tolerance
- A foundation from which to progressively expand

The goal is not permanent reduction. The goal is a launching pad.`
      },
      {
        title: "How Recalibrate Makes This Measurable",
        content: `Pacing requires data. Subjective memory is unreliable, especially with the 48-hour lag in post-exertional responses.

Recalibrate was built specifically to make this measurable:

**Track activities and symptoms together:**
Log what you do and for how long. Record pain, fatigue, and other symptoms in the same place. See patterns across days and weeks rather than isolated data points.

**Spot your actual triggers:**
Correlate activity logs with symptom spikes 24-48 hours later. Identify your specific tolerance windows. See which combinations of activities predictably lead to crashes.

**Pacing goals with data behind them:**
Set baseline goals based on your actual data rather than guesswork. Track completion and adjust as your real tolerance becomes clear.

**Share with your care team:**
Show your clinicians your activity patterns, symptom correlations, and pacing progress. This turns subjective reports into objective evidence. It dramatically improves the quality of clinical decision-making.

**Pain Science Academy:**
100+ lessons including dedicated pacing education, understanding the nervous system's role in energy regulation, and why consistency beats intensity.

Pacing is not about doing less forever. It is about building a foundation for doing more sustainably.`
      }
    ]
  },

  'fibromyalgia-flare-triggers-management': {
    sections: [
      {
        title: "The 5-Year Diagnosis Problem",
        content: `Fibromyalgia affects approximately 4% of the global population. The average time from symptom onset to diagnosis is 5 years.

In those 5 years, most patients undergo dozens of normal tests. They are told nothing is wrong. They are referred back to their GP. They are told to exercise more, stress less, or consider that anxiety might be contributing.

Eventually they get the fibromyalgia diagnosis. Usually with little to no explanation of what it actually is or what to do about it.

Here is what most of them are not told:

Fibromyalgia is a central sensitization syndrome. It is not primarily a muscle problem, a connective tissue problem, or a structural problem. It is a nervous system problem.

The muscles are not the source of the pain. The central nervous system is amplifying signals from the muscles.

This distinction matters enormously. Treatment that targets muscles and joints for a condition that lives in the central nervous system will produce partial results at best. And that is exactly what most fibromyalgia patients experience: partial, temporary improvement that never adds up to meaningful recovery.`
      },
      {
        title: "The Neuroscience of Fibromyalgia",
        content: `**1. Central Sensitization (The Stuck Alarm)**
The Science: The defining feature of fibromyalgia is widespread central sensitization. Pain thresholds are lowered across the entire body because the central nervous system has recalibrated its sensitivity upward. The same input that causes mild discomfort in most people causes genuine pain in a fibromyalgia nervous system.
This explains the widespread nature of the pain (it is a systemic nervous system state), its fluctuating intensity (the nervous system is dynamic), and why localized treatments do not produce lasting relief.

**2. Disrupted Sleep Architecture (The Recovery Failure)**
The Science: Fibromyalgia is consistently associated with specific disruptions in sleep architecture, particularly reduced slow-wave (deep) sleep. Deep sleep is the window during which your nervous system repairs and downregulates sensitization. Without it, the sensitized state cannot reset overnight.
💡 For fibromyalgia, sleep is not a lifestyle factor. It is a primary treatment target. Everything that disrupts sleep quality directly maintains fibromyalgia symptoms.

**3. Dysautonomia (The Broken Thermostat)**
The Science: Fibromyalgia is associated with dysregulation of the autonomic nervous system, specifically reduced heart rate variability and impaired transitions between sympathetic and parasympathetic states. This is why fibromyalgia patients often cannot tolerate exercise that would be routine for others. The autonomic system cannot shift appropriately between exertion and recovery.
💡 Track not just pain but energy crashes and recovery time after activity. Heart rate variability (many wearables measure this) gives objective data on your autonomic regulation state.

**4. Neuroinflammation (The Persistent Signal)**
The Science: Recent PET scan research has revealed neuroinflammation in the brains of fibromyalgia patients. Elevated immune activation in regions involved in pain processing. This is not systemic inflammation (which is why standard inflammatory blood markers are often normal in fibromyalgia). It is localized neurological inflammation in the pain system itself.`
      },
      {
        title: "Flare Triggers: Building Your Individual Map",
        content: `Fibromyalgia flares are temporary worsenings of symptoms lasting hours to weeks. They often feel random. Research shows most flares have identifiable triggers. The challenge is that triggers are highly individual. What causes a flare for one person may not affect another at all.

**Common trigger categories:**

Physical triggers:
- Overexertion and boom-bust activity patterns
- Poor sleep or significant sleep disruption
- Weather and temperature changes
- Infections and illness
- Hormonal fluctuations

Psychological triggers:
- Acute or chronic stress
- Anxiety and worry
- Major life changes
- Grief or emotional trauma

Lifestyle triggers:
- Dietary changes or specific food sensitivities
- Disrupted daily routines
- Travel and schedule disruption
- Dehydration

**The critical variable:** Many fibromyalgia triggers have delayed effects. A stressful event on Monday may not cause a flare until Wednesday or Thursday. This delay is what makes self-identifying triggers so difficult without systematic tracking.

**What to track:**
Daily symptoms (pain, fatigue, brain fog, sleep quality), stress levels, activity amounts, food and hydration, weather conditions, and menstrual cycle if relevant. Track consistently on good days and bad days. The pattern is in the contrast.`
      },
      {
        title: "What Actually Works: The Evidence",
        content: `The evidence for fibromyalgia treatment is clearer than most patients are told.

**Strong evidence supports:**
- Graded aerobic exercise: starting very low and progressing very slowly based on tolerance, not based on how you feel on a given day
- Cognitive Behavioral Therapy: particularly for sleep disruption, catastrophizing, and pacing
- Pain neuroscience education: understanding the central sensitization mechanism directly reduces threat perception and symptom severity
- Multidisciplinary pain programs: addressing biological, psychological, and social factors simultaneously
- Certain medications as adjuncts: duloxetine, pregabalin, and low-dose naltrexone have evidence for fibromyalgia, but as part of a comprehensive approach, not as standalone treatment

**Weak or no evidence supports:**
- Opioids: often worsen central sensitization over time and produce diminishing returns
- Rest-dominant approaches: deconditioning maintains and worsens sensitization
- Single-modality treatment: addressing only one system while ignoring the others

**The key principle:**
Fibromyalgia requires simultaneous treatment of the central nervous system, the sleep system, the autonomic system, and the psychological system. Any treatment plan that addresses only one of these will produce partial and temporary results. This is why most fibromyalgia patients have a long history of partial responses to individual treatments.`
      },
      {
        title: "Managing Flares When They Hit",
        content: `When a flare arrives, the goal is damage control and recovery, not elimination.

**During a flare:**
- Rest, but do not stop completely. Gentle movement prevents deconditioning and maintains nervous system confidence
- Prioritize ruthlessly. What must happen today? Everything else can wait without guilt
- Use heat or cold based on what works for your body, not on convention
- Stay hydrated. Dehydration consistently worsens fibromyalgia symptoms
- Practice self-compassion actively. Flares are not failures. They are part of a nervous system condition

**What not to do during a flare:**
- Push through in a way that extends or worsens it
- Cancel all activity entirely (this reinforces fear-avoidance)
- Make major decisions or commitments from the flare state
- Blame yourself (flares occur despite best management efforts)

**Duration guidelines:**
- Under 12 hours: maintain modified activity
- 24-48 hours: reduce activity significantly, focus on recovery basics
- Over 48 hours: rest as needed, focus on sleep, hydration, and gentle movement only

**After the flare:** Review what happened in the 48-72 hours before onset. Add to your personal trigger map. What helped during recovery? This knowledge compounds over time.`
      },
      {
        title: "Building Your Fibromyalgia Management System",
        content: `Fibromyalgia management is not a single intervention. It is a system.

The system has these components:

**Data foundation:**
Track symptoms, sleep, activity, stress, and triggers consistently. You cannot manage what you cannot measure. Recalibrate allows you to track 18+ health variables in one place with quick daily check-ins under 2 minutes.

**Pacing infrastructure:**
Apply the activity pacing protocol with fibromyalgia-specific attention to cognitive and emotional load, not just physical. Your energy budget in fibromyalgia is affected by all forms of exertion.

**Sleep as primary treatment:**
Treat sleep disruption as a clinical priority equal to pain management. CBT-I, circadian regulation, and vagal activation before bed are not optional for fibromyalgia management.

**Exercise (graded, not general):**
Start at a level that feels almost too easy. Progress at 10% per week only when stable. The goal is consistent gentle movement, every day, without crashes.

**Care team coordination:**
Fibromyalgia is best managed by a GP, physio, pain psychologist, and in more complex cases a specialist in central sensitization syndromes. Siloed single-provider care consistently underperforms.

You are not just collecting data. You are building a personalized playbook for your specific nervous system.`
      }
    ]
  },

  'central-sensitization-why-pain-persists': {
    sections: [
      {
        title: "When Protection Outlives the Threat",
        content: `Your body heals. Bone fractures knit. Soft tissue repairs. Inflammation resolves.

But your nervous system does not always get the update.

Central sensitization is what happens when your pain alarm system remains calibrated for an emergency that is no longer happening. The original threat is gone. The neural changes made to protect you during that threat have become self-maintaining.

This is one of the most common and most misunderstood phenomena in chronic pain. It explains why:

- Your scan shows nothing structurally wrong, but the pain is completely real
- Treatment directed at the original injury site consistently fails to resolve the pain
- Pain has spread to areas beyond the original injury
- Normal sensations like touch, temperature, and gentle pressure have become painful
- Your pain fluctuates based on sleep, stress, and emotion, not just physical activity

The nervous system learned to protect you. Now it needs to learn that the threat has passed.

This is not a psychological problem. It is a neurological one. And neurological problems can be changed with the right inputs.`
      },
      {
        title: "How the Brain Gets Stuck: The 4 Mechanisms",
        content: `**1. The Spinal Gate (The Amplifier)**
The Science: The dorsal horn of the spinal cord acts as a processing gate for pain signals before they reach the brain. In central sensitization, this gate becomes dysregulated. It lowers its threshold, fires more easily, and amplifies signals on the way up. This process (called "wind-up") means the brain receives an amplified danger signal even from minor or completely neutral stimuli.
💡 Understanding this changes your threat assessment. Pain after tissue healing does not mean new damage. It means your spinal gate is still running the old sensitized program. That program can be rewritten with the right inputs over time.

**2. Cortical Remapping (The Blurry Map)**
The Science: Your brain maintains a detailed map of your body in the somatosensory cortex. After prolonged pain in one area, this map becomes distorted. The painful area takes up disproportionate representational space. Adjacent areas blur together. This contributes to the spreading, diffuse quality of chronic pain and to the phenomenon of pain that moves around without clear cause.
💡 **Graded Motor Imagery:** Progressive visualization of pain-free movement, followed by mirror therapy, followed by actual gentle movement is a research-backed protocol for restoring accurate cortical mapping.

**3. Descending Inhibition Failure (The Broken Brake)**
The Science: Your brain has a natural pain-dampening system: the descending inhibitory pathway. It sends signals down the spinal cord to reduce pain signal transmission. In central sensitization, this system weakens. The input signal stays the same. The brake gets weaker. The result: disproportionate pain output from the same nociceptive input.
Exercise, restorative sleep, and certain medications help restore descending inhibitory function.

**4. Fear-Avoidance Memory (The Threat Archive)**
The Science: The hippocampus stores pain memories with strong emotional tags. The amygdala uses these memories to generate anticipatory pain responses. If a movement caused severe pain in the past, your brain can generate pain in anticipation of that movement. Before any tissue is engaged.
💡 **Graded Exposure with Safety:** Systematic reintroduction of feared movements, starting with visualization, then very small ranges, then progressive loading, teaches the amygdala that the threat memory is no longer accurate.`
      },
      {
        title: "Signs Your Pain is Centrally Sensitized",
        content: `Central sensitization produces a recognizable pattern. These signs point toward nervous system sensitization rather than ongoing tissue damage:

**Allodynia (pain from normally non-painful stimuli):**
- Light touch hurts
- Clothing or sheets feel painful
- Gentle pressure causes significant pain

**Hyperalgesia (exaggerated pain response):**
- Minor bumps cause severe pain
- Small injuries hurt far more than expected
- Pain is consistently disproportionate to the apparent cause

**Widespread or spreading symptoms:**
- Pain has expanded beyond the original injury site
- Multiple body areas affected simultaneously
- Migratory pain that moves around over days or weeks

**Other indicators:**
- Heightened sensitivity to light, sound, or smell
- Fatigue that does not improve with rest
- Cognitive difficulties and brain fog
- Pain that fluctuates with stress, sleep, and emotion
- Normal physical examination findings despite significant pain

**Conditions associated with central sensitization:**
- Fibromyalgia
- Chronic fatigue syndrome
- Irritable bowel syndrome
- Chronic headaches and migraines
- Chronic low back pain with no structural finding
- Complex regional pain syndrome`
      },
      {
        title: "Can Central Sensitization Be Reversed?",
        content: `Yes.

The same neuroplasticity that created sensitization can be redirected toward desensitization. Your nervous system learned to amplify pain. It can learn to turn the volume down.

This is not a recovery metaphor. It is measurable neurological change that shows up in imaging.

**What consistently helps:**

Pain neuroscience education: Understanding that pain does not equal damage reduces threat perception. Reduced threat perception directly reduces sensitization. Knowledge is medicine here in a literal neurological sense.

Graded exercise: Releases BDNF (the brain's repair chemical), endorphins, and serotonin. Restores descending pain inhibition. Rebuilds confidence in movement. Must be graded and paced appropriately for the sensitized system.

Sleep optimization: Restorative sleep is the primary window for nervous system recalibration. It is not a lifestyle factor in central sensitization management. It is the intervention.

Stress reduction: Chronic stress maintains the sympathetic activation that fuels sensitization. Relaxation techniques, nervous system regulation practices, and HPA axis regulation are direct clinical interventions.

CBT and ACT: Target the psychological inputs (catastrophizing, fear-avoidance, rumination) that maintain threat perception and keep the sensitization loop active.`
      },
      {
        title: "What Treatment Must Address",
        content: `Central sensitization does not respond to treatments that only target the peripheral tissues.

This is the most common reason chronic pain treatment fails. The diagnosis is accurate. The treatment is targeting the wrong system.

**Treatment that addresses the system:**
- Pain neuroscience education: changes the brain's threat assessment of pain signals
- Graded exposure therapy: retrains the amygdala's fear-avoidance memory
- Graded motor imagery: restores accurate cortical body mapping
- Descending inhibition restoration: exercise, sleep, and specific medications that rebuild the pain-dampening pathway
- Autonomic regulation: consistent practices that shift the nervous system out of chronic sympathetic activation

**Treatment that misses the system:**
- Repeated injections into already-healed tissue
- Surgery targeting structural findings that are not the actual pain source
- Passive treatment without education or active self-management component
- Medication management without addressing the drivers of sensitization

The goal of treatment is not to manage sensitized pain indefinitely. The goal is to change the state of the nervous system.

That requires inputs that speak to the nervous system directly. Not just the tissues around it.`
      },
      {
        title: "The Timeline for Recovery",
        content: `Central sensitization does not reverse in days or weeks.

This is the honest reality that most chronic pain patients are not given clearly. And the lack of this information leads to stopping effective treatments too early and concluding they did not work.

**Realistic timeline:**
- Weeks 1-4: Learning the science, establishing pacing, beginning gentle graded movement. You are building the foundation. Pain may not change meaningfully yet.
- Months 1-3: Nervous system beginning to respond to consistent inputs. Sleep often improves before pain does. Function often improves before pain scores do. These are meaningful signs of change in the right direction.
- Months 3-6: Measurable reductions in sensitization with consistent application of evidence-based approaches. Pain variability typically increases before overall levels decrease.
- 6-12+ months: Sustained improvement in function, pain, and quality of life with continued practice.

**How to measure progress correctly:**
Do not measure only pain intensity. Measure:
- How long you can walk, sit, stand, work
- Quality and duration of sleep
- Frequency and severity of flares
- What activities you can do now that you could not 3 months ago
- Emotional wellbeing and sense of control

Central sensitization is not a life sentence. It is a state your nervous system entered. With the right approach, applied consistently, it can shift.`
      }
    ]
  },

  'pain-catastrophizing-break-negative-thought-patterns': {
    sections: [
      {
        title: "The Brain is Trying to Help. It's Just Wrong.",
        content: `When pain hits and your mind immediately races to worst-case scenarios, that is not weakness.

That is not being dramatic.

That is your anterior cingulate cortex and amygdala doing exactly what they were designed to do: escalate threat responses to ensure survival.

The problem is that this system was designed for acute, short-term threats. It was not designed for chronic, persistent pain. When applied to chronic pain, threat escalation does not protect you. It makes everything significantly worse.

Pain catastrophizing is not a personality trait. It is a dysregulated threat detection pattern. Affecting up to 31% of the chronic pain population. Accounting for a measurable portion of pain severity independent of the underlying condition.

And dysregulated patterns can be recalibrated.

The key shift: you are not trying to become a more positive person. You are trying to restore accurate threat assessment. Your alarm system is misfiring. Not because you are weak. Because it was never built for this type of threat.`
      },
      {
        title: "The Neuroscience of Catastrophizing",
        content: `**1. The Amygdala (The Alarm Center)**
The Science: The amygdala fires a threat response faster than conscious thought. In people with high catastrophizing, it has become hypervigilant, treating chronic pain signals as existential threats requiring maximum response. This activation fires the HPA axis, raises cortisol, tightens muscles, narrows attention onto pain, and suppresses the brain's natural pain-dampening systems. All simultaneously.
Result: same pain stimulus, dramatically amplified experience.

**2. The Default Mode Network (The Rumination Engine)**
The Science: When not focused on an external task, the brain's default mode network activates. For people with chronic pain and high catastrophizing, the DMN defaults to pain: what it means, how long it will last, what it prevents, who it affects. Each cycle of rumination reinforces the neural pathway and increases the emotional distress component.
💡 **Pattern Interruption:** Any absorbing external task interrupts the default mode loop. It does not need to be dramatic. Five minutes of focused engagement with something genuinely interesting is a neurologically meaningful intervention.

**3. The Prefrontal Cortex (The Absent Regulator)**
The Science: Under threat activation (amygdala firing, cortisol elevated), the prefrontal cortex is functionally suppressed. It cannot counter the catastrophic thoughts because it has been taken offline by the very threat response those thoughts are generating.
This is why logic rarely helps in the middle of a catastrophe spiral. The rational mind is not available.
💡 **Physiology First:** Regulate the nervous system before attempting to challenge thoughts. Box breathing (4-4-4-4) or extended exhale (4s in, 8s out) reactivates prefrontal function. Then do cognitive work.

**4. The Pain-Amplification Loop**
The Science: Catastrophizing thoughts are not just a response to pain. They are a cause of additional pain. They activate the threat response, which activates the sympathetic nervous system, which increases muscle tension and reduces pain thresholds, which increases the pain signal, which confirms the catastrophic prediction.
Your brain becomes right about the catastrophe it predicted. But only because it created the conditions for it.`
      },
      {
        title: "How Catastrophizing Amplifies Pain",
        content: `The mechanism is direct and measurable.

**Pathway 1: Attention narrowing**
Catastrophizing forces attention onto pain. Sustained attention on pain activates more pain-processing brain regions and reinforces the neural connections involved in pain amplification. Where attention goes, neural activity follows.

**Pathway 2: Sympathetic activation**
Catastrophic thoughts activate the sympathetic nervous system. Elevated sympathetic activity: increases muscle tension around painful areas, raises systemic inflammatory markers, reduces pain thresholds, and suppresses the descending inhibitory system (your brain's natural pain dampener).

**Pathway 3: Behavioral avoidance**
Fear of pain leads to avoidance of movement and activity. Avoidance leads to deconditioning. Deconditioning leads to more pain. More pain leads to more fear and more catastrophizing. The loop becomes self-reinforcing.

**The research finding that matters:**
People with high catastrophizing scores experience the same injuries as more painful, recover more slowly, and develop chronic pain at higher rates than people with lower catastrophizing scores. The catastrophizing is not caused by worse pain. It is causing worse pain.

Changing the catastrophizing pattern is a direct clinical intervention. Not an optional add-on.`
      },
      {
        title: "Breaking the Pattern: The Right Order",
        content: `The wrong approach: trying to think positively while in the middle of a catastrophe spiral.

It does not work. The prefrontal cortex is offline. Logic cannot reach you there.

The right approach:

**Step 1: Physiological regulation first.**
Box breathing (4s in, hold 4s, out 4s, hold 4s) or extended exhale breathing (4s in, 8s out). 3-5 minutes minimum. This reactivates the prefrontal cortex. Now you can do cognitive work.

**Step 2: Label the pattern.**
"I notice I am catastrophizing." Labelling activates the prefrontal cortex. It creates distance between you and the thought. You are the observer. Not the thought itself.

**Step 3: Challenge the specific thought with specific evidence.**
Not generic positive thinking. Evidence-based challenges:
- "This will never end" → "My pain has varied before. I have had better periods."
- "Something must be seriously wrong" → "My last scan was clear. This is nervous system sensitivity."
- "I cannot cope with this" → "I am coping with it right now. I have managed before."

**Step 4: Take one small behavioral action.**
Do something that is not focused on the pain. Even 5 minutes of engagement with something else interrupts the avoidance pattern that reinforces catastrophizing.

This sequence works because it follows the neurological order of operations. Physiology first. Cognition second. Behavior third.`
      },
      {
        title: "The Daily De-Catastrophizing Practice",
        content: `Catastrophizing is a learned neural pattern. Changing it requires a counter-practice done consistently, not just in moments of crisis.

**Morning practice (5 minutes):**
Write down your current top pain-related worry. Then write 3 pieces of evidence that counter it. Do this before the worry has a chance to run the day's narrative.

**Thought tracking (ongoing):**
During the day, notice when rumination about pain starts. Name it: "There is the catastrophizing pattern." You do not need to fix the thought. Just observe it and return attention elsewhere.

**Pre-sleep practice (5 minutes):**
Write 3 factual, non-threatening statements about your body and your pain:
- "My tissue is healed. This is nervous system sensitivity."
- "I have had better days. I will have better days again."
- "I am managing. I have resources. I am not alone in this."

This gives the hippocampus accurate material to process during sleep rather than threat-laden rumination.

**Weekly review:**
Look back at pain-related predictions from the week. How many came true? How many did not? Build an evidence base that your catastrophic predictions are consistently inaccurate. The data is your most powerful cognitive tool.`
      },
      {
        title: "Working With a Therapist: What to Look For",
        content: `Self-directed practice is powerful. But for entrenched catastrophizing patterns, working with a trained clinician accelerates the process significantly.

**What works (evidence-based):**

CBT for chronic pain: directly targets catastrophizing through thought challenging, behavioral activation, and graded exposure to feared activities. Multiple meta-analyses show it reduces both catastrophizing and pain intensity.

ACT (Acceptance and Commitment Therapy): teaches psychological flexibility rather than thought suppression. Particularly useful for people who find thought challenging too effortful during high-pain periods.

**What to look for in a therapist:**
- Experience with chronic pain specifically (not just general anxiety or depression)
- Familiarity with the biopsychosocial model and central sensitization
- Uses CBT, ACT, or a combination approach
- Does not treat catastrophizing as a personal failing but as a treatable pattern
- Willing to coordinate with your physical care team

**Red flag:**
A therapist who treats chronic pain purely as a psychological problem without acknowledging the biological reality of sensitization. Catastrophizing is a driver of pain. It is not the only driver.

Catastrophizing is not your fault. But you have more leverage over it than you may currently believe. The right tools and the right support can change this pattern.`
      }
    ]
  },

  'gabapentin-alternatives-non-medication-pain-relief': {
    sections: [
      {
        title: "The Medication That Became the Default",
        content: `Gabapentin and its successor pregabalin became the default prescription for chronic pain conditions across the last decade.

The logic was reasonable. They modulate calcium channels, reduce excitatory neurotransmitter release, and dampen an overactive nervous system. For central sensitization, this makes mechanistic sense.

The problem is the growing body of research on long-term outcomes.

**What the data now shows:**
- 6+ months of gabapentin use associated with 29% higher risk of dementia in longitudinal studies
- Research linking long-term use to mild cognitive impairment at 85% higher rates
- Significant rates of physical dependence and a difficult withdrawal profile
- Side effect burden: dizziness, drowsiness, weight gain, cognitive dulling

This does not mean gabapentin is wrong for everyone. For some people, in specific clinical contexts, it is a useful tool. Short-term. As part of a broader plan.

But the research is increasingly clear that for most chronic pain conditions, non-pharmacological approaches produce equivalent or better outcomes with significantly fewer long-term risks.

And most chronic pain patients are not being offered those approaches. They are being offered a prescription.`
      },
      {
        title: "Exercise: The Pharmacological Equivalent",
        content: `Regular aerobic exercise is one of the most powerful interventions available for chronic pain. And it is almost universally underprescribed.

**What exercise does to the chronic pain system:**
- Releases endorphins and serotonin (natural analgesics)
- Stimulates BDNF production: the brain's own repair and growth chemical
- Restores descending pain inhibition (the broken brake in central sensitization)
- Improves sleep architecture (which independently reduces pain sensitization)
- Reduces neuroinflammation
- Builds confidence in movement and reduces fear-avoidance

A 2021 meta-analysis found exercise therapy comparable to pharmacological treatment for chronic pain, with dramatically better long-term outcomes and no adverse effects profile.

**The Science:** Endorphins bind to the same opioid receptors as morphine. BDNF (Brain-Derived Neurotrophic Factor) literally rebuilds and repairs neural pathways involved in pain processing. Exercise is not a soft intervention. It is a pharmacological one using your own chemistry.

💡 **The dose that matters:** 150 minutes per week of moderate aerobic activity is the evidence-based target. This cannot start there for most chronic pain patients. Start with 10 minutes of comfortable movement, 5 days per week. Progress by 10% per week. The target is weeks away. The start is today.`
      },
      {
        title: "What the Evidence Actually Supports",
        content: `Not all non-pharmacological treatments are equal. Here is what the research consistently supports:

**Cognitive Behavioral Therapy (The Nervous System Re-programmer)**
The Science: CBT for chronic pain directly targets the psychological drivers of central sensitization: catastrophizing, fear-avoidance, sleep disruption, and activity restriction. Multiple meta-analyses show effects comparable to medication. Critically: improvements continue to grow after treatment ends. Medication stops working when you stop taking it. Skill-based interventions compound over time.

**Pain Neuroscience Education (Knowledge as Medicine)**
The Science: Understanding how pain works is therapeutic in itself. It changes the brain's threat assessment. It reduces fear of movement. It reframes symptoms in a way that directly reduces catastrophizing. Studies show PNE alone produces measurable reductions in pain intensity and disability.
This is the most cost-effective, lowest-risk intervention in chronic pain. And it is almost universally under-utilized.

**Mindfulness-Based Stress Reduction (Neural Retraining)**
The Science: MBSR produces measurable structural changes in brain regions involved in pain processing. Reduces ACC activation, thickens the prefrontal cortex, and recalibrates insular mapping. A landmark study found 57% of MBSR participants experienced clinically significant reductions in pain intensity.

**Physical Therapy with Neuroscience Integration**
The Science: PT that combines graded exercise with pain neuroscience education consistently outperforms PT that focuses only on physical intervention. The education component changes how the nervous system responds to the physical work. Without it, the same exercises produce worse outcomes.`
      },
      {
        title: "Building Your Non-Pharmacological Plan",
        content: `The principle: stack multiple evidence-based interventions simultaneously. Each addresses a different driver of chronic pain. Together, they produce effects no single intervention can achieve.

**Foundation layer (address these first):**
Sleep optimization: everything else works better with restorative sleep. Treat sleep as a clinical priority, not a lifestyle factor.
Daily movement: 10-30 minutes to start, consistent pace. Not based on how you feel. Based on your established baseline.
Stress regulation: a daily nervous system downregulation practice, whether breathing, mindfulness, or another approach you will actually do.

**Active treatment layer:**
Pain neuroscience education (ongoing): learn how pain works. This changes your threat assessment every time you apply it.
Graded exercise therapy (progressive): build from your baseline at 10% increments per week.
CBT or ACT with a pain-trained psychologist: 12-16 sessions minimum before evaluating effectiveness.

**Self-management layer:**
Symptom and activity tracking with data: subjective memory is unreliable in chronic pain. Data beats guessing.
Pacing protocols: sustainable function over short-term peaks.
Recalibrate toolset: 200+ self-management tools, Pain Science Academy, care team integration, and AI-supported guidance.

The goal is not to replace medical care. It is to become an active participant in your recovery rather than a passive recipient of prescriptions.`
      },
      {
        title: "The Combination Effect",
        content: `The most important insight from the chronic pain research is this:

Combination approaches consistently outperform single interventions. Not by a small margin. By a large margin.

A 2020 systematic review of multidisciplinary pain programs found:
- 3-4x greater improvement in function compared to single-discipline care
- Significantly better long-term outcomes at 12 months
- Higher rates of return to work and normal activity
- Lower long-term opioid use

**Why combinations work so much better:**
Chronic pain is maintained by multiple simultaneous systems. Biological sensitization. Psychological threat amplification. Behavioral avoidance. Sleep disruption. Autonomic dysregulation.

Targeting one while leaving the others active is like turning down one speaker in a four-speaker sound system. The volume is still high.

Target all four simultaneously and the volume drops dramatically.

The combination plan that evidence supports:
- Graded exercise (biological and nervous system)
- CBT or ACT (psychological)
- Sleep optimization (autonomic and biological)
- Pain neuroscience education (threat assessment)
- Pacing and self-management (behavioral)

This is what Recalibrate was built to support. Not just one of these. All of them. In one place. With data connecting them.`
      },
      {
        title: "Working With Your Care Team on This",
        content: `Transitioning from a medication-dominant approach to a multimodal one requires a conversation with your care team. Not a unilateral decision.

**How to have that conversation:**

Lead with outcomes: "I would like to reduce my reliance on medication over time. What non-pharmacological options would you recommend alongside my current treatment?"

Ask specifically about referrals: pain psychologist, physiotherapist with chronic pain expertise, exercise physiologist, CBT-I for sleep.

Ask about evidence: "What does the research show about this approach for my specific condition?" You are entitled to evidence-based answers.

Bring your data: if you are tracking symptoms and activity in Recalibrate, bring that data. It makes the conversation concrete and shows you are engaged in your own management.

**If your care team dismisses non-pharmacological options:**
This is a red flag. The evidence base for these approaches is substantial and well-established. A provider who is unaware of it or dismisses it may not have the chronic pain expertise to manage your case optimally. A second opinion from a pain medicine specialist or a multidisciplinary pain clinic is reasonable and appropriate.

You are not passive in this. You are the central figure in your recovery. Your engagement with the evidence, your tracking, and your active participation in self-management are not supplementary. They are the treatment.`
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

  // Inject JSON-LD Schema markup for SEO
  useSchemaMarkup(post ? [
    generateArticleSchema(post),
    generateFAQSchema(slug),
    generateBreadcrumbSchema(post),
    generateOrganizationSchema()
  ] : []);

  if (!post || !content) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin w-8 h-8 border-4 border-purple-500 border-t-transparent rounded-full"></div>
      </div>
    );
  }

  // Find related posts
  const relatedPosts = blogPosts.filter(p => p.id !== post.id).slice(0, 3);

  const colorMap = {
    blue: 'bg-gradient-to-br from-blue-500 to-cyan-500',
    purple: 'bg-gradient-to-br from-purple-500 to-violet-500',
    indigo: 'bg-gradient-to-br from-indigo-500 to-blue-500',
    emerald: 'bg-gradient-to-br from-emerald-500 to-teal-500',
    rose: 'bg-gradient-to-br from-rose-500 to-pink-500',
    amber: 'bg-gradient-to-br from-amber-500 to-orange-500',
    fuchsia: 'bg-gradient-to-br from-fuchsia-500 to-pink-500',
    red: 'bg-gradient-to-br from-red-500 to-rose-500',
    violet: 'bg-gradient-to-br from-violet-500 to-purple-500',
    teal: 'bg-gradient-to-br from-teal-500 to-emerald-500',
  };

  const headerBg = colorMap[post.color] || 'bg-gradient-to-br from-rose-500 to-pink-500';

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-purple-50/30 to-indigo-50/50">
      <Helmet>
        <title>{post.title} | Recalibrate Pain Science Blog</title>
        <meta name="description" content={post.metaDescription || post.excerpt} />
        <meta name="robots" content="index, follow" />
        <link rel="canonical" href={`https://recalibratepain.com/blog/${post.slug}`} />
        <meta property="og:title" content={`${post.title} | Recalibrate`} />
        <meta property="og:description" content={post.metaDescription || post.excerpt} />
        <meta property="og:url" content={`https://recalibratepain.com/blog/${post.slug}`} />
        <meta property="og:type" content="article" />
        <meta property="og:site_name" content="Recalibrate" />
        <meta property="og:locale" content="en_US" />
        <meta property="og:image" content="https://recalibratepain.com/social-preview.jpg" />
        <meta property="og:image:width" content="1200" />
        <meta property="og:image:height" content="630" />
        <meta property="og:image:alt" content={`${post.title} - Recalibrate Pain Science Blog`} />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:site" content="@RecalibrateApp" />
        <meta name="twitter:creator" content="@RecalibrateApp" />
        <meta name="twitter:title" content={`${post.title} | Recalibrate`} />
        <meta name="twitter:description" content={post.metaDescription || post.excerpt} />
        <meta name="twitter:image" content="https://recalibratepain.com/social-preview.jpg" />
      </Helmet>

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
      <header className={`pt-24 pb-12 px-4 sm:px-6 ${headerBg}`}>
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
          <div className="flex items-center gap-4 text-white/80 text-sm flex-wrap">
            <span className="flex items-center gap-1">
              <User className="w-4 h-4" />
              <span className="font-semibold">{post.author}</span>
              {post.authorTitle && <span className="text-white/60">, {post.authorTitle}</span>}
            </span>
            <span className="flex items-center gap-1">
              <Calendar className="w-4 h-4" /> {post.date}
            </span>
            {post.linkedInUrl && (
              <a
                href={post.linkedInUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1 bg-white/20 hover:bg-white/30 transition-colors px-3 py-1 rounded-full text-white text-xs font-semibold"
                data-testid="linkedin-post-link"
              >
                <Linkedin className="w-3 h-3" /> View LinkedIn Post
              </a>
            )}
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
                  <span className="flex-shrink-0 w-8 h-8 bg-purple-100 text-purple-600 rounded-lg flex items-center justify-center text-sm font-bold mt-0.5">
                    {index + 1}
                  </span>
                  {section.title}
                </h2>
                <div className="text-gray-700 leading-relaxed">
                  {section.content.split('\n').map((paragraph, pIndex) => {
                    // Empty line
                    if (!paragraph.trim()) return null;

                    // Bold-only line (heading style)
                    if (paragraph.startsWith('**') && paragraph.endsWith('**') && !paragraph.slice(2, -2).includes('**')) {
                      return (
                        <p key={pIndex} className="font-bold text-gray-900 mt-5 mb-2 text-base">
                          {paragraph.replace(/\*\*/g, '')}
                        </p>
                      );
                    }

                    // Bold label line: **Label:** rest of text
                    if (paragraph.startsWith('**') && paragraph.includes(':**')) {
                      const colonIdx = paragraph.indexOf(':**');
                      const label = paragraph.slice(2, colonIdx);
                      const rest = paragraph.slice(colonIdx + 3);
                      return (
                        <p key={pIndex} className="my-2">
                          <strong className="text-gray-900">{label}:</strong>
                          {rest && <span dangerouslySetInnerHTML={{ __html: rest.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>') }} />}
                        </p>
                      );
                    }

                    // Bullet list item
                    if (paragraph.startsWith('- ')) {
                      return (
                        <div key={pIndex} className="flex items-start gap-2 my-1.5 ml-4">
                          <span className="w-1.5 h-1.5 bg-purple-500 rounded-full mt-2.5 flex-shrink-0"></span>
                          <span dangerouslySetInnerHTML={{ __html: paragraph.substring(2).replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>') }}></span>
                        </div>
                      );
                    }

                    // Numbered item
                    if (/^\d+\.\s/.test(paragraph)) {
                      return (
                        <div key={pIndex} className="flex items-start gap-2 my-1.5 ml-4">
                          <span className="text-purple-600 font-bold flex-shrink-0">{paragraph.match(/^\d+/)[0]}.</span>
                          <span dangerouslySetInnerHTML={{ __html: paragraph.replace(/^\d+\.\s/, '').replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>') }}></span>
                        </div>
                      );
                    }

                    // Default paragraph
                    return (
                      <p key={pIndex} className="my-3" dangerouslySetInnerHTML={{ __html: paragraph.replace(/\*\*(.*?)\*\*/g, '<strong class="text-gray-900">$1</strong>') }}></p>
                    );
                  })}
                </div>
                {/* Render diagram if section has one */}
                {(() => {
                  const diagramKey = section.diagram || diagramMap[slug]?.[index];
                  if (diagramKey === 'zones') return <ZonesDiagram />;
                  const DiagramComponent = diagramKey ? DIAGRAM_MAP[diagramKey] : null;
                  return DiagramComponent ? <DiagramComponent /> : null;
                })()}
              </section>
            ))}
          </div>

          {/* Author Bio */}
          <div className="mt-12 pt-8 border-t border-gray-200">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-full bg-gradient-to-br from-purple-500 to-indigo-600 flex items-center justify-center flex-shrink-0">
                <span className="text-white font-bold text-lg">TS</span>
              </div>
              <div>
                <p className="font-bold text-gray-900 text-base">Tristan Siokos</p>
                <p className="text-sm text-purple-600 font-medium mb-2">Founder, Recalibrate</p>
                <p className="text-sm text-gray-600 leading-relaxed">
                  Building the protocols to manage your biological operating system. Recalibrate is an all-in-one health and pain management ecosystem for patients, clinicians, and coaches.
                </p>
                <a
                  href="https://www.linkedin.com/in/tristan-siokos-750a86247/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 text-blue-600 font-semibold text-sm mt-3 hover:text-blue-800 transition-colors"
                  data-testid="author-linkedin-link"
                >
                  <Linkedin className="w-4 h-4" /> Follow on LinkedIn
                </a>
              </div>
            </div>
          </div>

          {/* LinkedIn CTA (if post has a linked LinkedIn post) */}
          {post.linkedInUrl && (
            <div className="mt-8 p-6 bg-blue-50 border border-blue-200 rounded-2xl flex items-start gap-4">
              <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center flex-shrink-0">
                <Linkedin className="w-5 h-5 text-white" />
              </div>
              <div>
                <p className="font-semibold text-gray-900 mb-1">Follow the conversation on LinkedIn</p>
                <p className="text-sm text-gray-600 mb-3">Tristan shares regular insights on pain neuroscience, nervous system regulation, and the Recalibrate ecosystem.</p>
                <a
                  href={post.linkedInUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 text-blue-600 font-semibold text-sm hover:text-blue-800 transition-colors"
                  data-testid="linkedin-article-cta"
                >
                  View original LinkedIn post <ExternalLink className="w-4 h-4" />
                </a>
              </div>
            </div>
          )}
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
                data-testid={`related-post-${relatedPost.id}`}
              >
                <span className="text-xs font-semibold text-purple-600 uppercase tracking-wide mb-2 block">{relatedPost.category}</span>
                <h3 className="font-bold text-gray-900 group-hover:text-purple-700 transition-colors mb-2 line-clamp-3 text-sm leading-snug">
                  {relatedPost.title}
                </h3>
                <p className="text-xs text-gray-500 flex items-center gap-1 mt-3">
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
            2026 Recalibrate. Evidence-based pain management.
          </p>
        </div>
      </footer>
    </div>
  );
}
