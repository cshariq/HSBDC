// var slider = document.getElementById("myRange");
// var output = document.getElementById("demo");
// output.innerHTML = slider.value;

// slider.oninput = function() {
//   output.innerHTML = this.value;
// }
document.addEventListener('DOMContentLoaded', () => {
    const slider = document.getElementById('myRange');
    const text = document.getElementById('slider-text-1960');
    const totalSections = 90; // Total number of sections (1% increments)
    const barWidth = 1; // Width of the small bars
    const largeBarWidth = 1.5; // Width of the large bars

    function updateBars() {
        const sliderWidth = slider.offsetWidth; // Get the width of the slider
        const textWidth = text.offsetWidth;
        const bars = document.querySelectorAll('.small-bar, .large-bar');
        bars.forEach(bar => bar.remove()); // Remove existing bars

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
    window.addEventListener('resize', function(event) {
        const slider = document.getElementById('myRange');
        const text = document.getElementById('slider-text-1960');
        const totalSections = 90; // Total number of sections (1% increments)
        const barWidth = 1; // Width of the small bars
        const largeBarWidth = 1.5; // Width of the large bars
    
        function updateBars() {
            const sliderWidth = slider.offsetWidth; // Get the width of the slider
            const textWidth = text.offsetWidth;
            const bars = document.querySelectorAll('.small-bar, .large-bar');
            bars.forEach(bar => bar.remove()); // Remove existing bars
    
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
        requestAnimationFrame(updateBar());
    }, true);
    updateBars(); // Initial call to set up bars
});

window.addEventListener('resize', function(event) {
    const slider = document.getElementById('myRange');
    const text = document.getElementById('slider-text-1960');
    const totalSections = 90; // Total number of sections (1% increments)
    const barWidth = 1; // Width of the small bars
    const largeBarWidth = 1.5; // Width of the large bars
    
    function updateBars() {
        console.log("l")
        const sliderWidth = slider.offsetWidth; // Get the width of the slider
        const textWidth = text.offsetWidth;
        const bars = document.querySelectorAll('.small-bar, .large-bar');
        bars.forEach(bar => bar.remove()); // Remove existing bars

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
    updateBars(); // Initial call to set up bars
}, true);

document.querySelectorAll('.graph-options option').forEach(option => {
    option.addEventListener('click', function() {
        document.querySelectorAll('.graph-options option').forEach(opt => {
            opt.removeAttribute('selected');
        });
        this.setAttribute('selected', 'selected');
        this.style.transform = 'translateX(50px)'; // Change the position
        setTimeout(() => {
            this.style.transform = 'translateX(0)';
        }, 500); // Animate back to original position
    });
});

document.getElementById("search-box").addEventListener("input", function() {
    this.value = '';
    this.select();
});

// document.getElementById('search-box').addEventListener('keydown', function(event) { 
//     if (event.key === 'Enter') { 
//         this.value = ''; // 
//         this.blur(); // Remove focus from the text box 
// } });