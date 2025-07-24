import PDFDocument from "pdfkit";
import path from "path";

export async function generateParticipantPDF(
  participantData: any
): Promise<Buffer> {
  return new Promise((resolve, reject) => {
    try {
      const doc = new PDFDocument({
        margins: { top: 50, bottom: 50, left: 50, right: 50 },
      });
      const chunks: Buffer[] = [];

      // Collect the PDF data chunks
      doc.on("data", (chunk) => chunks.push(chunk));
      doc.on("end", () => resolve(Buffer.concat(chunks)));

      // Maroon curved header background (60% width)
      doc
        .path("M 0,0 L 367,0 L 367,0 Q 367,80 327,80 L 0,80 Z")
        .fill("#4A0404");

      // Add IBIEA logo in top right
      doc.image(
        path.join(process.cwd(), "public/assets/ibiea-logo.jpg"),
        doc.page.width - 150,
        20,
        {
          fit: [100, 50],
        }
      );

      // Main title
      doc
        .moveDown(5)
        .fontSize(24)
        .font("Helvetica-Bold")
        .fillColor("#002B5B")
        .text("IBIEA 2025 - Participant Information & Invitation", {
          align: "center",
        });

      // Verification code box
      doc
        .moveDown(2)
        .fontSize(14)
        .font("Helvetica-Bold")
        .text("Verification Code: " + participantData.verificationCode, {
          align: "center",
        });

      doc
        .fontSize(12)
        .font("Helvetica")
        .text("This code is unique and mandatory for event check-in.", {
          align: "center",
        })
        .moveDown(2);

      // Welcome text
      doc
        .fontSize(12)
        .text(`Dear ${participantData.fullName},`)
        .moveDown()
        .text(
          "We are delighted to confirm your participation in the International Business & Innovation Excellence Awards (IBIEA) 2025. Please find your registration and event details below:"
        )
        .moveDown(2);

      // Event Details section
      doc
        .moveDown()
        .fontSize(14)
        .font("Helvetica-Bold")
        .text("Event Details:")
        .moveDown();

      doc
        .fontSize(12)
        .font("Helvetica-Bold")
        .text("Date: ", {
          continued: true,
        })
        .font("Helvetica")
        .text("29th May 2025")
        .moveDown(0.5);

      doc
        .font("Helvetica-Bold")
        .text("Venue: ", {
          continued: true,
        })
        .font("Helvetica")
        .text("Grand Hyatt Hotel, Muscat")
        .moveDown(0.5);

      doc
        .font("Helvetica-Bold")
        .text("Registration Time: ", {
          continued: true,
        })
        .font("Helvetica")
        .text("8:00 AM – 3:30 PM")
        .moveDown(2);

        doc
        .font("Helvetica-Bold")
        .text("Event Timing: ", {
          continued: true,
        })
        .font("Helvetica")
        .text("4:00 PM Onwards")
        .moveDown(2);

      // Important Notes section
      doc
        .fontSize(14)
        .font("Helvetica-Bold")
        .text("Important Notes:")
        .moveDown();

      const notes = [
        "Please keep this document safe and bring it with you to the event.",
        "You must present the verification code at the registration desk during check-in.",
        "This code is non-transferable and valid only for the registered participant.",
        "For assistance or further queries, feel free to contact us at: info@IBIEA.com",
      ];

      notes.forEach((note) => {
        doc.fontSize(12).font("Helvetica").text(`• ${note}`).moveDown(0.5);
      });

      // Add Xclusive Oman logo
      doc.image(
        path.join(process.cwd(), "public/assets/traveon.png"),
        doc.page.width - 120,
        doc.page.height - 65,
        {
          fit: [150, 50],
        }
      );

      // Draw maroon background for footer
      doc
        .rect(0, doc.page.height - 30, doc.page.width, 30)
        .fill("#4A0404");

      // Finalize the PDF
      doc.end();
    } catch (error) {
      reject(error);
    }
  });
}
export async function generateBookingPDF(bookingData: any): Promise<Buffer> {
  return new Promise((resolve, reject) => {
    try {
      const doc = new PDFDocument({
        margins: { top: 20, bottom: 20, left: 20, right: 20 },
        size: 'A4'
      });
      const chunks: Buffer[] = [];

      // Collect the PDF data chunks
      doc.on("data", (chunk) => chunks.push(chunk));
      doc.on("end", () => resolve(Buffer.concat(chunks)));

      // Add header with logos
      const publicPath = path.join(process.cwd(), "public");
      doc.image(
        path.join(publicPath, "assets/ibiea-logo.jpg"),
        50,
        20,
        { fit: [180, 90] }
      );
      doc.image(
        path.join(publicPath, "assets/traveon.png"),
        doc.page.width - 230,
        20,
        { fit: [180, 90] }
      );

      // Add title section with gray background
      doc
        .moveDown(2)
        .rect(50, doc.y, doc.page.width - 100, 40)
        .fill("#dfdfdfe9");
      
      doc
        .fontSize(28)
        .font("Helvetica-Bold")
        .fillColor("#000000")
        .text("Booking ", 50, doc.y - 30, { continued: true })
        .fillColor("#FF0000")
        .text("Confirmation", { continued: false });

      doc
        .fontSize(12)
        .font("Helvetica")
        .fillColor("#000000")
        .text("Please present either an electronic or paper copy of your booking confirmation upon check-in.", {
          align: "center"
        });

      // Add horizontal line
      doc
        .moveDown()
        .moveTo(50, doc.y)
        .lineTo(doc.page.width - 50, doc.y)
        .stroke();

      // Add booking details in two columns
      doc.moveDown();
      const startX = 50;
      const columnWidth = (doc.page.width - 100) / 2;

      // Left column
      const leftColumnData = [
        { label: "Booking ID", value: bookingData.bookingId || "N/A" },
        { label: "Booking Reference No", value: bookingData.bookingRef || "N/A" },
        { label: "Client", value: bookingData.clientName || "N/A" },
        { label: "Member ID", value: bookingData.memberId || "N/A" },
        { label: "Country of Residence", value: bookingData.country || "N/A" },
        { label: "Property", value: bookingData.property || "N/A" },
        { label: "Address", value: bookingData.address || "N/A" },
        { label: "Property Contact Number", value: bookingData.propertyContact || "N/A" }
      ];

      // Right column
      const rightColumnData = [
        { label: "Number of Rooms", value: bookingData.numRooms || "N/A" },
        { label: "Number of Extra Beds", value: bookingData.numExtraBeds || "N/A" },
        { label: "Number of Adults", value: bookingData.numAdults || "N/A" },
        { label: "Number of Children", value: bookingData.numChildren || "N/A" },
        { label: "Room Type", value: bookingData.roomType || "N/A" },
        { label: "Promotion", value: bookingData.promotion || "N/A" }
      ];

      // Draw the columns
      doc.fontSize(12);
      leftColumnData.forEach((item, index) => {
        doc
          .font("Helvetica-Bold")
          .text(`${item.label}:`, startX, doc.y, { continued: true })
          .font("Helvetica")
          .text(` ${item.value}`);
      });

      // Move to right column
      doc.y = startX;
      rightColumnData.forEach((item, index) => {
        doc
          .font("Helvetica-Bold")
          .text(`${item.label}:`, startX + columnWidth, doc.y, { continued: true })
          .font("Helvetica")
          .text(` ${item.value}`);
      });

      // Add special offers section
      doc
        .moveDown(2)
        .rect(50, doc.y, doc.page.width - 100, 40)
        .fill("#f5f5f5");
      
      doc
        .font("Helvetica-Bold")
        .text("Traveon Special Offers", 60, doc.y - 30)
        .font("Helvetica")
        .text(bookingData.specialOffers || "No special offers available", 60, doc.y);

      // Add arrival/departure section
      doc
        .moveDown(2)
        .rect(50, doc.y, doc.page.width - 100, 60)
        .stroke();

      const arrivalDepartureY = doc.y - 50;
      doc
        .font("Helvetica-Bold")
        .text("Arrival:", 60, arrivalDepartureY, { continued: true })
        .font("Helvetica")
        .text(` ${bookingData.arrival || "N/A"}`);

      doc
        .font("Helvetica-Bold")
        .text("Departure:", 60, arrivalDepartureY + 20, { continued: true })
        .font("Helvetica")
        .text(` ${bookingData.departure || "N/A"}`);

      // Add signature
      doc.image(
        path.join(publicPath, "assets/sign.png"),
        doc.page.width - 200,
        arrivalDepartureY,
        { fit: [180, 50] }
      );

      // Add remarks section
      doc
        .moveDown(2)
        .rect(50, doc.y, doc.page.width - 100, 80)
        .stroke();

      doc
        .font("Helvetica-Bold")
        .text("Remarks:", 60, doc.y - 70)
        .font("Helvetica")
        .text(`Included: Taxes and fees ${bookingData.taxesAndFees || "N/A"}`, 60, doc.y - 50)
        .text("NonSmoke, LargeBed", 60, doc.y - 30)
        .text(bookingData.remarks || "No additional remarks", 60, doc.y - 10);

      // Add notes section
      doc
        .moveDown(2)
        .rect(50, doc.y, doc.page.width - 100, 100)
        .stroke();

      doc
        .font("Helvetica-Bold")
        .text("Notes:", 60, doc.y - 90);

      const notes = [
        "IMPORTANT: Please ensure you have valid identification documents for check-in. The name on the booking must match the ID presented.",
        "Check-in time is from 2:00 PM onwards. Early check-in is subject to availability and may incur additional charges.",
        "Check-out time is until 12:00 PM. Late check-out requests should be made in advance and may be subject to additional charges.",
        "All rates are subject to change without prior notice. Special requests are not guaranteed and are subject to availability upon arrival."
      ];

      notes.forEach((note, index) => {
        doc
          .font("Helvetica")
          .text(`• ${note}`, 60, doc.y - 70 + (index * 20));
      });

      // Add footer
      doc
        .moveDown(2)
        .rect(50, doc.y, doc.page.width - 100, 60)
        .stroke();

      doc
        .fontSize(10)
        .font("Helvetica")
        .text("Call our Customer Service Center 24/7:", 60, doc.y - 50, { align: "center" })
        .text("Customer Support: +1 (800) 123-4567", 60, doc.y - 30, { align: "center" })
        .text("Email: support@traveon.com", 60, doc.y - 10, { align: "center" })
        .text("(Long distance charge may apply)", 60, doc.y + 10, { align: "center" });

      // Finalize the PDF
      doc.end();
    } catch (error) {
      reject(error);
    }
  });
}
