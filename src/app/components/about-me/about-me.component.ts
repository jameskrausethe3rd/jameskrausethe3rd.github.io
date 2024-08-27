import { Component, ElementRef, ViewChild } from '@angular/core';
import anime from 'animejs/lib/anime.es.js';

@Component({
  selector: 'app-about-me',
  templateUrl: './about-me.component.html',
  styleUrl: './about-me.component.scss'
})
export class AboutMeComponent {
  aboutMePoints: string[] = []
  
  constructor() { }

  @ViewChild('aboutmecardcomponent', { read: ElementRef }) aboutmecardcomponent!: ElementRef;
  @ViewChild('subtitledivcomponent', { read: ElementRef }) subtitledivcomponent!: ElementRef;

  ngOnInit() {
    this.aboutMePoints = [
      `Hi there! My name is James Krause and I'm a Software Developer currently working at AspenTech! 
      I was born in Shakopee, Minnesota and currently live in Eden Prairie with two of my cousins and
      one of my friends. I graduated from Minnesota State University, Mankato in 2022 with a B.S. in
      Computer Information Technology, but more on that later.`,
      `You can find me doing quite a few things when I'm not working or hanging out with my friends. 
      When I was 5, I started bowling in a league, and continued to bowl on a league until I went to college. 
      At around the age of 10, I began playing electric guitar, and later expanding into acoustic and bass guitar. 
      For Black Friday of 2022, I bought my first digital camera, the Sony A6400 and began my photography journey, 
      with my main subjects being cars but I am starting to branch out into portraits and landscapes.`,
      `In my senior year of high school, I built my first gaming PC with money I saved up over the year and 
      and that is where I discovered my love computers and how much I enjoy building computers. Since then, I've 
      built around 10 computers for friends and family, as well as a home server to host docker containers for 
      things such as Home Assistant, Nginx Proxy Manager, and a few other things. It also serves as a Plex Server 
      and backup for pictures and videos that I take with my phone or camera. I can't forget about my Raspberry Pi 4 
      that serves PiHole over my network for ad blocking and custom DNS.`
    ];
  }

  ngAfterViewInit(): void {
    // Function to detect if it's mobile
    const isMobile = window.innerWidth <= 768; // Adjust this value based on your definition of mobile

    if (this.aboutmecardcomponent && this.aboutmecardcomponent.nativeElement) {
      const observer = new IntersectionObserver(entries => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            this.animateElement();            
            if (isMobile) {
              this.animatePElementMobile();
            } else {
              this.animatePElementDesktop();
            }
            observer.unobserve(entry.target); // Stop observing after animation starts
          }
        });
      }, { threshold: 1 }); // Trigger when 100% of the element is visible
      
      observer.observe(this.aboutmecardcomponent.nativeElement);
    } else {
      console.error('About Me component element not found or is undefined.');
    }
  }

  animateElement(): void {
    anime({
      targets: this.aboutmecardcomponent.nativeElement,
      opacity: [0, 1],         // Fade in
      translateX: [-100, 0],     // Slide up from 50px below
      easing: 'easeOutQuad', // Overshoot effect
      duration: 500,           // Duration of the animation
    });
  }

  animatePElementMobile(): void {
    anime({
      targets: this.subtitledivcomponent.nativeElement.querySelectorAll('p'),
      opacity: [0, 1],         // Fade in
      translateX: [-100, 0],     // Different translateY for mobile
      duration: 500,           // Faster duration for mobile
      easing: "easeOutQuad",
      delay: anime.stagger(300, { start: 500 })  // Different delay for mobile
    });
  }

  animatePElementDesktop(): void {
    anime({
      targets: this.subtitledivcomponent.nativeElement.querySelectorAll('p'),
      opacity: [0, 1],         // Fade in
      translateY: [50, 0],     // Larger translateY for desktop
      duration: 500,           // Longer duration for desktop
      easing: "easeOutQuad",
      delay: anime.stagger(500, { start: 500 })  // Different delay for desktop
    });
  }
}
