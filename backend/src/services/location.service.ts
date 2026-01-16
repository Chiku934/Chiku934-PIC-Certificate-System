import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, TreeRepository } from 'typeorm';
import { Location } from '../entities/location.entity';
import { CreateLocationDto } from '../dto/create-location.dto';
import { UpdateLocationDto } from '../dto/update-location.dto';

@Injectable()
export class LocationService {
  constructor(
    @InjectRepository(Location)
    private readonly locationRepository: Repository<Location>,
    @InjectRepository(Location)
    private readonly locationTreeRepository: TreeRepository<Location>,
  ) {}

  async create(createLocationDto: CreateLocationDto): Promise<Location> {
    const location = this.locationRepository.create(createLocationDto);
    return await this.locationRepository.save(location);
  }

  async findAll(): Promise<Location[]> {
    return await this.locationRepository.find({
      relations: ['company', 'parentLocation', 'childLocations'],
      order: { CreatedDate: 'DESC' },
    });
  }

  async findOne(id: number): Promise<Location> {
    const location = await this.locationRepository.findOne({
      where: { Id: id },
      relations: ['company', 'parentLocation', 'childLocations'],
    });

    if (!location) {
      throw new NotFoundException(`Location with ID ${id} not found`);
    }

    return location;
  }

  async update(
    id: number,
    updateLocationDto: UpdateLocationDto,
  ): Promise<Location> {
    const location = await this.findOne(id);
    Object.assign(location, updateLocationDto);
    return await this.locationRepository.save(location);
  }

  async remove(id: number): Promise<void> {
    const location = await this.findOne(id);
    await this.locationRepository.remove(location);
  }

  async findByCompany(companyId: number): Promise<Location[]> {
    return await this.locationRepository.find({
      where: { CompanyId: companyId },
      relations: ['company', 'parentLocation', 'childLocations'],
      order: { CreatedDate: 'DESC' },
    });
  }

  async findByType(locationType: string): Promise<Location[]> {
    return await this.locationRepository.find({
      where: { LocationType: locationType },
      relations: ['company', 'parentLocation', 'childLocations'],
      order: { CreatedDate: 'DESC' },
    });
  }

  async findActive(): Promise<Location[]> {
    return await this.locationRepository.find({
      where: { IsActive: true },
      relations: ['company', 'parentLocation', 'childLocations'],
      order: { CreatedDate: 'DESC' },
    });
  }

  async findRootLocations(): Promise<Location[]> {
    return await this.locationRepository.find({
      where: { ParentLocationId: null },
      relations: ['company', 'childLocations'],
      order: { CreatedDate: 'DESC' },
    });
  }

  async findChildLocations(parentId: number): Promise<Location[]> {
    return await this.locationRepository.find({
      where: { ParentLocationId: parentId },
      relations: ['company', 'parentLocation', 'childLocations'],
      order: { CreatedDate: 'DESC' },
    });
  }

  async getLocationHierarchy(): Promise<Location[]> {
    return await this.locationTreeRepository.findTrees();
  }

  async getLocationDescendants(locationId: number): Promise<Location[]> {
    const location = await this.findOne(locationId);
    return await this.locationTreeRepository.findDescendants(location);
  }

  async getLocationAncestors(locationId: number): Promise<Location[]> {
    const location = await this.findOne(locationId);
    return await this.locationTreeRepository.findAncestors(location);
  }

  async searchLocations(searchTerm: string): Promise<Location[]> {
    return await this.locationRepository
      .createQueryBuilder('location')
      .leftJoinAndSelect('location.company', 'company')
      .leftJoinAndSelect('location.parentLocation', 'parentLocation')
      .where(
        'location.LocationName LIKE :searchTerm OR location.LocationCode LIKE :searchTerm OR location.Address LIKE :searchTerm OR location.City LIKE :searchTerm',
        {
          searchTerm: `%${searchTerm}%`,
        },
      )
      .orderBy('location.CreatedDate', 'DESC')
      .getMany();
  }

  async getLocationsByBounds(
    northEastLat: number,
    northEastLng: number,
    southWestLat: number,
    southWestLng: number,
  ): Promise<Location[]> {
    return await this.locationRepository
      .createQueryBuilder('location')
      .leftJoinAndSelect('location.company', 'company')
      .where('location.Latitude BETWEEN :southWestLat AND :northEastLat', {
        southWestLat,
        northEastLat,
      })
      .andWhere('location.Longitude BETWEEN :southWestLng AND :northEastLng', {
        southWestLng,
        northEastLng,
      })
      .orderBy('location.CreatedDate', 'DESC')
      .getMany();
  }
}
