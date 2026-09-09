import React from "react";
import LegalLayout, { LegalSection } from "@/components/LegalLayout";

export default function RentalAgreement() {
  return (
    <LegalLayout
      title="RENTAL AGREEMENT"
      lastUpdated="Last updated: August 22, 2026"
    >
      <LegalSection number={1} title="Parties & Property">
        <p>
          This Short-Term Rental Agreement (&quot;Agreement&quot;) is entered into between
          TRAVLR Vacation Homes (&quot;Manager&quot; or &quot;TRAVLR&quot;) and the guest
          who submits a booking inquiry or otherwise occupies a TRAVLR-managed property
          (&quot;Guest&quot;). The property subject to this Agreement (&quot;Property&quot;)
          is the specific vacation rental identified in the booking confirmation or
          inquiry response provided to Guest.
        </p>
      </LegalSection>

      <LegalSection number={2} title="Reservation & Payment">
        <p>
          A reservation is confirmed only when Guest has submitted a booking inquiry and
          TRAVLR has issued a booking confirmation, at which point a deposit or full payment
          may be required to secure the dates. Full payment, including any applicable taxes,
          cleaning, and service fees, is due in accordance with the payment schedule provided
          in the booking confirmation. Until payment is received in full, TRAVLR reserves the
          right to release the held dates.
        </p>
      </LegalSection>

      <LegalSection number={3} title="Check-In & Check-Out">
        <p>
          Standard check-in time is 4:00 PM and standard check-out time is 11:00 AM local time
          unless otherwise stated in the booking confirmation. Early check-in or late check-out
          may be requested but is not guaranteed and may incur an additional fee. Guest agrees
          to leave the Property in the same general condition as found, with all dishes washed,
          trash placed in provided receptacles, and all doors locked upon departure.
        </p>
      </LegalSection>

      <LegalSection number={4} title="Occupancy & Use">
        <p>
          The maximum number of overnight guests is set by the Property&apos;s advertised
          occupancy and may not be exceeded without prior written consent from TRAVLR. The
          Property is for residential vacation use only; no commercial events, parties,
          commercial filming, or subletting are permitted without prior written approval.
          Guest is responsible for the conduct of all individuals on the Property and for any
          damage caused by Guest or any member of the Guest party or their invitees.
        </p>
      </LegalSection>

      <LegalSection number={5} title="House Rules, Pets & Smoking">
        <p>
          Guest agrees to comply with all posted house rules and community rules applicable to
          the Property, including noise and parking restrictions. Pets are permitted only at
          pet-friendly Properties and only when disclosed and approved in advance; unauthorized
          pets may result in forfeiture of the pet deposit and additional cleaning charges.
          Smoking, vaping, and open flames (including candles) are prohibited inside all
          TRAVLR Properties.
        </p>
      </LegalSection>

      <LegalSection number={6} title="Cancellation & Refunds">
        <p>
          Cancellation terms vary by Property and are stated in the booking confirmation. Unless
          a Property-specific policy is provided, the standard policy is: a full refund if the
          reservation is cancelled thirty (30) or more days before check-in; a fifty percent
          (50%) refund if cancelled between twenty-nine (29) and fifteen (15) days before
          check-in; and no refund if cancelled within fourteen (14) days of check-in. TRAVLR
          strongly encourages Guests to purchase travel protection (see Guest Resources).
        </p>
      </LegalSection>

      <LegalSection number={7} title="Damages, Security & Liability">
        <p>
          Guest is responsible for any damage to the Property or its contents caused during the
          stay, normal wear and tear excepted. TRAVLR may charge the payment method on file for
          the documented cost of repair or replacement. Guest agrees to maintain the Property
          secure and to report any maintenance or safety issue to TRAVLR promptly. To the
          fullest extent permitted by law, Guest assumes all risk of personal injury or loss of
          personal property occurring on the Property and TRAVLR shall not be liable for any
          such injury or loss.
        </p>
      </LegalSection>

      <LegalSection number={8} title="Compliance with Laws">
        <p>
          Guest agrees to comply with all applicable laws, ordinances, and short-term rental
          regulations applicable to the Property and its community, including any occupancy-tax
          requirements reflected in the booking total. Guest shall not use the Property for any
          unlawful purpose.
        </p>
      </LegalSection>

      <LegalSection number={9} title="Governing Law & Amendments">
        <p>
          This Agreement is governed by the laws of the state in which the Property is located.
          Any modification to this Agreement must be in writing and signed by an authorized
          representative of TRAVLR. In the event of a conflict between this Agreement and a
          Property-specific addendum provided to Guest, the addendum controls for that Property.
        </p>
      </LegalSection>

      <LegalSection number={10} title="Contact Information">
        <p>For questions about this Agreement, please contact us:</p>
        <ul className="list-none space-y-1">
          <li>Email: <a href="mailto:info@staytrvlr.com" className="text-[#b89968] hover:underline">info@staytrvlr.com</a></li>
          <li>Phone: <a href="tel:+19495398862" className="text-[#b89968] hover:underline">(949) 539-8862</a></li>
        </ul>
      </LegalSection>
    </LegalLayout>
  );
}