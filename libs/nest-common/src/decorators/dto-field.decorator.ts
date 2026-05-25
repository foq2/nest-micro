import { Type } from '@nestjs/common';
import _ from 'lodash';
import { ApiProperty } from '@nestjs/swagger';

type PropertyType = Type<unknown> | Function | Record<string, any> | 'file';

interface DtoPropertyOptions {
  type: PropertyType;
  structure?: 'array' | 'enum' | 'enumArray' | 'dto' | 'dtoArray';
  validated?: boolean;
  required?: boolean;
  example?: any;
  defaultValue?: any;
  description?: string;
  validateGroup?: string[];
}

/**
 * Specialized decorator for creating API Metadata (Swagger documentation).
 * It focuses solely on applying @ApiProperty with extended logic for enums, arrays, and file types.
 *
 * @param {DtoPropertyOptions} options - The property options containing Swagger-related metadata.
 * @returns {PropertyDecorator} The ApiProperty decorator.
 */
export function ApiPropertyExtended(
  options: DtoPropertyOptions,
): PropertyDecorator {
  if (options === undefined || _.isEmpty(options)) {
    return ApiProperty({ required: false });
  }
  const { structure, ...propertyOptions } = options;

  const isFile = propertyOptions.type === 'file';
  const type = isFile ? String : propertyOptions.type;
  const isEnum = ['enum', 'enumArray'].includes(structure);
}
