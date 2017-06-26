import { Directive, Input, ElementRef } from '@angular/core';

@Directive({
  selector: '[giveFocus]'
})
export class GiveFocusDirective {

  @Input('giveFocus') giveFocusModel: boolean;

  constructor(private element: ElementRef) {}

  ngAfterViewInit(): void {

    let target = this.element.nativeElement;

    // a short delay is required for input
    // to recieve text
    setTimeout( () => {
      if(target.selectionStart == target.selectionEnd) {
        target.focus();
        target.setSelectionRange(0, 100);
      }
    }, 100);

  }

}
