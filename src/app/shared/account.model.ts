import { User } from "../user/user.model";

export class Account {
    constructor(
        public accountnumber: string,
        public accountbranch: string,
        public accounttype: number,
        public customerphone: number,
        public accountbalance: number,
        public user: User
    ) {

    }
}