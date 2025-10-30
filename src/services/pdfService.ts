import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { Report } from '../types';

// Extend jsPDF type to include autoTable
declare module 'jspdf' {
  interface jsPDF {
    autoTable: typeof autoTable;
  }
}

/**
 * Generates a professional PDF report for skin analysis
 */
export const generatePDFReport = async (report: Report): Promise<void> => {
  const doc = new jsPDF('p', 'mm', 'a4');
  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  let yPosition = 20;

  // Helper function to add a new page if needed
  const checkPageBreak = (requiredSpace: number) => {
    if (yPosition + requiredSpace > pageHeight - 20) {
      doc.addPage();
      yPosition = 20;
      return true;
    }
    return false;
  };

  // ===============================
  // HEADER WITH BRANDING
  // ===============================
  doc.setFillColor(20, 184, 166); // Teal color
  doc.rect(0, 0, pageWidth, 40, 'F');
  
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(28);
  doc.setFont('helvetica', 'bold');
  doc.text('KarmaTerra', pageWidth / 2, 18, { align: 'center' });
  
  doc.setFontSize(14);
  doc.setFont('helvetica', 'normal');
  doc.text('Skin Analysis Report', pageWidth / 2, 28, { align: 'center' });
  
  yPosition = 50;

  // ===============================
  // USER INFORMATION
  // ===============================
  doc.setTextColor(0, 0, 0);
  doc.setFontSize(12);
  doc.setFont('helvetica', 'bold');
  doc.text('Patient Information', 15, yPosition);
  yPosition += 8;

  doc.setFontSize(10);
  doc.setFont('helvetica', 'normal');
  doc.text(`Name: ${report.userData.name}`, 15, yPosition);
  yPosition += 6;
  doc.text(`Age: ${report.userData.age} years`, 15, yPosition);
  doc.text(`Gender: ${report.userData.gender}`, 100, yPosition);
  yPosition += 6;
  doc.text(`Location: ${report.userData.city}, ${report.userData.state}, ${report.userData.country}`, 15, yPosition);
  yPosition += 6;
  doc.text(`Report Date: ${report.date}`, 15, yPosition);
  yPosition += 12;

  // ===============================
  // OVERALL ASSESSMENT
  // ===============================
  checkPageBreak(40);
  
  doc.setFillColor(240, 240, 240);
  doc.rect(15, yPosition - 5, pageWidth - 30, 35, 'F');
  
  doc.setFontSize(14);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(20, 184, 166);
  doc.text('Overall Assessment', 20, yPosition);
  yPosition += 8;

  // Severity Badge
  const severity = report.result.overallSeverity;
  let severityColor: [number, number, number] = [34, 197, 94]; // Green
  if (severity === 'Medium') severityColor = [251, 146, 60]; // Orange
  if (severity === 'Severe') severityColor = [239, 68, 68]; // Red
  
  doc.setFillColor(...severityColor);
  doc.roundedRect(20, yPosition - 3, 30, 8, 2, 2, 'F');
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(10);
  doc.setFont('helvetica', 'bold');
  doc.text(severity, 35, yPosition + 3, { align: 'center' });
  
  yPosition += 10;
  doc.setTextColor(0, 0, 0);
  doc.setFontSize(10);
  doc.setFont('helvetica', 'normal');
  
  // Summary text with word wrap
  const summaryLines = doc.splitTextToSize(report.result.summary, pageWidth - 50);
  doc.text(summaryLines, 20, yPosition);
  yPosition += summaryLines.length * 5 + 10;

  // ===============================
  // OVERALL ADVICE
  // ===============================
  checkPageBreak(30);
  
  doc.setFontSize(12);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(20, 184, 166);
  doc.text('Key Recommendations', 15, yPosition);
  yPosition += 8;

  doc.setTextColor(0, 0, 0);
  doc.setFontSize(10);
  doc.setFont('helvetica', 'normal');
  const adviceLines = doc.splitTextToSize(report.result.overallAdvice, pageWidth - 40);
  doc.text(adviceLines, 20, yPosition);
  yPosition += adviceLines.length * 5 + 12;

  // ===============================
  // DETAILED PARAMETER ANALYSIS
  // ===============================
  checkPageBreak(50);
  
  doc.setFontSize(14);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(20, 184, 166);
  doc.text('Detailed Skin Parameter Analysis', 15, yPosition);
  yPosition += 10;

  // Prepare table data
  const tableData = report.result.parameters.map((param: any) => {
    const ratingColor = param.rating <= 3 ? '🟢' : param.rating <= 6 ? '🟡' : param.rating <= 8 ? '🟠' : '🔴';
    return [
      param.parameter,
      `${ratingColor} ${param.rating}/10`,
      param.severity || 'N/A',
      param.diagnosis.substring(0, 100) + (param.diagnosis.length > 100 ? '...' : '')
    ];
  });

  autoTable(doc, {
    startY: yPosition,
    head: [['Parameter', 'Rating', 'Severity', 'Diagnosis']],
    body: tableData,
    theme: 'grid',
    headStyles: {
      fillColor: [20, 184, 166],
      textColor: [255, 255, 255],
      fontSize: 10,
      fontStyle: 'bold',
      halign: 'center'
    },
    bodyStyles: {
      fontSize: 9,
      textColor: [0, 0, 0]
    },
    columnStyles: {
      0: { cellWidth: 35, fontStyle: 'bold' },
      1: { cellWidth: 25, halign: 'center' },
      2: { cellWidth: 25, halign: 'center' },
      3: { cellWidth: 'auto' }
    },
    margin: { left: 15, right: 15 },
    didDrawPage: (data) => {
      // Add footer to each page
      doc.setFontSize(8);
      doc.setTextColor(150);
      doc.text(
        'KarmaTerra Skin Analysis Report - Confidential',
        pageWidth / 2,
        pageHeight - 10,
        { align: 'center' }
      );
    }
  });

  yPosition = (doc as any).lastAutoTable.finalY + 15;

  // ===============================
  // RECOMMENDATIONS FOR EACH PARAMETER
  // ===============================
  if (yPosition + 50 > pageHeight - 20) {
    doc.addPage();
    yPosition = 20;
  }

  doc.setFontSize(14);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(20, 184, 166);
  doc.text('Personalized Recommendations', 15, yPosition);
  yPosition += 10;

  report.result.parameters.forEach((param: any, index: number) => {
    checkPageBreak(30);
    
    doc.setFontSize(11);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(0, 0, 0);
    doc.text(`${index + 1}. ${param.parameter}`, 20, yPosition);
    yPosition += 6;

    doc.setFontSize(9);
    doc.setFont('helvetica', 'normal');
    const recLines = doc.splitTextToSize(param.recommendation, pageWidth - 50);
    doc.text(recLines, 25, yPosition);
    yPosition += recLines.length * 4 + 6;
  });

  // ===============================
  // LIFESTYLE INFORMATION
  // ===============================
  checkPageBreak(50);
  
  doc.setFontSize(14);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(20, 184, 166);
  doc.text('Lifestyle Profile', 15, yPosition);
  yPosition += 10;

  const lifestyleData = [
    ['Profession', report.userData.profession],
    ['Working Hours', report.userData.workingTime],
    ['Smoking Status', report.userData.smoking],
    ['Water Quality', report.userData.waterQuality],
    ['AC Usage', report.userData.acUsage]
  ];

  autoTable(doc, {
    startY: yPosition,
    body: lifestyleData,
    theme: 'striped',
    styles: {
      fontSize: 10
    },
    columnStyles: {
      0: { cellWidth: 60, fontStyle: 'bold', fillColor: [245, 245, 245] },
      1: { cellWidth: 'auto' }
    },
    margin: { left: 15, right: 15 }
  });

  yPosition = (doc as any).lastAutoTable.finalY + 15;

  // ===============================
  // DAILY ROUTINE
  // ===============================
  if (yPosition + 80 > pageHeight - 20) {
    doc.addPage();
    yPosition = 20;
  }

  doc.setFontSize(14);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(20, 184, 166);
  doc.text('Recommended Daily Routine', 15, yPosition);
  yPosition += 10;

  // Morning Routine
  doc.setFontSize(12);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(251, 146, 60); // Orange
  doc.text('☀️ Morning Routine', 20, yPosition);
  yPosition += 8;

  doc.setFontSize(10);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(0, 0, 0);
  report.result.routine.morning.forEach((step: string, index: number) => {
    checkPageBreak(8);
    doc.text(`${index + 1}. ${step}`, 25, yPosition);
    yPosition += 6;
  });
  yPosition += 6;

  // Evening Routine
  checkPageBreak(30);
  doc.setFontSize(12);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(99, 102, 241); // Indigo
  doc.text('🌙 Evening Routine', 20, yPosition);
  yPosition += 8;

  doc.setFontSize(10);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(0, 0, 0);
  report.result.routine.evening.forEach((step: string, index: number) => {
    checkPageBreak(8);
    doc.text(`${index + 1}. ${step}`, 25, yPosition);
    yPosition += 6;
  });

  // ===============================
  // DISCLAIMER & FOOTER
  // ===============================
  if (yPosition + 40 > pageHeight - 20) {
    doc.addPage();
    yPosition = 20;
  } else {
    yPosition += 10;
  }

  doc.setFillColor(255, 243, 205); // Light yellow
  doc.rect(15, yPosition - 5, pageWidth - 30, 30, 'F');
  
  doc.setFontSize(9);
  doc.setFont('helvetica', 'italic');
  doc.setTextColor(120, 53, 15); // Brown
  const disclaimer = 'Disclaimer: This report is generated by AI-powered skin analysis and is intended for informational purposes only. It should not be considered as medical advice. Please consult with a qualified dermatologist or healthcare professional for proper diagnosis and treatment.';
  const disclaimerLines = doc.splitTextToSize(disclaimer, pageWidth - 40);
  doc.text(disclaimerLines, 20, yPosition);

  // ===============================
  // FINAL FOOTER
  // ===============================
  doc.setFillColor(20, 184, 166);
  doc.rect(0, pageHeight - 15, pageWidth, 15, 'F');
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(8);
  doc.setFont('helvetica', 'normal');
  doc.text('Generated by KarmaTerra | www.karmaterra.com', pageWidth / 2, pageHeight - 7, { align: 'center' });

  // ===============================
  // SAVE PDF
  // ===============================
  const fileName = `KarmaTerra_Skin_Analysis_${report.userData.name.replace(/\s+/g, '_')}_${report.date.replace(/\//g, '-')}.pdf`;
  doc.save(fileName);
};

