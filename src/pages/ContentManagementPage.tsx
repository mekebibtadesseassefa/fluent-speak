import { useState, useCallback } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Switch } from '@/components/ui/switch';
import { Textarea } from '@/components/ui/textarea';
import {
  CheckCircle, XCircle, Eye, Search, Clock, FileText, Globe, Calendar as CalendarIcon, Layers, ChevronLeft, ChevronRight,
} from 'lucide-react';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { contentItems, contentFrameworks, type ContentItem } from '@/lib/mock-data';
import { useToast } from '@/hooks/use-toast';

const STATUS_BADGE: Record<ContentItem['status'], { label: string; className: string }> = {
  draft: { label: 'Draft', className: 'bg-muted text-muted-foreground' },
  review: { label: 'In Review', className: 'bg-accent/15 text-accent border-accent/30' },
  published: { label: 'Published', className: 'bg-success/15 text-success border-success/30' },
  archived: { label: 'Archived', className: 'bg-muted text-muted-foreground' },
};

const LANG_FLAG: Record<string, string> = { EN: '🇬🇧', ES: '🇪🇸', FR: '🇫🇷', PT: '🇧🇷' };

function formatDuration(s: number) {
  const m = Math.floor(s / 60);
  return `${m} min`;
}

// ─── Approval Queue Tab ───
function ApprovalQueue() {
  const [filter, setFilter] = useState<string>('review');
  const [search, setSearch] = useState('');
  const [items, setItems] = useState(contentItems);
  const [rejectReason, setRejectReason] = useState('');
  const { toast } = useToast();

  const handleApprove = useCallback((id: string, title: string) => {
    setItems((prev) => prev.map((i) => i.id === id ? { ...i, status: 'published' as const } : i));
    toast({ title: 'Content Approved', description: `"${title}" has been published.` });
  }, [toast]);

  const handleReject = useCallback((id: string, title: string) => {
    setItems((prev) => prev.map((i) => i.id === id ? { ...i, status: 'draft' as const } : i));
    toast({ title: 'Content Rejected', description: `"${title}" was sent back to draft.${rejectReason ? ` Reason: ${rejectReason}` : ''}`, variant: 'destructive' });
    setRejectReason('');
  }, [toast, rejectReason]);

  const filtered = items.filter((item) => {
    if (filter !== 'all' && item.status !== filter) return false;
    if (search && !item.title.toLowerCase().includes(search.toLowerCase())) return false;
    return true;
  });

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input placeholder="Search content..." value={search} onChange={(e) => setSearch(e.target.value)} className="pl-9" />
        </div>
        <Select value={filter} onValueChange={setFilter}>
          <SelectTrigger className="w-40"><SelectValue /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All statuses</SelectItem>
            <SelectItem value="review">In Review</SelectItem>
            <SelectItem value="draft">Draft</SelectItem>
            <SelectItem value="published">Published</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Title</TableHead>
              <TableHead>Framework</TableHead>
              <TableHead>Lang</TableHead>
              <TableHead>Level</TableHead>
              <TableHead>Duration</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Curator</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filtered.map((item) => {
              const badge = STATUS_BADGE[item.status];
              return (
                <TableRow key={item.id}>
                  <TableCell className="font-medium max-w-[220px] truncate">{item.title}</TableCell>
                  <TableCell className="text-xs text-muted-foreground">{item.framework}</TableCell>
                  <TableCell>{LANG_FLAG[item.language] ?? item.language} {item.language}</TableCell>
                  <TableCell><Badge variant="outline" className="text-xs">{item.levelRange}</Badge></TableCell>
                  <TableCell className="text-muted-foreground text-xs">{formatDuration(item.durationSeconds)}</TableCell>
                  <TableCell><Badge className={badge.className}>{badge.label}</Badge></TableCell>
                  <TableCell className="text-xs text-muted-foreground">{item.curator}</TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-1">
                      <Button size="icon" variant="ghost" className="h-7 w-7"><Eye className="h-3.5 w-3.5" /></Button>
                      {item.status === 'review' && (
                        <>
                          <Button size="icon" variant="ghost" className="h-7 w-7 text-success hover:text-success" onClick={() => handleApprove(item.id, item.title)}><CheckCircle className="h-3.5 w-3.5" /></Button>
                          <AlertDialog>
                            <AlertDialogTrigger asChild>
                              <Button size="icon" variant="ghost" className="h-7 w-7 text-destructive hover:text-destructive"><XCircle className="h-3.5 w-3.5" /></Button>
                            </AlertDialogTrigger>
                            <AlertDialogContent>
                              <AlertDialogHeader>
                                <AlertDialogTitle>Reject this content?</AlertDialogTitle>
                                <AlertDialogDescription>
                                  "<span className="font-semibold">{item.title}</span>" will be sent back to draft. The curator will need to revise and resubmit.
                                </AlertDialogDescription>
                              </AlertDialogHeader>
                              <Textarea
                                placeholder="Reason for rejection (optional)..."
                                value={rejectReason}
                                onChange={(e) => setRejectReason(e.target.value)}
                                className="min-h-[80px]"
                              />
                              <AlertDialogFooter>
                                <AlertDialogCancel onClick={() => setRejectReason('')}>Cancel</AlertDialogCancel>
                                <AlertDialogAction className="bg-destructive text-destructive-foreground hover:bg-destructive/90" onClick={() => handleReject(item.id, item.title)}>Reject</AlertDialogAction>
                              </AlertDialogFooter>
                            </AlertDialogContent>
                          </AlertDialog>
                        </>
                      )}
                    </div>
                  </TableCell>
                </TableRow>
              );
            })}
            {filtered.length === 0 && (
              <TableRow><TableCell colSpan={8} className="text-center py-8 text-muted-foreground">No content items found.</TableCell></TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}

// ─── Publishing Calendar Tab ───
function PublishingCalendar() {
  const [weekOffset, setWeekOffset] = useState(0);
  const baseWeek = 8; // current ISO week for mock
  const displayWeeks = [0, 1, 2, 3].map((i) => baseWeek + i + weekOffset);

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <p className="text-sm text-muted-foreground">Content scheduled per ISO week — drag items to reschedule (mock).</p>
        <div className="flex items-center gap-2">
          <Button size="icon" variant="outline" className="h-8 w-8" onClick={() => setWeekOffset((w) => w - 1)}>
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <span className="text-sm font-medium min-w-[100px] text-center">Weeks {displayWeeks[0]}–{displayWeeks[3]}</span>
          <Button size="icon" variant="outline" className="h-8 w-8" onClick={() => setWeekOffset((w) => w + 1)}>
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
        {displayWeeks.map((week) => {
          const items = contentItems.filter((c) => c.publishedWeek === week && c.publishedYear === 2026);
          return (
            <Card key={week} className="min-h-[200px]">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-semibold flex items-center gap-2">
                  <CalendarIcon className="h-4 w-4 text-primary" />
                  Week {week}
                </CardTitle>
                <CardDescription className="text-xs">{items.length} item{items.length !== 1 ? 's' : ''} scheduled</CardDescription>
              </CardHeader>
              <CardContent className="space-y-2">
                {items.length === 0 && <p className="text-xs text-muted-foreground italic py-4 text-center">No content scheduled</p>}
                {items.map((item) => {
                  const badge = STATUS_BADGE[item.status];
                  return (
                    <div key={item.id} className="rounded-md border p-2.5 space-y-1 bg-muted/30 hover:bg-muted/60 transition-colors cursor-pointer">
                      <p className="text-xs font-medium leading-tight truncate">{item.title}</p>
                      <div className="flex items-center gap-1.5 flex-wrap">
                        <span className="text-[10px]">{LANG_FLAG[item.language]}</span>
                        <Badge variant="outline" className="text-[10px] px-1.5 py-0">{item.levelRange}</Badge>
                        <Badge className={`${badge.className} text-[10px] px-1.5 py-0`}>{badge.label}</Badge>
                      </div>
                    </div>
                  );
                })}
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}

// ─── Frameworks Tab ───
function FrameworksList() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
      {contentFrameworks.map((fw) => (
        <Card key={fw.id} className="relative overflow-hidden">
          <div className={`absolute top-0 left-0 w-1 h-full ${fw.color}`} />
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <CardTitle className="text-base font-semibold">{fw.name}</CardTitle>
              <Switch checked={fw.active} />
            </div>
            <CardDescription className="text-xs">{fw.description}</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-4 text-xs text-muted-foreground">
              <span className="flex items-center gap-1"><Layers className="h-3.5 w-3.5" />{fw.itemCount} items</span>
              <span className="flex items-center gap-1"><Globe className="h-3.5 w-3.5" />{fw.sourceType}</span>
            </div>
            <div className="flex items-center gap-2 mt-3">
              <Button size="sm" variant="outline" className="text-xs h-7">Edit</Button>
              <Button size="sm" variant="ghost" className="text-xs h-7">View Items</Button>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}

// ─── Main Page ───
export default function ContentManagementPage() {
  const reviewCount = contentItems.filter((i) => i.status === 'review').length;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Content Management</h1>
        <p className="text-muted-foreground mt-1">Curate, review, and schedule weekly content across all frameworks.</p>
      </div>

      {/* Summary cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: 'Pending Review', value: reviewCount, icon: Clock, color: 'text-accent' },
          { label: 'Published', value: contentItems.filter((i) => i.status === 'published').length, icon: CheckCircle, color: 'text-success' },
          { label: 'Total Items', value: contentItems.length, icon: FileText, color: 'text-primary' },
          { label: 'Active Frameworks', value: contentFrameworks.filter((f) => f.active).length, icon: Layers, color: 'text-admin' },
        ].map((m) => (
          <Card key={m.label}>
            <CardContent className="p-4 flex items-center gap-3">
              <m.icon className={`h-8 w-8 ${m.color}`} />
              <div>
                <p className="text-2xl font-bold">{m.value}</p>
                <p className="text-xs text-muted-foreground">{m.label}</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Tabs */}
      <Tabs defaultValue="queue" className="space-y-4">
        <TabsList>
          <TabsTrigger value="queue">
            Approval Queue
            {reviewCount > 0 && <Badge className="ml-1.5 h-5 min-w-5 px-1.5 text-[10px] bg-accent text-accent-foreground">{reviewCount}</Badge>}
          </TabsTrigger>
          <TabsTrigger value="calendar">Publishing Calendar</TabsTrigger>
          <TabsTrigger value="frameworks">Frameworks</TabsTrigger>
        </TabsList>

        <TabsContent value="queue"><ApprovalQueue /></TabsContent>
        <TabsContent value="calendar"><PublishingCalendar /></TabsContent>
        <TabsContent value="frameworks"><FrameworksList /></TabsContent>
      </Tabs>
    </div>
  );
}
