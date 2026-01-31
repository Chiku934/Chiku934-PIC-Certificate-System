# Quick Start: Auto-Refresh Services

## The Problem You Had
When you manually updated `IsDeleted = true` in the database, the UI didn't automatically reflect the change. You had to manually refresh the page to see updates.

## The Solution
We created **auto-refresh services** that automatically fetch fresh data from the backend every 5 seconds. Combined with the backend soft-delete filters, the UI now stays perfectly in sync with database changes.

---

## 🚀 How to Use (3 Simple Steps)

### Step 1: Inject the Service
```typescript
import { EquipmentService } from '../services/equipment.service';

export class YourComponent {
  constructor(private equipmentService: EquipmentService) {}
}
```

### Step 2: Get Observable in ngOnInit
```typescript
ngOnInit() {
  this.equipment$ = this.equipmentService.getAllEquipment();
}
```

### Step 3: Use in Template
```html
<div *ngFor="let item of equipment$ | async">
  {{ item.EquipmentName }}
</div>
```

**That's it!** The UI will automatically update every 5 seconds.

---

## 📋 Available Services

### EquipmentService
```typescript
this.equipment$ = this.equipmentService.getAllEquipment();
this.equipmentService.createEquipment(data).subscribe(...);
this.equipmentService.updateEquipment(id, data).subscribe(...);
this.equipmentService.deleteEquipment(id).subscribe(...);
this.equipmentService.refreshNow(); // Force immediate refresh
```

### CertificateService
```typescript
this.certificates$ = this.certificateService.getAllCertificates();
this.expiring$ = this.certificateService.getExpiringSoon();
this.expired$ = this.certificateService.getExpired();
```

### LocationService
```typescript
this.locations$ = this.locationService.getAllLocations();
this.active$ = this.locationService.getActiveLocations();
this.root$ = this.locationService.getRootLocations();
```

### UserService
```typescript
this.users$ = this.userService.getAllUsers();
this.active$ = this.userService.getActiveUsers();
```

---

## 🔄 Complete Example

```typescript
import { Component, OnInit } from '@angular/core';
import { EquipmentService, Equipment } from '../services/equipment.service';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-equipment-list',
  template: `
    <div>
      <h2>Equipment</h2>
      <button (click)="refreshNow()">Refresh Now</button>
      
      <div *ngFor="let item of equipment$ | async">
        <div *ngIf="!item.IsDeleted">
          <strong>{{ item.EquipmentName }}</strong>
          <button (click)="delete(item.Id)">Delete</button>
        </div>
      </div>
    </div>
  `
})
export class EquipmentListComponent implements OnInit {
  equipment$: Observable<Equipment[]>;

  constructor(private equipmentService: EquipmentService) {}

  ngOnInit() {
    // Auto-refresh every 5 seconds automatically starts!
    this.equipment$ = this.equipmentService.getAllEquipment();
  }

  delete(id: number) {
    this.equipmentService.deleteEquipment(id).subscribe({
      next: () => console.log('Deleted!')
      // No manual refresh needed - service does it automatically!
    });
  }

  refreshNow() {
    // Force immediate refresh if you don't want to wait 5 seconds
    this.equipmentService.refreshNow();
  }
}
```

---

## ✅ What Happens Now

### Before (Old Way)
1. Load page → Fetch data once
2. Change database → UI doesn't know
3. User has to refresh page manually ❌

### After (New Way)
1. Load page → Fetch data
2. Auto-refresh runs every 5 seconds
3. Change database → UI updates automatically within 5 seconds ✅

---

## 🎯 Test It Yourself

1. **Load equipment page** in your Angular app
2. **Open SQL Server** and find an equipment record
3. **Set IsDeleted = 1** for that record
4. **Wait 5 seconds** (or click "Refresh Now" button)
5. **Watch as the record disappears** from the UI automatically! 🎉

---

## ⚙️ Configuration

### Change Refresh Interval
Want it to refresh more or less frequently? Edit the service:

```typescript
// In equipment.service.ts (or any service)
private refreshInterval = 5000; // 5 seconds

// Change to:
private refreshInterval = 3000;  // 3 seconds (faster)
private refreshInterval = 10000; // 10 seconds (slower)
```

### Disable Auto-Refresh
If you want manual refresh only:

```typescript
// In service constructor, comment this out:
// this.startAutoRefresh();

// Then use manual refresh when needed:
this.equipmentService.refreshNow();
```

---

## 🔐 Authentication
Services automatically use your Bearer token from localStorage:
```typescript
const token = localStorage.getItem('token');
// Token is automatically included in all API calls
```

---

## 📚 More Information

- **Full Guide**: See `frontend/src/app/services/AUTO_REFRESH_GUIDE.md`
- **Example Component**: See `equipment-list-example.component.ts`
- **Solution Summary**: See `SOLUTION_SUMMARY.md` in project root
- **Implementation Checklist**: See `IMPLEMENTATION_CHECKLIST.md`

---

## 🎓 Key Concepts

**BehaviorSubject**: Holds latest data and notifies all subscribers when new data arrives

**Observable | async pipe**: Automatically subscribes and unsubscribes in template

**interval()**: Runs code every N milliseconds (5000ms = 5 seconds)

**takeUntil()**: Automatically unsubscribes when component is destroyed (prevents memory leaks)

---

## ❓ FAQ

**Q: Will this cause too many API calls?**
A: No. It only calls the API every 5 seconds per service. You can adjust this interval.

**Q: What if the API is slow?**
A: The service waits for response before the next interval. No calls queue up.

**Q: Does it work offline?**
A: No. It needs internet connection to fetch data. Errors are logged to console.

**Q: Can I disable it?**
A: Yes. Comment out `startAutoRefresh()` in the service and use manual `refreshNow()` calls instead.

**Q: How do I know when new data arrived?**
A: You don't need to! The async pipe automatically displays the latest data.

---

## 🚨 Troubleshooting

**Data not updating?**
```
1. Open DevTools Console (F12)
2. Check for error messages
3. Verify token exists: localStorage.getItem('token')
4. Check API is running: curl http://localhost:3001/api/equipment
```

**Deleted records still showing?**
```
1. Verify backend IsDeleted filter is applied
2. Check database directly: SELECT * FROM Equipment WHERE IsDeleted = 0
3. Verify soft delete is working on create/delete
```

**Too many API calls?**
```
1. Increase refreshInterval in service
2. Or disable autorefresh and use manual calls only
3. Or implement smarter change detection
```

---

## 🎉 Summary

You now have:
✅ Automatic data synchronization every 5 seconds
✅ Soft-deleted records automatically hidden
✅ Manual refresh option available
✅ Minimal code changes required
✅ Production-ready solution
✅ TypeScript type safety
✅ Comprehensive error handling
✅ Full documentation

**The UI will now perfectly sync with database changes!** 🚀
