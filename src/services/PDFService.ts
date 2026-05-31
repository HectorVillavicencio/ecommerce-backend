import PDFDocument from 'pdfkit';
import path        from 'path';
import fs          from 'fs';

export class PdfService {

  private ensureDir(dir: string) {
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
  }

  async generateOrderPdf(order: any): Promise<string> {
    const dir      = path.join(process.cwd(), 'uploads', 'pdfs');
    this.ensureDir(dir);
    const filename = `orden-${order.id}-${Date.now()}.pdf`;
    const filepath = path.join(dir, filename);

    return new Promise((resolve, reject) => {
      const doc  = new PDFDocument({ margin: 50 });
      const stream = fs.createWriteStream(filepath);
      doc.pipe(stream);

      const profile  = order.user?.profile;
      const fullName = profile ? `${profile.firstName} ${profile.lastName}` : order.user?.email;

      // ── Header ──────────────────────────────────────────
      doc.fontSize(22).font('Helvetica-Bold').text('RECIBO DE COMPRA', { align: 'center' });
      doc.moveDown(0.3);
      doc.fontSize(10).font('Helvetica').fillColor('#666666')
        .text(`Fecha: ${new Date(order.createdAt).toLocaleDateString('es-AR')}`, { align: 'center' })
        .text(`Nro. de Orden: #${String(order.id).padStart(6, '0')}`, { align: 'center' });

      doc.moveDown(0.5);
      doc.moveTo(50, doc.y).lineTo(545, doc.y).strokeColor('#cccccc').stroke();
      doc.moveDown(0.5);

      // ── Datos del cliente ────────────────────────────────
      doc.fontSize(12).font('Helvetica-Bold').fillColor('#000000').text('DATOS DEL CLIENTE');
      doc.moveDown(0.3);
      doc.fontSize(10).font('Helvetica');
      doc.text(`Nombre:  ${fullName}`);
      doc.text(`Email:   ${order.user?.email}`);
      if (profile?.phone)    doc.text(`Teléfono: ${profile.phone}`);
      if (profile?.street) {
        const addr = [profile.street, profile.number, profile.city, profile.province, profile.country]
          .filter(Boolean).join(', ');
        doc.text(`Dirección: ${addr}`);
        if (profile.postalCode) doc.text(`Cod. Postal: ${profile.postalCode}`);
      }

      doc.moveDown(0.5);
      doc.moveTo(50, doc.y).lineTo(545, doc.y).strokeColor('#cccccc').stroke();
      doc.moveDown(0.5);

      // ── Tabla de productos ───────────────────────────────
      doc.fontSize(12).font('Helvetica-Bold').text('DETALLE DE COMPRA');
      doc.moveDown(0.4);

      // Encabezado de tabla
      const col = { prod: 50, qty: 310, price: 380, subtotal: 460 };
      doc.fontSize(9).font('Helvetica-Bold').fillColor('#ffffff');
      doc.rect(50, doc.y, 495, 18).fill('#333333');
      const headerY = doc.y - 14;
      doc.text('PRODUCTO',   col.prod,    headerY, { width: 250 })
         .text('CANT.',      col.qty,     headerY, { width: 60,  align: 'center' })
         .text('PRECIO',     col.price,   headerY, { width: 70,  align: 'right' })
         .text('SUBTOTAL',   col.subtotal,headerY, { width: 80,  align: 'right' });
      doc.moveDown(0.2);

      // Filas de productos
      let rowY = doc.y;
      order.items.forEach((item: any, i: number) => {
        const attrs   = Object.values(item.variantAttrs as Record<string, string>).join(' · ');
        const rowH    = 28;
        const bgColor = i % 2 === 0 ? '#f9f9f9' : '#ffffff';

        doc.rect(50, rowY, 495, rowH).fill(bgColor);
        doc.fontSize(9).font('Helvetica-Bold').fillColor('#000000')
           .text(item.productName, col.prod, rowY + 5, { width: 250 });
        doc.fontSize(8).font('Helvetica').fillColor('#666666')
           .text(attrs, col.prod, rowY + 16, { width: 250 });
        doc.fontSize(9).font('Helvetica').fillColor('#000000')
           .text(item.quantity.toString(), col.qty, rowY + 10, { width: 60, align: 'center' })
           .text(`$${item.price.toLocaleString('es-AR')}`, col.price, rowY + 10, { width: 70, align: 'right' })
           .text(`$${(item.price * item.quantity).toLocaleString('es-AR')}`, col.subtotal, rowY + 10, { width: 80, align: 'right' });

        rowY += rowH;
      });

      doc.y = rowY;
      doc.moveDown(0.3);
      doc.moveTo(50, doc.y).lineTo(545, doc.y).strokeColor('#cccccc').stroke();
      doc.moveDown(0.3);

      // ── Total ────────────────────────────────────────────
      doc.fontSize(14).font('Helvetica-Bold')
         .text(`TOTAL:  $${order.total.toLocaleString('es-AR')}`, { align: 'right' });

      doc.moveDown(1);
      doc.moveTo(50, doc.y).lineTo(545, doc.y).strokeColor('#cccccc').stroke();
      doc.moveDown(0.5);

      // ── Footer ───────────────────────────────────────────
      doc.fontSize(9).font('Helvetica').fillColor('#999999')
         .text('Gracias por tu compra.', { align: 'center' })
         .text('Este recibo es válido como comprobante de compra.', { align: 'center' });

      doc.end();

      stream.on('finish', () => resolve(`/uploads/pdfs/${filename}`));
      stream.on('error',  reject);
    });
  }
}