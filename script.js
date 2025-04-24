const bg = document.getElementById('bg-img');
let containerWidth = bg.clientWidth;
let topModalZIndex = 100;
function updateContainerWidth() {
  containerWidth = bg.clientWidth;
}
if (bg.complete) updateContainerWidth();
bg.addEventListener('load', updateContainerWidth);
window.addEventListener('resize', updateContainerWidth);


//universal for all types of icons, even if they don't move

function setupInteractiveIcon({ iconId, modalId }) {
  const icon = document.getElementById(iconId);
  const caption = icon.querySelector('.caption');
  const modal = document.getElementById(modalId);
  const closeIcon = modal.querySelector('.close-icon');

  icon.addEventListener('click', (e) => {
    e.stopPropagation();
    caption.classList.toggle('highlighted');
  });

  document.addEventListener('click', (e) => {
    if (!icon.contains(e.target)) {
      caption.classList.remove('highlighted');
    }
  });

  icon.addEventListener('dblclick', () => {
    caption.classList.remove('highlighted');
  
    modal.classList.remove('hidden');
    modal.style.opacity = '0';
    modal.style.pointerEvents = 'none';
    modal.style.transform = 'scale(1)';
  
    const rect = icon.getBoundingClientRect();
    const scrollX = window.scrollX;
    const scrollY = window.scrollY;
  
    const modalWidth = modal.offsetWidth;
    const modalHeight = modal.offsetHeight;
  
    let leftPosition = rect.left + scrollX;
    let topPosition = rect.top + scrollY;
  
    const rightEdge = scrollX + document.documentElement.clientWidth;
    const bottomEdge = scrollY + document.documentElement.clientHeight;
  
    if (leftPosition + modalWidth > rightEdge) {
      leftPosition = Math.max(scrollX, rightEdge - modalWidth);
    }
  
    if (topPosition + modalHeight > bottomEdge) {
      topPosition = Math.max(scrollY, bottomEdge - modalHeight);
    }
  
    modal.style.left = `${leftPosition}px`;
    modal.style.top = `${topPosition}px`;
    modal.style.zIndex = ++topModalZIndex; 

    modal.style.transformOrigin = 'top left';
    modal.style.transform = 'scale(0.1)';
    modal.style.opacity = '0';
  
    setTimeout(() => {
      modal.style.pointerEvents = 'auto';
      modal.style.transform = 'scale(1)';
      modal.style.opacity = '1';
    }, 10);
  });
  
  closeIcon.addEventListener('click', () => {
    modal.style.transform = 'scale(0.1)';
    modal.style.opacity = '0';
    modal.style.pointerEvents = 'none';
    setTimeout(() => {
      modal.classList.add('hidden');
    }, 300);
  });
}

//for all the icons that move 

function setupMovingFish({ iconId, modalId }) {
  setupInteractiveIcon({ iconId, modalId }); 
  const fish = document.getElementById(iconId);
  const fishImg = fish.querySelector('.fish-img-wrapper');
  const caption = fish.querySelector('.caption');

  let x = Math.random() * 300 + 100;
  let baseY = Math.random() * 450 ;
  let speed = (Math.random() * 1) + 1;
  let direction = Math.random() < 0.5 ? -1 : 1;
  let fishWidth = 80;
  let frameCount = 0;
  let bobHeight = Math.random() * 10 + 5;

  let isStartled = false;
  let startledDistance = 0;
  let startledMaxDistance = 100;
  let startledSpeed = 5;
  let startledDirection = 0;

  fishImg.style.transform = `scaleX(${direction})`;

  function moveFish() {
    frameCount++;

    if (isStartled) {
      const newX = x + startledSpeed * startledDirection;
      if (newX < 0 || newX + fishWidth > containerWidth) {
        isStartled = false;
        direction *= -1;
        fishImg.style.transform = `scaleX(${direction})`;
      } else {
        x = newX;
        startledDistance += startledSpeed;
        if (startledDistance >= startledMaxDistance) {
          isStartled = false;
        }
      }
    } else {
      x += speed * direction;
      if (x < 0 || x + fishWidth > containerWidth) {
        direction *= -1;
        fishImg.style.transform = `scaleX(${direction})`;
        x += speed * direction;
      }
    }

    let y = baseY + Math.sin((frameCount * 2) * Math.PI / 180) * bobHeight;
    fish.style.left = x + 'px';
    fish.style.top = y + 'px';

    requestAnimationFrame(moveFish);
  }

  moveFish();

  document.addEventListener('click', function (e) {
    if (e.target === fish || fish.contains(e.target)) return;

    const rect = fish.getBoundingClientRect();
    const fishLeft = rect.left + window.pageXOffset;
    const fishTop = rect.top + window.pageYOffset;
    const centerX = fishLeft + rect.width / 2;
    const centerY = fishTop + rect.height / 2;
    const clickX = e.pageX;
    const clickY = e.pageY;

    const distance = Math.sqrt((clickX - centerX) ** 2 + (clickY - centerY) ** 2);

    if (distance > 200) return;

    const isFacingClick = (direction === 1 && clickX > centerX) ||
                          (direction === -1 && clickX < centerX);

    if (isFacingClick) {
      isStartled = true;
      startledDistance = 0;
      direction *= -1;
      startledDirection = direction;
      fishImg.style.transform = `scaleX(${direction})`;
    }
  });
}



setupInteractiveIcon({ iconId: 'crab1', modalId: 'modal-crab1' });
setupInteractiveIcon({ iconId: 'fish6', modalId: 'modal-dead' });
setupInteractiveIcon({ iconId: 'snail', modalId: 'modal-cladogram' });
setupInteractiveIcon({ iconId: 'sfish', modalId: 'modal-fisheggs' });


setupMovingFish({ iconId: 'fish1', modalId: 'modal-fish1' });
setupMovingFish({ iconId: 'purple-fish', modalId: 'modal-anatomy' });
setupMovingFish({ iconId: 'fish7', modalId: 'modal-scales' });
setupMovingFish({ iconId: 'fish5', modalId: 'modal-diet' });


// setupMovingFish({ iconId: 'fish2', modalId: 'modal-fish2' });