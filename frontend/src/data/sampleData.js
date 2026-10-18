/**
 * Pre-configured real-world examples for the 10-second Judge Quick Try
 */
export const SAMPLE_JOBS = [
  {
    id: "freelance-mvp",
    title: "Upwork Gig: Full-Stack React & Node MVP ($4,500)",
    shortLabel: "Freelance React & Node MVP",
    tone: "Persuasive Freelancer",
    resume: `Sarah Jenkins
Senior Full-Stack Developer & Freelance Contractor
San Francisco, CA | sarah.jenkins@example.com | github.com/sarah-dev

SUMMARY:
Results-driven Full-Stack Engineer with 5+ years of experience delivering high-velocity MVPs and responsive web applications for high-growth tech startups. Specialized in React 19, TypeScript, modern Tailwind CSS, and scalable Node.js microservices.

CORE SKILLS:
- Frontend: React 19, TypeScript, Next.js, Tailwind CSS, Redux Toolkit, Webpack/Vite
- Backend: Node.js, Express, PostgreSQL, RESTful APIs, Prisma ORM, JWT Authentication
- Tooling: Git, GitHub Actions CI/CD, Jest, Vitest, Linux, Vercel

RECENT PROJECTS:
1. SaaS Metrics Dashboard (2025): Spearheaded front-to-back development of an analytics platform servicing 45,000 active monthly users. Built responsive charts and secured sub-second API response times.
2. E-Commerce Checkout Overhaul (2024): Migrated legacy checkout flow to React + Tailwind, improving mobile conversion by 18%.

EDUCATION:
B.S. in Computer Science - University of California, San Diego`,
    job: `JOB POSTING: Full-Stack React & Node Developer for AI SaaS MVP
Client: NextWave Studio (Payment Verified | 4.9★ Upwork Client)
Budget: $4,500 Fixed Price | Timeline: 3 Weeks

We are looking for an experienced full-stack freelancer to build the MVP of our new AI-driven workflow web application.

What You Will Build:
- Modern, mobile-responsive dashboard in React (TypeScript + Tailwind CSS preferred).
- Secure backend API in Node.js (Express or Fastify) to manage user authentication, session data, and integrations with LLM APIs (Ollama / Gemma 4).
- Caching layer using Redis to optimize repeated LLM requests and keep response latency low.
- Containerized development and deployment setup using Docker.

Requirements:
- Proven experience shipping production-grade React + TypeScript applications.
- Strong Node.js backend chops and REST API design.
- Practical experience with Redis caching and Docker containerization.
- High attention to UI polish, clean design, and proactive daily Slack communication.

To apply, please provide a tailored proposal detailing your relevant stack experience, your availability, and your planned approach to completing this within 3 weeks.`
  },
  {
    id: "ai-engineer",
    title: "Full-Time Role: Senior AI Application Engineer ($150k)",
    shortLabel: "Senior AI Application Engineer",
    tone: "Professional, confident, and direct",
    resume: `Alex Rivera
AI Systems & Application Engineer
Austin, TX | alex.rivera@example.com | huggingface.co/alex-r

SUMMARY:
AI Application Engineer with 4 years of engineering experience developing production LLM pipelines, agentic architectures, and high-throughput inference wrappers around open-weight models like Gemma and Llama.

CORE SKILLS:
- Languages: Python, TypeScript, SQL, Bash
- AI / ML: Gemma 4, Ollama, Hugging Face Transformers, PyTorch, LangChain, vLLM, Vector DBs (Pinecone, Chroma)
- Backend: FastAPI, Node.js, REST APIs, WebSockets, PostgreSQL, Docker
- Cloud & DevOps: AWS (EC2, S3), GitHub Actions, Linux

PROJECT HIGHLIGHTS:
1. Open-Model Inference Gateway: Architected local and cloud inference routing for open-weight models, achieving 99.8% uptime and reducing token costs by 65% compared to proprietary API alternatives.
2. Structured Agent Framework: Built schema-enforced JSON agent pipelines utilizing Gemma for document extraction and automated classification.

EDUCATION:
M.S. in Artificial Intelligence, University of Texas at Austin (2022)`,
    job: `POSITION: Senior AI Application Engineer
Company: SynthLabs AI (YC W24) | Location: Remote (US) | Salary: $140,000 - $165,000 + Equity

About the Role:
At SynthLabs, we are on a mission to democratize enterprise intelligence through open-weight models. We run open models like Google Gemma 4 locally on client workstations and at scale in the cloud to give clients complete data ownership.

Key Responsibilities:
- Design, build, and maintain production AI interfaces and serverless API gateways.
- Orchestrate open-weight LLMs (specifically Google Gemma 4 31B and quantized local variants).
- Build robust validation, schema enforcement, and retry mechanisms for structured JSON agent workflows.
- Implement Kubernetes-based container orchestration and automated evaluation benchmarks.

Requirements:
- 3+ years experience building production web applications and APIs (Python/FastAPI or TypeScript/Node).
- Deep hands-on experience integrating open-weight models (Ollama, vLLM, or Hugging Face).
- Proven expertise in prompt engineering, JSON mode schema enforcement, and automated fallback strategies.
- Strong familiarity with Docker and Kubernetes infrastructure.
- Passion for open-source AI and data privacy.`
  }
];
