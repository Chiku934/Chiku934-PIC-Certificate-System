# Auto-Refresh Services - Data Synchronization Guide

## Overview

The new auto-refresh services automatically fetch data from the backend every **5 seconds** and keep the UI in sync with database changes. When you manually update records in the database (e.g., set `IsDeleted = true/false`), the UI will automatically reflect those changes.

## Services Created

### 1. **EquipmentService** (`equipment.service.ts`)
Manages equipment data with auto-refresh:
- `getAllEquipment()` - All equipment (auto-refreshes every 5 seconds)
- `getEquipmentByCompany(companyId)` - Equipment filtered by company
- `getEquipmentByStatus(status)` - Equipment filtered by status
- `createEquipment()` - Create new equipment
- `updateEquipment()` - Update equipment
- `deleteEquipment()` - Soft delete equipment
- `refreshNow()` - Force immediate refresh

### 2. **CertificateService** (`certificate.service.ts`)
Manages certificate data with auto-refresh:
- `getAllCertificates()` - All certificates (auto-refreshes)
- `getCertificatesByEquipment()` - Certificates for specific equipment
- `getCertificatesByLocation()` - Certificates for specific location
- `getExpiringSoon()` - Expiring soon certificates
- `getExpired()` - Expired certificates
- `createCertificate()` - Create certificate
- `updateCertificate()` - Update certificate
- `deleteCertificate()` - Soft delete certificate
- `approveCertificate()` - Approve certificate
- `rejectCertificate()` - Reject certificate
- `refreshNow()` - Force immediate refresh

### 3. **LocationService** (`location.service.ts`)
Manages location data with auto-refresh:
- `getAllLocations()` - All locations (auto-refreshes)
- `getActiveLocations()` - Only active locations
- `getRootLocations()` - Root level locations
- `searchLocations()` - Search locations
- `createLocation()` - Create location
- `updateLocation()` - Update location
- `deleteLocation()` - Soft delete location
- `refreshNow()` - Force immediate refresh

### 4. **UserService** (`user.service.ts`)
Manages user data with auto-refresh:
- `getAllUsers()` - All users (auto-refreshes)
- `getActiveUsers()` - Only active users
- `createUser()` - Create user
- `updateUser()` - Update user
- `deleteUser()` - Soft delete user
- `refreshNow()` - Force immediate refresh

## How It Works

### BehaviorSubject Pattern
Each service uses RxJS `BehaviorSubject` to:
- Hold the latest data in memory
- Emit new data whenever the backend is fetched
- Allow multiple components to subscribe without multiple API calls

### Auto-Refresh Mechanism
```typescript
// Every 5 seconds, the service automatically:
interval(5000).subscribe(() => {
  this.fetchAllData();  // Fetches fresh data from API
  this.dataSubject$.next(freshData);  // Updates subscribers
});
```

### Integration with Components

**Example: Equipment List Component**

```typescript
import { Component, OnInit } from '@angular/core';
import { EquipmentService } from '../services/equipment.service';

@Component({
  selector: 'app-equipment-list',
  template: `
    <div>
      <div *ngFor="let equipment of equipment$ | async">
        <div *ngIf="!equipment.IsDeleted">
          {{ equipment.EquipmentName }}
        </div>
      </div>
    </div>
  `
})
export class EquipmentListComponent implements OnInit {
  equipment$: Observable<Equipment[]>;

  constructor(private equipmentService: EquipmentService) {}

  ngOnInit() {
    // Subscribe to auto-refreshing data
    this.equipment$ = this.equipmentService.getAllEquipment();
  }

  deleteEquipment(id: number) {
    this.equipmentService.deleteEquipment(id).subscribe({
      next: () => {
        console.log('Equipment deleted');
        // No need to manually refresh - service does it automatically!
      }
    });
  }
}
```

## Workflow: Database Change to UI Update

### Before (Without Auto-Refresh)
1. User loads list of equipment → API called once
2. User opens database and manually sets `IsDeleted = true` for a record
3. UI still shows deleted record because it hasn't refreshed ❌

### After (With Auto-Refresh)
1. User loads list of equipment → API called, data displayed
2. Auto-refresh runs every 5 seconds in background
3. User opens database and manually sets `IsDeleted = true` for a record
4. After 5 seconds, service fetches fresh data from API
5. Backend filters out deleted records (IsDeleted filter added)
6. UI automatically updates and hides deleted record ✅

## Customizing Refresh Interval

If you want a different refresh interval, edit the service:

```typescript
// In each service, change this line:
private refreshInterval = 5000; // 5 seconds

// To your desired interval (in milliseconds):
private refreshInterval = 3000; // 3 seconds
private refreshInterval = 10000; // 10 seconds
```

## Disabling Auto-Refresh

If you need to temporarily disable auto-refresh in a component:

```typescript
export class MyComponent implements OnInit, OnDestroy {
  private subscription: Subscription;

  ngOnInit() {
    // Manual refresh only - no auto-refresh
    this.loadData();
  }

  loadData() {
    this.equipmentService.refreshNow();
  }

  ngOnDestroy() {
    // Clean up
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }
}
```

## Force Immediate Refresh

Call `refreshNow()` to manually trigger an immediate refresh:

```typescript
this.equipmentService.refreshNow();
this.certificateService.refreshNow();
this.locationService.refreshNow();
this.userService.refreshNow();
```

## Key Benefits

✅ **Automatic Sync**: UI stays in sync with database without user action
✅ **Soft Delete Support**: Deleted records (IsDeleted = true) automatically hidden
✅ **Real-time Updates**: Changes visible within 5 seconds
✅ **Efficient**: Uses RxJS operators to minimize API calls
✅ **Easy Integration**: Drop-in replacement for existing services
✅ **No Breaking Changes**: Compatible with existing component code

## Next Steps

1. **Update Components** - Replace direct HTTP calls with these services
2. **Update Templates** - Use `| async` pipe with Observable$ properties
3. **Test** - Verify UI updates when you manually change IsDeleted in database
4. **Monitor** - Check browser console for any fetch errors (logged automatically)

## Troubleshooting

### Data not updating?
- Check browser console for errors
- Verify token is in localStorage
- Ensure API endpoints are correct in service URLs

### Too many API calls?
- Increase `refreshInterval` value
- Or use manual `refreshNow()` calls instead

### Need to disable for specific data?
- Remove the `interval(refreshInterval)` call
- Use manual `refreshNow()` when needed
