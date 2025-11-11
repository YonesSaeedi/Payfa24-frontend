const NotificationDropdownLoading = () => {

  return (
    <div className="flex flex-col gap-10" dir="rtl">
      <div className="flex flex-col gap-2.5">
        <div className="flex items-center justify-between">
          <div className="skeleton-bg h-4 rounded w-24"></div>
          <div className="skeleton-bg h-4 rounded w-24"></div>
        </div>
        <div className="skeleton-bg h-4 w-10/12 rounded" />
      </div>
      <div className="flex flex-col gap-2.5">
        <div className="flex items-center justify-between">
          <div className="skeleton-bg h-4 rounded w-24"></div>
          <div className="skeleton-bg h-4 rounded w-24"></div>
        </div>
        <div className="skeleton-bg h-4 w-10/12 rounded" />
      </div>
      <div className="flex flex-col gap-2.5">
        <div className="flex items-center justify-between">
          <div className="skeleton-bg h-4 rounded w-24"></div>
          <div className="skeleton-bg h-4 rounded w-24"></div>
        </div>
        <div className="skeleton-bg h-4 w-10/12 rounded" />
      </div>
    </div>
  )
}

export default NotificationDropdownLoading