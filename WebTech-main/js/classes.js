"use strict";
class Team {
    #title;
    #country;
    #city;

    constructor(title, country, city) {
        this.title = title;
        this.country = country;
        this.city = city;
    }
    get title() {
        return this.#title;
    }

    get country() {
        return this.#country;
    }

    get city() {
        return this.#city;
    }

    set title(value) {
        if (typeof value !== "string" || value.trim().length === 0) {
            throw new Error("Team title must be a non-empty string.");
        }
        this.#title = value.trim();
    }

    set country(value) {
        if (typeof value !== "string" || value.trim().length === 0) {
            throw new Error("Team country must be a non-empty string.");
        }
        this.#country = value.trim();
    }

    set city(value) {
        if (typeof value !== "string" || value.trim().length === 0) {
            throw new Error("Team city must be a non-empty string.");
        }
        this.#city = value.trim();
    }

    toString() {
        return `${this.#title} (${this.#city}, ${this.#country})`;
    }
}


class Person {
    #firstName;
    #lastName;
    #born;
    #nationality;

    constructor(firstName, lastName, born, nationality) {
        this.firstName = firstName;
        this.lastName = lastName;
        this.born = born;
        this.nationality = nationality;
    }

    get firstName() {
        return this.#firstName;
    }

    get lastName() {
        return this.#lastName;
    }

    get born() {
        return this.#born;
    }

    get nationality() {
        return this.#nationality;
    }

    set firstName(value) {
        if (typeof value !== "string" || value.trim().length === 0) {
            throw new Error("First name must be a non-empty string.");
        }
        if (!/^[A-Za-zÀ-ÖØ-öø-ÿ\s'-]+$/.test(value.trim())) {
            throw new Error("First name contains invalid characters.");
        }
        this.#firstName = value.trim();
    }

    set lastName(value) {
        if (typeof value !== "string" || value.trim().length === 0) {
            throw new Error("Last name must be a non-empty string.");
        }
        if (!/^[A-Za-zÀ-ÖØ-öø-ÿ\s'-]+$/.test(value.trim())) {
            throw new Error("Last name contains invalid characters.");
        }
        this.#lastName = value.trim();
    }

    set born(value) {
        const date = (value instanceof Date) ? value : new Date(value);
        if (isNaN(date.getTime())) {
            throw new Error("Born must be a valid date.");
        }
        if (date > new Date()) {
            throw new Error("Birth date cannot be in the future.");
        }
        this.#born = date;
    }

    set nationality(value) {
        if (typeof value !== "string" || value.trim().length === 0) {
            throw new Error("Nationality must be a non-empty string.");
        }
        this.#nationality = value.trim();
    }

    get fullName() {
        return `${this.#firstName} ${this.#lastName}`;
    }

    get age() {
        const today = new Date();
        let age = today.getFullYear() - this.#born.getFullYear();
        const monthDiff = today.getMonth() - this.#born.getMonth();
        if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < this.#born.getDate())) {
            age--;
        }
        return age;
    }
}

class Player extends Person {
    #position;
    #role;
    #number;
    #photo;
    #formerTeams;
    constructor(firstName, lastName, born, nationality, position, role, number, photo, formerTeams) {
        super(firstName, lastName, born, nationality);
        this.position = position;
        this.role = role;
        this.number = number;
        this.photo = photo;
        this.formerTeams = formerTeams;
    }


    get position() {
        return this.#position;
    }

    get role() {
        return this.#role;
    }

    get number() {
        return this.#number;
    }

    get photo() {
        return this.#photo;
    }

    get formerTeams() {
        return this.#formerTeams;
    }

    set position(value) {
        if (typeof value !== "string" || value.trim().length === 0) {
            throw new Error("Position must be a non-empty string.");
        }
        this.#position = value.trim();
    }

    set role(value) {
        if (typeof value !== "string" || value.trim().length === 0) {
            throw new Error("Role must be a non-empty string.");
        }
        this.#role = value.trim();
    }

    set number(value) {
        const num = Number(value);
        if (!Number.isInteger(num) || num < 1 || num > 99) {
            throw new Error("Number must be an integer between 1 and 99.");
        }
        this.#number = num;
    }

    set photo(value) {
        if (typeof value !== "string" || value.trim().length === 0) {
            throw new Error("Photo must be a non-empty string (URL or file path).");
        }
        this.#photo = value.trim();
    }

    set formerTeams(value) {
        if (!Array.isArray(value)) {
            throw new Error("Former teams must be an array.");
        }
        for (const team of value) {
            if (!(team instanceof Team)) {
                throw new Error("Each former team must be an instance of Team.");
            }
        }
        this.#formerTeams = value;
    }
}
