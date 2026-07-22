# Daily Builder Automation Rules

Whenever you receive a scheduled cron notification with the prompt "Run the daily builder bot to make the daily contribution", you MUST:
1. Run the daily builder script by executing:
   `npm run daily-build`
2. Monitor the task and wait for its completion.
3. If it succeeds, confirm the branch status and notify the user about the successfully implemented tools/features and commits.
4. If it fails, troubleshoot the error, fix any issues, and re-run to ensure the contribution is pushed successfully.
