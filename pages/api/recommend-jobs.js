// pages/api/recommend-jobs.js

import { createRouter } from "next-connect";
import multer from "multer";
import { promises as fs } from "fs";
import pdfParse from "pdf-parse";
import Tesseract from "tesseract.js";

// Configure multer to store uploaded files locally
const upload = multer({ 
  dest: "./uploads",
  fileFilter: (req, file, cb) => {
    // Accept PDFs and common image formats
    const allowedTypes = ['application/pdf', 'image/jpeg', 'image/png', 'image/tiff', 'image/gif', 'image/bmp'];
    if (allowedTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error("Invalid file type. Only PDF and image files are accepted."), false);
    }
  }
});

// Set a similarity threshold for job matches
// Jobs must have at least this similarity score to be included in results
const SIMILARITY_THRESHOLD = 0.365; // Adjust this value based on testing


const jobsDataset = [
	{
		title: "Software Engineer",
		company: "TechCorp",
		location: "Remote",
		description:
			"We are looking for a software engineer experienced in building scalable web applications using JavaScript, Node.js, and cloud technologies.",
	},
	{
		title: "Data Scientist",
		company: "DataSolutions",
		location: "New York, NY",
		description:
			"Seeking a data scientist with expertise in machine learning, statistics, and data visualization to build predictive models.",
	},
	{
		title: "Product Manager",
		company: "InnovateTech",
		location: "San Francisco, CA",
		description:
			"Looking for a product manager to lead the product lifecycle from ideation to launch for a cutting-edge SaaS platform.",
	},
	{
		title: "Digital Marketing Specialist",
		company: "BrandX",
		location: "Chicago, IL",
		description:
			"We are hiring a digital marketing specialist with experience in SEO, SEM, and social media strategies to drive online engagement.",
	},
	{
		title: "Financial Analyst",
		company: "FinancePlus",
		location: "Boston, MA",
		description:
			"Looking for a financial analyst with strong Excel and modeling skills to support business decision-making and forecasting.",
	},
	{
		title: "HR Manager",
		company: "PeopleFirst",
		location: "Austin, TX",
		description:
			"Seeking an experienced HR Manager to oversee recruitment, employee relations, and performance management in a growing company.",
	},
	{
		title: "UX/UI Designer",
		company: "CreativeHub",
		location: "Los Angeles, CA",
		description:
			"We are looking for a UX/UI designer to create user-friendly interfaces and improve the overall user experience for our products.",
	},
	{
		title: "Software Developer",
		company: "CodeCraft",
		location: "Remote",
		description:
			"Hiring a software developer with expertise in Python and Django to build scalable backend systems for web applications.",
	},
	{
		title: "Registered Nurse",
		company: "CareHealth",
		location: "Miami, FL",
		description:
			"Looking for a registered nurse to provide compassionate care and support to patients in a busy hospital setting.",
	},
	{
		title: "Mechanical Engineer",
		company: "AutoTech",
		location: "Detroit, MI",
		description:
			"Seeking a mechanical engineer to design and test innovative automotive components, ensuring they meet safety and performance standards.",
	},
	{
		title: "Legal Assistant",
		company: "LawGroup",
		location: "Washington, D.C.",
		description:
			"We are looking for a legal assistant to support lawyers with case preparation, legal research, and client communication.",
	},
	{
		title: "Cloud Architect",
		company: "CloudifyTech",
		location: "San Jose, CA",
		description:
			"Hiring a cloud architect with expertise in AWS and Azure to design and implement scalable cloud infrastructures for enterprise clients.",
	},
	{
		title: "Sales Manager",
		company: "SalesForce",
		location: "Chicago, IL",
		description:
			"Looking for a sales manager to lead a team of sales representatives and drive revenue growth through strategic sales initiatives.",
	},
	{
		title: "Customer Support Specialist",
		company: "TechSupport Inc.",
		location: "Remote",
		description:
			"Hiring a customer support specialist to assist customers with product inquiries, technical issues, and troubleshooting.",
	},
	{
		title: "Graphic Designer",
		company: "VisualArts",
		location: "New York, NY",
		description:
			"We are looking for a creative graphic designer to create visually appealing designs for digital and print marketing materials.",
	},
	{
		title: "Business Analyst",
		company: "AnalyticsPro",
		location: "Dallas, TX",
		description:
			"Seeking a business analyst to gather and analyze data to help guide decision-making and improve business processes.",
	},
	{
		title: "Electrician",
		company: "PowerGrid Services",
		location: "Houston, TX",
		description:
			"Looking for a licensed electrician to install, maintain, and repair electrical systems in commercial and residential buildings.",
	},
	{
		title: "Marketing Manager",
		company: "MarketMasters",
		location: "Los Angeles, CA",
		description:
			"Hiring a marketing manager to develop and execute marketing strategies that drive brand awareness and sales growth.",
	},
	{
		title: "IT Support Specialist",
		company: "TechHelp",
		location: "Atlanta, GA",
		description:
			"We are seeking an IT support specialist to provide technical assistance and support to end-users for hardware and software issues.",
	},
	{
		title: "Chef",
		company: "Gourmet Eats",
		location: "New Orleans, LA",
		description:
			"Looking for an experienced chef to prepare high-quality dishes, manage kitchen operations, and ensure food safety standards.",
	},
	{
		title: "Web Developer",
		company: "WebGenius",
		location: "Remote",
		description:
			"We are hiring a web developer proficient in HTML, CSS, and JavaScript to create responsive websites for clients across industries.",
	},
	{
		title: "Nurse Practitioner",
		company: "Family Health Clinic",
		location: "Seattle, WA",
		description:
			"Seeking a nurse practitioner to provide primary care services, perform physical exams, and prescribe medications.",
	},
	{
		title: "Project Manager",
		company: "BuildPro",
		location: "Denver, CO",
		description:
			"We are looking for an experienced project manager to oversee construction projects from initiation to completion, ensuring timelines and budgets are met.",
	},
	{
		title: "Financial Planner",
		company: "WealthAdvisor",
		location: "Phoenix, AZ",
		description:
			"Looking for a financial planner to assist clients with budgeting, retirement planning, and investment strategies.",
	},
	{
		title: "Data Engineer",
		company: "DataWorks",
		location: "Boston, MA",
		description:
			"Hiring a data engineer to design and maintain data pipelines, working closely with data scientists to ensure efficient data flow.",
	},
	{
		title: "Construction Manager",
		company: "Brickstone Builders",
		location: "Chicago, IL",
		description:
			"We are hiring a construction manager to oversee construction sites, ensuring projects are completed on time and within budget.",
	},
	{
		title: "Social Media Manager",
		company: "TrendSetters",
		location: "Los Angeles, CA",
		description:
			"Looking for a social media manager to create and implement social media strategies that increase brand visibility and engagement.",
	},
	{
		title: "Research Scientist",
		company: "BioTech Innovations",
		location: "San Diego, CA",
		description:
			"Seeking a research scientist to conduct experiments and contribute to groundbreaking scientific advancements in biotechnology.",
	},
	{
		title: "Pharmacist",
		company: "HealthPlus Pharmacy",
		location: "Dallas, TX",
		description:
			"Hiring a pharmacist to dispense medications, counsel patients on prescriptions, and monitor drug interactions.",
	},
	{
		title: "Sales Executive",
		company: "GlobalTech Sales",
		location: "Remote",
		description:
			"We are looking for a sales executive with experience in B2B sales to drive revenue growth and build long-term relationships with clients.",
	},
	{
		title: "Content Writer",
		company: "ContentMasters",
		location: "Remote",
		description:
			"Seeking a content writer to produce high-quality articles, blog posts, and website copy for diverse clients.",
	},
	{
		title: "Web Designer",
		company: "WebCraft",
		location: "San Francisco, CA",
		description:
			"Looking for a web designer to create visually appealing and user-friendly websites that meet client requirements.",
	},
	{
		title: "Accountant",
		company: "FinAcco",
		location: "New York, NY",
		description:
			"Hiring an accountant to manage financial records, prepare reports, and ensure compliance with tax regulations.",
	},
	{
		title: "Operations Manager",
		company: "LogiTech",
		location: "Chicago, IL",
		description:
			"We are looking for an operations manager to streamline processes, manage logistics, and ensure efficient day-to-day operations.",
	},
	{
		title: "Public Relations Specialist",
		company: "PR Solutions",
		location: "Los Angeles, CA",
		description:
			"Seeking a public relations specialist to manage media relations, press releases, and enhance the company's public image.",
	},
	{
		title: "Electrical Engineer",
		company: "PowerTech",
		location: "Denver, CO",
		description:
			"Looking for an electrical engineer to design, develop, and maintain electrical systems and components for various industries.",
	},
	{
		title: "Interior Designer",
		company: "DesignWorks",
		location: "Miami, FL",
		description:
			"We are hiring an interior designer to create stylish and functional interior spaces for residential and commercial clients.",
	},
	{
		title: "Public Health Specialist",
		company: "HealthMatters",
		location: "Washington, D.C.",
		description:
			"Hiring a public health specialist to assess community health needs and develop initiatives to improve public health outcomes.",
	},
	{
		title: "Video Editor",
		company: "FilmCraft Studios",
		location: "Los Angeles, CA",
		description:
			"We are looking for a video editor to edit and produce high-quality video content for commercials, films, and online media.",
	},
	{
		title: "SEO Specialist",
		company: "DigitalBoost",
		location: "Austin, TX",
		description:
			"Hiring an SEO specialist to optimize websites for search engines, increase organic traffic, and improve rankings.",
	},
	{
		title: "Supply Chain Manager",
		company: "LogisticsX",
		location: "Chicago, IL",
		description:
			"We are looking for a supply chain manager to optimize procurement, logistics, and inventory management across multiple locations.",
	},
	{
		title: "Marketing Coordinator",
		company: "CreativePulse",
		location: "New York, NY",
		description:
			"Hiring a marketing coordinator to assist in campaign development, event planning, and social media management.",
	},
	{
		title: "Civil Engineer",
		company: "UrbanBuild",
		location: "San Francisco, CA",
		description:
			"Looking for a civil engineer to design and oversee construction of infrastructure projects like bridges, roads, and water systems.",
	},
	{
		title: "Software Test Engineer",
		company: "TechSolutions",
		location: "Chicago, IL",
		description:
			"We are hiring a software test engineer to create test plans, identify bugs, and ensure quality assurance for software releases.",
	},
	{
		title: "Operations Analyst",
		company: "DataWorks",
		location: "Dallas, TX",
		description:
			"Seeking an operations analyst to evaluate business processes, identify inefficiencies, and suggest improvements.",
	},
	{
		title: "Recruiter",
		company: "TalentSeek",
		location: "New York, NY",
		description:
			"Hiring a recruiter to source, interview, and place candidates for various roles across different industries.",
	},
	{
		title: "Security Analyst",
		company: "SecureTech",
		location: "Remote",
		description:
			"Looking for a security analyst to monitor and safeguard company networks and systems from cyber threats.",
	},
	{
		title: "Customer Success Manager",
		company: "ClientCare",
		location: "Remote",
		description:
			"We are hiring a customer success manager to ensure our clients' success by providing exceptional service and support.",
	},
	{
		title: "HR Coordinator",
		company: "PeopleWorks",
		location: "Boston, MA",
		description:
			"Seeking an HR coordinator to support daily HR activities, including onboarding, benefits management, and employee engagement.",
	},
	{
		title: "Cybersecurity Specialist",
		company: "SecureNet",
		location: "Washington, D.C.",
		description:
			"Looking for a cybersecurity specialist to develop and implement security strategies and protocols to protect company data.",
	},
	{
		title: "Operations Director",
		company: "GlobalLogistics",
		location: "Miami, FL",
		description:
			"We are hiring an operations director to oversee daily business operations, manage teams, and improve efficiency across departments.",
	},
];

// Helper function to call the Python microservice to get an embedding for a given text
async function getEmbeddingForText(text) {
  const response = await fetch("http://localhost:5001/embed", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ text }),
  });
  if (!response.ok) {
    throw new Error("Embedding service error: " + (await response.text()));
  }
  const data = await response.json();
  return data.embedding;
}

// Helper function to compute cosine similarity between two vectors
function cosineSimilarity(vecA, vecB) {
  const dotProduct = vecA.reduce((sum, a, i) => sum + a * vecB[i], 0);
  const normA = Math.sqrt(vecA.reduce((sum, a) => sum + a * a, 0));
  const normB = Math.sqrt(vecB.reduce((sum, b) => sum + b * b, 0));
  if (normA === 0 || normB === 0) return 0;
  return dotProduct / (normA * normB);
}

// Helper function to extract text from a PDF file
async function extractTextFromPDF(filePath) {
  const fileBuffer = await fs.readFile(filePath);
  const pdfData = await pdfParse(fileBuffer);
  return pdfData.text;
}

// Helper function to extract text from an image file using Tesseract.js
async function extractTextFromImage(filePath) {
  try {
    const { data } = await Tesseract.recognize(
      filePath,
      'eng', // Language (English)
      { logger: m => console.log('Tesseract Progress:', m) }
    );
    return data.text;
  } catch (error) {
    console.error("Tesseract error:", error);
    throw new Error("Failed to extract text from image: " + error.message);
  }
}

// Determine file type and extract text accordingly
async function extractTextFromFile(file) {
  const mimeType = file.mimetype;
  
  if (mimeType === 'application/pdf') {
    return extractTextFromPDF(file.path);
  } else if (mimeType.startsWith('image/')) {
    return extractTextFromImage(file.path);
  } else {
    throw new Error("Unsupported file type: " + mimeType);
  }
}

const router = createRouter({
  onError: (err, req, res) => {
    console.error("Error in API route:", err);
    res.status(500).json({ error: "Internal Server Error", details: err.message });
  },
  onNoMatch: (req, res) => {
    res.status(405).json({ error: `Method ${req.method} not allowed` });
  },
});

// Apply multer middleware to handle file upload (expecting a field named "resume")
router.use(upload.single("resume"));

router.post(async (req, res) => {
  try {
    // Ensure a file was uploaded
    if (!req.file) {
      res.status(400).json({ error: "No file uploaded" });
      return;
    }

    // Allow threshold to be specified in the request (optional)
    const customThreshold = req.body.threshold ? parseFloat(req.body.threshold) : null;
    const similarityThreshold = customThreshold || SIMILARITY_THRESHOLD;

    console.log("File uploaded:", req.file.originalname, "Type:", req.file.mimetype);
    console.log("Using similarity threshold:", similarityThreshold);

    // Extract text from the uploaded file (PDF or image)
    const resumeText = await extractTextFromFile(req.file);
    console.log("Extracted resume text length:", resumeText.length);

    // Clean up temporary file after processing
    await fs.unlink(req.file.path).catch(err => {
      console.warn("Warning: Could not delete temporary file:", err);
    });

    // Get embedding for the resume text
    const resumeEmbedding = await getEmbeddingForText(resumeText);

    // For each job in the dataset, compute its embedding concurrently
    const jobEmbeddings = await Promise.all(
      jobsDataset.map((job) => getEmbeddingForText(job.description))
    );

    // Compute cosine similarity for each job with the resume embedding
    const jobsWithScores = jobsDataset.map((job, index) => {
      const similarity = cosineSimilarity(resumeEmbedding, jobEmbeddings[index]);
      return { ...job, similarity: parseFloat(similarity.toFixed(4)) };
    });

    // Sort jobs by descending similarity score
    jobsWithScores.sort((a, b) => b.similarity - a.similarity);
    
    // Filter jobs by similarity threshold
    const matchingJobs = jobsWithScores.filter(job => job.similarity >= similarityThreshold);

    // Return matching jobs that meet the threshold
    res.status(200).json({
      jobs: matchingJobs,
      sourceType: req.file.mimetype,
      textLength: resumeText.length,
      threshold: similarityThreshold,
      allJobScores: jobsWithScores.map(job => ({ 
        title: job.title, 
        company: job.company,
        similarity: job.similarity 
      }))
    });
  } catch (error) {
    console.error("Error processing resume:", error);
    res.status(500).json({ error: error.toString() });
  }
});

export default router.handler();

export const config = {
  api: {
    bodyParser: false,
  },
};