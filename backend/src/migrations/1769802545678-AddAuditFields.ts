import { MigrationInterface, QueryRunner, TableColumn } from 'typeorm';

export class AddAuditFields1769802545678 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    // Add audit fields to all tables that extend BaseEntity
    const tables = [
      'Users',
      'CompanyDetails',
      'Company',
      'Certificates',
      'Equipment',
      'Locations',
      'Roles',
      'UserRoleMappings',
      'Applications',
      'RoleAndApplicationWisePermissions',
      'AuditLogs',
      'LetterHeads',
      'EmailDomains',
      'EmailAccounts',
      'EquipmentHistories',
      'MaintenanceSchedules'
    ];

    for (const tableName of tables) {
      // Add CreatedBy column
      await queryRunner.addColumn(tableName, new TableColumn({
        name: 'CreatedBy',
        type: 'int',
        isNullable: true,
      }));

      // Add UpdatedBy column
      await queryRunner.addColumn(tableName, new TableColumn({
        name: 'UpdatedBy',
        type: 'int',
        isNullable: true,
      }));

      // Add DeletedBy column
      await queryRunner.addColumn(tableName, new TableColumn({
        name: 'DeletedBy',
        type: 'int',
        isNullable: true,
      }));

      // Add IsDeleted column
      await queryRunner.addColumn(tableName, new TableColumn({
        name: 'IsDeleted',
        type: 'bit',
        default: false,
        isNullable: false,
      }));

      // Add DeletedDate column
      await queryRunner.addColumn(tableName, new TableColumn({
        name: 'DeletedDate',
        type: 'datetime2',
        isNullable: true,
      }));
    }
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    // Remove audit fields from all tables
    const tables = [
      'Users',
      'CompanyDetails',
      'Company',
      'Certificates',
      'Equipment',
      'Locations',
      'Roles',
      'UserRoleMappings',
      'Applications',
      'RoleAndApplicationWisePermissions',
      'AuditLogs',
      'LetterHeads',
      'EmailDomains',
      'EmailAccounts',
      'EquipmentHistories',
      'MaintenanceSchedules'
    ];

    for (const tableName of tables) {
      await queryRunner.dropColumn(tableName, 'CreatedBy');
      await queryRunner.dropColumn(tableName, 'UpdatedBy');
      await queryRunner.dropColumn(tableName, 'DeletedBy');
      await queryRunner.dropColumn(tableName, 'IsDeleted');
      await queryRunner.dropColumn(tableName, 'DeletedDate');
    }
  }
}