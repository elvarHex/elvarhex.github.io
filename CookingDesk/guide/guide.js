const accordionContainer = document.getElementById("guidesAccordion");

const searchInput = document.getElementById("searchInput");



async function loadGuides() {

try {

const dirResponse = await fetch('guide-md/');

const dirText = await dirResponse.text();



    const parser = new DOMParser();

    const doc = parser.parseFromString(dirText, 'text/html');

    const links = Array.from(doc.querySelectorAll('a'));

    

    let files = links

        .map(a => a.getAttribute('href'))

        .filter(href => href && href.toLowerCase().endsWith('.md'))

        .map(href => {

            let filename = href.split('/').pop();

            return decodeURIComponent(filename);

        });

        

    files = [...new Set(files)];



    for (const file of files) {

        const title = file.replace(/\.md$/i, '');

        

        const details = document.createElement("details");

        details.className = "accordion-item";

        

        const summary = document.createElement("summary");

        summary.className = "accordion-header";

        summary.innerHTML = `

            <span>${title}</span>

            <svg class="accordion-arrow" viewBox="0 0 24 24">

                <path d="M7 10l5 5 5-5z"/>

            </svg>

        `;

        

        const contentContainer = document.createElement("div");

        contentContainer.className = "accordion-content";

        

        const markdownBody = document.createElement("div");

        markdownBody.className = "markdown-body";

        

        contentContainer.appendChild(markdownBody);

        details.appendChild(summary);

        details.appendChild(contentContainer);

        

        accordionContainer.appendChild(details);

        

        try {

            const response = await fetch(`guide-md/${file}`);

            if (response.ok) {

                const mdText = await response.text();

                markdownBody.innerHTML = marked.parse(mdText);

            } else {

                markdownBody.innerHTML = "<p>Error loading content.</p>";

            }

        } catch (error) {

            markdownBody.innerHTML = "<p>Error loading content.</p>";

        }

    }

} catch (error) {

    accordionContainer.innerHTML = "<p>Error loading directory files.</p>";

}





}



searchInput.addEventListener("input", (e) => {

const query = e.target.value.toLowerCase();

const items = document.querySelectorAll(".accordion-item");



items.forEach(item => {

    const titleSpan = item.querySelector(".accordion-header span").textContent.toLowerCase();

    const contentText = item.querySelector(".accordion-content").textContent.toLowerCase();

    

    if (titleSpan.includes(query) || contentText.includes(query)) {

        item.style.display = "block";

    } else {

        item.style.display = "none";

    }

});





});



loadGuides(); 

