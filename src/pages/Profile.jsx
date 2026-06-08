import { IndividualLayout } from "../layouts/IndividualLayout";
import { useAuth } from "../contexts/AuthContext";

export function Profile() {
  const { user } = useAuth();

  return (
    <IndividualLayout>
      <div className="max-w-2xl mx-auto px-4 py-10">
        <div className="bg-white rounded-2xl border border-zinc-200 shadow-sm overflow-hidden">
          <div className="bg-gradient-to-r from-blue-600 to-indigo-700 px-6 py-10 text-center">
            <div className="w-20 h-20 rounded-full bg-white/20 flex items-center justify-center mx-auto mb-4">
              <span className="text-3xl font-bold text-white">
                {user?.name?.charAt(0)?.toUpperCase() || "U"}
              </span>
            </div>
            <h1 className="text-xl font-bold text-white">{user?.name}</h1>
            <p className="text-blue-200 text-sm">{user?.email}</p>
          </div>

          <div className="p-6 space-y-6">
            <div>
              <label className="text-xs font-bold text-slate-500 uppercase tracking-wide">
                Nome
              </label>
              <p className="text-slate-800 font-medium mt-1">{user?.name}</p>
            </div>

            <div>
              <label className="text-xs font-bold text-slate-500 uppercase tracking-wide">
                Email
              </label>
              <p className="text-slate-800 font-medium mt-1">{user?.email}</p>
            </div>

            <div>
              <label className="text-xs font-bold text-slate-500 uppercase tracking-wide">
                ID do Usuário
              </label>
              <p className="text-slate-500 text-sm mt-1 font-mono">
                {user?.user_id || user?.id}
              </p>
            </div>
          </div>
        </div>
      </div>
    </IndividualLayout>
  );
}
