/**
 * Settings Page
 * FRS: FR-025 to FR-026 (Settings)
 * Task: 5.6.6
 */
import { useState } from 'react';
import { useUserProfile, useUpdateUserProfile, useOrganisationSettings, useUpdateOrganisationSettings, useUploadOrganisationLogo } from '../lib/hooks/useSettings';
import { User, Building2, Save, Loader2 } from 'lucide-react';

export function SettingsPage() {
  const { data: userProfile, isLoading: profileLoading } = useUserProfile();
  const { data: orgSettings, isLoading: orgLoading } = useOrganisationSettings(userProfile?.organisation_id);
  const updateProfile = useUpdateUserProfile();
  const updateOrgSettings = useUpdateOrganisationSettings();
  const uploadLogo = useUploadOrganisationLogo();

  const [activeTab, setActiveTab] = useState<'profile' | 'organisation'>('profile');
  
  // Profile form state
  const [fullName, setFullName] = useState(userProfile?.full_name || '');
  const [language, setLanguage] = useState(userProfile?.preferences?.language || 'en');
  const [theme, setTheme] = useState<'light' | 'dark'>(userProfile?.preferences?.theme || 'light');
  const [notifications, setNotifications] = useState(userProfile?.preferences?.notifications ?? true);

  // Organisation form state
  const [orgName, setOrgName] = useState(orgSettings?.name || '');
  const [primaryColor, setPrimaryColor] = useState(orgSettings?.primary_color || '#3B82F6');
  const [secondaryColor, setSecondaryColor] = useState(orgSettings?.secondary_color || '#10B981');
  const [reportTemplate, setReportTemplate] = useState<'standard' | 'detailed' | 'executive'>(orgSettings?.report_template || 'standard');
  const [selectedLogo, setSelectedLogo] = useState<File | null>(null);

  // Update form state when data loads
  React.useEffect(() => {
    if (userProfile) {
      setFullName(userProfile.full_name || '');
      setLanguage(userProfile.preferences?.language || 'en');
      setTheme(userProfile.preferences?.theme || 'light');
      setNotifications(userProfile.preferences?.notifications ?? true);
    }
  }, [userProfile]);

  React.useEffect(() => {
    if (orgSettings) {
      setOrgName(orgSettings.name || '');
      setPrimaryColor(orgSettings.primary_color || '#3B82F6');
      setSecondaryColor(orgSettings.secondary_color || '#10B981');
      setReportTemplate(orgSettings.report_template || 'standard');
    }
  }, [orgSettings]);

  const handleSaveProfile = async () => {
    try {
      await updateProfile.mutateAsync({
        full_name: fullName,
        preferences: {
          language,
          theme,
          notifications,
        },
      });
      alert('Profile updated successfully!');
    } catch (err) {
      alert(`Failed to update profile: ${err instanceof Error ? err.message : 'Unknown error'}`);
    }
  };

  const handleSaveOrganisation = async () => {
    if (!userProfile?.organisation_id) {
      alert('No organisation ID found');
      return;
    }

    try {
      // Upload logo if selected
      let logoUrl = orgSettings?.logo_url;
      if (selectedLogo) {
        logoUrl = await uploadLogo.mutateAsync({
          organisationId: userProfile.organisation_id,
          file: selectedLogo,
        });
      }

      await updateOrgSettings.mutateAsync({
        organisationId: userProfile.organisation_id,
        updates: {
          name: orgName,
          primary_color: primaryColor,
          secondary_color: secondaryColor,
          report_template: reportTemplate,
          logo_url: logoUrl,
        },
      });
      setSelectedLogo(null);
      alert('Organisation settings updated successfully!');
    } catch (err) {
      alert(`Failed to update organisation settings: ${err instanceof Error ? err.message : 'Unknown error'}`);
    }
  };

  if (profileLoading || orgLoading) {
    return (
      <div className="max-w-4xl mx-auto">
        <div className="animate-pulse space-y-4">
          <div className="h-12 bg-gray-200 rounded w-1/3" />
          <div className="h-64 bg-gray-200 rounded w-full" />
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold text-gray-900 mb-6">Settings</h1>

      {/* Tabs */}
      <div className="flex border-b mb-6">
        <button
          onClick={() => setActiveTab('profile')}
          className={`flex items-center gap-2 px-6 py-3 text-sm font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 ${
            activeTab === 'profile'
              ? 'border-b-2 border-blue-500 text-blue-600'
              : 'text-gray-600 hover:text-gray-900'
          }`}
        >
          <User className="h-4 w-4" />
          User Profile
        </button>
        <button
          onClick={() => setActiveTab('organisation')}
          className={`flex items-center gap-2 px-6 py-3 text-sm font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 ${
            activeTab === 'organisation'
              ? 'border-b-2 border-blue-500 text-blue-600'
              : 'text-gray-600 hover:text-gray-900'
          }`}
        >
          <Building2 className="h-4 w-4" />
          Organisation
        </button>
      </div>

      {/* Profile Tab */}
      {activeTab === 'profile' && (
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-6">User Profile</h2>
          
          <div className="space-y-6">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                Email Address
              </label>
              <input
                id="email"
                type="email"
                value={userProfile?.email || ''}
                disabled
                className="w-full border-gray-300 rounded-md shadow-sm bg-gray-50 cursor-not-allowed"
              />
              <p className="text-xs text-gray-500 mt-1">Email cannot be changed</p>
            </div>

            <div>
              <label htmlFor="full-name" className="block text-sm font-medium text-gray-700 mb-2">
                Full Name
              </label>
              <input
                id="full-name"
                type="text"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                className="w-full border-gray-300 rounded-md shadow-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-500"
                placeholder="Enter your full name"
              />
            </div>

            <div>
              <label htmlFor="language" className="block text-sm font-medium text-gray-700 mb-2">
                Language
              </label>
              <select
                id="language"
                value={language}
                onChange={(e) => setLanguage(e.target.value)}
                className="w-full border-gray-300 rounded-md shadow-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-500"
              >
                <option value="en">English</option>
                <option value="es">Spanish</option>
                <option value="fr">French</option>
                <option value="de">German</option>
              </select>
            </div>

            <div>
              <label htmlFor="theme" className="block text-sm font-medium text-gray-700 mb-2">
                Theme
              </label>
              <select
                id="theme"
                value={theme}
                onChange={(e) => setTheme(e.target.value as 'light' | 'dark')}
                className="w-full border-gray-300 rounded-md shadow-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-500"
              >
                <option value="light">Light</option>
                <option value="dark">Dark</option>
              </select>
            </div>

            <div>
              <label className="flex items-start gap-3">
                <input
                  type="checkbox"
                  checked={notifications}
                  onChange={(e) => setNotifications(e.target.checked)}
                  className="mt-1 h-5 w-5 text-blue-600 border-gray-300 rounded focus:ring-2 focus:ring-blue-500"
                />
                <div>
                  <span className="font-medium text-gray-900">Enable Notifications</span>
                  <p className="text-sm text-gray-600 mt-1">
                    Receive email notifications for audit updates and system alerts
                  </p>
                </div>
              </label>
            </div>

            <button
              onClick={handleSaveProfile}
              disabled={updateProfile.isPending}
              className="flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
            >
              {updateProfile.isPending ? (
                <>
                  <Loader2 className="h-5 w-5 animate-spin" />
                  Saving...
                </>
              ) : (
                <>
                  <Save className="h-5 w-5" />
                  Save Profile
                </>
              )}
            </button>
          </div>
        </div>
      )}

      {/* Organisation Tab */}
      {activeTab === 'organisation' && (
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-6">Organisation Settings</h2>

          {!userProfile?.organisation_id ? (
            <div className="border-2 border-yellow-300 bg-yellow-50 rounded p-4">
              <p className="text-yellow-800">You are not associated with an organisation yet.</p>
            </div>
          ) : (
            <div className="space-y-6">
              <div>
                <label htmlFor="org-name" className="block text-sm font-medium text-gray-700 mb-2">
                  Organisation Name
                </label>
                <input
                  id="org-name"
                  type="text"
                  value={orgName}
                  onChange={(e) => setOrgName(e.target.value)}
                  className="w-full border-gray-300 rounded-md shadow-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-500"
                  placeholder="Enter organisation name"
                />
              </div>

              <div>
                <label htmlFor="org-logo" className="block text-sm font-medium text-gray-700 mb-2">
                  Organisation Logo
                </label>
                <div className="flex items-center gap-4">
                  {orgSettings?.logo_url && !selectedLogo && (
                    <img
                      src={orgSettings.logo_url}
                      alt="Organisation logo"
                      className="h-16 w-16 object-contain border border-gray-200 rounded"
                    />
                  )}
                  <input
                    id="org-logo"
                    type="file"
                    accept="image/*"
                    onChange={(e) => setSelectedLogo(e.target.files?.[0] || null)}
                    className="flex-1"
                  />
                </div>
                {selectedLogo && (
                  <p className="text-sm text-gray-500 mt-2">
                    Selected: {selectedLogo.name}
                  </p>
                )}
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label htmlFor="primary-color" className="block text-sm font-medium text-gray-700 mb-2">
                    Primary Color
                  </label>
                  <input
                    id="primary-color"
                    type="color"
                    value={primaryColor}
                    onChange={(e) => setPrimaryColor(e.target.value)}
                    className="h-10 w-full border-gray-300 rounded-md"
                  />
                </div>
                <div>
                  <label htmlFor="secondary-color" className="block text-sm font-medium text-gray-700 mb-2">
                    Secondary Color
                  </label>
                  <input
                    id="secondary-color"
                    type="color"
                    value={secondaryColor}
                    onChange={(e) => setSecondaryColor(e.target.value)}
                    className="h-10 w-full border-gray-300 rounded-md"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="report-template" className="block text-sm font-medium text-gray-700 mb-2">
                  Report Template
                </label>
                <select
                  id="report-template"
                  value={reportTemplate}
                  onChange={(e) => setReportTemplate(e.target.value as 'standard' | 'detailed' | 'executive')}
                  className="w-full border-gray-300 rounded-md shadow-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-500"
                >
                  <option value="standard">Standard (Balanced detail)</option>
                  <option value="detailed">Detailed (Comprehensive)</option>
                  <option value="executive">Executive (High-level summary)</option>
                </select>
              </div>

              <button
                onClick={handleSaveOrganisation}
                disabled={updateOrgSettings.isPending || uploadLogo.isPending}
                className="flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
              >
                {(updateOrgSettings.isPending || uploadLogo.isPending) ? (
                  <>
                    <Loader2 className="h-5 w-5 animate-spin" />
                    Saving...
                  </>
                ) : (
                  <>
                    <Save className="h-5 w-5" />
                    Save Settings
                  </>
                )}
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

// Import React for useEffect
import * as React from 'react';
