"use client";

import React from "react";
import { useParams, notFound } from "next/navigation";
import { getFooterPageBySlug } from "@/lib/data/footerPagesData";
import { PublicFeaturePageView } from "@/components/layout/PublicFeaturePageView";

export default function AdicionalDetalhePage() {
  const params = useParams<{ slug: string }>();
  const slug = Array.isArray(params?.slug) ? params.slug[0] : params?.slug;
  const page = slug ? getFooterPageBySlug("adicionais", slug) : undefined;

  if (!page) {
    notFound();
  }

  return <PublicFeaturePageView page={page} />;
}
