import { AfterViewInit, Directive, ElementRef, Input } from '@angular/core';

@Directive({
  selector: '[appStepperPosition]'
})
export class StepperPositionDirective implements AfterViewInit {
  @Input('appStepperPosition') position: 'top' | 'bottom';
  element: any;

  constructor(private elementRef: ElementRef) {
    this.element = elementRef.nativeElement;
  }

  ngAfterViewInit(): void {
    if (this.position === 'bottom') {
      const header = this.element.children[0];
      const content = this.element.children[1];
      this.element.insertBefore(content, header);
    }
  }
}