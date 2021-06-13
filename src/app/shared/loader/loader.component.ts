import { Component } from '@angular/core';

@Component({
    selector: 'app-loader',
    template: `
    <div class="container col-xs-12 col-md-2">
    <div class="row justify-content-center">
    <div class="lds-dual-ring"></div>
    </div>
    </div>   
    `,
    styleUrls: ['./loader.component.css']
})

export class LoaderComponent {

}