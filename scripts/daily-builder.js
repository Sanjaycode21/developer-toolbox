import fs from 'fs';
import path from 'path';
import { execSync } from 'child_process';
import { GoogleGenerativeAI } from '@google/generative-ai';

// Initialize paths
const repoDir = path.resolve(process.cwd());
const roadmapPath = path.join(repoDir, 'roadmap.md');
const indexPath = path.join(repoDir, 'index.html');

console.log('--- Starting Daily Builder Bot ---');
console.log(`Working Directory: ${repoDir}`);

// 1. Parse roadmap.md to find the next task
if (!fs.existsSync(roadmapPath)) {
  console.error(`Error: roadmap.md not found at ${roadmapPath}`);
  process.exit(1);
}

const roadmapContent = fs.readFileSync(roadmapPath, 'utf8');
let nextTask = null;
let taskLine = '';

// Find the first uncompleted task (e.g. - [ ] Day X: Task description)
const lines = roadmapContent.split(/\r?\n/);
let nextTaskIndex = -1;
for (let i = 0; i < lines.length; i++) {
  const line = lines[i];
  if (line.trim().startsWith('- [ ]')) {
    nextTask = line.replace('- [ ]', '').trim();
    taskLine = line;
    nextTaskIndex = i;
    break;
  }
}

if (!nextTask || nextTaskIndex === -1) {
  console.log('No uncompleted tasks found in roadmap.md! The app is fully built.');
  process.exit(0);
}

console.log(`Found Next Task: "${nextTask}"`);

// 2. Read current app structure (index.html)
if (!fs.existsSync(indexPath)) {
  console.error(`Error: index.html not found at ${indexPath}`);
  process.exit(1);
}
const currentIndexContent = fs.readFileSync(indexPath, 'utf8');

// 3. Initialize Gemini API Client or Set Up Mock Mode
const isMock = process.argv.includes('--mock');
let genAI = null;

if (!isMock) {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    console.error('Error: GEMINI_API_KEY environment variable is not defined.');
    console.error('Please configure GEMINI_API_KEY in your local environment or GitHub Secrets, or run with --mock for dry-run.');
    process.exit(1);
  }
  genAI = new GoogleGenerativeAI(apiKey);
} else {
  console.log('Running in MOCK mode (no API key required)');
}

// 4. Construct Prompt
const systemPrompt = `You are a premium Frontend Web Developer Bot. Your task is to update a single-page HTML application ('index.html') to implement the next planned feature/improvement from the roadmap.

CRITICAL RULES:
1. Maintain existing features, structure, and design system. Do not lose functionality.
2. Elevate the visual aesthetics. Use modern styling: glassmorphism, nice transitions, subtle hover animations, rich/vibrant gradient colors, and modern sans-serif typography.
3. The page must feel active, interactive, and alive. Do not use static placeholder text; generate engaging content or functional UI components.
4. Output the complete, updated HTML file enclosed within a single markdown code block, i.e., \`\`\`html\\n[UPDATED_CODE]\\n\`\`\`. Do not output anything else.`;

const userPrompt = `
Here is the current content of 'index.html':
\`\`\`html
${currentIndexContent}
\`\`\`

Here is the task you must implement:
"${nextTask}"

Please implement this task in the code. Update the UI, CSS styles, and JavaScript logic as necessary. Ensure it is fully interactive.
Return ONLY the updated 'index.html' content inside a \`\`\`html code block.
`;

console.log('Generating changes...');

async function run() {
  try {
    let responseText = '';
    
    if (isMock) {
      // Mock generation logic: simply insert a placeholder container for the next task
      const placeholderRegex = /<!-- Future widgets and boards will be added here step-by-step -->/i;
      const mockWidget = `
    <!-- Widget for: ${nextTask} -->
    <div class="card" style="
      background: rgba(255, 255, 255, 0.05);
      backdrop-filter: blur(10px);
      -webkit-backdrop-filter: blur(10px);
      border: 1px solid rgba(255, 255, 255, 0.1);
      border-radius: 1rem;
      padding: 1.5rem;
      margin-top: 1.5rem;
      box-shadow: 0 8px 32px 0 rgba(0, 0, 0, 0.3);
      transition: transform 0.3s ease;
    " onmouseover="this.style.transform='translateY(-5px)'" onmouseout="this.style.transform='translateY(0)'">
      <h3 style="color: var(--accent-color); margin-top: 0;">${nextTask}</h3>
      <p style="color: #94a3b8; font-size: 0.95rem;">This feature was successfully built and integrated by the daily-builder bot step-by-step.</p>
    </div>
    
    <!-- Future widgets and boards will be added here step-by-step -->
      `;
      if (placeholderRegex.test(currentIndexContent)) {
        responseText = `\`\`\`html\n${currentIndexContent.replace(placeholderRegex, mockWidget.trim())}\n\`\`\``;
      } else {
        responseText = `\`\`\`html\n${currentIndexContent}\n\`\`\``;
      }
    } else {
      console.log('Calling Gemini API...');
      const model = genAI.getGenerativeModel({
        model: 'gemini-2.5-flash',
        systemInstruction: systemPrompt,
      });

      const result = await model.generateContent({
        contents: [{ role: 'user', parts: [{ text: userPrompt }] }],
        generationConfig: {
          temperature: 0.2,
        }
      });
      responseText = result.response.text();
    }
    
    // Extract code block content
    const codeBlockMatch = responseText.match(/```html\s*([\s\S]*?)\s*```/i);
    let updatedCode = '';
    
    if (codeBlockMatch && codeBlockMatch[1]) {
      updatedCode = codeBlockMatch[1].trim();
    } else {
      // Fallback in case the markdown wrapper was omitted
      updatedCode = responseText.trim();
    }

    if (!updatedCode.startsWith('<!DOCTYPE html>') && !updatedCode.includes('<html')) {
      console.error('Error: Generated response does not look like valid HTML. Response summary:');
      console.log(responseText.substring(0, 300));
      process.exit(1);
    }

    // 5. Save updated code
    fs.writeFileSync(indexPath, updatedCode, 'utf8');
    console.log('Successfully updated index.html.');

    // 6. Update roadmap.md (mark task as completed)
    lines[nextTaskIndex] = lines[nextTaskIndex].replace('- [ ]', '- [x]');
    const updatedRoadmapContent = lines.join('\n');
    fs.readFileSync(roadmapPath, 'utf8'); // check read again
    fs.writeFileSync(roadmapPath, updatedRoadmapContent, 'utf8');
    console.log('Successfully updated roadmap.md.');

    // 7. Git commit locally
    try {
      console.log('Executing git commit...');
      execSync('git add index.html roadmap.md', { stdio: 'inherit' });
      execSync(`git commit -m "bot(daily): implement ${nextTask}"`, { stdio: 'inherit' });
      console.log('Git commit succeeded!');
      
      // Attempt git push if remote is configured
      try {
        console.log('Attempting git push...');
        execSync('git push', { stdio: 'inherit' });
        console.log('Git push succeeded!');
      } catch (pushErr) {
        console.log('Note: Git push skipped or failed (likely remote is not set up yet or auth is missing). This is OK for local test runs.');
      }
    } catch (gitErr) {
      console.error('Git operation failed:', gitErr.message);
    }

    console.log('--- Daily Builder Bot Finished Successfully ---');

  } catch (error) {
    console.error('Failed to run Daily Builder Bot:', error);
    process.exit(1);
  }
}

run();
