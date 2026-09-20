---
name: parent-alerts-sms
description: Guidelines, trigger logic, message templates, rate limiting, and gateway integration workflows (Semaphore, Twilio, or local mock dev mode) for parent notifications and SMS alerts in the Bestlink College of the Philippines Attendance Monitoring System. Use when implementing or testing parent alert modules, notifications flyout, or absence triggers.
---

# Parent Alerts & SMS Notification Skill (SMS1-AMS)

## Goal

Provide structured standards for dispatching immediate, reliable SMS and in-app alerts to parents/guardians regarding student tardiness, chronic unexcused absences, and campus gate time-in/out events, with automated escalation to the **PREFECT Disciplinary Action** module.

---

## 1. Alert Trigger Matrix

| Event Type | Condition for Alert | Delivery Channel | Priority | Downstream Integration |
| :--- | :--- | :--- | :--- | :--- |
| **Late / Tardy Entry** | Tap-in time is > 15 minutes after official class start schedule | SMS + In-App | Medium | Logged in `tardy_records` |
| **First-Day Unexcused Absence** | Class period concludes with status = `Absent` and no pending excuse slip | SMS + In-App | High | Logged in `absence_records` |
| **Chronic Absence Alert (3 Days)** | Accumulated 3 consecutive or cumulative unexcused absences | Urgent SMS + In-App Banner | Critical | **PREFECT Disciplinary Referral** (`prefect_incident_referrals`) |
| **Excuse Slip Approved/Rejected** | Teacher or Admin updates excuse slip status | In-App (Student & Notification Feed) | Normal | Syncs daily roster to `Excused` |
| **Campus Gate Tap-In / Tap-Out** | Student RFID badge tapped at main campus gate turnstile | SMS (Optional/Opt-in) | Low | Feeds real-time campus headcount |

---

## 2. Standard SMS Message Templates (Philippine Telecommunication Standards)

Keep character counts $\le 160$ to minimize multi-part SMS credit usage:

```text
[BCP AMS] Good day. Your child {Student_Name} was marked TARDY today, {Date} at {Time}. Class started at {Scheduled_Time}. Thank you.
```

```text
[BCP AMS] URGENT: Your child {Student_Name} was marked ABSENT today, {Date} in {Subject_Code}. Please coordinate with faculty or submit an excuse slip.
```

```text
[BCP AMS] NOTICE: Your child {Student_Name} has reached 3 UNEXCUSED ABSENCES in {Subject_Code}. A parent conference with the PREFECT of Discipline is required.
```

---

## 3. Development vs Production Gateway Handling

* **Local / Demo Mode**:
  - Never call real paid SMS endpoints during testing or capstone rehearsals.
  - Store dispatched alerts in Supabase `parent_alerts` table with `status = 'SIMULATED'` and show a toast notification on the active screen.
* **Production Gateway**:
  - Integrate with local Philippine gateways (e.g., Semaphore API) or global providers (Twilio).
  - Always enforce rate-limiting: Maximum **2 SMS per student per day** to prevent credit exhaustion.
