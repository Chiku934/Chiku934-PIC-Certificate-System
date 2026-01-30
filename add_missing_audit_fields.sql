-- SQL Script to Add Missing Audit Fields to All Tables
-- This script adds the user tracking fields that are missing from your database
-- Run this script in SQL Server Management Studio

-- Check if audit fields already exist before adding them
-- Add CreatedBy field to all tables (if not exists)
IF NOT EXISTS (SELECT * FROM sys.columns WHERE Name = 'CreatedBy' AND Object_ID = Object_ID('Users'))
BEGIN
    ALTER TABLE Users ADD CreatedBy INT NULL;
    PRINT 'Added CreatedBy to Users table';
END

IF NOT EXISTS (SELECT * FROM sys.columns WHERE Name = 'CreatedBy' AND Object_ID = Object_ID('CompanyDetails'))
BEGIN
    ALTER TABLE CompanyDetails ADD CreatedBy INT NULL;
    PRINT 'Added CreatedBy to CompanyDetails table';
END

IF NOT EXISTS (SELECT * FROM sys.columns WHERE Name = 'CreatedBy' AND Object_ID = Object_ID('Company'))
BEGIN
    ALTER TABLE Company ADD CreatedBy INT NULL;
    PRINT 'Added CreatedBy to Company table';
END

IF NOT EXISTS (SELECT * FROM sys.columns WHERE Name = 'CreatedBy' AND Object_ID = Object_ID('Certificates'))
BEGIN
    ALTER TABLE Certificates ADD CreatedBy INT NULL;
    PRINT 'Added CreatedBy to Certificates table';
END

IF NOT EXISTS (SELECT * FROM sys.columns WHERE Name = 'CreatedBy' AND Object_ID = Object_ID('Equipment'))
BEGIN
    ALTER TABLE Equipment ADD CreatedBy INT NULL;
    PRINT 'Added CreatedBy to Equipment table';
END

IF NOT EXISTS (SELECT * FROM sys.columns WHERE Name = 'CreatedBy' AND Object_ID = Object_ID('Locations'))
BEGIN
    ALTER TABLE Locations ADD CreatedBy INT NULL;
    PRINT 'Added CreatedBy to Locations table';
END

IF NOT EXISTS (SELECT * FROM sys.columns WHERE Name = 'CreatedBy' AND Object_ID = Object_ID('Roles'))
BEGIN
    ALTER TABLE Roles ADD CreatedBy INT NULL;
    PRINT 'Added CreatedBy to Roles table';
END

IF NOT EXISTS (SELECT * FROM sys.columns WHERE Name = 'CreatedBy' AND Object_ID = Object_ID('UserRoleMappings'))
BEGIN
    ALTER TABLE UserRoleMappings ADD CreatedBy INT NULL;
    PRINT 'Added CreatedBy to UserRoleMappings table';
END

IF NOT EXISTS (SELECT * FROM sys.columns WHERE Name = 'CreatedBy' AND Object_ID = Object_ID('Applications'))
BEGIN
    ALTER TABLE Applications ADD CreatedBy INT NULL;
    PRINT 'Added CreatedBy to Applications table';
END

IF NOT EXISTS (SELECT * FROM sys.columns WHERE Name = 'CreatedBy' AND Object_ID = Object_ID('RoleAndApplicationWisePermissions'))
BEGIN
    ALTER TABLE RoleAndApplicationWisePermissions ADD CreatedBy INT NULL;
    PRINT 'Added CreatedBy to RoleAndApplicationWisePermissions table';
END

IF NOT EXISTS (SELECT * FROM sys.columns WHERE Name = 'CreatedBy' AND Object_ID = Object_ID('AuditLogs'))
BEGIN
    ALTER TABLE AuditLogs ADD CreatedBy INT NULL;
    PRINT 'Added CreatedBy to AuditLogs table';
END

IF NOT EXISTS (SELECT * FROM sys.columns WHERE Name = 'CreatedBy' AND Object_ID = Object_ID('LetterHeads'))
BEGIN
    ALTER TABLE LetterHeads ADD CreatedBy INT NULL;
    PRINT 'Added CreatedBy to LetterHeads table';
END

IF NOT EXISTS (SELECT * FROM sys.columns WHERE Name = 'CreatedBy' AND Object_ID = Object_ID('EmailDomains'))
BEGIN
    ALTER TABLE EmailDomains ADD CreatedBy INT NULL;
    PRINT 'Added CreatedBy to EmailDomains table';
END

IF NOT EXISTS (SELECT * FROM sys.columns WHERE Name = 'CreatedBy' AND Object_ID = Object_ID('EmailAccounts'))
BEGIN
    ALTER TABLE EmailAccounts ADD CreatedBy INT NULL;
    PRINT 'Added CreatedBy to EmailAccounts table';
END

IF NOT EXISTS (SELECT * FROM sys.columns WHERE Name = 'CreatedBy' AND Object_ID = Object_ID('EquipmentHistories'))
BEGIN
    ALTER TABLE EquipmentHistories ADD CreatedBy INT NULL;
    PRINT 'Added CreatedBy to EquipmentHistories table';
END

IF NOT EXISTS (SELECT * FROM sys.columns WHERE Name = 'CreatedBy' AND Object_ID = Object_ID('MaintenanceSchedules'))
BEGIN
    ALTER TABLE MaintenanceSchedules ADD CreatedBy INT NULL;
    PRINT 'Added CreatedBy to MaintenanceSchedules table';
END

-- Add UpdatedBy field to all tables (if not exists)
IF NOT EXISTS (SELECT * FROM sys.columns WHERE Name = 'UpdatedBy' AND Object_ID = Object_ID('Users'))
BEGIN
    ALTER TABLE Users ADD UpdatedBy INT NULL;
    PRINT 'Added UpdatedBy to Users table';
END

IF NOT EXISTS (SELECT * FROM sys.columns WHERE Name = 'UpdatedBy' AND Object_ID = Object_ID('CompanyDetails'))
BEGIN
    ALTER TABLE CompanyDetails ADD UpdatedBy INT NULL;
    PRINT 'Added UpdatedBy to CompanyDetails table';
END

IF NOT EXISTS (SELECT * FROM sys.columns WHERE Name = 'UpdatedBy' AND Object_ID = Object_ID('Company'))
BEGIN
    ALTER TABLE Company ADD UpdatedBy INT NULL;
    PRINT 'Added UpdatedBy to Company table';
END

IF NOT EXISTS (SELECT * FROM sys.columns WHERE Name = 'UpdatedBy' AND Object_ID = Object_ID('Certificates'))
BEGIN
    ALTER TABLE Certificates ADD UpdatedBy INT NULL;
    PRINT 'Added UpdatedBy to Certificates table';
END

IF NOT EXISTS (SELECT * FROM sys.columns WHERE Name = 'UpdatedBy' AND Object_ID = Object_ID('Equipment'))
BEGIN
    ALTER TABLE Equipment ADD UpdatedBy INT NULL;
    PRINT 'Added UpdatedBy to Equipment table';
END

IF NOT EXISTS (SELECT * FROM sys.columns WHERE Name = 'UpdatedBy' AND Object_ID = Object_ID('Locations'))
BEGIN
    ALTER TABLE Locations ADD UpdatedBy INT NULL;
    PRINT 'Added UpdatedBy to Locations table';
END

IF NOT EXISTS (SELECT * FROM sys.columns WHERE Name = 'UpdatedBy' AND Object_ID = Object_ID('Roles'))
BEGIN
    ALTER TABLE Roles ADD UpdatedBy INT NULL;
    PRINT 'Added UpdatedBy to Roles table';
END

IF NOT EXISTS (SELECT * FROM sys.columns WHERE Name = 'UpdatedBy' AND Object_ID = Object_ID('UserRoleMappings'))
BEGIN
    ALTER TABLE UserRoleMappings ADD UpdatedBy INT NULL;
    PRINT 'Added UpdatedBy to UserRoleMappings table';
END

IF NOT EXISTS (SELECT * FROM sys.columns WHERE Name = 'UpdatedBy' AND Object_ID = Object_ID('Applications'))
BEGIN
    ALTER TABLE Applications ADD UpdatedBy INT NULL;
    PRINT 'Added UpdatedBy to Applications table';
END

IF NOT EXISTS (SELECT * FROM sys.columns WHERE Name = 'UpdatedBy' AND Object_ID = Object_ID('RoleAndApplicationWisePermissions'))
BEGIN
    ALTER TABLE RoleAndApplicationWisePermissions ADD UpdatedBy INT NULL;
    PRINT 'Added UpdatedBy to RoleAndApplicationWisePermissions table';
END

IF NOT EXISTS (SELECT * FROM sys.columns WHERE Name = 'UpdatedBy' AND Object_ID = Object_ID('AuditLogs'))
BEGIN
    ALTER TABLE AuditLogs ADD UpdatedBy INT NULL;
    PRINT 'Added UpdatedBy to AuditLogs table';
END

IF NOT EXISTS (SELECT * FROM sys.columns WHERE Name = 'UpdatedBy' AND Object_ID = Object_ID('LetterHeads'))
BEGIN
    ALTER TABLE LetterHeads ADD UpdatedBy INT NULL;
    PRINT 'Added UpdatedBy to LetterHeads table';
END

IF NOT EXISTS (SELECT * FROM sys.columns WHERE Name = 'UpdatedBy' AND Object_ID = Object_ID('EmailDomains'))
BEGIN
    ALTER TABLE EmailDomains ADD UpdatedBy INT NULL;
    PRINT 'Added UpdatedBy to EmailDomains table';
END

IF NOT EXISTS (SELECT * FROM sys.columns WHERE Name = 'UpdatedBy' AND Object_ID = Object_ID('EmailAccounts'))
BEGIN
    ALTER TABLE EmailAccounts ADD UpdatedBy INT NULL;
    PRINT 'Added UpdatedBy to EmailAccounts table';
END

IF NOT EXISTS (SELECT * FROM sys.columns WHERE Name = 'UpdatedBy' AND Object_ID = Object_ID('EquipmentHistories'))
BEGIN
    ALTER TABLE EquipmentHistories ADD UpdatedBy INT NULL;
    PRINT 'Added UpdatedBy to EquipmentHistories table';
END

IF NOT EXISTS (SELECT * FROM sys.columns WHERE Name = 'UpdatedBy' AND Object_ID = Object_ID('MaintenanceSchedules'))
BEGIN
    ALTER TABLE MaintenanceSchedules ADD UpdatedBy INT NULL;
    PRINT 'Added UpdatedBy to MaintenanceSchedules table';
END

-- Add DeletedBy field to all tables (if not exists)
IF NOT EXISTS (SELECT * FROM sys.columns WHERE Name = 'DeletedBy' AND Object_ID = Object_ID('Users'))
BEGIN
    ALTER TABLE Users ADD DeletedBy INT NULL;
    PRINT 'Added DeletedBy to Users table';
END

IF NOT EXISTS (SELECT * FROM sys.columns WHERE Name = 'DeletedBy' AND Object_ID = Object_ID('CompanyDetails'))
BEGIN
    ALTER TABLE CompanyDetails ADD DeletedBy INT NULL;
    PRINT 'Added DeletedBy to CompanyDetails table';
END

IF NOT EXISTS (SELECT * FROM sys.columns WHERE Name = 'DeletedBy' AND Object_ID = Object_ID('Company'))
BEGIN
    ALTER TABLE Company ADD DeletedBy INT NULL;
    PRINT 'Added DeletedBy to Company table';
END

IF NOT EXISTS (SELECT * FROM sys.columns WHERE Name = 'DeletedBy' AND Object_ID = Object_ID('Certificates'))
BEGIN
    ALTER TABLE Certificates ADD DeletedBy INT NULL;
    PRINT 'Added DeletedBy to Certificates table';
END

IF NOT EXISTS (SELECT * FROM sys.columns WHERE Name = 'DeletedBy' AND Object_ID = Object_ID('Equipment'))
BEGIN
    ALTER TABLE Equipment ADD DeletedBy INT NULL;
    PRINT 'Added DeletedBy to Equipment table';
END

IF NOT EXISTS (SELECT * FROM sys.columns WHERE Name = 'DeletedBy' AND Object_ID = Object_ID('Locations'))
BEGIN
    ALTER TABLE Locations ADD DeletedBy INT NULL;
    PRINT 'Added DeletedBy to Locations table';
END

IF NOT EXISTS (SELECT * FROM sys.columns WHERE Name = 'DeletedBy' AND Object_ID = Object_ID('Roles'))
BEGIN
    ALTER TABLE Roles ADD DeletedBy INT NULL;
    PRINT 'Added DeletedBy to Roles table';
END

IF NOT EXISTS (SELECT * FROM sys.columns WHERE Name = 'DeletedBy' AND Object_ID = Object_ID('UserRoleMappings'))
BEGIN
    ALTER TABLE UserRoleMappings ADD DeletedBy INT NULL;
    PRINT 'Added DeletedBy to UserRoleMappings table';
END

IF NOT EXISTS (SELECT * FROM sys.columns WHERE Name = 'DeletedBy' AND Object_ID = Object_ID('Applications'))
BEGIN
    ALTER TABLE Applications ADD DeletedBy INT NULL;
    PRINT 'Added DeletedBy to Applications table';
END

IF NOT EXISTS (SELECT * FROM sys.columns WHERE Name = 'DeletedBy' AND Object_ID = Object_ID('RoleAndApplicationWisePermissions'))
BEGIN
    ALTER TABLE RoleAndApplicationWisePermissions ADD DeletedBy INT NULL;
    PRINT 'Added DeletedBy to RoleAndApplicationWisePermissions table';
END

IF NOT EXISTS (SELECT * FROM sys.columns WHERE Name = 'DeletedBy' AND Object_ID = Object_ID('AuditLogs'))
BEGIN
    ALTER TABLE AuditLogs ADD DeletedBy INT NULL;
    PRINT 'Added DeletedBy to AuditLogs table';
END

IF NOT EXISTS (SELECT * FROM sys.columns WHERE Name = 'DeletedBy' AND Object_ID = Object_ID('LetterHeads'))
BEGIN
    ALTER TABLE LetterHeads ADD DeletedBy INT NULL;
    PRINT 'Added DeletedBy to LetterHeads table';
END

IF NOT EXISTS (SELECT * FROM sys.columns WHERE Name = 'DeletedBy' AND Object_ID = Object_ID('EmailDomains'))
BEGIN
    ALTER TABLE EmailDomains ADD DeletedBy INT NULL;
    PRINT 'Added DeletedBy to EmailDomains table';
END

IF NOT EXISTS (SELECT * FROM sys.columns WHERE Name = 'DeletedBy' AND Object_ID = Object_ID('EmailAccounts'))
BEGIN
    ALTER TABLE EmailAccounts ADD DeletedBy INT NULL;
    PRINT 'Added DeletedBy to EmailAccounts table';
END

IF NOT EXISTS (SELECT * FROM sys.columns WHERE Name = 'DeletedBy' AND Object_ID = Object_ID('EquipmentHistories'))
BEGIN
    ALTER TABLE EquipmentHistories ADD DeletedBy INT NULL;
    PRINT 'Added DeletedBy to EquipmentHistories table';
END

IF NOT EXISTS (SELECT * FROM sys.columns WHERE Name = 'DeletedBy' AND Object_ID = Object_ID('MaintenanceSchedules'))
BEGIN
    ALTER TABLE MaintenanceSchedules ADD DeletedBy INT NULL;
    PRINT 'Added DeletedBy to MaintenanceSchedules table';
END

-- Add IsDeleted field to all tables (if not exists)
IF NOT EXISTS (SELECT * FROM sys.columns WHERE Name = 'IsDeleted' AND Object_ID = Object_ID('Users'))
BEGIN
    ALTER TABLE Users ADD IsDeleted BIT NOT NULL DEFAULT 0;
    PRINT 'Added IsDeleted to Users table';
END

IF NOT EXISTS (SELECT * FROM sys.columns WHERE Name = 'IsDeleted' AND Object_ID = Object_ID('CompanyDetails'))
BEGIN
    ALTER TABLE CompanyDetails ADD IsDeleted BIT NOT NULL DEFAULT 0;
    PRINT 'Added IsDeleted to CompanyDetails table';
END

IF NOT EXISTS (SELECT * FROM sys.columns WHERE Name = 'IsDeleted' AND Object_ID = Object_ID('Company'))
BEGIN
    ALTER TABLE Company ADD IsDeleted BIT NOT NULL DEFAULT 0;
    PRINT 'Added IsDeleted to Company table';
END

IF NOT EXISTS (SELECT * FROM sys.columns WHERE Name = 'IsDeleted' AND Object_ID = Object_ID('Certificates'))
BEGIN
    ALTER TABLE Certificates ADD IsDeleted BIT NOT NULL DEFAULT 0;
    PRINT 'Added IsDeleted to Certificates table';
END

IF NOT EXISTS (SELECT * FROM sys.columns WHERE Name = 'IsDeleted' AND Object_ID = Object_ID('Equipment'))
BEGIN
    ALTER TABLE Equipment ADD IsDeleted BIT NOT NULL DEFAULT 0;
    PRINT 'Added IsDeleted to Equipment table';
END

IF NOT EXISTS (SELECT * FROM sys.columns WHERE Name = 'IsDeleted' AND Object_ID = Object_ID('Locations'))
BEGIN
    ALTER TABLE Locations ADD IsDeleted BIT NOT NULL DEFAULT 0;
    PRINT 'Added IsDeleted to Locations table';
END

IF NOT EXISTS (SELECT * FROM sys.columns WHERE Name = 'IsDeleted' AND Object_ID = Object_ID('Roles'))
BEGIN
    ALTER TABLE Roles ADD IsDeleted BIT NOT NULL DEFAULT 0;
    PRINT 'Added IsDeleted to Roles table';
END

IF NOT EXISTS (SELECT * FROM sys.columns WHERE Name = 'IsDeleted' AND Object_ID = Object_ID('UserRoleMappings'))
BEGIN
    ALTER TABLE UserRoleMappings ADD IsDeleted BIT NOT NULL DEFAULT 0;
    PRINT 'Added IsDeleted to UserRoleMappings table';
END

IF NOT EXISTS (SELECT * FROM sys.columns WHERE Name = 'IsDeleted' AND Object_ID = Object_ID('Applications'))
BEGIN
    ALTER TABLE Applications ADD IsDeleted BIT NOT NULL DEFAULT 0;
    PRINT 'Added IsDeleted to Applications table';
END

IF NOT EXISTS (SELECT * FROM sys.columns WHERE Name = 'IsDeleted' AND Object_ID = Object_ID('RoleAndApplicationWisePermissions'))
BEGIN
    ALTER TABLE RoleAndApplicationWisePermissions ADD IsDeleted BIT NOT NULL DEFAULT 0;
    PRINT 'Added IsDeleted to RoleAndApplicationWisePermissions table';
END

IF NOT EXISTS (SELECT * FROM sys.columns WHERE Name = 'IsDeleted' AND Object_ID = Object_ID('AuditLogs'))
BEGIN
    ALTER TABLE AuditLogs ADD IsDeleted BIT NOT NULL DEFAULT 0;
    PRINT 'Added IsDeleted to AuditLogs table';
END

IF NOT EXISTS (SELECT * FROM sys.columns WHERE Name = 'IsDeleted' AND Object_ID = Object_ID('LetterHeads'))
BEGIN
    ALTER TABLE LetterHeads ADD IsDeleted BIT NOT NULL DEFAULT 0;
    PRINT 'Added IsDeleted to LetterHeads table';
END

IF NOT EXISTS (SELECT * FROM sys.columns WHERE Name = 'IsDeleted' AND Object_ID = Object_ID('EmailDomains'))
BEGIN
    ALTER TABLE EmailDomains ADD IsDeleted BIT NOT NULL DEFAULT 0;
    PRINT 'Added IsDeleted to EmailDomains table';
END

IF NOT EXISTS (SELECT * FROM sys.columns WHERE Name = 'IsDeleted' AND Object_ID = Object_ID('EmailAccounts'))
BEGIN
    ALTER TABLE EmailAccounts ADD IsDeleted BIT NOT NULL DEFAULT 0;
    PRINT 'Added IsDeleted to EmailAccounts table';
END

IF NOT EXISTS (SELECT * FROM sys.columns WHERE Name = 'IsDeleted' AND Object_ID = Object_ID('EquipmentHistories'))
BEGIN
    ALTER TABLE EquipmentHistories ADD IsDeleted BIT NOT NULL DEFAULT 0;
    PRINT 'Added IsDeleted to EquipmentHistories table';
END

IF NOT EXISTS (SELECT * FROM sys.columns WHERE Name = 'IsDeleted' AND Object_ID = Object_ID('MaintenanceSchedules'))
BEGIN
    ALTER TABLE MaintenanceSchedules ADD IsDeleted BIT NOT NULL DEFAULT 0;
    PRINT 'Added IsDeleted to MaintenanceSchedules table';
END

PRINT 'All missing audit fields have been added successfully!';