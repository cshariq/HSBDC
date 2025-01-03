const {
    GoogleGenerativeAI,
    HarmCategory,
    HarmBlockThreshold,
} = require("@google/generative-ai");
  
const { GoogleAIFileManager } = require("@google/generative-ai/server");

const apiKey = process.env.AIzaSyAdJ1GLhQNBPz9Lp69TptrAJuHSQOuTleU;
const genAI = new GoogleGenerativeAI(apiKey);
const fileManager = new GoogleAIFileManager(apiKey);

async function uploadToGemini(path, mimeType) {
    const uploadResult = await fileManager.uploadFile(path, {
        mimeType,
        displayName: path,
    });
    const file = uploadResult.file;
    console.log(`Uploaded file ${file.displayName} as: ${file.name}`);
    return file;
}

const model = genAI.getGenerativeModel({
    model: "gemini-2.0-flash-thinking-exp-1219",
    systemInstruction: "Only provide statistics, in a clear manner based on the provided electricity bill(make sure to look at the electricity cost). I need total and average electricity used and total and average cost. Tell me about any anomalies in the month(if yearly dataset) and if monthly dataset provide me any anomalies in the weeks if possible. Along with the anomolies give me its respective month and the electricty used of that month. Lastly based on the location and bill provide 1 greener alternative only by its name(e.g. solar panels) that fits the location and consumption pattern and you best guess for next month's expected electricity usage. Don't show any of your calculations, answer should be in the following format with the correct units, and if you can't find a value it should be N/A:\nTotal electricty:\nAvergae electricty:\nTotal cost:\nAvergae cost:\nAnomolie month:\nAnomolies electricity usage:\nName of greener alternative:\nNext month electricty usage prediction:",
});

const generationConfig = {
    temperature: 1,
    topP: 0.95,
    topK: 64,
    maxOutputTokens: 8192,
    responseMimeType: "text/plain",
};

$(document).ready(function () {
    // Wrap every word in a span
    $('.ml16').each(function () {
        let text = $(this).text();
        let words = text.split(' ');

        // Clear current element
        this.innerHTML = '';

        // Loop through each word, wrap each letter in a span
        for (let word of words) {
            let word_split = word.replace(/([^\x00-\x80]|\w)/g, "<span class='letter'>$&</span>");

            console.log('<span class="word">' + word_split + '</span>');

            // Wrap another span around each word, add word to header
            this.innerHTML += '<span class="word">' + word_split + '</span>';
        }
    });

    anime.timeline({
    })
        .add({
            targets: '.ml16 .letter',
            translateY: [100, 0],
            easing: "easeOutExpo",
            duration: 1400,
            delay: function (el, i) {
                return 30 * i;
            }
        });
});

$(document).ready(function () {
    // Wrap every word in a span
    $('.ml17').each(function () {
        let text = $(this).text();
        let words = text.split(' ');

        // Clear current element
        this.innerHTML = '';

        // Loop through each word, wrap each letter in a span
        for (let word of words) {
            let word_split = word.replace(/([^\x00-\x80]|\w|[%])/g, "<span class='letter'>$&</span>");

            console.log('<span class="word">' + word_split + '</span>');

            // Wrap another span around each word, add word to header
            this.innerHTML += '<span class="word">' + word_split + '</span>';
        }
    });

    anime.timeline({ delay: 2400 })
        .add({
            targets: '.ml17 .letter',
            translateY: [100, 0],
            easing: "easeOutExpo",
            duration: 1400,
            delay: function (el, i) {
                return 2400 + 30 * i; // Add a 1-second delay before starting the animation
            }
        });
});

document.addEventListener("DOMContentLoaded", function () {
    var dropbox = document.getElementById("dropbox");
    var fileElem = document.getElementById("fileElem");
    dropbox.addEventListener("dragenter", function (e) {
        dropArea.classList.add('dragover');
    });

    dropbox.addEventListener("dragover", function (e) {
        dropbox.classList.add("dragover");
    });

    dropbox.addEventListener("dragleave", function (e) {
        dropbox.classList.remove("dragover");
    });

    dropbox.addEventListener("drop", function (e) {
        dropbox.classList.remove("dragover");
        var files = e.dataTransfer.files;
        handleFiles(files);
    });

    dropbox.addEventListener("click", function () {
        fileElem.click();
    });

    function handleFiles(files) {
        const yearlyData = {};
        const upload = [
            uploadToGemini("Electricity bill", files),
        ];
        const chatSession = model.startChat({generationConfig});
        const result = chatSession.sendMessage("");
        console.log(result.response.text()); 
        // data.forEach(item => {
        //     if (!yearlyData[item.year]) {
        //         yearlyData[item.year] = [];
        //     }
        //     yearlyData[item.year].push(item);
        // });
    }
});


function handleFiles(files) {
    const yearlyData = {};
    const upload = [
        uploadToGemini("Electricity bill", files),
    ];
    const chatSession = model.startChat({generationConfig});
    const result = chatSession.sendMessage("");
    console.log(result.response.text()); 
}
// document.addEventListener("DOMContentLoaded", async function () {
//     var dropbox = document.getElementById("dropbox");
//     var fileElem = document.getElementById("fileElem");
//     dropbox.addEventListener("dragenter", function (e) {
//         dropArea.classList.add('dragover');
//     });

//     dropbox.addEventListener("dragover", function (e) {
//         e.preventDefault();
//         dropbox.classList.add("dragover");
//         dropbox.highlight(); // Call highlight method
//     });

//     dropbox.addEventListener("dragleave", function (e) {
//         e.preventDefault();
//         dropbox.classList.remove("dragover");
//     });

//     dropbox.addEventListener("drop", function (e) {
//         e.preventDefault();
//         dropbox.classList.remove("dragover");
//         var files = e.dataTransfer.files;
//         handleFiles(files);
//     });

//     dropbox.addEventListener("click", function () {
//         fileElem.click();
//     });
//     const files = [
//         await uploadToGemini("Electricity bill", file),
//     ];
//     const chatSession = model.startChat({generationConfig});
//     const result = await chatSession.sendMessage("");
//     console.log(result.response.text());    
// });
