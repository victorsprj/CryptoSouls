// Wait for DOM to load
document.addEventListener('DOMContentLoaded', function() {
    // OpenSea integration config (visible in client; rotate if leaked)
    const CHAIN = 'ethereum';
    // CryptoSouls main contract (placeholder until finalized)
    const CONTRACT_ADDRESS = '0xb47e3cd837ddf8e4c57f05d70ab865de6e193bbb';
    const OPENSEA_API_KEY = 'aab93e31722f4378bb84cd90204ca1c1'; // Consider moving to env/server in production
    
    // Mobile Navigation Toggle
    const hamburger = document.querySelector('.hamburger');
    const navMenu = document.querySelector('.nav-menu');
    
    if (hamburger) {
        hamburger.addEventListener('click', function() {
            navMenu.style.display = navMenu.style.display === 'flex' ? 'none' : 'flex';
            navMenu.style.position = 'absolute';
            navMenu.style.flexDirection = 'column';
            navMenu.style.top = '100%';
            navMenu.style.left = '0';
            navMenu.style.width = '100%';
            navMenu.style.backgroundColor = 'var(--dark-color)';
            navMenu.style.padding = '20px';
        });
    }
    
    // Smooth Scrolling for Navigation Links
    const navLinks = document.querySelectorAll('.nav-link');
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            const href = this.getAttribute('href') || '';
            // Only handle in-page anchors like #home
            if (href.startsWith('#')) {
                e.preventDefault();
                const targetSection = document.querySelector(href);
                if (targetSection) {
                    targetSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
                }
            }
        });
    });
    
    // Soul Preview: show rotating image instead of emojis
    const soulPreview = document.getElementById('soulPreview');
    if (soulPreview) {
        soulPreview.innerHTML = `<img src="https://i.imgur.com/7rnpypd.png" alt="CryptoSouls rotating" />`;
    }
    
    // Generate Random NFT Collection (fallback mode)
    function generateNFTCard(index, rarity) {
        const rarityColors = {
            'common': '#808080',
            'rare': '#4B9BFF',
            'epic': '#A335EE',
            'legendary': '#FF8000'
        };
        
        const rarityEmojis = {
            'common': ['😊', '😎', '🙂', '😄'],
            'rare': ['💙', '🔷', '🌊', '❄️'],
            'epic': ['💜', '🔮', '⚡', '🌌'],
            'legendary': ['🔥', '⭐', '💎', '👑']
        };
        
        const emoji = rarityEmojis[rarity][Math.floor(Math.random() * rarityEmojis[rarity].length)];
        // Mint is FREE for all rarities
        const price = 'FREE';
        
        // Fallback link (collection) — replaced by real asset URLs in OpenSea mode
        const openseaUrl = `https://opensea.io/assets/${CHAIN}/${CONTRACT_ADDRESS}/${index}`;
        
        // Optional: if you provide image URLs for tokens, they will be displayed instead of emojis
        // Example usage in console or script: window.TOKEN_IMAGE_URLS = {1: 'https://.../1.png', 2: 'https://.../2.png'}
        const imageUrl = (window.TOKEN_IMAGE_URLS && window.TOKEN_IMAGE_URLS[index]) ? window.TOKEN_IMAGE_URLS[index] : null;
        const mediaHtml = imageUrl
            ? `<img src="${imageUrl}" alt="CryptoSoul #${String(index).padStart(4, '0')}" style="width:100%;height:100%;object-fit:cover;image-rendering:pixelated;"/>`
            : `<span style="font-size: 80px;">${emoji}</span>`;
        
        return `
            <a class="nft-card" data-rarity="${rarity}" href="${openseaUrl}" target="_blank" rel="noopener" style="cursor: pointer; text-decoration:none; color:inherit;">
                <div class="nft-image" style="background: linear-gradient(135deg, var(--dark-color), ${rarityColors[rarity]});">
                    ${mediaHtml}
                </div>
                <div class="nft-info">
                    <div class="nft-name">Soul #${String(index).padStart(4, '0')}</div>
                    <div class="nft-price">${price}</div>
                </div>
            </a>
        `;
    }
    
    // Load Collection Grid (OpenSea mode with fallback)
    const collectionGrid = document.getElementById('collectionGrid');
    let nextCursor = null;
    let usingOpenSea = true;

    async function fetchOpenSeaNfts(limit = 24, cursor = null) {
        const params = new URLSearchParams();
        params.set('limit', String(limit));
        if (cursor) params.set('next', cursor);
        const url = `https://api.opensea.io/api/v2/chain/${CHAIN}/contract/${CONTRACT_ADDRESS}/nfts?${params.toString()}`;
        const res = await fetch(url, {
            headers: {
                'Accept': 'application/json',
                'X-API-KEY': OPENSEA_API_KEY
            }
        });
        if (!res.ok) throw new Error(`OpenSea error ${res.status}`);
        return res.json();
    }

    function renderOpenSeaNfts(nfts, append = false) {
        if (!collectionGrid) return;
        const html = nfts.map((nft, i) => {
            const tokenId = nft.identifier || nft.token_id || nft.tokenId || String(i+1);
            const name = nft.name || `Soul #${tokenId}`;
            // Temporary placeholder image until contract is finalized
            const img = 'https://i.imgur.com/qIA3U27.png';
            const assetUrl = `https://opensea.io/assets/${CHAIN}/${CONTRACT_ADDRESS}/${tokenId}`;
            return `
                <a class="nft-card" href="${assetUrl}" target="_blank" rel="noopener" style="text-decoration:none;color:inherit;">
                    <div class="nft-image">
                        <img src="${img}" alt="${name}" style="width:100%;height:100%;object-fit:cover;image-rendering:pixelated;"/>
                    </div>
                    <div class="nft-info">
                        <div class="nft-name">${name}</div>
                        <div class="nft-price">FREE</div>
                    </div>
                </a>
            `;
        }).join('');
        if (append) collectionGrid.innerHTML += html; else collectionGrid.innerHTML = html;
    }

    async function loadOpenSeaPage(initial = false) {
        try {
            const data = await fetchOpenSeaNfts(24, initial ? null : nextCursor);
            nextCursor = data.next || null;
            renderOpenSeaNfts(data.nfts || data.assets || [], !initial);
        } catch (e) {
            console.warn('OpenSea fetch failed, falling back to local generator:', e);
            usingOpenSea = false;
            // Fallback: generate local random placeholders
            const rarities = ['common','common','common','common','common','rare','rare','rare','epic','epic','legendary'];
            let html = '';
            for (let i = 0; i < 12; i++) {
                const rarity = rarities[Math.floor(Math.random()*rarities.length)];
                // Use placeholder image regardless of rarity
                const name = `Soul #${String(i+1).padStart(4,'0')}`;
                const img = 'https://i.imgur.com/qIA3U27.png';
                const assetUrl = `https://opensea.io/assets/${CHAIN}/${CONTRACT_ADDRESS}/${i+1}`;
                html += `
                    <a class="nft-card" data-rarity="${rarity}" href="${assetUrl}" target="_blank" rel="noopener" style="cursor: pointer; text-decoration:none; color:inherit;">
                        <div class="nft-image">
                            <img src="${img}" alt="${name}" style="width:100%;height:100%;object-fit:cover;image-rendering:pixelated;"/>
                        </div>
                        <div class="nft-info">
                            <div class="nft-name">${name}</div>
                            <div class="nft-price">FREE</div>
                        </div>
                    </a>
                `;
            }
            collectionGrid.innerHTML = html;
        }
    }

    // Initial load from OpenSea
    loadOpenSeaPage(true);
    
    // Filter Buttons
    const filterButtons = document.querySelectorAll('.filter-btn');
    filterButtons.forEach(button => {
        button.addEventListener('click', function() {
            filterButtons.forEach(btn => btn.classList.remove('active'));
            this.classList.add('active');
            // In OpenSea mode we do not have rarity data; reload first page
            if (usingOpenSea) {
                nextCursor = null;
                loadOpenSeaPage(true);
            }
        });
    });
    
    // Load More Button
    const loadMoreBtn = document.querySelector('.load-more');
    if (loadMoreBtn) {
        loadMoreBtn.addEventListener('click', function() {
            if (usingOpenSea && nextCursor) {
                loadOpenSeaPage(false);
            }
        });
    }
    
    // FAQ Accordion
    const faqQuestions = document.querySelectorAll('.faq-question');
    faqQuestions.forEach(question => {
        question.addEventListener('click', function() {
            const faqItem = this.parentElement;
            faqItem.classList.toggle('active');
            
            // Close other FAQ items
            faqQuestions.forEach(otherQuestion => {
                if (otherQuestion !== this) {
                    otherQuestion.parentElement.classList.remove('active');
                }
            });
        });
    });
    
    // Wallet Connection (Mock)
    const connectWalletBtns = document.querySelectorAll('.connect-wallet');
    connectWalletBtns.forEach(btn => {
        btn.addEventListener('click', async function() {
            // Mock wallet connection
            this.textContent = 'Connecting...';
            this.style.backgroundColor = 'var(--secondary-color)';
            
            setTimeout(() => {
                const address = '0x' + Math.random().toString(16).substr(2, 8).toUpperCase() + '...';
                this.textContent = address;
                this.style.backgroundColor = 'var(--accent-color)';
                
                // Show alert
                showPixelAlert('Wallet Connected Successfully! 🎮');
            }, 2000);
        });
    });
    
    // Mint Button (Mock)
    const mintButtons = document.querySelectorAll('.pixel-button.primary');
    mintButtons.forEach(btn => {
        if (btn.textContent.includes('Mint')) {
            btn.addEventListener('click', function() {
                showPixelAlert('Minting will begin soon! Join our Discord for updates. 🚀');
            });
        }
    });
    
    // OpenSea Button
    const openSeaButtons = document.querySelectorAll('.pixel-button.secondary');
    openSeaButtons.forEach(btn => {
        if (btn.textContent.includes('OpenSea')) {
            btn.addEventListener('click', function() {
                showPixelAlert('Collection will be available on OpenSea after mint! 🌊');
            });
        }
    });
    
    // Pixel Alert System
    function showPixelAlert(message) {
        const existingAlert = document.querySelector('.pixel-alert');
        if (existingAlert) {
            existingAlert.remove();
        }
        
        const alert = document.createElement('div');
        alert.className = 'pixel-alert';
        alert.innerHTML = `
            <div class="pixel-alert-content">
                ${message}
                <button class="pixel-alert-close">×</button>
            </div>
        `;
        
        document.body.appendChild(alert);
        
        // Add styles
        const style = document.createElement('style');
        style.textContent = `
            .pixel-alert {
                position: fixed;
                top: 100px;
                left: 50%;
                transform: translateX(-50%);
                z-index: 10000;
                animation: slideDown 0.3s ease;
            }
            .pixel-alert-content {
                background-color: var(--dark-color);
                border: 4px solid var(--primary-color);
                padding: 20px 40px;
                font-family: 'VT323', monospace;
                font-size: 24px;
                color: var(--light-color);
                box-shadow: 4px 4px 0px rgba(0,0,0,0.8);
                position: relative;
            }
            .pixel-alert-close {
                position: absolute;
                right: 10px;
                top: 10px;
                background: none;
                border: none;
                color: var(--primary-color);
                font-size: 28px;
                cursor: pointer;
            }
            @keyframes slideDown {
                from {
                    transform: translate(-50%, -100px);
                    opacity: 0;
                }
                to {
                    transform: translate(-50%, 0);
                    opacity: 1;
                }
            }
        `;
        document.head.appendChild(style);
        
        // Close button
        const closeBtn = alert.querySelector('.pixel-alert-close');
        closeBtn.addEventListener('click', () => alert.remove());
        
        // Auto close after 5 seconds
        setTimeout(() => {
            if (alert.parentElement) {
                alert.remove();
            }
        }, 5000);
    }
    
    // Animate elements on scroll
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, observerOptions);
    
    // Observe sections
    const sections = document.querySelectorAll('.about, .collection, .roadmap, .team, .faq');
    sections.forEach(section => {
        section.style.opacity = '0';
        section.style.transform = 'translateY(30px)';
        section.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(section);
    });
    
    // Roadmap Animation
    const roadmapItems = document.querySelectorAll('.roadmap-item');
    roadmapItems.forEach((item, index) => {
        item.style.opacity = '0';
        item.style.transform = 'scale(0.9)';
        setTimeout(() => {
            item.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
            item.style.opacity = '1';
            item.style.transform = 'scale(1)';
        }, 200 * index);
    });
    
    // Parallax Effect for Hero Section
    window.addEventListener('scroll', () => {
        const scrolled = window.pageYOffset;
        const parallax = document.querySelector('.pixel-stars');
        if (parallax) {
            parallax.style.transform = `translateY(${scrolled * 0.5}px)`;
        }
    });
    
    // Add hover sound effect (optional - requires audio files)
    const hoverElements = document.querySelectorAll('.pixel-button, .nft-card, .feature-card');
    hoverElements.forEach(element => {
        element.addEventListener('mouseenter', () => {
            // Could add sound effect here
            element.style.cursor = 'pointer';
        });
    });
    
    // Countdown Timer (if needed for launch)
    function startCountdown(targetDate) {
        const countdownElement = document.createElement('div');
        countdownElement.className = 'countdown-timer';
        countdownElement.style.cssText = `
            position: fixed;
            bottom: 20px;
            right: 20px;
            background: var(--dark-color);
            border: 3px solid var(--primary-color);
            padding: 15px;
            font-family: 'Press Start 2P', cursive;
            font-size: 10px;
            color: var(--accent-color);
            z-index: 1000;
            box-shadow: var(--pixel-shadow);
        `;
        
        function updateCountdown() {
            const now = new Date().getTime();
            const distance = targetDate - now;
            
            if (distance > 0) {
                const days = Math.floor(distance / (1000 * 60 * 60 * 24));
                const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
                const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
                const seconds = Math.floor((distance % (1000 * 60)) / 1000);
                
                countdownElement.innerHTML = `
                    MINT STARTS IN<br>
                    ${days}D ${hours}H ${minutes}M ${seconds}S
                `;
            } else {
                countdownElement.innerHTML = 'MINT IS LIVE!';
                countdownElement.style.backgroundColor = 'var(--primary-color)';
            }
        }
        
        // Uncomment to activate countdown
        // document.body.appendChild(countdownElement);
        // setInterval(updateCountdown, 1000);
        // updateCountdown();
    }
    
    // You can set a launch date here
    // const launchDate = new Date('2024-12-25T00:00:00').getTime();
    // startCountdown(launchDate);
    
    // Console Easter Egg
    console.log('%c🎮 Welcome to CryptoSouls! 🎮', 'font-family: "Press Start 2P"; font-size: 20px; color: #FF6B6B;');
    console.log('%c4444 Unique Pixel Souls await...', 'font-family: "VT323"; font-size: 16px; color: #4ECDC4;');
    console.log('%cNote:', 'font-weight:bold;', 'Using temporary placeholder images in collection until contract is finalized.');
});

// Add some fun pixel animations
document.addEventListener('mousemove', (e) => {
    // Create a trail effect (performance-friendly version)
    if (Math.random() > 0.98) { // Only create trail 2% of the time
        const pixel = document.createElement('div');
        pixel.className = 'pixel-trail';
        pixel.style.cssText = `
            position: fixed;
            left: ${e.clientX}px;
            top: ${e.clientY}px;
            width: 4px;
            height: 4px;
            background: var(--secondary-color);
            pointer-events: none;
            animation: pixelFade 1s ease forwards;
            z-index: 9999;
        `;
        document.body.appendChild(pixel);
        
        setTimeout(() => pixel.remove(), 1000);
    }
});

// Add pixel fade animation
const styleSheet = document.createElement('style');
styleSheet.textContent = `
    @keyframes pixelFade {
        from {
            opacity: 1;
            transform: scale(1) rotate(0deg);
        }
        to {
            opacity: 0;
            transform: scale(0) rotate(180deg);
        }
    }
`;
document.head.appendChild(styleSheet);
