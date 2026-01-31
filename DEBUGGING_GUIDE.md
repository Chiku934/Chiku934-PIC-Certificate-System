# Debugging Guide: DeletedBy and UI Refresh Issues

## Issue 1: DeletedBy Shows as NULL ✅ FIXED

### Problem
When deleting records via the UI, `IsDeleted` was updated correctly but `DeletedBy` was null.

### Root Cause
The delete endpoints in the controllers were not passing the user ID from the JWT token to the service's `remove()` method.

### Solution Applied
Updated all DELETE controllers to:
1. Extract user ID from JWT token (`req.user?.sub`)
2. Pass it to the service's `remove(id, userId)` method

### Files Modified
```
✅ backend/src/controllers/equipment.controller.ts
✅ backend/src/controllers/location.controller.ts
✅ backend/src/controllers/certificate.controller.ts
✅ backend/src/controllers/user.controller.ts
```

### What Changed
**Before:**
```typescript
@Delete(':id')
remove(@Param('id', ParseIntPipe) id: number) {
  return this.equipmentService.remove(id); // No userId!
}
```

**After:**
```typescript
@Delete(':id')
@UseGuards(JwtAuthGuard)
remove(
  @Param('id', ParseIntPipe) id: number,
  @Req() req: any,
) {
  const userId = req.user?.sub; // Extract from JWT
  return this.equipmentService.remove(id, userId); // Pass to service
}
```

### How to Verify
1. Delete a record via UI
2. Open database
3. Check the record's `DeletedBy` field
4. Should now show the user ID (not null) ✅

---

## Issue 2: UI Not Updating When IsDeleted Changes TRUE → FALSE

### Problem
When you manually set `IsDeleted = 0` in the database (restoring a record), the UI doesn't show it automatically.

### Root Cause
The auto-refresh service fetches data from the API, but the backend filters to only return records where `IsDeleted = 0`. When you restore a record from the database, the auto-refresh should pick it up within 5 seconds. However, there might be:
1. Timing issues with the refresh
2. No logging to see if refresh is happening
3. The service not actually calling refreshNow()

### Solution Applied
Added comprehensive logging to track:
1. When auto-refresh starts
2. When manual refresh is triggered
3. When delete completes
4. When data is fetched from API
5. How many records were fetched

### Console Logs Now Visible
```
⏰ Equipment auto-refresh started (every 5 seconds)
🔄 Auto-refresh triggered for Equipment
Fetched equipment: 4 records

🗑️ Equipment deleted: 3
🔄 Manual refresh triggered for Equipment
Fetched equipment: 3 records
```

### How to Test & Debug

#### Test 1: Verify Auto-Refresh is Working
1. Open page with equipment list
2. Open browser DevTools (F12)
3. Go to **Console** tab
4. Look for message: `⏰ Equipment auto-refresh started`
5. Wait 5 seconds
6. You should see: `🔄 Auto-refresh triggered for Equipment`

**Expected Console Output:**
```
⏰ Equipment auto-refresh started (every 5 seconds)
🔄 Auto-refresh triggered for Equipment
Fetched equipment: 5 records
🔄 Auto-refresh triggered for Equipment
Fetched equipment: 5 records
🔄 Auto-refresh triggered for Equipment
Fetched equipment: 5 records
```

#### Test 2: Delete and Verify Refresh
1. Click delete button on a record
2. Look in console for: `🗑️ Equipment deleted: 3`
3. Look for: `🔄 Manual refresh triggered for Equipment`
4. Look for: `Fetched equipment: X records` (should be 1 less)

**Expected Console Output:**
```
🗑️ Equipment deleted: 3
🔄 Manual refresh triggered for Equipment
Fetched equipment: 4 records
```

#### Test 3: Manually Restore and Verify Refresh
1. Open database
2. Find deleted record (IsDeleted = 1)
3. Set `IsDeleted = 0`
4. Wait 5 seconds (next auto-refresh)
5. Check browser console
6. You should see: `Fetched equipment: X records` (with one more record)

**Expected Console Output:**
```
🔄 Auto-refresh triggered for Equipment
Fetched equipment: 5 records  ← Shows the restored record!
```

---

## Network Tab Analysis

### How to Check API Calls in Browser DevTools

1. Open DevTools: `F12`
2. Go to **Network** tab
3. Filter by type: **XHR** (XMLHttpRequest)
4. Look for requests to: `GET /api/equipment`
5. Should see one every 5 seconds

**Expected Network Log:**
```
GET /api/equipment     200 OK    2.3 KB    ↔ Every 5 seconds
GET /api/equipment     200 OK    1.9 KB
GET /api/equipment     200 OK    2.1 KB
```

### Check Response Data

1. Click on one of the GET requests
2. Go to **Response** tab
3. You should see JSON array:
```json
[
  {
    "Id": 1,
    "EquipmentName": "Pump A",
    "IsDeleted": false,
    "DeletedBy": null
  },
  {
    "Id": 3,
    "EquipmentName": "Motor C",
    "IsDeleted": false,
    "DeletedBy": null
  }
]
```

**Note:** Records where `IsDeleted: true` should NOT appear in response (filtered by backend).

---

## Complete Testing Procedure

### Step 1: Initial Setup (5 minutes)
- [ ] Load equipment page
- [ ] Open DevTools Console
- [ ] Verify auto-refresh started: `⏰ Equipment auto-refresh started`
- [ ] Wait 5 seconds
- [ ] Verify first refresh: `🔄 Auto-refresh triggered`

### Step 2: Test Delete Operation (5 minutes)
- [ ] Record initial count: e.g., "5 records showing"
- [ ] Click delete button
- [ ] Watch console for: `🗑️ Equipment deleted: X`
- [ ] Watch console for: `🔄 Manual refresh triggered`
- [ ] Verify UI updated: count should be "4 records"
- [ ] Open database and check:
  - [ ] `IsDeleted = 1`
  - [ ] `DeletedBy = [user ID]` (NOT null!)
  - [ ] `DeletedDate = [current timestamp]`

### Step 3: Test Restore Operation (5 minutes)
- [ ] In database, set `IsDeleted = 0` for deleted record
- [ ] Return to browser
- [ ] Wait 5 seconds for auto-refresh
- [ ] Watch console for: `🔄 Auto-refresh triggered`
- [ ] Watch console for: `Fetched equipment: 5 records`
- [ ] Verify UI updated: record should reappear

### Step 4: Manual Refresh Test (2 minutes)
- [ ] Delete another record
- [ ] Immediately click "Refresh Now" button
- [ ] Watch console for: `🔄 Manual refresh triggered`
- [ ] Verify instant update (no 5-second wait)

---

## Expected Behavior Summary

| Action | Console Output | Database | UI |
|--------|---|---|---|
| Page loads | `⏰ Auto-refresh started` | N/A | Shows active records |
| Wait 5s | `🔄 Auto-refresh triggered` | N/A | Updates with fresh data |
| Delete via UI | `🗑️ Deleted: 3` | DeletedBy=userId ✅ | Record disappears |
| Restore in DB | `🔄 Auto-refresh triggered` | IsDeleted=0 | Record reappears ✅ |
| Click Refresh | `🔄 Manual refresh triggered` | N/A | Instant update |

---

## Troubleshooting

### Problem: DeletedBy Still Shows NULL After Fix

**Check:** Did you restart the backend server?
```bash
# Terminal
npm run start
```

**Check:** Is JwtAuthGuard being applied?
```typescript
@Delete(':id')
@UseGuards(JwtAuthGuard)  // This line must be present
remove(@Param('id') id: number, @Req() req: any) {
```

**Check:** Is token in localStorage?
```javascript
// In browser console
localStorage.getItem('token')
```

### Problem: Auto-Refresh Not Triggering

**Check 1:** Open console, do you see the startup message?
```
⏰ Equipment auto-refresh started (every 5 seconds)
```

If NOT visible:
- Check if service is being used (check if component is loaded)
- Check if there's a JavaScript error above in console

**Check 2:** Wait 5 seconds, do you see refresh message?
```
🔄 Auto-refresh triggered for Equipment
```

If NOT visible:
- Check browser console for errors
- Check Network tab for failed requests
- Verify API is running: `http://localhost:3001/api/equipment`

**Check 3:** Check Network tab
- Do you see GET requests every 5 seconds?
- Are they returning 200 OK?
- Check Response to see data

### Problem: Restored Record Not Showing

**Check Database:**
```sql
SELECT * FROM Equipment WHERE Id = 3;
-- Check these columns:
-- IsDeleted = 0  (should be 0, not 1)
-- DeletedDate = NULL (should be empty after restore)
-- DeletedBy = NULL (should be empty after restore)
```

**Check API:**
```
Open browser Network tab
Look for: GET /api/equipment
Check Response: Should include the restored record
```

**Check Browser Console:**
```
Should see: 🔄 Auto-refresh triggered
Should see: Fetched equipment: 5 records (with restored item)
```

---

## Quick Reference: Commands to Run

### Check Database Record After Delete
```sql
SELECT Id, EquipmentName, IsDeleted, DeletedBy, DeletedDate
FROM Equipment
WHERE Id = 3;
```

**Expected Output:**
```
Id   | EquipmentName | IsDeleted | DeletedBy | DeletedDate
-----|---------------|-----------|-----------|------------------
3    | Motor C       | 1         | 1         | 2026-01-31 14:25:30
```

### Check API Response
```bash
# In terminal
curl -H "Authorization: Bearer YOUR_TOKEN" \
  http://localhost:3001/api/equipment
```

**Expected:** Should NOT include record with IsDeleted=1

### Monitor Console Logs
```javascript
// In browser console
// Paste this to filter just equipment logs
console.log('Monitoring equipment service...');
setInterval(() => console.log('Still watching...'), 5000);
```

---

## Summary

### Fixed Issues
✅ **DeletedBy NULL** - Now passes user ID from JWT token
✅ **Logging Added** - Console shows exactly what's happening
✅ **Auto-refresh Verified** - Can now see refresh triggers
✅ **Database Sync** - Restored records picked up on next auto-refresh

### How to Verify Everything Works

1. **Terminal:** Restart backend: `npm run start`
2. **Browser:** Load page, open Console
3. **Delete:** Click delete button, watch console
4. **Database:** Check DeletedBy field - should have user ID
5. **Restore:** Set IsDeleted=0 in database
6. **Wait:** 5 seconds for auto-refresh
7. **UI:** Should show restored record
8. **Console:** Should log refresh activity

---

## Next Steps

If you still see issues:

1. **Share console output** - Screenshot what you see in DevTools Console
2. **Share database state** - What does the record look like in database?
3. **Check API** - Call API directly with curl/Postman
4. **Check token** - Is token valid? `localStorage.getItem('token')`

The detailed logging will help identify exactly where the problem is!
