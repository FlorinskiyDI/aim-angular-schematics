import { BuilderContext } from '@angular-devkit/architect';
import {
  CloudFrontClient,
  CreateInvalidationCommand,
  CreateInvalidationCommandInput,
} from '@aws-sdk/client-cloudfront';
import { Schema } from './schema';
import {
  getAccessKeyId,
  getSecretAccessKey,
  getRegion,
  getSubFolder,
  getCfDistributionId,
} from './config';

export class CloudFront {
  private _builderConfig: Schema;
  private _context: BuilderContext;

  private _cloudFrontClient: CloudFrontClient;

  private _cfDistributionId: string | undefined;
  private _subFolder: string;
  private _region: string | undefined;

  constructor(context: BuilderContext, builderConfig: Schema) {
    this._context = context;
    this._builderConfig = builderConfig;

    // Initialize critical fields
    this._region = getRegion(this._builderConfig);
    this._cfDistributionId = getCfDistributionId();
    this._subFolder = getSubFolder(this._builderConfig);

    // Validate configuration
    this.validateConfiguration();

    // Configure AWS CloudFront Client
    this._cloudFrontClient = new CloudFrontClient({
      region: this._region,
      credentials: {
        accessKeyId: getAccessKeyId(),
        secretAccessKey: getSecretAccessKey(),
      },
    });
  }

  private validateConfiguration() {
    if (!this._region) {
      throw new Error(`Missing AWS region in configuration.`);
    }

    if (!this._cfDistributionId) {
      this._context.logger.warn(
        `⚠️  CloudFront Distribution ID is not defined. Invalidation will be skipped.`
      );
    }
  }

  /**
   * Triggers CloudFront cache invalidation for the configured distribution.
   * @returns Promise<boolean> - true if successful, false otherwise.
   */
  public async invalidate(): Promise<boolean> {
    if (!this._cfDistributionId) {
      this._context.logger.info(
        `⚠️  Skipping CloudFront invalidation as no distribution ID is configured.`
      );
      return true;
    }

    // Prepare invalidation parameters
    const cfPath = this._subFolder ? `/${this._subFolder}/*` : '/*';
    const callerReference = `aws-deploy-${Date.now()}`;

    const input: CreateInvalidationCommandInput = {
      DistributionId: this._cfDistributionId,
      InvalidationBatch: {
        CallerReference: callerReference,
        Paths: {
          Quantity: 1,
          Items: [cfPath],
        },
      },
    };

    this._context.logger.info(
      `🔄 Triggering CloudFront cache invalidation for path: '${cfPath}' on distribution ID: ${this._cfDistributionId}`
    );

    try {
      const command = new CreateInvalidationCommand(input);
      const result = await this._cloudFrontClient.send(command);

      this._context.logger.info(
        `✅ Successfully triggered CloudFront invalidation for '${cfPath}'. Status: '${result.Invalidation?.Status}'`
      );
      return true;
    } catch (error: any) {
      this._context.logger.error(
        `❌ Failed to trigger CloudFront invalidation for '${cfPath}'. Error: ${error.message}`
      );
      return false;
    }
  }
}