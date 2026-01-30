-- SQL Script to Add Audit Fields to All Tables
-- Run this script in SQL Server Management Studio

-- Add audit fields to Users table
ALTER TABLE Users ADD 
    CreatedBy INT NULL,
    UpdatedBy INT NULL,
    DeletedBy INT NULL,
    IsDeleted BIT NOT NULL DEFAULT 0,
    DeletedDate DATETIME2 NULL;

-- Add audit fields to CompanyDetails table
ALTER TABLE CompanyDetails ADD 
    CreatedBy INT NULL,
    UpdatedBy INT NULL,
    DeletedBy INT NULL,
    IsDeleted BIT NOT NULL DEFAULT 0,
    DeletedDate DATETIME2 NULL;

-- Add audit fields to Company table
ALTER TABLE Company ADD 
    CreatedBy INT NULL,
    UpdatedBy INT NULL,
    DeletedBy INT NULL,
    IsDeleted BIT NOT NULL DEFAULT 0,
    DeletedDate DATETIME2 NULL;

-- Add audit fields to Certificates table
ALTER TABLE Certificates ADD 
    CreatedBy INT NULL,
    UpdatedBy INT NULL,
    DeletedBy INT NULL,
    IsDeleted BIT NOT NULL DEFAULT 0,
    DeletedDate DATETIME2 NULL;

-- Add audit fields to Equipment table
ALTER TABLE Equipment ADD 
    CreatedBy INT NULL,
    UpdatedBy INT NULL,
    DeletedBy INT NULL,
    IsDeleted BIT NOT NULL DEFAULT 0,
    DeletedDate DATETIME2 NULL;

-- Add audit fields to Locations table
ALTER TABLE Locations ADD 
    CreatedBy INT NULL,
    UpdatedBy INT NULL,
    DeletedBy INT NULL,
    IsDeleted BIT NOT NULL DEFAULT 0,
    DeletedDate DATETIME2 NULL;

-- Add audit fields to Roles table
ALTER TABLE Roles ADD 
    CreatedBy INT NULL,
    UpdatedBy INT NULL,
    DeletedBy INT NULL,
    IsDeleted BIT NOT NULL DEFAULT 0,
    DeletedDate DATETIME2 NULL;

-- Add audit fields to UserRoleMappings table
ALTER TABLE UserRoleMappings ADD 
    CreatedBy INT NULL,
    UpdatedBy INT NULL,
    DeletedBy INT NULL,
    IsDeleted BIT NOT NULL DEFAULT 0,
    DeletedDate DATETIME2 NULL;

-- Add audit fields to Applications table
ALTER TABLE Applications ADD 
    CreatedBy INT NULL,
    UpdatedBy INT NULL,
    DeletedBy INT NULL,
    IsDeleted BIT NOT NULL DEFAULT 0,
    DeletedDate DATETIME2 NULL;

-- Add audit fields to RoleAndApplicationWisePermissions table
ALTER TABLE RoleAndApplicationWisePermissions ADD 
    CreatedBy INT NULL,
    UpdatedBy INT NULL,
    DeletedBy INT NULL,
    IsDeleted BIT NOT NULL DEFAULT 0,
    DeletedDate DATETIME2 NULL;

-- Add audit fields to AuditLogs table
ALTER TABLE AuditLogs ADD 
    CreatedBy INT NULL,
    UpdatedBy INT NULL,
    DeletedBy INT NULL,
    IsDeleted BIT NOT NULL DEFAULT 0,
    DeletedDate DATETIME2 NULL;

-- Add audit fields to LetterHeads table
ALTER TABLE LetterHeads ADD 
    CreatedBy INT NULL,
    UpdatedBy INT NULL,
    DeletedBy INT NULL,
    IsDeleted BIT NOT NULL DEFAULT 0,
    DeletedDate DATETIME2 NULL;

-- Add audit fields to EmailDomains table
ALTER TABLE EmailDomains ADD 
    CreatedBy INT NULL,
    UpdatedBy INT NULL,
    DeletedBy INT NULL,
    IsDeleted BIT NOT NULL DEFAULT 0,
    DeletedDate DATETIME2 NULL;

-- Add audit fields to EmailAccounts table
ALTER TABLE EmailAccounts ADD 
    CreatedBy INT NULL,
    UpdatedBy INT NULL,
    DeletedBy INT NULL,
    IsDeleted BIT NOT NULL DEFAULT 0,
    DeletedDate DATETIME2 NULL;

-- Add audit fields to EquipmentHistories table
ALTER TABLE EquipmentHistories ADD 
    CreatedBy INT NULL,
    UpdatedBy INT NULL,
    DeletedBy INT NULL,
    IsDeleted BIT NOT NULL DEFAULT 0,
    DeletedDate DATETIME2 NULL;

-- Add audit fields to MaintenanceSchedules table
ALTER TABLE MaintenanceSchedules ADD 
    CreatedBy INT NULL,
    UpdatedBy INT NULL,
    DeletedBy INT NULL,
    IsDeleted BIT NOT NULL DEFAULT 0,
    DeletedDate DATETIME2 NULL;

PRINT 'Audit fields added to all tables successfully!';