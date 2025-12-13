# 🏁 Racing Skill Display Ultimate

**Racing Skill Display Ultimate** is a feature-rich UserScript for the text-based RPG **Torn City**. It provides a real-time, drag-and-drop overlay that displays your **Racing Skill (RS)**, **Racing Points (RP)**, **Total Points (TP)**, and the exact points needed to advance to the next Racing Class.

It uses a **Hybrid Data Strategy** (Footer Scraping + API) to ensure 100% accuracy for your spendable points while strictly adhering to Torn's scripting rules.

## ✨ Features

* **Expanded Data View (2 Rows):**
    * **Row 1:** `RS` (Skill) | `RP` (Spendable) | `TP` (Total Earned)
    * **Row 2:** `RP Needed` | `Next Class`
* **Unique Color Coding:**
    * <span style="color:#00ff00">**Green:**</span> Racing Skill (RS)
    * <span style="color:#00ccff">**Cyan:**</span> Current Spendable Points (RP)
    * <span style="color:#ff66ff">**Magenta:**</span> Total Points Earned (TP)
    * <span style="color:#ff3333">**Red:**</span> Points Needed for Upgrade
    * <span style="color:#ffd700">**Gold:**</span> Next Class Target
* **Smart "Footer Authority":**
    * The script treats the *"You have X racing points available"* text in the page footer as the absolute truth.
    * If found, it ignores potentially cached API data to ensure your "Spendable RP" is always correct.
* **Continuous Scan:** Scans the page for 10 seconds after load to catch stats even if the page loads slowly.
* **Next Class Calculator:** Automatically calculates progress toward Class D, C, B, or A based on your *Total* points.
* **Drag & Drop UI:** Move the stats box anywhere on your screen. It remembers your position.

## 🚀 Installation

1.  **Install a Script Manager:**
    * [Tampermonkey](https://www.tampermonkey.net/) (Chrome, Edge, Safari, Firefox)
    * [Violentmonkey](https://violentmonkey.github.io/) (Open Source alternative)
    * **Torn PDA:** Fully compatible with the Torn PDA mobile app.

2.  **Install the Script:**
    * [**Click Here to Install**](https://raw.githubusercontent.com/qaimali7-web/Racing-Skill-Display-New/main/racing_skill.user.js)
    * *Or manually copy the code into a new script.*

## 🛡️ Safety & Compliance

This script is designed to be **100% compliant** with Torn City's scripting rules.

* ✅ **Official API Only:** All external data is fetched strictly via `api.torn.com`.
* ✅ **Footer Priority:** It prioritizes reading data physically visible on the page (Footer RP & Visual Skill) over API calls.
* ✅ **No Hidden Requests:** It never makes background "non-API" requests to Torn.
* ✅ **Efficient:** It triggers only **one** API call per page load to prevent server spamming.

## 📖 How to Use

1.  **Navigate to Racing:** Go to the Racing page in Torn.
2.  **Enter API Key:** On the first load, the script will ask for your **Public API Key**.
    * *If you don't have one, find it in your [Torn Preferences](https://www.torn.com/preferences.php).*
3.  **View Stats:** The box will appear showing your stats in the new 2-row format.
4.  **Move It:** Click and drag the box to your preferred location.

## 📜 Changelog

### v2.2 (Current)
* **UI:** Updated to a cleaner 2-row layout with unique colors for every stat.
* **Fix:** Restored "Footer Authority" logic. The script now continuously scans the footer for 10s to ensure "Spendable RP" is accurate, overriding the API if they mismatch.
* **Feature:** Added "Total Points" (TP) to the display.

---

*Disclaimer: This script is a third-party tool and is not affiliated with Torn City. Use at your own discretion.*
