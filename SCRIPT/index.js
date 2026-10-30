const images = [
    "https://images.pexels.com/photos/572056/pexels-photo-572056.jpeg",
    "https://i.pinimg.com/736x/65/7d/94/657d941aca5faf7ca0a905e66b1bbdcd.jpg",
    "https://i.pinimg.com/736x/00/bd/11/00bd118fbf827f3e7f33efd9e205eeda.jpg",
    "https://i.pinimg.com/736x/93/bf/31/93bf31f952569c2c5be27431360f0115.jpg",
    "https://i.pinimg.com/736x/f8/ff/2b/f8ff2b262e4bb46bdfbad821613841cd.jpg",
    "https://i.pinimg.com/736x/5b/a2/97/5ba2978e296477744242b28c710acefb.jpg",
    "https://i.pinimg.com/736x/bd/c6/24/bdc6247d1c8ebafd95db73f665adabd4.jpg",
    "https://i.pinimg.com/736x/55/0b/40/550b40dfbf228fefbe162d5192893730.jpg"
];

let currentIndex = 0;
const bgImageDiv = document.querySelector(".bg-image");

function changeBackground() {
    bgImageDiv.style.opacity = 0;
    setTimeout(() => {
        bgImageDiv.style.backgroundImage = `url('${images[currentIndex]}')`;
        bgImageDiv.style.opacity = 1;
        currentIndex = (currentIndex + 1) % images.length;
    }, 1000);
}

bgImageDiv.style.backgroundImage = `url('${images[0]}')`;
setInterval(changeBackground, 5000);


// JavaScript for slideshow functionality
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
