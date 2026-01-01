
import { GeneratedScript, SeoData } from "../types";

declare const jspdf: any;
declare const docx: any;

export const exportToPdf = (script: GeneratedScript, seo: SeoData) => {
  const { jsPDF } = jspdf;
  const doc = new jsPDF();
  let y = 20;

  // Title
  doc.setFontSize(22);
  doc.text(script.title, 20, y);
  y += 15;

  doc.setFontSize(12);
  doc.text(`Durée estimée : ${script.estimatedTotalDuration}`, 20, y);
  y += 10;
  doc.text(`Ton : ${script.tone}`, 20, y);
  y += 15;

  // Sections
  script.sections.forEach((section, index) => {
    if (y > 270) {
      doc.addPage();
      y = 20;
    }
    doc.setFontSize(14);
    doc.setTextColor(225, 29, 72); // brand-600
    doc.text(`${section.title.toUpperCase()}`, 20, y);
    y += 10;

    doc.setFontSize(11);
    doc.setTextColor(0, 0, 0);
    const splitContent = doc.splitTextToSize(section.content, 170);
    doc.text(splitContent, 20, y);
    y += (splitContent.length * 6) + 5;

    if (section.visualCue) {
      doc.setFontSize(10);
      doc.setTextColor(100, 116, 139); // slate-500
      doc.text(`Visuel : ${section.visualCue}`, 20, y, { italic: true });
      y += 10;
    }
  });

  // SEO
  doc.addPage();
  y = 20;
  doc.setFontSize(18);
  doc.setTextColor(225, 29, 72);
  doc.text("MÉTADONNÉES SEO", 20, y);
  y += 15;

  doc.setFontSize(14);
  doc.setTextColor(0, 0, 0);
  doc.text("Titres suggérés :", 20, y);
  y += 10;
  doc.setFontSize(11);
  seo.optimizedTitles.forEach(t => {
    doc.text(`• ${t}`, 20, y);
    y += 7;
  });

  y += 10;
  doc.setFontSize(14);
  doc.text("Description :", 20, y);
  y += 10;
  doc.setFontSize(10);
  const splitDesc = doc.splitTextToSize(seo.description, 170);
  doc.text(splitDesc, 20, y);

  doc.save(`${script.title.replace(/\s+/g, '_')}_TubeScript.pdf`);
};

export const exportToDocx = async (script: GeneratedScript, seo: SeoData) => {
  const { Document, Packer, Paragraph, TextRun, HeadingLevel } = docx;

  const doc = new Document({
    sections: [
      {
        properties: {},
        children: [
          new Paragraph({ text: script.title, heading: HeadingLevel.HEADING_1 }),
          new Paragraph({ children: [new TextRun({ text: `Durée: ${script.estimatedTotalDuration}`, bold: true })] }),
          new Paragraph({ children: [new TextRun({ text: `Ton: ${script.tone}`, italic: true })] }),
          new Paragraph({ text: "" }),
          ...script.sections.flatMap(s => [
            new Paragraph({ text: s.title.toUpperCase(), heading: HeadingLevel.HEADING_2 }),
            new Paragraph({ text: s.content }),
            new Paragraph({ children: [new TextRun({ text: `Visuel: ${s.visualCue}`, italic: true, color: "666666" })] }),
            new Paragraph({ text: "" }),
          ]),
          new Paragraph({ text: "SEO METADATA", heading: HeadingLevel.HEADING_1 }),
          new Paragraph({ text: "Titres :", heading: HeadingLevel.HEADING_2 }),
          ...seo.optimizedTitles.map(t => new Paragraph({ text: `• ${t}`, bullet: { level: 0 } })),
          new Paragraph({ text: "" }),
          new Paragraph({ text: "Description :", heading: HeadingLevel.HEADING_2 }),
          new Paragraph({ text: seo.description }),
          new Paragraph({ text: "" }),
          new Paragraph({ text: "Tags :", heading: HeadingLevel.HEADING_2 }),
          new Paragraph({ text: seo.tags.join(", ") }),
        ],
      },
    ],
  });

  const blob = await Packer.toBlob(doc);
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = `${script.title.replace(/\s+/g, '_')}_TubeScript.docx`;
  link.click();
  URL.revokeObjectURL(url);
};
