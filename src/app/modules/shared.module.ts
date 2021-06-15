import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { LoaderComponent } from '../shared/loader/loader.component';
import { FilterPipe } from '../shared/others/filter.pipe';
import { PageClickDirective } from '../shared/others/pageclick.directive';
import { PlaceHolderDirective } from '../shared/others/placeholder.directive';
import { AmountValidatorDirective, SelectValidatorDirective } from '../shared/others/validators.directive';
import { AlertComponent } from '../shared/popup/alert/alert.component';

@NgModule({
    declarations: [       
        LoaderComponent,
        AlertComponent,
        PlaceHolderDirective,
        PageClickDirective,
        SelectValidatorDirective,
        AmountValidatorDirective,
        FilterPipe
    ],
    imports:[CommonModule],
    exports:[       
        LoaderComponent,
        AlertComponent,
        PlaceHolderDirective,
        PageClickDirective,
        SelectValidatorDirective,
        AmountValidatorDirective,
        FilterPipe
    ]
})

export class SharedModule {

}