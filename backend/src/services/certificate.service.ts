import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import {
  Certificate,
  CertificateType,
  CertificateStatus,
} from '../entities/certificate.entity';
import { CreateCertificateDto } from '../dto/create-certificate.dto';
import { UpdateCertificateDto } from '../dto/update-certificate.dto';

@Injectable()
export class CertificateService {
  constructor(
    @InjectRepository(Certificate)
    private readonly certificateRepository: Repository<Certificate>,
  ) {}

  async create(createCertificateDto: CreateCertificateDto): Promise<Certificate> {
    // Validate certificate number uniqueness
    const existingCertificate = await this.certificateRepository.findOne({
      where: { CertificateNumber: createCertificateDto.CertificateNumber },
    });

    if (existingCertificate) {
      throw new BadRequestException(`Certificate number ${createCertificateDto.CertificateNumber} already exists`);
    }

    // Validate expiry date is after issue date
    const issueDate = new Date(createCertificateDto.IssueDate);
    const expiryDate = new Date(createCertificateDto.ExpiryDate);

    if (expiryDate <= issueDate) {
      throw new BadRequestException('Expiry date must be after issue date');
    }

    const certificate = this.certificateRepository.create({
      ...createCertificateDto,
      CreatedBy: createCertificateDto.CreatedById,
      UpdatedBy: createCertificateDto.CreatedById,
      IsDeleted: false,
    });
    return await this.certificateRepository.save(certificate);
  }

  async findAll(): Promise<Certificate[]> {
    return await this.certificateRepository.find({
      where: { IsDeleted: false },
      relations: ['equipment', 'location', 'createdBy', 'approvedBy'],
      order: { CreatedDate: 'DESC' },
    });
  }

  async findOne(id: number): Promise<Certificate> {
    const certificate = await this.certificateRepository.findOne({
      where: { Id: id, IsDeleted: false },
      relations: ['equipment', 'location', 'createdBy', 'approvedBy'],
    });

    if (!certificate) {
      throw new NotFoundException(`Certificate with ID ${id} not found`);
    }

    return certificate;
  }

  async update(id: number, updateCertificateDto: UpdateCertificateDto): Promise<Certificate> {
    const certificate = await this.findOne(id);

    // Validate certificate number uniqueness if being changed
    if (updateCertificateDto.CertificateNumber && updateCertificateDto.CertificateNumber !== certificate.CertificateNumber) {
      const existingCertificate = await this.certificateRepository.findOne({
        where: { CertificateNumber: updateCertificateDto.CertificateNumber },
      });

      if (existingCertificate) {
        throw new BadRequestException(`Certificate number ${updateCertificateDto.CertificateNumber} already exists`);
      }
    }

    // Validate dates if being updated
    if (updateCertificateDto.IssueDate || updateCertificateDto.ExpiryDate) {
      const issueDate = new Date(updateCertificateDto.IssueDate || certificate.IssueDate);
      const expiryDate = new Date(updateCertificateDto.ExpiryDate || certificate.ExpiryDate);

      if (expiryDate <= issueDate) {
        throw new BadRequestException('Expiry date must be after issue date');
      }
    }

    Object.assign(certificate, {
      ...updateCertificateDto,
      UpdatedDate: new Date(),
      UpdatedBy: updateCertificateDto.UpdatedBy,
    });
    return await this.certificateRepository.save(certificate);
  }

  async remove(id: number, deletedBy?: number): Promise<void> {
    const certificate = await this.findOne(id);
    certificate.IsDeleted = true;
    certificate.DeletedDate = new Date();
    certificate.DeletedBy = deletedBy;
    await this.certificateRepository.save(certificate);
  }

  async findByEquipment(equipmentId: number): Promise<Certificate[]> {
    return await this.certificateRepository.find({
      where: { EquipmentId: equipmentId, IsDeleted: false },
      relations: ['equipment', 'location', 'createdBy', 'approvedBy'],
      order: { CreatedDate: 'DESC' },
    });
  }

  async findByLocation(locationId: number): Promise<Certificate[]> {
    return await this.certificateRepository.find({
      where: { LocationId: locationId, IsDeleted: false },
      relations: ['equipment', 'location', 'createdBy', 'approvedBy'],
      order: { CreatedDate: 'DESC' },
    });
  }

  async findByType(certificateType: CertificateType): Promise<Certificate[]> {
    return await this.certificateRepository.find({
      where: { CertificateType: certificateType, IsDeleted: false },
      relations: ['equipment', 'location', 'createdBy', 'approvedBy'],
      order: { CreatedDate: 'DESC' },
    });
  }

  async findByStatus(status: CertificateStatus): Promise<Certificate[]> {
    return await this.certificateRepository.find({
      where: { Status: status, IsDeleted: false },
      relations: ['equipment', 'location', 'createdBy', 'approvedBy'],
      order: { CreatedDate: 'DESC' },
    });
  }

  async findExpiringSoon(days: number = 30): Promise<Certificate[]> {
    const futureDate = new Date();
    futureDate.setDate(futureDate.getDate() + days);

    return await this.certificateRepository
      .createQueryBuilder('certificate')
      .leftJoinAndSelect('certificate.equipment', 'equipment')
      .leftJoinAndSelect('certificate.location', 'location')
      .leftJoinAndSelect('certificate.createdBy', 'createdBy')
      .leftJoinAndSelect('certificate.approvedBy', 'approvedBy')
      .where('certificate.ExpiryDate <= :futureDate', { futureDate })
      .andWhere('certificate.ExpiryDate > :today', { today: new Date() })
      .andWhere('certificate.Status IN (:...statuses)', {
        statuses: [CertificateStatus.APPROVED, CertificateStatus.UNDER_REVIEW],
      })
      .andWhere('certificate.IsDeleted = :isDeleted', { isDeleted: false })
      .orderBy('certificate.ExpiryDate', 'ASC')
      .getMany();
  }

  async findExpired(): Promise<Certificate[]> {
    return await this.certificateRepository
      .createQueryBuilder('certificate')
      .leftJoinAndSelect('certificate.equipment', 'equipment')
      .leftJoinAndSelect('certificate.location', 'location')
      .leftJoinAndSelect('certificate.createdBy', 'createdBy')
      .leftJoinAndSelect('certificate.approvedBy', 'approvedBy')
      .where('certificate.ExpiryDate < :today', { today: new Date() })
      .andWhere('certificate.Status = :status', { status: CertificateStatus.APPROVED })
      .andWhere('certificate.IsDeleted = :isDeleted', { isDeleted: false })
      .orderBy('certificate.ExpiryDate', 'DESC')
      .getMany();
  }

  async approveCertificate(id: number, approvedById: number): Promise<Certificate> {
    const certificate = await this.findOne(id);

    if (certificate.Status !== CertificateStatus.PENDING_APPROVAL) {
      throw new BadRequestException('Certificate must be in pending approval status to be approved');
    }

    certificate.Status = CertificateStatus.APPROVED;
    certificate.ApprovedById = approvedById;
    certificate.UpdatedDate = new Date();

    return await this.certificateRepository.save(certificate);
  }

  async rejectCertificate(id: number, rejectionReason: string, approvedById: number): Promise<Certificate> {
    const certificate = await this.findOne(id);

    if (certificate.Status !== CertificateStatus.PENDING_APPROVAL) {
      throw new BadRequestException('Certificate must be in pending approval status to be rejected');
    }

    certificate.Status = CertificateStatus.REJECTED;
    certificate.RejectionReason = rejectionReason;
    certificate.ApprovedById = approvedById;
    certificate.UpdatedDate = new Date();

    return await this.certificateRepository.save(certificate);
  }

  async submitForApproval(id: number): Promise<Certificate> {
    const certificate = await this.findOne(id);

    if (certificate.Status !== CertificateStatus.DRAFT) {
      throw new BadRequestException('Only draft certificates can be submitted for approval');
    }

    certificate.Status = CertificateStatus.PENDING_APPROVAL;
    certificate.UpdatedDate = new Date();

    return await this.certificateRepository.save(certificate);
  }

  async getCertificateStats(): Promise<{
    total: number;
    approved: number;
    pending: number;
    rejected: number;
    expired: number;
    expiringSoon: number;
  }> {
    const [total, approved, pending, rejected, expired, expiringSoon] = await Promise.all([
      this.certificateRepository.count({ where: { IsDeleted: false } }),
      this.certificateRepository.count({ where: { Status: CertificateStatus.APPROVED, IsDeleted: false } }),
      this.certificateRepository.count({ where: { Status: CertificateStatus.PENDING_APPROVAL, IsDeleted: false } }),
      this.certificateRepository.count({ where: { Status: CertificateStatus.REJECTED, IsDeleted: false } }),
      this.certificateRepository
        .createQueryBuilder('certificate')
        .where('certificate.ExpiryDate < :today', { today: new Date() })
        .andWhere('certificate.Status = :status', { status: CertificateStatus.APPROVED })
        .andWhere('certificate.IsDeleted = :isDeleted', { isDeleted: false })
        .getCount(),
      this.certificateRepository
        .createQueryBuilder('certificate')
        .where('certificate.ExpiryDate <= :futureDate', { futureDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000) })
        .andWhere('certificate.ExpiryDate > :today', { today: new Date() })
        .andWhere('certificate.Status IN (:...statuses)', {
          statuses: [CertificateStatus.APPROVED, CertificateStatus.UNDER_REVIEW],
        })
        .andWhere('certificate.IsDeleted = :isDeleted', { isDeleted: false })
        .getCount(),
    ]);

    return { total, approved, pending, rejected, expired, expiringSoon };
  }
}
