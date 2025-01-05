const API_KEY = "AIzaSyAdJ1GLhQNBPz9Lp69TptrAJuHSQOuTleU";

function deleteFileFromGitHub(path, sha, callback) {
    const repo = 'cshariq/HSBDC';
    const token = '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';
    const message = `Delete ${path}`;

    const url = `https://api.github.com/repos/${repo}/contents/${path}`;
    const data = {
        message: message,
        sha: sha,
        committer: {
            name: "Shraiq Charolia",
            email: "shariq.charolia@gmail.com"
        }
    };

    fetch(url, {
        method: 'DELETE',
        headers: {
            'Authorization': `token ${token}`,
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
    })
    .then(response => response.json())
    .then(data => {
        if (data.commit) {
            callback(); // Call the callback function after deletion
        } else {
            console.error('Failed to delete file:', data);
        }
    })
    .catch(error => {
        console.error('Error:', error);
    });
}

function uploadToGitHub(filename, content, path, callback) {
    const repo = 'cshariq/HSBDC';
    const message = 'Add ' + filename;
    const token = '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';

    const url = `https://api.github.com/repos/${repo}/contents/data/${path}`;
    const data = {
        message: message,
        content: content,
        committer: {
            name: "Shariq Charolia",
            email: "shariq.charolia@gmail.com"
        }
    };

    fetch(url, {
        method: 'PUT',
        headers: {
            'Authorization': `token ${token}`,
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
    })
    .then(response => response.json())
    .then(data => {
        if (data.content) {
            console.log('File uploaded successfully:', data.content.html_url);
            callback(data.content.html_url);

        } else {
            console.error('Failed to upload file:', data);
        }
    })
    .catch(error => {
        console.error('Error:', error);
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
    const file = files[0];
    const reader = new FileReader();
    console.log(file.mimeType)
    reader.onload = function(event) {
        const content = event.target.result.split(',')[1]; // Get the file content in base64
        const path = file.name; // Set the path to the file's name
        const message = `Upload ${path}`;
        uploadToGitHub(message, content, path, function(fileUrl) {
            const rawUrl = `https://raw.githubusercontent.com/cshariq/HSBDC/main/${fileUrl}`;
            processData(rawUrl)
            // deleteFileFromGitHub(path, fileSha, function() {
            //     console.log('File deleted successfully');
            // });
        });
    };
    reader.readAsDataURL(file);
}

function processData(file) {
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
                  "fileUri": file,
                  "mimeType": "image/png"
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
        const latestModelResponse = result.candidates[0].content.parts[0].text;
        console.log(latestModelResponse);
      })
      .catch(error => console.error('Error:', error));
}