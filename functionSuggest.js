const API_KEY = "AIzaSyAdJ1GLhQNBPz9Lp69TptrAJuHSQOuTleU";

function upload(message, content, owner, repo, path, auth) {
    return fetch(
        `https://api.github.com/repos/${owner}/${repo}/contents/${path}`,
        {
        method: 'GET',
        headers: {
            Accept: 'application/vnd.github+json',
            Authorization: `Bearer ${auth}`
        }
        }
    )
    .then(response => {
        if (response.ok) {
        return response.json();
        } else {
        return null;
        }
    })
    .then(existingFile => {
        const requestBody = {
        message: message,
        content: content // Already in Base64
        };
        if (existingFile) {
        requestBody.sha = existingFile.sha;
        }

        return fetch(
        `https://api.github.com/repos/${owner}/${repo}/contents/${path}`,
        {
            method: 'PUT',
            headers: {
            Accept: 'application/vnd.github+json',
            Authorization: `Bearer ${auth}`
            },
            body: JSON.stringify(requestBody),
        }
        );
    })
    .catch(error => {
        console.error('Error uploading file:', error);
    });
}

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

            // console.log('<span class="word">' + word_split + '</span>');

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

            // console.log('<span class="word">' + word_split + '</span>');

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
    const owner = 'cshariq';
    const repo = 'HSBDC';
    const auth = '{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}';
    for (const file of files) {
        const reader = new FileReader();
        reader.onload = function(event) {
        const content = event.target.result.split(',')[1]; // Get the file content
        const path = file.name;
        const message = `Upload ${path}`;
        
        upload(message, content, owner, repo, path, auth);
        };
        reader.readAsDataURL(file); // Read the file as a data URL
    }
    selectedFile = files[0];
    const prompt = {
        "contents": [
          {
            "role": "user",
            "parts": [
              {
                "text": "Here is some text"
              },
              {
                "fileData": {
                  "fileUri": URL.createObjectURL(selectedFile),
                  "mimeType": selectedFile.type
                }
              }
            ]
          }
        ],
        "systemInstruction": {
          "role": "user",
          "parts": [
            {
              "text": "If the given text is a country or city return the city or country, if not (for e.g. a continent or demographic) return N/A"
            }
          ]
        },
        "generationConfig": {
          "temperature": 1,
          "topK": 40,
          "topP": 0.95,
          "maxOutputTokens": 8192,
          "responseMimeType": "text/plain"
        }
      };
      fetch('https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash-exp:generateContent?key=' + API_KEY, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(prompt)
      })
      .then(response =>  console.log(response.json()))      
      .then(result => {
        // const latestModelResponse = result.candidates[0].content.parts[0].text;
        console.log(result.json());
      })
      .catch(error => console.error('Error:', error));
          
}


 // You can update the DOM or perform other actions with the response text here }
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


// const API_KEY = "YOUR_API_KEY";

// function uploadFile() {
//     const fileInput = document.getElementById('fileInput');
//     const file = fileInput.files[0];
    
// }

