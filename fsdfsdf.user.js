// ==UserScript==
// @name         Human-like Auto Clicker for Claim Button
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  Automatically clicks the "Claim" button with human-like delays and randomness.
// @author       You
// @match        https://wump.xyz/
// @match        https://wump.xyz
// @grant        none
// ==/UserScript==

(function() {
    'use strict';

    // --- Configuration ---
    const MIN_CLICK_DELAY_MS = 2000; // Minimum delay between clicks in milliseconds
    const MAX_CLICK_DELAY_MS = 5000; // Maximum delay between clicks in milliseconds
    const INITIAL_DELAY_MS = 3000; // Delay before the first click starts
    const SEARCH_INTERVAL_MS = 1000; // How often to search for the button if not found immediately

    // --- Helper Functions ---

    /**
     * Generates a random integer between min (inclusive) and max (inclusive).
     */
    function getRandomInt(min, max) {
        return Math.floor(Math.random() * (max - min + 1)) + min;
    }

    /**
     * Finds the "Claim" button based on its text content and common attributes.
     * @returns {HTMLElement|null} The button element if found, otherwise null.
     */
    function findClaimButton() {
        const buttons = document.querySelectorAll('button');
        for (const button of buttons) {
            // Check for text content and common button classes
            if (button.textContent.trim().toLowerCase() === 'claim' &&
                button.classList.contains('bg-primary') &&
                button.classList.contains('text-primary-foreground')) {
                return button;
            }
        }
        return null;
    }

    /**
     * Performs a human-like click on the given element.
     * This includes simulating a mouse down and mouse up event with a small delay.
     * @param {HTMLElement} element The element to click.
     */
    function humanLikeClick(element) {
        if (!element) return;

        const rect = element.getBoundingClientRect();
        const centerX = rect.left + rect.width / 2;
        const centerY = rect.top + rect.height / 2;

        // Simulate mouse down
        element.dispatchEvent(new MouseEvent('mousedown', {
            view: window,
            bubbles: true,
            cancelable: true,
            clientX: centerX + getRandomInt(-2, 2), // Small random offset
            clientY: centerY + getRandomInt(-2, 2)
        }));

        // Small delay before mouse up
        setTimeout(() => {
            // Simulate mouse up
            element.dispatchEvent(new MouseEvent('mouseup', {
                view: window,
                bubbles: true,
                cancelable: true,
                clientX: centerX + getRandomInt(-2, 2),
                clientY: centerY + getRandomInt(-2, 2)
            }));

            // Simulate click (some elements might only respond to a direct click event)
            element.click();
            console.log('Claim button clicked at:', new Date().toLocaleTimeString());
        }, getRandomInt(50, 150)); // Random short delay for mouse up
    }

    // --- Main Auto-Clicker Logic ---
    let autoClickerInterval = null;

    function startAutoClicker() {
        if (autoClickerInterval) return; // Prevent multiple intervals

        autoClickerInterval = setInterval(() => {
            const claimButton = findClaimButton();
            if (claimButton && !claimButton.disabled) {
                humanLikeClick(claimButton);
                // After clicking, clear the current interval and set a new one
                // to introduce a human-like variable delay before the next search/click.
                clearInterval(autoClickerInterval);
                autoClickerInterval = null; // Reset to allow a new interval to be set
                setTimeout(startAutoClicker, getRandomInt(MIN_CLICK_DELAY_MS, MAX_CLICK_DELAY_MS));
            } else if (claimButton && claimButton.disabled) {
                console.log('Claim button found but is disabled. Waiting...');
            } else {
                console.log('Claim button not found. Searching again...');
            }
        }, SEARCH_INTERVAL_MS); // Initially search more frequently
    }

    // --- Initialization ---
    // Start the auto-clicker after an initial delay to mimic human Browse.
    console.log(`Tampermonkey script started. Looking for "Claim" button in ${INITIAL_DELAY_MS / 1000} seconds.`);
    setTimeout(startAutoClicker, INITIAL_DELAY_MS);

})();
