
import { Component, QueryList, ViewChildren, AfterViewInit, ElementRef, HostListener, Renderer2, ViewChild } from '@angular/core';
import anime from 'animejs';

@Component({
  selector: 'app-experience',
  templateUrl: './experience.component.html',
  styleUrl: './experience.component.scss'
})
export class ExperienceComponent implements AfterViewInit {
  @ViewChild('strokelogoref', { read: ElementRef }) strokeLogo!: ElementRef;
  @ViewChild('filllogoref', { read: ElementRef }) filllogoref!: ElementRef;

  isSubtitleVisible = false;

  constructor(private el: ElementRef, private renderer: Renderer2) {}

  ngAfterViewInit() {
    const strokePaths = this.strokeLogo.nativeElement.querySelectorAll('path') as NodeListOf<SVGPathElement>;
    // const fillPaths = this.filllogoref.nativeElement.querySelectorAll('path');

    // Function to detect if it's mobile
    const isMobile = window.innerWidth <= 768; // Adjust this value based on your definition of mobile

    if (this.strokeLogo && this.strokeLogo.nativeElement) {
      const observer = new IntersectionObserver(entries => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {          
            this.animateLogoStrokePaths(strokePaths);
            // this.animateLogoFillPaths(fillPaths);
            this.animateSchoolTitle();
            this.animateSchoolPoints();
            observer.unobserve(entry.target); // Stop observing after animation starts
          }
        });
      }, { threshold: 1 }); // Trigger when 100% of the element is visible
      
      observer.observe(this.strokeLogo.nativeElement);
    } else {
      console.error('Logo element not found or is undefined.');
    }
  }

  animateLogoStrokePaths(strokePaths: NodeListOf<SVGPathElement>): void {
    const firstPath = strokePaths[0];
    const secondPath = strokePaths[1];
    const thirdPath = strokePaths[3];
    anime({
      targets: '.mainLogo',
      translateY: [75, 0], // Move text up from below the underline
      easing: 'easeOutExpo',
      duration: 2000
    });
    anime({
      targets: thirdPath,
      strokeDashoffset: [anime.setDashoffset, 0],
      easing: 'linear',
      duration: 10000,
      delay: 1500
    });

    anime({
      targets: strokePaths,
      opacity: 1,
      duration: 1000
    })
  }

  animateLogoFillPaths(fillPaths: HTMLElement): void {
    anime({
      targets: fillPaths,
      opacity: [0, 1], 
      easing: 'easeInOutSine',
      duration: 1000,
      delay: 2000
    });
  }

  animateSchoolTitle(): void {
    anime({
      targets: '.schoolTitle',
      translateY: [75, 0], // Move text up from below the underline
      opacity: [0, 1], // Fade in the text as it moves up
      duration: 1000,
      easing: 'easeOutExpo',
      delay: 500 // Optional: delay to start the animation
  });

    anime({
      targets: '.titleContainer',
      scaleX: [0, 1], // Fade in the text as it moves up
      duration: 750,
      easing: 'easeOutExpo',
      delay: 0 // Optional: delay to start the animation
  });
  }

  animateSchoolPoints(): void {
    anime({
      targets: '.schoolPoints',
      translateY: [75, 0], // Move text up from below the underline
      opacity: [0, 1],
      duration: 1000,
      easing: 'easeOutBounce',
      delay: anime.stagger(50, { start: 1000 })
    });

    anime({
      targets: '.certificates, .courses',
      translateX: [-100, 0], // Move text up from below the underline
      opacity: [0, 1],
      duration: 1000,
      easing: 'easeOutBounce',
      delay: anime.stagger(20, { start: 2250 })
    });
  }
}