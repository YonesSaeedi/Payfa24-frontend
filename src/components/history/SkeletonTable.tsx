import React from "react";

const SkeletonTable: React.FC = () => {
  const desktopSkeleton = Array.from({ length: 7 }).map((_, i) => (
    <div
      key={i}
      className="grid grid-cols-6 gap-4 py-4 animate-pulse items-center"
    >
      <div className="flex items-center gap-2">
        <div className="w-10 h-10 rounded-full skeleton-bg"></div>
        <div className="flex flex-col gap-1">
          <div className="h-3 w-20 rounded skeleton-bg"></div>
          <div className="h-2 w-10 rounded skeleton-bg"></div>
        </div>
      </div>
      <div className="h-3 w-16 mx-auto rounded skeleton-bg"></div>
      <div className="h-3 w-14 mx-auto rounded skeleton-bg"></div>
      <div className="h-6 w-20 rounded-full mx-auto skeleton-bg"></div>
      <div className="h-3 w-24 mx-auto rounded skeleton-bg"></div>
      <div className="h-3 w-10 mx-auto rounded skeleton-bg"></div>
    </div>
  ));

  const mobileSkeleton = Array.from({ length: 5 }).map((_, i) => (
    <div key={i} className="border rounded-xl p-4 animate-pulse space-y-2">
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2">
          <div className="w-10 h-10 rounded-full skeleton-bg"></div>
          <div className="flex flex-col gap-1">
            <div className="h-3 w-20 rounded skeleton-bg"></div>
            <div className="h-2 w-10 rounded skeleton-bg"></div>
          </div>
        </div>
        <div className="h-6 w-20 rounded-full skeleton-bg"></div>
      </div>
      <div className="space-y-1">
        <div className="h-3 w-full rounded skeleton-bg"></div>
        <div className="h-3 w-full rounded skeleton-bg"></div>
        <div className="h-3 w-full rounded skeleton-bg"></div>
      </div>
      <div className="h-4 w-1/2 rounded skeleton-bg mt-2 mx-auto"></div>
    </div>
  ));

  return (
    <div>
      <div className="hidden lg:block divide-y divide-gray21">
        {desktopSkeleton}
      </div>
      <div className="block lg:hidden space-y-4 mt-4">{mobileSkeleton}</div>
    </div>
  );
};

export default SkeletonTable;
