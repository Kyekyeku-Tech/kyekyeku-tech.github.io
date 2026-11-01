// JavaScript for slideshow functionality
const heroImage = document.querySelector(".hero-section .bg-image");
const heroImages = [
  "assets/images/logo1.gif",
  "assets/images/logo2.gif",
  "assets/images/logo3.gif",
  "assets/images/logo4.gif",
  "assets/images/logo5.gif"
];
let heroImageIndex = 0;

function cycleHeroImage() {
  const nextIndex = (heroImageIndex + 1) % heroImages.length;
  const nextImage = new Image();

  nextImage.onload = function() {
    heroImage.style.opacity = "0";
    setTimeout(function() {
      heroImage.style.backgroundImage = `url("${heroImages[nextIndex]}")`;
      heroImage.style.opacity = "1";
      heroImageIndex = nextIndex;
      setTimeout(cycleHeroImage, 5000);
    }, 1000);
  };
  nextImage.onerror = function() {
    console.error(`Unable to load hero image: ${heroImages[nextIndex]}`);
    setTimeout(cycleHeroImage, 5000);
  };
  nextImage.src = heroImages[nextIndex];
}

if (heroImage) {
  setTimeout(cycleHeroImage, 5000);
}

let slideIndex = 0;
showSlides();

function showSlides() {
  let slides = document.getElementsByClassName("mySlides");
  for (let i = 0; i < slides.length; i++) {
    slides[i].style.display = "none";  
  }
  slideIndex++;
  if (slideIndex > slides.length) {slideIndex = 1}    
  slides[slideIndex - 1].style.display = "block";  
  setTimeout(showSlides, 5000); // Change image every 5 seconds
}

// JavaScript
document.addEventListener("DOMContentLoaded", function() {
    window.addEventListener("scroll", function() {
        var textContent = document.getElementById("text-content");
        var positionFromTop = textContent.getBoundingClientRect().top;

        var screenHeight = window.innerHeight;

        if (positionFromTop - screenHeight <= 0) {
            textContent.classList.add("flip-in-x");
        } else {
            textContent.classList.remove("flip-in-x"); // Remove the class if the element is not in view
        }
    });
});

var Tawk_API=Tawk_API||{}, Tawk_LoadStart=new Date();
(function(){
var s1=document.createElement("script"),s0=document.getElementsByTagName("script")[0];
s1.async=true;
s1.src='https://embed.tawk.to/6558e086d600b968d314926f/1hurice0o';
s1.charset='UTF-8';
s1.setAttribute('crossorigin','*');
s0.parentNode.insertBefore(s1,s0);
})();
