import { type FC, useState } from 'react';
import { useTheme } from '../AdminDashboard';

const SettingsPage: FC = () => {
  const { theme } = useTheme();
  
  // Theme classes
  const tc = {
    bg: theme === 'dark' ? 'bg-slate-800/50' : 'bg-white',
    bgSolid: theme === 'dark' ? 'bg-slate-800' : 'bg-gray-50',
    bgHover: theme === 'dark' ? 'hover:bg-slate-700/20' : 'hover:bg-gray-50',
    text: theme === 'dark' ? 'text-white' : 'text-gray-900',
    textMuted: theme === 'dark' ? 'text-slate-400' : 'text-gray-600',
    textSubtle: theme === 'dark' ? 'text-slate-500' : 'text-gray-500',
    border: theme === 'dark' ? 'border-slate-700/50' : 'border-gray-200',
    borderSolid: theme === 'dark' ? 'border-slate-600' : 'border-gray-300',
    input: theme === 'dark' ? 'bg-slate-700/50 border-slate-600/50' : 'bg-white border-gray-300',
    card: theme === 'dark' ? 'bg-transparent border-white/10' : 'bg-white border-gray-200 shadow-sm',
    settingItem: theme === 'dark' ? 'bg-slate-700/30' : 'bg-gray-50',
    toggle: theme === 'dark' ? 'bg-slate-600' : 'bg-gray-300',
    sidebarActive: theme === 'dark' ? 'bg-yellow-500/20' : 'bg-yellow-500/10',
    sidebarHover: theme === 'dark' ? 'hover:bg-slate-700/50' : 'hover:bg-gray-100',
  };

  const [settings, setSettings] = useState({
    siteName: 'SSB - منصة الطلاب السوريين',
    siteDescription: 'منصة تجمع الطلاب السوريين وتوفر لهم الفرص التعليمية والتدريبية',
    contactEmail: 'info@ssb-platform.com',
    contactPhone: '+963 xxx xxx xxx',
    socialLinks: {
      facebook: 'https://facebook.com/ssb',
      twitter: 'https://twitter.com/ssb',
      instagram: 'https://instagram.com/ssb',
      linkedin: 'https://linkedin.com/company/ssb',
    },
    notifications: {
      emailNotifications: true,
      pushNotifications: true,
      weeklyDigest: false,
    },
    appearance: {
      theme: 'dark',
      language: 'ar',
      direction: 'rtl',
    },
  });

  const [activeSection, setActiveSection] = useState('general');
  const [saved, setSaved] = useState(false);

  const handleSave = () => {
    // Simulate save
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  const sections = [
    { id: 'general', label: 'الإعدادات العامة', icon: 'M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z' },
    { id: 'appearance', label: 'المظهر', icon: 'M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01' },
    { id: 'notifications', label: 'الإشعارات', icon: 'M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9' },
    { id: 'security', label: 'الأمان', icon: 'M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z' },
    { id: 'integrations', label: 'التكاملات', icon: 'M11 4a2 2 0 114 0v1a1 1 0 001 1h3a1 1 0 011 1v3a1 1 0 01-1 1h-1a2 2 0 100 4h1a1 1 0 011 1v3a1 1 0 01-1 1h-3a1 1 0 01-1-1v-1a2 2 0 10-4 0v1a1 1 0 01-1 1H7a1 1 0 01-1-1v-3a1 1 0 00-1-1H4a2 2 0 110-4h1a1 1 0 001-1V7a1 1 0 011-1h3a1 1 0 001-1V4z' },
  ];

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <span className="text-[11px] font-bold uppercase tracking-[0.18em] text-teal-300">التخصيص والحماية</span>
          <h2 className={`mt-2 text-2xl font-extrabold tracking-tight ${tc.text} sm:text-3xl`}>الإعدادات</h2>
          <p className={`mt-1 ${tc.textMuted}`}>إدارة إعدادات المنصة والتفضيلات</p>
        </div>
        <button
          onClick={handleSave}
          className={`flex items-center justify-center gap-2 rounded-xl px-5 py-3 font-extrabold transition-all ${
            saved
              ? 'bg-emerald-500 text-white'
              : 'border border-amber-300/70 bg-transparent text-amber-200 hover:bg-amber-300/10'
          }`}
        >
          {saved ? (
            <>
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              تم الحفظ
            </>
          ) : (
            <>
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1 4l-3 3m0 0l-3-3m3 3V4" />
              </svg>
              حفظ التغييرات
            </>
          )}
        </button>
      </div>

      <div className="grid grid-cols-1 gap-6 xl:grid-cols-4">
        {/* Sidebar */}
        <div className={`${tc.card} h-fit rounded-2xl border p-3`}>
          <nav className="space-y-1">
            {sections.map((section) => (
              <button
                key={section.id}
                onClick={() => setActiveSection(section.id)}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-right transition-all ${
                  activeSection === section.id
                    ? `${tc.sidebarActive} text-yellow-400`
                    : `${tc.textMuted} hover:${tc.text} ${tc.sidebarHover}`
                }`}
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={section.icon} />
                </svg>
                {section.label}
              </button>
            ))}
          </nav>
        </div>

        {/* Settings Content */}
        <div className="space-y-6 xl:col-span-3">
          {/* General Settings */}
          {activeSection === 'general' && (
            <div className={`${tc.card} rounded-2xl border p-6 space-y-6`}>
              <h3 className={`text-lg font-bold ${tc.text}`}>الإعدادات العامة</h3>
              
              <div className="space-y-4">
                <div>
                  <label className={`block ${tc.text} font-medium mb-2`}>اسم الموقع</label>
                  <input
                    type="text"
                    value={settings.siteName}
                    onChange={(e) => setSettings({ ...settings, siteName: e.target.value })}
                    className={`w-full ${tc.input} border rounded-xl px-4 py-3 ${tc.text} focus:outline-none focus:border-yellow-500`}
                  />
                </div>

                <div>
                  <label className={`block ${tc.text} font-medium mb-2`}>وصف الموقع</label>
                  <textarea
                    value={settings.siteDescription}
                    onChange={(e) => setSettings({ ...settings, siteDescription: e.target.value })}
                    rows={3}
                    className={`w-full ${tc.input} border rounded-xl px-4 py-3 ${tc.text} resize-none focus:outline-none focus:border-yellow-500`}
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className={`block ${tc.text} font-medium mb-2`}>البريد الإلكتروني</label>
                    <input
                      type="email"
                      value={settings.contactEmail}
                      onChange={(e) => setSettings({ ...settings, contactEmail: e.target.value })}
                      className={`w-full ${tc.input} border rounded-xl px-4 py-3 ${tc.text} focus:outline-none focus:border-yellow-500`}
                    />
                  </div>
                  <div>
                    <label className={`block ${tc.text} font-medium mb-2`}>رقم الهاتف</label>
                    <input
                      type="tel"
                      value={settings.contactPhone}
                      onChange={(e) => setSettings({ ...settings, contactPhone: e.target.value })}
                      className={`w-full ${tc.input} border rounded-xl px-4 py-3 ${tc.text} focus:outline-none focus:border-yellow-500`}
                    />
                  </div>
                </div>
              </div>

              <div className={`pt-4 border-t ${tc.border}`}>
                <h4 className={`${tc.text} font-medium mb-4`}>روابط التواصل الاجتماعي</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {Object.entries(settings.socialLinks).map(([platform, url]) => (
                    <div key={platform} className="flex items-center gap-3">
                      <span className={`${tc.textMuted} capitalize w-24`}>{platform}</span>
                      <input
                        type="url"
                        value={url}
                        onChange={(e) => setSettings({
                          ...settings,
                          socialLinks: { ...settings.socialLinks, [platform]: e.target.value }
                        })}
                        className={`flex-1 ${tc.input} border rounded-xl px-4 py-2 ${tc.text} text-sm focus:outline-none focus:border-yellow-500`}
                      />
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Appearance Settings */}
          {activeSection === 'appearance' && (
            <div className={`${tc.card} rounded-2xl border p-6 space-y-6`}>
              <h3 className={`text-lg font-bold ${tc.text}`}>إعدادات المظهر</h3>
              
              <div className="space-y-6">
                <div>
                  <label className={`block ${tc.text} font-medium mb-3`}>السمة</label>
                  <div className="grid grid-cols-3 gap-4">
                    {['light', 'dark', 'auto'].map((themeOption) => (
                      <button
                        key={themeOption}
                        onClick={() => setSettings({
                          ...settings,
                          appearance: { ...settings.appearance, theme: themeOption }
                        })}
                        className={`p-4 rounded-xl border-2 transition-all ${
                          settings.appearance.theme === themeOption
                            ? 'border-yellow-500 bg-yellow-500/10'
                            : `${tc.borderSolid} hover:border-yellow-500/50`
                        }`}
                      >
                        <div className={`w-8 h-8 mx-auto rounded-lg mb-2 ${
                          themeOption === 'light' ? 'bg-white border border-gray-300' :
                          themeOption === 'dark' ? 'bg-slate-800' :
                          'bg-gradient-to-r from-white to-slate-800'
                        }`} />
                        <span className={tc.text}>
                          {themeOption === 'light' ? 'فاتح' : themeOption === 'dark' ? 'داكن' : 'تلقائي'}
                        </span>
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className={`block ${tc.text} font-medium mb-3`}>اللغة</label>
                  <select
                    value={settings.appearance.language}
                    onChange={(e) => setSettings({
                      ...settings,
                      appearance: { ...settings.appearance, language: e.target.value }
                    })}
                    className={`w-full ${tc.input} border rounded-xl px-4 py-3 ${tc.text} focus:outline-none focus:border-yellow-500`}
                  >
                    <option value="ar">العربية</option>
                    <option value="en">English</option>
                  </select>
                </div>

                <div>
                  <label className={`block ${tc.text} font-medium mb-3`}>اتجاه النص</label>
                  <div className="flex gap-4">
                    <button
                      onClick={() => setSettings({
                        ...settings,
                        appearance: { ...settings.appearance, direction: 'rtl' }
                      })}
                      className={`flex-1 p-4 rounded-xl border-2 transition-all ${
                        settings.appearance.direction === 'rtl'
                          ? 'border-yellow-500 bg-yellow-500/10'
                          : `${tc.borderSolid} hover:border-yellow-500/50`
                      }`}
                    >
                      <span className={tc.text}>من اليمين لليسار (RTL)</span>
                    </button>
                    <button
                      onClick={() => setSettings({
                        ...settings,
                        appearance: { ...settings.appearance, direction: 'ltr' }
                      })}
                      className={`flex-1 p-4 rounded-xl border-2 transition-all ${
                        settings.appearance.direction === 'ltr'
                          ? 'border-yellow-500 bg-yellow-500/10'
                          : `${tc.borderSolid} hover:border-yellow-500/50`
                      }`}
                    >
                      <span className={tc.text}>من اليسار لليمين (LTR)</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Notification Settings */}
          {activeSection === 'notifications' && (
            <div className={`${tc.card} rounded-2xl border p-6 space-y-6`}>
              <h3 className={`text-lg font-bold ${tc.text}`}>إعدادات الإشعارات</h3>
              
              <div className="space-y-4">
                {[
                  { key: 'emailNotifications', label: 'إشعارات البريد الإلكتروني', description: 'استلام التحديثات والأخبار عبر البريد الإلكتروني' },
                  { key: 'pushNotifications', label: 'الإشعارات الفورية', description: 'استلام إشعارات المتصفح في الوقت الفعلي' },
                  { key: 'weeklyDigest', label: 'الملخص الأسبوعي', description: 'استلام ملخص أسبوعي بأهم الأخبار والتحديثات' },
                ].map((notification) => (
                  <div
                    key={notification.key}
                    className={`flex items-center justify-between p-4 ${tc.settingItem} rounded-xl`}
                  >
                    <div>
                      <p className={`${tc.text} font-medium`}>{notification.label}</p>
                      <p className={`${tc.textSubtle} text-sm`}>{notification.description}</p>
                    </div>
                    <button
                      onClick={() => setSettings({
                        ...settings,
                        notifications: {
                          ...settings.notifications,
                          [notification.key]: !settings.notifications[notification.key as keyof typeof settings.notifications]
                        }
                      })}
                      className={`relative w-14 h-7 rounded-full transition-all ${
                        settings.notifications[notification.key as keyof typeof settings.notifications]
                          ? 'bg-yellow-500'
                          : tc.toggle
                      }`}
                    >
                      <div
                        className={`absolute top-1 w-5 h-5 bg-white rounded-full transition-all ${
                          settings.notifications[notification.key as keyof typeof settings.notifications]
                            ? 'right-1'
                            : 'right-8'
                        }`}
                      />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Security Settings */}
          {activeSection === 'security' && (
            <div className={`${tc.card} rounded-2xl border p-6 space-y-6`}>
              <h3 className={`text-lg font-bold ${tc.text}`}>إعدادات الأمان</h3>
              
              <div className="space-y-4">
                <div className={`p-4 ${tc.settingItem} rounded-xl`}>
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <p className={`${tc.text} font-medium`}>تغيير كلمة المرور</p>
                      <p className={`${tc.textSubtle} text-sm`}>آخر تغيير: منذ 30 يوم</p>
                    </div>
                    <button className="px-4 py-2 bg-blue-500/20 text-blue-400 rounded-lg hover:bg-blue-500/30">
                      تغيير
                    </button>
                  </div>
                </div>

                <div className={`p-4 ${tc.settingItem} rounded-xl`}>
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <p className={`${tc.text} font-medium`}>المصادقة الثنائية</p>
                      <p className={`${tc.textSubtle} text-sm`}>غير مفعّل</p>
                    </div>
                    <button className="px-4 py-2 bg-emerald-500/20 text-emerald-400 rounded-lg hover:bg-emerald-500/30">
                      تفعيل
                    </button>
                  </div>
                </div>

                <div className={`p-4 ${tc.settingItem} rounded-xl`}>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className={`${tc.text} font-medium`}>الجلسات النشطة</p>
                      <p className={`${tc.textSubtle} text-sm`}>3 أجهزة متصلة حالياً</p>
                    </div>
                    <button className="px-4 py-2 bg-red-500/20 text-red-400 rounded-lg hover:bg-red-500/30">
                      إدارة
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Integrations Settings */}
          {activeSection === 'integrations' && (
            <div className={`${tc.card} rounded-2xl border p-6 space-y-6`}>
              <h3 className={`text-lg font-bold ${tc.text}`}>التكاملات</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {[
                  { name: 'Google Analytics', status: 'متصل', connected: true, icon: '📊' },
                  { name: 'Telegram Bot', status: 'غير متصل', connected: false, icon: '🤖' },
                  { name: 'Mailchimp', status: 'متصل', connected: true, icon: '📧' },
                  { name: 'Slack', status: 'غير متصل', connected: false, icon: '💬' },
                ].map((integration) => (
                  <div
                    key={integration.name}
                    className={`p-4 ${tc.settingItem} rounded-xl flex items-center justify-between`}
                  >
                    <div className="flex items-center gap-3">
                      <span className="text-2xl">{integration.icon}</span>
                      <div>
                        <p className={`${tc.text} font-medium`}>{integration.name}</p>
                        <p className={`text-sm ${integration.connected ? 'text-emerald-400' : tc.textSubtle}`}>
                          {integration.status}
                        </p>
                      </div>
                    </div>
                    <button
                      className={`px-4 py-2 rounded-lg ${
                        integration.connected
                          ? 'bg-red-500/20 text-red-400 hover:bg-red-500/30'
                          : 'bg-emerald-500/20 text-emerald-400 hover:bg-emerald-500/30'
                      }`}
                    >
                      {integration.connected ? 'قطع الاتصال' : 'ربط'}
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SettingsPage;
