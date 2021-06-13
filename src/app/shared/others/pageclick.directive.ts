import { Directive, ElementRef, HostListener } from "@angular/core";
import { NgForm } from "@angular/forms";

@Directive({
    selector: "[appPageClick]"
})

export class PageClickDirective {

    constructor(private ngForm: NgForm, private elementRef: ElementRef) {
    }

    @HostListener('document:click', ['$event'])
    documentClick(event: Event) {
        if (!this.elementRef.nativeElement.contains(event.target)) {
            this.ngForm.reset();
        }
    }
}