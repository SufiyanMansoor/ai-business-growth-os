import { Router } from 'express';
import PDFDocument from 'pdfkit';

const router = Router();

router.post('/generate', async (req, res) => {
  const { type, campaignId } = req.body;

  if (type === 'pdf') {
    const doc = new PDFDocument();
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', 'attachment; filename=report.pdf');
    doc.pipe(res);

    doc.fontSize(24).text('AI Business Growth OS', { align: 'center' });
    doc.moveDown();
    doc.fontSize(16).text(`${type} Report`, { align: 'center' });
    doc.moveDown(2);
    doc.fontSize(12).text(`Generated: ${new Date().toLocaleDateString()}`);
    if (campaignId) doc.text(`Campaign ID: ${campaignId}`);
    doc.moveDown();
    doc.text('Campaign Performance Summary');
    doc.text('Total Revenue: $15,800');
    doc.text('ROI: 351%');
    doc.text('Leads Generated: 520');
    doc.text('Engagement Rate: 6.2%');
    doc.end();
  } else {
    res.json({
      type,
      generatedAt: new Date().toISOString(),
      data: {
        revenue: 15800,
        roi: 351,
        leads: 520,
        engagement: 6.2,
      },
    });
  }
});

export default router;
