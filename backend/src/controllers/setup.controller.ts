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
} from '@nestjs/common';
import { SetupService } from '../services/setup.service';
import { CreateCompanyDetailsDto } from '../dto/create-company-details.dto';
import { UpdateCompanyDetailsDto } from '../dto/update-company-details.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('setup')
@UseGuards(JwtAuthGuard)
export class SetupController {
  constructor(private readonly setupService: SetupService) {}

  // Dashboard
  @Get('dashboard')
  async getDashboard(@Request() req) {
    console.log('getDashboard called, user:', req.user);
    const stats = await this.setupService.getDashboardStats();
    console.log('getDashboard returning stats:', stats);
    return {
      stats,
      user: req.user,
    };
  }

  // Company Details
  @Post('company-details')
  createCompanyDetails(@Body() createDto: CreateCompanyDetailsDto, @Request() req) {
    return this.setupService.createCompanyDetails({
      ...createDto,
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
  updateCompanyDetails(
    @Param('id') id: string,
    @Body() updateDto: UpdateCompanyDetailsDto,
    @Request() req
  ) {
    return this.setupService.updateCompanyDetails(+id, {
      ...updateDto,
      UpdatedBy: req.user.Id,
    });
  }

  @Delete('company-details/:id')
  removeCompanyDetails(@Param('id') id: string, @Request() req) {
    return this.setupService.removeCompanyDetails(+id, req.user.Id);
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
