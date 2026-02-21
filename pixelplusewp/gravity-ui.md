---
description: Apply the premium Gravity Card Top-Bar/Footer UI patterns
---

When the USER asks to apply the "Gravity UI" or /gravity-ui, follow these steps:

### 1. Style Definitions (CSS)
Add these styles to the `<style>` block for the premium glassmorphism look:
```css
/* Top Action Buttons & Promo Bubble */
.action-btn {
    width: 42px; height: 42px; border-radius: 50%;
    background: rgba(255, 255, 255, 0.03); border: 1px solid rgba(255, 255, 255, 0.1);
    backdrop-filter: blur(10px); -webkit-backdrop-filter: blur(10px);
    display: flex; justify-content: center; align-items: center;
    transition: all 0.4s cubic-bezier(0.16, 1, 0.3, 1); cursor: pointer; z-index: 30;
}
.action-btn:hover { background: rgba(255, 255, 255, 1); border-color: rgba(255, 255, 255, 1); transform: scale(1.05) translateY(-2px); }
.action-btn img { width: 22px; height: 22px; object-fit: contain; transition: filter 0.3s ease; }
.action-btn:hover img { filter: brightness(0); }

.promo-bubble {
    position: absolute; left: 52px; top: 50%; transform: translateY(-50%) translateX(-10px);
    background: rgba(255, 255, 255, 0.05); border: 1px solid rgba(255, 255, 255, 0.15);
    backdrop-filter: blur(15px); -webkit-backdrop-filter: blur(15px);
    padding: 6px 14px; border-radius: 30px; white-space: nowrap;
    font-size: 10px; color: rgba(255, 255, 255, 0.8); pointer-events: none; opacity: 0;
    display: flex; align-items: center; gap: 8px; z-index: 25;
}
.promo-bubble strong { color: #fff; text-decoration: underline; text-underline-offset: 3px; }

.pulsing-dot {
    width: 4px; height: 4px; background-color: #10B981; border-radius: 50%;
    box-shadow: 0 0 0 0 rgba(16, 185, 129, 0.7); animation: pulse-green 2s infinite;
}
@keyframes pulse-green {
    0% { transform: scale(0.95); box-shadow: 0 0 0 0 rgba(16, 185, 129, 0.7); }
    70% { transform: scale(1); box-shadow: 0 0 0 4px rgba(16, 185, 129, 0); }
    100% { transform: scale(0.95); box-shadow: 0 0 0 0 rgba(16, 185, 129, 0); }
}
```

### 2. Header Implementation
Add this at the top of the `<main>` container:
```html
<div class="w-full max-w-md flex items-center justify-between mb-8 reveal-item">
    <div class="relative flex items-center">
        <a href="https://www.gravitycard.space" target="_blank" class="action-btn">
            <img src="logo.png" alt="Logo">
        </a>
        <a href="https://www.gravitycard.space" target="_blank" id="promo-bubble" class="promo-bubble">
            <span>Want a card like this? <strong>Get it here</strong></span>
            <i class="fa-solid fa-arrow-up-right-from-square"></i>
        </a>
    </div>
    <button onclick="shareSite()" class="action-btn" aria-label="Share">
        <i class="fa-solid fa-arrow-up-from-bracket"></i>
    </button>
</div>
```

### 3. Footer Implementation
Add this at the bottom:
```html
<footer class="text-center py-3 mt-auto w-full flex flex-col items-center gap-2">
    <p class="text-[9px] text-gray-600 uppercase tracking-[0.2em] font-medium">© 2026 <a href="https://www.gravitycard.space" target="_blank" class="hover:text-white transition-colors">Gravity Card</a>. All Rights Reserved.</p>
    <div class="flex items-center gap-2">
        <span class="pulsing-dot"></span>
        <p class="text-[9px] text-gray-700 uppercase tracking-widest font-semibold">Powered by <a href="https://pixelplusewp.online" target="_blank" class="hover:text-white transition-colors">PixelPluse WP</a></p>
    </div>
</footer>
```

### 4. Logic & Animation
Ensure GSAP is included and add the looping animation:
```javascript
const promoBubble = document.getElementById('promo-bubble');
const startPromoAnimation = () => {
    const promoTl = gsap.timeline({ repeat: -1 });
    promoTl.to(promoBubble, { opacity: 1, x: 0, duration: 0.8, ease: "power2.out", pointerEvents: "auto" })
           .to({}, { duration: 5 })
           .to(promoBubble, { opacity: 0, x: -10, duration: 0.6, ease: "power2.in", pointerEvents: "none" })
           .to({}, { duration: 5 });
};
gsap.delayedCall(1.5, startPromoAnimation);
```
