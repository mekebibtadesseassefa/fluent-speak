import { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { defaultFeatureFlags, type FeatureFlag } from '@/lib/mock-data';

export default function FeatureFlagsPage() {
  const [flags, setFlags] = useState<FeatureFlag[]>(defaultFeatureFlags);

  const toggle = (id: string) => {
    setFlags((prev) => prev.map((f) => (f.id === id ? { ...f, enabled: !f.enabled } : f)));
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-navy">Feature Flags</h1>
        <p className="text-sm text-muted-foreground">Toggle platform features without code deployment</p>
      </div>

      <div className="space-y-3">
        {flags.map((f) => (
          <Card key={f.id}>
            <CardContent className="p-4 flex items-center justify-between gap-4">
              <div className="flex-1">
                <p className="font-medium text-foreground">{f.name}</p>
                <p className="text-sm text-muted-foreground">{f.description}</p>
              </div>
              <Switch checked={f.enabled} onCheckedChange={() => toggle(f.id)} />
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
