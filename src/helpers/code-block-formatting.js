
function copyToClipboard(copyText) {
    navigator.clipboard.writeText(copyText).then(
        () => {
        
        },
        (err) => {
            console.error("Failed to copy text: ", err);
        }
    );
}




export function makeCodeBlock() {
    
    const codeBlocks = document.querySelectorAll("pre");

    codeBlocks.forEach((element) => {
        // Checking if the button already exists
        if (!element.querySelector(".copyBtn")) {
            const copyBtn = document.createElement("button");
            copyBtn.innerText = "Copy code";
            copyBtn.setAttribute("class", "copyBtn");
            copyBtn.setAttribute("type", "button");
            let copyText = element.textContent;
            element.prepend(copyBtn);
            copyBtn.addEventListener("click", () => copyToClipboard(copyText));
        }
    });
}
