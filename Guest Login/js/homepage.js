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


function redirectToResults() {
    const checkin = document.getElementById('checkin').value;
    const checkout = document.getElementById('checkout').value;
    const adults = document.getElementById('adults').value;
    const children = document.getElementById('children').value;

    // Redirect to results.html with query parameters
    window.location.href = `results.html?checkin=${checkin}&checkout=${checkout}&adults=${adults}&children=${children}`;
}


const roomsData = [
    {
        type: 'Standard Room',
        price: '₱2,300',
        description: 'Comfortable room for 2 guests.',
        image: 'https://via.placeholder.com/300x200',
        specifications: ['1 Queen Bed', 'Free Wi-Fi', 'Breakfast Included']
    },
    {
        type: 'Deluxe Room',
        price: '₱3,500',
        description: 'Spacious room for 2-3 guests.',
        image: 'https://via.placeholder.com/300x200',
        specifications: ['1 King Bed', 'Free Wi-Fi', 'Mini Bar', 'Breakfast Included']
    },
    {
        type: 'Family Suite',
        price: '₱5,000',
        description: 'Perfect for families with 2-4 guests.',
        image: 'https://via.placeholder.com/300x200',
        specifications: ['2 Queen Beds', 'Free Wi-Fi', 'Mini Bar', 'Breakfast Included']
    },
    {
        type: 'Executive Suite',
        price: '₱6,500',
        description: 'Luxurious suite for 2-4 guests.',
        image: 'https://via.placeholder.com/300x200',
        specifications: ['1 King Bed', 'Separate Living Area', 'Free Wi-Fi', 'Mini Bar', 'Breakfast Included']
    },
    {
        type: 'Presidential Suite',
        price: '₱10,000',
        description: 'Ultimate luxury for 2-6 guests.',
        image: 'https://via.placeholder.com/300x200',
        specifications: ['2 King Beds', 'Private Balcony', 'Free Wi-Fi', 'Mini Bar', 'Breakfast Included']
    }
];

// Get URL parameters
const urlParams = new URLSearchParams(window.location.search);
const checkin = urlParams.get('checkin');
const checkout = urlParams.get('checkout');
const adults = parseInt(urlParams.get('adults'));
const children = parseInt(urlParams.get('children'));
const totalGuests = adults + children;

// Display summary
const summary = document.createElement('div');
summary.className = 'summary';
summary.textContent = `Check-in: ${checkin}, Check-out: ${checkout}, Adults: ${adults}, Children: ${children}`;
document.getElementById('suggestedRooms').appendChild(summary);

// Suggest rooms based on total guests
let suggestedRooms = [];
if (totalGuests === 2) {
    suggestedRooms.push(roomsData[0]); // Standard
}
if (totalGuests >= 2 && totalGuests <= 3) {
    suggestedRooms.push(roomsData[1]); // Deluxe
}
if (totalGuests >= 2 && totalGuests <= 4) {
    suggestedRooms.push(roomsData[2]); // Family Suite
    suggestedRooms.push(roomsData[3]); // Executive Suite
}
if (totalGuests >= 2 && totalGuests <= 6) {
    suggestedRooms.push(roomsData[4]); // Presidential Suite
}

// Display suggested rooms
suggestedRooms.forEach(room => {
    const roomCard = document.createElement('div');
    roomCard.className = 'room-card';
    roomCard.innerHTML = `
        <img src="${room.image}" alt="${room.type}">
        <h3>${room.type}</h3>
        <p>${room.description}</p>
        <p>Price: ${room.price}</p>
        <ul>
            ${room.specifications.map(spec => `<li>${spec}</li>`).join('')}
        </ul>
    `;
    document.getElementById('suggestedRooms').appendChild(roomCard);
});