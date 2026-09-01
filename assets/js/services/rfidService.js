// assets/js/services/rfidService.js
import { supabase } from '../config/supabaseClient.js';

/**
 * Log an RFID scan record to Supabase.
 * @param {Object} scanData - { student_id, scanned_at, location }
 */
export async function logRfidScan({ student_id, scanned_at = new Date().toISOString(), location = 'Main Gate' }) {
  const { data, error } = await supabase
    .from('rfid_scans')
    .insert([{ student_id, scanned_at, location }]);

  if (error) {
    console.error('❌ RFID insert failed:', error);
    return { success: false, error };
  }
  console.log('✅ RFID scan logged successfully:', data);
  return { success: true, data };
}
