export default function ProfilePage() {
  return (
    <div className="w-full flex-1 overflow-y-auto rounded-3xl border border-[#334155] bg-black p-3 sm:p-5">
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-4">
        <header className="rounded-2xl border border-[#334155] bg-black p-4">
          <p className="text-xs font-medium tracking-[0.08em] text-neutral-400">Account</p>
          <h1 className="text-xl font-semibold text-white sm:text-2xl">Profile</h1>
        </header>

        <section className="grid gap-4 lg:grid-cols-[280px_1fr]">
          <article className="rounded-2xl border border-[#334155] bg-black p-5">
            <div className="mx-auto grid h-24 w-24 place-items-center rounded-full border border-[#334155] bg-black text-3xl font-bold text-white">
              PA
            </div>
            <h2 className="mt-4 text-center text-xl font-semibold text-white">Pablo Alcolea</h2>
            <p className="text-center text-sm text-neutral-400">Long-term investor</p>
            <div className="mt-5 space-y-2">
              <p className="rounded-xl border border-[#334155] bg-black px-3 py-2 text-sm text-neutral-300">Plan: Pro</p>
              <p className="rounded-xl border border-[#334155] bg-black px-3 py-2 text-sm text-neutral-300">Region: Spain</p>
              <p className="rounded-xl border border-[#334155] bg-black px-3 py-2 text-sm text-neutral-300">Timezone: Europe/Madrid</p>
            </div>
          </article>

          <div className="space-y-4">
            <section className="rounded-2xl border border-[#334155] bg-black p-5">
              <h3 className="text-lg font-semibold text-white">Personal Information</h3>
              <div className="mt-4 grid gap-3 sm:grid-cols-2">
                <label className="flex flex-col gap-1 text-sm text-neutral-300">
                  Full Name
                  <input
                    defaultValue="Pablo Alcolea"
                    className="rounded-xl border border-[#334155] bg-black px-3 py-2 text-white"
                  />
                </label>
                <label className="flex flex-col gap-1 text-sm text-neutral-300">
                  Username
                  <input
                    defaultValue="pablo.invest"
                    className="rounded-xl border border-[#334155] bg-black px-3 py-2 text-white"
                  />
                </label>
                <label className="sm:col-span-2 flex flex-col gap-1 text-sm text-neutral-300">
                  Email
                  <input
                    defaultValue="pablo@email.com"
                    className="rounded-xl border border-[#334155] bg-black px-3 py-2 text-white"
                  />
                </label>
              </div>
              <button
                type="button"
                className="mt-4 rounded-xl border border-[#14b8a6]/30 bg-[#14b8a6]/10 px-4 py-2 text-sm font-semibold text-[#2dd4bf]"
              >
                Save Profile
              </button>
            </section>

            <section className="rounded-2xl border border-[#334155] bg-black p-5">
              <h3 className="text-lg font-semibold text-white">Security</h3>
              <div className="mt-4 space-y-2">
                <button
                  type="button"
                  className="flex w-full items-center justify-between rounded-xl border border-[#334155] bg-black px-4 py-3 text-left"
                >
                  <span className="text-sm text-neutral-300">Change Password</span>
                  <span className="text-xs text-neutral-400">Updated 12 days ago</span>
                </button>
                <button
                  type="button"
                  className="flex w-full items-center justify-between rounded-xl border border-[#334155] bg-black px-4 py-3 text-left"
                >
                  <span className="text-sm text-neutral-300">Two-factor Authentication</span>
                  <span className="text-xs text-[#2dd4bf]">Enabled</span>
                </button>
                <button
                  type="button"
                  className="flex w-full items-center justify-between rounded-xl border border-[#334155] bg-black px-4 py-3 text-left"
                >
                  <span className="text-sm text-neutral-300">Active Sessions</span>
                  <span className="text-xs text-neutral-400">2 devices</span>
                </button>
              </div>
            </section>

            <section className="rounded-2xl border border-[#334155] bg-black p-5">
              <h3 className="text-lg font-semibold text-white">Preferences</h3>
              <div className="mt-4 grid gap-3 sm:grid-cols-2">
                <label className="flex flex-col gap-1 text-sm text-neutral-300">
                  Language
                  <select className="rounded-xl border border-[#334155] bg-black px-3 py-2 text-white" defaultValue="en">
                    <option value="en">English</option>
                    <option value="es">Spanish</option>
                  </select>
                </label>
                <label className="flex flex-col gap-1 text-sm text-neutral-300">
                  Default Currency
                  <select className="rounded-xl border border-[#334155] bg-black px-3 py-2 text-white" defaultValue="EUR">
                    <option value="EUR">EUR</option>
                    <option value="USD">USD</option>
                  </select>
                </label>
              </div>
            </section>
          </div>
        </section>
      </div>
    </div>
  );
}
