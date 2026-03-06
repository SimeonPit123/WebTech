document.addEventListener("DOMContentLoaded", () => {
    const footer = document.querySelector(".footer .footer__content");
    if (!footer) return;

    const create = (tag, className, text) => {
        const element = document.createElement(tag);
        if (className) element.className = className;
        if (text) element.textContent = text;
        return element;
    };

    const controlsDiv = create("div", "appearance-controls");

    const elementLabel = create("label", "appearance-controls__label", "Select element: ");
    elementLabel.htmlFor = "element-selector";

    const elementSelect = create("select", "appearance-controls__select");
    elementSelect.id = "element-selector";
    elementSelect.setAttribute("aria-label", "Select a page element to style");

    const propertyLabel = create("label", "appearance-controls__label", "Change property: ");
    propertyLabel.htmlFor = "property-selector";

    const propertySelect = create("select", "appearance-controls__select");
    propertySelect.id = "property-selector";
    propertySelect.setAttribute("aria-label", "Select a style property to change");

    const applyButton = create("button", "appearance-controls__button", "Apply");
    applyButton.setAttribute("aria-label", "Apply the selected style to the selected element");

    const resetButton = create("button", "appearance-controls__button appearance-controls__button--reset", "Reset All");
    resetButton.setAttribute("aria-label", "Reset all style modifications");

    const properties = [
        ["", "-- Select property --"],
        ["fontSize-small", "Font Size: Small (0.8rem)"],
        ["fontSize-medium", "Font Size: Medium (1rem)"],
        ["fontSize-large", "Font Size: Large (1.3rem)"],
        ["fontSize-xlarge", "Font Size: X-Large (1.6rem)"],
        ["color-black", "Font Color: Black"],
        ["color-green", "Font Color: Green (#0d6a3e)"],
        ["color-gold", "Font Color: Gold (#ffc300)"],
        ["color-red", "Font Color: Red (#c0392b)"],
        ["color-blue", "Font Color: Blue (#2c3e50)"]
    ];

    const styles = {
        fontSize: {
            small: "0.8rem",
            medium: "1rem",
            large: "1.3rem",
            xlarge: "1.6rem"
        },
        color: {
            black: "#000000",
            green: "#0d6a3e",
            gold: "#ffc300",
            red: "#c0392b",
            blue: "#2c3e50"
        }
    };

    propertySelect.append(
        ...properties.map(([value, text]) => {
            const option = document.createElement("option");
            option.value = value;
            option.textContent = text;
            return option;
        })
    );

    controlsDiv.append(elementLabel, elementSelect, propertyLabel, propertySelect, applyButton, resetButton);
    footer.appendChild(controlsDiv);

    const populateElementMenu = () => {
        elementSelect.replaceChildren();

        [
            ["", "-- Select element --"],
            ["body", "body"]
        ].forEach(([value, text]) => {
            const option = document.createElement("option");
            option.value = value;
            option.textContent = text;
            elementSelect.appendChild(option);
        });

        ["article", "section", "aside"].forEach(selector => {
            document.querySelectorAll(selector).forEach((element, i) => {
                const id = `${selector}-${i}`;
                element.dataset.appearanceId = id;

                const heading = element.querySelector("h2, h3, h4");
                const label = heading ? heading.textContent.trim() : `${selector} ${i + 1}`;

                const option = document.createElement("option");
                option.value = id;
                option.textContent = `${selector}: ${label}`;
                elementSelect.appendChild(option);
            });
        });
    };

    const findElement = id => id === "body" ? document.body : document.querySelector(`[data-appearance-id="${id}"]`);

    const applyStyle = () => {
        const [property, value] = propertySelect.value.split("-");
        const element = findElement(elementSelect.value);
        if (!property || !value || !element || !styles[property]?.[value]) return;
        element.style[property] = styles[property][value];
    };

    const resetStyles = () => {
        [document.body, ...document.querySelectorAll("[data-appearance-id]")].forEach(element => {
            element.style.fontSize = "";
            element.style.color = "";
        });

        elementSelect.selectedIndex = 0;
        propertySelect.selectedIndex = 0;
    };

    applyButton.addEventListener("click", applyStyle);
    resetButton.addEventListener("click", resetStyles);

    populateElementMenu();
    window.refreshElementMenu = populateElementMenu;
});