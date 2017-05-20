import { ipcRenderer as ipc, BrowserWindow } from 'electron';
import { Sidebar } from './sidebar';

// To substitute with env

const Config = require('electron-config');
const config = new Config();


ipc.on('GoInbox', () => {
    // Go to Inbox/inbox
    document.querySelector('a[href=\'/inbox\']').click();
});

ipc.on('show-preferences', () => {
    // Click preferences button
    document.querySelector('#tour-settings').click();
});

ipc.on('new-email', () => {
    // Click COMPOSE button
    document.querySelector('.compose.pm_button.primary').click();
});

ipc.on('log-out', () => {
    // Click hided logout button
    document.querySelector('.pm_button.primary.text-center').click();
});

ipc.on('close-composer', () => {
    // Click COMPOSE button
    document.querySelector('.pm_button.link.close-button').click();
});

function setDarkMode() {
    document.documentElement.classList.toggle('dark-mode', config.get('darkMode'));
}

ipc.on('toggle-dark-mode', () => {
    config.set('darkMode', !config.get('darkMode'));
    setDarkMode();
});

ipc.on('zoom-reset', () => {
    setZoom(1.0);
});

ipc.on('zoom-in', () => {
    const zoomFactor = config.get('zoomFactor') + 0.1;

    if (zoomFactor < 1.6) {
        setZoom(zoomFactor);
    }
});

ipc.on('zoom-out', () => {
    const zoomFactor = config.get('zoomFactor') - 0.1;

    if (zoomFactor >= 0.8) {
        setZoom(zoomFactor);
    }
});

function setZoom(zoomFactor) {
    const node = document.getElementById('zoomFactor');
    node.textContent = `#wrapper {zoom: ${zoomFactor} !important}`;
    config.set('zoomFactor', zoomFactor);
}

// Inject a global style node to maintain zoom factor after conversation change.
// Also set the zoom factor if it was set before quitting.
document.addEventListener('DOMContentLoaded', () => {
    const zoomFactor = config.get('zoomFactor') || 1.0;
    const style = document.createElement('style');
    style.id = 'zoomFactor';

    /*const webview = document.createElement("webview");
    webview.src = 'file://' + __dirname + '/settings.html';
    webview.className = 'visible';
    document.querySelector(".etabs-views").appendChild(webview);
    */

    document.body.appendChild(style);
    setZoom(zoomFactor);
    const sidebar = new Sidebar();

    // Activate Dark Mode if it was set before quitting
    setDarkMode();
});
