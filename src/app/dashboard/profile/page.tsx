"use client";

import React, { useState, useEffect, useTransition } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  User as UserIcon,
  Phone,
  Mail,
  ShieldAlert,
  Loader2,
  Lock,
  ArrowLeft,
  Settings,
  Heart,
  Image as ImageIcon,
} from "lucide-react";
import { PageWrapper } from "@/components/ui/page-wrapper";
import { Section } from "@/components/ui/section";
import { Container } from "@/components/ui/container";
import { Heading } from "@/components/ui/heading";
import { Button } from "@/components/ui/button";
import { getGuestProfile, updateGuestProfile, updateGuestPassword } from "@/features/profile/actions";
import { profileUpdateSchema, ProfileUpdateInput, changePasswordSchema, ChangePasswordInput } from "@/features/profile/schema";

export default function ProfilePage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<"details" | "preferences" | "password">("details");
  const [profilePending, startProfileTransition] = useTransition();
  const [passwordPending, startPasswordTransition] = useTransition();
  const [profileSuccess, setProfileSuccess] = useState<string | null>(null);
  const [profileError, setProfileError] = useState<string | null>(null);
  const [passwordSuccess, setPasswordSuccess] = useState<string | null>(null);
  const [passwordError, setPasswordError] = useState<string | null>(null);

  const {
    register: registerProfile,
    handleSubmit: handleSubmitProfile,
    formState: { errors: profileErrors },
    reset: resetProfile,
  } = useForm<ProfileUpdateInput>({
    resolver: zodResolver(profileUpdateSchema),
  });

  const {
    register: registerPassword,
    handleSubmit: handleSubmitPassword,
    formState: { errors: passwordErrors },
    reset: resetPassword,
  } = useForm<ChangePasswordInput>({
    resolver: zodResolver(changePasswordSchema),
  });

  useEffect(() => {
    async function loadProfile() {
      const res = await getGuestProfile();
      if (!res.success) {
        router.push("/login");
      } else {
        resetProfile({
          name: res.user?.name || "",
          phone: res.user?.phone || "",
          nationality: res.profile?.nationality || "",
          emergencyContact: res.profile?.emergencyContact || "",
          pillowType: res.profile?.pillowType || "",
          dietaryNotes: res.profile?.dietaryNotes || "",
          avatarUrl: res.profile?.avatarUrl || "",
        });
      }
      setLoading(false);
    }
    loadProfile();
  }, [router, resetProfile]);

  const onProfileSubmit = (data: ProfileUpdateInput) => {
    setProfileError(null);
    setProfileSuccess(null);
    startProfileTransition(async () => {
      const res = await updateGuestProfile(data);
      if (!res.success) {
        setProfileError(res.message || "Failed to update profile.");
      } else {
        setProfileSuccess(res.message || "Profile saved.");
      }
    });
  };

  const onPasswordSubmit = (data: ChangePasswordInput) => {
    setPasswordError(null);
    setPasswordSuccess(null);
    startPasswordTransition(async () => {
      const res = await updateGuestPassword(data);
      if (!res.success) {
        setPasswordError(res.message || "Failed to update password.");
      } else {
        setPasswordSuccess(res.message || "Password updated.");
        resetPassword();
      }
    });
  };

  if (loading) {
    return (
      <PageWrapper>
        <div className="flex-1 flex items-center justify-center py-40">
          <Loader2 className="animate-spin text-gold" size={32} />
        </div>
      </PageWrapper>
    );
  }

  return (
    <PageWrapper>
      <Section className="relative pt-28 pb-20 bg-[radial-gradient(circle_at_top,_rgba(212,175,55,0.015)_0%,_black_100%)]">
        <Container className="max-w-2xl mx-auto space-y-8">
          {/* Top Return Link */}
          <div className="text-left">
            <Link
              href="/dashboard"
              className="inline-flex items-center gap-1.5 text-[10px] uppercase tracking-widest text-zinc-500 hover:text-gold transition-colors font-sans"
            >
              <ArrowLeft size={10} /> Back to Dashboard
            </Link>
          </div>

          <div>
            <Heading subtitle>Bespoke Settings</Heading>
            <Heading as="h1" accent className="tracking-wide text-2xl sm:text-3xl">
              Guest Profile Configurator
            </Heading>
          </div>

          {/* Navigation Tabs */}
          <div className="flex border-b border-gold/10 font-sans text-xs uppercase tracking-wider font-medium">
            <button
              onClick={() => setActiveTab("details")}
              className={`flex-1 py-3 text-center border-b-2 transition-all cursor-pointer ${
                activeTab === "details"
                  ? "border-gold text-gold font-medium"
                  : "border-transparent text-zinc-500 hover:text-zinc-300"
              }`}
            >
              Details
            </button>
            <button
              onClick={() => setActiveTab("preferences")}
              className={`flex-1 py-3 text-center border-b-2 transition-all cursor-pointer ${
                activeTab === "preferences"
                  ? "border-gold text-gold font-medium"
                  : "border-transparent text-zinc-500 hover:text-zinc-300"
              }`}
            >
              Preferences
            </button>
            <button
              onClick={() => setActiveTab("password")}
              className={`flex-1 py-3 text-center border-b-2 transition-all cursor-pointer ${
                activeTab === "password"
                  ? "border-gold text-gold font-medium"
                  : "border-transparent text-zinc-500 hover:text-zinc-300"
              }`}
            >
              Security
            </button>
          </div>

          {/* Profile Details Form */}
          {activeTab === "details" && (
            <div className="p-6 border border-gold/10 bg-charcoal/40 rounded-sm relative luxury-glass shadow-elevation">
              <form onSubmit={handleSubmitProfile(onProfileSubmit)} className="space-y-5 text-left">
                <Heading as="h3" className="text-sm font-serif font-light text-gold tracking-widest uppercase">
                  Account Details
                </Heading>

                {profileSuccess && (
                  <div className="p-3 border border-emerald-500/20 bg-emerald-950/20 text-emerald-400 text-xs font-sans text-center rounded-sm">
                    {profileSuccess}
                  </div>
                )}
                {profileError && (
                  <div className="p-3 border border-red-500/20 bg-red-950/20 text-red-400 text-xs font-sans text-center rounded-sm">
                    {profileError}
                  </div>
                )}

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* Name */}
                  <div className="space-y-1">
                    <label className="block text-[9px] uppercase tracking-widest text-gold font-sans font-medium">Name</label>
                    <div className="relative">
                      <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-zinc-500">
                        <UserIcon size={12} />
                      </span>
                      <input
                        type="text"
                        required
                        className="w-full bg-black/60 border border-gold/15 focus:border-gold outline-none pl-8 pr-2.5 py-2 text-xs text-zinc-200 font-sans font-light rounded-sm"
                        {...registerProfile("name")}
                      />
                    </div>
                    {profileErrors.name && (
                      <span className="text-[9px] text-red-400 font-sans block">{profileErrors.name.message}</span>
                    )}
                  </div>

                  {/* Phone */}
                  <div className="space-y-1">
                    <label className="block text-[9px] uppercase tracking-widest text-gold font-sans font-medium">Phone</label>
                    <div className="relative">
                      <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-zinc-500">
                        <Phone size={12} />
                      </span>
                      <input
                        type="tel"
                        required
                        className="w-full bg-black/60 border border-gold/15 focus:border-gold outline-none pl-8 pr-2.5 py-2 text-xs text-zinc-200 font-sans font-light rounded-sm"
                        {...registerProfile("phone")}
                      />
                    </div>
                    {profileErrors.phone && (
                      <span className="text-[9px] text-red-400 font-sans block">{profileErrors.phone.message}</span>
                    )}
                  </div>

                  {/* Nationality */}
                  <div className="space-y-1">
                    <label className="block text-[9px] uppercase tracking-widest text-gold font-sans font-medium">Nationality</label>
                    <input
                      type="text"
                      className="w-full bg-black/60 border border-gold/15 focus:border-gold outline-none p-2 text-xs text-zinc-200 font-sans font-light rounded-sm"
                      placeholder="e.g. British"
                      {...registerProfile("nationality")}
                    />
                    {profileErrors.nationality && (
                      <span className="text-[9px] text-red-400 font-sans block">{profileErrors.nationality.message}</span>
                    )}
                  </div>

                  {/* Emergency Contact */}
                  <div className="space-y-1">
                    <label className="block text-[9px] uppercase tracking-widest text-gold font-sans font-medium">Emergency Contact</label>
                    <div className="relative">
                      <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-zinc-500">
                        <ShieldAlert size={12} />
                      </span>
                      <input
                        type="text"
                        className="w-full bg-black/60 border border-gold/15 focus:border-gold outline-none pl-8 pr-2.5 py-2 text-xs text-zinc-200 font-sans font-light rounded-sm"
                        placeholder="e.g. Spouse: +44..."
                        {...registerProfile("emergencyContact")}
                      />
                    </div>
                    {profileErrors.emergencyContact && (
                      <span className="text-[9px] text-red-400 font-sans block">{profileErrors.emergencyContact.message}</span>
                    )}
                  </div>
                </div>

                {/* Avatar URL */}
                <div className="space-y-1">
                  <label className="block text-[9px] uppercase tracking-widest text-gold font-sans font-medium">Avatar Image URL</label>
                  <div className="relative">
                    <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-zinc-500">
                      <ImageIcon size={12} />
                    </span>
                    <input
                      type="text"
                      className="w-full bg-black/60 border border-gold/15 focus:border-gold outline-none pl-8 pr-2.5 py-2 text-xs text-zinc-200 font-sans font-light rounded-sm"
                      placeholder="e.g. https://domain.com/avatar.jpg"
                      {...registerProfile("avatarUrl")}
                    />
                  </div>
                  {profileErrors.avatarUrl && (
                    <span className="text-[9px] text-red-400 font-sans block">{profileErrors.avatarUrl.message}</span>
                  )}
                </div>

                <div className="pt-2">
                  <Button type="submit" variant="primary" size="sm" className="w-full sm:w-auto uppercase tracking-widest font-sans py-2" disabled={profilePending}>
                    {profilePending ? (
                      <>
                        <Loader2 className="animate-spin" size={12} /> Saving...
                      </>
                    ) : (
                      "Save Profile Details"
                    )}
                  </Button>
                </div>
              </form>
            </div>
          )}

          {/* Guest Preferences Form */}
          {activeTab === "preferences" && (
            <div className="p-6 border border-gold/10 bg-charcoal/40 rounded-sm relative luxury-glass shadow-elevation">
              <form onSubmit={handleSubmitProfile(onProfileSubmit)} className="space-y-5 text-left">
                <Heading as="h3" className="text-sm font-serif font-light text-gold tracking-widest uppercase">
                  Preferences Configuration
                </Heading>

                {profileSuccess && (
                  <div className="p-3 border border-emerald-500/20 bg-emerald-950/20 text-emerald-400 text-xs font-sans text-center rounded-sm">
                    {profileSuccess}
                  </div>
                )}
                {profileError && (
                  <div className="p-3 border border-red-500/20 bg-red-950/20 text-red-400 text-xs font-sans text-center rounded-sm">
                    {profileError}
                  </div>
                )}

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* Pillow Type */}
                  <div className="space-y-1">
                    <label className="block text-[9px] uppercase tracking-widest text-gold font-sans font-medium">Pillow Selection</label>
                    <select
                      className="w-full bg-black/60 border border-gold/15 focus:border-gold outline-none p-2 text-xs text-zinc-200 font-sans font-light rounded-sm cursor-pointer"
                      {...registerProfile("pillowType")}
                    >
                      <option value="">Default Pillow Setup</option>
                      <option value="feather">Natural Goose Feather</option>
                      <option value="memory">Orthopedic Memory Foam</option>
                      <option value="hypoallergenic">Hypoallergenic Microfibre</option>
                      <option value="firm">Firm Anatomical Pillow</option>
                    </select>
                  </div>

                  {/* Dietary Restrictions */}
                  <div className="space-y-1 col-span-1 sm:col-span-2">
                    <label className="block text-[9px] uppercase tracking-widest text-gold font-sans font-medium">Dietary Requirements & Notes</label>
                    <textarea
                      rows={4}
                      className="w-full bg-black/60 border border-gold/15 focus:border-gold outline-none p-2 text-xs text-zinc-200 font-sans font-light rounded-sm resize-none"
                      placeholder="Specify allergies, food intolerances, vegan/vegetarian preferences, etc..."
                      {...registerProfile("dietaryNotes")}
                    />
                  </div>
                </div>

                <div className="pt-2">
                  <Button type="submit" variant="primary" size="sm" className="w-full sm:w-auto uppercase tracking-widest font-sans py-2" disabled={profilePending}>
                    {profilePending ? (
                      <>
                        <Loader2 className="animate-spin" size={12} /> Saving...
                      </>
                    ) : (
                      "Save Preferences"
                    )}
                  </Button>
                </div>
              </form>
            </div>
          )}

          {/* Change Password Form */}
          {activeTab === "password" && (
            <div className="p-6 border border-gold/10 bg-charcoal/40 rounded-sm relative luxury-glass shadow-elevation">
              <form onSubmit={handleSubmitPassword(onPasswordSubmit)} className="space-y-5 text-left">
                <Heading as="h3" className="text-sm font-serif font-light text-gold tracking-widest uppercase">
                  Change Password
                </Heading>

                {passwordSuccess && (
                  <div className="p-3 border border-emerald-500/20 bg-emerald-950/20 text-emerald-400 text-xs font-sans text-center rounded-sm">
                    {passwordSuccess}
                  </div>
                )}
                {passwordError && (
                  <div className="p-3 border border-red-500/20 bg-red-950/20 text-red-400 text-xs font-sans text-center rounded-sm">
                    {passwordError}
                  </div>
                )}

                <div className="space-y-4">
                  {/* Current Password */}
                  <div className="space-y-1">
                    <label className="block text-[9px] uppercase tracking-widest text-gold font-sans font-medium">Current Password</label>
                    <div className="relative">
                      <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-zinc-500">
                        <Lock size={12} />
                      </span>
                      <input
                        type="password"
                        required
                        className="w-full bg-black/60 border border-gold/15 focus:border-gold outline-none pl-8 pr-2.5 py-2 text-xs text-zinc-200 font-sans font-light rounded-sm"
                        placeholder="••••••••"
                        {...registerPassword("currentPassword")}
                      />
                    </div>
                    {passwordErrors.currentPassword && (
                      <span className="text-[9px] text-red-400 font-sans block">{passwordErrors.currentPassword.message}</span>
                    )}
                  </div>

                  {/* New Password */}
                  <div className="space-y-1">
                    <label className="block text-[9px] uppercase tracking-widest text-gold font-sans font-medium">New Password</label>
                    <div className="relative">
                      <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-zinc-500">
                        <Lock size={12} />
                      </span>
                      <input
                        type="password"
                        required
                        className="w-full bg-black/60 border border-gold/15 focus:border-gold outline-none pl-8 pr-2.5 py-2 text-xs text-zinc-200 font-sans font-light rounded-sm"
                        placeholder="••••••••"
                        {...registerPassword("newPassword")}
                      />
                    </div>
                    {passwordErrors.newPassword && (
                      <span className="text-[9px] text-red-400 font-sans block">{passwordErrors.newPassword.message}</span>
                    )}
                  </div>

                  {/* Confirm Password */}
                  <div className="space-y-1">
                    <label className="block text-[9px] uppercase tracking-widest text-gold font-sans font-medium">Confirm New Password</label>
                    <div className="relative">
                      <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-zinc-500">
                        <Lock size={12} />
                      </span>
                      <input
                        type="password"
                        required
                        className="w-full bg-black/60 border border-gold/15 focus:border-gold outline-none pl-8 pr-2.5 py-2 text-xs text-zinc-200 font-sans font-light rounded-sm"
                        placeholder="••••••••"
                        {...registerPassword("confirmPassword")}
                      />
                    </div>
                    {passwordErrors.confirmPassword && (
                      <span className="text-[9px] text-red-400 font-sans block">{passwordErrors.confirmPassword.message}</span>
                    )}
                  </div>
                </div>

                <div className="pt-2">
                  <Button type="submit" variant="primary" size="sm" className="w-full sm:w-auto uppercase tracking-widest font-sans py-2" disabled={passwordPending}>
                    {passwordPending ? (
                      <>
                        <Loader2 className="animate-spin" size={12} /> Updating...
                      </>
                    ) : (
                      "Update Password"
                    )}
                  </Button>
                </div>
              </form>
            </div>
          )}
        </Container>
      </Section>
    </PageWrapper>
  );
}
