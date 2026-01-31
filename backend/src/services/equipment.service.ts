import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Equipment } from '../entities/equipment.entity';
import { CreateEquipmentDto } from '../dto/create-equipment.dto';
import { UpdateEquipmentDto } from '../dto/update-equipment.dto';

@Injectable()
export class EquipmentService {
  constructor(
    @InjectRepository(Equipment)
    private readonly equipmentRepository: Repository<Equipment>,
  ) {}

  async create(createEquipmentDto: CreateEquipmentDto): Promise<Equipment> {
    const equipment = this.equipmentRepository.create({
      ...createEquipmentDto,
      CreatedBy: createEquipmentDto.CreatedBy,
      UpdatedBy: createEquipmentDto.CreatedBy,
      IsDeleted: false,
    });
    return await this.equipmentRepository.save(equipment);
  }

  async findAll(): Promise<Equipment[]> {
    return await this.equipmentRepository.find({
      where: { IsDeleted: false },
      relations: ['company'],
      order: { CreatedDate: 'DESC' },
    });
  }

  async findOne(id: number): Promise<Equipment> {
    const equipment = await this.equipmentRepository.findOne({
      where: { Id: id, IsDeleted: false },
      relations: ['company'],
    });

    if (!equipment) {
      throw new NotFoundException(`Equipment with ID ${id} not found`);
    }

    return equipment;
  }

  async update(
    id: number,
    updateEquipmentDto: UpdateEquipmentDto,
  ): Promise<Equipment> {
    const equipment = await this.findOne(id);
    Object.assign(equipment, {
      ...updateEquipmentDto,
      UpdatedDate: new Date(),
      UpdatedBy: updateEquipmentDto.UpdatedBy,
    });
    return await this.equipmentRepository.save(equipment);
  }

  async remove(id: number, deletedBy?: number): Promise<void> {
    const equipment = await this.findOne(id);
    equipment.IsDeleted = true;
    equipment.DeletedDate = new Date();
    equipment.DeletedBy = deletedBy;
    await this.equipmentRepository.save(equipment);
  }

  async findByCompany(companyId: number): Promise<Equipment[]> {
    return await this.equipmentRepository.find({
      where: { CompanyId: companyId, IsDeleted: false },
      relations: ['company'],
      order: { CreatedDate: 'DESC' },
    });
  }

  async findByStatus(status: string): Promise<Equipment[]> {
    return await this.equipmentRepository.find({
      where: { Status: status, IsDeleted: false },
      relations: ['company'],
      order: { CreatedDate: 'DESC' },
    });
  }
}
