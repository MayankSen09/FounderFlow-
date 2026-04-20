import { jsPDF } from 'jspdf';

export function generatePlaybookPDF(playbookTitle: string, playbookContent: any) {
    const doc = new jsPDF();
    let yPos = 20;
    const pageWidth = doc.internal.pageSize.getWidth();
    const margin = 20;
    const maxWidth = pageWidth - (margin * 2);

    // Helper function to add text with word wrap
    const addText = (text: string, fontSize: number, isBold: boolean = false, color: string = '#000000') => {
        doc.setFontSize(fontSize);
        doc.setFont('helvetica', isBold ? 'bold' : 'normal');
        doc.setTextColor(color);
        const lines = doc.splitTextToSize(text, maxWidth);
        lines.forEach((line: string) => {
            if (yPos > doc.internal.pageSize.getHeight() - 20) {
                doc.addPage();
                yPos = 20;
            }
            doc.text(line, margin, yPos);
            yPos += fontSize * 0.5;
        });
        yPos += 5;
    };

    // Helper for section headers
    const addSection = (title: string, color: string = '#06b6d4') => {
        yPos += 10;
        doc.setFillColor(color);
        doc.rect(margin, yPos - 5, 5, 8, 'F');
        addText(title, 14, true, color);
    };

    // Title
    addText(playbookContent.title || playbookTitle, 20, true, '#0891b2');
    yPos += 5;

    // Purpose
    if (playbookContent.purpose) {
        addSection('PURPOSE');
        addText(playbookContent.purpose, 11);
    }

    // Scope
    if (playbookContent.scope) {
        addSection('SCOPE');
        addText(playbookContent.scope, 10);
    }

    // Audience
    if (playbookContent.audience) {
        addSection('AUDIENCE');
        addText(playbookContent.audience, 10);
    }

    // Steps/Procedures
    if (playbookContent.steps && playbookContent.steps.length > 0) {
        addSection('PROCEDURES', '#10b981');
        playbookContent.steps.forEach((step: string, idx: number) => {
            const cleanStep = step.replace(/^STEP \d+:\s*/i, '');
            addText(`${idx + 1}. ${cleanStep}`, 10);
            yPos += 3;
        });
    }

    // Responsible Parties
    if (playbookContent.responsibleParties && playbookContent.responsibleParties.length > 0) {
        addSection('RESPONSIBLE PARTIES', '#a855f7');
        playbookContent.responsibleParties.forEach((party: any) => {
            addText(party.role, 11, true);
            if (party.responsibilities) {
                party.responsibilities.forEach((resp: string) => {
                    addText(`• ${resp}`, 9);
                });
            }
            if (party.authority) {
                addText(`Authority: ${party.authority}`, 9, false, '#059669');
            }
            yPos += 5;
        });
    }

    // Tools Required
    if (playbookContent.toolsRequired && playbookContent.toolsRequired.length > 0) {
        addSection('TOOLS & RESOURCES', '#3b82f6');
        playbookContent.toolsRequired.forEach((tool: any) => {
            addText(`${tool.name}`, 10, true);
            addText(tool.purpose, 9);
            addText(`Access: ${tool.accessLevel}`, 9, false, '#3b82f6');
            yPos += 3;
        });
    }

    // KPIs
    if (playbookContent.kpis && playbookContent.kpis.length > 0) {
        addSection('KEY PERFORMANCE INDICATORS', '#10b981');
        playbookContent.kpis.forEach((kpi: any) => {
            addText(`${kpi.metric}: ${kpi.target}`, 10, true, '#059669');
            addText(kpi.measurement, 9);
            yPos += 3;
        });
    }

    // Compliance
    if (playbookContent.compliance && playbookContent.compliance.length > 0) {
        addSection('COMPLIANCE REQUIREMENTS', '#f59e0b');
        playbookContent.compliance.forEach((item: string) => {
            addText(`• ${item}`, 9);
        });
    }

    // Common Errors
    if (playbookContent.commonErrors && playbookContent.commonErrors.length > 0) {
        addSection('COMMON ERRORS & PREVENTION', '#ef4444');
        playbookContent.commonErrors.forEach((error: any) => {
            addText(error.error, 10, true, '#dc2626');
            addText(`Consequences: ${error.consequences}`, 9);
            addText(`Prevention: ${error.prevention}`, 9);
            addText(`Resolution: ${error.resolution}`, 9);
            yPos += 5;
        });
    }

    // Quality Checks
    if (playbookContent.qualityChecks && playbookContent.qualityChecks.length > 0) {
        addSection('QUALITY CHECKS');
        playbookContent.qualityChecks.forEach((check: string) => {
            addText(`✓ ${check}`, 9);
        });
    }

    // Related Documents
    if (playbookContent.relatedDocuments && playbookContent.relatedDocuments.length > 0) {
        addSection('RELATED DOCUMENTS');
        playbookContent.relatedDocuments.forEach((document: string) => {
            addText(`→ ${document}`, 9);
        });
    }

    // Revision History
    if (playbookContent.revisionHistory) {
        addSection('REVISION HISTORY', '#64748b');
        addText(`Version: ${playbookContent.revisionHistory.version}`, 9);
        addText(`Date: ${playbookContent.revisionHistory.date}`, 9);
        addText(`Author: ${playbookContent.revisionHistory.author}`, 9);
        addText(`Changes: ${playbookContent.revisionHistory.changes}`, 9);
    }

    // Footer on last page
    const pageCount = doc.internal.pages.length - 1;
    doc.setFontSize(8);
    doc.setTextColor('#94a3b8');
    doc.text(`Page ${pageCount} | Generated by Playbook System`, margin, doc.internal.pageSize.getHeight() - 10);

    return doc;
}
