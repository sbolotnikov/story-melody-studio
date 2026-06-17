import { jsPDF } from "jspdf";

interface InvoiceProduct {
  name?: string;
  price?: string | number;
  quantity?: string | number;
  discount?: string | number;
}

interface InvoiceData {
  id?: string | number;
  productsJson?: string;
  discount?: string | number;
  paidDate?: string;
}

interface OrderData {
  id?: string | number;
  hero?: string;
  occasion?: string;
  projectType?: string;
  email?: string;
  date?: string;
  paid?: boolean;
}

export function generateInvoicePDF(order: OrderData, invoice: InvoiceData) {
  const doc = new jsPDF({
    orientation: "portrait",
    unit: "mm",
    format: "a4"
  });

  let products: InvoiceProduct[] = [];
  try {
    products = JSON.parse(invoice.productsJson || "[]") as InvoiceProduct[];
  } catch (e) {
    console.error("Failed to parse invoice json", e);
  }

  const parseAmount = (value: string | number | undefined, fallback = 0) =>
    typeof value === "number" ? value : parseFloat(String(value ?? fallback));
  const parseQuantity = (value: string | number | undefined, fallback = 1) =>
    typeof value === "number" ? value : parseInt(String(value ?? fallback), 10);

  const generalDiscount = parseAmount(invoice.discount);
  const subtotal = products.reduce(
    (sum, item) => sum + (parseAmount(item.price) * parseQuantity(item.quantity)),
    0
  );
  const itemDiscounts = products.reduce((sum, item) => sum + parseAmount(item.discount), 0);
  const totalDiscounts = itemDiscounts + generalDiscount;
  const grandTotal = Math.max(0, subtotal - totalDiscounts);

  // Styling and colors
  doc.setFillColor(18, 18, 18); // Dark brand background header
  doc.rect(0, 0, 210, 48, "F");

  // Logo text
  doc.setFont("helvetica", "bold");
  doc.setFontSize(22);
  doc.setTextColor(197, 160, 89); // Brand gold color #C5A059
  doc.text("STORY MELODY STUDIO", 20, 22);

  // Subtitle
  doc.setFont("helvetica", "normal");
  doc.setFontSize(10);
  doc.setTextColor(180, 180, 180);
  doc.text("Personalized Songs, Music Videos & Fine Art Portraits", 20, 28);
  doc.text("Email: support@storymelody.com | Web: www.storymelody.com", 20, 34);

  // Invoice label
  doc.setFont("helvetica", "bold");
  doc.setFontSize(14);
  doc.setTextColor(197, 160, 89);
  doc.text("INVOICE STATEMENT", 140, 22);

  doc.setFont("helvetica", "normal");
  doc.setFontSize(9);
  doc.setTextColor(180, 180, 180);
  doc.text(`Invoice Ref: SM-INV-${invoice.id || order.id || "N/A"}`, 140, 28);
  doc.text(`Date Issued: ${new Date().toLocaleDateString()}`, 140, 34);

  // Paid badge
  if (invoice.paidDate || order.paid) {
    doc.setFillColor(34, 197, 94); // bg-green-500
    doc.rect(140, 38, 26, 6, "F");
    doc.setFont("helvetica", "bold");
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(8);
    doc.text("PAID RECEIPT", 143, 42);
  } else {
    doc.setFillColor(239, 68, 68); // bg-red-500
    doc.rect(140, 38, 22, 6, "F");
    doc.setFont("helvetica", "bold");
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(8);
    doc.text("UNPAID", 145, 42);
  }

  // Billed To Info Table
  doc.setFont("helvetica", "bold");
  doc.setFontSize(11);
  doc.setTextColor(40, 40, 40);
  doc.text("CLIENT / PROJECT DETAILS", 20, 60);

  doc.setDrawColor(220, 220, 220);
  doc.line(20, 63, 190, 63);

  doc.setFont("helvetica", "normal");
  doc.setFontSize(9.5);
  doc.setTextColor(80, 80, 80);
  
  let billedY = 69;
  doc.setFont("helvetica", "bold");
  doc.text("Client Name / Hero:", 20, billedY);
  doc.setFont("helvetica", "normal");
  doc.text(String(order.hero || "Valued Customer"), 62, billedY);

  billedY += 6;
  doc.setFont("helvetica", "bold");
  doc.text("Occasion / Milestone:", 20, billedY);
  doc.setFont("helvetica", "normal");
  doc.text(String(order.occasion || "Personalized Presentation"), 62, billedY);

  billedY += 6;
  doc.setFont("helvetica", "bold");
  doc.text("Milestone Deliverable:", 20, billedY);
  doc.setFont("helvetica", "normal");
  doc.text(String(order.projectType || "Custom Package"), 62, billedY);

  billedY += 6;
  doc.setFont("helvetica", "bold");
  doc.text("Email Recipient:", 20, billedY);
  doc.setFont("helvetica", "normal");
  doc.text(String(order.email || "N/A"), 62, billedY);

  billedY += 6;
  doc.setFont("helvetica", "bold");
  doc.text("Target Delivery Date:", 20, billedY);
  doc.setFont("helvetica", "normal");
  doc.text(String(order.date || "TBD"), 62, billedY);

  // Items Table
  let tableY = 112;
  doc.setFillColor(245, 245, 245);
  doc.rect(20, tableY, 170, 8, "F");

  doc.setFont("helvetica", "bold");
  doc.setFontSize(9);
  doc.setTextColor(40, 40, 40);
  doc.text("Item / Milestone Deliverable", 22, tableY + 5.5);
  doc.text("Qty", 108, tableY + 5.5);
  doc.text("Price", 125, tableY + 5.5);
  doc.text("Discount", 148, tableY + 5.5);
  doc.text("Total", 175, tableY + 5.5);

  doc.setFont("helvetica", "normal");
  doc.setTextColor(80, 80, 80);

  products.forEach((p) => {
    tableY += 10;
    // Draw boundary row line
    doc.setDrawColor(240, 240, 240);
    doc.line(20, tableY, 190, tableY);

    const unitPrice = parseAmount(p.price);
    const qty = parseQuantity(p.quantity);
    const disc = parseAmount(p.discount);
    const itemTotal = (unitPrice * qty) - disc;

    doc.text(String(p.name || "Custom Creative Element"), 22, tableY + 6);
    doc.text(String(qty), 110, tableY + 6);
    doc.text(`$${unitPrice.toFixed(2)}`, 126, tableY + 6);
    doc.text(`$${disc.toFixed(2)}`, 149, tableY + 6);
    doc.text(`$${itemTotal.toFixed(2)}`, 176, tableY + 6);
  });

  // Totals Breakdown
  tableY += 15;
  doc.setDrawColor(200, 200, 200);
  doc.line(20, tableY, 190, tableY);

  tableY += 8;
  doc.setFont("helvetica", "normal");
  doc.setFontSize(9.5);
  doc.text("Subtotal:", 130, tableY);
  doc.text(`$${subtotal.toFixed(2)}`, 175, tableY);

  if (totalDiscounts > 0) {
    tableY += 6;
    doc.text("Discounts Applied:", 130, tableY);
    doc.text(`-$${totalDiscounts.toFixed(2)}`, 175, tableY);
  }

  tableY += 8;
  doc.setFont("helvetica", "bold");
  doc.setFontSize(12);
  doc.setTextColor(197, 160, 89);
  doc.text("Statement Balance:", 130, tableY);
  doc.text(`$${grandTotal.toFixed(2)}`, 175, tableY);

  // Terms and Footer
  tableY += 28;
  doc.setFont("helvetica", "bold");
  doc.setFontSize(9);
  doc.setTextColor(40, 40, 40);
  doc.text("TERMS AND PRODUCTION DIRECTION", 20, tableY);
  
  doc.setDrawColor(220, 220, 220);
  doc.line(20, tableY + 2, 190, tableY + 2);

  doc.setFont("helvetica", "normal");
  doc.setFontSize(8.5);
  doc.setTextColor(100, 100, 100);
  doc.text("1. All creative elements are crafted specifically based on user questionnaire details.", 20, tableY + 8);
  doc.text("2. Production and recording phases commence immediately upon receipt of statement payment.", 20, tableY + 13);
  doc.text("3. Revisions are subject to the specific bundle selected beforehand.", 20, tableY + 18);

  doc.setFont("helvetica", "italic");
  doc.setFontSize(9.5);
  doc.setTextColor(197, 160, 89);
  doc.text("Thank you for partnering with Story Melody Studio! Your life is our soundtrack.", 48, tableY + 32);

  return doc;
}
