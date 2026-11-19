import { NgIf, NgStyle } from '@angular/common';
import { Component, Input } from '@angular/core';
import { SplashAnimationType } from 'src/app/core/enums/splash-animation-type';

@Component({
    selector: 'app-splash-screen',
    templateUrl: './splash-screen.component.html',
    styleUrls: ['./splash-screen.component.css'],
    imports: [NgIf, NgStyle]
})
export class SplashScreenComponent {
    windowWidth!: string;
    splashTransition!: string;
    opacityChange: number = 1;
    showSplash = true;
  
    @Input() animationDuration: number = 0.8;
    @Input() duration: number = 1;
    @Input() animationType: SplashAnimationType = SplashAnimationType.SlideLeft;
  
    constructor() { }
  
    ngOnInit(): void {
      setTimeout(() => {
        let transitionStyle = "";
        switch (this.animationType) {
          case SplashAnimationType.SlideLeft:
            this.windowWidth = "-" + window.innerWidth + "px";
            transitionStyle = "left " + this.animationDuration + "s";
            break;
          case SplashAnimationType.SlideRight:
            this.windowWidth = window.innerWidth + "px";
            transitionStyle = "left " + this.animationDuration + "s";
            break;
          case SplashAnimationType.FadeOut:
            transitionStyle = "opacity " + this.animationDuration + "s";
            this.opacityChange = 0;
        }
  
        this.splashTransition = transitionStyle;
  
        setTimeout(() => {
          this.showSplash = !this.showSplash;
        }, this.animationDuration * 1000);
      }, this.duration * 1000);
    }
  
}
