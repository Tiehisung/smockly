// src/components/common/LoadingSpinner.tsx
export function LoadingSpinner({ page }: { page?: boolean }) {
  return (
    <div
      className={
        `flex justify-center items-center py-12 ${page ? " " : "min-h-screen"}`
      }
    >
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
    </div>
  );
}
