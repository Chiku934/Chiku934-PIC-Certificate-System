-- SQL Script to Check Current Audit Fields in Your Database
-- Run this script in SQL Server Management Studio to see what audit fields you currently have

PRINT '=== CURRENT AUDIT FIELDS IN YOUR DATABASE ===';
PRINT '';

-- Check for basic audit fields (CreatedDate, UpdatedDate, DeletedDate)
SELECT 
    TABLE_NAME as 'Table',
    COLUMN_NAME as 'Audit Field',
    DATA_TYPE as 'Type',
    IS_NULLABLE as 'Nullable'
FROM INFORMATION_SCHEMA.COLUMNS 
WHERE COLUMN_NAME IN ('CreatedDate', 'UpdatedDate', 'DeletedDate')
AND TABLE_SCHEMA = 'dbo'
ORDER BY TABLE_NAME, COLUMN_NAME;

PRINT '';
PRINT '=== MISSING USER TRACKING FIELDS (CreatedBy, UpdatedBy, DeletedBy, IsDeleted) ===';
PRINT '';

-- Check which tables are missing the user tracking fields
WITH AllTables AS (
    SELECT 'Users' as TableName
    UNION SELECT 'CompanyDetails'
    UNION SELECT 'Company'
    UNION SELECT 'Certificates'
    UNION SELECT 'Equipment'
    UNION SELECT 'Locations'
    UNION SELECT 'Roles'
    UNION SELECT 'UserRoleMappings'
    UNION SELECT 'Applications'
    UNION SELECT 'RoleAndApplicationWisePermissions'
    UNION SELECT 'AuditLogs'
    UNION SELECT 'LetterHeads'
    UNION SELECT 'EmailDomains'
    UNION SELECT 'EmailAccounts'
    UNION SELECT 'EquipmentHistories'
    UNION SELECT 'MaintenanceSchedules'
),
AuditFields AS (
    SELECT 'CreatedBy' as FieldName
    UNION SELECT 'UpdatedBy'
    UNION SELECT 'DeletedBy'
    UNION SELECT 'IsDeleted'
),
CurrentFields AS (
    SELECT DISTINCT TABLE_NAME, COLUMN_NAME
    FROM INFORMATION_SCHEMA.COLUMNS 
    WHERE COLUMN_NAME IN ('CreatedBy', 'UpdatedBy', 'DeletedBy', 'IsDeleted')
    AND TABLE_SCHEMA = 'dbo'
)
SELECT 
    at.TableName,
    af.FieldName,
    CASE WHEN cf.COLUMN_NAME IS NOT NULL THEN 'EXISTS' ELSE 'MISSING' END as Status
FROM AllTables at
CROSS JOIN AuditFields af
LEFT JOIN CurrentFields cf ON at.TableName = cf.TABLE_NAME AND af.FieldName = cf.COLUMN_NAME
ORDER BY at.TableName, af.FieldName;

PRINT '';
PRINT '=== SUMMARY ===';
PRINT '';

-- Count missing fields per table
SELECT 
    at.TableName,
    COUNT(*) as 'Total Audit Fields Expected',
    SUM(CASE WHEN cf.COLUMN_NAME IS NOT NULL THEN 1 ELSE 0 END) as 'Fields Present',
    SUM(CASE WHEN cf.COLUMN_NAME IS NULL THEN 1 ELSE 0 END) as 'Fields Missing'
FROM AllTables at
CROSS JOIN AuditFields af
LEFT JOIN CurrentFields cf ON at.TableName = cf.TABLE_NAME AND af.FieldName = cf.COLUMN_NAME
GROUP BY at.TableName
ORDER BY [Fields Missing] DESC, at.TableName;

PRINT '';
PRINT '=== INSTRUCTIONS ===';
PRINT '1. Run the add_missing_audit_fields.sql script to add the missing fields';
PRINT '2. After running the script, re-run this check to verify all fields are present';
PRINT '3. Your database will then have complete audit tracking capabilities';