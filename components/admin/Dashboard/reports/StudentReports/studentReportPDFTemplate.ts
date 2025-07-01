import { StudentDetails, StudentExamReport } from './types';

export const generateStudentReportPDF = (
  studentDetails: StudentDetails,
  examReports: StudentExamReport[]
): string => {
  const completedExams = examReports.filter(exam => exam.status === 'completed');
  const missedExams = examReports.filter(exam => exam.status === 'missed');
  const pendingExams = examReports.filter(exam => exam.status === 'pending');
  
  const averageScore = completedExams.length > 0 
    ? completedExams.reduce((sum, exam) => sum + (exam.percentage || 0), 0) / completedExams.length 
    : 0;

  return `
    <!DOCTYPE html>
    <html>
      <head>
        <title>Academic Performance Report - ${studentDetails.name}</title>
        <meta charset="UTF-8">
        <style>
          @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800;900&display=swap');
          
          * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
          }
          
          body { 
            font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
            line-height: 1.6;
            color: #1a202c;
            background: #ffffff;
            margin: 0;
            padding: 20px;
          }
          
          .watermark {
            position: fixed;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%) rotate(-45deg);
            font-size: 120px;
            color: rgba(20, 184, 166, 0.03);
            font-weight: 900;
            z-index: -1;
            pointer-events: none;
            user-select: none;
          }
          
          .document-header {
            text-align: center;
            margin-bottom: 40px;
            border-bottom: 3px solid #14b8a6;
            padding-bottom: 30px;
            position: relative;
          }
          
          .university-logo {
            width: 200px;
            height: 200px;
            margin: 0 auto 25px;
            display: flex;
            align-items: center;
            justify-content: center;
          }
          
          .university-logo img {
            width: 200px;
            height: 200px;
            object-fit: contain;
          }
          
          .university-name {
            font-size: 28px;
            font-weight: 700;
            color: #000000;
            margin-bottom: 8px;
            letter-spacing: 1px;
          }
          
          .university-subtitle {
            font-size: 14px;
            color: #64748b;
            margin-bottom: 20px;
            text-transform: uppercase;
            letter-spacing: 2px;
          }
          
          .report-title {
            font-size: 24px;
            font-weight: 600;
            color: #1e293b;
            margin-bottom: 8px;
          }
          
          .report-meta {
            font-size: 14px;
            color: #64748b;
            display: flex;
            justify-content: center;
            gap: 30px;
            margin-top: 15px;
          }
          
          .academic-year {
            position: absolute;
            top: 10px;
            right: 0;
            background: #f0fdfa;
            padding: 8px 16px;
            border-radius: 20px;
            font-size: 12px;
            font-weight: 600;
            color: #000000;
            border: 1px solid #000000;
          }
          
          .section {
            margin-bottom: 35px;
            page-break-inside: avoid;
          }
          
          .section-header {
            display: flex;
            align-items: center;
            gap: 10px;
            margin-bottom: 20px;
            padding-bottom: 10px;
            border-bottom: 2px solid #e2e8f0;
          }
          
          .section-icon {
            width: 24px;
            height: 24px;
            background: #14b8a6;
            border-radius: 6px;
            display: flex;
            align-items: center;
            justify-content: center;
            color: white;
            font-size: 12px;
          }
          
          .section-title {
            font-size: 18px;
            font-weight: 600;
            color: #1e293b;
          }
          
          .student-info-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
            gap: 20px;
            margin-bottom: 30px;
          }
          
          .info-card {
            background: #f8fafc;
            border: 1px solid #e2e8f0;
            border-radius: 12px;
            padding: 16px;
            position: relative;
            overflow: hidden;
          }
          
          .info-card::before {
            content: '';
            position: absolute;
            top: 0;
            left: 0;
            width: 4px;
            height: 100%;
            background: #6b7280;
          }
          
          .info-label {
            font-size: 12px;
            font-weight: 500;
            color: #64748b;
            text-transform: uppercase;
            letter-spacing: 0.5px;
            margin-bottom: 4px;
          }
          
          .info-value {
            font-size: 16px;
            font-weight: 600;
            color: #1e293b;
          }
          
          .stats-grid {
            display: grid;
            grid-template-columns: repeat(4, 1fr);
            gap: 20px;
            margin-bottom: 35px;
          }
          
          .stat-card {
            background: white;
            border: 1px solid #e2e8f0;
            border-radius: 12px;
            padding: 20px;
            text-align: center;
            box-shadow: 0 2px 4px rgba(0, 0, 0, 0.02);
            position: relative;
            overflow: hidden;
          }
          
          .stat-card::before {
            content: '';
            position: absolute;
            top: 0;
            left: 0;
            right: 0;
            height: 3px;
            background: linear-gradient(90deg, #14b8a6, #06b6d4);
          }
          
          .stat-number {
            font-size: 28px;
            font-weight: 700;
            color: #0f766e;
            margin-bottom: 4px;
          }
          
          .stat-label {
            font-size: 12px;
            color: #64748b;
            font-weight: 500;
            text-transform: uppercase;
            letter-spacing: 0.5px;
          }
          
          .professional-table {
            width: 100%;
            border-collapse: collapse;
            margin-bottom: 30px;
            background: white;
            border-radius: 8px;
            overflow: hidden;
            box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
          }
          
          .professional-table thead {
            background: linear-gradient(135deg, #0f766e, #14b8a6);
          }
          
          .professional-table th {
            color: white;
            font-weight: 600;
            font-size: 12px;
            text-transform: uppercase;
            letter-spacing: 0.5px;
            padding: 16px 12px;
            text-align: left;
            border: none;
          }
          
          .professional-table td {
            padding: 14px 12px;
            border-bottom: 1px solid #f1f5f9;
            font-size: 13px;
            vertical-align: top;
          }
          
          .professional-table tbody tr:hover {
            background: #f8fafc;
          }
          
          .professional-table tbody tr:last-child td {
            border-bottom: none;
          }
          
          .status-badge {
            display: inline-block;
            padding: 4px 10px;
            border-radius: 20px;
            font-size: 11px;
            font-weight: 600;
            text-transform: uppercase;
            letter-spacing: 0.5px;
          }
          
          .status-completed {
            background: #dcfce7;
            color: #166534;
            border: 1px solid #bbf7d0;
          }
          
          .status-missed {
            background: #fee2e2;
            color: #991b1b;
            border: 1px solid #fecaca;
          }
          
          .status-pending {
            background: #fef3c7;
            color: #92400e;
            border: 1px solid #fde68a;
          }
          
          .score-excellent { color: #059669; font-weight: 600; }
          .score-good { color: #0891b2; font-weight: 600; }
          .score-average { color: #d97706; font-weight: 600; }
          .score-poor { color: #dc2626; font-weight: 600; }
          
          .document-footer {
            margin-top: 50px;
            padding-top: 20px;
            border-top: 1px solid #e2e8f0;
            text-align: center;
            font-size: 12px;
            color: #64748b;
          }
          
          .footer-logo {
            margin-bottom: 10px;
          }
          
          .confidential-notice {
            background: #fef2f2;
            border: 1px solid #fecaca;
            border-radius: 8px;
            padding: 12px;
            margin: 20px 0;
            font-size: 11px;
            color: #991b1b;
            text-align: center;
          }
          
          @media print {
            body { margin: 0; padding: 15px; }
            .section { page-break-inside: avoid; }
            .stats-grid { page-break-inside: avoid; }
            .professional-table { page-break-inside: avoid; }
          }
        </style>
      </head>
      <body>
        <div class="watermark">EXAMINA UNIVERSITY</div>
        
        <div class="document-header">
          <div class="academic-year">Academic Year 2024-2025</div>
          <div class="university-logo">
             <img src="/imgs/university.png" alt="Examina University"/>
          </div>
          <div class="university-name">National Institute Of Business Management</div>
          <div class="university-subtitle">Powering Great Minds</div>
          <div class="report-title">Student Examination Report</div>
          <div class="report-meta">
            <span>Generated: ${new Date().toLocaleDateString('en-GB', { 
              day: '2-digit', 
              month: 'long', 
              year: 'numeric' 
            })}</span>
            <span>Report ID: ER-${studentDetails.studentId}-${new Date().getFullYear()}</span>
          </div>
        </div>
        
        <div class="section">
          <div class="section-header">
            <div class="section-icon">👤</div>
            <div class="section-title">Student Information</div>
          </div>
          <div class="student-info-grid">
            <div class="info-card">
              <div class="info-label">Full Name</div>
              <div class="info-value">${studentDetails.name}</div>
            </div>
            <div class="info-card">
              <div class="info-label">Student ID</div>
              <div class="info-value">${studentDetails.studentId}</div>
            </div>
            <div class="info-card">
              <div class="info-label">Faculty</div>
              <div class="info-value">${studentDetails.faculty}</div>
            </div>
            <div class="info-card">
              <div class="info-label">Course of Study</div>
              <div class="info-value">${studentDetails.course}</div>
            </div>
            <div class="info-card">
              <div class="info-label">Academic Batch</div>
              <div class="info-value">${studentDetails.batch}</div>
            </div>
            <div class="info-card">
              <div class="info-label">Enrollment Date</div>
              <div class="info-value">${new Date(studentDetails.enrollmentDate).toLocaleDateString()}</div>
            </div>
          </div>
        </div>

        <div class="section">
          <div class="section-header">
            <div class="section-icon">📊</div>
            <div class="section-title">Performance Summary</div>
          </div>
          <div class="stats-grid">
            <div class="stat-card">
              <div class="stat-number">${completedExams.length}</div>
              <div class="stat-label">Completed Exams</div>
            </div>
            <div class="stat-card">
              <div class="stat-number">${missedExams.length}</div>
              <div class="stat-label">Missed Exams</div>
            </div>
            <div class="stat-card">
              <div class="stat-number">${averageScore.toFixed(1)}%</div>
              <div class="stat-label">Average Score</div>
            </div>
            <div class="stat-card">
              <div class="stat-number">${pendingExams.length}</div>
              <div class="stat-label">Pending Exams</div>
            </div>
          </div>
        </div>

        <div class="section">
          <div class="section-header">
            <div class="section-icon">📋</div>
            <div class="section-title">Complete Examination Record</div>
          </div>
          <table class="professional-table">
            <thead>
              <tr>
                <th>Examination</th>
                <th>Faculty</th>
                <th>Course</th>
                <th>Module</th>
                <th>Date</th>
                <th>Status</th>
                <th>Score</th>
                <th>Class Rank</th>
              </tr>
            </thead>
            <tbody>
              ${examReports.map(exam => `
                <tr>
                  <td style="font-weight: 500;">${exam.examName}</td>
                  <td style="color: #64748b;">Faculty of Engineering</td>
                  <td style="color: #64748b;">${exam.courseName}</td>
                  <td>${exam.moduleName}</td>
                  <td>${new Date(exam.examDate).toLocaleDateString('en-GB')}</td>
                  <td>
                    <span class="status-badge status-${exam.status}">
                      ${exam.status}
                    </span>
                  </td>
                  <td>
                    ${exam.score ? 
                      `<span class="${
                        exam.percentage! >= 85 ? 'score-excellent' : 
                        exam.percentage! >= 75 ? 'score-good' : 
                        exam.percentage! >= 60 ? 'score-average' : 'score-poor'
                      }">
                        ${exam.score}/${exam.totalMarks} (${exam.percentage}%)
                      </span>` : 
                      '<span style="color: #94a3b8;">—</span>'
                    }
                  </td>
                  <td>${exam.rank ? `${exam.rank} of ${exam.totalParticipants}` : '<span style="color: #94a3b8;">—</span>'}</td>
                </tr>
              `).join('')}
            </tbody>
          </table>
        </div>

        ${completedExams.length > 0 ? `
          <div class="section">
            <div class="section-header">
              <div class="section-icon">🟢</div>
              <div class="section-title">Completed Examinations - Detailed Analysis</div>
            </div>
            <table class="professional-table">
              <thead>
                <tr>
                  <th>Examination</th>
                  <th>Faculty</th>
                  <th>Course</th>
                  <th>Module</th>
                  <th>Date</th>
                  <th>Score Achieved</th>
                  <th>Duration</th>
                  <th>Class Position</th>
                  <th>Submitted At</th>
                </tr>
              </thead>
              <tbody>
                ${completedExams.map(exam => `
                  <tr>
                    <td style="font-weight: 500;">${exam.examName}</td>
                    <td style="color: #64748b;">Faculty of Engineering</td>
                    <td style="color: #64748b;">${exam.courseName}</td>
                    <td>${exam.moduleName}</td>
                    <td>${new Date(exam.examDate).toLocaleDateString('en-GB')}</td>
                    <td>
                      <span class="${
                        exam.percentage! >= 85 ? 'score-excellent' : 
                        exam.percentage! >= 75 ? 'score-good' : 
                        exam.percentage! >= 60 ? 'score-average' : 'score-poor'
                      }">
                        ${exam.score}/${exam.totalMarks} (${exam.percentage}%)
                      </span>
                    </td>
                    <td>${exam.timeSpent}</td>
                    <td style="font-weight: 500;">${exam.rank} of ${exam.totalParticipants}</td>
                    <td>${exam.submissionTime}</td>
                  </tr>
                `).join('')}
              </tbody>
            </table>
          </div>
        ` : ''}

        ${missedExams.length > 0 ? `
          <div class="section">
            <div class="section-header">
              <div class="section-icon">🚫</div>
              <div class="section-title">Missed Examinations</div>
            </div>
            <table class="professional-table">
              <thead>
                <tr>
                  <th>Examination</th>
                  <th>Faculty</th>
                  <th>Course</th>
                  <th>Module</th>
                  <th>Scheduled Date</th>
                  <th>Time Slot</th>
                  <th>Maximum Marks</th>
                </tr>
              </thead>
              <tbody>
                ${missedExams.map(exam => `
                  <tr>
                    <td style="font-weight: 500;">${exam.examName}</td>
                    <td style="color: #64748b;">Faculty of Engineering</td>
                    <td style="color: #64748b;">${exam.courseName}</td>
                    <td>${exam.moduleName}</td>
                    <td>${new Date(exam.examDate).toLocaleDateString('en-GB')}</td>
                    <td>${exam.startTime} - ${exam.endTime}</td>
                    <td>${exam.totalMarks} marks</td>
                  </tr>
                `).join('')}
              </tbody>
            </table>
          </div>
        ` : ''}

        ${pendingExams.length > 0 ? `
          <div class="section">
            <div class="section-header">
              <div class="section-icon">⏳</div>
              <div class="section-title">Upcoming Examinations</div>
            </div>
            <table class="professional-table">
              <thead>
                <tr>
                  <th>Examination</th>
                  <th>Faculty</th>
                  <th>Course</th>
                  <th>Module</th>
                  <th>Scheduled Date</th>
                  <th>Time Slot</th>
                  <th>Maximum Marks</th>
                </tr>
              </thead>
              <tbody>
                ${pendingExams.map(exam => `
                  <tr>
                    <td style="font-weight: 500;">${exam.examName}</td>
                    <td style="color: #64748b;">Faculty of Engineering</td>
                    <td style="color: #64748b;">${exam.courseName}</td>
                    <td>${exam.moduleName}</td>
                    <td>${new Date(exam.examDate).toLocaleDateString('en-GB')}</td>
                    <td>${exam.startTime} - ${exam.endTime}</td>
                    <td>${exam.totalMarks} marks</td>
                  </tr>
                `).join('')}
              </tbody>
            </table>
          </div>
        ` : ''}

        <div class="confidential-notice">
          <strong>CONFIDENTIAL DOCUMENT</strong> - This report contains sensitive academic information and should be handled accordingly. 
          Unauthorized distribution is strictly prohibited.
        </div>

        <div class="document-footer">
          <div class="footer-logo">
            <strong>National Institute of Business Management</strong> | THE CITY UNIVERSITY
          </div>
          <div>
            📧 programes@nibm.lk | 📞 +94 117 321 000 | 🌐 www.nibm.lk
          </div>
          <div style="margin-top: 8px; font-size: 10px;">
            This is an electronically generated document and is valid without signature.
          </div>
        </div>

        <script>
          window.onload = function() {
            setTimeout(() => {
              window.print();
              setTimeout(() => {
                window.close();
              }, 500);
            }, 1000);
          }
        </script>
      </body>
    </html>
  `;
};
