import { memo, useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Bell, BellRing } from 'lucide-react';
import { toast } from '@/lib/toast';

interface NotificationSettings {
  browserNotifications: boolean;
  taskAssignments: boolean;
  statusUpdates: boolean;
  realTimeUpdates: boolean;
}

/**
 * Component for managing notification preferences
 */
function NotificationPreferences() {
  const [settings, setSettings] = useState<NotificationSettings>({
    browserNotifications: false,
    taskAssignments: true,
    statusUpdates: true,
    realTimeUpdates: true,
  });

  const [notificationPermission, setNotificationPermission] = useState<NotificationPermission>('default');

  useEffect(() => {
    // Load settings from localStorage
    const savedSettings = localStorage.getItem('notificationSettings');
    if (savedSettings) {
      setSettings(JSON.parse(savedSettings));
    }

    // Check current notification permission
    if (typeof Notification !== 'undefined') {
      setNotificationPermission(Notification.permission);
    }
  }, []);

  const updateSetting = (key: keyof NotificationSettings, value: boolean) => {
    const newSettings = { ...settings, [key]: value };
    setSettings(newSettings);
    localStorage.setItem('notificationSettings', JSON.stringify(newSettings));
    
    toast.success('Notification preferences updated');
  };

  const requestNotificationPermission = async () => {
    if (typeof Notification !== 'undefined' && Notification.permission === 'default') {
      const permission = await Notification.requestPermission();
      setNotificationPermission(permission);
      
      if (permission === 'granted') {
        updateSetting('browserNotifications', true);
        toast.success('Browser notifications enabled');
      } else {
        toast.error('Browser notifications denied');
      }
    }
  };

  return (
    <Card className="w-full max-w-md">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <BellRing size={20} />
          Notification Preferences
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center justify-between">
          <Label htmlFor="browser-notifications" className="flex items-center gap-2">
            <Bell size={16} />
            Browser Notifications
          </Label>
          <div className="flex items-center gap-2">
            {notificationPermission === 'default' && (
              <Button 
                size="sm" 
                variant="outline"
                onClick={requestNotificationPermission}
              >
                Enable
              </Button>
            )}
            <Switch
              id="browser-notifications"
              checked={settings.browserNotifications && notificationPermission === 'granted'}
              onCheckedChange={(value) => updateSetting('browserNotifications', value)}
              disabled={notificationPermission !== 'granted'}
            />
          </div>
        </div>

        <div className="flex items-center justify-between">
          <Label htmlFor="task-assignments">Task Assignments</Label>
          <Switch
            id="task-assignments"
            checked={settings.taskAssignments}
            onCheckedChange={(value) => updateSetting('taskAssignments', value)}
          />
        </div>

        <div className="flex items-center justify-between">
          <Label htmlFor="status-updates">Status Updates</Label>
          <Switch
            id="status-updates"
            checked={settings.statusUpdates}
            onCheckedChange={(value) => updateSetting('statusUpdates', value)}
          />
        </div>

        <div className="flex items-center justify-between">
          <Label htmlFor="realtime-updates">Real-time Updates</Label>
          <Switch
            id="realtime-updates"
            checked={settings.realTimeUpdates}
            onCheckedChange={(value) => updateSetting('realTimeUpdates', value)}
          />
        </div>

        {notificationPermission === 'denied' && (
          <div className="text-sm text-muted-foreground bg-amber-50 border border-amber-200 rounded-md p-3">
            Browser notifications are blocked. Please enable them in your browser settings to receive notifications.
          </div>
        )}
      </CardContent>
    </Card>
  );
}

export default memo(NotificationPreferences); 