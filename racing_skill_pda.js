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

    function makeDraggable(element, handle) {
        let isDragging = false;
        let startX, startY, initialLeft, initialTop;

        const startDrag = (clientX, clientY) => {
            isDragging = true;
            startX = clientX;
            startY = clientY;
            initialLeft = element.offsetLeft;
            initialTop = element.offsetTop;
            element.style.opacity = "0.7"; // Visual feedback
        };

        const moveDrag = (clientX, clientY) => {
            if (!isDragging) return;
            const dx = clientX - startX;
            const dy = clientY - startY;
            element.style.left = `${initialLeft + dx}px`;
            element.style.top = `${initialTop + dy}px`;
        };

        const endDrag = () => {
            if (isDragging) {
                isDragging = false;
                element.style.opacity = "1";

                GM_setValue('torn_racing_pos_left', element.style.left);
                GM_setValue('torn_racing_pos_top', element.style.top);
            }
        };

        handle.addEventListener('mousedown', (e) => {
            startDrag(e.clientX, e.clientY);
            e.preventDefault();
        });
        document.addEventListener('mousemove', (e) => {
            if (isDragging) {
                moveDrag(e.clientX, e.clientY);
                e.preventDefault();
            }
        });
        document.addEventListener('mouseup', endDrag);

        handle.addEventListener('touchstart', (e) => {
            const touch = e.touches[0];
            startDrag(touch.clientX, touch.clientY);
            e.preventDefault(); 
            e.stopPropagation();
        }, { passive: false });

        document.addEventListener('touchmove', (e) => {
            if (isDragging) {
                const touch = e.touches[0];
                moveDrag(touch.clientX, touch.clientY);
                e.preventDefault(); 
            }
        }, { passive: false });

        document.addEventListener('touchend', endDrag);
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
