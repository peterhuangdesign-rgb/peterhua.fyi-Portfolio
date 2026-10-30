/* Presence core: content, résumé, themed background shader, profile media.
   Edit DATA / RESUME to change content. Drop real files into media/ and update tracks / photos paths. */
(function(){
const L={
  s:"Lorem ipsum dolor sit amet, consectetur adipiscing.",
  a:"Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris.",
  b:"Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit.",
  c:"Curabitur pretium tincidunt lacus. Nulla gravida orci a odio. Nullam varius, turpis et commodo pharetra, est eros bibendum elit, nec luctus magna felis sollicitudin mauris."
};
const CONTACT={email:"peterhuangdesign@gmail.com",linkedin:"https://www.linkedin.com/in/peterhuaux",linkedinLabel:"linkedin.com/in/peterhuaux",resume:"media/resume-human-factors.pdf",city:"Orange County, California"};

const DATA={
  research:[
    {id:"connection",kind:"research",t:"Technology and well-being: an independent interview study",short:"Technology & well-being",tag:"Self-directed UX research",
      ctx:["UX research","Research paper"],
      finding:"Mindful, purposeful, and social use of technology led to beneficial outcomes; lack of awareness, social comparison, and degraded critical thinking led to negative outcomes in subjective well-being.",
      line:"How Gen Z’s ubiquitous use of technology relates to mental health and well-being. The themes are technology, social connection, and life satisfaction.",
      lede:"I interviewed 7 participants aged 19–24, analyzed their pain points with qualitative data, and translated the insights into an academic research paper after receiving critique from 2 psychology professionals.",
      stats:[["7","Semi-structured interviews"],["3","Themes from grounded-theory coding"],["2","Psychology professionals gave critique"]],
      meta:[["Role","UX researcher, customer discovery, interviewer"],["Timeline","2 months, Oct – Nov 2025"],["Team","Peter H"],["Tools","Zoom"]],
      body:[
        {h:"Research question",quote:"To what extent do relationships through technology relate to levels of subjective life satisfaction among emerging adults?"},
        {h:"The problem",p:["Gen Z’s ubiquitous technology use relates to negative consequences in mental health and well-being. Exploring how we can bolster mental health in this era is key to improving life satisfaction and purpose."]},
        {h:"Why interviews",p:["I chose to conduct user interviews because these topics are nuanced and difficult to capture through data. Quantitative data collected relates to hours of use; qualitative methods are key here to explore the underlying dynamics of technology use."]},
        {h:"My process",steps:["Reviewed current psychological research","Formulated an interview protocol","Conducted 7 semi-structured interviews","Analyzed descriptive data on human motivations","Found insights through qualitative analysis, then grouped the themes in one table","Presented preliminary findings to a psychology class for critique and feedback"]},
        {h:"Participants",table:{cap:"Table 1. Demographic characteristics of participants",cols:["Participant","Age","Location","Major / work","Screen time (hrs)"],num:[0,1,4],
          rows:[["1","24","WA","Water technician","5"],["2","21","CA","Aviation","8"],["3","21","NY","Sociology","4"],["4","21","NY","NYU IDM","4"],["5","19","NY","NYU IDM","2"],["6","20","NY","NYU IDM","8"],["7","22","CA","Software founder","5"]]}},
        {h:"Themes and codes",note:"Three themes emerged through open and axial coding. Each code below has its definition and a participant’s own words.",
          themes:[
            {t:"Technology as a tool",codes:[
              ["Utility","Functional, usable, and useful for daily life",["I feel like first of all, being new to the city, I can’t really navigate without GPS... I don’t think I could function without it; I can’t really navigate without it. So I feel like that’s very essential."]],
              ["Dependence","Not being able to live without, a core necessity",["It would be inconvenient if I didn’t have it... But over the long term, it will be your worst enemy; Technology is a tool... but then it also creates FOMO. It creates a lot of anxiety for people... but then it also creates community."]],
              ["Habit formation","Engaging with devices frequently, without aim or purpose, and out of compulsion",["The algorithm of certain apps, specifically Instagram, is designed to trap you in there; I realized 90% of the time when I turn on my phone, it’s just to feel it... It’s become... like a water bottle... an emotional like buddy."]],
              ["Lack of awareness of time","Losing track of time, forgoing responsibilities, forgetting tasks",["I just, like, pull it out when you’re bored, that’s when, like, doom scrolling happens... when you’re just spending idle time; I realized I... scroll. I get lost very, very fast."]],
              ["Contrasts between in-person and digital connection","Non-verbal social cues, contextual clues, and accessibility",["It hinders our communication... when you’re in a long-distance relationship... there’s so much like body cues that you might not be able to see; You’re trusting someone only based on their voice... Rather than, like, your mannerisms, the way you act, the way you dress in person."]]]},
            {t:"Relationships within life satisfaction",codes:[
              ["Strong relationships","Authenticity, reciprocal, warm",["The first time I felt a genuine hug in my life... came from my grandma... There was just something about it that made me want to cry... it is just so different."]]]},
            {t:"Conflicts with adapting to AI",codes:[
              ["Improving","Being useful, freeing up cognitive space, benefiting life",["Creatives are very, very anti AI... instant backlash... But the people who are actually like making the models... they’re making this because they genuinely want to make people’s lives easier; I see... AI... as a collaborative tool for creativity."]],
              ["Degrading","Reducing creativity, intelligence, and ingenuity",["I feel like people will get dumber as AI, like, advances.","I feel like people are becoming overly reliant on it... We’re just gonna forget how to do things ourselves."]]]}]},
        {h:"Findings",p:["Technology that Gen Z utilized consisted of AI, social media, and software."],
          split:[["Led to beneficial outcomes",["Mindful use","Purposeful use","Social use"]],["Led to negative outcomes in subjective well-being",["Lack of awareness","Social comparison","Degraded critical thinking skills"]]]},
        {h:"The outcome",p:["This study extended existing literature on tech use, grounded in modern constructs such as AI. Some individuals felt lonely, some felt stuck, and this study sought to explain why users felt this way and how to counteract these stressors.",
          "For future directions, this comprehensive user research forms the basis for holistic and human-centric design. This structured process of finding participants, interviewing them to discover pain points, and identifying insights is key to the foundation of product design and UX design.",
          "With more time and financial support, I would pursue this project further by designing interventions to bolster well-being among Gen Z."]},
        {h:"Design implications",p:["Research informs design. These insights inform various design directions related to addiction, ethicality, and mental wellness. Some design directions are:"],
          chips:["An ethical scrolling mechanism","A social connectivity app","An easy-access mental wellness wearable","A third-space encouraging program"],
          p2:["Amidst the massive structural change of AI, students may also feel a sense of fear related to future directions in their careers and relationships. Companies are now identifying ways to utilize AI in their employees and workflow. This research connects to companies or students, informing many different design directions for different end goals.",
          "The research here acts as the foundation for any direction of design, led by the stakeholders in the business or problem."]},
        {h:"Full paper",paper:{cover:{src:"media/paper-cover.webp",alt:"Title page: Technology in Social Contexts: Subjective Well-being in Young Adults. Peter Huang. Seminar in Applied Psychology II, Dec 16, 2025",w:1194,h:822},
          title:"Technology in Social Contexts: Subjective Well-being in Young Adults",meta:"Seminar in Applied Psychology II: Theory, Research, and Practice · NYU · Dec 2025 · 27 pages",href:"media/paper-technology-social-contexts.pdf",
          note:"If you’re curious about what this process looks like, I highly recommend reading the full paper."}}
      ]},
    /* From Peter's paper "Personality and Life Satisfaction with Resilience as a Mediating Factor in Young Adults: A Mixed-Methods Study" (RM2, Aug 2025).
       Resilience results are left out until the scoring is re-checked: the paper reverse-codes BRS items 1, 3, 5 (the scale's reverse-coded items are 2, 4, 6). */
    {id:"resilience",kind:"research",t:"Personality, resilience, and life satisfaction",short:"Personality & resilience",tag:"Mixed methods · Survey + interview",
      ctx:["UX research","Research paper"],
      finding:"Neuroticism was significantly, moderately, and negatively correlated with life satisfaction (r = −.474, p < .001).",
      line:"How does neuroticism shape life satisfaction in young adults, and does resilience mediate that relationship?",
      meta:[["Role","Researcher"],["Method","Survey (n = 52) + interview"],["Date","Aug 2025"],["Course","Research Methods II, NYU"]],
      body:[
        {h:"Research questions",quote:"How does neuroticism shape life satisfaction? In what ways do adults perceive neuroticism impacting life satisfaction?"},
        {h:"Why mixed methods",p:["In our quantitative methods, life satisfaction is a self-report questionnaire about how close one’s life is to an ideal. In our qualitative methods, life satisfaction is a boundless, subjective, and ever-changing construct that evades rigid definition. Combining both supplements the data with a personal account that explains the dynamic."]},
        {h:"Measures",table:{cap:"Table 1. Validated scales and their internal consistency",cols:["Construct","Scale","Items","Alpha"],num:[2,3],
          rows:[["Neuroticism (predictor)","Mini IPIP","4",".676"],["Life satisfaction (outcome)","Satisfaction with Life Scale","5",".889"],["Resilience (mediator)","Brief Resilience Scale","6",".883"]]}},
        {h:"My process",steps:["Ran a Cronbach’s alpha reliability test on each scale","Built scale scores, reverse-coding the required items","Ran descriptive statistics and bivariate Pearson correlations","Followed Baron & Kenny: two simple regressions and one simultaneous regression, then a Sobel’s test","Interviewed one young adult over Zoom, matching the survey’s age range","Coded the interview into three themes and combined both sets of findings"]},
        {h:"Finding",p:["Neuroticism was significantly, moderately, and negatively correlated with life satisfaction (r = −.474, p < .001), explaining about 22% of the variance in life satisfaction scores (R² = .225)."]},
        {h:"Interview themes",items:[
          ["Resilience as maturity, expressed through action","“Resilience, to me, is like being able to deal with setbacks in a positive way.”"],
          ["Neuroticism as a prerequisite for resilience","“Maybe you just get so used to being neurotic that you become, like, highly resilient, because you learn how to solve problems that are insignificant very fast.”"],
          ["Life satisfaction is subjective","“You definitely can’t judge someone’s satisfaction from a third person perspective.”"]]},
        {h:"Limitations",p:["Quantitative: a low Cronbach’s alpha for the four-item neuroticism scale, selection and sampling bias, and confounding variables such as socioeconomic status. Qualitative: interviewer, selection, and cultural bias, since the interviewee is a close friend."]},
        {h:"What I’d do next",p:["I would give this research an Expansion purpose. Life satisfaction is difficult to quantify, and an Expansion purpose can explore it as it relates to spirituality, impermanence, and love."]}
      ]},
    /* From Peter's paper "Career within Spirituality and Religion: Perceptions of a Christian College Student" (Cultures of Psychology, Apr 2025). */
    {id:"career-faith",kind:"research",t:"Career within spirituality and religion",short:"Career & faith",tag:"Ethnography · Interview + observation",
      ctx:["UX research","Research paper"],
      finding:"Three themes arose: perfectionism, family tradition, and systemic values, shaped by traditional family values and an environment of acculturation.",
      line:"How does the Christian upbringing of one second-generation Mexican and Filipino man in the United States influence career choice?",
      meta:[["Role","Researcher, interviewer"],["Method","Interview + observation"],["Date","Apr 2025"],["Course","Cultures of Psychology, NYU"]],
      body:[
        {h:"Research question",quote:"How does the Christian upbringing of one Mexican and Filipino second-generation man living in the United States influence career choice?"},
        {h:"Why this study",p:["Career choice, occupation, and professional development are a source of uncertainty among many college students. Research on “calling” links spirituality with better wellness outcomes, but there are gaps around specific cultural and ethnic interactions with work and spirituality."]},
        {h:"My process",steps:["Recruited a mutual friend, anonymized as “TP”","Led a 40-minute semi-structured interview in a Manhattan park, guided by 10 questions on culture, family, career, and religion","Observed TP at his customer service job, looking for where religion, spirituality, and career meet","Analyzed the interview and observation into three themes","Wrote a critical reflexivity statement on my own biases"]},
        {h:"Themes",items:[
          ["Perfectionism","Striving for a perfect relationship with God carries into other parts of life, such as his organized system at work."],
          ["Family tradition","Religion isn’t explicit at work; it is focused internally and expressed through service to others."],
          ["Systemic values","“Just to be a decent human being, pretty much. It’s like Ethics 101.” He treats common ethical standards as separate from religion."]]},
        {h:"Reflexivity",p:["I share a religious upbringing and a second-generation immigrant experience with the participant, which may have led to assumptions. I believe that, in holding a fluid stance towards religion, I can approach research and analysis holistically."]},
        {h:"Limitations",p:["A single researcher and a single subject limit generalizability. A stronger observation site would have been a social and religious setting, such as a Sunday service or a university club."]}
      ]}
  ],
  design:[
    /* Chorvivo: in progress and under wraps. Not a project page; it appears only under Work on Profile. */
    {id:"wayfarer",kind:"design",t:"Wayfarer",short:"Wayfarer",tag:"Design-a-thon winner",ctx:["UX design","Design-a-thon, 1st place"],
      finding:"Users rejected text-based journaling, so I pivoted the UX strategy toward “frictionless capture” and “somatic grounding,” prioritizing screen-off interactions.",
      kicker:"Cornell University CU Design-a-thon 2026 · Winner",
      line:"An app designed to accompany you on your walk. Asynchronous social connection and easy access to journaling.",
      lede:"Wayfarer’s mission is to bring people together, to build a more connected culture through reflection, observation, and presence.",
      stats:[["Winner","CU Design-a-thon 2026"],["2 days","Design sprint"],["71","Participants"]],
      meta:[["Focus","UX design + research"],["Date","Apr 19, 2026"],["Role","UX designer, UX researcher, customer discovery"],["Tools","Figma, Figma Make"]],
      hero:{src:"media/wayfarer/hero.webp",alt:"Three Wayfarer screens: the welcome screen, the home screen with a Begin button, and the Walk Constellation map of past walks",w:1414,h:920},
      body:[
        {h:"The prompt",quote:"Design a digital application or product that reimagines one aspect of daily life."},
        {h:"The problem",p:["Gen Z is subject to manipulative tools like social media and doomscrolling to stay connected and entertained."]},
        {h:"My purpose",p:["To design an alternative to doomscrolling and addiction by encouraging emotional and social relationships within the user’s physical environment."]},
        {h:"My process",p:["Navigation apps are purely functional and prioritize efficiency, contributing to digital burnout and spatial amnesia. I hypothesized that designing a “spatial journal” could encourage users to take a slower look at their commute and experience “soft fascination” (Attention Restoration Theory)."],
          figs:[{src:"media/wayfarer/sketches.webp",alt:"Nine hand-drawn screen sketches: message, friend profile, home, login, onboarding, profile, walk summary, walk tracking and walk visualization pages",cap:"Initial screen sketches",w:3200,h:506},
                {src:"media/wayfarer/user-flow.webp",alt:"User flow diagram from the welcome page through onboarding, login, home, walk tracking, walk summary, profile, friends and sharing",cap:"Wireframe ideation",w:2800,h:1167}]},
        {h:"Usability testing",p:["I conducted moderated usability testing on my initial prototype, which relied heavily on text-based journaling and live social feeds.",
          "The users rejected the initial design. They noted that stopping to type a journal entry pulled them out of their physical environment, defeating the app’s purpose. They also found social notifications highly disruptive to the sanctuary of their walk."],
          pivot:"I immediately pivoted the UX strategy away from “active journaling” toward “frictionless capture” and “somatic grounding,” prioritizing screen-off interactions."},
        {h:"The solution",items:[
          ["Frictionless capture","A home-screen widget and Apple Watch integration that allows users to record ambient audio or voice memos in two taps, bypassing the keyboard entirely to keep their eyes on the city."],
          ["Opt-in, asynchronous social","Social features are strictly opt-in and asynchronous. Friends' traces are left on the map to be discovered organically, transforming the city into a shared canvas without the pressure of a live feed."],
          ["Location-based pings","A system of gentle, location-based pings that notify users when they walk past a coordinate where they previously left an artifact, fostering reflection on how their perspectives have changed over time."]],
          figs:[{src:"media/wayfarer/final-screens.webp",alt:"Ten final Wayfarer screens: onboarding, mission, shared presence, home, leave an impression, walk tracking, a saved memory, a friend’s trace and the walk constellation",cap:"Final screens",w:1800,h:1400},
                {src:"media/wayfarer/final-system.webp",alt:"Wayfarer on the lock screen, Apple Watch, notifications, quick actions and Control Center",cap:"Lock screen, Apple Watch, notifications and Control Center",w:1800,h:969}]},
        {h:"Future directions",items:[
          ["AI transcription","Integrating an AI transcription service for premium users. This would take the frictionless audio recorded during the walk and automatically transcribe it into a searchable, text-based journal for deep reflection once the user is back home."],
          ["Standalone watchOS app","Expanding the Apple Watch complication into a standalone, fully functional watchOS app, allowing users to leave their iPhones at home completely while still capturing spatial memories."],
          ["Institutional partnerships","Exploring institutional partnerships (such as university wellness programs or corporate HR). Wayfarer could be licensed as a preventative mental health tool, encouraging physical movement and cognitive decompression for students and employees facing digital burnout."]]},
        {h:"Project gallery",links:[["Event details","https://devpost.com/software/wayfarer-7cb68d"],["Pitch deck","https://www.figma.com/deck/1W9G5n3NwgrHuAjdkzplwi/Wayfarer-Pitch?node-id=1-427&viewport=-108%2C-35%2C0.52&t=4lySBLuYG08w1pSP-1&scaling=min-zoom&content-scaling=fixed&page-id=0%3A1"],["Demo video","https://www.youtube.com/watch?v=c-prWIRe-gc"]],
          gallery:[{src:"media/wayfarer/event-banner.webp",alt:"CUXD Design-a-thon banner, April 17 to 19, 2026",w:1600,h:812},
                   {src:"media/wayfarer/event-prompt.webp",alt:"The challenge: design a digital application or product that reimagines one aspect of daily life",w:1600,h:747},
                   {src:"media/wayfarer/event-theme.webp",alt:"The theme statement, Reimagining daily life",w:1600,h:808},
                   {src:"media/wayfarer/event-rubric.webp",alt:"Judging rubric: problem-solving and impact, innovation, visual design, user research and execution, 10 points each",w:1380,h:1382}]}
      ]},
    {id:"glenergy",kind:"design",t:"Glenergy",short:"Glenergy",tag:"Product design · Dark patterns study",ctx:["UX design","Team project"],
      finding:"While the aggressive designs successfully skewed user choices toward cost-saving options, they triggered a severe drop in employer trust.",
      kicker:"Product design · Team of 3 · Fall 2025",
      line:"A design of an Employee Onboarding Portal that incentivizes users to choose cost-effective options for the distributor/business. We tested to identify the effectiveness of “Dark Patterns” and discern perceptions of AI integration in business applications.",
      stats:[["3/5","users declined the AI chatbot feature"],["4/5","were skeptical of donating to charity through a corporation"],["5/5","felt confused by the client-recommended employer-match design"]],
      meta:[["Focus","Product design"],["Date","Nov 20, 2025"],["Role","UX designer, researcher"],["Timeline","4 weeks, Fall 2025"],["Team","Peter Huang, Devynne Best, Ananya Singh"],["Tools","Figma, Zoom"]],
      hero:{src:"media/glenergy/logo.webp",alt:"Glenergy logo: a glowing light bulb beside the wordmark on a navy background",w:1795,h:1117},
      body:[
        {h:"The problem",p:["A mock client requested an employee onboarding portal designed to aggressively steer users toward cost-effective benefit options using “Dark Patterns” and deceptive visual hierarchy."],
          note:"Dark patterns are deceptive user interface (UI) designs used on websites and apps to manipulate users into taking actions they did not intend, such as purchasing insurance, subscribing to services, or revealing personal data."},
        {h:"The constraints",p:["Our client noted limitations for this project."],steps:[
          "This project sprint needed to account for financial motivations by the business.",
          "The technical features needed to be more profit-oriented and business-centric, tasking us with changing minor details related to the user experience.",
          "This project needs to include an AI-integrated chatbot.",
          "By the end of the two-week sprint, we need to have conducted user interviews and present findings alongside a pitch for the client."]},
        {h:"The process",p:["As designers, my team stands between the business and the user. In this scenario, we have the responsibility to balance both parties' needs effectively. I initiated conversations in our team about the ethical considerations that result from our design decisions, establishing a consensus about how we approach this project.",
          "We developed three progressively assertive interface iterations. By conducting user testing on the early stages, we measured how specific behavioral nudges, such as altered visual hierarchy and friction in the opt-out processes, impacted both user decision-making and psychological sentiment.",
          "We began by iterating on user flow and low-fidelity mockups."],
          figs:[{src:"media/glenergy/user-flow.webp",alt:"User flow: home page to log in or sign up, then the dashboard, finish actions, and choose retirement and health care plans",cap:"User flow",w:1412,h:515}],
          pair:[{src:"media/glenergy/lofi-dashboard.webp",alt:"Low-fidelity dashboard wireframe with a side panel, header and a 0% slider",cap:"Low-fidelity dashboard page",w:1728,h:1802},
                {src:"media/glenergy/lofi-plan-intro.webp",alt:"Low-fidelity plan intro wireframe with the Glenergy Give Back banner and a $1 to $2 diagram",cap:"Low-fidelity plan intro page",w:1728,h:2457}],
          figs2:[{src:"media/glenergy/lofi-stage1.webp",alt:"Three low-fidelity Stage 1 screens: retirement plan, Glenergy Giveback info and health care plan pages",cap:"Low-fidelity Stage 1 screens",w:1416,h:708},
                 {src:"media/glenergy/lofi-summary.webp",alt:"Low-fidelity summary board: colour palette, About Us page, log-in, sign-up and plan screens",cap:"Low-fidelity summary",w:1800,h:944},
                 {src:"media/glenergy/chatbot.webp",alt:"Five chatbot messages that shift from guilt-tripping at 5% to praise at 0 to 1%, showing escalating pressure to give up employer match",cap:"Manipulative AI chatbot iterations",w:1376,h:700}]},
        {h:"The outcome",p:["Through user testing and a client meeting, our team identified user pushback on the manipulative design: users felt reduced trust in using the portal, software, and business. We then translated the results into the next steps for more human-centered design."],
          pull:["I feel like AI is everywhere, and incorporating it here would be great, but I don’t know how much I would trust or rely on it for my financials.","Tell me more where my money is going? Explain more about the charities and why I should donate to certain charity."]},
        {h:"User interview takeaways",p:["The data revealed a critical business trade-off: while the aggressive designs successfully skewed user choices toward cost-saving options, they triggered a severe drop in employer trust. Users recognized the manipulation, demonstrating that short-term financial gains via dark patterns create long-term risks to employee retention and brand perception."],
          figs:[{src:"media/glenergy/ba-home.webp",alt:"Home page before and after feedback: before has competing calls to action and a chatbot prompt; after shows the chosen plans and no pending actions",cap:"Before / after: home page",w:1418,h:800},
                {src:"media/glenergy/ba-retirement.webp",alt:"Retirement plan page before and after feedback: before is a bare dropdown; after shows three clearly labelled investment options",cap:"Before / after: retirement plan page",w:1403,h:736}],
          pair:[{src:"media/glenergy/hifi-choice.webp",alt:"High-fidelity Select Your Retirement Plan page: contribution choices, an employer-match slider and investment option",cap:"High-fidelity choice page",w:1728,h:3062},
                {src:"media/glenergy/hifi-plan.webp",alt:"High-fidelity A Retirement Plan That Gives Back page with the $1 to $2 donation explanation",cap:"High-fidelity plan page",w:1728,h:2238}]},
        {h:"My role",p:["UX researcher & designer. Team project; I expanded it further by designing the high-fidelity mockups as a solo project."]},
        {h:"Pitch and story",links:[["Client pitch deck","https://www.figma.com/deck/0mEYUGC2k4z2iIR7zjSgs3"]],
          figs:[{src:"media/glenergy/summary.webp",alt:"One-slide project summary: Ethical Friction, balancing business incentives and user trust in employee onboarding",cap:"Project summary in one slide",w:1440,h:1024}]}
      ]},
  ],
  me:["Jazz Piano","Videogame Music Production","Climbing","Weightlifting","Meditating","Photography"],
  tracks:[
    {t:"Lorem study no. 1",note:"Piano",src:"media/track-01.mp3"},
    {t:"Ipsum, for a game",note:"Game audio",src:"media/track-02.mp3"},
    {t:"Dolor sketch",note:"Piano",src:"media/track-03.mp3"}
  ],
  /* photos of Peter: add more files to media/ and list them here */
  mePhotos:[{src:"media/me-03.jpg",alt:"Peter smiling outside a chicken restaurant, giving a thumbs up"},{src:"media/me-01.jpg",alt:"Peter holding his cat"},{src:"media/me-02.jpg",alt:"Peter on a hillside"}],
  photos:[
    {src:"media/photo-07.jpg",alt:"Stone pagoda among weathered statues at the edge of a forest"},
    {src:"media/photo-08.jpg",alt:"Painted wooden pavilion over a garden pond, surrounded by trees"},
    {src:"media/photo-09.jpg",alt:"Brandenburg Gate framed by trees, with a pedicab parked in front"}]
};
/* Anything still marked Lorem is not shown: meta rows with a Lorem value are dropped,
   and a project with no written sections shows one honest "write-up in progress" line. */
const isLorem=v=>/lorem/i.test(String(v));
[...DATA.research,...DATA.design].forEach(p=>{p.meta=p.meta.filter(([,v])=>!isLorem(v));if(isLorem(p.line))p.line=""});
/* Music: the three tracks are 24-second placeholders. Set SHOW_MUSIC to true once real tracks or links are in. */
const SHOW_MUSIC=false;
if(!SHOW_MUSIC)DATA.tracks=[];
/* Work and research experience on Profile come from RESUME.experience (one source for Profile, the résumé page and the PDF). */
DATA.researchAll=[...DATA.research]; /* field work (Nordoff-Robbins, DOROT) lives on Profile, not here */
DATA.all=[...DATA.researchAll,...DATA.design];

/* From the human factors résumé (Resume_Peter_HuangHF.pdf). */
const RESUME={
  /* One source for the in-site résumé and media/resume-human-factors.pdf (rebuilt Oct 24, 2026 from Peter's human factors résumé). */
  contact:"Orange County, CA · (949) 933-0073 · peterhuangdesign@gmail.com · peterhua.fyi · linkedin.com/in/peterhuaux",
  experience:[
    {role:"Founding Designer",org:"Chorvivo",group:"work",now:true,note:"Work in progress, so it isn’t shown in this portfolio. I’m happy to talk about my role.",when:"Sep 2026 – present",ctx:["Design + research","A startup building a rehearsal-capture app for choreographers"],pts:["Lead UI/UX design and discovery interviews with choreographers","Turn interview findings into user flows, a design system and brand basics, with the founder and an engineer"]},
    {role:"UI/UX Intern",org:"Designity",group:"work",when:"Jun 15 – Sep 15, 2026 · 3 months",ctx:["UI/UX design + user research","A “creativity as a service” agency, remote"],pts:["Ran user research and usability tests using qualitative and quantitative methods","Turned findings into design recommendations that fit client and business constraints","Ran feedback sessions with stakeholders to keep designs consistent and usable","Kept research documentation organized across projects"]},
    {role:"Research & Operations Assistant",org:"DOROT",group:"research",when:"Aug – Dec 2025",ctx:["Behavioral data research","Social programs for older adults, New York City"],pts:["Analyzed behavioral data from 400+ older adults in SPSS to find usability and accessibility barriers","Wrote recommendations and reports for program stakeholders","Collected participant data from diverse groups of older adults for impact assessments"]},
    {role:"Clinical Observational Researcher",org:"Nordoff-Robbins Center for Music Therapy",group:"research",when:"Jan – May 2025",ctx:["Clinical observational research","Music therapy for mental health, New York City"],pts:["Observed music therapy sessions in a clinical mental-health setting and reviewed them with licensed therapists","Coded about 130 sessions into a behavioral database, using structured tracking protocols to follow client progress","Wrote a longitudinal case study from the session data"]},
    {role:"Operations Intern",org:"NOVA Kitchen and Bar",group:"other",when:"Jul – Aug 2024",ctx:["Operations","A restaurant in Orange, California"],pts:["Solved operational problems for 100+ guests a day in a busy restaurant","Worked with a 30+ person team to build faster workflows under time pressure"]}
  ],
  research:[
    ["Technology and well-being: an independent interview study","7 semi-structured interviews, grounded-theory coding, 27-page paper","Oct – Dec 2025"],
    ["Personality, resilience, and life satisfaction","Mixed methods: survey of 52, regression and mediation analysis, 1 interview","Aug 2025"],
    ["Career within spirituality and religion","Ethnography: semi-structured interview and workplace observation","Apr 2025"]
  ],
  education:{school:"New York University",unit:"Steinhardt School of Culture, Education, and Human Development",degree:"B.S. Applied Psychology",minors:"Minor: Integrated Design & Media (HCI/UX)",when:"May 2026",extra:"Dean’s List, Spring 2024",courses:"Human-Centered Research Methods I & II, Statistics for Behavioral Sciences, Agile Product Design, Ideation & Prototyping, Dark Patterns, Seminar I & II"},
  /* Strengths: Peter's traits, each with one line of context drawn from his own work. Shown on Profile, the résumé page and the PDF. */
  strengths:[
    ["Cross-functional collaboration","With a founder and engineer at Chorvivo, licensed therapists at Nordoff-Robbins, and stakeholders at Designity"],
    ["AI fluency","Claude, ChatGPT and AI workflows, used mindfully"],
    ["Research design rigour","Validated scales and reliability checks (resilience study); grounded-theory coding (interview study)"],
    ["Product thinking","Turned usability findings into design recommendations at Designity"],
    ["Agile","1st place in a design-a-thon sprint (Wayfarer); Agile Product Design coursework"],
    ["End to end","Took a study from research question to a 27-page paper on my own; at Chorvivo, from discovery interviews to user flows"]
  ],
  skills:[["Research methods","Usability testing, task analysis, qualitative and quantitative research, behavioral data analysis, research protocol design"],["UX design","Figma, Adobe Illustrator, Adobe InDesign, Adobe Photoshop"],["UX research","SPSS, Excel, R, Salesforce, qualitative and quantitative analysis"]]
};
const reduce=matchMedia("(prefers-reduced-motion: reduce)").matches;
const esc=s=>String(s).replace(/[&<>"]/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;"}[c]));

/* ---------- content ---------- */
/* context line: kind / field / detail (projects), or kind of work / what it is for (work). Lowercase, own line. */
const ctxHTML=(c,cls="ctx")=>c&&c.length?`<p class="${cls}">${c.map(esc).join(" / ")}</p>`:"";
const metaIn=k=>`<span class="m-in">${String(k).split(/\s+[·\/]\s+/).map(esc).join(" / ")}</span>`;
function figHTML(f,i){return `<figure class="cf"><button class="cf-z" type="button" data-z="${i}" aria-label="Enlarge: ${esc(f.cap||f.alt)}"><img src="${f.src}" alt="${esc(f.alt)}" loading="lazy"${f.w?` width="${f.w}" height="${f.h}"`:""}></button>${f.cap?`<figcaption>${esc(f.cap)}</figcaption>`:""}</figure>`}
function caseHTML(p,opts={}){
  const secs=p.sections||[];
  const H=opts.h||"h2";
  const title=opts.noTitle?"":`<${H} class="c-t${p.t.length>24?" long":""}">${esc(p.t)}</${H}>`;
  /* the project label rides at the start of the line under the title: lowercase, parts split by " / " as in the logo lockup */
  const lineHTML=`${ctxHTML(p.ctx)}${p.finding?`<p class="c-find"><span class="label">Key finding</span>${esc(p.finding)}</p>`:""}${p.line?`<p class="c-line">${esc(p.line)}</p>`:""}`;
  const imgs=[];const reg=f=>{imgs.push(f);return imgs.length-1};
  if(p.body){
    const hero=p.hero?figHTML(p.hero,reg(p.hero)).replace('class="cf"','class="cf cf-hero"'):"";
    const blocks=p.body.map(b=>{
      let h=`<section class="c-sec cb"><h2 class="c-h">${esc(b.h)}</h2><div class="cb-b">`;
      if(b.quote)h+=`<blockquote class="c-quote">${esc(b.quote)}</blockquote>`;
      (b.p||[]).forEach(x=>h+=`<p>${esc(x)}</p>`);
      if(b.pivot)h+=`<p class="c-pivot">${esc(b.pivot)}</p>`;
      if(b.items)h+=`<ol class="c-items">${b.items.map(([t,d])=>`<li><b>${esc(t)}</b><p>${esc(d)}</p></li>`).join("")}</ol>`;
      (b.pull||[]).forEach(q=>h+=`<blockquote class="c-pull">“${esc(q)}”</blockquote>`);
      if(b.note)h+=`<p class="c-note">${esc(b.note)}</p>`;
      if(b.steps)h+=`<ol class="c-steps">${b.steps.map(x=>`<li>${esc(x)}</li>`).join("")}</ol>`;
      if(b.split)h+=`<div class="c-split">${b.split.map(([t,xs],k)=>`<div class="${k?"neg":"pos"}"><span class="label">${esc(t)}</span><ul>${xs.map(x=>`<li>${esc(x)}</li>`).join("")}</ul></div>`).join("")}</div>`;
      if(b.chips)h+=`<ul class="c-chips">${b.chips.map(x=>`<li>${esc(x)}</li>`).join("")}</ul>`;
      (b.p2||[]).forEach(x=>h+=`<p>${esc(x)}</p>`);
      if(b.table){const T=b.table;h+=`<div class="c-tbl-w"><table class="c-tbl"><caption>${esc(T.cap)}</caption><thead><tr>${T.cols.map((c,k)=>`<th scope="col"${T.num.includes(k)?' class="n"':""}>${esc(c)}</th>`).join("")}</tr></thead><tbody>${T.rows.map(r=>`<tr>${r.map((c,k)=>`<td${T.num.includes(k)?' class="n"':""}>${esc(c)}</td>`).join("")}</tr>`).join("")}</tbody></table></div>`}
      if(b.paper){const P=b.paper;h+=`<div class="c-paper-card"><a href="${P.href}" target="_blank" rel="noopener" class="c-paper-cov"><img src="${P.cover.src}" alt="${esc(P.cover.alt)}" width="${P.cover.w}" height="${P.cover.h}" loading="lazy"></a><div><p>${esc(P.note)}</p><b>${esc(P.title)}</b><span class="c-paper-meta">${esc(P.meta)}</span><p class="c-links"><a class="btn" href="${P.href}" target="_blank" rel="noopener">Read the paper ↗</a><a class="btn" href="${P.href}" download>Download PDF</a></p></div></div>`}
      if(b.links)h+=`<p class="c-links">${b.links.map(([t,u])=>`<a class="btn" href="${esc(u)}" target="_blank" rel="noopener">${esc(t)} ↗</a>`).join("")}</p>`;
      h+=`</div></section>`;
      if(b.themes)h+=`<div class="c-themes">${b.themes.map((t,k)=>`<section class="c-theme"><h3><span>Theme ${k+1}</span>${esc(t.t)}</h3><dl>${t.codes.map(([c,d,qs])=>`<div class="c-code"><dt>${esc(c)}</dt><dd class="def">${esc(d)}</dd>${qs.map(q=>`<dd><blockquote>“${esc(q)}”</blockquote></dd>`).join("")}</div>`).join("")}</dl></section>`).join("")}</div>`;
      if(b.figs)h+=`<div class="c-figs">${b.figs.map(f=>figHTML(f,reg(f))).join("")}</div>`;
      if(b.pair)h+=`<div class="c-figs c-pair">${b.pair.map(f=>figHTML(f,reg(f))).join("")}</div>`;
      if(b.figs2)h+=`<div class="c-figs">${b.figs2.map(f=>figHTML(f,reg(f))).join("")}</div>`;
      if(b.gallery)h+=`<ul class="c-gal">${b.gallery.map(f=>`<li>${figHTML(f,reg(f))}</li>`).join("")}</ul>`;
      return h}).join("");
    p._imgs=imgs;
    return `${title}
  ${lineHTML}${p.lede?`<p class="c-lede">${esc(p.lede)}</p>`:""}
  ${p.stats?`<dl class="c-stats">${p.stats.map(([a,b])=>`<div><dt>${esc(a)}</dt><dd>${esc(b)}</dd></div>`).join("")}</dl>`:""}
  ${hero}
  <dl class="c-meta">${p.meta.map(([a,b])=>`<div><dt>${a}</dt><dd>${esc(b)}</dd></div>`).join("")}</dl>
  ${blocks}`;
  }
  return `${title}
  <dl class="c-meta">${p.meta.map(([a,b])=>`<div><dt>${a}</dt><dd>${esc(b)}</dd></div>`).join("")}</dl>
  ${p.line?`<p class="c-line">${esc(p.line)}</p>`:""}
  ${secs.length?"":`<p class="c-wip"><span class="label">Write-up in progress</span>The full case study is being written. Ask me about it: <a href="mailto:${CONTACT.email}" data-cta="email">${CONTACT.email}</a></p>`}
  ${secs.map(([h,b])=>`<section class="c-sec"><h2 class="c-h">${h}</h2><p>${b}</p></section>`).join("")}`;
}
function wireCase(root,p){if(!p||!p._imgs)return;root.querySelectorAll(".cf-z").forEach(b=>b.onclick=()=>Lightbox.open(+b.dataset.z,b,p._imgs))}
function resumeHTML(){
  const R=RESUME;
  return `<section class="c-sec" id="resume-edu"><h2 class="c-h">Education</h2><div class="xps">${eduHTML()}</div></section>
  <section class="c-sec" id="resume-body"><h2 class="c-h">Experience</h2><div class="xps">${R.experience.map(xpHTML).join("")}</div></section>
  <section class="c-sec"><h2 class="c-h">Research</h2><ol class="cv-list cv-res">${R.research.map(([t,d,w])=>`<li><div class="cv-h"><b>${esc(t)}</b><span>${esc(w)}</span></div><p class="cv-role">${esc(d)}</p></li>`).join("")}</ol></section>
  <section class="c-sec"><h2 class="c-h">Strengths</h2>${strengthsHTML()}</section>
  <section class="c-sec"><h2 class="c-h">Skills</h2><dl class="pf-skills">${R.skills.map(([a,b])=>`<div><dt>${esc(a)}</dt><dd>${esc(b)}</dd></div>`).join("")}</dl></section>`;
}
/* Peter’s own words (peterhua.fyi), grammar fixes only. */
const PROFILE={
  about:["My foundation in psychology is important for human-centric design, a skill needed in a future empowered by AI.",
    "I translate quantitative and qualitative data into a clear direction for design.",
    "I’m fascinated by art and science, I prioritize physical and mental health, and I’m inspired to build a future with integrity and humility.",
    "My approach is guided by curiosity, creativity, and a constant search for better ways to understand the human experience."],
  memory:{q:"To feel the memory forming while living the moment.",p:[
    "During my time at NYU in New York City, I met many unique individuals, each with their own story and journey.",
    "I explored topics in philosophy and art, music and media, and research and science. I’m now an avid climber, jazz enthusiast, and cat owner.",
    "I’m fascinated by how people think, which drives me to pursue a career in UX research and human factors. In the future, I hope to travel, read, and create a podcast."]},
  why:["I find joy in the dynamics of human connection. Through my biology or my upbringing, I’ve noticed that being seen truthfully by others is a guiding value I identify with. Technology has influenced these human connections, for better or for worse. It is a goal of mine to improve the connections people have with one another through digital means. As technology leaps further and further, our humanity is questioned again and again: What defines a human? What are the ideals we strive for? What makes us feel truly alive? My professional aspiration is to enhance the human experience with technology through observation, discussion, and analysis.",
    "I graduated from NYU with a Bachelor’s in Applied Psychology, an experience that helped me build analytical, statistical, and empathetic skills. In addition, I focused my efforts on a minor in Integrated Design & Media, becoming familiar with common design tools and processes such as ideation, interviews, and agile product design.",
    "These experiences, coupled with my work helping disadvantaged communities, such as children with disorders and adults with functional impairments, are a testament to my goal of improving how humans interact with the world and with one another.",
    "As an emerging professional, I am driven to craft digital experiences for human connection. This is where the unfinished story stands. I’m eager, creative, and curious about future opportunities in user experience design and product design.",
    "I hope to explore and excel in this career with communication, agency, and an open curiosity."],
  substack:{url:"https://petersworld.substack.com/",label:"petersworld.substack.com",note:"Where I share all things philosophy, art, and meaning."}
};
/* One entry layout for Profile and the résumé page: organisation + dates, role, context line, confidential note, bullets. */
/* Education, one layout for Profile and the résumé page: school + date, degree, minors, school unit, honours and coursework. */
const strengthsHTML=()=>`<ul class="strengths">${RESUME.strengths.map(([t,d])=>`<li><b>${esc(t)}</b><span>${esc(d)}</span></li>`).join("")}</ul>`;
function eduHTML(){const E=RESUME.education;
  return `<article class="xp edu"><div class="cv-h"><b>${esc(E.school)}</b><span>${esc(E.when)}</span></div>
    <p class="cv-role"><b>${esc(E.degree)}</b></p><p class="cv-role">${esc(E.minors)}</p><p class="edu-unit">${esc(E.unit)}</p>
    <ul class="xp-pts"><li>${esc(E.extra)}</li><li>Coursework: ${esc(E.courses)}</li></ul></article>`}
function xpHTML(e){
  return `<article class="xp${e.now?" now":""}"><div class="cv-h"><b>${e.now?`<span class="now-tag">Now</span>`:""}${esc(e.org)}</b><span>${esc(e.when)}</span></div>
    <p class="cv-role">${esc(e.role)}</p>${ctxHTML(e.ctx)}
    ${e.note?`<p class="xp-note"><span class="xp-lock" aria-hidden="true"></span><span><b>Confidential</b> ${esc(e.note)}</span></p>`:""}
    <ul class="xp-pts">${e.pts.map(x=>`<li>${esc(x)}</li>`).join("")}</ul></article>`;
}
/* What guides me (was "What is my why"): the same words, split into short parts so it reads in steps.
   The first paragraph is split at its sentence breaks; nothing is reworded. */
function whyParts(){const P=PROFILE,W=P.why;
  const first=W[0].split(/(?<=\.) (?=Technology has|As technology)/);
  return [first.map(x=>`<p>${esc(x)}</p>`).join(""),`<p>${esc(W[1])}</p>`,
    `<p class="pf-q">“${esc(P.memory.q)}”</p>`+P.memory.p.map(x=>`<p>${esc(x)}</p>`).join(""),
    W.slice(2,4).map(x=>`<p>${esc(x)}</p>`).join(""),`<p>${esc(W[4])}</p>`]}
/* Profile, first half = work (about, current work and internship, research experience, skills). Second half, after "Beyond work" = the person (why, photos, outside of work, music, photography). */
function profileHTML(opts={}){
  const H=opts.h||"h2",P=PROFILE,W=P.why;
  return `<${H} class="c-t">Profile</${H}>
  <div class="pf-top"><img class="pf-portrait" src="media/portrait.jpg" alt="Portrait of Peter Huang" width="512" height="512"><div class="pf-about">${P.about.map(x=>`<p>${esc(x)}</p>`).join("")}</div></div>
  <section class="c-sec" id="education"><h2 class="c-h">Education</h2><div class="xps">${eduHTML()}</div></section>
  <section class="c-sec" id="experience"><h2 class="c-h">Work</h2><div class="xps">${RESUME.experience.filter(e=>e.group==="work").map(xpHTML).join("")}</div></section>
  <section class="c-sec"><h2 class="c-h">Research experience</h2><div class="xps">${RESUME.experience.filter(e=>e.group==="research").map(xpHTML).join("")}</div></section>
  <section class="c-sec"><h2 class="c-h">Strengths</h2>${strengthsHTML()}</section>
  <section class="c-sec"><h2 class="c-h">Skills</h2><dl class="pf-skills">${RESUME.skills.map(([a,b])=>`<div><dt>${esc(a)}</dt><dd>${esc(b)}</dd></div>`).join("")}</dl></section>
  <h2 class="pf-break">Beyond work</h2>
  <section class="c-sec"><h2 class="c-h">What guides me?</h2><div class="pf-long why">
    ${whyParts().map(ps=>`<div class="why-part">${ps}</div>`).join("")}
    <p class="pf-sub"><a class="btn" href="${P.substack.url}" target="_blank" rel="noopener">Substack ↗</a> <span class="pf-note">${esc(P.substack.note)}</span></p>
    <p class="pf-mission"><a class="btn" href="#story">Read my mission</a></p></div></section>
  <section class="pf-photos" aria-label="Photos of Peter"><ul class="photos me-photos">${DATA.mePhotos.map((p,i)=>`<li><button class="ph" data-set="me" data-i="${i}" aria-label="Open ${esc(p.alt)}"><img src="${p.src}" alt="${esc(p.alt)}" loading="lazy"></button></li>`).join("")}</ul></section>
  <section class="c-sec"><h2 class="c-h">Outside of work</h2><ul class="me">${DATA.me.map(a=>`<li><b>${esc(a)}</b></li>`).join("")}</ul></section>
  ${opts.resume?resumeHTML():""}
  ${DATA.tracks.length?`<section class="c-sec"><h2 class="c-h">My music</h2><div data-player>
    <ol class="tracks">${DATA.tracks.map((t,i)=>`<li><button class="trk" data-i="${i}" aria-pressed="false"><span class="glyph" aria-hidden="true"></span><span class="tt">${esc(t.t)}</span><span class="tn">${esc(t.note)}</span><span class="td" data-d>–:––</span></button></li>`).join("")}</ol>
    <div class="seekbar"><input type="range" min="0" max="1000" value="0" step="1" aria-label="Seek" data-seek><span data-time>0:00</span></div>
    <audio preload="none"></audio></div></section>`:""}
  <section class="c-sec"><h2 class="c-h">Photography</h2><ul class="photos">${DATA.photos.map((p,i)=>`<li><button class="ph" data-set="photos" data-i="${i}" aria-label="Open ${esc(p.alt)}"><img src="${p.src}" alt="${esc(p.alt)}" loading="lazy" width="400" height="400"></button></li>`).join("")}</ul></section>`;
}
const fmt=s=>!isFinite(s)?"–:––":`${Math.floor(s/60)}:${String(Math.floor(s%60)).padStart(2,"0")}`;
function wireProfile(root){
  const box=root.querySelector("[data-player]");if(!box)return;
  const au=box.querySelector("audio"),seek=box.querySelector("[data-seek]"),time=box.querySelector("[data-time]");const btns=[...box.querySelectorAll(".trk")];let cur=-1;
  btns.forEach((b,i)=>{const a=new Audio();a.preload="metadata";a.src=DATA.tracks[i].src;a.addEventListener("loadedmetadata",()=>b.querySelector("[data-d]").textContent=fmt(a.duration));
    b.onclick=()=>{if(cur===i){au.paused?au.play():au.pause();return}cur=i;au.src=DATA.tracks[i].src;au.play().catch(()=>{})}});
  const sync=()=>btns.forEach((b,i)=>b.setAttribute("aria-pressed",String(i===cur&&!au.paused)));
  au.addEventListener("play",sync);au.addEventListener("pause",sync);au.addEventListener("ended",()=>{if(cur<btns.length-1)btns[cur+1].click();else sync()});
  au.addEventListener("timeupdate",()=>{const p=au.duration?au.currentTime/au.duration:0;seek.value=Math.round(p*1000);seek.style.setProperty("--p",p*100+"%");time.textContent=fmt(au.currentTime)});
  seek.addEventListener("input",()=>{if(au.duration)au.currentTime=seek.value/1000*au.duration;seek.style.setProperty("--p",seek.value/10+"%")});
  root.querySelectorAll(".ph").forEach(b=>b.onclick=()=>Lightbox.open(+b.dataset.i,b,b.dataset.set==="me"?DATA.mePhotos:DATA.photos));
}
const Lightbox=(()=>{let el,i=0,from=null,set=null;
  function build(){el=document.createElement("div");el.className="lb";el.hidden=true;el.setAttribute("role","dialog");el.setAttribute("aria-modal","true");el.setAttribute("aria-label","Photograph");
    el.innerHTML=`<div class="lb-bar"><span data-n></span><div><button class="btn" data-p>Prev</button><button class="btn" data-x>Next</button><button class="btn" data-c>Close</button></div></div><img alt="">`;
    document.body.appendChild(el);el.querySelector("[data-p]").onclick=()=>show(i-1);el.querySelector("[data-x]").onclick=()=>show(i+1);el.querySelector("[data-c]").onclick=close;
    el.addEventListener("click",e=>{if(e.target===el)close()});
    addEventListener("keydown",e=>{if(el.hidden)return;if(e.key==="Escape"){e.stopPropagation();close()}if(e.key==="ArrowRight")show(i+1);if(e.key==="ArrowLeft")show(i-1)},true)}
  function show(k){const L=set||DATA.photos;const n=L.length;i=(k+n)%n;const p=L[i];const img=el.querySelector("img");img.src=p.src;img.alt=p.alt;el.querySelector("[data-n]").textContent=`${i+1} / ${n}`}
  function open(k,f,list){if(!el)build();from=f;set=list||DATA.photos;show(k);el.hidden=false;el.querySelector("[data-c]").focus()}
  function close(){el.hidden=true;from&&from.focus()}
  return{open,close};})();

/* ---------- themes ----------
   land: fog + altitude contours, earth-brown index lines (original Presence)
   sea:  underwater teal: light from the surface, caustic webs, drifting bokeh
   (Sky was removed; saved "sky"/"fx" fall back to land) */
const THEMES={
  land:{mode:0,bg:"#FCFCFA",fog:"#DADDD7",line:"#585E62",acc:"#5F6E2E",alt:"#7A5636"},
  sea:{mode:1,bg:"#0D3640",fog:"#2B808A",line:"#BFEDE6",acc:"#7FD3D6",alt:"#CFF2E6"},
};
const THEME_ALIAS={light:"land",dark:"sea",fx:"land",sky:"land"};
const hex=h=>[1,3,5].map(i=>parseInt(h.slice(i,i+2),16)/255);
const FS=`precision highp float;uniform vec2 r,m,b;uniform float t,lens,rev,bs,thin,blob,mode,calm,dpr,amp,rmax,soft,gm;uniform vec3 cBg,cFog,cLine,cAcc,cAlt;
float h(vec2 p){return fract(sin(dot(p,vec2(127.1,311.7)))*43758.5453);}
float n(vec2 p){vec2 i=floor(p),f=fract(p);f=f*f*(3.-2.*f);return mix(mix(h(i),h(i+vec2(1,0)),f.x),mix(h(i+vec2(0,1)),h(i+1.),f.x),f.y);}
float fbm(vec2 p){float v=0.,a=.5;for(int i=0;i<5;i++){v+=a*n(p);p=p*2.03+vec2(1.7,9.2);a*=.5;}return v;}
void main(){vec2 uv=gl_FragCoord.xy/r;float as=r.x/r.y;vec2 p=uv*vec2(as,1.);float tt=t*.012;float k=1.-thin;
 vec2 mp=m*vec2(as,1.);float d=length(p-mp);float R=.07+rmax*lens;float Lm=(1.-smoothstep(R*.7,R,d))*(1.-calm*.75)*amp;
 float M=max(Lm,rev*(1.-calm)*smoothstep(1.-rev*1.4,1.-rev*1.4+.25,uv.x+(fbm(p*2.)-.5)*.3));
 vec3 col=cBg;
 if(mode<.5){
  float f=fbm(p*2.+vec2(tt,-tt*.6)+fbm(p*1.2-tt)*.9);col=mix(cBg,cFog,smoothstep(.32,.78,f)*k);
  float soil=smoothstep(.5,.85,fbm(p*.9+vec2(3.1,tt*.3)));col=mix(col,mix(cFog,cAlt,.3),soil*.16*k);
  float e=fbm(p*1.4+vec2(0.,tt*.4));float c1=1.-smoothstep(.02,.06,abs(fract(e*16.)-.5));float mj=1.-smoothstep(.02,.05,abs(fract(e*4.)-.5));
  col=mix(col,cBg,M*.65);col=mix(col,cLine,c1*M*.3);col=mix(col,cAlt,mj*(M*.38+.03*k));col=mix(col,cAcc,c1*mj*M*.3);
  vec2 dv=p-b*vec2(as,1.);dv+=(vec2(fbm(p*1.7+tt*3.),fbm(p*1.7+5.-tt*3.))-.5)*.22;dv.x*=1.5;dv.y*=.75;
  float g=exp(-dot(dv,dv)/(.05+.05*bs))*blob*k;col=mix(col,vec3(.86,.78,.71),smoothstep(.02,.45,g)*.4*(1.-g));col=mix(col,vec3(.07,.08,.09),pow(g,1.5)*.7);
 }else if(mode<1.5){
  /* sea: a quiet teal gradient at rest; caustic webs, light shafts and bokeh surface mainly inside the cursor lens, as Land’s contours do */
  float depth=smoothstep(-.15,1.1,uv.y*.85+(1.-uv.x)*.25+(fbm(p*.7+tt*.4)-.5)*.35);
  col=mix(cBg,cFog,depth*(.35+.45*k));
  float sh=fbm(vec2(p.x*2.2+p.y*.9,tt*1.4));float shaft=smoothstep(.55,.85,sh)*smoothstep(.1,1.,uv.y);
  col=mix(col,cAcc,shaft*(.05*k+.2*M));
  vec2 q=p*2.6+vec2(tt*.9,-tt*.6);float ca=abs(fbm(q)-fbm(q*1.15+vec2(5.2,1.3)+tt*.5));
  float web=1.-smoothstep(.0,.035,ca);col=mix(col,cAcc,web*(.04*k+.3*M)*(.4+.6*depth));
  vec2 g=p*4.+vec2(0.,t*.035);vec2 id=floor(g);vec2 f=fract(g)-.5;
  vec2 off=(vec2(h(id),h(id+3.1))-.5)*.5;float rad=.12+.2*h(id+7.7);float on=step(.62,h(id+1.9));
  float dd=length(f-off);float disc=1.-smoothstep(rad*.82,rad,dd);float rim=smoothstep(rad*.6,rad*.95,dd)*disc;
  vec3 bc=mix(cAcc,cAlt,h(id+4.4));col=mix(col,bc,on*(disc*.26+rim*.2)*(.1*k+.85*M)*(.55+.45*depth));
  /* lens: the water clears where the cursor rests and depth contours surface, as Land’s lens reveals altitude */
  float e2=fbm(p*1.4+vec2(0.,tt*.4));float r1=1.-smoothstep(.02,.06,abs(fract(e2*16.)-.5));float r2=1.-smoothstep(.02,.05,abs(fract(e2*4.)-.5));
  col=mix(col,cFog,M*.4);col=mix(col,cLine,r1*M*.32);col=mix(col,cAcc,r2*M*.6);
  float lum=dot(col,vec3(.2126,.7152,.0722));col*=min(1.,.38/max(lum,.001));
 }
 col=mix(col,cBg,soft);col+=(h(gl_FragCoord.xy+fract(t*.37*gm))-.5)*(mode>.5&&mode<1.5?.03:.035);gl_FragColor=vec4(col,1.);}`;
function Fog(canvas,{blob=true,blobAt=null}={}){
  const S={still:true,P:{amp:1,rmax:.2,soft:0,gm:1},soft:.3,mx:.5,my:.5,tx:.5,ty:.5,last:performance.now(),lens:0,rev:0,revT:0,thin:1,thinT:.8,calm:0,calmT:0,bx:.8,by:.5,blob:blob?1:0,theme:THEMES.land,frame:null};
  addEventListener("pointermove",e=>{S.tx=e.clientX/innerWidth;S.ty=1-e.clientY/innerHeight;S.last=performance.now()});
  const gl=canvas.getContext("webgl",{antialias:false});if(!gl)return S;
  const sh=(t,s)=>{const o=gl.createShader(t);gl.shaderSource(o,s);gl.compileShader(o);if(!gl.getShaderParameter(o,gl.COMPILE_STATUS))console.error(gl.getShaderInfoLog(o));return o};
  const pr=gl.createProgram();gl.attachShader(pr,sh(gl.VERTEX_SHADER,"attribute vec2 a;void main(){gl_Position=vec4(a,0,1);}"));gl.attachShader(pr,sh(gl.FRAGMENT_SHADER,FS));gl.linkProgram(pr);gl.useProgram(pr);
  gl.bindBuffer(gl.ARRAY_BUFFER,gl.createBuffer());gl.bufferData(gl.ARRAY_BUFFER,new Float32Array([-1,-1,3,-1,-1,3]),gl.STATIC_DRAW);
  const a=gl.getAttribLocation(pr,"a");gl.enableVertexAttribArray(a);gl.vertexAttribPointer(a,2,gl.FLOAT,false,0,0);
  const U={};["r","m","b","t","lens","rev","bs","thin","blob","mode","calm","dpr","cBg","cFog","cLine","cAcc","cAlt","amp","rmax","soft","gm"].forEach(k=>U[k]=gl.getUniformLocation(pr,k));
  let D=1;const size=()=>{const d=D=Math.min(devicePixelRatio||1,1.5);canvas.width=innerWidth*d;canvas.height=innerHeight*d;gl.viewport(0,0,canvas.width,canvas.height);S.wake&&S.wake()};size();addEventListener("resize",size);
  const t0=performance.now();
  if(blobAt){const [x,y]=blobAt(S);S.bx=x;S.by=y}
  const loop=now=>{
    /* still background (Oct 2026): the texture is drawn once per state change (page, theme, resize), faded 30% toward the page colour.
       No cursor lens, no drift, no grain shimmer, no wipe. The live path below is kept only for reference (S.still=false). */
    if(S.still){S.thin=S.thinT;S.calm=S.calmT;S.rev=0;S.lens=0;const [gx,gy]=blobAt?blobAt(S):[.8,.5];S.bx=gx;S.by=gy;const T=S.theme;
      gl.uniform2f(U.r,canvas.width,canvas.height);gl.uniform2f(U.m,-9,-9);gl.uniform2f(U.b,S.bx,S.by);gl.uniform1f(U.t,40);
      gl.uniform1f(U.lens,0);gl.uniform1f(U.rev,0);gl.uniform1f(U.bs,0);gl.uniform1f(U.thin,S.thin);gl.uniform1f(U.blob,S.blob);gl.uniform1f(U.calm,1);
      gl.uniform1f(U.mode,T.mode);gl.uniform3fv(U.cBg,hex(T.bg));gl.uniform3fv(U.cFog,hex(T.fog));gl.uniform3fv(U.cLine,hex(T.line));gl.uniform3fv(U.cAcc,hex(T.acc));gl.uniform3fv(U.cAlt,hex(T.alt));gl.uniform1f(U.dpr,D);
      gl.uniform1f(U.amp,0);gl.uniform1f(U.rmax,0);gl.uniform1f(U.soft,S.soft);gl.uniform1f(U.gm,0);
      gl.drawArrays(gl.TRIANGLES,0,3);running=false;return}
    const k=reduce?1:.08;S.mx+=(S.tx-S.mx)*k;S.my+=(S.ty-S.my)*k;
    const still=Math.max(0,Math.min(1,(now-S.last-250)/2600));const goal=still*still*(3-2*still);S.lens+=(goal-S.lens)*(goal>S.lens?.03:.15);if(reduce){S.lens=0;S.revT=0}
    S.rev+=(S.revT-S.rev)*(reduce?1:.045);S.thin+=(S.thinT-S.thin)*(reduce?1:.03);S.calm+=(S.calmT-S.calm)*(reduce?1:.06);
    const [gx,gy]=blobAt?blobAt(S):[.8,.5];S.bx+=(gx-S.bx)*.006;S.by+=(gy-S.by)*.006;const T=S.theme;
    gl.uniform2f(U.r,canvas.width,canvas.height);gl.uniform2f(U.m,reduce?-9:S.mx,reduce?-9:S.my);gl.uniform2f(U.b,S.bx,S.by);gl.uniform1f(U.t,reduce?40:(now-t0)/1000);
    gl.uniform1f(U.lens,S.lens);gl.uniform1f(U.rev,S.rev);gl.uniform1f(U.bs,S.lens);gl.uniform1f(U.thin,S.thin);gl.uniform1f(U.blob,S.blob);gl.uniform1f(U.calm,S.calm);
    gl.uniform1f(U.mode,T.mode);gl.uniform3fv(U.cBg,hex(T.bg));gl.uniform3fv(U.cFog,hex(T.fog));gl.uniform3fv(U.cLine,hex(T.line));gl.uniform3fv(U.cAcc,hex(T.acc));gl.uniform3fv(U.cAlt,hex(T.alt));gl.uniform1f(U.dpr,D);gl.uniform1f(U.amp,S.P.amp);gl.uniform1f(U.rmax,S.P.rmax);gl.uniform1f(U.soft,S.P.soft);gl.uniform1f(U.gm,S.P.gm);
    gl.drawArrays(gl.TRIANGLES,0,3);S.frame&&S.frame(S,now);
    /* near-plain pages: stop drawing once the fade has settled; wake() restarts it */
    const settled=S.pause&&Math.abs(S.thinT-S.thin)<.002&&Math.abs(S.calmT-S.calm)<.002&&S.rev<.01;
    if(!document.hidden&&!settled)requestAnimationFrame(loop);else running=false};
  let running=true;S.wake=()=>{if(!running&&!document.hidden){running=true;requestAnimationFrame(loop)}};
  requestAnimationFrame(loop);document.addEventListener("visibilitychange",()=>{if(!document.hidden){running=false;S.wake()}});
  return S;
}

window.Presence={wireCase,DATA,L,CONTACT,RESUME,THEMES,THEME_ALIAS,PROFILE,caseHTML,ctxHTML,metaIn,profileHTML,resumeHTML,wireProfile,Lightbox,Fog,reduce,esc};
})();
