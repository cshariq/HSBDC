var resizeId;
$(window).resize(function() {
    clearTimeout(resizeId);
    resizeId = setTimeout(doneResizing, 500);
});

function doneResizing() {
    const sliderWidth = slider.offsetWidth;
    const textWidth = text.offsetWidth;
    const bars = document.querySelectorAll('.small-bar, .large-bar');
    bars.forEach(bar => bar.remove());

    for (let i = 0; i <= totalSections; i++) {
        const bar = document.createElement('div');
        if (i % 5 === 0) {
            bar.className = 'large-bar';
            bar.style.width = `${largeBarWidth}px`;
        } else {
            bar.className = 'small-bar';
            bar.style.width = `${barWidth}px`;
        }
        const position = `calc(${i} * ${sliderWidth / 90}px)`;
        bar.style.left = `calc(${position} + ${textWidth + 26}px)`;
        slider.parentElement.appendChild(bar);
    }
}

document.addEventListener('DOMContentLoaded', () => {
    const slider = document.getElementById('myRange');
    const text = document.getElementById('slider-text-1960');
    const totalSections = 90;
    const barWidth = 1;
    const largeBarWidth = 1.5;

    function updateBars() {
        const sliderWidth = slider.offsetWidth;
        const textWidth = text.offsetWidth;
        const bars = document.querySelectorAll('.small-bar, .large-bar');
        bars.forEach(bar => bar.remove());

        for (let i = 0; i <= totalSections; i++) {
            const bar = document.createElement('div');
            if (i % 5 === 0) {
                bar.className = 'large-bar';
                bar.style.width = `${largeBarWidth}px`;
            } else {
                bar.className = 'small-bar';
                bar.style.width = `${barWidth}px`;
            }
            const position = `calc(${i} * ${sliderWidth / 90}px)`;
            bar.style.left = `calc(${position} + ${textWidth + 26}px)`;
            slider.parentElement.appendChild(bar);
        }
    }
    brython()
    updateBars();
});

document.querySelectorAll('.graph-options option').forEach(option => {
    option.addEventListener('click', function () {
        document.querySelectorAll('.graph-options option').forEach(opt => {
            opt.removeAttribute('selected');
        });
        this.setAttribute('selected', 'selected');
        this.style.transform = 'translateX(50px)';
        setTimeout(() => {
            this.style.transform = 'translateX(0)';
        }, 500);
    });
});

function myFunction() {
    var element = document.body;
    element.classList.toggle("dark-modes");
}

function changeSelectedOption() { 
    // var selectElement = document.getElementById("view-options"); 
    // selectElement.selectedIndex = 1; // Change to the second option 
    // console.log("Hi")
    // document.getElementById("schools").classList.remove("hidden");
    // document.getElementById("observations").classList.add("hidden"); 
    // var styleSheet = document.getElementById("style"); 
    // if (styleSheet) { 
    //     styleSheet.parentNode.removeChild(styleSheet); 
    //     var newStyleSheet = document.createElement("link"); 
    //     newStyleSheet.rel = "stylesheet"; 
    //     newStyleSheet.href = "suggestStyle.css"; 
    //     document.head.appendChild(newStyleSheet);
    // } 
    // var element = document.getElementById("observations"); 
    // if (element.classList.contains("observations")) { 
    //     element.classList.remove("observations"); 
    // } else { 
    //     element.classList.add("observations"); 
    // }
    var styleSheet = document.getElementById("style"); 
    if (styleSheet) {       
        console.log("h")
        styleSheet.parentNode.removeChild(styleSheet); 
        var newStyleSheet = document.createElement("link"); 
        newStyleSheet.rel = "stylesheet"; 
        newStyleSheet.href = "suggestStyle.css"; 
        newStyleSheet.id = "styleSuggest";
        document.head.appendChild(newStyleSheet);
        document.querySelectorAll('#observations').forEach(function(element) {
            element.style.display = 'none';
        });  
        document.querySelectorAll('#schools').forEach(function(element) {
            element.style.display = 'flex';
        });
        // var mapElement = document.getElementById("map"); 
        // var newParent = document.getElementById; // You can change this to any other element where you want to move the map 
        // newParent.appendChild(mapElement);
    } 
    else {
        document.querySelectorAll('#schools').forEach(function(element) {
            element.style.display = 'none';
        });
        document.querySelectorAll('#observations').forEach(function(element) {
            element.style.display = 'flex';
        });
        var styleSheet = document.getElementById("styleSuggest"); 
        styleSheet.parentNode.removeChild(styleSheet); 
        var newStyleSheet = document.createElement("link"); 
        newStyleSheet.rel = "stylesheet"; 
        newStyleSheet.href = "suggestStyle.css";
        newStyleSheet.id = "style";
        document.head.appendChild(newStyleSheet); 
    }
}