-- Simple SQL Script to Add Missing Audit Fields
-- This version is simpler and more compatible

PRINT '=== ADDING MISSING AUDIT FIELDS ===';
PRINT '';

-- Add CreatedBy field to Users table (if not exists)
IF NOT EXISTS (SELECT * FROM sys.columns WHERE Name = 'CreatedBy' AND Object_ID = Object_ID('Users'))
BEGIN
    ALTER TABLE Users ADD CreatedBy INT NULL;
    PRINT '✓ Added CreatedBy to Users table';
END
ELSE
BEGIN
    PRINT '✓ CreatedBy already exists in Users table';
END

-- Add UpdatedBy field to Users table (if not exists)
IF NOT EXISTS (SELECT * FROM sys.columns WHERE Name = 'UpdatedBy' AND Object_ID = Object_ID('Users'))
BEGIN
    ALTER TABLE Users ADD UpdatedBy INT NULL;
    PRINT '✓ Added UpdatedBy to Users table';
END
ELSE
BEGIN
    PRINT '✓ UpdatedBy already exists in Users table';
END

-- Add DeletedBy field to Users table (if not exists)
IF NOT EXISTS (SELECT * FROM sys.columns WHERE Name = 'DeletedBy' AND Object_ID = Object_ID('Users'))
BEGIN
    ALTER TABLE Users ADD DeletedBy INT NULL;
    PRINT '✓ Added DeletedBy to Users table';
END
ELSE
BEGIN
    PRINT '✓ DeletedBy already exists in Users table';
END

-- Add IsDeleted field to Users table (if not exists)
IF NOT EXISTS (SELECT * FROM sys.columns WHERE Name = 'IsDeleted' AND Object_ID = Object_ID('Users'))
BEGIN
    ALTER TABLE Users ADD IsDeleted BIT NOT NULL DEFAULT 0;
    PRINT '✓ Added IsDeleted to Users table';
END
ELSE
BEGIN
    PRINT '✓ IsDeleted already exists in Users table';
END

PRINT '';

-- Add CreatedBy field to CompanyDetails table (if not exists)
IF NOT EXISTS (SELECT * FROM sys.columns WHERE Name = 'CreatedBy' AND Object_ID = Object_ID('CompanyDetails'))
BEGIN
    ALTER TABLE CompanyDetails ADD CreatedBy INT NULL;
    PRINT '✓ Added CreatedBy to CompanyDetails table';
END
ELSE
BEGIN
    PRINT '✓ CreatedBy already exists in CompanyDetails table';
END

-- Add UpdatedBy field to CompanyDetails table (if not exists)
IF NOT EXISTS (SELECT * FROM sys.columns WHERE Name = 'UpdatedBy' AND Object_ID = Object_ID('CompanyDetails'))
BEGIN
    ALTER TABLE CompanyDetails ADD UpdatedBy INT NULL;
    PRINT '✓ Added UpdatedBy to CompanyDetails table';
END
ELSE
BEGIN
    PRINT '✓ UpdatedBy already exists in CompanyDetails table';
END

-- Add DeletedBy field to CompanyDetails table (if not exists)
IF NOT EXISTS (SELECT * FROM sys.columns WHERE Name = 'DeletedBy' AND Object_ID = Object_ID('CompanyDetails'))
BEGIN
    ALTER TABLE CompanyDetails ADD DeletedBy INT NULL;
    PRINT '✓ Added DeletedBy to CompanyDetails table';
END
ELSE
BEGIN
    PRINT '✓ DeletedBy already exists in CompanyDetails table';
END

-- Add IsDeleted field to CompanyDetails table (if not exists)
IF NOT EXISTS (SELECT * FROM sys.columns WHERE Name = 'IsDeleted' AND Object_ID = Object_ID('CompanyDetails'))
BEGIN
    ALTER TABLE CompanyDetails ADD IsDeleted BIT NOT NULL DEFAULT 0;
    PRINT '✓ Added IsDeleted to CompanyDetails table';
END
ELSE
BEGIN
    PRINT '✓ IsDeleted already exists in CompanyDetails table';
END

PRINT '';

-- Add CreatedBy field to Certificates table (if not exists)
IF NOT EXISTS (SELECT * FROM sys.columns WHERE Name = 'CreatedBy' AND Object_ID = Object_ID('Certificates'))
BEGIN
    ALTER TABLE Certificates ADD CreatedBy INT NULL;
    PRINT '✓ Added CreatedBy to Certificates table';
END
ELSE
BEGIN
    PRINT '✓ CreatedBy already exists in Certificates table';
END

-- Add UpdatedBy field to Certificates table (if not exists)
IF NOT EXISTS (SELECT * FROM sys.columns WHERE Name = 'UpdatedBy' AND Object_ID = Object_ID('Certificates'))
BEGIN
    ALTER TABLE Certificates ADD UpdatedBy INT NULL;
    PRINT '✓ Added UpdatedBy to Certificates table';
END
ELSE
BEGIN
    PRINT '✓ UpdatedBy already exists in Certificates table';
END

-- Add DeletedBy field to Certificates table (if not exists)
IF NOT EXISTS (SELECT * FROM sys.columns WHERE Name = 'DeletedBy' AND Object_ID = Object_ID('Certificates'))
BEGIN
    ALTER TABLE Certificates ADD DeletedBy INT NULL;
    PRINT '✓ Added DeletedBy to Certificates table';
END
ELSE
BEGIN
    PRINT '✓ DeletedBy already exists in Certificates table';
END

-- Add IsDeleted field to Certificates table (if not exists)
IF NOT EXISTS (SELECT * FROM sys.columns WHERE Name = 'IsDeleted' AND Object_ID = Object_ID('Certificates'))
BEGIN
    ALTER TABLE Certificates ADD IsDeleted BIT NOT NULL DEFAULT 0;
    PRINT '✓ Added IsDeleted to Certificates table';
END
ELSE
BEGIN
    PRINT '✓ IsDeleted already exists in Certificates table';
END

PRINT '';

-- Add CreatedBy field to Equipment table (if not exists)
IF NOT EXISTS (SELECT * FROM sys.columns WHERE Name = 'CreatedBy' AND Object_ID = Object_ID('Equipment'))
BEGIN
    ALTER TABLE Equipment ADD CreatedBy INT NULL;
    PRINT '✓ Added CreatedBy to Equipment table';
END
ELSE
BEGIN
    PRINT '✓ CreatedBy already exists in Equipment table';
END

-- Add UpdatedBy field to Equipment table (if not exists)
IF NOT EXISTS (SELECT * FROM sys.columns WHERE Name = 'UpdatedBy' AND Object_ID = Object_ID('Equipment'))
BEGIN
    ALTER TABLE Equipment ADD UpdatedBy INT NULL;
    PRINT '✓ Added UpdatedBy to Equipment table';
END
ELSE
BEGIN
    PRINT '✓ UpdatedBy already exists in Equipment table';
END

-- Add DeletedBy field to Equipment table (if not exists)
IF NOT EXISTS (SELECT * FROM sys.columns WHERE Name = 'DeletedBy' AND Object_ID = Object_ID('Equipment'))
BEGIN
    ALTER TABLE Equipment ADD DeletedBy INT NULL;
    PRINT '✓ Added DeletedBy to Equipment table';
END
ELSE
BEGIN
    PRINT '✓ DeletedBy already exists in Equipment table';
END

-- Add IsDeleted field to Equipment table (if not exists)
IF NOT EXISTS (SELECT * FROM sys.columns WHERE Name = 'IsDeleted' AND Object_ID = Object_ID('Equipment'))
BEGIN
    ALTER TABLE Equipment ADD IsDeleted BIT NOT NULL DEFAULT 0;
    PRINT '✓ Added IsDeleted to Equipment table';
END
ELSE
BEGIN
    PRINT '✓ IsDeleted already exists in Equipment table';
END

PRINT '';

-- Add CreatedBy field to Locations table (if not exists)
IF NOT EXISTS (SELECT * FROM sys.columns WHERE Name = 'CreatedBy' AND Object_ID = Object_ID('Locations'))
BEGIN
    ALTER TABLE Locations ADD CreatedBy INT NULL;
    PRINT '✓ Added CreatedBy to Locations table';
END
ELSE
BEGIN
    PRINT '✓ CreatedBy already exists in Locations table';
END

-- Add UpdatedBy field to Locations table (if not exists)
IF NOT EXISTS (SELECT * FROM sys.columns WHERE Name = 'UpdatedBy' AND Object_ID = Object_ID('Locations'))
BEGIN
    ALTER TABLE Locations ADD UpdatedBy INT NULL;
    PRINT '✓ Added UpdatedBy to Locations table';
END
ELSE
BEGIN
    PRINT '✓ UpdatedBy already exists in Locations table';
END

-- Add DeletedBy field to Locations table (if not exists)
IF NOT EXISTS (SELECT * FROM sys.columns WHERE Name = 'DeletedBy' AND Object_ID = Object_ID('Locations'))
BEGIN
    ALTER TABLE Locations ADD DeletedBy INT NULL;
    PRINT '✓ Added DeletedBy to Locations table';
END
ELSE
BEGIN
    PRINT '✓ DeletedBy already exists in Locations table';
END

-- Add IsDeleted field to Locations table (if not exists)
IF NOT EXISTS (SELECT * FROM sys.columns WHERE Name = 'IsDeleted' AND Object_ID = Object_ID('Locations'))
BEGIN
    ALTER TABLE Locations ADD IsDeleted BIT NOT NULL DEFAULT 0;
    PRINT '✓ Added IsDeleted to Locations table';
END
ELSE
BEGIN
    PRINT '✓ IsDeleted already exists in Locations table';
END

PRINT '';
PRINT '=== AUDIT FIELDS ADDITION COMPLETE ===';
PRINT '';
PRINT 'All missing audit fields have been added successfully!';
PRINT '';
PRINT 'Your database now has complete audit tracking capabilities:';
PRINT '- CreatedBy: Tracks who created each record';
PRINT '- UpdatedBy: Tracks who last modified each record';
PRINT '- DeletedBy: Tracks who deleted each record';
PRINT '- IsDeleted: Boolean flag for soft delete (true/false)';
PRINT '';
PRINT 'Next steps:';
PRINT '1. Restart your application to use the new audit fields';
PRINT '2. Test creating/updating records to verify audit tracking works';