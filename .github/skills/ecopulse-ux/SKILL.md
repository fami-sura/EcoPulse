# EcoPulse UI/UX Design Skill

**Purpose:** Guide AI coding agents in implementing user-centered, Africa-first UI/UX patterns for the EcoPulse platform, grounded in real user personas, accessibility requirements, and community-driven design thinking.

**When to use:** Building or modifying any user-facing component, screen, or interaction flow in the EcoPulse application.

---

## Core Design Philosophy

### African Community Design Principles 🌍

EcoPulse is built for **Sub-Saharan African communities** (Nigeria, Kenya, Ghana, Uganda) where traditional civic tech assumptions don't apply:

**Target User Context:**

- **Low-Literacy:** 40-60% literacy rates in rural areas require icon-driven UI, voice notes, and visual flows
- **Limited Connectivity:** 2G/3G networks demand offline-first architecture, SMS fallbacks, and optimized bandwidth
- **Limited Government Trust:** Users can't rely on funding announcements—they need tangible impact metrics ("15 kg trash removed")
- **Strong Community Bonds:** Neighbors help neighbors; trust is built through social proof, not official systems
- **Mobile-First Reality:** 60%+ smartphone penetration, desktop rare in villages

**Design Imperatives (Non-Negotiable):**

1. **Icon-Driven UI** — Use Hugeicons library, minimal text labels, universal symbols
2. **Voice Notes Over Text** — Illiterate users record audio instead of typing
3. **Offline-First** — Local storage + sync, works on 2G, no constant internet required
4. **SMS Notifications** — Primary notification channel (works without data/smartphones)
5. **Educational by Design** — Teach users to act (not wait for government/NGO)
6. **Tangible Impact Metrics** — Show "15 kg waste removed", not "city funding unlocked"
7. **44px Touch Targets** — WCAG 2.1 AA compliance + mobile accessibility
8. **Resolution Verification** — Verify fixes (not problems) with before/after photos

---

## User Personas & Pain Points

### 1. Maria Rodriguez (Community Reporter, 34)

**Context:** Working mother in Oakland (Nigerian immigrant), reports environmental issues while walking kids to school.

**Pain Points:**

- ❌ **60-second window:** If reporting takes >1 minute, she abandons it
- ❌ **"Black hole" syndrome:** No visibility into what happens after she reports
- ❌ **Onboarding friction:** Account signup before seeing value = immediate bounce

**UI/UX Solutions:**

```typescript
// Lightning-fast report flow: FAB → Camera → Location → Category (icons) → Submit
<FloatingActionButton
  icon={<Camera size={24} />}
  label="Report Issue"
  onClick={() => openCameraDirectly()} // No permissions screen first
  className="fixed bottom-6 right-6 min-h-[60px] min-w-[60px] rounded-full"
/>

// Category selection with ICONS (no reading required)
const categories = [
  { icon: <Delete02 />, value: 'waste', label: 'Waste/Trash' },
  { icon: <Droplet />, value: 'drainage', label: 'Drainage/Water' },
  { icon: <Tree02 />, value: 'trees', label: 'Trees/Greenery' },
];

// Severity with visual cues (Hugeicons + color)
const severityLevels = [
  { icon: <FaceSmile />, value: 'low', color: 'text-green-600' },
  { icon: <FaceNeutral />, value: 'medium', color: 'text-amber-600' },
  { icon: <FaceSad />, value: 'high', color: 'text-red-600' },
];

// Voice note option (for illiterate users)
<VoiceNoteRecorder
  onRecordingComplete={(audioBlob) => uploadVoiceNote(audioBlob)}
  holdToRecord={true} // WhatsApp-style interaction
  maxDuration={120} // 2 minutes
/>
```

**Event Timeline (Not Status Labels):**

```typescript
// Show WHAT HAPPENED, not abstract states
const timeline = [
  { date: 'Dec 15', event: 'You reported overflowing bin', icon: <Flag /> },
  { date: 'Dec 16', event: 'Sara & James verified', icon: <Check2 /> },
  { date: 'Dec 17', event: 'Oakland Green Alliance scheduled cleanup', icon: <Zap /> },
  { date: 'Dec 21', event: 'Cleanup completed (15 kg waste removed)', icon: <CheckCircle /> },
];

<Timeline events={timeline} />
```

---

### 2. Sara Chen (Neighborhood Validator, 42)

**Context:** Stay-at-home mom, verifies issues while walking her dog, wants to feel her contributions matter.

**Pain Points:**

- ❌ **Invisible Labor:** Verification feels thankless with no recognition
- ❌ **Discovery Friction:** Can't find nearby unverified reports easily
- ❌ **No Reputation System:** No way to show "I'm a trusted verifier"

**UI/UX Solutions:**

```typescript
// Map filter: "Show unverified reports near me"
<MapFilters>
  <Toggle
    label="Unverified Only"
    icon={<EyeOff />}
    onChange={(enabled) => setShowUnverified(enabled)}
  />
  <RadiusSlider
    options={[0.5, 1, 2, 5]} // miles
    value={radiusMiles}
    onChange={setRadiusMiles}
  />
</MapFilters>

// Verification flow (resolution-focused)
<VerificationFlow issueId={issueId}>
  <PhotoComparison
    before={originalPhoto}
    after={resolutionPhoto}
    prompt="Can you confirm this is fixed?"
  />
  <VoiceNoteOption
    placeholder="Record: 'Yes, I checked - it's fixed!'"
  />
  <SubmitButton onClick={submitVerification} />
</VerificationFlow>

// Verifier reputation display
<ProfileBadge
  name="Sara Chen"
  badge="Trusted Verifier" // 10+ successful verifications
  accuracy="95%" // Verified issues that later resolved
  weeklyImpact="You verified 5 fixes this week, all confirmed by community"
/>
```

**Why Verify RESOLUTIONS (Not Problems):**

- Problems are self-evident (photo proves trash exists)
- **Fixes need community confirmation** (did cleanup actually happen?)
- Builds trust: "I saw it fixed with my own eyes"
- 2-verification threshold teaches illiterate users what's a "valid fix"

---

### 3. Linda Martinez (NGO Coordinator, 45)

**Context:** Oakland Green Alliance director, organizes cleanups, needs donor reports with minimal manual work.

**Pain Points:**

- ❌ **Repetitive Data Entry:** Closing 6 related issues one-by-one is tedious
- ❌ **No Auto-Prioritization:** Manually sorting urgent issues wastes time
- ❌ **Donor Reporting Pain:** 10 hours/month on CSV exports + photo compilation

**UI/UX Solutions:**

```typescript
// Bulk operations UI
<IssueList>
  <SelectAllCheckbox onChange={selectAllVisible} />
  {issues.map(issue => (
    <IssueCard
      key={issue.id}
      issue={issue}
      selectable={true}
      onSelect={toggleSelection}
    />
  ))}
  <BulkActions visible={selectedIssues.length > 0}>
    <Button onClick={() => createActionCardForSelected(selectedIssues)}>
      Create Action Card ({selectedIssues.length} issues)
    </Button>
    <Button onClick={() => closeAllWithProof(selectedIssues, proofPhoto)}>
      Close All with Proof Upload
    </Button>
  </BulkActions>
</IssueList>

// Auto-prioritization algorithm display
<PriorityInbox>
  <Header>
    <HelpTooltip content="Auto-sorted by: 3+ verifications, High severity, Vulnerable communities, Multiple reports" />
    High Priority (8 issues)
  </Header>
  {prioritizedIssues.map(issue => (
    <PriorityCard
      issue={issue}
      indicators={[
        { icon: <Users />, label: '6 related reports' },
        { icon: <Shield />, label: 'Vulnerable zip code' },
        { icon: <Check3 />, label: '4 verifications' },
      ]}
    />
  ))}
</PriorityInbox>

// One-click funder report export
<ExportButton
  label="Generate Monthly Report"
  onClick={async () => {
    const csv = await generateFunderReport({
      orgId,
      startDate,
      endDate,
      includePhotos: true, // Embeds photo URLs in CSV
    });
    downloadFile(csv, `ecopulse-report-${orgName}-${date}.csv`);
  }}
  loadingText="Generating report..."
  successMessage="Report downloaded! Time saved: 10 hours → 15 minutes"
/>
```

**CSV Export Schema (NFR42 - <0.1% Error Rate):**

```typescript
// Column structure for NGO donor reporting
const csvColumns = [
  'report_id',
  'created_at',
  'category',
  'severity',
  'status',
  'latitude',
  'longitude',
  'address',
  'zip_code',
  'reporter_name',
  'verification_count',
  'verified_by',
  'action_card_title',
  'resolution_date',
  'resolution_notes',
  'photo_urls', // Pipe-separated, 1-5 URLs
  'upvote_count',
  'org_assigned',
];

// Automated CI/CD validation
test('CSV export accuracy', async () => {
  const reports = await seedReports(1000);
  const csv = await generateCSV(reports);
  const rows = csv.split('\n');
  expect(rows.length).toBe(1001); // Header + 1000 rows
  expect(errorRate(csv, reports)).toBeLessThan(0.001); // <0.1%
});
```

---

### 4. Alex Kim (Anonymous Reporter, 28)

**Context:** Rideshare driver, sees issues while driving, doesn't want account signup friction.

**Pain Points:**

- ❌ **Account Wall:** Forced signup before seeing value = 43% bounce rate
- ❌ **No Incentive to Convert:** Why create account if anonymous works?
- ❌ **Lost Credit:** If creates account later, loses retroactive points/impact

**UI/UX Solutions:**

```typescript
// Landing page: Social proof FIRST, signup later
<LandingPage>
  <MapView pins={resolvedIssues} /> {/* Show outcomes, not problems */}
  <ImpactStats
    issuesResolved={156}
    communityMembers={2340}
    wasteRemoved="1,250 kg"
  />
  <CTAButton
    label="Report Issue (No Account Required)"
    onClick={() => navigate('/report')}
    variant="primary"
  />
  <SecondaryLink href="/how-it-works">See How It Works</SecondaryLink>
</LandingPage>

// Anonymous report flow
async function createAnonymousReport(data: ReportData) {
  const sessionId = localStorage.getItem('session_id') || generateUUID();
  localStorage.setItem('session_id', sessionId);

  const report = await supabase.from('issues').insert({
    ...data,
    session_id: sessionId,
    is_anonymous: true,
  });

  // Save report URL for bookmarking
  const reportUrl = `/report/${report.id}`;
  localStorage.setItem('last_report_url', reportUrl);

  return report;
}

// Conversion triggers (non-intrusive)
<ConversionPrompt
  trigger="after_verification" // Or: after_report_submitted, after_issue_resolved
  message="Your report was verified! Create account to track updates."
  ctaLabel="Create Free Account"
  dismissible={true}
/>

// Retroactive credit linking (on account creation)
async function linkAnonymousReports(userId: string, sessionId: string) {
  await supabase
    .from('issues')
    .update({ user_id: userId, is_anonymous: false })
    .eq('session_id', sessionId);

  // Show linked reports
  toast.success('We found 3 reports you created before signing up! Your impact: 8 kg waste removed');
}
```

---

### 5. James Taylor (Volunteer, 19)

**Context:** UC Berkeley student, needs volunteer hours for academic credit, wants social proof before committing.

**Pain Points:**

- ❌ **Unclear Commitment:** How long? What tools? Parking?
- ❌ **No Social Proof:** Am I the only one signing up?
- ❌ **No Verification:** University requires proof of volunteer hours

**UI/UX Solutions:**

```typescript
// Action Card detailed view
<ActionCardDetail actionCard={actionCard}>
  <Header
    title="Storm Drain Cleanup"
    organization="Berkeley Environmental Action"
    icon={<Droplet />}
  />

  <MetaInfo>
    <DateTime
      date="Saturday, Dec 21"
      time="2pm - 4pm"
      duration="2 hours"
    />
    <Location
      address="2430 Telegraph Ave, Berkeley"
      parking="Street parking on Telegraph"
    />
  </MetaInfo>

  <Volunteers>
    <Progress value={7} max={10} label="7/10 signed up" />
    <AvatarGroup users={signedUpVolunteers} />
  </Volunteers>

  <WhatToBring
    items={[
      { icon: <Glove />, label: 'Work gloves (provided if needed)' },
      { icon: <Water />, label: 'Water bottle' },
      { icon: <Shoe />, label: 'Closed-toe shoes' },
    ]}
  />

  <ImpactPreview
    relatedReports={8}
    upvotes={25}
    severity="High"
  />

  <Actions>
    <Button onClick={signUp} variant="primary">Sign Up</Button>
    <Button onClick={share} variant="outline">Share</Button>
    <Button onClick={askQuestion} variant="ghost">Questions?</Button>
  </Actions>
</ActionCardDetail>

// Volunteer certificate export
<CertificateGenerator>
  <Template>
    <Logo src="/ecopulse-logo.svg" />
    <Heading>Volunteer Certificate</Heading>
    <Body>
      This certifies that <strong>{userName}</strong> volunteered for
      <strong>{actionCard.title}</strong> organized by
      <strong>{organization.name}</strong> on <strong>{date}</strong>.
    </Body>
    <MetaData>
      <Field label="Duration" value="2 hours" />
      <Field label="Location" value={location} />
      <Field label="GPS Verified" value="Yes" />
    </MetaData>
    <QRCode value={proofPhotoUrls} />
  </Template>
  <DownloadButton format="PDF" />
</CertificateGenerator>
```

---

## UI Component Patterns

### Icon Library: Hugeicons 🎨

**Official Library:** https://hugeicons.com (23,000+ icons)

**Why Hugeicons:**

- ✅ 4,000+ icons cover all use cases (vs Lucide's 1,400)
- ✅ Environmental symbols: recycling, drainage, waste bins, flood warnings
- ✅ Consistent 24x24px base size (scalable)
- ✅ React component library: `@hugeicons/react`
- ✅ MIT license (free commercial use)

**Icon Categories Used:**

```typescript
// Navigation (bottom nav or hamburger menu)
import { Home, FileText, Zap, User } from '@hugeicons/react';

// Categories (report types)
import { Delete02, Droplet, Tree02, AlertCircle } from '@hugeicons/react';

// Severity (visual feedback)
import { FaceSmile, FaceNeutral, FaceSad } from '@hugeicons/react';

// Actions (user interactions)
import { Camera01, Microphone01, MapPin01, Send01, Share01 } from '@hugeicons/react';

// Status (issue states)
import { CheckCircle, Clock, XCircle } from '@hugeicons/react';

// UI Controls
import { Menu01, Search01, FilterHorizontal, Settings01 } from '@hugeicons/react';
```

**Usage Pattern:**

```typescript
// Icon-only button (mobile-first)
<button
  aria-label="Report Issue" // REQUIRED for accessibility
  className="min-h-[44px] min-w-[44px] flex items-center justify-center"
>
  <Camera01 size={24} aria-hidden="true" />
</button>

// Icon + text (desktop enhancement)
<button className="min-h-[44px] px-4 flex items-center gap-2">
  <Camera01 size={20} aria-hidden="true" />
  <span>Report Issue</span>
</button>

// Icon-driven category selection (no text labels)
<div className="grid grid-cols-2 gap-4">
  {categories.map(cat => (
    <CategoryButton
      key={cat.value}
      icon={cat.icon}
      value={cat.value}
      selected={selected === cat.value}
      aria-label={cat.label} // Screen readers announce label
    />
  ))}
</div>
```

---

### Voice Notes (Low-Literacy Support)

**Use Case:** Illiterate users record verbal descriptions instead of typing.

**Implementation:**

```typescript
'use client';
import { useState, useRef } from 'react';
import { Microphone01, Stop } from '@hugeicons/react';

export function VoiceNoteRecorder({ onRecordingComplete }: Props) {
  const [isRecording, setIsRecording] = useState(false);
  const [duration, setDuration] = useState(0);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);

  const startRecording = async () => {
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    const mediaRecorder = new MediaRecorder(stream, { mimeType: 'audio/webm' });

    const chunks: Blob[] = [];
    mediaRecorder.ondataavailable = (event) => chunks.push(event.data);
    mediaRecorder.onstop = () => {
      const blob = new Blob(chunks, { type: 'audio/webm' });
      onRecordingComplete(blob);
    };

    mediaRecorder.start();
    mediaRecorderRef.current = mediaRecorder;
    setIsRecording(true);

    // Track duration
    const interval = setInterval(() => setDuration(d => d + 1), 1000);
    mediaRecorder.addEventListener('stop', () => clearInterval(interval));
  };

  const stopRecording = () => {
    mediaRecorderRef.current?.stop();
    setIsRecording(false);
    setDuration(0);
  };

  return (
    <div className="flex flex-col items-center gap-4">
      <button
        onMouseDown={startRecording}
        onMouseUp={stopRecording}
        onTouchStart={startRecording}
        onTouchEnd={stopRecording}
        className="min-h-[80px] min-w-[80px] rounded-full bg-red-500 text-white flex items-center justify-center"
        aria-label={isRecording ? 'Recording voice note' : 'Hold to record voice note'}
      >
        {isRecording ? <Stop size={32} /> : <Microphone01 size={32} />}
      </button>

      <p className="text-sm text-gray-600">
        {isRecording ? `Recording: ${duration}s` : 'Hold button to record'}
      </p>

      {isRecording && (
        <div className="flex gap-1" aria-live="polite" aria-label="Recording in progress">
          <span className="animate-pulse">🔴</span>
          <span className="animate-pulse animation-delay-200">🔴</span>
          <span className="animate-pulse animation-delay-400">🔴</span>
        </div>
      )}
    </div>
  );
}
```

**Audio Prompts (Local Languages):**

```typescript
// Text-to-speech guidance in Hausa, Yoruba, Igbo, Swahili
const audioPrompts = {
  takePhoto: {
    en: 'Tap camera to take photo',
    ha: 'Matsa kamara don daukar hoto', // Hausa
    yo: 'Tẹ kamẹra lati ya aworan', // Yoruba
    ig: 'Pịa kamịa ka ị wee see foto', // Igbo
    sw: 'Bonyeza kamera kupiga picha', // Swahili
  },
  selectCategory: {
    en: 'Choose issue type',
    ha: 'Zaɓi nau'in matsala',
    // ... other languages
  },
};

async function playAudioPrompt(key: string, locale: string) {
  const text = audioPrompts[key][locale] || audioPrompts[key]['en'];
  const utterance = new SpeechSynthesisUtterance(text);
  utterance.lang = locale === 'ha' ? 'ha-NG' : locale === 'yo' ? 'yo-NG' : 'en-US';
  speechSynthesis.speak(utterance);
}
```

---

### Offline-First Architecture

**Local Storage + Sync Pattern:**

```typescript
// Store report locally when offline
async function createReportOffline(data: ReportFormData) {
  const pendingReports = JSON.parse(localStorage.getItem('pending_reports') || '[]');
  const newReport = {
    ...data,
    id: generateUUID(),
    createdAt: new Date().toISOString(),
    status: 'pending_sync',
  };

  pendingReports.push(newReport);
  localStorage.setItem('pending_reports', JSON.stringify(pendingReports));

  return newReport;
}

// Sync when online
useEffect(() => {
  if (navigator.onLine) {
    syncPendingReports();
  }

  window.addEventListener('online', syncPendingReports);
  return () => window.removeEventListener('online', syncPendingReports);
}, []);

async function syncPendingReports() {
  const pendingReports = JSON.parse(localStorage.getItem('pending_reports') || '[]');

  for (const report of pendingReports) {
    try {
      const synced = await createReport(report);
      toast.success(`Report #${synced.id} uploaded successfully`);
    } catch (error) {
      console.error('Sync failed:', error);
    }
  }

  localStorage.removeItem('pending_reports');
}

// Offline badge indicator
<OfflineIndicator>
  {!navigator.onLine && (
    <Badge variant="warning" icon={<WifiOff />}>
      Offline - Reports will sync when connected
    </Badge>
  )}
  {pendingCount > 0 && (
    <Badge variant="info" icon={<Sync />}>
      {pendingCount} reports waiting to upload
    </Badge>
  )}
</OfflineIndicator>
```

---

### SMS Notifications (2G/3G Support)

**Use Case:** Rural users with limited data, no smartphone, or 2G-only coverage.

**Implementation:**

```typescript
// Africa's Talking API integration (covers Nigeria, Kenya, Uganda, Tanzania)
import AfricasTalking from 'africastalking';

const client = AfricasTalking({
  apiKey: process.env.AFRICASTALKING_API_KEY!,
  username: process.env.AFRICASTALKING_USERNAME!,
});

export async function sendSMS(to: string, message: string) {
  try {
    const result = await client.SMS.send({
      to: [to],
      message,
      from: 'EcoPulse', // Sender ID (requires registration)
    });

    return { success: true, data: result };
  } catch (error) {
    console.error('SMS send failed:', error);
    return { success: false, error: 'Failed to send SMS' };
  }
}

// SMS templates (160 characters max)
const smsTemplates = {
  reportReceived: (reportId: string) =>
    `ecoPulse: Your report #${reportId} was received. Reply TRACK for updates.`,
  reportVerified: (reportId: string, verifiers: number) =>
    `ecoPulse: Report #${reportId} verified by ${verifiers} neighbors. Action coming!`,
  issueResolved: (reportId: string, impact: string) =>
    `ecoPulse: Issue #${reportId} fixed! ${impact} removed. View: ecopulse.io/r/${reportId}`,
};

// User notification preferences
async function sendNotification(userId: string, type: string, data: any) {
  const user = await getUser(userId);
  const prefs = user.notification_preferences || {};

  // Email (MVP default)
  if (prefs.email !== false) {
    await sendEmail(user.email, type, data);
  }

  // SMS (opt-in, Phase 2)
  if (prefs.sms === true && user.phone) {
    const message = smsTemplates[type](data.reportId, data.impact);
    await sendSMS(user.phone, message);
  }

  // Push notifications (opt-in, Phase 2)
  if (prefs.push !== false) {
    await sendPushNotification(userId, type, data);
  }
}
```

---

### Touch Targets (44px Minimum)

**WCAG 2.1 AA Compliance:**

```typescript
// All interactive elements MUST meet 44x44px minimum
const touchTargetClasses = 'min-h-[44px] min-w-[44px]';

// Button component (always meets minimum)
<Button
  className={cn(touchTargetClasses, 'px-4 flex items-center justify-center')}
  onClick={handleClick}
>
  Submit Report
</Button>

// Icon-only button
<button
  aria-label="Close"
  className={cn(touchTargetClasses, 'flex items-center justify-center')}
>
  <X size={20} aria-hidden="true" />
</button>

// Link with adequate padding
<a
  href="/reports"
  className={cn(touchTargetClasses, 'inline-flex items-center px-4')}
>
  View All Reports
</a>

// Checkbox/Radio (increase hit area)
<label className="flex items-center gap-3 min-h-[44px] cursor-pointer">
  <input type="checkbox" className="sr-only" />
  <div className="w-6 h-6 border rounded flex items-center justify-center">
    <Check size={16} />
  </div>
  <span>Send me SMS updates</span>
</label>
```

---

### Event Timeline (Not Status Labels)

**Show WHAT HAPPENED, not abstract states:**

```typescript
// ❌ BAD: Abstract status labels
<StatusBadge status="assigned" />
<StatusBadge status="in_progress" />

// ✅ GOOD: Event timeline with context
const timeline = [
  {
    date: 'Dec 15, 10:30am',
    event: 'You reported overflowing bin near playground',
    icon: <Flag />,
    actor: 'You',
  },
  {
    date: 'Dec 16, 2:00pm',
    event: 'Sara Chen and James Taylor verified this issue',
    icon: <Check2 />,
    actor: 'Community',
  },
  {
    date: 'Dec 17, 9:00am',
    event: 'Oakland Green Alliance scheduled Saturday cleanup',
    icon: <Zap />,
    actor: 'OGA',
  },
  {
    date: 'Dec 21, 11:00am',
    event: 'Cleanup completed - 15 kg waste removed, 2 volunteers',
    icon: <CheckCircle />,
    actor: 'OGA',
  },
];

<Timeline>
  {timeline.map((item, index) => (
    <TimelineItem
      key={index}
      date={item.date}
      icon={item.icon}
      actor={item.actor}
      description={item.event}
    />
  ))}
</Timeline>
```

---

## Responsive Navigation Patterns

### Desktop Navbar (1024px+)

```typescript
// Horizontal navbar with dropdown menus
<nav className="border-b bg-white sticky top-0 z-50">
  <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
    <Logo href="/" />

    <NavigationMenu.Root className="hidden lg:flex">
      <NavigationMenu.List>
        <NavigationMenu.Item>
          <NavigationMenu.Link href="/map">
            Map
          </NavigationMenu.Link>
        </NavigationMenu.Item>

        {user && (
          <>
            <NavigationMenu.Item>
              <NavigationMenu.Link href="/reports">
                My Reports
              </NavigationMenu.Link>
            </NavigationMenu.Item>

            <NavigationMenu.Item>
              <NavigationMenu.Link href="/actions">
                Actions
              </NavigationMenu.Link>
            </NavigationMenu.Item>
          </>
        )}

        {user?.role === 'ngo_coordinator' && (
          <NavigationMenu.Item>
            <NavigationMenu.Link href="/dashboard/ngo">
              NGO Dashboard
            </NavigationMenu.Link>
          </NavigationMenu.Item>
        )}
      </NavigationMenu.List>
    </NavigationMenu.Root>

    <div className="flex items-center gap-4">
      <SearchButton />
      {user ? <UserDropdown /> : <LoginButton />}
    </div>
  </div>
</nav>
```

### Mobile Hamburger Menu (320px-1023px)

```typescript
// Drawer from left using Radix UI Dialog
<header className="lg:hidden border-b bg-white sticky top-0 z-50">
  <div className="h-16 flex items-center justify-between px-4">
    <Dialog.Root>
      <Dialog.Trigger asChild>
        <button
          aria-label="Open menu"
          className="min-h-[44px] min-w-[44px] flex items-center justify-center"
        >
          <Menu01 size={24} aria-hidden="true" />
        </button>
      </Dialog.Trigger>

      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 bg-black/50" />
        <Dialog.Content className="fixed top-0 left-0 h-full w-80 bg-white slide-in-from-left">
          <Dialog.Close className="absolute top-4 right-4 min-h-[44px] min-w-[44px]">
            <X size={24} />
          </Dialog.Close>

          <nav className="mt-16 px-4 space-y-2">
            <NavLink href="/map" icon={<Home />}>
              Map
            </NavLink>

            {user && (
              <>
                <NavLink href="/reports" icon={<FileText />}>
                  My Reports
                </NavLink>
                <NavLink href="/actions" icon={<Zap />}>
                  Actions
                </NavLink>
                <NavLink href="/profile" icon={<User />}>
                  Profile
                </NavLink>
              </>
            )}

            {user?.role === 'ngo_coordinator' && (
              <NavLink href="/dashboard/ngo" icon={<Building />}>
                NGO Dashboard
              </NavLink>
            )}

            <Separator />

            <NavLink href="/settings" icon={<Settings01 />}>
              Settings
            </NavLink>
            <NavLink href="/help" icon={<HelpCircle />}>
              Help & Support
            </NavLink>

            {user ? (
              <Button onClick={logout} variant="ghost" fullWidth>
                Logout
              </Button>
            ) : (
              <Button onClick={() => navigate('/login')} variant="primary" fullWidth>
                Login
              </Button>
            )}
          </nav>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>

    <Logo href="/" />

    <div className="flex items-center gap-2">
      <SearchButton />
      {user && <NotificationBadge />}
    </div>
  </div>
</header>
```

---

## Accessibility Patterns

### Screen Reader Support

```typescript
// Semantic HTML structure
<main role="main" aria-labelledby="page-title">
  <h1 id="page-title">Environmental Issues Map</h1>

  <section aria-labelledby="filters-heading">
    <h2 id="filters-heading" className="sr-only">Map Filters</h2>
    {/* Filter controls */}
  </section>

  <section aria-labelledby="map-heading">
    <h2 id="map-heading" className="sr-only">Interactive Map</h2>
    <div role="application" aria-label="Map of environmental issues">
      {/* Leaflet map */}
    </div>
  </section>
</main>

// Skip navigation link
<a
  href="#main-content"
  className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-50 focus:px-4 focus:py-2 focus:bg-white focus:border"
>
  Skip to main content
</a>

// Live region for dynamic updates
<div
  aria-live="polite"
  aria-atomic="true"
  className="sr-only"
>
  {message}
</div>

// Form field associations
<div>
  <label htmlFor="category" id="category-label">
    Category <span aria-label="required">*</span>
  </label>
  <select
    id="category"
    aria-labelledby="category-label"
    aria-describedby="category-error"
    aria-invalid={errors.category ? 'true' : 'false'}
  >
    {/* Options */}
  </select>
  {errors.category && (
    <p id="category-error" role="alert" className="text-red-600">
      {errors.category}
    </p>
  )}
</div>
```

### Keyboard Navigation

```typescript
// Focus management
useEffect(() => {
  const handleKeyDown = (e: KeyboardEvent) => {
    // Escape closes modals
    if (e.key === 'Escape' && isModalOpen) {
      closeModal();
    }

    // Tab trapping in modal
    if (e.key === 'Tab' && isModalOpen) {
      trapFocus(e);
    }
  };

  window.addEventListener('keydown', handleKeyDown);
  return () => window.removeEventListener('keydown', handleKeyDown);
}, [isModalOpen]);

// Focus visible indicator
const focusRingClasses = 'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2';

// Roving tab index for lists
<div role="listbox" aria-label="Issue categories">
  {categories.map((cat, index) => (
    <button
      key={cat.value}
      role="option"
      tabIndex={index === activeIndex ? 0 : -1}
      aria-selected={selected === cat.value}
      onKeyDown={(e) => handleArrowKeys(e, index)}
    >
      {cat.label}
    </button>
  ))}
</div>
```

---

## Performance Optimization

### Map Pin Limit Strategy

```typescript
// Smart prioritization (50 pins mobile, 100 desktop)
const prioritizeIssues = (issues: Issue[], limit: number) => {
  // Sort by priority score
  const scored = issues.map(issue => ({
    ...issue,
    priority:
      (issue.verification_count >= 3 ? 100 : 0) + // Verified = highest priority
      (issue.severity === 'high' ? 50 : issue.severity === 'medium' ? 25 : 0) +
      (issue.is_vulnerable_community ? 40 : 0) +
      (issue.related_count > 1 ? 30 : 0) +
      (issue.upvotes * 0.5),
  }));

  // Return top N by priority
  return scored.sort((a, b) => b.priority - a.priority).slice(0, limit);
};

// Progressive loading
const MapView = () => {
  const isMobile = useMediaQuery('(max-width: 1023px)');
  const limit = isMobile ? 50 : 100;

  const { data: pins, isLoading } = useQuery(
    ['map-pins', bounds, filters, limit],
    () => fetchPrioritizedPins({ bounds, filters, limit })
  );

  return (
    <Leaflet.Map>
      {isLoading && <MapSkeleton />}
      {pins?.map(pin => <Marker key={pin.id} {...pin} />)}
      {pins?.length === limit && (
        <LoadMoreButton onClick={() => setLimit(limit + 50)} />
      )}
    </Leaflet.Map>
  );
};
```

### Image Optimization

```typescript
// Server-side compression (sharp library)
'use server';
import sharp from 'sharp';

export async function uploadPhoto(formData: FormData) {
  const file = formData.get('photo') as File;

  // Compress and strip EXIF
  const buffer = await file.arrayBuffer();
  const optimized = await sharp(Buffer.from(buffer))
    .rotate() // Auto-rotate based on EXIF
    .resize(1920, 1080, { fit: 'inside', withoutEnlargement: true })
    .jpeg({ quality: 85, mozjpeg: true })
    .withMetadata({ exif: false, icc: false }) // Strip metadata for privacy
    .toBuffer();

  // Upload to Supabase Storage
  const { data, error } = await supabase.storage
    .from('issue-photos')
    .upload(`${userId}/${Date.now()}.jpg`, optimized);

  return { success: !error, url: data?.path };
}

// Client-side lazy loading
<Image
  src={photoUrl}
  alt="Issue photo"
  loading="lazy"
  className="object-cover w-full h-64"
/>
```

---

## Form Validation Patterns

### React Hook Form + Zod

```typescript
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';

const reportSchema = z.object({
  category: z.enum(['waste', 'drainage', 'trees'], {
    errorMap: () => ({ message: 'Please select a category' })
  }),
  latitude: z.number().min(-90).max(90),
  longitude: z.number().min(-180).max(180),
  severity: z.enum(['low', 'medium', 'high']),
  note: z.string().min(10, 'Please provide at least 10 characters').max(500),
  photo: z.instanceof(File).refine(
    (file) => file.size <= 10 * 1024 * 1024,
    'Photo must be less than 10MB'
  ),
});

type ReportFormData = z.infer<typeof reportSchema>;

export function ReportForm() {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<ReportFormData>({
    resolver: zodResolver(reportSchema),
  });

  const onSubmit = async (data: ReportFormData) => {
    const result = await createReport(data);

    if (result.success) {
      toast.success('Report submitted successfully!');
      navigate('/map');
    } else {
      toast.error(result.error);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <Field label="Category" error={errors.category?.message}>
        <select {...register('category')} className={fieldClasses}>
          <option value="">Select category</option>
          <option value="waste">Waste & Litter</option>
          <option value="drainage">Drainage / Flood Risk</option>
          <option value="trees">Trees & Greenery</option>
        </select>
      </Field>

      <Field label="Description" error={errors.note?.message}>
        <textarea
          {...register('note')}
          placeholder="Describe the issue (minimum 10 characters)"
          className={fieldClasses}
        />
      </Field>

      <Button
        type="submit"
        disabled={isSubmitting}
        className="w-full min-h-[44px]"
      >
        {isSubmitting ? 'Submitting...' : 'Submit Report'}
      </Button>
    </form>
  );
}
```

---

## Next Steps

**For AI Coding Agents:**

1. Read this skill before implementing any UI/UX work
2. Cross-reference with [ecopulse-developer skill](../ecopulse-developer/SKILL.md) for technical patterns
3. Validate designs against persona pain points
4. Test with low-literacy users (voice notes, icon-driven UI)
5. Ensure WCAG 2.1 AA compliance on all screens
6. Verify 44px touch targets on mobile

**For UX Designers:**

1. Create high-fidelity mockups using these patterns
2. Test with Nigerian users (Hausa, Yoruba, Igbo speakers)
3. Validate offline-first flows
4. Document additional patterns as they emerge

**For Product Managers:**

1. Prioritize features based on persona pain points
2. Validate conversion triggers with A/B testing
3. Monitor 60-second report flow completion rate
4. Track anonymous-to-authenticated conversion (target: 25%)

---

**Skill Maintenance:** Update this skill when:

- New personas emerge from user research
- Additional African markets are targeted (Swahili, Amharic, French)
- Accessibility standards change
- New UI patterns are validated through user testing
