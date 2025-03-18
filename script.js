// =============================== Intersection Observer =====================================
const homeElement = document.querySelector('#home');
const homeNavLink = document.querySelector('a[href="#home"]'); 

let observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {

      homeNavLink.classList.add('text-primary-2'); 
    } else {
      
      homeNavLink.classList.remove('text-primary-2');
    }
  });
}, {
  threshold: 0.5 
});

observer.observe(homeElement);

// ==================================== Side-Bar ============================================

const barsToggle = document.getElementById('side-bar');

function sideBar() {
    barsToggle.classList.toggle('hidden');
    barsToggle.classList.toggle('flex');
}


// ================================ Words Count/Clear/Paste =================================================
const inputBox = document.getElementById("inputBox");
const wordCount = document.getElementById("wordCount");
const clearBtn = document.getElementById("clearBtn");
const pasteBtn = document.getElementById("pasteBtn");

//  word count

function updateWordCount() {
    let words = inputBox.value.trim().split(/\s+/).filter(word => word.length > 0);
    wordCount.textContent = `Words: ${words.length}`;
}

//  input changes

inputBox.addEventListener("input", () => {
    updateWordCount();
    togglePasteButton();
});

//  Clear button

clearBtn.addEventListener("click", () => {
    inputBox.value = "";
    updateWordCount();
    togglePasteButton();
});

// Paste button 

function togglePasteButton() {
  pasteBtn.classList.toggle("hidden", inputBox.value.trim().length > 0);
}

pasteBtn.addEventListener("click", async () => {
    try {
        const text = await navigator.clipboard.readText();
        inputBox.value = text;
        updateWordCount();
        togglePasteButton();
    } catch (err) {
        console.error("Failed to paste: ", err);
    }
});

updateWordCount();
togglePasteButton();

// ====================================================== Fetching Api From Open AI ==========================

const outputBox = document.getElementById("outputBox");
const humanizeBtn = document.getElementById("humanizeBtn");

const apiKey = "*******"; // Key Missing !!

humanizeBtn.addEventListener("click", async () => {
    const inputText = inputBox.value.trim();
    if (!inputText) return; 

    try {
        const response = await fetch("https://api.openai.com/v1/chat/completions", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${apiKey}`
            },
            body: JSON.stringify({
                model: "gpt-4", 
                messages: [
                    { role: "system", content: "You are an assistant that only rewrites text to sound more natural and humanized without changing its meaning. Just convert and deliver without mentioning anything " },
                    { role: "user", content: inputText }
                ],
                temperature: 0.7
            })
        });

        const data = await response.json();
        if (data.choices && data.choices.length > 0) {
            outputBox.value = data.choices[0].message.content;
        } else {
            outputBox.value = "API Key Missing ! Check Js File or download Js file from here (sadsadasd)";
        }
    } catch (error) {
        console.error("Error fetching from OpenAI:", error);
        outputBox.value = "Error processing request.";
    }
});
  


