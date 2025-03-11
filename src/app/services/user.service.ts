import { Injectable } from "@angular/core";

export interface User {
    id: number;
    email: string;
    password: string;
    date: Date;
    address?: string;
    phone_number?: string;
}



@Injectable()
export class UserService {

    currentUser: User = UserService.dummyUserList[0];

    static dummyUserList: Array<User> = [
        {
            id: 0,
            email: "Guest",
            password: "",
            date: new Date()
        },
        {
            id: 1,
            email: "nikola@gmail.com",
            password: "123abcdef",
            date: new Date("01-02-2003"),
            address: "Pristinska",
            phone_number: "0649236646"
        },

        {
            id: 2,
            email: "petar@gmail.com",
            password: "123abcdef",
            date: new Date()
        },

        {
            id: 3,
            email: "aleksa@gmail.com",
            password: "123abc",
            date: new Date()
        }
    ]

    getUserName(user: User): string {
        return user.email;
    }

    getUserById (id: number): User {
        var foundUser!: User;

        UserService.dummyUserList.forEach(user => {
            if (user.id == id) {
                foundUser = user;
            }
        })
        this.currentUser = foundUser;
        return foundUser;
    }

    getUser(userEmail: string): User {
        this.currentUser =  UserService.dummyUserList.find(userToFind => userToFind.email == userEmail)!;
        return this.currentUser;
    }

    getCurrentUserId() {
        return this.currentUser["id"];
    }

    isPasswordCorrect (email: string, password: string): boolean {
        return UserService.dummyUserList.find(userToFind => 
            (userToFind.email == email && userToFind.password == password)
        ) != undefined;
    }
    
    registerUser (email: string, password: string, date: Date, address: string = "", phone_number: string = ""): User {
        var maxId: number = 0;

        UserService.dummyUserList.forEach(user => {
            if (maxId < user.id) {
                maxId = user.id
            }
        });

        var id = ++maxId;

        var user: User = {id, email, password, date, address, phone_number};

        UserService.dummyUserList.push(user);

        console.log(user);
        this.currentUser = user;
        return user;

    }

    logout () {
        this.currentUser = this.getUserById(0);
    }





}

