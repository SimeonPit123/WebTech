
"use strict";

document.addEventListener("DOMContentLoaded", function () {
    const footer = document.querySelector(".footer .footer__content");
    if (!footer) {
        return;
    }

    const controlsDiv = document.createElement("div");
    controlsDiv.className = "appearance-controls";

    const elementLabel = document.createElement("label");
    elementLabel.className = "appearance-controls__label";
    elementLabel.setAttribute("for", "element-selector");
    elementLabel.appendChild(document.createTextNode("Select element: "));

    const elementSelect = document.createElement("select");
    elementSelect.className = "appearance-controls__select";
    elementSelect.id = "element-selector";
    elementSelect.setAttribute("aria-label", "Select a page element to style");

    controlsDiv.appendChild(elementLabel);
    controlsDiv.appendChild(elementSelect);

    const propertyLabel = document.createElement("label");
    propertyLabel.className = "appearance-controls__label";
    propertyLabel.setAttribute("for", "property-selector");
    propertyLabel.appendChild(document.createTextNode("Change property: "));

    const propertySelect = document.createElement("select");
    propertySelect.className = "appearance-controls__select";
    propertySelect.id = "property-selector";
    propertySelect.setAttribute("aria-label", "Select a style property to change");

    const properties = [
        { value: "", text: "-- Select property --" },
        { value: "fontSize-small", text: "Font Size: Small (0.8rem)" },
        { value: "fontSize-medium", text: "Font Size: Medium (1rem)" },
        { value: "fontSize-large", text: "Font Size: Large (1.3rem)" },
        { value: "fontSize-xlarge", text: "Font Size: X-Large (1.6rem)" },
        { value: "color-black", text: "Font Color: Black" },
        { value: "color-green", text: "Font Color: Green (#0d6a3e)" },
        { value: "color-gold", text: "Font Color: Gold (#ffc300)" },
        { value: "color-red", text: "Font Color: Red (#c0392b)" },
        { value: "color-blue", text: "Font Color: Blue (#2c3e50)" }
    ];

    for (const prop of properties) {
        const option = document.createElement("option");
        option.value = prop.value;
        option.appendChild(document.createTextNode(prop.text));
        propertySelect.appendChild(option);
    }

    controlsDiv.appendChild(propertyLabel);
    controlsDiv.appendChild(propertySelect);

    const applyButton = document.createElement("button");
    applyButton.className = "appearance-controls__button";
    applyButton.appendChild(document.createTextNode("Apply"));
    applyButton.setAttribute("aria-label", "Apply the selected style to the selected element");
    controlsDiv.appendChild(applyButton);

    const resetButton = document.createElement("button");
    resetButton.className = "appearance-controls__button appearance-controls__button--reset";
    resetButton.appendChild(document.createTextNode("Reset All"));
    resetButton.setAttribute("aria-label", "Reset all style modifications");
    controlsDiv.appendChild(resetButton);

    footer.appendChild(controlsDiv);

    function populateElementMenu() {
        while (elementSelect.firstChild) {
            elementSelect.removeChild(elementSelect.firstChild);
        }

        const defaultOption = document.createElement("option");
        defaultOption.value = "";
        defaultOption.appendChild(document.createTextNode("-- Select element --"));
        elementSelect.appendChild(defaultOption);

        const bodyOption = document.createElement("option");
        bodyOption.value = "body";
        bodyOption.appendChild(document.createTextNode("body"));
        elementSelect.appendChild(bodyOption);

        const articles = document.querySelectorAll("article");
        for (let i = 0; i < articles.length; i++) {
            const option = document.createElement("option");
            const identifier = "article-" + i;
            articles[i].dataset.appearanceId = identifier;
            option.value = identifier;

            const heading = articles[i].querySelector("h2, h3, h4");
            const label = heading ? heading.textContent.trim() : "Article " + (i + 1);
            option.appendChild(document.createTextNode("article: " + label));
            elementSelect.appendChild(option);
        }

        const sections = document.querySelectorAll("section");
        for (let i = 0; i < sections.length; i++) {
            const option = document.createElement("option");
            const identifier = "section-" + i;
            sections[i].dataset.appearanceId = identifier;
            option.value = identifier;

            const heading = sections[i].querySelector("h2, h3, h4");
            const label = heading ? heading.textContent.trim() : "Section " + (i + 1);
            option.appendChild(document.createTextNode("section: " + label));
            elementSelect.appendChild(option);
        }

        const asides = document.querySelectorAll("aside");
        for (let i = 0; i < asides.length; i++) {
            const option = document.createElement("option");
            const identifier = "aside-" + i;
            asides[i].dataset.appearanceId = identifier;
            option.value = identifier;

            const heading = asides[i].querySelector("h2, h3, h4");
            const label = heading ? heading.textContent.trim() : "Aside " + (i + 1);
            option.appendChild(document.createTextNode("aside: " + label));
            elementSelect.appendChild(option);
        }
    }

    function findElementByIdentifier(identifier) {
        if (identifier === "body") {
            return document.body;
        }
        return document.querySelector('[data-appearance-id="' + identifier + '"]');
    }

    function applyStyle() {
        const elementId = elementSelect.value;
        const propertyValue = propertySelect.value;

        if (!elementId || !propertyValue) {
            return;
        }

        const targetElement = findElementByIdentifier(elementId);
        if (!targetElement) {
            return;
        }

        const parts = propertyValue.split("-");
        const property = parts[0];
        const value = parts[1];

        if (property === "fontSize") {
            const sizeMap = {
                "small": "0.8rem",
                "medium": "1rem",
                "large": "1.3rem",
                "xlarge": "1.6rem"
            };
            targetElement.style.fontSize = sizeMap[value] || "1rem";
        } else if (property === "color") {
            const colorMap = {
                "black": "#000000",
                "green": "#0d6a3e",
                "gold": "#ffc300",
                "red": "#c0392b",
                "blue": "#2c3e50"
            };
            targetElement.style.color = colorMap[value] || "#333";
        }
    }
    function resetStyles() {
        document.body.style.fontSize = "";
        document.body.style.color = "";

        const styledElements = document.querySelectorAll("[data-appearance-id]");
        for (const element of styledElements) {
            element.style.fontSize = "";
            element.style.color = "";
        }

        elementSelect.selectedIndex = 0;
        propertySelect.selectedIndex = 0;
    }

    applyButton.addEventListener("click", applyStyle);
    resetButton.addEventListener("click", resetStyles);

    populateElementMenu();
    window.refreshElementMenu = populateElementMenu;
});
