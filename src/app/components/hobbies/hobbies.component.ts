import { Component, QueryList, ViewChildren, AfterViewInit, ElementRef, HostListener } from '@angular/core';
import anime from 'animejs';

@Component({
  selector: 'app-hobbies',
  templateUrl: './hobbies.component.html',
  styleUrls: ['./hobbies.component.scss']
})
export class HobbiesComponent implements AfterViewInit {
  @ViewChildren('hobbyCardRef', { read: ElementRef }) hobbyCards!: QueryList<ElementRef>;

  hobbies = [
    { text: `In December of 2021, I bought my first 3D printer, the Ender 3 v2, 
              and I greatly underestimated the time and fiddling it would take to 
              get the first print done. Once I got it dialed in, it was amazing to 
              see it go to work and make things that I modeled on my computer, 
              such as a Wi-Fi controller LED Picture box or an Iron Man Helmet.
              For an early Christmas present in 2023, I upgraded to the Bambu Lab
              X1 Carbon with the AMS unit. The printer itself prints over five times
              as fast, while also producing better quality prints. The AMS unit can
              hold 4 filaments and enables multi-color prints!`, image: '/bambuLabX1C.png' },
    { text: `I've been playing guitar since I was 10 years old, with my first guitar
            being the guitar in the image. I started playing rock music like Van Halen,
            AC/DC, Led Zeppelin, and more. For a few years I was attending weekly lessons
            and continued to learn more and get better, with a few recitals that I played
            a solo piece in. After a while, I was getting interested in acoustic/classical
            music so I picked up an acoustic guitar and learned fingerstyle picking.
            Then I found a YouTube channel called Davie504 where he played slap bass and 
            I was pretty interested in learning that so I picked up a bass guitar as well.`, image: '/guitar.jpg' },
    { text: `Ever since I was a little kid, I was always fascinated by cars and I loved taking 
            pictures of cars that I thought were cool or unique. So I picked up a Sony A6400 for 
            a Black Friday deal and started my photography journey. With the new camera, I was attending 
            car meets and taking pictures of the cars there, as well as taking pictures of my friend's cars, 
            before I bought my current car, a C7.5 Audi A6 Competition Prestige, which I later made an 
            Instagram for to document it. In early 2024, I sold my A6400 and upgraded to the Sony A6700, 
            which I couldn't be more happy with. More megapixels, better auto focus, and more features.`, image: '/sonyA6700.jpg' }
  ];

  isSubtitleVisible = false;

  ngAfterViewInit() {
    const isMobile = window.innerWidth <= 768;

    if (this.hobbyCards) {
      this.observeElements(this.hobbyCards, isMobile, true);
    } else {
      console.error('Hobby card components not found or undefined.');
    }
  }

  observeElements(elements: QueryList<ElementRef>, isMobile: boolean, isFirstElement: boolean): void {
    elements.forEach((elementRef, index) => {
      const element = elementRef.nativeElement;
      const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          const progress = entry.intersectionRatio;

          if (isMobile) {
            this.animatePElementMobileProgress(element, progress);
          } else {
            this.animatePElementDesktopProgress(element, progress);
          }
        });
      }, { threshold: Array.from({ length: 201 }, (_, i) => i / 200) });

      observer.observe(element);
    });
  }

  @HostListener('window:scroll', ['$event'])
  onWindowScroll() {
    const isMobile = window.innerWidth <= 768;

    if (isMobile && this.hobbyCards) {
      this.hobbyCards.forEach((elementRef) => {
        const element = elementRef.nativeElement;
        const rect = element.getBoundingClientRect();
        const windowHeight = window.innerHeight;
        const progress = Math.min(1, Math.max(0, (windowHeight - rect.top) / windowHeight));

        this.animatePElementMobileProgress(element, progress);
      });
    }
  }

  animatePElementMobileProgress(element: HTMLElement, progress: number): void {
    const maxDuration = 500;
    anime({
      targets: element,
      opacity: [0, 1],
      translateX: [200, 0],
      easing: "easeOutQuad",
      duration: maxDuration,
      autoplay: false
    }).seek(progress * maxDuration);
  }

  animatePElementDesktopProgress(element: HTMLElement, progress: number): void {
    const maxDuration = 500;
    anime({
      targets: element,
      opacity: [0, 1],
      translateX: [500, 0],
      easing: "easeOutQuad",
      duration: maxDuration,
      autoplay: false
    }).seek(progress * maxDuration);
  }
}
