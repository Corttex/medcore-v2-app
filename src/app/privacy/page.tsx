"use client";

import React from "react";
import { getFooterPageBySlug } from "@/lib/data/footerPagesData";
import { PublicFeaturePageView } from "@/components/layout/PublicFeaturePageView";

export default function PrivacyPage() {
  const page = getFooterPageBySlug("institucional", "politica-de-privacidade")!;
  return <PublicFeaturePageView page={page} />;
}
