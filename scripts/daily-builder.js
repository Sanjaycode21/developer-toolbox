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

console.log('--- Starting Daily Builder Bot ---');
console.log(`Working Directory: ${repoDir}`);

// 1. Check out separate branch (new-features)
try {
  console.log(`Checking out branch: ${targetBranch}`);
  execSync(`git checkout ${targetBranch}`, { stdio: 'ignore' });
} catch (e) {
  console.log(`Creating branch: ${targetBranch}`);
  execSync(`git checkout -b ${targetBranch}`, { stdio: 'inherit' });
}

// 2. Parse roadmap.md to find the next task
if (!fs.existsSync(roadmapPath)) {
  console.error(`Error: roadmap.md not found at ${roadmapPath}`);
  process.exit(1);
}

const roadmapContent = fs.readFileSync(roadmapPath, 'utf8');
const lines = roadmapContent.split(/\r?\n/);
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

if (!nextTask || nextTaskIndex === -1) {
  console.log('No uncompleted tasks found in roadmap.md! DevForge is fully built.');
  process.exit(0);
}

console.log(`Found Next Task to implement: "${nextTask}"`);

// 3. Collect Workspace Directory Map
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

const filesTree = getFilesTree(repoDir);
const layoutPath = path.join(repoDir, 'src/app/layout.tsx');
let layoutContent = '';
if (fs.existsSync(layoutPath)) {
  layoutContent = fs.readFileSync(layoutPath, 'utf8');
}

// 4. Initialize Gemini client
const isMock = process.argv.includes('--mock');
let genAI = null;

if (!isMock) {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    console.error('Error: GEMINI_API_KEY environment variable is not defined.');
    console.error('Please configure GEMINI_API_KEY in your local .env or system variables.');
    process.exit(1);
  }
  genAI = new GoogleGenerativeAI(apiKey);
} else {
  console.log('Running in MOCK mode (no API key required)');
}

// 5. Construct Prompt
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

console.log('Generating code updates...');

async function run() {
  try {
    let responseText = '';
    
    if (isMock) {
      // Mock changes: create a mock task page and modify layout
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
      // Append a link to layout
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
    }

    // 6. Parse JSON edits
    const jsonMatch = responseText.match(/```json\s*([\s\S]*?)\s*```/i);
    if (!jsonMatch || !jsonMatch[1]) {
      console.error('Error: Could not extract valid JSON array block from response.');
      console.log(responseText);
      process.exit(1);
    }

    let fileEdits = [];
    try {
      fileEdits = JSON.parse(jsonMatch[1].trim());
    } catch (e) {
      console.error('Error parsing JSON content:', e.message);
      process.exit(1);
    }

    console.log(`Applying ${fileEdits.length} file changes...`);
    const modifiedPaths = [];
    
    // Apply changes
    for (const edit of fileEdits) {
      const targetPath = path.resolve(repoDir, edit.path);
      modifiedPaths.push(targetPath);
      
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

    // 7. Update roadmap.md locally
    lines[nextTaskIndex] = lines[nextTaskIndex].replace('- [ ]', '- [x]');
    const updatedRoadmapContent = lines.join('\n');
    fs.writeFileSync(roadmapPath, updatedRoadmapContent, 'utf8');
    console.log('Updated roadmap.md checklist.');

    // 8. Build Validation check
    try {
      console.log('Running build validation: npm run build...');
      execSync('npm run build', { stdio: 'inherit' });
      console.log('Build validation succeeded!');
    } catch (buildError) {
      console.error('Build compilation failed! Rolling back changes...');
      // Revert files via Git
      execSync('git checkout -- .', { stdio: 'inherit' });
      // If there are newly created files not tracked by Git, clean them up
      execSync('git clean -fd', { stdio: 'inherit' });
      console.error('Rollback completed. Exiting.');
      process.exit(1);
    }

    // 9. Git commit & push
    try {
      console.log('Staging files for commit...');
      // Set the correct author to ensure contribution graph updates
      execSync('git config user.name "Sanjaycode21"', { stdio: 'inherit' });
      execSync('git config user.email "sanjaycode21@gmail.com"', { stdio: 'inherit' });

      execSync('git add .', { stdio: 'inherit' });
      execSync(`git commit -m "bot(daily): implement ${nextTask}"`, { stdio: 'inherit' });
      console.log('Changes committed successfully.');
      
      console.log('Pushing new-features branch to GitHub...');
      execSync(`git push origin ${targetBranch}`, { stdio: 'inherit' });
      
      console.log('Merging changes to main branch...');
      execSync('git checkout main', { stdio: 'inherit' });
      execSync(`git merge ${targetBranch} --no-edit`, { stdio: 'inherit' });
      
      console.log('Pushing main branch to GitHub (to update contribution graph)...');
      execSync('git push origin main', { stdio: 'inherit' });
      
      // Switch back to targetBranch for future builder runs
      execSync(`git checkout ${targetBranch}`, { stdio: 'inherit' });
      console.log('Git operations completed successfully!');
    } catch (gitError) {
      console.warn('Git operation failed (make sure PAT token and remote origin are configured correctly):', gitError.message);
      // Ensure we end up on targetBranch even if merge/push fails
      try { execSync(`git checkout ${targetBranch}`, { stdio: 'ignore' }); } catch(e) {}
    }

    console.log('--- Daily Builder Bot Finished Successfully ---');

  } catch (error) {
    console.error('Execution failed:', error);
    process.exit(1);
  }
}

run();
