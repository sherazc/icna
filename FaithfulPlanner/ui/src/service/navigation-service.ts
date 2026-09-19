import type { CompanyDto } from "./service-types";

export const prefixCompanySlugNameUrl = (companySlugName: CompanyDto, url: string): string => {
  if (companySlugName && companySlugName.id && companySlugName.slugName && companySlugName.slugName.length > 0) {
    return `/${companySlugName.slugName}${url}`
  } else {
    return url
  }
};