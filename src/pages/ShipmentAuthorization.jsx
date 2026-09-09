import React from "react";
import LegalLayout, { LegalSection } from "@/components/LegalLayout";

export default function ShipmentAuthorization() {
  return (
    <LegalLayout
      title="SHIPMENT AUTHORIZATION"
      lastUpdated="Last updated: August 22, 2026"
    >
      <LegalSection number={1} title="Purpose & Scope">
        <p>
          This Shipment Authorization (&quot;Authorization&quot;) authorizes TRAVLR Vacation
          Homes and its authorized delivery partners to deliver, place, and (where applicable)
          retrieve items on behalf of Guest in connection with a stay at a TRAVLR-managed
          Property. This includes pre-arrival grocery stocking, package and mail deliveries,
          rental equipment (e.g., ski, bike, or baby gear), and any other shipment arranged or
          approved by TRAVLR for Guest&apos;s stay.
        </p>
      </LegalSection>

      <LegalSection number={2} title="Delivery Access">
        <p>
          Guest authorizes TRAVLR and its delivery partners to enter the Property, including via
          lockbox, smart-lock code, or key provided for the stay, in order to place shipments
          inside the Property, a secure entry area, or a designated outdoor location. Guest
          acknowledges that delivery windows are estimates and that TRAVLR is not liable for
          delays caused by carriers, access limitations, or third parties.
        </p>
      </LegalSection>

      <LegalSection number={3} title="Perishables & Storage">
        <p>
          For grocery and perishable orders, Guest authorizes TRAVLR to place items in the
          Property&apos;s refrigerator and pantry. Guest acknowledges that TRAVLR is not liable
          for spoilage, temperature sensitivity, or expiration of items left at the Property
          where the Property&apos;s appliances are operating normally. Any temperature-sensitive
          item requiring freezer storage will be placed in the freezer only where one is
          available and the request is specified in advance.
        </p>
      </LegalSection>

      <LegalSection number={4} title="Accuracy of Orders">
        <p>
          Guest is responsible for providing complete and accurate order instructions. TRAVLR
          will use reasonable efforts to fulfill orders as specified but is not liable for
          out-of-stock substitutions made by retailers, carrier mishandling, or items damaged
          in transit by third parties. Where a substitution is necessary, TRAVLR will select a
          comparable item and notify Guest.
        </p>
      </LegalSection>

      <LegalSection number={5} title="Payment for Shipments">
        <p>
          The cost of all approved shipments, including the item cost, taxes, delivery fees,
          and any reasonable service fee charged by TRAVLR, will be charged to the payment
          method Guest has on file with TRAVLR or as agreed in the booking confirmation. Guest
          authorizes TRAVLR to charge such amounts upon order placement or upon delivery.
        </p>
      </LegalSection>

      <LegalSection number={6} title="Retrieval & Return">
        <p>
          For rental equipment and similar items, Guest authorizes TRAVLR or its partners to
          retrieve the items from the Property at or after check-out. Guest agrees to leave
          rental items in the agreed location and in reasonable condition; missing or damaged
          rental items may be charged to the payment method on file at documented replacement
          cost.
        </p>
      </LegalSection>

      <LegalSection number={7} title="Liability">
        <p>
          To the fullest extent permitted by law, TRAVLR is not liable for loss of, or damage
          to, personal items shipped to the Property or left at the Property after check-out.
          Guest is encouraged to use trackable, insured shipping for any valuable items sent to
          the Property.
        </p>
      </LegalSection>

      <LegalSection number={8} title="Contact Information">
        <p>For questions about this Authorization, please contact us:</p>
        <ul className="list-none space-y-1">
          <li>Email: <a href="mailto:info@staytrvlr.com" className="text-[#b89968] hover:underline">info@staytrvlr.com</a></li>
          <li>Phone: <a href="tel:+19495398862" className="text-[#b89968] hover:underline">(949) 539-8862</a></li>
        </ul>
      </LegalSection>
    </LegalLayout>
  );
}