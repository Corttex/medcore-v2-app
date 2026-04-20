import React from "react";

export default function DashboardLoading() {
  return (
    <div className="space-y-6 animate-pulse p-2">
      {/* Upper Stats Row Skeleton */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="h-32 rounded-2xl bg-surface-container/20 border border-outline-variant/10 shadow-sm" />
        ))}
      </div>

      {/* Main Content Areas Skeleton */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        {/* Left/Main Column */}
        <div className="xl:col-span-2 space-y-6">
          <div className="h-[400px] rounded-2xl bg-surface-container/20 border border-outline-variant/10" />
          <div className="h-[300px] rounded-2xl bg-surface-container/20 border border-outline-variant/10" />
        </div>

        {/* Right Sidebar/Panel */}
        <div className="space-y-6">
          <div className="h-[180px] rounded-2xl bg-surface-container/20 border border-outline-variant/10" />
          <div className="h-[520px] rounded-2xl bg-surface-container/20 border border-outline-variant/10" />
        </div>
      </div>
    </div>
  );
}
