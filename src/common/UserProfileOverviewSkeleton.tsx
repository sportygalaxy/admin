import { FC } from "react";

const UserProfileOverviewSkeleton: FC = () => {
  return (
    <section className="space-y-6 animate-pulse">
      <div className="overflow-hidden rounded border border-[#EAECF0] bg-white shadow-sm">
        <div className="bg-[#101828] px-6 py-8 lg:px-8">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
            <div className="flex flex-col gap-5 md:flex-row md:items-center">
              <div className="h-28 w-28 rounded-[24px] bg-white/10"></div>
              <div className="space-y-3">
                <div className="w-56 h-10 rounded bg-white/10"></div>
                <div className="w-40 h-4 rounded bg-white/10"></div>
                <div className="flex gap-2">
                  <div className="h-8 rounded-full w-28 bg-white/10"></div>
                  <div className="h-8 rounded-full w-28 bg-white/10"></div>
                  <div className="h-8 rounded-full w-28 bg-white/10"></div>
                </div>
              </div>
            </div>

            <div className="grid gap-3 sm:grid-cols-2 lg:min-w-[320px]">
              <div className="h-24 rounded-2xl bg-white/10"></div>
              <div className="h-24 rounded-2xl bg-white/10"></div>
              <div className="h-24 rounded-2xl bg-white/10 sm:col-span-2"></div>
            </div>
          </div>
        </div>

        <div className="grid gap-6 bg-[#F8FAFC] px-6 py-6 lg:px-8 xl:grid-cols-[1.3fr,1fr]">
          <div className="space-y-6">
            <div className="rounded-[24px] border border-[#EAECF0] bg-white p-6">
              <div className="mb-5 space-y-2">
                <div className="bg-gray-200 rounded h-7 w-44"></div>
                <div className="h-4 bg-gray-100 rounded w-72"></div>
              </div>
              <div className="grid gap-4 md:grid-cols-2">
                {Array.from({ length: 6 }).map((_, index) => (
                  <div
                    key={index}
                    className="h-20 rounded-2xl border border-[#EAECF0] bg-[#FCFCFD]"
                  ></div>
                ))}
              </div>
            </div>

            <div className="rounded-[24px] border border-[#EAECF0] bg-white p-6">
              <div className="mb-5 space-y-2">
                <div className="w-40 bg-gray-200 rounded h-7"></div>
                <div className="w-64 h-4 bg-gray-100 rounded"></div>
              </div>
              <div className="h-32 rounded-2xl border border-[#EAECF0] bg-[#FCFCFD]"></div>
            </div>
          </div>

          <div className="space-y-6">
            {Array.from({ length: 3 }).map((_, index) => (
              <div
                key={index}
                className="rounded-[24px] border border-[#EAECF0] bg-white p-6"
              >
                <div className="mb-5 space-y-2">
                  <div className="bg-gray-200 rounded h-7 w-44"></div>
                  <div className="h-4 bg-gray-100 rounded w-60"></div>
                </div>
                <div className="grid gap-4">
                  {Array.from({ length: 2 }).map((__, nestedIndex) => (
                    <div
                      key={nestedIndex}
                      className="h-20 rounded-2xl border border-[#EAECF0] bg-[#FCFCFD]"
                    ></div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default UserProfileOverviewSkeleton;
