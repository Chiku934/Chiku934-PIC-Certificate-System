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
    const equipment = this.equipmentRepository.create(createEquipmentDto);
    return await this.equipmentRepository.save(equipment);
  }

  async findAll(): Promise<Equipment[]> {
    return await this.equipmentRepository.find({
      relations: ['company'],
      order: { CreatedDate: 'DESC' },
    });
  }

  async findOne(id: number): Promise<Equipment> {
    const equipment = await this.equipmentRepository.findOne({
      where: { Id: id },
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
    Object.assign(equipment, updateEquipmentDto);
    return await this.equipmentRepository.save(equipment);
  }

  async remove(id: number): Promise<void> {
    const equipment = await this.findOne(id);
    await this.equipmentRepository.remove(equipment);
  }

  async findByCompany(companyId: number): Promise<Equipment[]> {
    return await this.equipmentRepository.find({
      where: { CompanyId: companyId },
      relations: ['company'],
      order: { CreatedDate: 'DESC' },
    });
  }

  async findByStatus(status: string): Promise<Equipment[]> {
    return await this.equipmentRepository.find({
      where: { Status: status },
      relations: ['company'],
      order: { CreatedDate: 'DESC' },
    });
  }
}
