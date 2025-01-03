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
        e.preventDefault();
        dropbox.classList.add("dragover");
        dropbox.highlight(); // Call highlight method
    });

    dropbox.addEventListener("dragleave", function (e) {
        e.preventDefault();
        dropbox.classList.remove("dragover");
    });

    dropbox.addEventListener("drop", function (e) {
        e.preventDefault();
        dropbox.classList.remove("dragover");
        var files = e.dataTransfer.files;
        handleFiles(files);
    });

    dropbox.addEventListener("click", function () {
        fileElem.click();
    });

    function handleFiles(files) {
            const yearlyData = {};
            data.forEach(item => {
                if (!yearlyData[item.year]) {
                    yearlyData[item.year] = [];
                }
                yearlyData[item.year].push(item);
            });
        
            for (const year in yearlyData) {
                const yearData = yearlyData[year];
                const totalConsumption = yearData.reduce((sum, item) => sum + item.consumption, 0);
                const totalCost = yearData.reduce((sum, item) => sum + item.cost, 0);
                const averageMonthlyConsumption = totalConsumption / yearData.length;
                const averageCostPerUnit = totalCost / totalConsumption;
        
                document.getElementById('dropbox').style.display = "None";
                document.getElementById('metrics').style.display = "flex";
        
                console.log(`\n${utilityType} - ${year}:`);
                console.log("Total Consumption:", totalConsumption);
                console.log("Total Cost:", totalCost);
                console.log("Average Monthly Consumption:", averageMonthlyConsumption.toFixed(2));
                console.log("Average Cost per Unit:", averageCostPerUnit.toFixed(2));
        
                // Year-over-year comparison (if data for previous year exists)
                const previousYear = parseInt(year) - 1;
                if (yearlyData[previousYear]) {
                    const previousYearTotalConsumption = yearlyData[previousYear].reduce((sum, item) => sum + item.consumption, 0);
                    const consumptionChange = ((totalConsumption - previousYearTotalConsumption) / previousYearTotalConsumption) * 100;
                    console.log("Consumption Change vs. Previous Year:", consumptionChange.toFixed(2), "%");
                }
        
                // Simple anomaly detection (example: consumption more than 20% above average)
                const yearlyAverageConsumption = totalConsumption / 12;
                yearData.forEach(item => {
                    if (item.consumption > yearlyAverageConsumption * 1.2) {
                        console.warn(`Anomaly detected in ${item.month}: Consumption is unusually high (${item.consumption})`);
                    }
                });
        
                // Create charts for each box
                new Chart(document.getElementById('electricity-consumption-chart'), {
                    type: 'bar',
                    data: {
                        labels: yearData.map(item => item.month),
                        datasets: [{
                            label: 'Electricity Consumption',
                            data: yearData.map(item => item.consumption),
                            backgroundColor: 'rgba(255, 99, 132, 0.2)',
                            borderColor: 'rgba(255, 99, 132, 1)',
                            borderWidth: 1
                        }]
                    }
                });
        
                // Similarly create charts for other boxes...
            }
        
            console.log(files);
        }        
});
