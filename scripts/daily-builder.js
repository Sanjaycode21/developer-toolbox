import fs from 'fs';
import path from 'path';
import { execSync } from 'child_process';
import { GoogleGenerativeAI } from '@google/generative-ai';

// Initialize paths
const repoDir = path.resolve(process.cwd());
const roadmapPath = path.join(repoDir, 'roadmap.md');
const envPath = path.join(repoDir, '.env');
const targetBranch = 'new-features';

// Load environment variables from local .env file if it exists
if (fs.existsSync(envPath)) {
  const envContent = fs.readFileSync(envPath, 'utf8');
  envContent.split(/\r?\n/).forEach(line => {
    const trimmed = line.trim();
    if (trimmed && !trimmed.startsWith('#')) {
      const [key, ...valueParts] = trimmed.split('=');
      if (key && valueParts.length > 0) {
        process.env[key.trim()] = valueParts.join('=').trim().replace(/(^['"]|['"]$)/g, '');
      }
    }
  });
}

console.log('--- Starting Daily Builder Bot (5 Contributions Mode) ---');
console.log(`Working Directory: ${repoDir}`);

// Configure git user name and email globally/locally to attribute commits
try {
  execSync('git config user.name "Sanjaycode21"', { stdio: 'inherit' });
  execSync('git config user.email "sanjaycode21@gmail.com"', { stdio: 'inherit' });
} catch (e) {
  console.warn('Could not configure git user name/email locally:', e.message);
}

// 1. Check out separate branch (new-features) and pull latest changes
try {
  console.log(`Checking out branch: ${targetBranch}`);
  execSync(`git checkout ${targetBranch}`, { stdio: 'ignore' });
  console.log('Pulling latest changes from remote...');
  try {
    execSync(`git pull origin ${targetBranch} --rebase`, { stdio: 'inherit' });
  } catch (pullError) {
    console.log('Note: git pull failed, likely remote branch does not exist yet. Continuing.');
  }
} catch (e) {
  console.log(`Creating branch: ${targetBranch}`);
  execSync(`git checkout -b ${targetBranch}`, { stdio: 'inherit' });
}

// Helper to collect Workspace Directory Map
function getFilesTree(dir, fileList = []) {
  const files = fs.readdirSync(dir);
  files.forEach(file => {
    const filePath = path.join(dir, file);
    const stat = fs.statSync(filePath);
    if (stat.isDirectory()) {
      if (file !== 'node_modules' && file !== '.git' && file !== '.next') {
        getFilesTree(filePath, fileList);
      }
    } else {
      fileList.push(path.relative(repoDir, filePath));
    }
  });
  return fileList;
}

// Helper to dynamically brainstorm and append new tasks if roadmap runs out
function generateDynamicTask() {
  const files = getFilesTree(repoDir);
  const ideas = [
    "JWT Decoder tool",
    "Unix Timestamp and Epoch Converter tools",
    "UUID and Password Generator tools",
    "Case Converter and Lorem Ipsum Generator tools",
    "XML Formatter tool",
    "YAML Formatter tool",
    "CSV Viewer & Converter",
    "Regex Tester & Generator",
    "Markdown Live Preview",
    "HTML Formatter",
    "SQL Formatter",
    "Base64 Image Encoder/Decoder",
    "Hash Generator (MD5, SHA1, SHA256)",
    "Hash Verifier",
    "robots.txt Generator",
    "sitemap.xml Generator",
    "SVG Optimizer & Viewer",
    "Meta Tag Generator & OG Preview",
    "Cron Expression Builder",
    "URL Encode/Decode tool",
    "WebSocket Tester",
    "HTTP Header Viewer",
    "SQL Playground UI",
    "QR Code Generator",
    "Barcode Generator",
    "Fake Data Generator",
    "Slug Generator",
    "Binary & Hex Calculator",
    "Unit Converter (Byte, Temperature, Length)",
    "Zustand State Favorites and History Dashboard"
  ];
  
  // Find one that is not implemented yet
  let targetIdea = ideas.find(idea => {
    const slug = idea.toLowerCase().replace(/[^a-z0-9]+/g, '-');
    return !files.some(f => f.includes(slug));
  });
  
  if (!targetIdea) {
    targetIdea = `Add developer utility number ${files.length}`;
  }
  
  const roadmapContent = fs.readFileSync(roadmapPath, 'utf8');
  const lines = roadmapContent.split('\n');
  const newDayNumber = lines.filter(l => l.includes('- [')).length + 1;
  const newTaskLine = `- [ ] Day ${newDayNumber}: Implement ${targetIdea}`;
  
  // Find "## Tasks" section and append
  let updatedRoadmap = roadmapContent.trim() + `\n${newTaskLine}\n`;
  fs.writeFileSync(roadmapPath, updatedRoadmap, 'utf8');
  console.log(`Generated and appended new dynamic task: "${newTaskLine}"`);
}

// 2. Initialize Gemini client
const isMock = process.argv.includes('--mock');
let genAI = null;

if (!isMock) {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    console.error('Error: GEMINI_API_KEY environment variable is not defined.');
    process.exit(1);
  }
  genAI = new GoogleGenerativeAI(apiKey);
}

// Run loop for 5 contributions
const numberOfContributions = 5;
let successfulContributions = 0;

async function executeSingleTask() {
  // Read and parse roadmap.md dynamically inside the loop
  if (!fs.existsSync(roadmapPath)) {
    console.error(`Error: roadmap.md not found at ${roadmapPath}`);
    return false;
  }
  
  let roadmapContent = fs.readFileSync(roadmapPath, 'utf8');
  let lines = roadmapContent.split(/\r?\n/);
  let nextTask = null;
  let nextTaskIndex = -1;
  
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    if (line.trim().startsWith('- [ ]')) {
      nextTask = line.replace('- [ ]', '').trim();
      nextTaskIndex = i;
      break;
    }
  }
  
  // If roadmap is empty, auto-generate a new task and re-parse
  if (!nextTask || nextTaskIndex === -1) {
    console.log('Roadmap is out of tasks! Generating a new dynamic tool task...');
    generateDynamicTask();
    roadmapContent = fs.readFileSync(roadmapPath, 'utf8');
    lines = roadmapContent.split(/\r?\n/);
    for (let i = 0; i < lines.length; i++) {
      const line = lines[i];
      if (line.trim().startsWith('- [ ]')) {
        nextTask = line.replace('- [ ]', '').trim();
        nextTaskIndex = i;
        break;
      }
    }
  }
  
  if (!nextTask || nextTaskIndex === -1) {
    console.error('Failed to parse next task even after dynamic generation.');
    return false;
  }
  
  console.log(`\n--- Implementing Task: "${nextTask}" ---`);
  
  const filesTree = getFilesTree(repoDir);
  const layoutPath = path.join(repoDir, 'src/app/layout.tsx');
  let layoutContent = '';
  if (fs.existsSync(layoutPath)) {
    layoutContent = fs.readFileSync(layoutPath, 'utf8');
  }
  
  const systemPrompt = `You are a lead software engineer building DevForge, a premium Developer Toolbox using Next.js (App Router), TypeScript, and Tailwind CSS.
Your goal is to implement the next planned tool or feature autonomously.

CRITICAL RULES:
1. Write production-ready, highly aesthetic code (dark theme, clean layout, responsive, nice animations).
2. The user requested to add or modify files. You must return your edits in a JSON format.
3. You can create new pages/tools under 'src/app/tools/<tool-name>/page.tsx'.
4. If you add a new tool page, you MUST update 'src/app/layout.tsx' to include a link to the tool in the sidebar navigation so the user can access it!
5. Output ONLY a valid JSON array of file edits wrapped inside a single markdown code block: \`\`\`json [JSON_CONTENT] \`\`\`. Do not include any other conversational text.

The JSON format must be:
[
  {
    "action": "create" | "modify",
    "path": "relative/path/to/file",
    "content": "The full code content of the file"
  }
]`;

  const userPrompt = `
Workspace Files List:
${filesTree.map(f => `- ${f}`).join('\n')}

Current src/app/layout.tsx structure:
\`\`\`tsx
${layoutContent}
\`\`\`

Here is the task you must implement:
"${nextTask}"

Implement this task. Generate the required file additions/modifications and return them in the JSON format wrapped in \`\`\`json.
`;

  let responseText = '';
  
  if (isMock) {
    const taskSlug = nextTask.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
    const mockFilePath = `src/app/tools/${taskSlug}/page.tsx`;
    const mockFileContent = `"use client";
export default function MockPage() {
  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-slate-100">${nextTask}</h2>
      <p className="text-xs text-slate-400">Mock version for testing daily-builder bot execution.</p>
    </div>
  );
}`;
    let updatedLayout = layoutContent;
    const navMark = 'Design & Graphics</span>';
    if (layoutContent.includes(navMark)) {
      const linkBlock = `
            <div>
              <span className="px-3 text-[10px] font-bold text-slate-500 uppercase tracking-wider">Automated Daily</span>
              <div className="mt-2 space-y-1">
                <Link href="/tools/${taskSlug}" className="flex items-center gap-3 px-3 py-2 text-sm font-medium text-slate-400 hover:text-slate-200 hover:bg-slate-800/40 rounded-lg transition-colors">
                  <span>${nextTask.split(':')[0]}</span>
                </Link>
              </div>
            </div>`;
      updatedLayout = layoutContent.replace(navMark, `${navMark}\n${linkBlock}`);
    }

    responseText = `\`\`\`json
[
  {
    "action": "create",
    "path": "${mockFilePath}",
    "content": ${JSON.stringify(mockFileContent)}
  },
  {
    "action": "modify",
    "path": "src/app/layout.tsx",
    "content": ${JSON.stringify(updatedLayout)}
  }
]
\`\`\``;
  } else {
    try {
      console.log('Calling Gemini API...');
      const model = genAI.getGenerativeModel({
        model: 'gemini-2.5-flash',
        systemInstruction: systemPrompt,
      });

      const result = await model.generateContent({
        contents: [{ role: 'user', parts: [{ text: userPrompt }] }],
        generationConfig: {
          temperature: 0.1,
          responseMimeType: 'text/plain',
        }
      });
      responseText = result.response.text();
    } catch (e) {
      console.error('Gemini API call failed:', e.message);
      return false;
    }
  }

  // Parse JSON
  const jsonMatch = responseText.match(/```json\s*([\s\S]*?)\s*```/i);
  if (!jsonMatch || !jsonMatch[1]) {
    console.error('Error: Could not extract valid JSON array block.');
    return false;
  }

  let fileEdits = [];
  try {
    fileEdits = JSON.parse(jsonMatch[1].trim());
  } catch (e) {
    console.error('Error parsing JSON content:', e.message);
    return false;
  }

  console.log(`Applying ${fileEdits.length} file changes...`);
  for (const edit of fileEdits) {
    const targetPath = path.resolve(repoDir, edit.path);
    if (edit.action === 'create' || edit.action === 'modify') {
      fs.mkdirSync(path.dirname(targetPath), { recursive: true });
      fs.writeFileSync(targetPath, edit.content, 'utf8');
      console.log(`Updated file: ${edit.path}`);
    } else if (edit.action === 'delete') {
      if (fs.existsSync(targetPath)) {
        fs.unlinkSync(targetPath);
        console.log(`Deleted file: ${edit.path}`);
      }
    }
  }

  // Update roadmap
  lines[nextTaskIndex] = lines[nextTaskIndex].replace('- [ ]', '- [x]');
  fs.writeFileSync(roadmapPath, lines.join('\n'), 'utf8');
  console.log('Updated roadmap.md checklist.');

  // Validate build
  try {
    console.log('Running build validation: npm run build...');
    execSync('npm run build', { stdio: 'inherit' });
    console.log('Build validation succeeded!');
  } catch (buildError) {
    console.error('Build compilation failed! Rolling back changes...');
    execSync('git checkout -- .', { stdio: 'inherit' });
    execSync('git clean -fd', { stdio: 'inherit' });
    return false;
  }

  // Commit locally
  try {
    execSync('git add .', { stdio: 'inherit' });
    execSync(`git commit -m "bot(daily): implement ${nextTask}"`, { stdio: 'inherit' });
    console.log('Committed change successfully.');
    return true;
  } catch (gitErr) {
    console.error('Failed to commit change:', gitErr.message);
    return false;
  }
}

async function run() {
  for (let i = 0; i < numberOfContributions; i++) {
    console.log(`\n================ CONTRIBUTION ${i + 1} OF ${numberOfContributions} ================`);
    const success = await executeSingleTask();
    if (success) {
      successfulContributions++;
    } else {
      console.warn(`Contribution ${i + 1} failed. Moving to next or ending loop.`);
    }
  }
  
  console.log(`\nCompleted loop. Successful contributions: ${successfulContributions} of ${numberOfContributions}`);
  
  // Push results to GitHub
  if (successfulContributions > 0) {
    try {
      console.log('Pushing new-features branch to GitHub...');
      execSync(`git push origin ${targetBranch}`, { stdio: 'inherit' });
      
      console.log('Merging changes to main branch...');
      execSync('git checkout main', { stdio: 'inherit' });
      execSync(`git merge ${targetBranch} --no-edit`, { stdio: 'inherit' });
      
      console.log('Pushing main branch to GitHub (to update contribution graph)...');
      execSync('git push origin main', { stdio: 'inherit' });
      
      // Switch back to targetBranch
      execSync(`git checkout ${targetBranch}`, { stdio: 'inherit' });
      console.log('All branches successfully pushed to GitHub!');
    } catch (pushErr) {
      console.error('Git push failed:', pushErr.message);
      try { execSync(`git checkout ${targetBranch}`, { stdio: 'ignore' }); } catch(e) {}
    }
  } else {
    console.log('No successful contributions to push.');
  }
  
  console.log('\n--- Daily Builder Bot Finished Successfully ---');
}

run();
