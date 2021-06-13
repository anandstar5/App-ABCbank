import { Directive } from "@angular/core";
import { Validator, FormControl, NG_VALIDATORS, FormGroup } from "@angular/forms";

@Directive({
    selector: '[appSelectValidator]',
    providers: [{ provide: NG_VALIDATORS, useExisting: SelectValidatorDirective, multi: true }]
})
export class SelectValidatorDirective implements Validator {

    validate(control: FormControl): { [key: string]: boolean } {
        if (control.value === "-1") {
            return { "isSelected": false }
        }
        return null;
    }

}

@Directive({
    selector: "[appAmountValidator]",
    providers: [{ provide: NG_VALIDATORS, useExisting: AmountValidatorDirective, multi: true }]
})
export class AmountValidatorDirective implements Validator {

    validate(group: FormGroup): { [key: string]: boolean } {
        const transferAmount = group?.get("transferAmount")?.value;
        const fromAccount = group?.get("fromaccount")?.value;
        if (fromAccount && fromAccount != "-1" && transferAmount) {
            const accountDetails = JSON.parse(fromAccount);
            if (accountDetails) {
                const remainingAmount = +accountDetails.accountbalance - +transferAmount;
                switch (accountDetails.accounttype) {
                    case "1":
                        {
                            return remainingAmount < 1000 ? { "insufficient": false } : null;
                        }

                    case "2":
                        {
                            return remainingAmount < 1500 ? { "insufficient": false } : null;
                        }

                    default:
                        {
                            return remainingAmount < 500 ? { "insufficient": false } : null;
                        }
                }
            }
        }
        return null;

    }
}