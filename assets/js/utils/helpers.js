// assets/js/utils/helpers.js
// Shared utility functions across Admin, Teacher, and Student portals

/**
 * Formats a Date object or ISO string into YYYY-MM-DD format
 * @param {Date|string} date 
 * @returns {string}
 */
export function formatDate(date) {
    if (!date) return '';
    const d = new Date(date);
    if (isNaN(d.getTime())) return '';
    return d.toISOString().split('T')[0];
}

/**
 * Formats time to 12-hour AM/PM string (e.g., "08:30 AM")
 * @param {string|Date} time 
 * @returns {string}
 */
export function formatTime12h(time) {
    if (!time) return '--:--';
    if (typeof time === 'string' && time.includes(':')) {
        const parts = time.split(':');
        let hours = parseInt(parts[0], 10);
        const minutes = parts[1].padStart(2, '0');
        const ampm = hours >= 12 ? 'PM' : 'AM';
        hours = hours % 12 || 12;
        return `${String(hours).padStart(2, '0')}:${minutes} ${ampm}`;
    }
    const d = new Date(time);
    if (isNaN(d.getTime())) return '--:--';
    return d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: true });
}

/**
 * Escapes HTML characters to prevent XSS in dynamic table renderings
 * @param {string} str 
 * @returns {string}
 */
export function escapeHTML(str) {
    if (str === null || str === undefined) return '';
    return String(str)
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#039;');
}

/**
 * Exports data rows to CSV and triggers a browser download
 * @param {string} filename 
 * @param {Array<string>} headers 
 * @param {Array<Array<any>>} rows 
 */
export function exportToCSV(filename, headers, rows) {
    const csvContent = [
        headers.map(h => `"${String(h).replace(/"/g, '""')}"`).join(','),
        ...rows.map(row => 
            row.map(cell => `"${String(cell ?? '').replace(/"/g, '""')}"`).join(',')
        )
    ].join('\r\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', filename.endsWith('.csv') ? filename : `${filename}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
}
