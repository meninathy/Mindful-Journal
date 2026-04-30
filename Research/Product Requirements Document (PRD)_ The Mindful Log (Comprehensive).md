# Product Requirements Document (PRD): The Mindful Log (Comprehensive)

**Author:** Manus AI
**Version:** 1.0
**Date:** April 29, 2026

## 1. Executive Summary

**The Mindful Log** is an innovative AI-powered digital journal designed to bridge the gap between contemporary AI capabilities and evidence-based clinical psychology, specifically Cognitive Behavioral Therapy (CBT). Its primary function is to provide users with a 
"reflective mirror" that helps them identify cognitive distortions and emotional patterns in their daily writing. This document outlines the product's vision, core features, user experience, and technical considerations to guide its development.

## 2. Product Vision

To bridge the gap between AI technology and clinical psychology by providing a "reflective mirror" that helps users identify cognitive distortions in their daily writing. The Mindful Log aims to empower individuals with greater self-awareness and emotional regulation skills through a supportive, whimsical, and non-judgmental digital journaling experience.

## 3. User Personas

To ensure the application meets diverse user needs, we have identified two primary personas:

### 3.1. Persona A: Maya, The Psychology Student

*   **Demographics:** 20-24 years old, undergraduate or graduate psychology student.
*   **Goals:**
    *   Apply theoretical knowledge of CBT concepts (e.g., cognitive distortions) to real-world examples.
    *   Gain practical experience in identifying psychological patterns.
    *   Enhance personal self-awareness and emotional intelligence.
*   **Pain Points:**
    *   Difficulty in recognizing subtle cognitive distortions in personal thoughts or daily interactions.
    *   Lack of immediate, objective feedback on written reflections.
    *   Desire for a tool that integrates academic learning with personal growth.
*   **Usage Scenario:** Maya uses The Mindful Log to record her daily thoughts, academic reflections, or personal experiences. She then reviews the AI's analysis to see how it flags specific distortions, comparing it with her own understanding. This helps her solidify her learning and identify areas for personal development.
*   **Key Needs:** Accurate distortion flagging, clear explanations of AI analysis, ability to track learning progress.

### 3.2. Persona B: Leo, The AI Enthusiast & Self-Improver

*   **Demographics:** 28-35 years old, professional in tech or a related field, interested in AI's practical applications for personal development.
*   **Goals:**
    *   Explore the utility of AI and LLMs in enhancing emotional well-being.
    *   Gain deeper insights into personal emotional patterns and triggers.
    *   Utilize technology for continuous self-improvement and mindfulness.
*   **Pain Points:**
    *   Traditional journaling feels static and lacks interactive feedback.
    *   Desire for a more dynamic and insightful reflection process.
    *   Concern about privacy and data security when using digital tools for sensitive personal information.
*   **Usage Scenario:** Leo uses The Mindful Log as a daily reflection tool. He appreciates the AI-generated 
Reflective Mirror" prompts, which challenge his perspectives and encourage deeper introspection. He also values the "Journey Map" for visualizing his emotional progress.
*   **Key Needs:** Interactive AI feedback, secure data storage, clear visualization of trends, robust privacy controls.

## 4. Core Features

### 4.1. The Composition UI

**Description:** A user-friendly digital interface designed to mimic a physical composition book, providing a familiar and comforting environment for journaling. It supports the creation and management of multiple distinct journals.

**Functional Requirements:**
*   **FR1.1:** Users shall be able to create new journals, each with a unique, user-defined title (e.g., "Gratitude 2026," "Work Stress").
*   **FR1.2:** Users shall be able to select and switch between different journals seamlessly.
*   **FR1.3:** Within a selected journal, users shall be able to create new entries.
*   **FR1.4:** Each entry shall have a timestamp (auto-generated upon creation) and allow for free-form text input.
*   **FR1.5:** Users shall be able to edit and delete their journal entries.
*   **FR1.6:** The UI shall display a list of entries within the current journal, ordered chronologically.

**Non-Functional Requirements:**
*   **NFR1.1 (Usability):** The interface shall be intuitive and easy to navigate, requiring minimal onboarding.
*   **NFR1.2 (Aesthetics):** The UI shall incorporate the Doodles-inspired pastel color palette, rounded corners, and whimsical design elements (e.g., subtle cloud or planet motifs).
*   **NFR1.3 (Responsiveness):** The UI shall be fully responsive and optimized for both desktop and mobile devices.

### 4.2. NLP Analysis Engine (Chapter 11: Language Processing)

**Description:** An AI-powered engine that processes journal entry text to identify emotional sentiment and specific cognitive distortions based on CBT principles. This engine provides the core intelligence for the "reflective mirror" functionality.

**Functional Requirements:**
*   **FR2.1 (Sentiment Detection):** The system shall analyze each journal entry and classify its overall sentiment into one of three categories:
    *   **Positive:** Predominantly positive emotional tone.
    *   **Balanced:** Neutral or mixed emotional tone.
    *   **High-Distress:** Predominantly negative or highly emotional tone, indicating potential distress.
*   **FR2.2 (Distortion Flagging):** The system shall identify and flag specific cognitive distortions within the text. The initial set of distortions to be detected includes:
    *   **"Should" Statements:** Identifying phrases that impose rigid rules or expectations on oneself or others (e.g., "I should have done X," "They ought to do Y").
    *   **Catastrophizing:** Detecting instances where negative events are exaggerated to their worst possible outcome (e.g., "This is the end of the world," "Everything will be ruined").
    *   **All-or-Nothing Thinking (Black-and-White Thinking):** Identifying statements that present situations in extreme, absolute terms, without middle ground (e.g., "I'm a total failure," "Nobody cares about me").
*   **FR2.3 (Highlighting):** The system shall be able to highlight or indicate the specific sentences or phrases in the journal entry where a distortion was detected.

**Non-Functional Requirements:**
*   **NFR2.1 (Accuracy):** The NLP engine shall aim for a high level of accuracy in sentiment detection and distortion flagging, with a target F1-score of at least 0.75 for each distortion type.
*   **NFR2.2 (Latency):** Analysis of a typical journal entry (up to 500 words) shall be completed within 5 seconds.
*   **NFR2.3 (Scalability):** The engine shall be capable of handling concurrent analysis requests from multiple users.

### 4.3. The Grounding Aid

**Description:** An immediate, interactive tool designed to assist users experiencing acute anxiety or distress by guiding them through a sensory grounding exercise.

**Functional Requirements:**
*   **FR3.1:** A prominent, easily accessible button (e.g., "Ground Me Now") shall be available, particularly when a "High-Distress" sentiment is detected in an entry.
*   **FR3.2:** Upon activation, the grounding aid shall initiate a "5-4-3-2-1" sensory countdown exercise.
*   **FR3.3:** The exercise shall prompt the user to identify:
    *   5 things they can see.
    *   4 things they can feel.
    *   3 things they can hear.
    *   2 things they can smell.
    *   1 thing they can taste.
*   **FR3.4:** The UI shall provide clear, step-by-step instructions for each part of the exercise, with visual and textual cues.

**Non-Functional Requirements:**
*   **NFR3.1 (Accessibility):** The grounding aid shall be accessible to users with visual or auditory impairments (e.g., screen reader compatibility, clear audio prompts).
*   **NFR3.2 (Simplicity):** The interaction flow shall be extremely simple and require minimal cognitive load during a potentially stressful moment.

### 4.4. Supabase Persistence & Journey Map

**Description:** Secure storage of all user data (profiles, journals, entries, and AI insights) using Supabase, enabling features like historical tracking and visualization of emotional trends.

**Functional Requirements:**
*   **FR4.1 (Secure Storage):** All user profiles, journal entries, and associated AI analysis results shall be securely stored in a Supabase PostgreSQL database.
*   **FR4.2 (Data Retrieval):** Users shall be able to retrieve their historical journal entries and AI insights.
*   **FR4.3 (Journey Map Visualization):** The system shall provide a "Journey Map" interface that visually represents:
    *   **Mood Trends:** A time-series chart showing the sentiment (Positive, Balanced, High-Distress) of entries over a selected period (e.g., week, month, year).
    *   **Distortion Frequency:** A bar chart or similar visualization showing the prevalence of different cognitive distortions detected over time.
*   **FR4.4 (Filtering/Sorting):** Users shall be able to filter and sort their entries and visualizations by journal, date range, and sentiment.

**Non-Functional Requirements:**
*   **NFR4.1 (Security):** All data shall be protected by Row-Level Security (RLS) to ensure users can only access their own data. Data in transit and at rest shall be encrypted.
*   **NFR4.2 (Privacy):** The system shall adhere to best practices for data privacy, including anonymization of data sent to external AI services where feasible.
*   **NFR4.3 (Performance):** Retrieval and rendering of historical data for the Journey Map shall be efficient, even for users with a large number of entries.

## 5. Agentic Workflow: The "Reflective Mirror" Logic

**Description:** This section details the logic flow for how the AI agent processes a journal entry and generates a personalized, non-judgmental "Reflective Mirror" prompt, encouraging deeper self-reflection.

**Logic Flow:**

1.  **User Submission:** A user completes and saves a journal entry (`content`).
2.  **Initial Analysis Request:** The `content` is sent to the NLP Analysis Engine (an external LLM via API).
3.  **Sentiment & Distortion Detection:** The LLM processes the `content` and returns:
    *   `sentiment` (Positive, Balanced, High-Distress)
    *   A list of `distortions` detected (e.g., ["Should Statement", "Catastrophizing"])
    *   Optionally, `highlighted_phrases` corresponding to detected distortions.
4.  **Grounding Aid Trigger (Conditional):**
    *   **IF** `sentiment` is `High-Distress`:
        *   The system prioritizes displaying the "Grounding Aid" button prominently in the UI.
        *   The "Reflective Mirror" prompt generation may be deferred or presented as a secondary option.
    *   **ELSE (sentiment is Positive or Balanced):**
        *   Proceed to Reflective Mirror Prompt Generation.
5.  **Reflective Mirror Prompt Generation:**
    *   **Input to LLM:** The original `content`, the detected `sentiment`, and the list of `distortions`.
    *   **Prompt Engineering (Example):**
        ```
        
        You are an empathetic AI assistant designed to help users reflect on their journal entries. Your goal is to provide a non-judgmental, thought-provoking question that encourages deeper self-awareness, especially around cognitive distortions. Do not offer advice or diagnoses. Focus on open-ended questions.

        User's Journal Entry: """<original_content>"""
        Detected Sentiment: <sentiment>
        Detected Distortions: <distortions_list>

        Based on this, generate one reflective question for the user. Example: "You mentioned 'I should have.' What would happen if you gave yourself permission not to?"
        Reflective Question:
        ```
    *   **Output from LLM:** `mirror_prompt` (a single reflective question).
6.  **Persistence:** The `sentiment`, `distortions`, and `mirror_prompt` are saved to the `entries` and `insights` tables in Supabase.
7.  **UI Feedback:** The `mirror_prompt` is displayed to the user in the UI, encouraging further reflection.

## 6. Technical Considerations

### 6.1. Backend & Database
*   **Platform:** Supabase (PostgreSQL database, Authentication, Edge Functions).
*   **Authentication:** Supabase Auth for user management (email/password, potentially social logins).
*   **Database Schema:** As defined in the Technical Requirements Document (TRD).
*   **API:** Supabase auto-generates RESTful and GraphQL APIs for database interaction.

### 6.2. Frontend
*   **Framework:** React (with TypeScript).
*   **Styling:** Tailwind CSS for utility-first styling, potentially integrated with a component library (e.g., DaisyUI, Material UI) for Doodles-inspired components.
*   **State Management:** React Context API or Zustand/Jotai for simple global state.
*   **Data Fetching:** React Query or SWR for efficient data fetching and caching with Supabase.

### 6.3. AI Integration
*   **LLM Provider:** OpenAI (GPT-4.1-mini/nano) or Anthropic (Claude Code) via their respective APIs.
*   **API Key Management:** Securely managed using environment variables and Supabase Edge Functions to prevent exposure on the client-side.
*   **Prompt Engineering:** Iterative refinement of prompts for sentiment analysis, distortion flagging, and reflective mirror generation to optimize accuracy and tone.

### 6.4. Deployment
*   **Hosting:** Vercel or Netlify for the React frontend.
*   **Backend:** Supabase handles its own hosting.

## 7. Ethical Guidelines & Considerations

Given the sensitive nature of mental health data and AI-driven feedback, strict ethical guidelines are paramount.

*   **Non-Diagnostic:** The AI will explicitly state that it is not a licensed therapist and its feedback is for reflection only, not diagnosis or treatment.
*   **Privacy by Design:** All features will be developed with user privacy as a core principle, including robust data encryption and access controls.
*   **Transparency:** Users will be informed about how their data is used, what AI models are involved, and the limitations of AI analysis.
*   **Bias Mitigation:** Continuous monitoring and refinement of AI models to minimize biases in sentiment analysis and distortion detection across diverse user demographics.
*   **User Control:** Users will have full control over their data, including the ability to export, modify, and delete entries and accounts.

## 8. Future Enhancements (Post-MVP)

*   **Guided Journaling Prompts:** Curated prompts to help users explore specific themes or emotions.
*   **Integration with Wearables:** Connect with health tracking devices to correlate physiological data with journal entries.
*   **Community Features:** Opt-in, anonymous sharing of insights or patterns with a supportive community.
*   **Multi-language Support:** Extend NLP capabilities to support journaling in multiple languages.
*   **Customizable Distortions:** Allow users to define and track their own specific cognitive patterns.

## 9. References

[1] Doodles NFT. (n.d.). *Doodles.app*. Retrieved from [https://www.doodles.app/](https://www.doodles.app/)
[2] Martin, S. (n.d.). *Burnt Toast Creative*. Retrieved from [https://burnttoast.myportfolio.com/](https://burnttoast.myportfolio.com/)
[3] American Psychological Association. (n.d.). *Cognitive Behavioral Therapy*. Retrieved from [https://www.apa.org/ptsd-guideline/patients-and-families/cognitive-behavioral](https://www.apa.org/ptsd-guideline/patients-and-families/cognitive-behavioral)
[4] Supabase. (n.d.). *The Open Source Firebase Alternative*. Retrieved from [https://supabase.com/](https://supabase.com/)
