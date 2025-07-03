import { Exam } from '@/types/reports';
import { getAllExamReports } from '@/services/reports/examReports';

/**
 * Function to get exam data from backend API
 * @returns Promise<Exam[]> - Array of exam reports from the backend
 */
export async function getExamReports(): Promise<Exam[]> {
  try {
    // Fetch real data from the API
    const examReports = await getAllExamReports();
    
    // Return the exam reports from API (empty array if no data)
    return examReports || [];
  } catch (error) {
    console.error('Error fetching exam reports:', error);
    // Return empty array on error - UI will show "No exam reports found" message
    return [];
  }
}
