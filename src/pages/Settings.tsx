import { Header } from '../components/layout/Header';
import { Card, Button, Input } from '../components/ui';
import { trainerInfo } from '../data/mock';
import { Save, User, Bell, Shield } from 'lucide-react';

export function Settings() {
  return (
    <div>
      <Header title="Settings" subtitle="Manage your account and preferences" />
      <main className="p-8 max-w-3xl">
        <div className="space-y-6">
          {/* Profile */}
          <Card>
            <div className="flex items-center gap-3 mb-6">
              <User size={20} className="text-brand-600" />
              <h3 className="text-base font-semibold text-neutral-950">Profile</h3>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <Input label="Full Name" defaultValue={trainerInfo.name} />
              <Input label="Email" defaultValue={trainerInfo.email} type="email" />
              <Input label="Organization" defaultValue={trainerInfo.company} />
              <Input label="Trainer ID" defaultValue={trainerInfo.trainerId} disabled />
            </div>
            <div className="mt-4">
              <Input
                label="Certifications"
                defaultValue={trainerInfo.certifications.join(', ')}
              />
            </div>
            <div className="mt-4 flex justify-end">
              <Button size="sm" icon={<Save size={14} />}>Save Changes</Button>
            </div>
          </Card>

          {/* Notifications */}
          <Card>
            <div className="flex items-center gap-3 mb-6">
              <Bell size={20} className="text-brand-600" />
              <h3 className="text-base font-semibold text-neutral-950">Notifications</h3>
            </div>
            <div className="space-y-4">
              {[
                { label: 'New enrollment alerts', desc: 'Get notified when a worker enrolls in your session', default: true },
                { label: 'Expiry reminders', desc: 'Receive reminders before worker certifications expire', default: true },
                { label: 'AI review notifications', desc: 'Get notified when AI flags an enrollment for review', default: true },
                { label: 'Weekly digest', desc: 'Receive a weekly summary of all training activity', default: false },
              ].map(item => (
                <div key={item.label} className="flex items-center justify-between py-2">
                  <div>
                    <p className="text-sm font-medium text-neutral-800">{item.label}</p>
                    <p className="text-xs text-neutral-500">{item.desc}</p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input type="checkbox" defaultChecked={item.default} className="sr-only peer" />
                    <div className="w-9 h-5 bg-neutral-200 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-brand-600/20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:border-neutral-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-brand-600" />
                  </label>
                </div>
              ))}
            </div>
          </Card>

          {/* Security */}
          <Card>
            <div className="flex items-center gap-3 mb-6">
              <Shield size={20} className="text-brand-600" />
              <h3 className="text-base font-semibold text-neutral-950">Security</h3>
            </div>
            <div className="space-y-4">
              <Input label="Current Password" type="password" placeholder="Enter current password" />
              <div className="grid grid-cols-2 gap-4">
                <Input label="New Password" type="password" placeholder="Enter new password" />
                <Input label="Confirm Password" type="password" placeholder="Confirm new password" />
              </div>
              <div className="flex justify-end">
                <Button size="sm" variant="outline" icon={<Shield size={14} />}>Update Password</Button>
              </div>
            </div>
          </Card>
        </div>
      </main>
    </div>
  );
}
