"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/components/AuthProvider";

const MBTI_OPTIONS = [
  "", "INTJ", "INTP", "ENTJ", "ENTP",
  "INFJ", "INFP", "ENFJ", "ENFP",
  "ISTJ", "ISFJ", "ESTJ", "ESFJ",
  "ISTP", "ISFP", "ESTP", "ESFP",
];

const ZODIAC_OPTIONS = [
  "", "白羊座", "金牛座", "双子座", "巨蟹座",
  "狮子座", "处女座", "天秤座", "天蝎座",
  "射手座", "摩羯座", "水瓶座", "双鱼座",
];

export default function ProfilePage() {
  const { user, signOut } = useAuth();
  const [nickname, setNickname] = useState("");
  const [occupation, setOccupation] = useState("");
  const [mbti, setMbti] = useState("");
  const [zodiac, setZodiac] = useState("");
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [loaded, setLoaded] = useState(false);

  // Load profile
  useEffect(() => {
    if (!user) return;
    fetch(`/api/profile?userId=${user.id}`)
      .then((r) => r.json())
      .then(({ profile }) => {
        if (profile) {
          setNickname(profile.nickname || "");
          setOccupation(profile.occupation || "");
          setMbti(profile.mbti || "");
          setZodiac(profile.zodiac || "");
        }
        setLoaded(true);
      })
      .catch(() => setLoaded(true));
  }, [user]);

  const handleSave = async () => {
    if (!user) return;
    setSaving(true);
    setSaved(false);
    try {
      await fetch("/api/profile", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId: user.id,
          nickname,
          occupation,
          mbti,
          zodiac,
        }),
      });
      setSaved(true);
      setTimeout(() => setSaved(false), 2000);
    } catch (err) {
      console.error("Save profile error:", err);
    } finally {
      setSaving(false);
    }
  };

  if (!user) return null;

  return (
    <div className="min-h-screen bg-[var(--yj-bg-primary)] pb-20">
      <div className="mx-auto max-w-md px-5 py-8">
        {/* Header */}
        <h1 className="text-xl font-bold text-[var(--yj-text-primary)] mb-6">
          个人中心
        </h1>

        {/* User info card */}
        <div className="rounded-lg bg-[var(--yj-bg-secondary)] border border-[var(--yj-border)] p-5 mb-6">
          <div className="flex items-center gap-3 mb-1">
            <div className="w-10 h-10 rounded-full bg-[var(--yj-primary-light)] flex items-center justify-center text-sm font-medium text-[var(--yj-primary)]">
              {(nickname || user.user_metadata?.full_name || "U").charAt(0)}
            </div>
            <div>
              <p className="text-sm font-medium text-[var(--yj-text-primary)]">
                {nickname || user.user_metadata?.full_name || "未设置昵称"}
              </p>
              <p className="text-xs text-[var(--yj-text-muted)]">
                {user.email}
              </p>
            </div>
          </div>
        </div>

        {/* Profile form */}
        {loaded && (
          <div className="space-y-5">
            {/* Nickname */}
            <div>
              <label className="block text-xs text-[var(--yj-text-secondary)] mb-1.5">
                昵称
              </label>
              <input
                type="text"
                value={nickname}
                onChange={(e) => setNickname(e.target.value)}
                placeholder="你希望 AI 怎么称呼你？"
                className="w-full px-4 py-2.5 rounded-lg bg-[var(--yj-bg-tertiary)] text-sm text-[var(--yj-text-primary)] placeholder:text-[var(--yj-text-muted)] outline-none focus:ring-2 focus:ring-[var(--yj-primary-light)]"
              />
            </div>

            {/* Occupation */}
            <div>
              <label className="block text-xs text-[var(--yj-text-secondary)] mb-1.5">
                职业
              </label>
              <input
                type="text"
                value={occupation}
                onChange={(e) => setOccupation(e.target.value)}
                placeholder="比如：大三学生、产品经理、自由职业"
                className="w-full px-4 py-2.5 rounded-lg bg-[var(--yj-bg-tertiary)] text-sm text-[var(--yj-text-primary)] placeholder:text-[var(--yj-text-muted)] outline-none focus:ring-2 focus:ring-[var(--yj-primary-light)]"
              />
            </div>

            {/* MBTI */}
            <div>
              <label className="block text-xs text-[var(--yj-text-secondary)] mb-1.5">
                MBTI
              </label>
              <select
                value={mbti}
                onChange={(e) => setMbti(e.target.value)}
                className="w-full px-4 py-2.5 rounded-lg bg-[var(--yj-bg-tertiary)] text-sm text-[var(--yj-text-primary)] outline-none focus:ring-2 focus:ring-[var(--yj-primary-light)] appearance-none"
              >
                {MBTI_OPTIONS.map((m) => (
                  <option key={m} value={m}>
                    {m || "未选择"}
                  </option>
                ))}
              </select>
            </div>

            {/* Zodiac */}
            <div>
              <label className="block text-xs text-[var(--yj-text-secondary)] mb-1.5">
                星座
              </label>
              <select
                value={zodiac}
                onChange={(e) => setZodiac(e.target.value)}
                className="w-full px-4 py-2.5 rounded-lg bg-[var(--yj-bg-tertiary)] text-sm text-[var(--yj-text-primary)] outline-none focus:ring-2 focus:ring-[var(--yj-primary-light)] appearance-none"
              >
                {ZODIAC_OPTIONS.map((z) => (
                  <option key={z} value={z}>
                    {z || "未选择"}
                  </option>
                ))}
              </select>
            </div>

            {/* Save button */}
            <button
              onClick={handleSave}
              disabled={saving}
              className="w-full py-2.5 rounded-lg bg-[var(--yj-primary)] text-[#FFFCF7] text-sm font-medium hover:bg-[var(--yj-primary-hover)] transition-colors disabled:opacity-50"
            >
              {saving ? "保存中..." : saved ? "已保存" : "保存"}
            </button>

            {/* Sign out */}
            <button
              onClick={signOut}
              className="w-full py-2.5 rounded-lg border border-[var(--yj-border)] text-[var(--yj-text-secondary)] text-sm hover:bg-[var(--yj-bg-tertiary)] transition-colors"
            >
              退出登录
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
