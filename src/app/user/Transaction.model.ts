export class Transaction {
    constructor(public transactionnumber: number, public accountnumber: string, public accountbalance: number, public payeeaccountnumber: string, public payeeaccountbalance: number, public transferAmount: number, public remark, public TransactionDate: Date) {

    }
}