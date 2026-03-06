document.addEventListener("DOMContentLoaded", () => {
    const fileInput = document.getElementById("player-file-input");
    const fileLabel = document.getElementById("file-label");
    const mainContent = document.getElementById("main-content");

    const clear = element => element.replaceChildren();

    const make = (tag, className, text) => {
        const element = document.createElement(tag);
        if (className) element.className = className;
        if (text !== undefined) element.textContent = text;
        return element;
    };

    const createDetail = (label, value) => {
        const p = make("p", "player-card__detail");
        const strong = document.createElement("strong");
        strong.textContent = label;
        p.append(strong, value);
        return p;
    };

    const createPlayerCard = player => {
        const card = make("article", "player-card");
        card.tabIndex = 0;

        card.addEventListener("click", () => {
            const open = card.classList.contains("player-card--expanded");
            document.querySelectorAll(".player-card--expanded").forEach(element => {
                element.classList.remove("player-card--expanded");
            });
            if (!open) card.classList.add("player-card--expanded");
        });

        card.addEventListener("keydown", event => {
            if (event.key === "Enter" || event.key === " ") {
                event.preventDefault();
                card.click();
            }
        });

        const photoWrapper = make("div", "player-card__photo-wrapper");
        const photo = make("img", "player-card__photo");
        photo.src = player.photo;
        photo.alt = player.fullName;
        photo.loading = "lazy";
        photo.addEventListener("error", () => {
            photo.remove();
            photoWrapper.appendChild(make("div", "player-card__photo-placeholder", "#" + player.number));
        });
        photoWrapper.appendChild(photo);

        const info = make("div", "player-card__info");
        info.append(
            make("h4", "player-card__name", player.fullName),
            make("span", "player-card__number", "#" + player.number),
            make("p", "player-card__position", player.position)
        );

        const details = make("div", "player-card__details");
        const born = player.born.toLocaleDateString("en-GB", {
            day: "numeric",
            month: "long",
            year: "numeric"
        });

        details.append(
            createDetail("Role: ", player.role),
            createDetail("Nationality: ", player.nationality),
            createDetail("Born: ", born + " (age " + player.age + ")")
        );

        details.appendChild(createDetail("Former Teams:", ""));

        const teamsList = make("ul", "player-card__teams");

        player.formerTeams.forEach(team => {
            const item = make("li", "player-card__team");
            const name = make("span", "player-card__team-name", team.title);
            const tooltip = make("span", "tooltip");

            tooltip.append(
                make("strong", "", team.title),
                document.createElement("br"),
                "City: " + team.city,
                document.createElement("br"),
                "Country: " + team.country
            );

            name.appendChild(tooltip);

            ["mouseenter", "focus"].forEach(type => {
                name.addEventListener(type, () => tooltip.classList.add("tooltip--visible"));
            });

            ["mouseleave", "blur"].forEach(type => {
                name.addEventListener(type, () => tooltip.classList.remove("tooltip--visible"));
            });

            item.appendChild(name);
            teamsList.appendChild(item);
        });

        details.appendChild(teamsList);
        card.append(photoWrapper, info, details);

        return card;
    };

    const createPlayerTable = players => {
        const table = make("table", "table");
        const headers = ["#", "Name", "Position", "Role", "Nationality", "Age"];

        const caption = make("caption", "table__caption", "Springboks Squad");
        const thead = make("thead", "table__head");
        const headRow = document.createElement("tr");

        headers.forEach(header => {
            const th = make("th", "table__header", header);
            headRow.appendChild(th);
        });

        thead.appendChild(headRow);

        const tbody = make("tbody", "table__body");

        players.forEach((player, index) => {
            const row = make("tr", index % 2 ? "table__row table__row--alt" : "table__row");
            [player.number, player.fullName, player.position, player.role, player.nationality, player.age].forEach(value => {
                row.appendChild(make("td", "table__cell", String(value)));
            });
            tbody.appendChild(row);
        });

        const tfoot = make("tfoot", "table__foot");
        const footRow = document.createElement("tr");
        const footCell = make("td", "table__cell", "Data loaded from JSON file");
        footCell.colSpan = headers.length;
        footRow.appendChild(footCell);
        tfoot.appendChild(footRow);

        table.append(caption, thead, tbody, tfoot);
        return table;
    };

    const buildPageContent = data => {
        fileLabel.style.display = "none";
        fileInput.style.display = "none";

        const oldButton = fileInput.parentNode.querySelector(".reload-button");
        if (oldButton) oldButton.remove();

        const reloadButton = make("button", "reload-button", "Load Different File");
        reloadButton.addEventListener("click", () => {
            fileLabel.style.display = "";
            fileInput.style.display = "";
            fileInput.value = "";
            reloadButton.remove();
            clear(mainContent);
        });

        fileInput.parentNode.insertBefore(reloadButton, fileInput.nextSibling);

        const players = data.players.map(player => new Player(
            player.firstName,
            player.lastName,
            player.born,
            player.nationality,
            player.position,
            player.role,
            player.number,
            player.photo,
            Array.isArray(player.formerTeams)
                ? player.formerTeams.map(team => new Team(team.title, team.country, team.city))
                : []
        )).sort((a, b) => a.number - b.number);

        clear(mainContent);

        const article = make("article", "article");

        const intro = make("section", "section players-intro");
        intro.append(
            make("h3", "section__title", "Squad Overview"),
            make("p", "text", "The following " + players.length + " players have been loaded from the selected data file. Hover over a player's former teams to see detailed information about each club.")
        );

        const cardsSection = make("section", "section players-cards-section");
        cardsSection.appendChild(make("h3", "section__title", "Player Cards"));

        const cards = make("div", "player-cards");
        cards.append(...players.map(createPlayerCard));
        cardsSection.appendChild(cards);

        const tableSection = make("section", "section players-table-section");
        tableSection.append(
            make("h3", "section__title", "Squad List"),
            createPlayerTable(players)
        );

        article.append(intro, cardsSection, tableSection);
        mainContent.appendChild(article);

        if (typeof refreshElementMenu === "function") refreshElementMenu();
    };

    fileInput.addEventListener("change", event => {
        const file = event.target.files[0];
        if (!file) return;

        const reader = new FileReader();

        reader.addEventListener("load", e => {
            buildPageContent(JSON.parse(e.target.result));
        });
        reader.readAsText(file);
    });
});