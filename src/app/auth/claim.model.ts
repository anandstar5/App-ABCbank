export class Claim {
    constructor(public email: string,
        public id: string,
        public _token: string,
        public _tokenExpirationDate: Date) {

    }

    get token() {       
        if (!this._tokenExpirationDate && new Date() > this._tokenExpirationDate) {         
            return null;
        }       
        return this._token;
    }

    get isAdminUser() {
        if (this.id === "oBMZzgaxK5N9ACbqZfp2pHSPbvj2") {
            return true;
        }
        return false;
    }

}