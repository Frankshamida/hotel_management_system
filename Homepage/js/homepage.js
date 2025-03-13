window.addEventListener('scroll', function () {
    const navbar = document.getElementById('navbar');
    if (window.scrollY > 50) {
        navbar.classList.add('shrink'); // Add the shrink class
        navbar.style.backgroundColor = 'rgba(207, 181, 123, 0.51)'; // Optional: Change background color
    } else {
        navbar.classList.remove('shrink'); // Remove the shrink class
        navbar.style.backgroundColor = 'rgba(255, 255, 255, 0)'; // Optional: Reset background color
    }
});
document.addEventListener('DOMContentLoaded', function () {
    const checkinInput = document.getElementById('checkin');
    const checkoutInput = document.getElementById('checkout');
    const totalNightsDisplay = document.getElementById('total-nights');
    const totalPriceDisplay = document.getElementById('total-price');
    const pricePerNight = 2300;

    function calculateNights(checkin, checkout) {
        const timeDifference = checkout - checkin;
        const nights = Math.ceil(timeDifference / (1000 * 60 * 60 * 24));
        return nights;
    }

    function updatePriceSummary() {
        const checkinDate = new Date(checkinInput.value);
        const checkoutDate = new Date(checkoutInput.value);

        if (checkinDate && checkoutDate && checkoutDate > checkinDate) {
            const nights = calculateNights(checkinDate, checkoutDate);

            if (nights < 1 || nights > 3) {
                alert('Stay duration must be between 1 and 3 nights.');
                checkoutInput.value = '';
                totalNightsDisplay.textContent = '0';
                totalPriceDisplay.textContent = '₱0';
                return;
            }

            const totalPrice = nights * pricePerNight;
            totalNightsDisplay.textContent = nights;
            totalPriceDisplay.textContent = `₱${totalPrice.toLocaleString()}`;
            checkoutInput.title = `Total Price: ₱${totalPrice.toLocaleString()}`;
        } else {
            totalNightsDisplay.textContent = '0';
            totalPriceDisplay.textContent = '₱0';
            checkoutInput.title = '';
        }
    }

    checkinInput.addEventListener('change', function () {
        const checkinDate = new Date(this.value);
        checkoutInput.min = this.value;
        updatePriceSummary();
    });

    checkoutInput.addEventListener('change', function () {
        const checkoutDate = new Date(this.value);
        const checkinDate = new Date(checkinInput.value);

        if (checkoutDate < checkinDate) {
            alert('Check-out date cannot be earlier than check-in date.');
            this.value = checkinInput.value;
        }

        updatePriceSummary();
    });

    // Logo animations
    const mainLogo = document.getElementById('main-logo');
    const footerLogo = document.getElementById('footer-logo');

    mainLogo.addEventListener('mouseover', () => {
        mainLogo.style.transform = 'scale(1.1)';
    });

    mainLogo.addEventListener('mouseout', () => {
        mainLogo.style.transform = 'scale(1)';
    });

    footerLogo.addEventListener('mouseover', () => {
        footerLogo.style.transform = 'rotate(360deg)';
    });

    footerLogo.addEventListener('mouseout', () => {
        footerLogo.style.transform = 'rotate(0deg)';
    });
});

document.addEventListener("DOMContentLoaded", function () {
    const taglineText = "Experience Luxury Like Never Before";
    const taglineElement = document.querySelector(".tagline");
    taglineElement.innerHTML = ""; // Clear initial text

    // Show tagline container smoothly
    setTimeout(() => {
        taglineElement.style.opacity = "1";
        taglineElement.style.transform = "translateY(0)";
    }, 500);

    // Typewriting animation (letter by letter)
    taglineText.split("").forEach((char, index) => {
        const span = document.createElement("span");
        span.textContent = char;
        span.classList.add("letter");
        taglineElement.appendChild(span);

        setTimeout(() => {
            span.style.opacity = "1";
            span.style.transform = "translateY(0)";
        }, 100 * index); // Delay each letter for a smooth effect
    });
});


function scrollToRooms() {
    document.getElementById("rooms-section").scrollIntoView({ behavior: 'smooth' });
}

function bookNow() {
    window.location.href = "/Login_Signup_Registration/Guest_Login.html";
}

function searchNow() {
    window.location.href = "/Login_Signup_Registration/Guest_Login.html";
}


let reviews = document.querySelectorAll(".testimonial-card");
let dots = document.querySelectorAll(".testimonial-dot");

function showReview(index) {
  reviews.forEach((review, i) => {
    review.style.display = i === index - 1 ? "block" : "none";
    dots[i].classList.toggle("active", i === index - 1);
  });
}

// Initialize first review as visible
showReview(1);

// Translation function
function translateReview() {
  let tagalogText = document.getElementById("tagalog-text");
  if (tagalogText.innerText.includes("Napakaganda")) {
    tagalogText.innerText =
      "This hotel is amazing! The room is very spacious, and the staff is super friendly. The buffet breakfast is delicious, especially the danggit and mango juice! We'll definitely come back!";
  } else {
    tagalogText.innerText =
      "Napakaganda ng hotel na ito! Napakaaliwalas ng kwarto, at napaka-friendly ng staff. Ang buffet breakfast ay sobrang sarap, lalo na ang danggit at mango juice! Babalik kami dito ulit!";
  }
}