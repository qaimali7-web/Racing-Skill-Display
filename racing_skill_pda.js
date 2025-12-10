// ==UserScript==
// @name         Racing Skill Display New
// @namespace    https://github.com/qaimali7-web
// @version      1.1
// @description  Shows your own Racing Skill on the racing page. Fixes infinite prompt loop on mobile.
// @author       Qaim [2370947]
// @match        https://www.torn.com/page.php?sid=racing*
// @match        https://www.torn.com/loader.php?sid=racing*
// @grant        GM_xmlhttpRequest
// @grant        GM_setValue
// @grant        GM_getValue
// @connect      api.torn.com
// @homepageURL  https://github.com/qaimali7-web/Racing-Skill-Display-New
// @updateURL    https://raw.githubusercontent.com/qaimali7-web/Racing-Skill-Display-New/main/racing_skill_pda.js
// @downloadURL  https://raw.githubusercontent.com/qaimali7-web/Racing-Skill-Display-New/main/racing_skill_pda.js
// ==/UserScript==

(function() {
    'use strict';

    const API_KEY_STORAGE = 'torn_racing_api_key';
    const POS_TOP_STORAGE = 'torn_racing_pos_top';
    const POS_LEFT_STORAGE = 'torn_racing_pos_left';
    
    let hasAskedThisSession = false;

    function getApiKey() {
        let key = GM_getValue(API_KEY_STORAGE);
        if (key && key.length === 16) return key;

        if (hasAskedThisSession) {
            return null;
        }

        hasAskedThisSession = true;

        key = prompt("Please enter your Torn Public API Key (16 characters) to see your Racing Skill:");

        if (key && key.length === 16) {
            GM_setValue(API_KEY_STORAGE, key);
            return key;
        } else {
            console.log("Racing Skill: No valid key entered. Script sleeping until refresh.");
            return null;
        }
    }

    function fetchRacingSkill(key) {
        const url = `https://api.torn.com/user/?selections=personalstats&key=${key}`;

        GM_xmlhttpRequest({
            method: "GET",
            url: url,
            onload: function(response) {
                try {
                    const data = JSON.parse(response.responseText);
                    if (data.error) {
                        console.error("Torn API Error:", data.error.error);
                        if (data.error.code === 2) {
                             GM_setValue(API_KEY_STORAGE, '');
                             alert("API Key invalid. Please refresh to try again.");
                        }
                        return;
                    }
                    displayRacingSkill(data.personalstats.racingskill);
                } catch (e) {
                    console.error("Error parsing Torn API response", e);
                }
            }
        });
    }

    function makeDraggable(element) {
        let isDragging = false;
        let startX, startY, initialLeft, initialTop;

        element.addEventListener('mousedown', (e) => {
            isDragging = true;
            startX = e.clientX;
            startY = e.clientY;
            initialLeft = element.offsetLeft;
            initialTop = element.offsetTop;
            element.style.cursor = 'grabbing';
            e.preventDefault();
        });
        document.addEventListener('mousemove', (e) => {
            if (!isDragging) return;
            const dx = e.clientX - startX;
            const dy = e.clientY - startY;
            element.style.left = `${initialLeft + dx}px`;
            element.style.top = `${initialTop + dy}px`;
        });
        document.addEventListener('mouseup', () => {
            if (isDragging) {
                isDragging = false;
                element.style.cursor = 'move';
                GM_setValue(POS_LEFT_STORAGE, element.style.left);
                GM_setValue(POS_TOP_STORAGE, element.style.top);
            }
        });

        element.addEventListener('touchstart', (e) => {
            isDragging = true;
            const touch = e.touches[0];
            startX = touch.clientX;
            startY = touch.clientY;
            initialLeft = element.offsetLeft;
            initialTop = element.offsetTop;
            e.preventDefault(); 
        }, { passive: false });

        document.addEventListener('touchmove', (e) => {
            if (!isDragging) return;
            const touch = e.touches[0];
            const dx = touch.clientX - startX;
            const dy = touch.clientY - startY;
            element.style.left = `${initialLeft + dx}px`;
            element.style.top = `${initialTop + dy}px`;
            if(e.cancelable) e.preventDefault(); 
        }, { passive: false });

        document.addEventListener('touchend', () => {
            if (isDragging) {
                isDragging = false;
                GM_setValue(POS_LEFT_STORAGE, element.style.left);
                GM_setValue(POS_TOP_STORAGE, element.style.top);
            }
        });
    }

    function displayRacingSkill(skill) {
        if (document.getElementById('rs-display-box')) return;

        const target = document.querySelector('.racing-main-wrap');

        if (target) {
            if(getComputedStyle(target).position === 'static') {
                target.style.position = 'relative';
            }

            const displayDiv = document.createElement('div');
            displayDiv.id = 'rs-display-box';

            const savedTop = GM_getValue(POS_TOP_STORAGE, '95px');
            const savedLeft = GM_getValue(POS_LEFT_STORAGE, '26px');

            displayDiv.style.cssText = `
                position: absolute;
                top: ${savedTop};
                left: ${savedLeft};
                background: rgba(0, 0, 0, 0.85);
                color: #fff;
                padding: 6px 12px;
                border-radius: 6px;
                font-weight: bold;
                border: 1px solid #444;
                z-index: 9999;
                font-size: 14px;
                cursor: move;
                user-select: none;
                box-shadow: 0 2px 5px rgba(0,0,0,0.5);
                white-space: nowrap;
            `;

            displayDiv.innerHTML = `🏁 RS: <span style="color: #00ff00;">${parseFloat(skill).toFixed(2)}</span>`;

            target.appendChild(displayDiv);
            makeDraggable(displayDiv);
        }
    }

    function init() {
        const key = getApiKey();
        if (key) fetchRacingSkill(key);
    }

    const observer = new MutationObserver((mutations) => {
        if (hasAskedThisSession && !GM_getValue(API_KEY_STORAGE)) return;

        if (document.querySelector('.racing-main-wrap') && !document.getElementById('rs-display-box')) {
            init();
        }
    });

    observer.observe(document.body, { childList: true, subtree: true });

})();
