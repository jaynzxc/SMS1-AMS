// assets/js/services/rfidService.js
import { supabase } from '../config/supabaseClient.js';

/**
 * Fetch RFID card details by card UID.
 * @param {string} cardUid
 * @returns {Promise<Object|null>}
 */
export async function getCardByUid(cardUid) {
  const { data, error } = await supabase
    .from('rfid_cards')
    .select('*')
    .eq('card_uid', cardUid)
    .single();

  if (error) {
    console.error('[RFID Service] Failed to lookup card UID:', error);
    return null;
  }
  return data;
}

/**
 * Update the last scanned timestamp for an RFID card.
 * @param {string} cardUid
 * @returns {Promise<{success: boolean, data?: any, error?: any}>}
 */
export async function updateLastScanned(cardUid) {
  const { data, error } = await supabase
    .from('rfid_cards')
    .update({ last_scanned_at: new Date().toISOString() })
    .eq('card_uid', cardUid)
    .select();

  if (error) {
    console.error('[RFID Service] Failed to update last scan timestamp:', error);
    return { success: false, error };
  }
  return { success: true, data };
}

/**
 * Log an RFID card scan by updating the card's last_scanned_at timestamp.
 * @param {Object} scanData - { card_uid, location }
 * @returns {Promise<{success: boolean, data?: any, error?: any}>}
 */
export async function logRfidScan({ card_uid, location = 'Main Gate' }) {
  if (!card_uid) {
    console.error('[RFID Service] Card UID is required to log RFID scan.');
    return { success: false, error: 'Missing card UID' };
  }

  const { data, error } = await supabase
    .from('rfid_cards')
    .update({ last_scanned_at: new Date().toISOString() })
    .eq('card_uid', card_uid)
    .select();

  if (error) {
    console.error('[RFID Service] RFID scan update failed:', error);
    return { success: false, error };
  }
  console.log('[RFID Service] RFID scan recorded successfully:', data);
  return { success: true, data };
}
