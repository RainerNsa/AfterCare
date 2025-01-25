import jsPDF from 'jspdf'
import type { TrackerData, SymptomEntry, TodoItem } from '../types'

interface PDFExportOptions {
  patientName?: string
  procedureType?: string
  doctorName?: string
  hospitalName?: string
}

export const exportTrackerToPDF = async (
  trackerData: TrackerData,
  options: PDFExportOptions = {}
): Promise<void> => {
  const pdf = new jsPDF()
  const pageWidth = pdf.internal.pageSize.getWidth()
  const pageHeight = pdf.internal.pageSize.getHeight()
  const margin = 20
  let yPosition = margin

  // Helper function to add text with word wrapping
  const addText = (text: string, fontSize: number = 12, isBold: boolean = false) => {
    pdf.setFontSize(fontSize)
    pdf.setFont('helvetica', isBold ? 'bold' : 'normal')
    
    const lines = pdf.splitTextToSize(text, pageWidth - 2 * margin)
    
    // Check if we need a new page
    if (yPosition + (lines.length * fontSize * 0.5) > pageHeight - margin) {
      pdf.addPage()
      yPosition = margin
    }
    
    pdf.text(lines, margin, yPosition)
    yPosition += lines.length * fontSize * 0.5 + 5
  }

  // Helper function to add a section header
  const addSectionHeader = (title: string) => {
    yPosition += 10
    pdf.setFillColor(59, 130, 246) // Blue background
    pdf.rect(margin, yPosition - 8, pageWidth - 2 * margin, 16, 'F')
    
    pdf.setTextColor(255, 255, 255) // White text
    pdf.setFontSize(14)
    pdf.setFont('helvetica', 'bold')
    pdf.text(title, margin + 5, yPosition)
    
    pdf.setTextColor(0, 0, 0) // Reset to black
    yPosition += 20
  }

  // Header
  pdf.setFillColor(37, 99, 235) // Darker blue
  pdf.rect(0, 0, pageWidth, 40, 'F')
  
  pdf.setTextColor(255, 255, 255)
  pdf.setFontSize(20)
  pdf.setFont('helvetica', 'bold')
  pdf.text('AfterCare Recovery Journal', margin, 25)
  
  pdf.setFontSize(12)
  pdf.setFont('helvetica', 'normal')
  pdf.text(`Generated on ${new Date().toLocaleDateString()}`, pageWidth - margin - 60, 25)
  
  pdf.setTextColor(0, 0, 0)
  yPosition = 60

  // Patient Information
  if (options.patientName || options.procedureType || options.doctorName || options.hospitalName) {
    addSectionHeader('Patient Information')
    
    if (options.patientName) addText(`Patient: ${options.patientName}`)
    if (options.procedureType) addText(`Procedure: ${options.procedureType}`)
    if (options.doctorName) addText(`Doctor: ${options.doctorName}`)
    if (options.hospitalName) addText(`Hospital: ${options.hospitalName}`)
  }

  // Recovery Progress Summary
  const completedTodos = trackerData.todos.filter(todo => todo.completed).length
  const totalTodos = trackerData.todos.length
  const progressPercentage = totalTodos > 0 ? Math.round((completedTodos / totalTodos) * 100) : 0

  addSectionHeader('Recovery Progress Summary')
  addText(`Progress: ${completedTodos}/${totalTodos} tasks completed (${progressPercentage}%)`, 12, true)
  addText(`Last Updated: ${trackerData.lastUpdated.toLocaleDateString()}`)

  // Daily Care Tasks
  addSectionHeader('Daily Care Tasks')
  
  trackerData.todos.forEach((todo: TodoItem, index: number) => {
    const status = todo.completed ? '✓' : '○'
    const statusText = todo.completed ? 'Completed' : 'Pending'
    const completedDate = todo.completed && todo.timestamp 
      ? ` (${new Date(todo.timestamp).toLocaleDateString()})`
      : ''
    
    addText(`${status} ${todo.text} - ${statusText}${completedDate}`)
  })

  // Symptoms Log
  if (trackerData.symptoms.length > 0) {
    addSectionHeader('Symptoms & Observations')
    
    // Sort symptoms by date (newest first)
    const sortedSymptoms = [...trackerData.symptoms].sort(
      (a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
    )
    
    sortedSymptoms.forEach((symptom: SymptomEntry) => {
      const date = new Date(symptom.timestamp).toLocaleDateString()
      const time = new Date(symptom.timestamp).toLocaleTimeString([], { 
        hour: '2-digit', 
        minute: '2-digit' 
      })
      
      addText(`${date} at ${time}`, 11, true)
      addText(`Symptom: ${symptom.symptom}`)
      addText(`Severity: ${symptom.severity.charAt(0).toUpperCase() + symptom.severity.slice(1)}`)
      
      if (symptom.notes) {
        addText(`Notes: ${symptom.notes}`)
      }
      
      yPosition += 5 // Extra spacing between entries
    })
  } else {
    addSectionHeader('Symptoms & Observations')
    addText('No symptoms recorded yet.')
  }

  // Personal Notes
  if (trackerData.notes && trackerData.notes.trim()) {
    addSectionHeader('Personal Notes')
    addText(trackerData.notes)
  }

  // Recovery Tips Footer
  yPosition += 20
  if (yPosition > pageHeight - 80) {
    pdf.addPage()
    yPosition = margin
  }

  pdf.setFillColor(248, 250, 252) // Light gray background
  pdf.rect(margin, yPosition, pageWidth - 2 * margin, 60, 'F')
  
  pdf.setTextColor(75, 85, 99)
  pdf.setFontSize(10)
  pdf.setFont('helvetica', 'bold')
  pdf.text('Recovery Reminders:', margin + 5, yPosition + 15)
  
  pdf.setFont('helvetica', 'normal')
  const tips = [
    '• Follow your prescribed medication schedule',
    '• Contact your healthcare provider if you experience warning signs',
    '• Attend all follow-up appointments',
    '• Stay hydrated and maintain a healthy diet'
  ]
  
  tips.forEach((tip, index) => {
    pdf.text(tip, margin + 5, yPosition + 25 + (index * 8))
  })

  // Footer
  pdf.setFontSize(8)
  pdf.setTextColor(107, 114, 128)
  pdf.text(
    'This document was generated by AfterCare Recovery Platform. Share with your healthcare team.',
    margin,
    pageHeight - 10
  )

  // Save the PDF
  const fileName = `aftercare-journal-${new Date().toISOString().split('T')[0]}.pdf`
  pdf.save(fileName)
}

// Export function for enhanced localStorage data
export const exportEnhancedJournalToPDF = async (
  trackerData: TrackerData,
  progressData: {
    progress: number
    totalTasks: number
    completedTasks: number
  },
  options: PDFExportOptions = {}
): Promise<void> => {
  // Enhanced version with progress visualization
  await exportTrackerToPDF(trackerData, {
    ...options,
    procedureType: options.procedureType || 'Myomectomy Recovery'
  })
}
