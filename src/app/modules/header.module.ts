import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { FormsModule } from "@angular/forms";
import { RouterModule } from "@angular/router";
import { HeaderComponent } from "../shared/header/header.component";
import { SharedModule } from "./shared.module";
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

@NgModule({
    declarations: [HeaderComponent],
    imports: [CommonModule, FormsModule, RouterModule, SharedModule, BrowserAnimationsModule],
    exports: [HeaderComponent]
})

export class HeaderModule {

}