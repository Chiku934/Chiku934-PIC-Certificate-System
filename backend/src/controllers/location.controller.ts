import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  ParseIntPipe,
  UseGuards,
} from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { LocationService } from '../services/location.service';
import { CreateLocationDto } from '../dto/create-location.dto';
import { UpdateLocationDto } from '../dto/update-location.dto';

@Controller('locations')
export class LocationController {
  constructor(private readonly locationService: LocationService) {}

  @Post()
  create(@Body() createLocationDto: CreateLocationDto) {
    return this.locationService.create(createLocationDto);
  }

  @Get()
  findAll(@Query('companyId') companyId?: string) {
    if (companyId) {
      return this.locationService.findByCompany(parseInt(companyId));
    }
    return this.locationService.findAll();
  }

  @Get('hierarchy')
  getLocationHierarchy() {
    return this.locationService.getLocationHierarchy();
  }

  @Get('root')
  findRootLocations() {
    return this.locationService.findRootLocations();
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.locationService.findOne(id);
  }

  @Get(':id/children')
  findChildLocations(@Param('id', ParseIntPipe) id: number) {
    return this.locationService.findChildLocations(id);
  }

  @Get(':id/descendants')
  getLocationDescendants(@Param('id', ParseIntPipe) id: number) {
    return this.locationService.getLocationDescendants(id);
  }

  @Get(':id/ancestors')
  getLocationAncestors(@Param('id', ParseIntPipe) id: number) {
    return this.locationService.getLocationAncestors(id);
  }

  @Patch(':id')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateLocationDto: UpdateLocationDto,
  ) {
    return this.locationService.update(id, updateLocationDto);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  remove(
    @Param('id', ParseIntPipe) id: number,
  ) {
    return this.locationService.remove(id);
  }
}
