"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/lib/use-auth";
import { useRouter } from "next/navigation";

export default function AccountPage() {
  const { user, logout } = useAuth();
  const router = useRouter();
  const [tab, setTab] = useState<"profile" | "password" | "danger">("profile");

  // Profile edit
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [profileMsg, setProfileMsg] = useState("");

  // Password change
  const [oldPwd, setOldPwd] = useState("");
  const [newPwd, setNewPwd] = useState("");
  const [confirmPwd, setConfirmPwd] = useState("");
  const [pwdMsg, setPwdMsg] = useState("");

  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    if (!user) { router.push("/"); return; }
    setName(user.name);
    setEmail(user.email);
  }, [user, router, hydrated]);

  function saveProfile() {
    if (!name.trim()) { setProfileMsg("用户名不能为空"); return; }
    try {
      const accounts = JSON.parse(localStorage.getItem("npuhub_accounts") ?? "{}");
      const currentEmail = user!.email;
      if (email !== currentEmail) {
        if (accounts[email]) { setProfileMsg("该邮箱已被使用"); return; }
        accounts[email] = { ...accounts[currentEmail] };
        delete accounts[currentEmail];
      }
      if (!accounts[email]) { setProfileMsg("账号数据异常，请重新登录"); return; }
      accounts[email].name = name;
      localStorage.setItem("npuhub_accounts", JSON.stringify(accounts));
      const updated = { name, email };
      localStorage.setItem("npuhub_user", JSON.stringify(updated));
      setProfileMsg("✓ 保存成功");
      setTimeout(() => window.location.reload(), 800);
    } catch {
      setProfileMsg("保存失败，请重试");
    }
  }

  function changePassword() {
    setPwdMsg("");
    if (!oldPwd || !newPwd || !confirmPwd) { setPwdMsg("请填写所有字段"); return; }
    if (newPwd.length < 6) { setPwdMsg("新密码至少 6 位"); return; }
    if (newPwd !== confirmPwd) { setPwdMsg("两次密码不一致"); return; }
    try {
      const accounts = JSON.parse(localStorage.getItem("npuhub_accounts") ?? "{}");
      if (accounts[user!.email].password !== oldPwd) { setPwdMsg("原密码错误"); return; }
      accounts[user!.email].password = newPwd;
      localStorage.setItem("npuhub_accounts", JSON.stringify(accounts));
      setOldPwd(""); setNewPwd(""); setConfirmPwd("");
      setPwdMsg("✓ 密码修改成功");
    } catch {
      setPwdMsg("修改失败，请重试");
    }
  }

  function deleteAccount() {
    if (!confirm("确认注销账号？此操作不可撤销。")) return;
    try {
      const accounts = JSON.parse(localStorage.getItem("npuhub_accounts") ?? "{}");
      delete accounts[user!.email];
      localStorage.setItem("npuhub_accounts", JSON.stringify(accounts));
      logout();
      router.push("/");
    } catch {}
  }

  if (!hydrated) return null;
  if (!user) return null;

  const TABS = [
    { key: "profile", label: "基本信息", icon: "person" },
    { key: "password", label: "修改密码", icon: "lock" },
    { key: "danger", label: "危险区域", icon: "warning" },
  ] as const;

  return (
    <div className="max-w-2xl mx-auto pt-2">
      {/* Header */}
      <div className="flex items-center gap-4 mb-8">
        <div className="w-16 h-16 rounded-2xl bg-secondary text-on-secondary flex items-center justify-center text-2xl font-black font-headline">
          {user.name[0].toUpperCase()}
        </div>
        <div>
          <h2 className="font-headline font-extrabold text-2xl text-primary tracking-tight">{user.name}</h2>
          <p className="text-on-surface-variant text-sm">{user.email}</p>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 bg-surface-container-low p-1 rounded-xl mb-6">
        {TABS.map(({ key, label, icon }) => (
          <button
            key={key}
            onClick={() => setTab(key)}
            className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-lg text-sm font-headline font-bold transition-all ${
              tab === key
                ? "bg-surface-container-lowest text-primary shadow-sm"
                : "text-on-surface-variant hover:text-on-surface"
            }`}
          >
            <span className="material-symbols-outlined text-[18px]">{icon}</span>
            <span className="hidden sm:block">{label}</span>
          </button>
        ))}
      </div>

      {/* Profile Tab */}
      {tab === "profile" && (
        <div className="bg-surface-container-lowest rounded-2xl p-6 space-y-5 shadow-sm">
          <h3 className="font-headline font-bold text-lg text-on-surface">基本信息</h3>
          <div>
            <label className="block font-label text-xs font-bold uppercase tracking-widest text-on-surface-variant mb-1.5">用户名</label>
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full bg-surface-container-low rounded-lg px-4 py-3 text-on-surface text-sm outline-none focus:ring-2 focus:ring-secondary transition-shadow"
            />
          </div>
          <div>
            <label className="block font-label text-xs font-bold uppercase tracking-widest text-on-surface-variant mb-1.5">邮箱</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full bg-surface-container-low rounded-lg px-4 py-3 text-on-surface text-sm outline-none focus:ring-2 focus:ring-secondary transition-shadow"
            />
          </div>
          {profileMsg && (
            <p className={`text-xs font-medium ${profileMsg.startsWith("✓") ? "text-tertiary" : "text-error"}`}>
              {profileMsg}
            </p>
          )}
          <button
            onClick={saveProfile}
            className="w-full py-3 bg-secondary text-on-secondary font-headline font-bold rounded-xl hover:opacity-90 active:scale-95 transition-all"
          >
            保存修改
          </button>
        </div>
      )}

      {/* Password Tab */}
      {tab === "password" && (
        <div className="bg-surface-container-lowest rounded-2xl p-6 space-y-5 shadow-sm">
          <h3 className="font-headline font-bold text-lg text-on-surface">修改密码</h3>
          {[
            { label: "原密码", value: oldPwd, setter: setOldPwd },
            { label: "新密码", value: newPwd, setter: setNewPwd },
            { label: "确认新密码", value: confirmPwd, setter: setConfirmPwd },
          ].map(({ label, value, setter }) => (
            <div key={label}>
              <label className="block font-label text-xs font-bold uppercase tracking-widest text-on-surface-variant mb-1.5">{label}</label>
              <input
                type="password"
                value={value}
                onChange={(e) => setter(e.target.value)}
                className="w-full bg-surface-container-low rounded-lg px-4 py-3 text-on-surface text-sm outline-none focus:ring-2 focus:ring-secondary transition-shadow"
                placeholder="至少 6 位"
              />
            </div>
          ))}
          {pwdMsg && (
            <p className={`text-xs font-medium ${pwdMsg.startsWith("✓") ? "text-tertiary" : "text-error"}`}>
              {pwdMsg}
            </p>
          )}
          <button
            onClick={changePassword}
            className="w-full py-3 bg-secondary text-on-secondary font-headline font-bold rounded-xl hover:opacity-90 active:scale-95 transition-all"
          >
            修改密码
          </button>
        </div>
      )}

      {/* Danger Tab */}
      {tab === "danger" && (
        <div className="bg-surface-container-lowest rounded-2xl p-6 space-y-4 shadow-sm border border-error/20">
          <div className="flex items-center gap-2 text-error">
            <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>warning</span>
            <h3 className="font-headline font-bold text-lg">危险区域</h3>
          </div>
          <p className="text-sm text-on-surface-variant">注销账号后，所有数据将被清除且无法恢复。</p>
          <button
            onClick={deleteAccount}
            className="w-full py-3 bg-error-container text-on-error-container font-headline font-bold rounded-xl hover:bg-error hover:text-on-error transition-all active:scale-95"
          >
            注销账号
          </button>
        </div>
      )}
    </div>
  );
}
