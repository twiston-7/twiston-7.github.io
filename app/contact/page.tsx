import type { Metadata } from "next";

import ContactPageClient from "@components/pages/contact-page";

export const metadata: Metadata = {
  title: "Contact",
};


export default function ContactPage() {
  return <ContactPageClient />;
}

