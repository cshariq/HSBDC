import google.generativeai as genai
import os
from browser import window, document

def open_file(fileContent, fileType):
  response_text = process_bill(fileContent, fileType) 
  window.handleResponse(response_text)

def process_bill(file, location):
  genai.configure(api_key=os.environ["AIzaSyAdJ1GLhQNBPz9Lp69TptrAJuHSQOuTleU"])

  def upload_to_gemini(path, mime_type=None):
    file = genai.upload_file(path, mime_type=mime_type)
    print(f"Uploaded file '{file.display_name}' as: {file.uri}")
    return file

  # Create the model
  generation_config = {
    "temperature": 1,
    "top_p": 0.95,
    "top_k": 64,
    "max_output_tokens": 8192,
    "response_mime_type": "text/plain",
  }

  model = genai.GenerativeModel(
    model_name="gemini-2.0-flash-thinking-exp-1219",
    generation_config=generation_config,
    system_instruction="Only provide statistics, in a clear manner based on the provided electricity bill(make sure to look at the electricity cost). I need total and average electricity used and total and average cost. Tell me about any anomalies in the month(if yearly dataset) and if monthly dataset provide me any anomalies in the weeks if possible. Along with the anomolies give me its respective month and the electricty used of that month. Lastly based on the location and bill provide 1 greener alternative only by its name(e.g. solar panels) that fits the location and consumption pattern and you best guess for next month's expected electricity usage. Don't show any of your calculations, answer should be in the following format with the correct units, and if you can't find a value it should be N/A:\nTotal electricty:\nAvergae electricty:\nTotal cost:\nAvergae cost:\nAnomolie month:\nAnomolies electricity usage:\nName of greener alternative:\nNext month electricty usage prediction:",
  )
  files = [
    upload_to_gemini("Electricity Bill", mime_type=file),
  ]

  chat_session = model.start_chat()

  response = chat_session.send_message(location)

  print(response.text)

# const {
#   GoogleGenerativeAI,
#   HarmCategory,
#   HarmBlockThreshold,
# } = require("@google/generative-ai");

# const { GoogleAIFileManager } = require("@google/generative-ai/server");

# const apiKey = process.env.GEMINI_API_KEY;
# const genAI = new GoogleGenerativeAI(apiKey);
# const fileManager = new GoogleAIFileManager(apiKey);

# async function uploadToGemini(path, mimeType) {
#   const uploadResult = await fileManager.uploadFile(path, {
#     mimeType,
#     displayName: path,
#   });
#   const file = uploadResult.file;
#   console.log(`Uploaded file ${file.displayName} as: ${file.name}`);
#   return file;
# }

# const model = genAI.getGenerativeModel({
#   model: "gemini-2.0-flash-thinking-exp-1219",
#   systemInstruction: "Only provide statistics, in a clear manner based on the provided electricity bill(make sure to look at the electricity cost). I need total and average electricity used and total and average cost. Tell me about any anomalies in the month(if yearly dataset) and if monthly dataset provide me any anomalies in the weeks if possible. Along with the anomolies give me its respective month and the electricty used of that month. Lastly based on the location and bill provide 1 greener alternative only by its name(e.g. solar panels) that fits the location and consumption pattern and you best guess for next month's expected electricity usage. Don't show any of your calculations, answer should be in the following format with the correct units, and if you can't find a value it should be N/A:\nTotal electricty:\nAvergae electricty:\nTotal cost:\nAvergae cost:\nAnomolie month:\nAnomolies electricity usage:\nName of greener alternative:\nNext month electricty usage prediction:",
# });

# const generationConfig = {
#   temperature: 1,
#   topP: 0.95,
#   topK: 64,
#   maxOutputTokens: 8192,
#   responseMimeType: "text/plain",
# };

# async function run() {
#   // TODO Make these files available on the local file system
#   // You may need to update the file paths
#   const files = [
#     await uploadToGemini("Image January 02, 2025 - 11:24PM.png", "image/png"),
#   ];

#   const chatSession = model.startChat({generationConfig});

#   const result = await chatSession.sendMessage("INSERT_INPUT_HERE");
#   console.log(result.response.text());
# }

# run();