import {
  Injectable,
  NotFoundException,
  ConflictException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CompanyDetails } from '../entities/company-details.entity';
import { LetterHead } from '../entities/letter-head.entity';
import { EmailDomain } from '../entities/email-domain.entity';
import { EmailAccount } from '../entities/email-account.entity';
import { User } from '../entities/user.entity';
import { CreateCompanyDetailsDto } from '../dto/create-company-details.dto';
import { UpdateCompanyDetailsDto } from '../dto/update-company-details.dto';

@Injectable()
export class SetupService {
  constructor(
    @InjectRepository(CompanyDetails)
    private readonly companyDetailsRepository: Repository<CompanyDetails>,
    @InjectRepository(LetterHead)
    private readonly letterHeadRepository: Repository<LetterHead>,
    @InjectRepository(EmailDomain)
    private readonly emailDomainRepository: Repository<EmailDomain>,
    @InjectRepository(EmailAccount)
    private readonly emailAccountRepository: Repository<EmailAccount>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  // Company Details
  async createCompanyDetails(
    createDto: CreateCompanyDetailsDto,
  ): Promise<CompanyDetails> {
    // Check if a company already exists (enforce single company constraint)
    const existingCompany = await this.findCompanyDetails();
    if (existingCompany) {
      throw new ConflictException(
        'A company configuration already exists. Please update the existing company instead.',
      );
    }

    const companyDetails = this.companyDetailsRepository.create({
      ...createDto,
      DateOfEstablishment: createDto.DateOfEstablishment
        ? new Date(createDto.DateOfEstablishment)
        : undefined,
      DateOfIncorporation: createDto.DateOfIncorporation
        ? new Date(createDto.DateOfIncorporation)
        : undefined,
      CreatedBy: createDto.CreatedBy,
      UpdatedBy: createDto.CreatedBy,
      IsDeleted: false,
    });
    return this.companyDetailsRepository.save(companyDetails);
  }

  async updateCompanyDetails(
    id: number,
    updateDto: UpdateCompanyDetailsDto,
  ): Promise<CompanyDetails> {
    const companyDetails = await this.findOneCompanyDetails(id);

    Object.assign(companyDetails, {
      ...updateDto,
      DateOfEstablishment: updateDto.DateOfEstablishment
        ? new Date(updateDto.DateOfEstablishment)
        : companyDetails.DateOfEstablishment,
      DateOfIncorporation: updateDto.DateOfIncorporation
        ? new Date(updateDto.DateOfIncorporation)
        : companyDetails.DateOfIncorporation,
      UpdatedDate: new Date(),
      UpdatedBy: updateDto.UpdatedBy,
    });

    return this.companyDetailsRepository.save(companyDetails);
  }

  // Company Details (Create or Update - for single company constraint)
  async createOrUpdateCompanyDetails(
    createDto: CreateCompanyDetailsDto,
  ): Promise<CompanyDetails> {
    // Check if a company already exists
    const existingCompany = await this.findCompanyDetails();

    if (existingCompany) {
      // Update existing company
      return this.updateCompanyDetails(existingCompany.Id, {
        ...createDto,
        UpdatedBy: createDto.CreatedBy,
      } as UpdateCompanyDetailsDto);
    } else {
      // Create new company
      const companyDetails = this.companyDetailsRepository.create({
        ...createDto,
        DateOfEstablishment: createDto.DateOfEstablishment
          ? new Date(createDto.DateOfEstablishment)
          : undefined,
        DateOfIncorporation: createDto.DateOfIncorporation
          ? new Date(createDto.DateOfIncorporation)
          : undefined,
      });
      return this.companyDetailsRepository.save(companyDetails);
    }
  }

  async findAllCompanyDetails(): Promise<CompanyDetails[]> {
    return this.companyDetailsRepository.find({
      where: { DeletedDate: null },
      order: { CreatedDate: 'DESC' },
    });
  }

  async findCompanyDetails(): Promise<CompanyDetails | null> {
    return this.companyDetailsRepository.findOne({
      where: { DeletedDate: null },
      order: { CreatedDate: 'DESC' },
    });
  }

  async findOneCompanyDetails(id: number): Promise<CompanyDetails> {
    const companyDetails = await this.companyDetailsRepository.findOne({
      where: { Id: id, DeletedDate: null },
    });
    if (!companyDetails) {
      throw new NotFoundException('Company details not found');
    }
    return companyDetails;
  }

  async removeCompanyDetails(id: number, deletedBy?: number): Promise<void> {
    const companyDetails = await this.findOneCompanyDetails(id);
    companyDetails.DeletedDate = new Date();
    companyDetails.DeletedBy = deletedBy;
    companyDetails.IsDeleted = true;
    await this.companyDetailsRepository.save(companyDetails);
  }

  // Letter Head
  async createLetterHead(createDto: Partial<LetterHead>): Promise<LetterHead> {
    const letterHead = this.letterHeadRepository.create(createDto);
    return this.letterHeadRepository.save(letterHead);
  }

  async findLetterHead(): Promise<LetterHead | null> {
    return this.letterHeadRepository.findOne({
      where: { DeletedDate: null },
      order: { CreatedDate: 'DESC' },
    });
  }

  async updateLetterHead(id: number, updateDto: any): Promise<LetterHead> {
    const letterHead = await this.letterHeadRepository.findOne({
      where: { Id: id, DeletedDate: null },
    });
    if (!letterHead) {
      throw new NotFoundException('Letter head not found');
    }

    Object.assign(letterHead, updateDto);
    return this.letterHeadRepository.save(letterHead);
  }

  // Dashboard Statistics
  async getDashboardStats() {
    console.log('getDashboardStats called');
    try {
      const [
        allUsers,
        activeUsers,
        inactiveUsers,
        emailDomains,
        emailAccounts,
      ] = await Promise.all([
        this.userRepository.count({ where: { DeletedDate: null } }),
        this.userRepository.count({
          where: { IsActive: true, DeletedDate: null },
        }),
        this.userRepository.count({
          where: { IsActive: false, DeletedDate: null },
        }),
        this.emailDomainRepository.count({ where: { DeletedDate: null } }),
        this.emailAccountRepository.count({ where: { DeletedDate: null } }),
      ]);

      console.log('Counts retrieved:', {
        allUsers,
        activeUsers,
        inactiveUsers,
        emailDomains,
        emailAccounts,
      });

      const companyDetails = await this.findCompanyDetails();
      const letterHead = await this.findLetterHead();

      console.log('Company and letter head retrieved:', {
        companyDetails: !!companyDetails,
        letterHead: !!letterHead,
      });

      const result = {
        totalUsers: allUsers,
        activeUsers,
        inactiveUsers,
        systemUsers: 0, // TODO: Implement user types
        companyConfigured: !!companyDetails,
        letterHeadConfigured: !!letterHead,
        emailDomains,
        emailAccounts,
      };

      console.log('Dashboard stats result:', result);
      return result;
    } catch (error) {
      console.error('Error in getDashboardStats:', error);
      throw error;
    }
  }
}
