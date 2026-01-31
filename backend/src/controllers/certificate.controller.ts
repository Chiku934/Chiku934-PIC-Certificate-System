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
  Req,
} from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { CertificateService } from '../services/certificate.service';
import { CreateCertificateDto } from '../dto/create-certificate.dto';
import { UpdateCertificateDto } from '../dto/update-certificate.dto';
import { CertificateType, CertificateStatus } from '../entities/certificate.entity';

@Controller('certificates')
export class CertificateController {
  constructor(private readonly certificateService: CertificateService) {}

  @Post()
  create(@Body() createCertificateDto: CreateCertificateDto) {
    return this.certificateService.create(createCertificateDto);
  }

  @Get()
  findAll(
    @Query('equipmentId') equipmentId?: string,
    @Query('locationId') locationId?: string,
    @Query('type') type?: string,
    @Query('status') status?: string,
  ) {
    if (equipmentId) {
      return this.certificateService.findByEquipment(parseInt(equipmentId));
    }
    if (locationId) {
      return this.certificateService.findByLocation(parseInt(locationId));
    }
    if (type) {
      return this.certificateService.findByType(type as CertificateType);
    }
    if (status) {
      return this.certificateService.findByStatus(status as CertificateStatus);
    }
    return this.certificateService.findAll();
  }

  @Get('expiring-soon')
  findExpiringSoon(@Query('days') days?: string) {
    return this.certificateService.findExpiringSoon(days ? parseInt(days) : 30);
  }

  @Get('expired')
  findExpired() {
    return this.certificateService.findExpired();
  }

  @Get('stats')
  getCertificateStats() {
    return this.certificateService.getCertificateStats();
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.certificateService.findOne(id);
  }

  @Patch(':id')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateCertificateDto: UpdateCertificateDto,
  ) {
    return this.certificateService.update(id, updateCertificateDto);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  remove(
    @Param('id', ParseIntPipe) id: number,
    @Req() req: any,
  ) {
    const userId = req.user?.sub;
    return this.certificateService.remove(id, userId);
  }

  @Post(':id/submit-approval')
  submitForApproval(@Param('id', ParseIntPipe) id: number) {
    return this.certificateService.submitForApproval(id);
  }

  @Post(':id/approve')
  approveCertificate(
    @Param('id', ParseIntPipe) id: number,
    @Body('approvedById', ParseIntPipe) approvedById: number,
  ) {
    return this.certificateService.approveCertificate(id, approvedById);
  }

  @Post(':id/reject')
  rejectCertificate(
    @Param('id', ParseIntPipe) id: number,
    @Body('rejectionReason') rejectionReason: string,
    @Body('approvedById', ParseIntPipe) approvedById: number,
  ) {
    return this.certificateService.rejectCertificate(id, rejectionReason, approvedById);
  }
}
