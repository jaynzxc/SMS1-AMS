// assets/js/services/attendanceService.js
import { supabase } from '../config/supabaseClient.js';

/**
 * Retrieve attendance rows for a given student ID.
 * @param {string|number} studentId
 * @returns {Promise<Array|null>}
 */
export async function getStudentAttendance(studentId) {
  const { data, error } = await supabase
    .from('attendance')
    .select('*')
    .eq('student_id', studentId)
    .order('recorded_at', { ascending: false });

  if (error) {
    console.error('❌ Failed to fetch attendance:', error);
    return null;
  }
  return data;
}

/**
 * Fetch all attendance logs for a specific date.
 * @param {string} date - Format YYYY-MM-DD
 */
export async function getAttendanceByDate(date) {
  const { data, error } = await supabase
    .from('attendance')
    .select('*')
    .eq('date', date);

  if (error) {
    console.error('❌ Failed to fetch attendance for date:', error);
    return [];
  }
  return data;
}
