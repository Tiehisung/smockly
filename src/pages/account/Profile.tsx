// src/pages/account/Profile.tsx
import { useState, useEffect } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useAuth } from "../../contexts/AuthContext";
import {
  UserIcon,
  BellIcon,
  ShieldCheckIcon,
  DevicePhoneMobileIcon,
} from "@heroicons/react/24/outline";
import toast from "react-hot-toast";
import { INPUT } from "../../components/input/Input";
import { CHECKBOX } from "../../components/input/Checkbox";
import { Button } from "../../components/buttons/Button";
import { Tabs } from "../../components/tabs";
import { useUpdateUserProfileMutation } from "../../store/api/user.api";

const profileSchema = z.object({
  displayName: z
    .string()
    .min(2, "Name must be at least 2 characters")
    .optional(),
  email: z.string().email("Invalid email address"),
  phone: z.string().optional(),
  bio: z.string().max(500, "Bio must be less than 500 characters").optional(),
  location: z.string().optional(),
  website: z.string().url("Invalid URL").optional().or(z.literal("")),
});

const notificationSchema = z.object({
  emailNotifications: z.boolean(),
  pushNotifications: z.boolean(),
  smsNotifications: z.boolean(),
  orderUpdates: z.boolean(),
  promotions: z.boolean(),
  newsletter: z.boolean(),
});

const privacySchema = z.object({
  showProfile: z.boolean(),
  showEmail: z.boolean(),
  showOrders: z.boolean(),
});

type ProfileFormData = z.infer<typeof profileSchema>;
type NotificationFormData = z.infer<typeof notificationSchema>;
type PrivacyFormData = z.infer<typeof privacySchema>;

export function CustomerProfile() {
  const { user, dbUser } = useAuth();
  const [activeTab, setActiveTab] = useState("profile");
  const [updateProfile, { isLoading }] = useUpdateUserProfileMutation();

  const {
    control: profileControl,
    handleSubmit: handleProfileSubmit,
    formState: { errors: profileErrors },
    reset: resetProfile,
  } = useForm<ProfileFormData>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      displayName: dbUser?.displayName || user?.displayName || "",
      email: user?.email || "",
      phone: dbUser?.phone || "",
      //   bio: dbUser?.bio || "",
      //   location: dbUser?.location || "",
      //   website: dbUser?.website || "",
    },
  });

  const {
    control: notificationControl,
    handleSubmit: handleNotificationSubmit,
    reset: resetNotifications,
  } = useForm<NotificationFormData>({
    resolver: zodResolver(notificationSchema),
    defaultValues: {
      emailNotifications: dbUser?.preferences?.notifications?.email ?? true,
      pushNotifications: dbUser?.preferences?.notifications?.push ?? true,
      smsNotifications: false,
      orderUpdates: true,
      promotions: dbUser?.preferences?.notifications?.marketing ?? false,
      newsletter: dbUser?.preferences?.newsletter ?? false,
    },
  });

  const {
    control: privacyControl,
    handleSubmit: handlePrivacySubmit,
    reset: resetPrivacy,
  } = useForm<PrivacyFormData>({
    resolver: zodResolver(privacySchema),
    defaultValues: {
      //   showProfile: dbUser?.preferences?.privacy?.showProfile ?? true,
      //   showEmail: dbUser?.preferences?.privacy?.showEmail ?? false,
      showOrders: true,
    },
  });

  useEffect(() => {
    if (dbUser) {
      resetProfile({
        displayName: dbUser.displayName || user?.displayName || "",
        email: user?.email || "",
        phone: dbUser.phone || "",
      });

      resetNotifications({
        emailNotifications: dbUser.preferences?.notifications?.email ?? true,
        pushNotifications: dbUser.preferences?.notifications?.push ?? true,
        smsNotifications: false,
        orderUpdates: true,
        promotions: dbUser.preferences?.notifications?.marketing ?? false,
        newsletter: dbUser.preferences?.newsletter ?? false,
      });

      resetPrivacy({
        // showProfile: dbUser.preferences?.privacy?.showProfile ?? true,
        // showEmail: dbUser.preferences?.privacy?.showEmail ?? false,
        showOrders: true,
      });
    }
  }, [dbUser, user, resetProfile, resetNotifications, resetPrivacy]);

  const onProfileSubmit = async (data: ProfileFormData) => {
    try {
      await updateProfile({
        displayName: data.displayName,
      }).unwrap();
      toast.success("Profile updated successfully");
    } catch (error) {
      toast.error("Failed to update profile");
    }
  };

  const onNotificationSubmit = async (data: NotificationFormData) => {
    try {
      await updateProfile({
        preferences: {
          notifications: {
            email: data.emailNotifications,
            push: data.pushNotifications,
            marketing: data.promotions,
          },
          newsletter: data.newsletter,
        },
      }).unwrap();
      toast.success("Notification preferences updated");
    } catch (error) {
      toast.error("Failed to update preferences");
    }
  };

  const onPrivacySubmit = async (_data: PrivacyFormData) => {
    try {
      await updateProfile({
        preferences: {
          ...({
            privacy: {
              ..._data,
            },
          } as any),
        },
      }).unwrap();
      toast.success("Privacy settings updated");
    } catch (error) {
      toast.error("Failed to update privacy settings");
    }
  };

  const tabs = [
    {
      id: "profile",
      label: "Profile",
      icon: UserIcon,
    },
    {
      id: "notifications",
      label: "Notifications",
      icon: BellIcon,
    },
    {
      id: "privacy",
      label: "Privacy",
      icon: ShieldCheckIcon,
    },
  ];

  return (
    <div className="max-w-3xl mx-auto">
      <h1 className="text-2xl font-bold text-gray-900 mb-6">
        Account Settings
      </h1>

      <Tabs tabs={tabs} activeTab={activeTab} onChange={setActiveTab} />

      <div className="mt-6">
        {activeTab === "profile" && (
          <form
            onSubmit={handleProfileSubmit(onProfileSubmit)}
            className="space-y-6"
          >
            <div className="bg-white rounded-lg shadow-sm p-6 space-y-4">
              <h2 className="text-lg font-semibold mb-4">
                Personal Information
              </h2>

              <Controller
                name="displayName"
                control={profileControl}
                render={({ field }) => (
                  <INPUT
                    {...field}
                    label="Display Name"
                    placeholder="Your name"
                    error={profileErrors.displayName?.message}
                    leftIcon={<UserIcon className="w-5 h-5 text-gray-400" />}
                  />
                )}
              />

              <Controller
                name="email"
                control={profileControl}
                render={({ field }) => (
                  <INPUT
                    {...field}
                    label="Email Address"
                    type="email"
                    disabled
                    error={profileErrors.email?.message}
                  />
                )}
              />

              <Controller
                name="phone"
                control={profileControl}
                render={({ field }) => (
                  <INPUT
                    {...field}
                    label="Phone Number"
                    placeholder="+233 XX XXX XXXX"
                    error={profileErrors.phone?.message}
                    leftIcon={
                      <DevicePhoneMobileIcon className="w-5 h-5 text-gray-400" />
                    }
                  />
                )}
              />

              <Controller
                name="location"
                control={profileControl}
                render={({ field }) => (
                  <INPUT
                    {...field}
                    label="Location"
                    placeholder="City, Country"
                    error={profileErrors.location?.message}
                  />
                )}
              />

              <Controller
                name="website"
                control={profileControl}
                render={({ field }) => (
                  <INPUT
                    {...field}
                    label="Website"
                    placeholder="https://example.com"
                    error={profileErrors.website?.message}
                  />
                )}
              />

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Bio
                </label>
                <Controller
                  name="bio"
                  control={profileControl}
                  render={({ field }) => (
                    <textarea
                      {...field}
                      rows={4}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      placeholder="Tell us a little about yourself..."
                    />
                  )}
                />
                {profileErrors.bio && (
                  <p className="mt-1 text-sm text-red-600">
                    {profileErrors.bio.message}
                  </p>
                )}
              </div>
            </div>

            <div className="flex justify-end">
              <Button type="submit" isLoading={isLoading}>
                Save Changes
              </Button>
            </div>
          </form>
        )}

        {activeTab === "notifications" && (
          <form
            onSubmit={handleNotificationSubmit(onNotificationSubmit)}
            className="space-y-6"
          >
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h2 className="text-lg font-semibold mb-4">
                Notification Preferences
              </h2>

              <div className="space-y-4">
                <Controller
                  name="emailNotifications"
                  control={notificationControl}
                  render={({ field }) => (
                    <label className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div>
                        <p className="font-medium text-gray-900">
                          Email Notifications
                        </p>
                        <p className="text-sm text-gray-500">
                          Receive updates via email
                        </p>
                      </div>
                      <CHECKBOX
                        checked={field.value}
                        onChange={field.onChange}
                        className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                      />
                    </label>
                  )}
                />

                <Controller
                  name="pushNotifications"
                  control={notificationControl}
                  render={({ field }) => (
                    <label className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div>
                        <p className="font-medium text-gray-900">
                          Push Notifications
                        </p>
                        <p className="text-sm text-gray-500">
                          Receive browser notifications
                        </p>
                      </div>
                      <CHECKBOX
                        checked={field.value}
                        onChange={field.onChange}
                        className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                      />
                    </label>
                  )}
                />

                <Controller
                  name="orderUpdates"
                  control={notificationControl}
                  render={({ field }) => (
                    <label className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div>
                        <p className="font-medium text-gray-900">
                          Order Updates
                        </p>
                        <p className="text-sm text-gray-500">
                          Get updates about your orders
                        </p>
                      </div>
                      <CHECKBOX
                        checked={field.value}
                        onChange={field.onChange}
                        className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                      />
                    </label>
                  )}
                />

                <Controller
                  name="promotions"
                  control={notificationControl}
                  render={({ field }) => (
                    <label className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div>
                        <p className="font-medium text-gray-900">
                          Promotions & Offers
                        </p>
                        <p className="text-sm text-gray-500">
                          Receive marketing emails
                        </p>
                      </div>
                      <CHECKBOX
                        checked={field.value}
                        onChange={field.onChange}
                        className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                      />
                    </label>
                  )}
                />

                <Controller
                  name="newsletter"
                  control={notificationControl}
                  render={({ field }) => (
                    <label className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div>
                        <p className="font-medium text-gray-900">Newsletter</p>
                        <p className="text-sm text-gray-500">
                          Subscribe to our newsletter
                        </p>
                      </div>
                      <CHECKBOX
                        checked={field.value}
                        onChange={field.onChange}
                        className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                      />
                    </label>
                  )}
                />
              </div>
            </div>

            <div className="flex justify-end">
              <Button type="submit" isLoading={isLoading}>
                Save Preferences
              </Button>
            </div>
          </form>
        )}

        {activeTab === "privacy" && (
          <form
            onSubmit={handlePrivacySubmit(onPrivacySubmit)}
            className="space-y-6"
          >
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h2 className="text-lg font-semibold mb-4">Privacy Settings</h2>

              <div className="space-y-4">
                <Controller
                  name="showProfile"
                  control={privacyControl}
                  render={({ field }) => (
                    <label className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div>
                        <p className="font-medium text-gray-900">
                          Public Profile
                        </p>
                        <p className="text-sm text-gray-500">
                          Allow others to see your profile
                        </p>
                      </div>
                      <CHECKBOX
                        checked={field.value}
                        onChange={field.onChange}
                        className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                      />
                    </label>
                  )}
                />

                <Controller
                  name="showEmail"
                  control={privacyControl}
                  render={({ field }) => (
                    <label className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div>
                        <p className="font-medium text-gray-900">Show Email</p>
                        <p className="text-sm text-gray-500">
                          Display your email on your profile
                        </p>
                      </div>
                      <CHECKBOX
                        checked={field.value}
                        onChange={field.onChange}
                        className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                      />
                    </label>
                  )}
                />

                <Controller
                  name="showOrders"
                  control={privacyControl}
                  render={({ field }) => (
                    <label className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div>
                        <p className="font-medium text-gray-900">
                          Public Order History
                        </p>
                        <p className="text-sm text-gray-500">
                          Allow others to see your reviews
                        </p>
                      </div>
                      <CHECKBOX
                        checked={field.value}
                        onChange={field.onChange}
                        className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                      />
                    </label>
                  )}
                />
              </div>
            </div>

            <div className="flex justify-end">
              <Button disabled={isLoading}>Save Privacy Settings</Button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
