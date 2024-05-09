import {
  Body,
  Controller,
  FileTypeValidator,
  MaxFileSizeValidator,
  ParseFilePipe,
  Post,
  Req,
  UploadedFile,
  UploadedFiles,
  UseInterceptors,
} from '@nestjs/common';
import { ApiBearerAuth, ApiBody, ApiConsumes, ApiTags } from '@nestjs/swagger';
import { FileInterceptor, FilesInterceptor } from '@nestjs/platform-express';
import { UploadImageDto } from './dto/upload.dto';
import { diskStorage } from 'multer';
import * as path from 'path';
import * as fs from 'fs';
import { Request } from 'express';
import { Auth } from 'src/module/auth/decorator/auth.decorator';

const storage = diskStorage({
  destination: (req, file, cb) => {
    const body = req.body;

    let path = './uploads';

    if (body.folder) {
      path += `/${body.folder}/`;
    }

    fs.access(path, (error) => {
      if (error) {
        if (error.code === 'ENOENT') {
          fs.mkdirSync(path);

          cb(null, path);
        }
      } else {
        cb(null, path);
      }
    });
  },
  filename: (req, file, cb) => {
    cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname));
  },
});

@ApiTags('Upload')
@Controller('uploads')
export class UploadController {
  @Post('file')
  @Auth()
  @ApiBearerAuth()
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        folder: { type: 'string' },
        file: {
          type: 'string',
          format: 'binary',
        },
      },
    },
  })
  @UseInterceptors(
    FileInterceptor('file', {
      storage,
    }),
  )
  async upload(
    @Body() body: UploadImageDto,
    @UploadedFile(
      new ParseFilePipe({
        validators: [
          new MaxFileSizeValidator({ maxSize: 5 * 1024 * 1024 }),
          new FileTypeValidator({ fileType: /(jpg|jpeg|png|gif|pdf|doc|docx)$/ }),
        ],
      }),
    )
    file: Express.Multer.File,
    @Req() req: Request,
  ) {
    return { path: file.path, url: req.protocol + '://' + req.get('Host') + '/' + file.path };
  }

  @Post('files')
  @Auth()
  @ApiBearerAuth()
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        folder: { type: 'string' },
        files: {
          type: 'string',
          format: 'binary',
        },
      },
    },
  })
  @UseInterceptors(
    FilesInterceptor('files', 5, {
      storage,
    }),
  )
  async uploads(
    @Body() body: UploadImageDto,
    @UploadedFiles(
      new ParseFilePipe({
        validators: [
          new MaxFileSizeValidator({ maxSize: 5 * 1024 * 1024 }),
          new FileTypeValidator({ fileType: /(jpg|jpeg|png|gif|pdf|doc|docx)$/ }),
        ],
      }),
    )
    files: Express.Multer.File[],
    @Req() req: Request,
  ) {
    return {
      paths: files.map((f) => f.path),
      urls: files.map((f) => req.protocol + '://' + req.get('Host') + '/' + f.path),
    };
  }
}
