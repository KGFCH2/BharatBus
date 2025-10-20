type TicketMeta = {
    id: string;
    from?: string;
    to?: string;
    date?: string;
    name?: string;
    passengers?: number;
    phone?: string;
    userId?: string | null;
};

export async function generateTicketPdf(meta: TicketMeta, qrImgDataUrl?: string) {
    // dynamic import to keep bundle small
    const { jsPDF } = await import('jspdf');

    const doc = new jsPDF({ unit: 'pt', format: 'a4' });
    const pageWidth = doc.internal.pageSize.getWidth();
    const margin = 40;

    // Header
    doc.setFontSize(22);
    doc.setFont('helvetica', 'bold');
    doc.text('BharatBus', margin, 60);

    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');
    doc.text('Ticket Confirmation', margin, 80);

    // Ticket box
    const boxY = 110;
    const boxHeight = 340;
    doc.setDrawColor(200);
    doc.setLineWidth(0.5);
    doc.rect(margin, boxY, pageWidth - margin * 2, boxHeight);

    // Left column: details
    const leftX = margin + 18;
    let y = boxY + 28;
    doc.setFontSize(12);
    doc.setFont('helvetica', 'bold');
    doc.text(`Ticket ID: ${meta.id}`, leftX, y);
    y += 20;

    doc.setFontSize(11);
    doc.setFont('helvetica', 'normal');
    doc.text(`From: ${meta.from || '—'}`, leftX, y);
    y += 18;
    doc.text(`To: ${meta.to || '—'}`, leftX, y);
    y += 18;
    doc.text(`Date: ${meta.date || '—'}`, leftX, y);
    y += 18;
    doc.text(`Passenger: ${meta.name || '—'}`, leftX, y);
    y += 18;
    doc.text(`Seats: ${meta.passengers ?? '—'}`, leftX, y);
    y += 18;
    doc.text(`Phone: ${meta.phone || '—'}`, leftX, y);

    // Right column: QR image and small note
    const qrSize = 120;
    const qrX = pageWidth - margin - qrSize - 18;
    const qrY = boxY + 28;
    if (qrImgDataUrl) {
        try {
            doc.addImage(qrImgDataUrl, 'PNG', qrX, qrY, qrSize, qrSize);
        } catch (e) {
            // If adding image fails, ignore and continue
            // (fallback: no QR image)
            console.warn('Failed to embed QR image in PDF', e);
        }
    }

    // Add a dividing line
    doc.setDrawColor(230);
    doc.setLineWidth(0.5);
    doc.line(margin + 12, boxY + boxHeight - 60, pageWidth - margin - 12, boxY + boxHeight - 60);

    // Important notes area
    doc.setFontSize(10);
    doc.setFont('helvetica', 'italic');
    doc.text('Please carry a valid photo ID during travel. This ticket is valid only for the date and route specified.', leftX, boxY + boxHeight - 36, { maxWidth: pageWidth - margin * 2 - qrSize - 40 });

    // Powered by BharatBus footer
    doc.setFontSize(9);
    doc.setFont('helvetica', 'normal');
    const footerText = 'Powered by BharatBus';
    const textWidth = doc.getTextWidth(footerText);
    doc.text(footerText, pageWidth - margin - textWidth, boxY + boxHeight + 24);

    // Optionally add metadata (not visible)
    doc.setProperties({ title: `Ticket ${meta.id}`, subject: 'BharatBus Ticket' });

    // Return data URI string
    return doc.output('datauristring');
}
