import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI("AIzaSyBlzUZsHvLZpGDSpXNT8ERoyRjUjoH8LFE");

const aiService = {
  generateSubtasks: async (taskTitle, taskDescription) => {
    try {
      const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

      const prompt = `
            For the task "${taskTitle}", create a list of 3-5 subtasks that break down this task into manageable steps.
            ${taskDescription ? `Additional context: ${taskDescription}` : ""}

            Rules for subtasks:
            1. Each subtask should be clear and actionable
            2. Subtasks should be in logical sequence
            3. Each subtask should take 15-45 minutes
            4. Use imperative verbs to start each subtask

            Format each subtask as:
            - Title: [subtask title]
            - Duration: [estimated minutes]

            Keep responses concise and focused.
            `.trim();

      const result = await model.generateContent(prompt);
      const text = result.response.text();

      // Parse the response into structured data
      const subtasks = [];
      let currentSubtask = {};

      text.split("\n").forEach((line) => {
        line = line.trim();
        if (line.startsWith("- Title:")) {
          if (Object.keys(currentSubtask).length > 0) {
            subtasks.push(currentSubtask);
          }
          currentSubtask = { title: line.replace("- Title:", "").trim() };
        } else if (line.startsWith("- Duration:")) {
          const durationStr = line.replace("- Duration:", "").trim();
          const duration = parseInt(durationStr.match(/\d+/)[0]);
          currentSubtask.duration = duration;
        }
      });

      if (Object.keys(currentSubtask).length > 0) {
        subtasks.push(currentSubtask);
      }

      return subtasks;
    } catch (error) {
      console.error("Error generating subtasks:", error);
      throw error;
    }
  },
};

export default aiService;
