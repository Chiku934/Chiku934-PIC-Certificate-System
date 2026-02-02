import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Observable, Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { Equipment, EquipmentService } from '../../services/equipment.service';

/**
 * Example Equipment List Component
 * 
 * This component demonstrates how to use the auto-refresh EquipmentService.
 * The equipment list will automatically update every 5 seconds as fresh data
 * is fetched from the backend.
 * 
 * Key Features:
 * - Automatic data refresh every 5 seconds
 * - Soft-deleted records automatically hidden
 * - TypeScript type safety
 * - Proper subscription management with takeUntil
 * - Easy integration with Angular templates
 */
@Component({
  selector: 'app-equipment-list-example',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="equipment-container">
      <div class="header">
        <h2>Equipment Management</h2>
        <button (click)="refreshNow()" class="btn-refresh">
          Refresh Now
        </button>
      </div>

      <div class="equipment-list">
        <!-- Using async pipe for automatic subscription -->
        <div *ngFor="let equipment of equipment$ | async" 
             class="equipment-card"
             [class.deleted]="equipment.IsDeleted">
          
          <div class="equipment-info">
            <h3>{{ equipment.EquipmentName }}</h3>
            <p><strong>Type:</strong> {{ equipment.EquipmentType || 'N/A' }}</p>
            <p><strong>Serial:</strong> {{ equipment.SerialNumber || 'N/A' }}</p>
            <p><strong>Status:</strong> 
              <span [class]="'status-' + (equipment.Status || 'unknown')">
                {{ equipment.Status || 'Unknown' }}
              </span>
            </p>
            <p *ngIf="equipment.IsDeleted" class="deleted-notice">
              🗑️ Marked for deletion
            </p>
          </div>

          <div class="equipment-actions">
            <button (click)="editEquipment(equipment)" class="btn-edit">
              Edit
            </button>
            <button (click)="deleteEquipment(equipment.Id)" class="btn-delete">
              Delete
            </button>
          </div>
        </div>

        <!-- Show message if no equipment -->
        <div *ngIf="(equipment$ | async)?.length === 0" class="no-data">
          <p>No equipment found. Create your first equipment to get started.</p>
        </div>
      </div>

      <div class="info-panel">
        <p class="info-text">
          💡 <strong>Note:</strong> This list automatically updates every 5 seconds.
          If you manually change IsDeleted in the database, the UI will reflect 
          the change automatically.
        </p>
      </div>
    </div>
  `,
  styles: [`
    .equipment-container {
      max-width: 1200px;
      margin: 0 auto;
      padding: 20px;
    }

    .header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 30px;
    }

    .btn-refresh {
      padding: 8px 16px;
      background-color: #4CAF50;
      color: white;
      border: none;
      border-radius: 4px;
      cursor: pointer;
      font-weight: bold;
    }

    .btn-refresh:hover {
      background-color: #45a049;
    }

    .equipment-list {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
      gap: 20px;
    }

    .equipment-card {
      border: 1px solid #ddd;
      border-radius: 8px;
      padding: 16px;
      background: white;
      box-shadow: 0 2px 4px rgba(0,0,0,0.1);
      transition: all 0.3s ease;
    }

    .equipment-card:hover {
      box-shadow: 0 4px 8px rgba(0,0,0,0.15);
    }

    .equipment-card.deleted {
      opacity: 0.6;
      background: #f5f5f5;
      border-color: #ccc;
    }

    .equipment-info h3 {
      margin: 0 0 12px 0;
      color: #333;
    }

    .equipment-info p {
      margin: 8px 0;
      font-size: 14px;
      color: #666;
    }

    .status-Active {
      color: #4CAF50;
      font-weight: bold;
    }

    .status-Inactive {
      color: #ff9800;
      font-weight: bold;
    }

    .status-Maintenance {
      color: #2196F3;
      font-weight: bold;
    }

    .deleted-notice {
      color: #f44336;
      font-style: italic;
      margin-top: 8px;
    }

    .equipment-actions {
      display: flex;
      gap: 8px;
      margin-top: 16px;
      border-top: 1px solid #eee;
      padding-top: 12px;
    }

    .btn-edit, .btn-delete {
      flex: 1;
      padding: 8px;
      border: none;
      border-radius: 4px;
      cursor: pointer;
      font-weight: bold;
      font-size: 13px;
    }

    .btn-edit {
      background-color: #2196F3;
      color: white;
    }

    .btn-edit:hover {
      background-color: #0b7dda;
    }

    .btn-delete {
      background-color: #f44336;
      color: white;
    }

    .btn-delete:hover {
      background-color: #da190b;
    }

    .no-data {
      grid-column: 1 / -1;
      text-align: center;
      padding: 40px 20px;
      color: #999;
      border: 2px dashed #ddd;
      border-radius: 8px;
    }

    .info-panel {
      margin-top: 30px;
      padding: 16px;
      background: #e3f2fd;
      border-left: 4px solid #2196F3;
      border-radius: 4px;
    }

    .info-text {
      margin: 0;
      color: #1976d2;
      font-size: 14px;
    }
  `]
})
export class EquipmentListExampleComponent implements OnInit, OnDestroy {
  // Observable that automatically updates with fresh equipment data
  equipment$: Observable<Equipment[]>;

  // Subject to manage unsubscription
  private destroy$ = new Subject<void>();

  constructor(private equipmentService: EquipmentService) {
    this.equipment$ = this.equipmentService.getAllEquipment();
  }

  ngOnInit(): void {
  }

  /**
   * Force an immediate refresh of equipment data
   * This is useful when you want to refresh without waiting for the next interval
   */
  refreshNow(): void {
    this.equipmentService.refreshNow();
  }

  /**
   * Delete equipment (soft delete)
   * The service will automatically trigger a refresh after deletion
   */
  deleteEquipment(id: number): void {
    if (confirm('Are you sure you want to delete this equipment?')) {
      this.equipmentService.deleteEquipment(id)
        .pipe(takeUntil(this.destroy$))
        .subscribe({
          next: () => {
          },
          error: (error) => {
            alert('Failed to delete equipment');
          }
        });
    }
  }

  /**
   * Edit equipment
   * Navigate to edit page or open edit dialog
   */
  editEquipment(equipment: Equipment): void {
  }

  /**
   * Clean up subscriptions when component is destroyed
   */
  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}

/**
 * INTEGRATION EXAMPLE
 * 
 * To use this component in your application:
 * 
 * 1. Import the component in your module or routing configuration:
 *    import { EquipmentListExampleComponent } from './components/equipment-list-example/equipment-list-example.component';
 * 
 * 2. Add it to your route:
 *    {
 *      path: 'equipment',
 *      component: EquipmentListExampleComponent
 *    }
 * 
 * 3. The component will automatically handle data refresh!
 * 
 * WHAT HAPPENS:
 * - Component loads → Calls equipmentService.getAllEquipment()
 * - Service returns Observable with current data
 * - Template displays data using async pipe
 * - Every 5 seconds, service fetches fresh data from backend
 * - If IsDeleted filter is applied on backend, deleted items are automatically hidden
 * - User sees up-to-date data without any manual action
 * 
 * TESTING:
 * 1. Load this page
 * 2. Open database and set IsDeleted = 1 for a record
 * 3. Wait 5 seconds
 * 4. Watch as the record disappears from UI automatically!
 */
