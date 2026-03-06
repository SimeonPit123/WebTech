document.addEventListener("DOMContentLoaded", function () {
    const fileInput = document.getElementById("player-file-input");
    const fileLabel = document.getElementById("file-label");
    const mainContent = document.getElementById("main-content");

    fileInput.addEventListener("change", handleFileSelect);

    function handleFileSelect(event) {
        const file = event.target.files[0];
        if (!file) {
            return;
        }

        if (!file.name.endsWith(".json") && file.type !== "application/json") {
            displayError("Please select a valid JSON file.");
            return;
        }

        const reader = new FileReader();

        reader.addEventListener("load", function (e) {
            try {
                const data = JSON.parse(e.target.result);
                buildPageContent(data);
            } catch (error) {
                displayError("Error parsing JSON file: " + error.message);
            }
        });

        reader.addEventListener("error", function () {
            displayError("Error reading the file. Please try again.");
        });

        reader.readAsText(file);
    }

    function displayError(message) {
        clearElement(mainContent);

        const errorParagraph = document.createElement("p");
        errorParagraph.className = "error-message";
        errorParagraph.appendChild(document.createTextNode(message));
        mainContent.appendChild(errorParagraph);
    }

    function clearElement(element) {
        while (element.firstChild) {
            element.removeChild(element.firstChild);
        }
    }

    function buildPageContent(data) {
        if (!data.players || !Array.isArray(data.players)) {
            displayError("Invalid data format: expected a 'players' array.");
            return;
        }

        fileLabel.style.display = "none";
        fileInput.style.display = "none";

        const reloadButton = document.createElement("button");
        reloadButton.className = "reload-button";
        reloadButton.appendChild(document.createTextNode("Load Different File"));
        reloadButton.addEventListener("click", function () {
            fileLabel.style.display = "";
            fileInput.style.display = "";
            fileInput.value = "";
            reloadButton.parentNode.removeChild(reloadButton);
            clearElement(mainContent);
        });
        fileInput.parentNode.insertBefore(reloadButton, fileInput.nextSibling);

        clearElement(mainContent);

        const players = [];
        for (const playerData of data.players) {
            try {
                const formerTeams = [];
                if (Array.isArray(playerData.formerTeams)) {
                    for (const teamData of playerData.formerTeams) {
                        const team = new Team(teamData.title, teamData.country, teamData.city);
                        formerTeams.push(team);
                    }
                }

                const player = new Player(
                    playerData.firstName,
                    playerData.lastName,
                    playerData.born,
                    playerData.nationality,
                    playerData.position,
                    playerData.role,
                    playerData.number,
                    playerData.photo,
                    formerTeams
                );
                players.push(player);
            } catch (error) {
                console.error("Error creating player:", playerData.firstName, error.message);
            }
        }

        players.sort(function (a, b) {
            return a.number - b.number;
        });

        const article = document.createElement("article");
        article.className = "article";

        const introSection = document.createElement("section");
        introSection.className = "section players-intro";

        const introHeading = document.createElement("h3");
        introHeading.className = "section__title";
        introHeading.appendChild(document.createTextNode("Squad Overview"));
        introSection.appendChild(introHeading);

        const introParagraph = document.createElement("p");
        introParagraph.className = "text";
        introParagraph.appendChild(document.createTextNode(
            "The following " + players.length + " players have been loaded from the selected data file. " +
            "Hover over a player's former teams to see detailed information about each club."
        ));
        introSection.appendChild(introParagraph);
        article.appendChild(introSection);

        const cardsSection = document.createElement("section");
        cardsSection.className = "section players-grid";

        const cardsHeading = document.createElement("h3");
        cardsHeading.className = "section__title";
        cardsHeading.appendChild(document.createTextNode("Player Profiles"));
        cardsSection.appendChild(cardsHeading);

        const cardsContainer = document.createElement("div");
        cardsContainer.className = "player-cards";


        cardsContainer.addEventListener("click", function (event) {
            const card = event.target.closest(".player-card");
            if (card) {
                card.dataset.captureHandled = "true";
            }
        }, true); 

        cardsContainer.addEventListener("click", function (event) {
            const card = event.target.closest(".player-card");
            if (!card) {
                return;
            }

            if (event.target.tagName === "A" || event.target.tagName === "IMG") {
                return;
            }

            const isExpanded = card.classList.contains("player-card--expanded");

            const allCards = cardsContainer.querySelectorAll(".player-card--expanded");
            for (const expandedCard of allCards) {
                expandedCard.classList.remove("player-card--expanded");
                expandedCard.setAttribute("aria-expanded", "false");
            }

            if (!isExpanded) {
                card.classList.add("player-card--expanded");
                card.setAttribute("aria-expanded", "true");
            }
        }, false); 

        for (const player of players) {
            const card = createPlayerCard(player);
            cardsContainer.appendChild(card);
        }

        cardsSection.appendChild(cardsContainer);
        article.appendChild(cardsSection);

        const tableSection = document.createElement("section");
        tableSection.className = "section players-table-section";

        const tableHeading = document.createElement("h3");
        tableHeading.className = "section__title";
        tableHeading.appendChild(document.createTextNode("Squad List"));
        tableSection.appendChild(tableHeading);

        const table = createPlayerTable(players);
        tableSection.appendChild(table);
        article.appendChild(tableSection);

        mainContent.appendChild(article);

        if (typeof refreshElementMenu === "function") {
            refreshElementMenu();
        }
    }

    function createPlayerCard(player) {
        const card = document.createElement("article");
        card.className = "player-card";
        card.setAttribute("role", "button");
        card.setAttribute("tabindex", "0");
        card.setAttribute("aria-expanded", "false");
        card.setAttribute("aria-label", "Player card for " + player.fullName + ". Click to expand.");

        card.addEventListener("keydown", function (event) {
            if (event.key === "Enter" || event.key === " ") {
                event.preventDefault();
                card.click();
            }
        });

        const photoWrapper = document.createElement("div");
        photoWrapper.className = "player-card__photo-wrapper";

        const photo = document.createElement("img");
        photo.className = "player-card__photo";
        photo.src = player.photo;
        photo.alt = "Photo of " + player.fullName;
        photo.loading = "lazy";

        photo.addEventListener("error", function () {
            this.alt = "Photo not available for " + player.fullName;
            this.src = "";
            this.style.display = "none";
            const placeholder = document.createElement("div");
            placeholder.className = "player-card__photo-placeholder";
            placeholder.appendChild(document.createTextNode("#" + player.number));
            photoWrapper.appendChild(placeholder);
        });

        photoWrapper.appendChild(photo);
        card.appendChild(photoWrapper);

        const infoDiv = document.createElement("div");
        infoDiv.className = "player-card__info";

        const nameHeading = document.createElement("h4");
        nameHeading.className = "player-card__name";
        nameHeading.appendChild(document.createTextNode(player.fullName));
        infoDiv.appendChild(nameHeading);

        const numberBadge = document.createElement("span");
        numberBadge.className = "player-card__number";
        numberBadge.appendChild(document.createTextNode("#" + player.number));
        infoDiv.appendChild(numberBadge);

        const positionParagraph = document.createElement("p");
        positionParagraph.className = "player-card__position";
        positionParagraph.appendChild(document.createTextNode(player.position));
        infoDiv.appendChild(positionParagraph);

        card.appendChild(infoDiv);

        const detailsDiv = document.createElement("div");
        detailsDiv.className = "player-card__details";

        const roleParagraph = document.createElement("p");
        roleParagraph.className = "player-card__detail";
        const roleLabel = document.createElement("strong");
        roleLabel.appendChild(document.createTextNode("Role: "));
        roleParagraph.appendChild(roleLabel);
        roleParagraph.appendChild(document.createTextNode(player.role));
        detailsDiv.appendChild(roleParagraph);

        const nationalityParagraph = document.createElement("p");
        nationalityParagraph.className = "player-card__detail";
        const nationalityLabel = document.createElement("strong");
        nationalityLabel.appendChild(document.createTextNode("Nationality: "));
        nationalityParagraph.appendChild(nationalityLabel);
        nationalityParagraph.appendChild(document.createTextNode(player.nationality));
        detailsDiv.appendChild(nationalityParagraph);

        const bornParagraph = document.createElement("p");
        bornParagraph.className = "player-card__detail";
        const bornLabel = document.createElement("strong");
        bornLabel.appendChild(document.createTextNode("Born: "));
        bornParagraph.appendChild(bornLabel);
        const formattedDate = player.born.toLocaleDateString("en-GB", {
            day: "numeric",
            month: "long",
            year: "numeric"
        });
        bornParagraph.appendChild(document.createTextNode(formattedDate + " (age " + player.age + ")"));
        detailsDiv.appendChild(bornParagraph);

        const teamsHeading = document.createElement("p");
        teamsHeading.className = "player-card__detail";
        const teamsLabel = document.createElement("strong");
        teamsLabel.appendChild(document.createTextNode("Former Teams:"));
        teamsHeading.appendChild(teamsLabel);
        detailsDiv.appendChild(teamsHeading);

        const teamsList = document.createElement("ul");
        teamsList.className = "player-card__teams";

        for (const team of player.formerTeams) {
            const teamItem = document.createElement("li");
            teamItem.className = "player-card__team";

            const teamLink = document.createElement("span");
            teamLink.className = "player-card__team-name";
            teamLink.appendChild(document.createTextNode(team.title));
            teamLink.setAttribute("tabindex", "0");
            teamLink.setAttribute("role", "button");
            teamLink.setAttribute("aria-label", team.title + ". Hover for details.");

            const tooltip = document.createElement("span");
            tooltip.className = "tooltip";
            tooltip.setAttribute("role", "tooltip");

            const tooltipTitle = document.createElement("strong");
            tooltipTitle.appendChild(document.createTextNode(team.title));
            tooltip.appendChild(tooltipTitle);
            tooltip.appendChild(document.createElement("br"));
            tooltip.appendChild(document.createTextNode("City: " + team.city));
            tooltip.appendChild(document.createElement("br"));
            tooltip.appendChild(document.createTextNode("Country: " + team.country));

            teamLink.appendChild(tooltip);

            teamLink.addEventListener("mouseenter", function () {
                tooltip.classList.add("tooltip--visible");
            });

            teamLink.addEventListener("mouseleave", function () {
                tooltip.classList.remove("tooltip--visible");
            });

            teamLink.addEventListener("focus", function () {
                tooltip.classList.add("tooltip--visible");
            });

            teamLink.addEventListener("blur", function () {
                tooltip.classList.remove("tooltip--visible");
            });

            teamItem.appendChild(teamLink);
            teamsList.appendChild(teamItem);
        }

        detailsDiv.appendChild(teamsList);
        card.appendChild(detailsDiv);

        return card;
    }

    function createPlayerTable(players) {
        const table = document.createElement("table");
        table.className = "table";

      
        const caption = document.createElement("caption");
        caption.className = "table__caption";
        caption.appendChild(document.createTextNode("Springboks Squad"));
        table.appendChild(caption);

        const thead = document.createElement("thead");
        thead.className = "table__head";
        const headerRow = document.createElement("tr");

        const headers = ["#", "Name", "Position", "Role", "Nationality", "Age"];
        for (const headerText of headers) {
            const th = document.createElement("th");
            th.className = "table__header";
            th.setAttribute("scope", "col");
            th.appendChild(document.createTextNode(headerText));
            headerRow.appendChild(th);
        }
        thead.appendChild(headerRow);
        table.appendChild(thead);

        const tbody = document.createElement("tbody");
        tbody.className = "table__body";

        for (let i = 0; i < players.length; i++) {
            const player = players[i];
            const row = document.createElement("tr");
            row.className = (i % 2 === 1) ? "table__row table__row--alt" : "table__row";

            const cellData = [
                String(player.number),
                player.fullName,
                player.position,
                player.role,
                player.nationality,
                String(player.age)
            ];

            for (const text of cellData) {
                const td = document.createElement("td");
                td.className = "table__cell";
                td.appendChild(document.createTextNode(text));
                row.appendChild(td);
            }

            tbody.appendChild(row);
        }
        table.appendChild(tbody);

        const tfoot = document.createElement("tfoot");
        tfoot.className = "table__foot";
        const footRow = document.createElement("tr");
        const footCell = document.createElement("td");
        footCell.className = "table__cell";
        footCell.setAttribute("colspan", String(headers.length));
        footCell.appendChild(document.createTextNode("Data loaded from JSON file"));
        footRow.appendChild(footCell);
        tfoot.appendChild(footRow);
        table.appendChild(tfoot);

        return table;
    }
});
