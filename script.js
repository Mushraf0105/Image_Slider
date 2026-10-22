// 1. Select DOM elements
const slider = document.getElementById('slider');
const sliderTrack = document.getElementById('sliderTrack');
const originalSlides = Array.from(sliderTrack.querySelectorAll('.slide'));
const prevBtn = document.getElementById('prevBtn');
const nextBtn = document.getElementById('nextBtn');
const indicatorsContainer = document.getElementById('indicators');
const slideCounter = document.getElementById('slideCounter');

// 2. State variables
const totalSlides = originalSlides.length; // 5
let currentIndex = 1; // Start at index 1 (the first real slide, after lastClone)
let isTransitioning = false;
let autoSlideTimer = null;
const slideIntervalTime = 3000; // 3 seconds per slide

// 3. Set up seamless infinite loop clones
// Clone first slide and append to end; clone last slide and prepend to beginning
const firstClone = originalSlides[0].cloneNode(true);
const lastClone = originalSlides[totalSlides - 1].cloneNode(true);
firstClone.classList.add('clone');
lastClone.classList.add('clone');

sliderTrack.appendChild(firstClone);
sliderTrack.insertBefore(lastClone, originalSlides[0]);

// Set initial track position to real slide 1 without transition
sliderTrack.style.transition = 'none';
sliderTrack.style.transform = `translateX(-${currentIndex * 100}%)`;

// 4. Create indicator dots dynamically (only for original 5 slides)
function createIndicators() {
  indicatorsContainer.innerHTML = '';
  originalSlides.forEach((_, index) => {
    const dot = document.createElement('button');
    dot.classList.add('dot');
    if (index === 0) dot.classList.add('active');

    // Jump to clicked slide
    dot.addEventListener('click', () => {
      goToSlide(index);
    });

    indicatorsContainer.appendChild(dot);
  });
}

// 5. Update indicator dots and slide counter
function updateDotsAndCounter() {
  // Determine which real slide is currently active (0 to totalSlides - 1)
  let activeDotIndex;
  if (currentIndex === 0) {
    activeDotIndex = totalSlides - 1; // When on last-clone, show slide 5
  } else if (currentIndex === totalSlides + 1) {
    activeDotIndex = 0; // When on first-clone, show slide 1
  } else {
    activeDotIndex = currentIndex - 1;
  }

  // Update dots active class
  const dots = document.querySelectorAll('.dot');
  dots.forEach((dot, index) => {
    dot.classList.toggle('active', index === activeDotIndex);
  });

  // Update counter text (e.g., "1 / 5")
  slideCounter.textContent = `${activeDotIndex + 1} / ${totalSlides}`;
}

// 6. Navigate to Next slide (scrolls smoothly to the right)
function nextSlide() {
  if (isTransitioning) return;
  isTransitioning = true;

  currentIndex++;
  sliderTrack.style.transition = 'transform 0.5s ease-in-out';
  sliderTrack.style.transform = `translateX(-${currentIndex * 100}%)`;

  updateDotsAndCounter();
}

// 7. Navigate to Previous slide (scrolls smoothly to the left)
function prevSlide() {
  if (isTransitioning) return;
  isTransitioning = true;

  currentIndex--;
  sliderTrack.style.transition = 'transform 0.5s ease-in-out';
  sliderTrack.style.transform = `translateX(-${currentIndex * 100}%)`;

  updateDotsAndCounter();
}

// 8. Go directly to a specific slide from indicator dots
function goToSlide(dotIndex) {
  if (isTransitioning || currentIndex === dotIndex + 1) return;
  isTransitioning = true;

  currentIndex = dotIndex + 1;
  sliderTrack.style.transition = 'transform 0.5s ease-in-out';
  sliderTrack.style.transform = `translateX(-${currentIndex * 100}%)`;

  updateDotsAndCounter();
  resetTimer();
}

// 9. Handle transition end for seamless infinite looping
sliderTrack.addEventListener('transitionend', (e) => {
  // Only handle transform transitions from sliderTrack itself
  if (e.target !== sliderTrack || e.propertyName !== 'transform') return;

  // If moved past the last slide to the first-clone, snap instantly to real slide 1
  if (currentIndex === totalSlides + 1) {
    sliderTrack.style.transition = 'none';
    currentIndex = 1;
    sliderTrack.style.transform = `translateX(-${currentIndex * 100}%)`;
  }

  // If moved before the first slide to the last-clone, snap instantly to real slide 5
  if (currentIndex === 0) {
    sliderTrack.style.transition = 'none';
    currentIndex = totalSlides;
    sliderTrack.style.transform = `translateX(-${currentIndex * 100}%)`;
  }

  isTransitioning = false;
});

// 10. Auto-rotation Timers (setInterval & clearInterval)
function startAutoSlide() {
  stopAutoSlide(); // Ensure no duplicate intervals are running
  autoSlideTimer = setInterval(nextSlide, slideIntervalTime);
}

function stopAutoSlide() {
  if (autoSlideTimer) {
    clearInterval(autoSlideTimer);
    autoSlideTimer = null;
  }
}

// Reset timer on manual button clicks
function resetTimer() {
  stopAutoSlide();
  startAutoSlide();
}

// ==========================================
// Event Listeners
// ==========================================

// Next & Prev button clicks
nextBtn.addEventListener('click', () => {
  nextSlide();
  resetTimer();
});

prevBtn.addEventListener('click', () => {
  prevSlide();
  resetTimer();
});

// Pause auto-rotation when user hovers over the slider
slider.addEventListener('mouseenter', stopAutoSlide);

// Resume auto-rotation when mouse leaves the slider
slider.addEventListener('mouseleave', startAutoSlide);

// Keyboard navigation (Left and Right Arrow keys)
document.addEventListener('keydown', (e) => {
  if (e.key === 'ArrowRight') {
    nextSlide();
    resetTimer();
  } else if (e.key === 'ArrowLeft') {
    prevSlide();
    resetTimer();
  }
});

// ==========================================
// Initialize Slider
// ==========================================
createIndicators();
updateDotsAndCounter();
startAutoSlide();
