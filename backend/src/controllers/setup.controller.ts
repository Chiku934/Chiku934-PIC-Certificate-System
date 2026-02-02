import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Request,
  UploadedFile,
  UseInterceptors,
  ValidationPipe,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { SetupService } from '../services/setup.service';
import { FileUploadService } from '../services/file-upload.service';
import { CreateCompanyDetailsDto } from '../dto/create-company-details.dto';
import { UpdateCompanyDetailsDto } from '../dto/update-company-details.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { Express } from 'express';

@Controller('setup')
@UseGuards(JwtAuthGuard)
export class SetupController {
  constructor(
    private readonly setupService: SetupService,
    private readonly fileUploadService: FileUploadService,
  ) {}

  // Dashboard
  @Get('dashboard')
  async getDashboard(@Request() req: any) {
    console.log('getDashboard called, user:', req.user);
    const stats = await this.setupService.getDashboardStats();
    console.log('getDashboard returning stats:', stats);
    return {
      stats,
      user: req.user,
    };
  }

  // Company Details (Create or Update - for single company constraint)
  @Post('company')
  @UseInterceptors(FileInterceptor('companyLogo'))
  async createOrUpdateCompany(
    @Body() createDto: any,
    @UploadedFile() file: Express.Multer.File,
    @Request() req: any,
  ) {
    try {
      console.log('Received createDto:', createDto);
      console.log('Received file:', file ? { filename: file.filename, size: file.size } : null);
      console.log('User:', req.user);

      let logoPath = createDto.CompanyLogo;

      // Handle file upload if provided
      if (file) {
        logoPath = await this.fileUploadService.uploadFile(file);
        console.log('Logo uploaded to path:', logoPath);
      }

      const result = await this.setupService.createOrUpdateCompanyDetails({
        ...createDto,
        CompanyLogo: logoPath,
        CreatedBy: req.user.Id,
      });

      console.log('Company saved successfully:', result);

      return {
        success: true,
        message: result.Id
          ? 'Company updated successfully'
          : 'Company created successfully',
        data: result,
      };
    } catch (error: any) {
      console.error('Error saving company:', error);
      return {
        success: false,
        message: error.message || 'An error occurred',
      };
    }
  }

  @Get('company')
  async getCompany() {
    try {
      const company = await this.setupService.findCompanyDetails();
      return {
        success: true,
        data: company,
      };
    } catch (error: any) {
      return {
        success: false,
        message: error.message || 'An error occurred',
      };
    }
  }

  // Company Details
  @Post('company-details')
  @UseInterceptors(FileInterceptor('companyLogo'))
  async createCompanyDetails(
    @Body() createDto: CreateCompanyDetailsDto,
    @UploadedFile() file: Express.Multer.File,
    @Request() req: any,
  ) {
    let logoPath = createDto.CompanyLogo;

    // Handle file upload if provided
    if (file) {
      logoPath = await this.fileUploadService.uploadFile(file);
    }

    return this.setupService.createCompanyDetails({
      ...createDto,
      CompanyLogo: logoPath,
      CreatedBy: req.user.Id,
    });
  }

  @Get('company-details')
  findAllCompanyDetails() {
    return this.setupService.findAllCompanyDetails();
  }

  @Get('company-details/current')
  findCompanyDetails() {
    return this.setupService.findCompanyDetails();
  }

  @Get('company-details/:id')
  findOneCompanyDetails(@Param('id') id: string) {
    return this.setupService.findOneCompanyDetails(+id);
  }

  @Patch('company-details/:id')
  @UseInterceptors(FileInterceptor('companyLogo'))
  async updateCompanyDetails(
    @Param('id') id: string,
    @Body() updateDto: UpdateCompanyDetailsDto,
    @UploadedFile() file: Express.Multer.File,
    @Request() req: any,
  ) {
    try {
      let logoPath = updateDto.CompanyLogo;

      // Handle file upload if provided
      if (file) {
        logoPath = await this.fileUploadService.uploadFile(file);
      }

      const result = await this.setupService.updateCompanyDetails(+id, {
        ...updateDto,
        CompanyLogo: logoPath,
        UpdatedBy: req.user.Id,
      });

      return {
        success: true,
        message: 'Company updated successfully',
        data: result,
      };
    } catch (error: any) {
      return {
        success: false,
        message: error.message || 'An error occurred',
      };
    }
  }

  @Delete('company-details/:id')
  async removeCompanyDetails(@Param('id') id: string) {
    try {
      const company = await this.setupService.findOneCompanyDetails(+id);

      // Delete logo file if exists
      if (company.CompanyLogo) {
        await this.fileUploadService.deleteFile(company.CompanyLogo);
      }

      await this.setupService.removeCompanyDetails(+id);

      return {
        success: true,
        message: 'Company deleted successfully',
      };
    } catch (error: any) {
      return {
        success: false,
        message: error.message || 'An error occurred',
      };
    }
  }

  // Letter Head
  @Post('letter-head')
  createLetterHead(@Body() createDto: any, @Request() req) {
    return this.setupService.createLetterHead({
      ...createDto,
      CreatedBy: req.user.Id,
    });
  }

  @Get('letter-head')
  findLetterHead() {
    return this.setupService.findLetterHead();
  }

  @Patch('letter-head/:id')
  updateLetterHead(@Param('id') id: string, @Body() updateDto: any, @Request() req) {
    return this.setupService.updateLetterHead(+id, {
      ...updateDto,
      UpdatedBy: req.user.Id,
    });
  }
}
