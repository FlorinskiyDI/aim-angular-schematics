import { BuilderContext } from '@angular-devkit/architect';
import {
  S3Client,
  HeadBucketCommand,
  PutObjectCommand,
  ListObjectsV2Command,
  DeleteObjectsCommand,
  ObjectIdentifier,
} from '@aws-sdk/client-s3';
import * as mimeTypes from 'mime-types';
import * as fs from 'fs';
import * as path from 'path';
import minimatch from 'minimatch';
import {
  GlobFileUploadParams,
  GlobFileUploadParamsList,
  Schema,
} from './schema';
import {
  getAccessKeyId,
  getAwsEndpoint,
  getBucket,
  getGlobFileUploadParamsList,
  getRegion,
  gets3ForcePathStyle,
  getSecretAccessKey,
  getSessionToken,
  getSubFolder,
} from './config';

export class Uploader {
  private _context: BuilderContext;
  private _s3: S3Client;
  private _bucket: string;
  private _region: string | undefined;
  private _subFolder: string;
  private _builderConfig: Schema;
  private _globFileUploadParamsList: GlobFileUploadParamsList;

  constructor(context: BuilderContext, builderConfig: Schema) {
    this._context = context;
    this._builderConfig = builderConfig;
    this._bucket = getBucket(this._builderConfig);
    this._region = getRegion(this._builderConfig);
    this._subFolder = getSubFolder(this._builderConfig);
    this._globFileUploadParamsList = getGlobFileUploadParamsList(
      this._builderConfig
    );

    this._s3 = new S3Client({
      region: this._region,
      endpoint: getAwsEndpoint(),
      forcePathStyle: gets3ForcePathStyle() || false,
      credentials: {
        accessKeyId: getAccessKeyId(),
        secretAccessKey: getSecretAccessKey(),
        sessionToken: getSessionToken(),
      },
    });
  }

  async upload(files: string[], filesPath: string): Promise<boolean> {
    try {
      if (!this._region || !this._bucket) {
        this._context.logger.error(
          `❌  Missing configuration (need region, bucket)`
        );
        return false;
      }

      const params = { Bucket: this._bucket };

      try {
        await this._s3.send(new HeadBucketCommand(params));
        await this.uploadFiles(files, filesPath);
      } catch (error: any) {
        this._context.logger.error(
          `❌  Error during upload: ${error.message || error}`
        );
        throw error;
      }
    } catch {
      return false;
    }
    return true;
  }

  uploadFiles(files: string[], filesPath: string) {
    return Promise.all(
      files.map(async (file) => {
        await this.uploadFile(path.join(filesPath, file), file);
      })
    );
  }

  public async uploadFile(localFilePath: string, originFilePath: string) {
    const fileName = path.basename(localFilePath);
    const globFileUploadParamsForFile = this._globFileUploadParamsList.filter(
      (params: GlobFileUploadParams) => minimatch(originFilePath, params.glob)
    );

    const mergedParamsForFile = globFileUploadParamsForFile.reduce(
      (acc, { glob, ...params }) => ({
        ...acc,
        ...params,
      }),
      {}
    );

    const body = fs.createReadStream(localFilePath);
    body.on('error', function (err) {
      console.log('File Error', err);
    });

    const params = {
      Bucket: this._bucket,
      Key: this._subFolder
        ? `${this._subFolder}/${originFilePath}`
        : originFilePath,
      Body: body,
      ContentType: mimeTypes.lookup(fileName) || undefined,
      ...mergedParamsForFile,
    };

    try {
      const result = await this._s3.send(new PutObjectCommand(params));
      this._context.logger.info(
        `Uploaded file "${params.Key}" to bucket "${this._bucket}"`
      );
    } catch (error) {
      this._context.logger.error(`Error uploading file: ${error}`);
      throw error;
    }
  }

  public async deleteStaleFiles(localFiles: string[]) {
    const remoteFiles = await this.listObjectKeys();
    const staleFiles = this._subFolder
      ? localFiles.map((file) => `${this._subFolder}/${file}`)
      : localFiles;
    const filesToDelete = remoteFiles!.filter(
      (file: any) => !staleFiles.includes(file.Key)
    );

    return this.deleteFiles(filesToDelete);
  }

  public async deleteAllFiles() {
    const remoteFiles = await this.listObjectKeys();
    return this.deleteFiles(remoteFiles);
  }

  private async listObjectKeys() {
    const params = {
      Bucket: this._bucket,
      Prefix: this._subFolder,
    };

    try {
      const data = await this._s3.send(new ListObjectsV2Command(params));
      return data.Contents?.map((item) => ({ Key: item.Key })) || [];
    } catch (error) {
      this._context.logger.error(`Error listing files: ${error}`);
      return [];
    }
  }

  private async deleteFiles(objects: ObjectIdentifier[]) {
    if (!objects.length) {
      this._context.logger.info('⚠️  No files to delete');
      return true;
    }

    const params = {
      Bucket: this._bucket,
      Delete: {
        Objects: objects,
      },
    };

    try {
      await this._s3.send(new DeleteObjectsCommand(params));
      this._context.logger.info(`Deleted ${objects.length} files.`);
      return true;
    } catch (error) {
      this._context.logger.error(`Error deleting files: ${error}`);
      return false;
    }
  }
}