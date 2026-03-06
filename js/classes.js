class Team {
    constructor(title, country, city) {
        this.title = title;
        this.country = country;
        this.city = city;
    }
}

class Person {
    constructor(firstName, lastName, born, nationality) {
        this.firstName = firstName;
        this.lastName = lastName;
        this.born = new Date(born);
        this.nationality = nationality;
    }

    get fullName() {
        return `${this.firstName} ${this.lastName}`;
    }

    get age() {
        const today = new Date();
        let age = today.getFullYear() - this.born.getFullYear();
        const monthDiff = today.getMonth() - this.born.getMonth();
        if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < this.born.getDate())) age--;
        return age;
    }
}

class Player extends Person {
    constructor(firstName, lastName, born, nationality, position, role, number, photo, formerTeams) {
        super(firstName, lastName, born, nationality);
        this.position = position;
        this.role = role;
        this.number = number;
        this.photo = photo;
        this.formerTeams = formerTeams;
    }
}
