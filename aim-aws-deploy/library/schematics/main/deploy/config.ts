import { GlobFileUploadParamsList, Schema } from './schema';

export const getAccessKeyId = (): string => {
  return (
    (process.env['NG_DEPLOY_AWS_ACCESS_KEY_ID'] as string) ||
    (process.env['AWS_ACCESS_KEY_ID'] as string)
  );
};

export const getSecretAccessKey = (): string => {
  return (
    (process.env['NG_DEPLOY_AWS_SECRET_ACCESS_KEY'] as string) ||
    (process.env['AWS_SECRET_ACCESS_KEY'] as string)
  );
};

export const getSessionToken = (): string => {
  return (
    (process.env['NG_DEPLOY_AWS_SESSION_TOKEN'] as string) ||
    (process.env['AWS_SESSION_TOKEN'] as string)
  );
};

export const getBucket = (builderConfig: Schema): string => {
  return process.env['NG_DEPLOY_AWS_BUCKET'] || (builderConfig.bucket as string);
};

export const getRegion = (builderConfig: Schema): string | undefined => {
  return (
    process.env['NG_DEPLOY_AWS_REGION'] ||
    (builderConfig.region as string) ||
    process.env['AWS_DEFAULT_REGION']
  );
};

export const getSubFolder = (builderConfig: Schema): string => {
  return (
    process.env['NG_DEPLOY_AWS_SUB_FOLDER'] || (builderConfig.subFolder as string)
  );
};

export const getCfDistributionId = (): string | undefined => {
  return process.env['NG_DEPLOY_AWS_CF_DISTRIBUTION_ID'];
};

export const gets3ForcePathStyle = (): boolean => {
  return process.env['AWS_USE_PATH_STYLE_ENDPOINT'] === 'true';
};

export const getAwsEndpoint = (): string | undefined => {
  return process.env['AWS_ENDPOINT'];
};

const validateGlobFileUploadParamsList = (
  paramsList: GlobFileUploadParamsList
) => Array.isArray(paramsList) && !paramsList.some((params) => !params.glob);

export const getGlobFileUploadParamsList = (
  builderConfig: Schema
): GlobFileUploadParamsList => {
  let globFileUploadParamsList = [];
  try {
    globFileUploadParamsList = process.env['NG_DEPLOY_AWS_GLOB_FILE_UPLOAD_PARAMS_LIST']
      ? JSON.parse(process.env['NG_DEPLOY_AWS_GLOB_FILE_UPLOAD_PARAMS_LIST'])
      : builderConfig.globFileUploadParamsList || [];
  } catch (e) {
    console.error(
      'Invalid JSON for NG_DEPLOY_AWS_GLOB_FILE_UPLOAD_PARAMS_LIST',
      e
    );
  }

  return validateGlobFileUploadParamsList(globFileUploadParamsList)
    ? globFileUploadParamsList
    : [];
};
