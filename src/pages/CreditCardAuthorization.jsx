import React from "react";
import LegalLayout, { LegalSection } from "@/components/LegalLayout";

export default function CreditCardAuthorization() {
  return (
    <LegalLayout
      title="CREDIT CARD AUTHORIZATION"
      lastUpdated="Last updated: August 22, 2026"
    >
      <LegalSection number={1} title="Authorization to Charge">
        <p>
          By providing a payment card to TRAVLR Vacation Homes, Guest (&quot;Cardholder&quot;)
          authorizes TRAVLR to charge the card identified in the booking confirmation or on file
          for the authorized amounts described in this Authorization. This includes the
          reservation total, any authorized pre-arrival or concierge charges, and any
          post-stay charges for documented damages, additional fees, or unpaid balances
          arising from the stay.
        </p>
      </LegalSection>

      <LegalSection number={2} title="Reservation & Incidental Charges">
        <p>
          Cardholder authorizes TRAVLR to charge the reservation total, including nightly
          rate, taxes, cleaning, and service fees, at the time of confirmation or on the date(s)
          stated in the booking confirmation. Cardholder further authorizes TRAVLR to charge
          for any additional services requested before or during the stay, including grocery
          stocking, chef services, equipment rentals, and extra housekeeping, at the rates
          communicated by TRAVLR.
        </p>
      </LegalSection>

      <LegalSection number={3} title="Security Hold & Damages">
        <p>
          TRAVLR may place a temporary authorization hold on the card for a reasonable security
          amount, which will be released if no damage or extra charges are incurred. In the
          event of damage to the Property or its contents, missing items, excessive cleaning,
          or a violation of house rules resulting in extra cost, Cardholder authorizes TRAVLR
          to charge the documented amount to the card on file within thirty (30) days of
          check-out. TRAVLR will provide an itemized statement for any post-stay charge.
        </p>
      </LegalSection>

      <LegalSection number={4} title="Card Accuracy & Disputes">
        <p>
          Cardholder represents that the card information provided is accurate, that the
          Cardholder is authorized to use the card, and that sufficient funds or credit are
          available. If a charge is declined, TRAVLR may cancel the reservation or seek
          alternative payment. Cardholder agrees to contact TRAVLR directly regarding any
          disputed charge before initiating a chargeback with the card issuer.
        </p>
      </LegalSection>

      <LegalSection number={5} title="Payment Processor">
        <p>
          Card information is processed through TRAVLR&apos;s payment processor. TRAVLR does
          not store full card numbers on its own systems. Cardholder&apos;s use of the payment
          processor is subject to that processor&apos;s terms and privacy policy.
        </p>
      </LegalSection>

      <LegalSection number={6} title="Currency & Receipts">
        <p>
          All charges are billed in U.S. dollars. A receipt or itemized statement will be
          provided for each charge upon request. For stays at Properties outside the United
          States, foreign-transaction fees imposed by the card issuer are the
          Cardholder&apos;s responsibility.
        </p>
      </LegalSection>

      <LegalSection number={7} title="Contact Information">
        <p>For questions about this Authorization, please contact us:</p>
        <ul className="list-none space-y-1">
          <li>Email: <a href="mailto:info@staytrvlr.com" className="text-[#b89968] hover:underline">info@staytrvlr.com</a></li>
          <li>Phone: <a href="tel:+19495398862" className="text-[#b89968] hover:underline">(949) 539-8862</a></li>
        </ul>
      </LegalSection>
    </LegalLayout>
  );
}