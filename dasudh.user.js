// ==UserScript==
// @name         IP & Location Overlay
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  Displays your current public IP address and its approximate location in a small, unobtrusive overlay in the top right corner.
// @author       Your Name
// @match        *://*/*
// @grant        GM.xmlHttpRequest
// ==/UserScript==

(function() {
    'use strict';

    // --- PENGATURAN ---
    // URL API untuk mendapatkan informasi IP (menggunakan ip-api.com yang gratis)
    const ipApiUrl = 'http://ip-api.com/json/';
    // Interval refresh data IP (dalam milidetik). Jangan terlalu sering agar tidak diblokir API.
    const refreshInterval = 3600000; // 1 jam (3600000 ms)

    let overlayDiv; // Variabel untuk menyimpan elemen div overlay

    // --- FUNGSI UTILITY ---

    // Fungsi untuk membuat elemen overlay
    function createOverlayDiv() {
        overlayDiv = document.createElement('div');
        overlayDiv.id = 'tm-ip-location-overlay';
        overlayDiv.style.position = 'fixed';
        overlayDiv.style.top = '10px';
        overlayDiv.style.right = '10px';
        overlayDiv.style.backgroundColor = 'rgba(0, 0, 0, 0.7)'; // Background semi-transparan gelap
        overlayDiv.style.color = '#fff'; // Teks putih
        overlayDiv.style.padding = '5px 10px';
        overlayDiv.style.borderRadius = '5px';
        overlayDiv.style.zIndex = '999999'; // Pastikan di atas elemen lain
        overlayDiv.style.fontFamily = 'Arial, sans-serif';
        overlayDiv.style.fontSize = '10px'; // Ukuran font kecil
        overlayDiv.style.lineHeight = '1.4';
        overlayDiv.style.textAlign = 'right';
        overlayDiv.style.minWidth = '120px'; // Lebar minimum agar tidak terlalu sempit
        overlayDiv.style.boxShadow = '0 2px 5px rgba(0,0,0,0.2)'; // Sedikit bayangan
        overlayDiv.textContent = 'Loading IP...'; // Teks awal saat memuat

        document.body.appendChild(overlayDiv);
    }

    // Fungsi untuk mendapatkan dan menampilkan data IP
    function fetchIpAndLocation() {
        console.log('[IP Overlay] Fetching IP and location data...');
        GM.xmlHttpRequest({
            method: "GET",
            url: ipApiUrl,
            onload: function(response) {
                try {
                    const data = JSON.parse(response.responseText);
                    if (data.status === 'success') {
                        const ip = data.query;
                        const country = data.country;
                        const city = data.city;
                        const regionName = data.regionName;
                        const isp = data.isp; // Provider internet

                        // Tampilkan IP, Kota, Wilayah, Negara
                        overlayDiv.innerHTML = `
                            IP: <b>${ip}</b><br>
                            Loc: ${city}, ${regionName}, ${country}<br>
                            ISP: ${isp}
                        `;
                        console.log(`[IP Overlay] IP: ${ip}, Location: ${city}, ${country}`);
                    } else {
                        overlayDiv.textContent = `Error: ${data.message || 'Failed to get IP'}`;
                        console.error('[IP Overlay] API Error:', data.message);
                    }
                } catch (e) {
                    overlayDiv.textContent = 'Error parsing data.';
                    console.error('[IP Overlay] JSON parse error:', e);
                }
            },
            onerror: function(error) {
                overlayDiv.textContent = 'Network Error.';
                console.error('[IP Overlay] Network error:', error);
            }
        });
    }

    // --- INISIALISASI ---
    window.addEventListener('load', () => {
        // Beri waktu 500ms agar DOM terisi sebelum membuat overlay
        setTimeout(() => {
            createOverlayDiv();
            fetchIpAndLocation(); // Ambil data IP pertama kali
            // Set interval untuk refresh data
            setInterval(fetchIpAndLocation, refreshInterval);
        }, 500);
    });

})();
